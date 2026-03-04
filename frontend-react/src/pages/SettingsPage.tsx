import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import {
  ApiError,
  createAsset,
  createProject,
  createReport,
  getAssets,
  getBudgets,
  getInterventions,
  getPlans,
  getProjects,
  getReports,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import {
  DEFAULT_URBBIS_CONFIG,
  applyAndSaveUrbbisConfig,
  loadUrbbisConfig,
  nombreDesdeCorreo,
  normalizeUrbbisConfig,
} from "../features/settings/urbbis-config";
import type { UrbbisConfig } from "../features/settings/urbbis-config";
import type { AssetPayload, ProjectPayload, ReportPayload } from "../lib/api";

type ImportPayload = {
  config?: Partial<UrbbisConfig>;
  projects?: unknown[];
  assets?: unknown[];
  reports?: unknown[];
  proyectos?: unknown[];
  senalesHorizontal?: unknown[];
  senalesVertical?: unknown[];
  senalesMobiliario?: unknown[];
  avisos?: unknown[];
};

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapLegacyProject(item: unknown): ProjectPayload | null {
  if (!item || typeof item !== "object") return null;
  const value = item as Record<string, unknown>;
  const name = String(value.name || value.nombre || "").trim();
  if (!name) return null;
  const startDate = String(value.startDate || value.fecha_inicio || "").trim();
  const yearSource = startDate || String(value.endDate || value.fecha_fin || "").trim();
  const yearMatch = yearSource.match(/^(\d{4})/);
  const year = yearMatch ? Number(yearMatch[1]) : toNumber(value.year);
  return {
    legacyId: value.legacyId ? String(value.legacyId) : (value.id ? String(value.id) : undefined),
    name,
    district: String(value.district || value.distrito || "").trim() || undefined,
    year: year !== null ? year : undefined,
    recordType: String(value.recordType || value.registroTipo || "").trim() || undefined,
    startDate: startDate || undefined,
    endDate: String(value.endDate || value.fecha_fin || "").trim() || undefined,
  };
}

function mapLegacyAsset(item: unknown, fallbackType?: string): AssetPayload | null {
  if (!item || typeof item !== "object") return null;
  const value = item as Record<string, unknown>;
  const lat = toNumber(value.lat);
  const lng = toNumber(value.lng);
  if (lat === null || lng === null) return null;
  const type = String(value.type || fallbackType || "").trim();
  if (!type) return null;
  return {
    legacyId: toNumber(value.legacyId ?? value.id) ?? undefined,
    type,
    name: String(value.name || value.nombre || "").trim() || undefined,
    category: String(value.category || value.tipo || "").trim() || undefined,
    icon: String(value.icon || value.icono || "").trim() || undefined,
    state: String(value.state || value.estado || "").trim() || undefined,
    statePhysical: String(value.statePhysical || value.estado_fisico || "").trim() || undefined,
    lat,
    lng,
    district: String(value.district || value.distrito || "").trim() || undefined,
    region: String(value.region || "").trim() || undefined,
    price: toNumber(value.price ?? value.precio) ?? undefined,
    installedAt: String(value.installedAt || value.fecha_colocacion || "").trim() || undefined,
    width: toNumber(value.width ?? value.ancho) ?? undefined,
    length: toNumber(value.length ?? value.largo) ?? undefined,
    areaM2: toNumber(value.areaM2 ?? value.area_m2) ?? undefined,
    photoUrl: String(value.photoUrl || value.foto || "").trim() || undefined,
  };
}

function mapLegacyReport(item: unknown): ReportPayload | null {
  if (!item || typeof item !== "object") return null;
  const value = item as Record<string, unknown>;
  const lat = toNumber(value.lat);
  const lng = toNumber(value.lng);
  if (lat === null || lng === null) return null;
  const type = String(value.type || value.tipo || "").trim() || "otro";
  return {
    legacyId: toNumber(value.legacyId ?? value.id) ?? undefined,
    type,
    status: String(value.status || value.estado || "").trim() || undefined,
    description: String(value.description || value.descripcion || "").trim() || undefined,
    lat,
    lng,
    district: String(value.district || value.distrito || "").trim() || undefined,
    region: String(value.region || "").trim() || undefined,
    userName: String(value.userName || value.usuarioNombre || value.nombre || "").trim() || undefined,
    userEmail: String(value.userEmail || value.usuarioEmail || "").trim() || undefined,
    userDni: String(value.userDni || value.usuarioDni || "").trim() || undefined,
    photoUrl: String(value.photoUrl || value.foto || "").trim() || undefined,
  };
}

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [config, setConfig] = useState<UrbbisConfig>(() => applyAndSaveUrbbisConfig(loadUrbbisConfig()));
  const [profileNameInput, setProfileNameInput] = useState(
    () => loadUrbbisConfig().profileName || nombreDesdeCorreo(String(user?.email || "")),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const profileEmail = useMemo(() => user?.email || "-", [user?.email]);
  const profileRole = useMemo(() => (user?.role === "municipal" ? "Municipal" : "Visitante"), [user?.role]);

  function updateConfig(partial: Partial<UrbbisConfig>) {
    const next = applyAndSaveUrbbisConfig({ ...config, ...partial });
    setConfig(next);
  }

  function saveProfile() {
    const name = profileNameInput.trim();
    updateConfig({ profileName: name });
    setMessage("Configuracion guardada.");
    setError("");
  }

  function resetConfig() {
    const next = applyAndSaveUrbbisConfig(DEFAULT_URBBIS_CONFIG);
    setConfig(next);
    setProfileNameInput(nombreDesdeCorreo(String(user?.email || "")));
    setMessage("Configuracion restaurada.");
    setError("");
  }

  function focusLima() {
    navigate("/map", {
      state: {
        focusMap: {
          lat: -12.0464,
          lng: -77.0428,
          zoom: config.zoomInicial,
          duration: config.animDur,
        },
      },
    });
  }

  async function exportData() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const [projects, assets, reports, plans, interventions, budgets] = await Promise.all([
        getProjects(),
        getAssets(),
        getReports(),
        getPlans(),
        getInterventions(),
        getBudgets(),
      ]);
      const now = new Date();
      const stamp = now.toISOString().slice(0, 10).replace(/-/g, "");
      const payload = {
        app: "Urbbis",
        version: 2,
        exportedAt: now.toISOString(),
        config,
        usuario: {
          correo: user?.email || "",
          rol: user?.role || "",
          scope: {
            region: user?.region || "",
            distrito: user?.district || "",
          },
        },
        projects,
        assets,
        reports,
        plans,
        interventions,
        budgets,
      };
      downloadJson(`urbbis-datos-${stamp}.json`, payload);
      setMessage("Datos exportados.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      setError(err instanceof ApiError ? err.message : "No se pudo exportar.");
    } finally {
      setBusy(false);
    }
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as ImportPayload;

      if (parsed.config && typeof parsed.config === "object") {
        const next = applyAndSaveUrbbisConfig(normalizeUrbbisConfig(parsed.config));
        setConfig(next);
        setProfileNameInput(next.profileName || nombreDesdeCorreo(String(user?.email || "")));
      }

      const shouldSync =
        Array.isArray(parsed.projects) ||
        Array.isArray(parsed.assets) ||
        Array.isArray(parsed.reports) ||
        Array.isArray(parsed.proyectos) ||
        Array.isArray(parsed.senalesHorizontal) ||
        Array.isArray(parsed.senalesVertical) ||
        Array.isArray(parsed.senalesMobiliario) ||
        Array.isArray(parsed.avisos);

      if (!shouldSync) {
        setMessage("Configuracion importada.");
        return;
      }

      const confirmed = window.confirm("El archivo incluye datos. Quieres sincronizarlos al backend?");
      if (!confirmed) {
        setMessage("Configuracion importada. Sincronizacion cancelada.");
        return;
      }

      const projects = Array.isArray(parsed.projects) ? parsed.projects : (Array.isArray(parsed.proyectos) ? parsed.proyectos : []);
      const assets = Array.isArray(parsed.assets)
        ? parsed.assets
        : [
            ...(Array.isArray(parsed.senalesHorizontal) ? parsed.senalesHorizontal : []),
            ...(Array.isArray(parsed.senalesVertical) ? parsed.senalesVertical : []),
            ...(Array.isArray(parsed.senalesMobiliario) ? parsed.senalesMobiliario : []),
          ];
      const reports = Array.isArray(parsed.reports) ? parsed.reports : (Array.isArray(parsed.avisos) ? parsed.avisos : []);

      let syncedProjects = 0;
      let syncedAssets = 0;
      let syncedReports = 0;

      for (const item of projects) {
        const payload = mapLegacyProject(item);
        if (!payload) continue;
        await createProject(payload);
        syncedProjects += 1;
      }

      for (const item of assets) {
        const source = item as Record<string, unknown>;
        const fallbackType = String(source.type || source.modo || "").toLowerCase().includes("horiz")
          ? "horizontal"
          : String(source.type || source.modo || "").toLowerCase().includes("mobili")
            ? "mobiliario"
            : "vertical";
        const payload = mapLegacyAsset(item, fallbackType);
        if (!payload) continue;
        await createAsset(payload);
        syncedAssets += 1;
      }

      for (const item of reports) {
        const payload = mapLegacyReport(item);
        if (!payload) continue;
        await createReport(payload);
        syncedReports += 1;
      }

      setMessage(`Importacion lista. Proyectos: ${syncedProjects}, Activos: ${syncedAssets}, Reportes: ${syncedReports}.`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo importar el archivo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel-soft px-6 py-5">
        <h2 className="module-title text-[26px] sm:text-[30px]">Configuracion</h2>
        <p className="module-sub">Preferencias de cuenta, mapa y datos.</p>
      </div>

      {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">Cuenta</h3>
          <div className="mt-4 space-y-3">
            <label className="block space-y-1.5">
              <span className="field-label">Nombre</span>
              <input className="field-input" value={profileNameInput} onChange={(event) => setProfileNameInput(event.target.value)} placeholder="Tu nombre" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="field-label">Email</span>
                <input className="field-input" value={profileEmail} disabled />
              </label>
              <label className="block space-y-1.5">
                <span className="field-label">Rol</span>
                <input className="field-input" value={profileRole} disabled />
              </label>
            </div>
            <button type="button" className="cta" onClick={saveProfile} disabled={busy}>Guardar</button>
          </div>
        </article>

        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">Preferencias</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-[#e5e9f2] bg-[#f8f9fc] px-4 py-3">
              <span className="text-sm font-semibold text-ink">Tema oscuro</span>
              <input type="checkbox" checked={config.temaOscuro} onChange={(event) => updateConfig({ temaOscuro: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[#e5e9f2] bg-[#f8f9fc] px-4 py-3">
              <span className="text-sm font-semibold text-ink">Animaciones</span>
              <input type="checkbox" checked={config.animaciones} onChange={(event) => updateConfig({ animaciones: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[#e5e9f2] bg-[#f8f9fc] px-4 py-3">
              <span className="text-sm font-semibold text-ink">Notificaciones</span>
              <input type="checkbox" checked={config.notificaciones} onChange={(event) => updateConfig({ notificaciones: event.target.checked })} />
            </label>
          </div>
        </article>

        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">Mapa</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="field-label">Zoom inicial</span>
              <input
                type="number"
                min={10}
                max={23}
                step={1}
                className="field-input"
                value={config.zoomInicial}
                onChange={(event) => updateConfig({ zoomInicial: Number(event.target.value || 13) })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="field-label">Duracion animacion (s)</span>
              <input
                type="number"
                min={0}
                max={3}
                step={0.1}
                className="field-input"
                value={config.animDur}
                onChange={(event) => updateConfig({ animDur: Number(event.target.value || 0.6) })}
              />
            </label>
          </div>
          <div className="mt-4">
            <button type="button" className="cta-ghost" onClick={focusLima} disabled={busy}>Centrar Lima</button>
          </div>
        </article>

        <article className="panel-soft px-6 py-6">
          <h3 className="text-lg font-semibold text-ink">Datos</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="cta" onClick={exportData} disabled={busy}>Exportar JSON</button>
            <label className="cta-ghost cursor-pointer">
              Importar JSON
              <input type="file" accept="application/json,.json" className="hidden" onChange={importData} />
            </label>
            <button type="button" className="cta-ghost" onClick={resetConfig} disabled={busy}>Restaurar</button>
          </div>
          <p className="mt-3 text-xs text-ink/70">
            Incluye configuracion local y respaldo de proyectos, activos, reportes, planes, intervenciones y presupuestos.
          </p>
        </article>
      </div>
    </div>
  );
}
