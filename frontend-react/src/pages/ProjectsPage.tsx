import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ApiError,
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { ProjectPayload, ProjectRecord } from "../lib/api";
import type { FormEvent } from "react";

type ProjectFormState = {
  name: string;
  year: string;
  recordType: string;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: ProjectFormState = {
  name: "",
  year: "",
  recordType: "",
  startDate: "",
  endDate: "",
};

const RECORD_TYPE_OPTIONS = [
  { value: "", label: "Sin tipo" },
  { value: "senalizacion", label: "Senalizacion" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "obra", label: "Obra" },
];

function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function toDisplayDate(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function toPayload(form: ProjectFormState): ProjectPayload {
  const payload: ProjectPayload = {
    name: form.name.trim(),
  };

  if (form.year.trim()) {
    const parsed = Number(form.year);
    if (Number.isFinite(parsed)) payload.year = parsed;
  }
  if (form.recordType.trim()) payload.recordType = form.recordType.trim();
  if (form.startDate.trim()) payload.startDate = form.startDate.trim();
  if (form.endDate.trim()) payload.endDate = form.endDate.trim();

  return payload;
}

function mapProjectToForm(project: ProjectRecord): ProjectFormState {
  return {
    name: project.name || "",
    year: project.year !== null && project.year !== undefined ? String(project.year) : "",
    recordType: project.recordType || "",
    startDate: toInputDate(project.startDate),
    endDate: toInputDate(project.endDate),
  };
}

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { signOut } = useAuth();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormState>(EMPTY_FORM);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProjects(recordTypeFilter ? { recordType: recordTypeFilter } : {});
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setProjects(sorted);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los proyectos.");
      }
    } finally {
      setLoading(false);
    }
  }, [recordTypeFilter, signOut]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const visibleProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const district = String(item.district || "").toLowerCase();
      const type = String(item.recordType || "").toLowerCase();
      return name.includes(term) || district.includes(term) || type.includes(term);
    });
  }, [projects, query]);

  useEffect(() => {
    if (loading) return;

    const editId = searchParams.get("edit");
    if (editId) {
      const project = projects.find((item) => item.id === editId);
      if (project) {
        setEditingId(project.id);
        setForm(mapProjectToForm(project));
      } else {
        setError("No se encontro el proyecto solicitado para editar.");
      }
      setSearchParams({}, { replace: true });
      return;
    }

    if (searchParams.get("new") === "1") {
      setEditingId(null);
      setForm(EMPTY_FORM);
      setSearchParams({}, { replace: true });
    }
  }, [loading, projects, searchParams, setSearchParams]);

  function clearForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(project: ProjectRecord) {
    setEditingId(project.id);
    setForm(mapProjectToForm(project));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = toPayload(form);
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      clearForm();
      await loadProjects();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo guardar el proyecto.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(project: ProjectRecord) {
    const ok = window.confirm(`Eliminar proyecto "${project.name}"?`);
    if (!ok) return;

    setSubmitting(true);
    setError("");
    try {
      await deleteProject(project.id);
      if (editingId === project.id) clearForm();
      await loadProjects();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo eliminar el proyecto.");
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
            <h2 className="module-title text-[26px] sm:text-[30px]">Proyectos</h2>
            <p className="module-sub">Gestion de proyectos municipales y su calendario.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="cta-ghost" onClick={loadProjects} disabled={loading || submitting}>
              {loading ? "Actualizando..." : "Recargar"}
            </button>
            <button type="button" className="cta" onClick={clearForm} disabled={submitting}>
              Nuevo proyecto
            </button>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">{editingId ? "Editar proyecto" : "Crear proyecto"}</h3>
          <p className="mt-1 text-sm text-ink/70">Campos base del proyecto en el backend.</p>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="field-label">Nombre</span>
              <input
                className="field-input"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nombre del proyecto"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="field-label">Ano</span>
              <input
                type="number"
                min={2000}
                max={2100}
                className="field-input"
                value={form.year}
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                placeholder="2026"
              />
            </label>

            <label className="block space-y-2">
              <span className="field-label">Tipo</span>
              <select
                className="field-input"
                value={form.recordType}
                onChange={(event) => setForm((prev) => ({ ...prev, recordType: event.target.value }))}
              >
                {RECORD_TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Inicio</span>
                <input
                  type="date"
                  className="field-input"
                  value={form.startDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Fin</span>
                <input
                  type="date"
                  className="field-input"
                  value={form.endDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button className="cta flex-1" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear proyecto"}
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
                placeholder="Buscar por nombre, distrito o tipo..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                className="field-input w-[210px]"
                value={recordTypeFilter}
                onChange={(event) => setRecordTypeFilter(event.target.value)}
              >
                <option value="">Todos los tipos</option>
                {RECORD_TYPE_OPTIONS.filter((item) => item.value).map((item) => (
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
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Distrito</th>
                  <th className="px-5 py-3 font-medium">Fechas</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleProjects.length ? (
                  visibleProjects.map((project) => (
                    <tr key={project.id} className="table-row">
                      <td className="px-5 py-3 text-ink">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-ink/60">{project.year || "-"}</div>
                      </td>
                      <td className="px-5 py-3 text-ink/75">{project.recordType || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{project.district || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">
                        {toDisplayDate(project.startDate)} - {toDisplayDate(project.endDate)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="cta-ghost cta-ghost-sm" onClick={() => startEdit(project)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-danger btn-danger-sm"
                            onClick={() => onDelete(project)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-4 text-ink/65" colSpan={5}>
                      {loading ? "Cargando proyectos..." : "No hay proyectos para mostrar."}
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


