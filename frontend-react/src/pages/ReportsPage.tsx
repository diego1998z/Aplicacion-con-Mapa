import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  createReport,
  deleteReport,
  getReports,
  updateReport,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { ReportPayload, ReportRecord } from "../lib/api";
import type { FormEvent } from "react";

type ReportFormState = {
  type: string;
  status: string;
  description: string;
  lat: string;
  lng: string;
  district: string;
  region: string;
  userName: string;
  userEmail: string;
};

const EMPTY_FORM: ReportFormState = {
  type: "",
  status: "pendiente",
  description: "",
  lat: "",
  lng: "",
  district: "",
  region: "",
  userName: "",
  userEmail: "",
};

const TYPE_OPTIONS = [
  { value: "otro", label: "Otro" },
  { value: "senal", label: "Senal" },
  { value: "bache", label: "Bache" },
  { value: "mobiliario", label: "Mobiliario" },
  { value: "iluminacion", label: "Iluminacion" },
];

const STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en proceso", label: "En proceso" },
  { value: "atendido", label: "Atendido" },
  { value: "cerrado", label: "Cerrado" },
];

function toDisplayDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function mapReportToForm(report: ReportRecord): ReportFormState {
  return {
    type: report.type || "",
    status: report.status || "pendiente",
    description: report.description || "",
    lat: String(report.lat ?? ""),
    lng: String(report.lng ?? ""),
    district: report.district || "",
    region: report.region || "",
    userName: report.userName || "",
    userEmail: report.userEmail || "",
  };
}

function toPayload(form: ReportFormState): ReportPayload | null {
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const payload: ReportPayload = {
    type: form.type.trim(),
    status: form.status.trim() || "pendiente",
    description: form.description.trim() || undefined,
    lat,
    lng,
    district: form.district.trim() || undefined,
    region: form.region.trim() || undefined,
    userName: form.userName.trim() || undefined,
    userEmail: form.userEmail.trim() || undefined,
  };
  return payload;
}

function normalize(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

export function ReportsPage() {
  const { signOut } = useAuth();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReportFormState>(EMPTY_FORM);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReports({
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      });
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setReports(sorted);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los reportes.");
      }
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, signOut]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const visibleReports = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return reports;
    return reports.filter((item) => {
      return (
        normalize(item.type).includes(term) ||
        normalize(item.status).includes(term) ||
        normalize(item.district).includes(term) ||
        normalize(item.description).includes(term)
      );
    });
  }, [reports, query]);

  function clearForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(report: ReportRecord) {
    setEditingId(report.id);
    setForm(mapReportToForm(report));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.type.trim()) {
      setError("El tipo es obligatorio.");
      return;
    }
    const payload = toPayload(form);
    if (!payload) {
      setError("Latitud y longitud deben ser numericas.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await updateReport(editingId, payload);
      } else {
        await createReport(payload);
      }
      clearForm();
      await loadReports();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo guardar el reporte.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(report: ReportRecord) {
    const ok = window.confirm(`Eliminar reporte "${report.type}"?`);
    if (!ok) return;
    setSubmitting(true);
    setError("");
    try {
      await deleteReport(report.id);
      if (editingId === report.id) clearForm();
      await loadReports();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo eliminar el reporte.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel-soft px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="module-title text-[26px] sm:text-[30px]">Reportes</h2>
            <p className="module-sub">Gestion de reportes ciudadanos del backend.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="cta-ghost" onClick={loadReports} disabled={loading || submitting}>
              {loading ? "Actualizando..." : "Recargar"}
            </button>
            <button type="button" className="cta" onClick={clearForm} disabled={submitting}>
              Nuevo reporte
            </button>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">{editingId ? "Editar reporte" : "Crear reporte"}</h3>
          <p className="mt-1 text-sm text-ink/70">Gestion de reportes ciudadanos en el nuevo frontend.</p>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="field-label">Tipo</span>
              <select
                className="field-input"
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                required
              >
                <option value="">Selecciona tipo</option>
                {TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="field-label">Estado</span>
              <select
                className="field-input"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="field-label">Descripcion</span>
              <textarea
                className="field-input min-h-[90px]"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Detalle del reporte"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Lat</span>
                <input
                  className="field-input"
                  value={form.lat}
                  onChange={(event) => setForm((prev) => ({ ...prev, lat: event.target.value }))}
                  placeholder="-12.0464"
                  required
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Lng</span>
                <input
                  className="field-input"
                  value={form.lng}
                  onChange={(event) => setForm((prev) => ({ ...prev, lng: event.target.value }))}
                  placeholder="-77.0428"
                  required
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Distrito</span>
                <input
                  className="field-input"
                  value={form.district}
                  onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
                  placeholder="Lince"
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Region</span>
                <input
                  className="field-input"
                  value={form.region}
                  onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
                  placeholder="Lima Centro"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Usuario</span>
                <input
                  className="field-input"
                  value={form.userName}
                  onChange={(event) => setForm((prev) => ({ ...prev, userName: event.target.value }))}
                  placeholder="Juan Perez"
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Correo</span>
                <input
                  type="email"
                  className="field-input"
                  value={form.userEmail}
                  onChange={(event) => setForm((prev) => ({ ...prev, userEmail: event.target.value }))}
                  placeholder="juan@correo.com"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button className="cta flex-1" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear reporte"}
              </button>
              {editingId ? (
                <button type="button" className="cta-ghost" onClick={clearForm} disabled={submitting}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="panel-soft overflow-hidden">
          <div className="border-b border-[#e5e9f2] px-5 py-4">
            <div className="flex flex-wrap gap-3">
              <input
                className="field-input min-w-[220px] flex-1"
                placeholder="Buscar por tipo, estado o distrito..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                className="field-input w-[180px]"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                <option value="">Todos los tipos</option>
                {TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                className="field-input w-[180px]"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">Todos los estados</option>
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
                <tr>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Distrito</th>
                  <th className="px-5 py-3 font-medium">Coords</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.length ? (
                  visibleReports.map((report) => (
                    <tr key={report.id} className="table-row">
                      <td className="px-5 py-3 text-ink">
                        <div className="font-medium">{report.type}</div>
                        <div className="text-xs text-ink/60">{report.description || "-"}</div>
                      </td>
                      <td className="px-5 py-3 text-ink/75">{report.status || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{report.district || "-"}</td>
                      <td className="px-5 py-3 font-mono text-xs text-ink/70">
                        {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
                      </td>
                      <td className="px-5 py-3 text-ink/75">{toDisplayDate(report.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="cta-ghost cta-ghost-sm" onClick={() => startEdit(report)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-danger btn-danger-sm"
                            onClick={() => onDelete(report)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-4 text-ink/65" colSpan={6}>
                      {loading ? "Cargando reportes..." : "No hay reportes para mostrar."}
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


