import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  createAsset,
  deleteAsset,
  getAssets,
  getProjects,
  updateAsset,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { AssetPayload, AssetRecord, ProjectRecord } from "../lib/api";
import type { FormEvent } from "react";
import { InvestmentAssistant } from "../features/investment/InvestmentAssistant";
import { useInvestmentAssistant } from "../features/investment/useInvestmentAssistant";

type AssetFormState = {
  projectId: string;
  type: string;
  name: string;
  category: string;
  icon: string;
  state: string;
  statePhysical: string;
  lat: string;
  lng: string;
  district: string;
  region: string;
  price: string;
  installedAt: string;
  width: string;
  length: string;
  areaM2: string;
  photoUrl: string;
};

const EMPTY_FORM: AssetFormState = {
  projectId: "",
  type: "",
  name: "",
  category: "",
  icon: "",
  state: "",
  statePhysical: "",
  lat: "",
  lng: "",
  district: "",
  region: "",
  price: "",
  installedAt: "",
  width: "",
  length: "",
  areaM2: "",
  photoUrl: "",
};

const TYPE_OPTIONS = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "mobiliario", label: "Mobiliario" },
];

const STATE_OPTIONS = [
  { value: "", label: "Sin estado" },
  { value: "nuevo", label: "Nuevo" },
  { value: "regular", label: "Regular" },
  { value: "deteriorado", label: "Deteriorado" },
  { value: "inoperativo", label: "Inoperativo" },
];

function optionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function toPayload(form: AssetFormState): AssetPayload | null {
  if (!form.type.trim()) return null;
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const payload: AssetPayload = {
    projectId: form.projectId.trim() || undefined,
    type: form.type.trim(),
    name: form.name.trim() || undefined,
    category: form.category.trim() || undefined,
    icon: form.icon.trim() || undefined,
    state: form.state.trim() || undefined,
    statePhysical: form.statePhysical.trim() || undefined,
    lat,
    lng,
    district: form.district.trim() || undefined,
    region: form.region.trim() || undefined,
    price: optionalNumber(form.price),
    installedAt: form.installedAt.trim() || undefined,
    width: optionalNumber(form.width),
    length: optionalNumber(form.length),
    areaM2: optionalNumber(form.areaM2),
    photoUrl: form.photoUrl.trim() || undefined,
  };
  return payload;
}

function mapAssetToForm(asset: AssetRecord): AssetFormState {
  return {
    projectId: asset.projectId || "",
    type: asset.type || "",
    name: asset.name || "",
    category: asset.category || "",
    icon: asset.icon || "",
    state: asset.state || "",
    statePhysical: asset.statePhysical || "",
    lat: String(asset.lat ?? ""),
    lng: String(asset.lng ?? ""),
    district: asset.district || "",
    region: asset.region || "",
    price: asset.price !== null && asset.price !== undefined ? String(asset.price) : "",
    installedAt: asset.installedAt ? asset.installedAt.slice(0, 10) : "",
    width: asset.width !== null && asset.width !== undefined ? String(asset.width) : "",
    length: asset.length !== null && asset.length !== undefined ? String(asset.length) : "",
    areaM2: asset.areaM2 !== null && asset.areaM2 !== undefined ? String(asset.areaM2) : "",
    photoUrl: asset.photoUrl || "",
  };
}

function normalize(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeFolded(value: string | null | undefined): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function money(value: number): string {
  return `S/ ${Math.round(Number(value || 0)).toLocaleString("es-PE")}`;
}

type AssetCondition = "operatives" | "deteriorated" | "replacement";

function classifyAssetCondition(asset: AssetRecord): AssetCondition {
  const source = `${normalizeFolded(asset.state)} ${normalizeFolded(asset.statePhysical)}`;
  if (/(inoper|no oper|sin senal|ausent|falta|repos)/.test(source)) return "replacement";
  if (/(deterior|danad|malo|critic|antigu|venc)/.test(source)) return "deteriorated";
  return "operatives";
}

function normalizeType(type: string | null | undefined): "vertical" | "horizontal" | "mobiliario" | "otro" {
  const key = normalizeFolded(type);
  if (key.includes("vertical")) return "vertical";
  if (key.includes("horizontal")) return "horizontal";
  if (key.includes("mobiliario")) return "mobiliario";
  return "otro";
}

function coordsLabel(asset: AssetRecord): string {
  if (!Number.isFinite(asset.lat) || !Number.isFinite(asset.lng)) return "-";
  return `${asset.lat.toFixed(5)}, ${asset.lng.toFixed(5)}`;
}

export function AssetsPage() {
  const { signOut } = useAuth();
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AssetFormState>(EMPTY_FORM);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAssets(typeFilter ? { type: typeFilter } : {});
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setAssets(sorted);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los activos.");
      }
    } finally {
      setLoading(false);
    }
  }, [typeFilter, signOut]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
      setProjects(sorted);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
      }
    }
  }, [signOut]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const visibleAssets = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((item) => {
      return (
        normalize(item.name).includes(term) ||
        normalize(item.type).includes(term) ||
        normalize(item.category).includes(term) ||
        normalize(item.state).includes(term) ||
        normalize(item.district).includes(term)
      );
    });
  }, [assets, query]);

  const investmentBaseSummary = useMemo(() => {
    let operatives = 0;
    let deteriorated = 0;
    let replacement = 0;
    for (const item of visibleAssets) {
      const value = Math.max(0, Number(item.price || 0));
      const condition = classifyAssetCondition(item);
      if (condition === "operatives") operatives += value;
      if (condition === "deteriorated") deteriorated += value;
      if (condition === "replacement") replacement += value;
    }
    return {
      total: operatives + deteriorated + replacement,
      operatives,
      deteriorated,
      replacement,
    };
  }, [visibleAssets]);

  const conditionCounts = useMemo(() => {
    const result = { operatives: 0, deteriorated: 0, replacement: 0 };
    for (const item of visibleAssets) {
      result[classifyAssetCondition(item)] += 1;
    }
    return result;
  }, [visibleAssets]);

  const investmentByType = useMemo(() => {
    const result = { vertical: 0, horizontal: 0, mobiliario: 0, otro: 0 };
    for (const item of visibleAssets) {
      const key = normalizeType(item.type);
      result[key] += Math.max(0, Number(item.price || 0));
    }
    return result;
  }, [visibleAssets]);

  const investmentAssistant = useInvestmentAssistant(investmentBaseSummary);
  const investmentSummary = investmentAssistant.activeSummary;
  const byTypeTotal = investmentByType.vertical + investmentByType.horizontal + investmentByType.mobiliario + investmentByType.otro;

  function clearForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(asset: AssetRecord) {
    setEditingId(asset.id);
    setForm(mapAssetToForm(asset));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = toPayload(form);
    if (!payload) {
      setError("Completa tipo, latitud y longitud con valores validos.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await updateAsset(editingId, payload);
      } else {
        await createAsset(payload);
      }
      clearForm();
      await loadAssets();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo guardar el activo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(asset: AssetRecord) {
    const ok = window.confirm(`Eliminar activo "${asset.name || asset.type}"?`);
    if (!ok) return;
    setSubmitting(true);
    setError("");
    try {
      await deleteAsset(asset.id);
      if (editingId === asset.id) clearForm();
      await loadAssets();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo eliminar el activo.");
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
            <h2 className="module-title text-[26px] sm:text-[30px]">Activos</h2>
            <p className="module-sub">Registro de senales, marcas y mobiliario urbano.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="cta-ghost" onClick={loadAssets} disabled={loading || submitting}>
              {loading ? "Actualizando..." : "Recargar"}
            </button>
            <button type="button" className="cta" onClick={clearForm} disabled={submitting}>
              Nuevo activo
            </button>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="stat-card">
          <p className="stat-label">Inventario total</p>
          <p className="stat-value text-2xl">{money(investmentSummary.total)}</p>
        </article>
        <article className="stat-card stat-card--ok">
          <p className="stat-label">Activos operativos</p>
          <p className="stat-value text-2xl">{money(investmentSummary.operatives)}</p>
          <p className="mt-1 text-xs text-[#166534]">{conditionCounts.operatives} activos</p>
        </article>
        <article className="stat-card stat-card--warn">
          <p className="stat-label">Activos deteriorados</p>
          <p className="stat-value text-2xl">{money(investmentSummary.deteriorated)}</p>
          <p className="mt-1 text-xs text-[#b91c1c]">{conditionCounts.deteriorated} activos</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Activo por reponer</p>
          <p className="stat-value text-2xl">{money(investmentSummary.replacement)}</p>
          <p className="mt-1 text-xs text-[#6b778c]">{conditionCounts.replacement} activos</p>
        </article>
      </div>

      <article className="panel-soft px-5 py-4">
        <h3 className="text-sm font-extrabold text-ink">Distribucion de inversion por tipo de activo</h3>
        <div className="mt-3 grid gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold text-ink">
              <span>Vertical</span>
              <span>{money(investmentByType.vertical)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
              <div className="h-full bg-[#1d70b8]" style={{ width: `${byTypeTotal ? (investmentByType.vertical * 100) / byTypeTotal : 0}%` }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold text-ink">
              <span>Horizontal</span>
              <span>{money(investmentByType.horizontal)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
              <div className="h-full bg-[#0f766e]" style={{ width: `${byTypeTotal ? (investmentByType.horizontal * 100) / byTypeTotal : 0}%` }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold text-ink">
              <span>Mobiliario</span>
              <span>{money(investmentByType.mobiliario)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
              <div className="h-full bg-[#15803d]" style={{ width: `${byTypeTotal ? (investmentByType.mobiliario * 100) / byTypeTotal : 0}%` }} />
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[400px,1fr]">
        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">{editingId ? "Editar activo" : "Crear activo"}</h3>
          <p className="mt-1 text-sm text-ink/70">Registro de senales y mobiliario urbano.</p>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-2">
              <span className="field-label">Proyecto</span>
              <select
                className="field-input"
                value={form.projectId}
                onChange={(event) => setForm((prev) => ({ ...prev, projectId: event.target.value }))}
              >
                <option value="">Sin proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
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
                  value={form.state}
                  onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                >
                  {STATE_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="field-label">Nombre</span>
              <input
                className="field-input"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nombre del activo"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Categoria</span>
                <input
                  className="field-input"
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  placeholder="Categoria"
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Icono</span>
                <input
                  className="field-input"
                  value={form.icon}
                  onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
                  placeholder="icono-id"
                />
              </label>
            </div>

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
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Region</span>
                <input
                  className="field-input"
                  value={form.region}
                  onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="field-label">Precio</span>
                <input
                  className="field-input"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder="250.5"
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Fecha instalacion</span>
                <input
                  type="date"
                  className="field-input"
                  value={form.installedAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, installedAt: event.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block space-y-2">
                <span className="field-label">Ancho</span>
                <input
                  className="field-input"
                  value={form.width}
                  onChange={(event) => setForm((prev) => ({ ...prev, width: event.target.value }))}
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Largo</span>
                <input
                  className="field-input"
                  value={form.length}
                  onChange={(event) => setForm((prev) => ({ ...prev, length: event.target.value }))}
                />
              </label>
              <label className="block space-y-2">
                <span className="field-label">Area m2</span>
                <input
                  className="field-input"
                  value={form.areaM2}
                  onChange={(event) => setForm((prev) => ({ ...prev, areaM2: event.target.value }))}
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="field-label">Estado fisico</span>
              <input
                className="field-input"
                value={form.statePhysical}
                onChange={(event) => setForm((prev) => ({ ...prev, statePhysical: event.target.value }))}
              />
            </label>

            <label className="block space-y-2">
              <span className="field-label">Foto URL</span>
              <input
                className="field-input"
                value={form.photoUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, photoUrl: event.target.value }))}
                placeholder="https://..."
              />
            </label>

            <div className="flex gap-2">
              <button className="cta flex-1" type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear activo"}
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
                placeholder="Buscar por nombre, tipo, categoria o distrito..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                className="field-input w-[200px]"
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head text-left text-xs uppercase tracking-[0.12em]">
                <tr>
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium">Distrito</th>
                  <th className="px-5 py-3 font-medium">Coords</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleAssets.length ? (
                  visibleAssets.map((asset) => (
                    <tr key={asset.id} className="table-row">
                      <td className="px-5 py-3 text-ink">
                        <div className="font-medium">{asset.name || "-"}</div>
                        <div className="text-xs text-ink/60">{asset.category || "-"}</div>
                      </td>
                      <td className="px-5 py-3 text-ink/75">{asset.type}</td>
                      <td className="px-5 py-3 text-ink/75">{asset.state || "-"}</td>
                      <td className="px-5 py-3 text-ink/75">{asset.district || "-"}</td>
                      <td className="px-5 py-3 font-mono text-xs text-ink/70">{coordsLabel(asset)}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="cta-ghost cta-ghost-sm" onClick={() => startEdit(asset)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn-danger btn-danger-sm"
                            onClick={() => onDelete(asset)}
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
                      {loading ? "Cargando activos..." : "No hay activos para mostrar."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <InvestmentAssistant controller={investmentAssistant} />
    </div>
  );
}


