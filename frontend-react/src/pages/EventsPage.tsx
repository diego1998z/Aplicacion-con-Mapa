import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, getReports } from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { ReportRecord } from "../lib/api";

type OrderBy = "antiguos" | "recientes";

function normalize(value: string | null | undefined): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toDisplayDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function rowEventId(item: ReportRecord): string {
  if (item.legacyId !== null && item.legacyId !== undefined) return String(item.legacyId);
  return item.id;
}

export function EventsPage() {
  const { signOut } = useAuth();
  const [events, setEvents] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("antiguos");
  const [photoModalUrl, setPhotoModalUrl] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const reports = await getReports();
      setEvents(reports);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["pendiente", "atendido"]);
    for (const item of events) {
      const value = String(item.status || "").trim();
      if (value) set.add(value);
    }
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    let data = [...events];

    const query = normalize(filterText);
    if (query) {
      data = data.filter((item) => {
        const hay =
          `${item.type || ""} ${item.description || ""} ${item.region || ""} ${item.district || ""} ${item.userName || ""} ${item.userEmail || ""} ${item.userDni || ""}`;
        return normalize(hay).includes(query);
      });
    }

    if (filterStatus) {
      data = data.filter((item) => normalize(item.status) === normalize(filterStatus));
    }

    data.sort((a, b) => {
      const fa = new Date(a.createdAt).getTime();
      const fb = new Date(b.createdAt).getTime();
      if (orderBy === "recientes") return fb - fa;
      return fa - fb;
    });
    return data;
  }, [events, filterText, filterStatus, orderBy]);

  const metrics = useMemo(() => {
    let pendiente = 0;
    let atendido = 0;
    for (const item of filteredEvents) {
      const status = normalize(item.status);
      if (status.includes("atendido") || status.includes("cerrado") || status.includes("resuelto")) {
        atendido += 1;
      } else {
        pendiente += 1;
      }
    }
    return { total: filteredEvents.length, pendiente, atendido };
  }, [filteredEvents]);

  function clearFilters() {
    setFilterText("");
    setFilterStatus("");
    setOrderBy("antiguos");
  }

  return (
    <div className="space-y-6">
      <div className="panel-soft px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="module-title text-[26px] sm:text-[30px]">Eventos</h2>
            <p className="module-sub">Gestion y seguimiento de eventos ciudadanos.</p>
          </div>
          <button type="button" className="cta-ghost" onClick={loadEvents} disabled={loading}>
            {loading ? "Actualizando..." : "Recargar"}
          </button>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="stat-card"><p className="stat-label">Eventos</p><p className="stat-value">{metrics.total}</p></article>
        <article className="stat-card stat-card--warn"><p className="stat-label">Pendientes</p><p className="stat-value">{metrics.pendiente}</p></article>
        <article className="stat-card stat-card--ok"><p className="stat-label">Atendidos</p><p className="stat-value">{metrics.atendido}</p></article>
      </div>

      <article className="panel-soft overflow-hidden">
        <div className="border-b border-[#e5e9f2] px-5 py-4">
          <div className="grid gap-3 md:grid-cols-[1.5fr,1fr,1fr,auto]">
            <input
              className="field-input"
              placeholder="Buscar aviso..."
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
            <select className="field-input" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="">Todos los estados</option>
              {statusOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select className="field-input" value={orderBy} onChange={(event) => setOrderBy(event.target.value as OrderBy)}>
              <option value="antiguos">Mas antiguos primero</option>
              <option value="recientes">Mas recientes primero</option>
            </select>
            <button type="button" className="cta-ghost" onClick={clearFilters}>Limpiar</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Region</th>
                <th className="px-5 py-3 font-medium">Distrito</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Descripcion</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Imagen</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length ? (
                filteredEvents.map((item) => (
                  <Fragment key={item.id}>
                    <tr className="table-row">
                      <td className="px-5 py-3 text-ink">{rowEventId(item)}</td>
                      <td className="px-5 py-3 text-ink/75">{item.region || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{item.district || "-"}</td>
                      <td className="px-5 py-3 text-ink">{item.type || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{item.description || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{item.status || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{toDisplayDate(item.createdAt)}</td>
                      <td className="px-5 py-3">
                        {item.photoUrl ? (
                          <button type="button" className="cta-ghost cta-ghost-sm" onClick={() => setPhotoModalUrl(String(item.photoUrl || ""))}>
                            Ver
                          </button>
                        ) : "-"}
                      </td>
                    </tr>
                    <tr className="table-row bg-[#fbfcfe]">
                      <td className="px-5 py-2 text-xs text-ink/70" colSpan={8}>
                        <div className="flex flex-wrap gap-4">
                          <span><strong>Usuario:</strong> {item.userId || "-"}</span>
                          <span><strong>Email:</strong> {item.userEmail || "-"}</span>
                          <span><strong>Nombre:</strong> {item.userName || "-"}</span>
                          <span><strong>DNI:</strong> {item.userDni || "-"}</span>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-4 text-ink/65" colSpan={8}>
                    {loading ? "Cargando eventos..." : "Sin avisos"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      {photoModalUrl ? (
        <div className="fixed inset-0 z-[1400] grid place-items-center bg-slate-900/60 px-4 py-4" onClick={() => setPhotoModalUrl("")}>
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[14px] border border-white/20 bg-black/80 p-2" onClick={(event) => event.stopPropagation()}>
            <img src={photoModalUrl} alt="Evidencia evento" className="max-h-[85vh] w-full object-contain" />
            <div className="mt-2 flex justify-end">
              <button type="button" className="cta-ghost cta-ghost-sm" onClick={() => setPhotoModalUrl("")}>Cerrar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
