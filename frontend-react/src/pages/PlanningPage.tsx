import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  createIntervention,
  createPlan,
  deleteIntervention,
  deletePlan,
  getBudgets,
  getInterventions,
  getPlans,
  updateIntervention,
  updatePlan,
  upsertBudget,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { FormEvent } from "react";
import type { InterventionPayload, InterventionRecord, PlanPayload, PlanRecord } from "../lib/api";

type BudgetForm = { ownerKey: string; year: string; total: string };
type PlanForm = { ownerKey: string; name: string; year: string; amount: string; status: string };
type InterventionForm = { planId: string; name: string; amount: string; phase: string };

const PLAN_STATUSES = ["planificacion", "ejecucion", "ejecutado"];
const INTERVENTION_PHASES = ["planificacion", "ejecucion", "ejecutado"];

function normalizeKey(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function money(value: number): string {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { maximumFractionDigits: 2 })}`;
}

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function PlanningPage() {
  const { user, signOut } = useAuth();
  const ownerKeyDefault = useMemo(() => {
    if (user?.role === "municipal" && user?.district) return normalizeKey(user.district);
    return normalizeKey(user?.email || "");
  }, [user?.district, user?.email, user?.role]);

  const [ownerKeyFilter, setOwnerKeyFilter] = useState(ownerKeyDefault);
  const [budgets, setBudgets] = useState<{ id: string; year: number; total: number; ownerKey: string }[]>([]);
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingInterventionId, setEditingInterventionId] = useState<string | null>(null);

  const [budgetForm, setBudgetForm] = useState<BudgetForm>({ ownerKey: ownerKeyDefault, year: String(new Date().getFullYear()), total: "" });
  const [planForm, setPlanForm] = useState<PlanForm>({ ownerKey: ownerKeyDefault, name: "", year: String(new Date().getFullYear()), amount: "", status: "planificacion" });
  const [interventionForm, setInterventionForm] = useState<InterventionForm>({ planId: "", name: "", amount: "0", phase: "planificacion" });

  useEffect(() => {
    setOwnerKeyFilter(ownerKeyDefault);
    setBudgetForm((prev) => ({ ...prev, ownerKey: ownerKeyDefault || prev.ownerKey }));
    setPlanForm((prev) => ({ ...prev, ownerKey: ownerKeyDefault || prev.ownerKey }));
  }, [ownerKeyDefault]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = ownerKeyFilter.trim() ? { ownerKey: ownerKeyFilter.trim() } : {};
    try {
      const [plansData, budgetsData, interventionsData] = await Promise.all([
        getPlans(query),
        getBudgets(query),
        getInterventions(query),
      ]);
      setPlans(plansData);
      setBudgets(budgetsData);
      setInterventions(interventionsData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo cargar planificacion.");
    } finally {
      setLoading(false);
    }
  }, [ownerKeyFilter, signOut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const budgetTotal = useMemo(() => budgets.reduce((sum, b) => sum + Number(b.total || 0), 0), [budgets]);
  const plansTotal = useMemo(() => plans.reduce((sum, p) => sum + Number(p.amount || 0), 0), [plans]);
  const planMap = useMemo(() => new Map(plans.map((plan) => [plan.id, plan.name])), [plans]);

  function clearPlanForm() {
    setEditingPlanId(null);
    setPlanForm({ ownerKey: ownerKeyFilter || ownerKeyDefault, name: "", year: String(new Date().getFullYear()), amount: "", status: "planificacion" });
  }

  function clearInterventionForm() {
    setEditingInterventionId(null);
    setInterventionForm({ planId: "", name: "", amount: "0", phase: "planificacion" });
  }

  async function onSaveBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const year = parseNumber(budgetForm.year);
    const total = parseNumber(budgetForm.total);
    if (year === null || total === null) return setError("Presupuesto: anio y total deben ser numericos.");
    setSubmitting(true);
    setError("");
    setInfo("");
    try {
      await upsertBudget({ ownerKey: budgetForm.ownerKey.trim() || undefined, year, total });
      setInfo("Presupuesto guardado.");
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo guardar presupuesto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSavePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const year = parseNumber(planForm.year);
    const amount = parseNumber(planForm.amount);
    if (!planForm.name.trim() || year === null || amount === null) return setError("Plan: completa nombre/anio/monto.");
    const existing = editingPlanId ? plans.find((p) => p.id === editingPlanId) || null : null;
    const payload: PlanPayload = {
      ownerKey: planForm.ownerKey.trim() || undefined,
      name: planForm.name.trim(),
      year,
      amount,
      status: planForm.status,
      executed: existing ? Number(existing.executed || 0) : 0,
      projects: existing ? existing.projects.map((p) => ({
        projectLegacyId: p.projectLegacyId || undefined,
        name: p.name,
        status: p.status,
        assignedAmount: Number(p.assignedAmount || 0),
        executedAmount: Number(p.executedAmount || 0),
      })) : [],
    };
    setSubmitting(true);
    setError("");
    setInfo("");
    try {
      const response = editingPlanId ? await updatePlan(editingPlanId, payload) : await createPlan(payload);
      setInfo(typeof response.available === "number" ? `Plan guardado. Disponible: ${money(response.available)}` : "Plan guardado.");
      clearPlanForm();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo guardar plan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDeletePlan(plan: PlanRecord) {
    if (!window.confirm(`Eliminar plan "${plan.name}"?`)) return;
    setSubmitting(true);
    setError("");
    try {
      await deletePlan(plan.id);
      if (editingPlanId === plan.id) clearPlanForm();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar plan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSaveIntervention(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseNumber(interventionForm.amount);
    if (!interventionForm.planId || amount === null) return setError("Intervencion: completa plan y monto.");
    const payload: InterventionPayload = {
      planId: interventionForm.planId,
      name: interventionForm.name.trim() || undefined,
      amount,
      phase: interventionForm.phase,
    };
    setSubmitting(true);
    setError("");
    try {
      if (editingInterventionId) {
        await updateIntervention(editingInterventionId, payload);
      } else {
        await createIntervention(payload);
      }
      clearInterventionForm();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo guardar intervencion.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDeleteIntervention(item: InterventionRecord) {
    if (!window.confirm(`Eliminar intervencion "${item.name}"?`)) return;
    setSubmitting(true);
    setError("");
    try {
      await deleteIntervention(item.id);
      if (editingInterventionId === item.id) clearInterventionForm();
      await loadData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return signOut();
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar intervencion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel-soft px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="module-title text-[26px] sm:text-[30px]">Planificacion</h2>
            <p className="module-sub">Presupuestos, planes e intervenciones por ownerKey.</p>
          </div>
          <div className="flex gap-2">
            <input className="field-input w-[220px]" value={ownerKeyFilter} onChange={(e) => setOwnerKeyFilter(e.target.value)} placeholder="ownerKey" />
            <button type="button" className="cta-ghost" onClick={loadData}>{loading ? "Actualizando..." : "Recargar"}</button>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="stat-card"><p className="stat-label">Presupuesto</p><p className="stat-value text-2xl">{money(budgetTotal)}</p></article>
        <article className="stat-card"><p className="stat-label">Planes</p><p className="stat-value text-2xl">{plans.length}</p></article>
        <article className="stat-card"><p className="stat-label">Monto planes</p><p className="stat-value text-2xl">{money(plansTotal)}</p></article>
        <article className="stat-card"><p className="stat-label">Intervenciones</p><p className="stat-value text-2xl">{interventions.length}</p></article>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <form className="panel-soft space-y-3 px-5 py-5" onSubmit={onSaveBudget}>
          <h3 className="font-semibold text-ink">Presupuesto</h3>
          <input className="field-input" value={budgetForm.ownerKey} onChange={(e) => setBudgetForm((p) => ({ ...p, ownerKey: e.target.value }))} placeholder="ownerKey" />
          <input className="field-input" value={budgetForm.year} onChange={(e) => setBudgetForm((p) => ({ ...p, year: e.target.value }))} placeholder="anio" />
          <input className="field-input" value={budgetForm.total} onChange={(e) => setBudgetForm((p) => ({ ...p, total: e.target.value }))} placeholder="total" />
          <button className="cta w-full" disabled={submitting}>{submitting ? "Guardando..." : "Guardar presupuesto"}</button>
        </form>

        <form className="panel-soft space-y-3 px-5 py-5" onSubmit={onSavePlan}>
          <h3 className="font-semibold text-ink">{editingPlanId ? "Editar plan" : "Nuevo plan"}</h3>
          <input className="field-input" value={planForm.ownerKey} onChange={(e) => setPlanForm((p) => ({ ...p, ownerKey: e.target.value }))} placeholder="ownerKey" />
          <input className="field-input" value={planForm.name} onChange={(e) => setPlanForm((p) => ({ ...p, name: e.target.value }))} placeholder="nombre" />
          <div className="grid grid-cols-2 gap-2">
            <input className="field-input" value={planForm.year} onChange={(e) => setPlanForm((p) => ({ ...p, year: e.target.value }))} placeholder="anio" />
            <input className="field-input" value={planForm.amount} onChange={(e) => setPlanForm((p) => ({ ...p, amount: e.target.value }))} placeholder="monto" />
          </div>
          <select className="field-input" value={planForm.status} onChange={(e) => setPlanForm((p) => ({ ...p, status: e.target.value }))}>
            {PLAN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="cta flex-1" disabled={submitting}>{submitting ? "Guardando..." : "Guardar plan"}</button>
            {editingPlanId ? <button type="button" className="cta-ghost" onClick={clearPlanForm}>Cancelar</button> : null}
          </div>
        </form>

        <form className="panel-soft space-y-3 px-5 py-5" onSubmit={onSaveIntervention}>
          <h3 className="font-semibold text-ink">{editingInterventionId ? "Editar intervencion" : "Nueva intervencion"}</h3>
          <select className="field-input" value={interventionForm.planId} onChange={(e) => setInterventionForm((p) => ({ ...p, planId: e.target.value }))}>
            <option value="">Selecciona plan</option>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input className="field-input" value={interventionForm.name} onChange={(e) => setInterventionForm((p) => ({ ...p, name: e.target.value }))} placeholder="nombre" />
          <div className="grid grid-cols-2 gap-2">
            <input className="field-input" value={interventionForm.amount} onChange={(e) => setInterventionForm((p) => ({ ...p, amount: e.target.value }))} placeholder="monto" />
            <select className="field-input" value={interventionForm.phase} onChange={(e) => setInterventionForm((p) => ({ ...p, phase: e.target.value }))}>
              {INTERVENTION_PHASES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="cta flex-1" disabled={submitting}>{submitting ? "Guardando..." : "Guardar intervencion"}</button>
            {editingInterventionId ? <button type="button" className="cta-ghost" onClick={clearInterventionForm}>Cancelar</button> : null}
          </div>
        </form>
      </div>

      <article className="panel-soft overflow-hidden">
        <div className="border-b border-[#e5e9f2] px-5 py-3"><h3 className="font-semibold text-ink">Planes</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
              <tr><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Owner</th><th className="px-4 py-2">Ano</th><th className="px-4 py-2">Monto</th><th className="px-4 py-2">Estado</th><th className="px-4 py-2">Acciones</th></tr>
            </thead>
            <tbody>
              {plans.length ? plans.map((plan) => (
                <tr key={plan.id} className="table-row">
                  <td className="px-4 py-2">{plan.name}</td><td className="px-4 py-2">{plan.ownerKey}</td><td className="px-4 py-2">{plan.year}</td><td className="px-4 py-2">{money(plan.amount)}</td><td className="px-4 py-2">{plan.status}</td>
                  <td className="px-4 py-2"><div className="flex gap-2"><button type="button" className="cta-ghost cta-ghost-sm" onClick={() => { setEditingPlanId(plan.id); setPlanForm({ ownerKey: plan.ownerKey, name: plan.name, year: String(plan.year), amount: String(plan.amount), status: plan.status }); }}>Editar</button><button type="button" className="btn-danger btn-danger-sm" onClick={() => onDeletePlan(plan)}>Eliminar</button></div></td>
                </tr>
              )) : <tr><td className="px-4 py-3 text-ink/60" colSpan={6}>{loading ? "Cargando..." : "Sin planes."}</td></tr>}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel-soft overflow-hidden">
        <div className="border-b border-[#e5e9f2] px-5 py-3"><h3 className="font-semibold text-ink">Intervenciones</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
              <tr><th className="px-4 py-2">Plan</th><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Fase</th><th className="px-4 py-2">Monto</th><th className="px-4 py-2">Acciones</th></tr>
            </thead>
            <tbody>
              {interventions.length ? interventions.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="px-4 py-2">{planMap.get(item.planId) || "-"}</td><td className="px-4 py-2">{item.name}</td><td className="px-4 py-2">{item.phase}</td><td className="px-4 py-2">{money(item.amount)}</td>
                  <td className="px-4 py-2"><div className="flex gap-2"><button type="button" className="cta-ghost cta-ghost-sm" onClick={() => { setEditingInterventionId(item.id); setInterventionForm({ planId: item.planId, name: item.name || "", amount: String(item.amount || 0), phase: item.phase || "planificacion" }); }}>Editar</button><button type="button" className="btn-danger btn-danger-sm" onClick={() => onDeleteIntervention(item)}>Eliminar</button></div></td>
                </tr>
              )) : <tr><td className="px-4 py-3 text-ink/60" colSpan={5}>{loading ? "Cargando..." : "Sin intervenciones."}</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}


