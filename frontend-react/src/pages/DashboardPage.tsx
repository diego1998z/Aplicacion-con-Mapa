import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, getAssets, getProjects, getReports } from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { AssetRecord, ProjectRecord, ReportRecord } from "../lib/api";

type DashboardState = {
  projects: ProjectRecord[];
  assets: AssetRecord[];
  reports: ReportRecord[];
};

const INITIAL_STATE: DashboardState = {
  projects: [],
  assets: [],
  reports: [],
};

function formatDate(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function byCreatedAtDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function normalizeStatus(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value: string | null | undefined): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function money(value: number): string {
  return `S/ ${Number(value || 0).toLocaleString("es-PE", { maximumFractionDigits: 2 })}`;
}

function classifyAssetState(asset: AssetRecord): "opt" | "mid" | "crit" {
  const raw = `${asset.state || ""} ${asset.statePhysical || ""}`.toLowerCase();
  if (/(inoper|deterior|crit|malo|no oper|colaps)/.test(raw)) return "crit";
  if (/(regular|vencer|medio|observ)/.test(raw)) return "mid";
  return "opt";
}

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [projects, assets, reports] = await Promise.all([getProjects(), getAssets(), getReports()]);
      setState({ projects, assets, reports });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo cargar el dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const pendingReports = state.reports.filter((item) => normalizeStatus(item.status).includes("pendiente")).length;
    const closedReports = state.reports.filter((item) => {
      const status = normalizeStatus(item.status);
      return status.includes("atendido") || status.includes("resuelto") || status.includes("cerrado");
    }).length;
    return {
      projects: state.projects.length,
      assets: state.assets.length,
      reports: state.reports.length,
      pendingReports,
      closedReports,
    };
  }, [state]);

  const recentProjects = useMemo(() => byCreatedAtDesc(state.projects).slice(0, 6), [state.projects]);
  const recentReports = useMemo(() => byCreatedAtDesc(state.reports).slice(0, 6), [state.reports]);
  const districtLabel = useMemo(() => {
    if (user?.district) return user.district;
    const firstProjectDistrict = state.projects.find((item) => item.district)?.district;
    if (firstProjectDistrict) return firstProjectDistrict;
    return "Lima";
  }, [state.projects, user?.district]);

  const municipalityName = useMemo(() => {
    if (districtLabel) return `Municipalidad de ${districtLabel}`;
    return "Municipalidad";
  }, [districtLabel]);

  const score = useMemo(() => {
    const total = metrics.assets + metrics.reports;
    if (!total) return 0;
    const closedWeight = metrics.closedReports;
    const activeWeight = Math.max(metrics.assets - metrics.pendingReports, 0);
    const value = Math.round(((closedWeight + activeWeight) / total) * 100);
    return Math.min(100, Math.max(0, value));
  }, [metrics.assets, metrics.closedReports, metrics.pendingReports, metrics.reports]);

  const scoreLabel = useMemo(() => {
    if (score >= 80) return "Optimo";
    if (score >= 60) return "Operativo";
    if (score >= 40) return "Regular";
    return "Critico";
  }, [score]);

  const reportDistribution = useMemo(() => {
    if (!metrics.reports) {
      return { pending: 0, closed: 0, other: 0 };
    }
    const pending = Math.round((metrics.pendingReports * 100) / metrics.reports);
    const closed = Math.round((metrics.closedReports * 100) / metrics.reports);
    const other = Math.max(0, 100 - pending - closed);
    return { pending, closed, other };
  }, [metrics.closedReports, metrics.pendingReports, metrics.reports]);

  const assetStateBreakdown = useMemo(() => {
    const result = { opt: 0, mid: 0, crit: 0 };
    for (const asset of state.assets) {
      result[classifyAssetState(asset)] += 1;
    }
    return result;
  }, [state.assets]);

  const stateSegments = useMemo(() => {
    const total = assetStateBreakdown.opt + assetStateBreakdown.mid + assetStateBreakdown.crit;
    if (!total) return { opt: 0, mid: 0, crit: 0 };
    const opt = Math.round((assetStateBreakdown.opt * 100) / total);
    const mid = Math.round((assetStateBreakdown.mid * 100) / total);
    const crit = Math.max(0, 100 - opt - mid);
    return { opt, mid, crit };
  }, [assetStateBreakdown]);

  const alertMetrics = useMemo(() => {
    const deterioradas = assetStateBreakdown.crit;
    const ausentes = state.reports.filter((item) => {
      const text = `${normalizeText(item.type)} ${normalizeText(item.description)}`;
      return /(falta|ausen|sin senal|sin se\u00f1al|no hay)/.test(text);
    }).length;
    return { deterioradas, ausentes };
  }, [assetStateBreakdown.crit, state.reports]);

  const investmentMetrics = useMemo(() => {
    const ejecutada = state.assets.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const costoCritico = state.assets
      .filter((item) => classifyAssetState(item) === "crit")
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
    const costoIntermedio = state.assets
      .filter((item) => classifyAssetState(item) === "mid")
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
    const planificada = ejecutada + costoCritico + costoIntermedio * 0.5;
    return { ejecutada, planificada };
  }, [state.assets]);

  const attentionMetrics = useMemo(() => {
    let falta = 0;
    let danada = 0;
    let obstruida = 0;
    for (const item of state.reports) {
      const text = `${normalizeText(item.type)} ${normalizeText(item.description)}`;
      if (/(falta|ausen|sin senal|sin se\u00f1al|no hay)/.test(text)) {
        falta += 1;
      } else if (/(danad|deterior|rota|roto|quebrad|desgast)/.test(text)) {
        danada += 1;
      } else if (/(obstru|tapad|bloque)/.test(text)) {
        obstruida += 1;
      }
    }
    const otro = Math.max(0, state.reports.length - falta - danada - obstruida);
    return { falta, danada, obstruida, otro };
  }, [state.reports]);

  return (
    <div className="space-y-6">
      <div className="panel-soft px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="module-title text-[26px] sm:text-[30px]">Hola, {user?.name || user?.email}</h2>
            <p className="module-sub">
              Rol activo: <span className="font-semibold">{user?.role || "user"}</span>
            </p>
          </div>
          <button type="button" className="cta-ghost" onClick={loadDashboard} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar datos"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <article className="panel-soft px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="h-[120px] w-full overflow-hidden rounded-[14px] border border-[#e5e9f2] bg-slate-100 sm:w-[190px] sm:min-w-[190px]">
              <img src="/muni-lima.webp" alt="Municipalidad" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-extrabold text-ink">{municipalityName}</div>
              <div className="text-xs font-semibold text-[#6b778c]">{districtLabel} - Peru</div>
              <div className="mt-3 grid gap-1 text-sm">
                <div className="text-[#334155]">Proyectos activos: <strong className="font-extrabold text-ink">{metrics.projects}</strong></div>
                <div className="text-[#334155]">Activos registrados: <strong className="font-extrabold text-ink">{metrics.assets}</strong></div>
                <div className="text-[#334155]">Reportes ciudadanos: <strong className="font-extrabold text-ink">{metrics.reports}</strong></div>
              </div>
            </div>
          </div>
        </article>

        <article className="panel-soft bg-gradient-to-br from-emerald-50 to-white px-5 py-5">
          <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#6b778c]">Indice de Estado Vial</div>
          <div className="mt-1 text-[52px] font-black leading-none text-[#2fa84f]">{score}</div>
          <div className="text-sm font-extrabold text-[#1b8f3b]">{scoreLabel}</div>
          <div className="mt-1 text-xs text-[#6b778c]">Resumen de infraestructura y atencion de reportes.</div>
        </article>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="stat-card">
          <p className="stat-label">Proyectos</p>
          <p className="stat-value">{metrics.projects}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Activos</p>
          <p className="stat-value">{metrics.assets}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Reportes</p>
          <p className="stat-value">{metrics.reports}</p>
        </article>
        <article className="stat-card stat-card--warn">
          <p className="stat-label">Pendientes</p>
          <p className="stat-value">{metrics.pendingReports}</p>
        </article>
        <article className="stat-card stat-card--ok">
          <p className="stat-label">Cerrados</p>
          <p className="stat-value">{metrics.closedReports}</p>
        </article>
      </div>

      <article className="panel-soft px-5 py-4">
        <div className="text-sm font-extrabold text-ink">Estado de la infraestructura vial</div>
        <div className="mt-3 overflow-hidden rounded-[12px] border border-[#e5e9f2] bg-[#edf1f5]">
          <div className="flex h-11 w-full text-[11px] font-extrabold text-white">
            <div className="flex items-center justify-center bg-[#2fa84f]" style={{ width: `${stateSegments.opt}%` }}>
              {stateSegments.opt ? `${stateSegments.opt}% optimo` : ""}
            </div>
            <div className="flex items-center justify-center bg-[#f3b52f]" style={{ width: `${stateSegments.mid}%` }}>
              {stateSegments.mid ? `${stateSegments.mid}% regular` : ""}
            </div>
            <div className="flex items-center justify-center bg-[#e05757]" style={{ width: `${stateSegments.crit}%` }}>
              {stateSegments.crit ? `${stateSegments.crit}% critico` : ""}
            </div>
          </div>
        </div>
      </article>

      <article className="panel-soft px-5 py-4">
        <div className="text-sm font-extrabold text-ink">Estado de reportes ciudadanos</div>
        <div className="mt-3 overflow-hidden rounded-full bg-[#edf2f7]">
          <div className="flex h-8 w-full text-[11px] font-extrabold text-white">
            <div className="flex items-center justify-center bg-[#2fa84f]" style={{ width: `${reportDistribution.closed}%` }}>
              {reportDistribution.closed ? `${reportDistribution.closed}% cerrados` : ""}
            </div>
            <div className="flex items-center justify-center bg-[#d93f3f]" style={{ width: `${reportDistribution.pending}%` }}>
              {reportDistribution.pending ? `${reportDistribution.pending}% pendientes` : ""}
            </div>
            <div className="flex items-center justify-center bg-[#3f7ed9]" style={{ width: `${reportDistribution.other}%` }}>
              {reportDistribution.other ? `${reportDistribution.other}% en proceso` : ""}
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.1fr,1.2fr]">
        <article className="panel-soft px-5 py-5">
          <div className="text-sm font-extrabold text-ink">Alertas criticas</div>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-ink">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f3b52f]" />
              <strong>{alertMetrics.deterioradas}</strong> activos en estado critico
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e05757]" />
              <strong>{alertMetrics.ausentes}</strong> reportes de senal faltante
            </li>
          </ul>
        </article>

        <div className="grid gap-4">
          <article className="panel-soft px-5 py-5">
            <div className="text-sm font-extrabold text-ink">Inversion en infraestructura vial</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-[12px] bg-[#f6f8fb] px-3 py-2 text-sm font-semibold text-[#6a7a85]">
                Ejecutada
                <div className="text-base font-extrabold text-ink">{money(investmentMetrics.ejecutada)}</div>
              </div>
              <div className="rounded-[12px] bg-[#f6f8fb] px-3 py-2 text-sm font-semibold text-[#6a7a85]">
                Planificada
                <div className="text-base font-extrabold text-ink">{money(investmentMetrics.planificada)}</div>
              </div>
            </div>
          </article>

          <article className="panel-soft px-5 py-5">
            <div className="text-sm font-extrabold text-ink">Requiere atencion</div>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-ink">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#e05757]" /><strong>{attentionMetrics.falta}</strong> falta senal</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#f3b52f]" /><strong>{attentionMetrics.danada}</strong> senal danada</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#4c8be7]" /><strong>{attentionMetrics.obstruida}</strong> obstruida</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" /><strong>{attentionMetrics.otro}</strong> otros</li>
            </ul>
          </article>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="panel-soft overflow-hidden">
          <div className="border-b border-[#e5e9f2] px-5 py-4">
            <h3 className="text-lg font-semibold text-ink">Ultimos proyectos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
                <tr>
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Distrito</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.length ? (
                  recentProjects.map((project) => (
                    <tr key={project.id} className="table-row">
                      <td className="px-5 py-3 text-ink">{project.name}</td>
                      <td className="px-5 py-3 text-ink/75">{project.district || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{formatDate(project.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-4 text-ink/65" colSpan={3}>
                      {loading ? "Cargando proyectos..." : "No hay proyectos registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel-soft overflow-hidden">
          <div className="border-b border-[#e5e9f2] px-5 py-4">
            <h3 className="text-lg font-semibold text-ink">Ultimos reportes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
                <tr>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.length ? (
                  recentReports.map((report) => (
                    <tr key={report.id} className="table-row">
                      <td className="px-5 py-3 text-ink">{report.type}</td>
                      <td className="px-5 py-3 text-ink/75">{report.status || "pendiente"}</td>
                      <td className="px-5 py-3 text-ink/75">{formatDate(report.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-4 text-ink/65" colSpan={3}>
                      {loading ? "Cargando reportes..." : "No hay reportes registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  );
}
