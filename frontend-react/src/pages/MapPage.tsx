import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ApiError,
  createProject,
  createAsset,
  createReport,
  deleteAsset,
  deleteReport,
  getAssets,
  getIconCatalog,
  getProjects,
  getReports,
  updateProject,
  updateAsset,
  updateReport,
} from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { AssetRecord, IconCatalogIcon, ProjectPayload, ProjectRecord, ReportRecord } from "../lib/api";
import { LEGACY_HORIZONTAL_ICONS, LEGACY_VERTICAL_ICONS } from "../data/legacyIcons";
import { loadUrbbisConfig } from "../features/settings/urbbis-config";

const LIMA_CENTER: L.LatLngExpression = [-12.0464, -77.0428];
const BASE_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
const LABELS_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";
type CreateMode = "none" | "asset" | "report";
type MapMode = "inventario" | "acciones" | "eventos";
type AssetStateFilter = "" | "operativo" | "deteriorado" | "no-operativo";
type AssetConservationState = "operativo" | "deteriorado" | "no-operativo";
type LegacyAssetState = "nueva" | "antigua" | "sin_senal";
type RegistrationKind = "transito" | "marcas" | "mobiliario" | "eventos";
type RegistrationPhysicalState = "operativa" | "deteriorada" | "no_operativa";
type RegistrationCategory = "" | "preventiva" | "reglamentaria" | "informativa";
type Selection = { kind: "asset" | "report"; id: string } | null;
type GeocodeResult = {
  lat: string;
  lon: string;
  display_name?: string;
};

type TemporalClass = "activo" | "programado" | "finalizado";
type ProjectModalMode = "create" | "edit";
type ProjectFormState = {
  name: string;
  year: string;
  recordType: string;
  startDate: string;
  endDate: string;
};
type MetradoRecord = {
  id: string;
  name: string;
  points: L.LatLngTuple[];
  distanceM: number;
  widthM: number;
  areaM2: number;
  createdAt: string;
  updatedAt: string;
  inspectionPending: boolean;
};

type MapLocationState = {
  focusMap?: {
    lat: number;
    lng: number;
    zoom?: number;
    duration?: number;
  };
};

const EMPTY_PROJECT_FORM: ProjectFormState = {
  name: "",
  year: "",
  recordType: "",
  startDate: "",
  endDate: "",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function getModeLayerDefaults(mode: MapMode): { showAssets: boolean; showReports: boolean } {
  if (mode === "eventos") return { showAssets: false, showReports: true };
  if (mode === "acciones") return { showAssets: true, showReports: false };
  return { showAssets: true, showReports: false };
}

function mapProjectTypeToMode(type: string | null | undefined): MapMode {
  const key = String(type || "").toLowerCase();
  if (key.includes("evento")) return "eventos";
  if (key.includes("accion") || key.includes("mantenimiento") || key.includes("obra")) return "acciones";
  return "inventario";
}

function isValidCoordinate(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

function assetColor(type: string): string {
  const key = String(type || "").toLowerCase();
  if (key === "horizontal") return "#0f766e";
  if (key === "vertical") return "#c2410c";
  if (key === "mobiliario") return "#1d4ed8";
  return "#334155";
}

function reportColor(status: string): string {
  const key = String(status || "").toLowerCase();
  if (key.includes("cerrado") || key.includes("atendido") || key.includes("resuelto")) return "#15803d";
  if (key.includes("proceso")) return "#b45309";
  return "#be123c";
}

function hasPhotoUrl(value: { photoUrl?: string | null } | null | undefined): boolean {
  const raw = String(value?.photoUrl || "").trim();
  return raw.length > 0;
}

function normalizeStateKey(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyAssetState(item: AssetRecord): AssetConservationState {
  const key = normalizeStateKey(`${String(item.statePhysical || "")} ${String(item.state || "")}`);
  if (!key) return "operativo";
  if (key.includes("deterior") || key.includes("antigua")) return "deteriorado";
  if (key.includes("no oper") || key.includes("inoper") || key.includes("sin senal") || key.includes("sinsenal")) {
    return "no-operativo";
  }
  if (key.includes("operativ") || key.includes("nueva")) return "operativo";
  return "operativo";
}

function assetModeSubtitle(type: string | null | undefined): string {
  const key = String(type || "").toLowerCase();
  if (key === "horizontal" || key === "marcas") return "Marcas viales";
  if (key === "vertical" || key === "transito") return "Senales de transito";
  if (key === "mobiliario") return "Mobiliario vial";
  return "Activo vial";
}

function labelAssetPhysicalState(value: string | null | undefined, fallback: AssetConservationState): string {
  const key = normalizeStateKey(String(value || ""));
  if (key.includes("deterior")) return "Deteriorada";
  if (key.includes("no oper") || key.includes("inoper") || key.includes("sin senal") || key.includes("sinsenal")) {
    return "No operativa (Ausente)";
  }
  if (key.includes("operativ")) return "Operativa";
  if (fallback === "deteriorado") return "Deteriorada";
  if (fallback === "no-operativo") return "No operativa (Ausente)";
  return "Operativa";
}

function labelYesNo(value: unknown): string {
  const key = normalizeStateKey(String(value || ""));
  if (!key) return "-";
  if (["si", "yes", "true", "1", "x"].includes(key)) return "Si";
  if (["no", "false", "0"].includes(key)) return "No";
  return String(value || "-");
}

function legacyStateFromAsset(item: AssetRecord): LegacyAssetState {
  const key = normalizeStateKey(`${String(item.statePhysical || "")} ${String(item.state || "")}`);
  if (key.includes("sin senal") || key.includes("sinsenal") || key.includes("no oper") || key.includes("inoper")) {
    return "sin_senal";
  }
  if (key.includes("deterior") || key.includes("antigua")) return "antigua";
  if (key.includes("operativ") || key.includes("nueva")) return "nueva";
  const conservation = classifyAssetState(item);
  if (conservation === "deteriorado") return "antigua";
  if (conservation === "no-operativo") return "sin_senal";
  return "nueva";
}

function physicalStateFromLegacyState(value: LegacyAssetState): RegistrationPhysicalState {
  if (value === "antigua") return "deteriorada";
  if (value === "sin_senal") return "no_operativa";
  return "operativa";
}

function visualFromLegacyState(value: LegacyAssetState): { color: string; label: string } {
  if (value === "antigua") return { color: "#dc2626", label: "Deteriorado" };
  if (value === "sin_senal") return { color: "#2563eb", label: "No operativo" };
  return { color: "#16a34a", label: "Operativo" };
}

const POPUP_EDIT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path></svg>';
const POPUP_DELETE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';

function classifyTemporalFromAsset(item: AssetRecord): TemporalClass {
  const raw = item.installedAt || item.createdAt;
  if (!raw) return "activo";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "activo";
  if (date.getTime() > Date.now()) return "programado";
  return "activo";
}

function classifyTemporalFromReport(item: ReportRecord): TemporalClass {
  const status = String(item.status || "").toLowerCase();
  if (status.includes("cerrado") || status.includes("atendido") || status.includes("resuelto") || status.includes("finaliz")) {
    return "finalizado";
  }
  if (status.includes("program")) return "programado";
  return "activo";
}

function haversineDistanceMeters(a: L.LatLngTuple, b: L.LatLngTuple): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return 6371000 * c;
}

function toFiniteNumber(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function parseMetradoPoint(value: unknown): L.LatLngTuple | null {
  if (Array.isArray(value) && value.length >= 2) {
    const lat = toFiniteNumber(value[0]);
    const lng = toFiniteNumber(value[1]);
    if (lat === null || lng === null || !isValidCoordinate(lat, lng)) return null;
    return [lat, lng];
  }
  const obj = asRecord(value);
  if (!obj) return null;
  const lat = toFiniteNumber(obj.lat);
  const lng = toFiniteNumber(obj.lng);
  if (lat === null || lng === null || !isValidCoordinate(lat, lng)) return null;
  return [lat, lng];
}

function parseMetradoPoints(value: unknown): L.LatLngTuple[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((point) => parseMetradoPoint(point))
    .filter((point): point is L.LatLngTuple => point !== null);
}

function readMetradoRecordsFromProject(project: ProjectRecord | null): MetradoRecord[] {
  const data = asRecord(project?.data);
  const raw = data?.metradoRegistros;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      const obj = asRecord(item);
      if (!obj) return null;

      const points = parseMetradoPoints(obj.points ?? obj.puntos);
      if (points.length < 2) return null;

      let distanceM = toFiniteNumber(obj.distanceM ?? obj.distancia_m);
      if (distanceM === null || distanceM <= 0) {
        distanceM = 0;
        for (let i = 1; i < points.length; i += 1) {
          distanceM += haversineDistanceMeters(points[i - 1], points[i]);
        }
      }

      let widthM = toFiniteNumber(obj.widthM ?? obj.ancho_m);
      if (widthM === null || widthM <= 0) {
        const cfg = asRecord(obj.config);
        widthM = toFiniteNumber(cfg?.ancho_linea_m);
      }
      if (widthM === null || widthM <= 0) widthM = 0;

      let areaM2 = toFiniteNumber(obj.areaM2 ?? obj.area_m2);
      if (areaM2 === null || areaM2 < 0) {
        const resultados = asRecord(obj.resultados);
        areaM2 = toFiniteNumber(resultados?.area_m2);
      }
      if (areaM2 === null || areaM2 < 0) areaM2 = distanceM * widthM;

      const createdAt = String(obj.createdAt || obj.fecha || new Date().toISOString());
      const updatedAt = String(obj.updatedAt || obj.fecha || createdAt);
      const id = String(obj.id || `metrado-${index + 1}`);
      const rawName = String(obj.name || obj.nombre || "").trim();
      const name = rawName || `Trazado ${index + 1}`;

      return {
        id,
        name,
        points,
        distanceM,
        widthM,
        areaM2,
        createdAt,
        updatedAt,
        inspectionPending: Boolean(obj.inspectionPending ?? obj.inspeccion_pendiente),
      } satisfies MetradoRecord;
    })
    .filter((item): item is MetradoRecord => item !== null);
}

function serializeMetradoRecords(records: MetradoRecord[]): Array<Record<string, unknown>> {
  return records.map((item) => ({
    id: item.id,
    name: item.name,
    points: item.points.map((point) => [point[0], point[1]]),
    distanceM: item.distanceM,
    widthM: item.widthM,
    areaM2: item.areaM2,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    inspectionPending: item.inspectionPending,
  }));
}

function nextMetradoName(records: MetradoRecord[]): string {
  return `Trazado ${records.length + 1}`;
}

function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
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

function toProjectPayload(form: ProjectFormState): ProjectPayload {
  const payload: ProjectPayload = { name: form.name.trim() };
  if (form.year.trim()) {
    const parsed = Number(form.year);
    if (Number.isFinite(parsed)) payload.year = parsed;
  }
  if (form.recordType.trim()) payload.recordType = form.recordType.trim();
  if (form.startDate.trim()) payload.startDate = form.startDate.trim();
  if (form.endDate.trim()) payload.endDate = form.endDate.trim();
  return payload;
}

function toDateLabel(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function normalizeFilterText(value: string | null | undefined): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function mapPhysicalStateToAssetState(value: RegistrationPhysicalState): "nueva" | "antigua" | "sin_senal" {
  if (value === "deteriorada") return "antigua";
  if (value === "no_operativa") return "sin_senal";
  return "nueva";
}

function parsePositiveNumber(value: string): number | undefined {
  const parsed = Number(String(value || "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function registrationKindLabel(kind: RegistrationKind | null): string {
  if (kind === "transito") return "Senales de transito";
  if (kind === "marcas") return "Marcas viales";
  if (kind === "mobiliario") return "Mobiliario vial";
  if (kind === "eventos") return "Eventos";
  return "Registro";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value: string): string {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function markerHtml(color: string, borderColor: string, imageSrc?: string, statusColor?: string): string {
  const bgImage = imageSrc ? `background-image:url('${escapeAttr(imageSrc)}');` : "";
  const bgSize = imageSrc ? "background-size:78%;background-position:center;background-repeat:no-repeat;" : "";
  const statusDot = statusColor
    ? `<span class="map-marker-status-dot" style="--status-color:${escapeAttr(statusColor)}" aria-hidden="true"></span>`
    : "";
  return `<div class="map-marker-dot-inner" style="--marker-color:${color};--marker-border:${borderColor};${bgImage}${bgSize}">${statusDot}</div>`;
}

function markerIcon(color: string, borderColor: string, imageSrc?: string, statusColor?: string): L.DivIcon {
  return L.divIcon({
    html: markerHtml(color, borderColor, imageSrc, statusColor),
    className: "map-marker-dot",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -26],
  });
}

export function MapPage() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const mapLocationState = (location.state || null) as MapLocationState | null;
  const pendingFocusMap = mapLocationState?.focusMap || null;
  const configuredZoom = useMemo(() => {
    const cfg = loadUrbbisConfig();
    return Number.isFinite(cfg.zoomInicial) ? cfg.zoomInicial : 11;
  }, []);

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<ProjectModalMode>("create");
  const [projectModalSubmitting, setProjectModalSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectFormState>(EMPTY_PROJECT_FORM);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAssets, setShowAssets] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [assetTypeFilter, setAssetTypeFilter] = useState("");
  const [reportStatusFilter, setReportStatusFilter] = useState("");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("");
  const [appliedRegionFilter, setAppliedRegionFilter] = useState("");
  const [appliedDistrictFilter, setAppliedDistrictFilter] = useState("");
  const [assetStateFilter, setAssetStateFilter] = useState<AssetStateFilter>("");
  const [activeProjectId, setActiveProjectId] = useState("");
  const [projectPickerId, setProjectPickerId] = useState("");
  const [mapMode, setMapMode] = useState<MapMode>("inventario");
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>("none");
  const [showVisualPanel, setShowVisualPanel] = useState(false);
  const [showVisualAdvanced, setShowVisualAdvanced] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [addPickerStep, setAddPickerStep] = useState<"main" | "marcas">("main");
  const [showMetradoPanel, setShowMetradoPanel] = useState(false);
  const [metradoDrawing, setMetradoDrawing] = useState(false);
  const [metradoName, setMetradoName] = useState("");
  const [metradoWidthM, setMetradoWidthM] = useState("3");
  const [metradoPoints, setMetradoPoints] = useState<L.LatLngTuple[]>([]);
  const [metradoRecords, setMetradoRecords] = useState<MetradoRecord[]>([]);
  const [selectedMetradoId, setSelectedMetradoId] = useState("");
  const [metradoRecordsOpen, setMetradoRecordsOpen] = useState(false);
  const [metradoRecordsSaving, setMetradoRecordsSaving] = useState(false);
  const [draftPoint, setDraftPoint] = useState<L.LatLngTuple | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const [showOperationalAssets, setShowOperationalAssets] = useState(true);
  const [showDeterioratedAssets, setShowDeterioratedAssets] = useState(true);
  const [showNoOperationalAssets, setShowNoOperationalAssets] = useState(true);
  const [showLayerTransito, setShowLayerTransito] = useState(true);
  const [showLayerMarcas, setShowLayerMarcas] = useState(true);
  const [showLayerMobiliario, setShowLayerMobiliario] = useState(true);
  const [showLayerEventos, setShowLayerEventos] = useState(false);
  const [showWithPhoto, setShowWithPhoto] = useState(true);
  const [showWithoutPhoto, setShowWithoutPhoto] = useState(true);
  const [showCurrentItems, setShowCurrentItems] = useState(true);
  const [showProgrammedItems, setShowProgrammedItems] = useState(true);
  const [showFinalizedItems, setShowFinalizedItems] = useState(true);

  const [registrationKind, setRegistrationKind] = useState<RegistrationKind | null>(null);
  const [registrationDate, setRegistrationDate] = useState(todayIsoDate());
  const [registrationPhysicalState, setRegistrationPhysicalState] = useState<RegistrationPhysicalState>("operativa");
  const [registrationCategory, setRegistrationCategory] = useState<RegistrationCategory>("");
  const [registrationIconId, setRegistrationIconId] = useState("");
  const [registrationIconSearch, setRegistrationIconSearch] = useState("");
  const [registrationWidth, setRegistrationWidth] = useState("");
  const [registrationLength, setRegistrationLength] = useState("");
  const [registrationPrice, setRegistrationPrice] = useState("");
  const [registrationLamina, setRegistrationLamina] = useState("I");
  const [registrationSoporte, setRegistrationSoporte] = useState("si");
  const [registrationMobiliarioName, setRegistrationMobiliarioName] = useState("");
  const [registrationEventType, setRegistrationEventType] = useState("falta");
  const [registrationDescription, setRegistrationDescription] = useState("");
  const [registrationDistrict, setRegistrationDistrict] = useState("");
  const [registrationPhotoDataUrl, setRegistrationPhotoDataUrl] = useState("");
  const [registrationPhotoName, setRegistrationPhotoName] = useState("");
  const [catalogHorizontalIcons, setCatalogHorizontalIcons] = useState<IconCatalogIcon[]>(LEGACY_HORIZONTAL_ICONS);
  const [catalogVerticalIcons, setCatalogVerticalIcons] = useState<IconCatalogIcon[]>(LEGACY_VERTICAL_ICONS);

  const [selectedAssetName, setSelectedAssetName] = useState("");
  const [selectedAssetState, setSelectedAssetState] = useState("");
  const [selectedAssetDistrict, setSelectedAssetDistrict] = useState("");

  const [selectedReportStatus, setSelectedReportStatus] = useState("");
  const [selectedReportDescription, setSelectedReportDescription] = useState("");
  const [selectedReportDistrict, setSelectedReportDistrict] = useState("");
  const [mapReady, setMapReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const assetsLayerRef = useRef<L.LayerGroup | null>(null);
  const reportsLayerRef = useRef<L.LayerGroup | null>(null);
  const metradoLayerRef = useRef<L.LayerGroup | null>(null);
  const metradoSavedLayerRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);
  const didFitBoundsRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const [projectsData, assetsData, reportsData] = await Promise.all([getProjects(), getAssets(), getReports()]);
      const sortedProjects = [...projectsData].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "es"));
      setProjects(sortedProjects);
      setAssets(assetsData);
      setReports(reportsData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }
      setError(err instanceof ApiError ? err.message : "No se pudo cargar el mapa.");
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const catalog = await getIconCatalog();
        if (cancelled) return;
        if (Array.isArray(catalog.horizontal) && catalog.horizontal.length) {
          setCatalogHorizontalIcons(catalog.horizontal);
        }
        if (Array.isArray(catalog.vertical) && catalog.vertical.length) {
          setCatalogVerticalIcons(catalog.vertical);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          signOut();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  const selectedAsset = useMemo(() => {
    if (!selection || selection.kind !== "asset") return null;
    return assets.find((item) => item.id === selection.id) || null;
  }, [assets, selection]);

  const selectedReport = useMemo(() => {
    if (!selection || selection.kind !== "report") return null;
    return reports.find((item) => item.id === selection.id) || null;
  }, [reports, selection]);

  const activeProject = useMemo(() => {
    if (!activeProjectId) return null;
    return projects.find((project) => project.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  useEffect(() => {
    const parsed = readMetradoRecordsFromProject(activeProject);
    setMetradoRecords(parsed);
    setSelectedMetradoId((previous) => (parsed.some((item) => item.id === previous) ? previous : ""));
  }, [activeProject]);

  const projectsForMode = useMemo(() => {
    const scoped = projects.filter((project) => mapProjectTypeToMode(project.recordType) === mapMode);
    return scoped.length ? scoped : projects;
  }, [projects, mapMode]);

  useEffect(() => {
    const validIds = new Set(projectsForMode.map((project) => project.id));
    const fallbackId = projectsForMode[0]?.id || "";
    setActiveProjectId((previous) => (previous && validIds.has(previous) ? previous : fallbackId));
    setProjectPickerId((previous) => (previous && validIds.has(previous) ? previous : fallbackId));
  }, [projectsForMode]);

  const recordTypeOptions = useMemo(
    () => [
      { value: "", label: "Sin tipo" },
      { value: "senalizacion", label: "Senalizacion" },
      { value: "mantenimiento", label: "Mantenimiento" },
      { value: "obra", label: "Obra" },
      { value: "eventos", label: "Eventos" },
    ],
    [],
  );

  useEffect(() => {
    if (!selectedAsset) return;
    setSelectedAssetName(selectedAsset.name || "");
    setSelectedAssetState(selectedAsset.state || "");
    setSelectedAssetDistrict(selectedAsset.district || "");
  }, [selectedAsset]);

  useEffect(() => {
    setShowAssets(showLayerTransito || showLayerMarcas || showLayerMobiliario);
  }, [showLayerMarcas, showLayerMobiliario, showLayerTransito]);

  useEffect(() => {
    setShowReports(showLayerEventos);
  }, [showLayerEventos]);

  useEffect(() => {
    if (!selectedReport) return;
    setSelectedReportStatus(selectedReport.status || "pendiente");
    setSelectedReportDescription(selectedReport.description || "");
    setSelectedReportDistrict(selectedReport.district || "");
  }, [selectedReport]);

  const handleApiError = useCallback((err: unknown, fallback: string) => {
    if (err instanceof ApiError && err.status === 401) {
      signOut();
      return true;
    }
    setError(err instanceof ApiError ? err.message : fallback);
    return false;
  }, [signOut]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      minZoom: 3,
    }).setView(LIMA_CENTER, configuredZoom);

    L.tileLayer(BASE_TILE_URL, {
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
      maxNativeZoom: 20,
      maxZoom: 23,
    }).addTo(map);

    map.createPane("labels");
    const labelsPane = map.getPane("labels");
    if (labelsPane) {
      labelsPane.style.zIndex = "650";
      labelsPane.style.pointerEvents = "none";
    }
    L.tileLayer(LABELS_TILE_URL, {
      maxNativeZoom: 20,
      maxZoom: 23,
      pane: "labels",
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const assetsLayer = L.layerGroup().addTo(map);
    const reportsLayer = L.layerGroup().addTo(map);
    const metradoLayer = L.layerGroup().addTo(map);
    const metradoSavedLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    assetsLayerRef.current = assetsLayer;
    reportsLayerRef.current = reportsLayer;
    metradoLayerRef.current = metradoLayer;
    metradoSavedLayerRef.current = metradoSavedLayer;
    setMapReady(true);

    return () => {
      assetsLayer.clearLayers();
      reportsLayer.clearLayers();
      metradoLayer.clearLayers();
      metradoSavedLayer.clearLayers();
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      assetsLayerRef.current = null;
      reportsLayerRef.current = null;
      metradoLayerRef.current = null;
      metradoSavedLayerRef.current = null;
      didFitBoundsRef.current = false;
      setMapReady(false);
    };
  }, [configuredZoom]);

  useEffect(() => {
    if (!mapReady || !pendingFocusMap) return;
    const map = mapRef.current;
    if (!map) return;
    const lat = Number(pendingFocusMap.lat);
    const lng = Number(pendingFocusMap.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const zoom = Number.isFinite(Number(pendingFocusMap.zoom)) ? Number(pendingFocusMap.zoom) : configuredZoom;
    const duration = Number.isFinite(Number(pendingFocusMap.duration)) ? Number(pendingFocusMap.duration) : 0.8;
    map.flyTo([lat, lng], zoom, { duration, easeLinearity: 0.25 });
    navigate(location.pathname, { replace: true, state: null });
  }, [configuredZoom, location.pathname, mapReady, navigate, pendingFocusMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = (event: L.LeafletMouseEvent) => {
      if (metradoDrawing) {
        setMetradoPoints((previous) => [...previous, [event.latlng.lat, event.latlng.lng]]);
        setInfo("");
        setError("");
        return;
      }
      if (createMode === "none") return;
      const selectedPoint: L.LatLngTuple = [event.latlng.lat, event.latlng.lng];
      setDraftPoint(selectedPoint);
      setShowCreatePanel(true);
      setSelection(null);
      if (registrationKind) {
        setInfo(`Ubicacion seleccionada (${selectedPoint[0].toFixed(6)}, ${selectedPoint[1].toFixed(6)}). Completa el registro.`);
      } else {
        setInfo(`Ubicacion seleccionada (${selectedPoint[0].toFixed(6)}, ${selectedPoint[1].toFixed(6)}).`);
      }
      setError("");
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [createMode, metradoDrawing, registrationKind]);

  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      const appliedRegionKey = normalizeFilterText(appliedRegionFilter);
      const appliedDistrictKey = normalizeFilterText(appliedDistrictFilter);
      if (appliedRegionKey && normalizeFilterText(item.region) !== appliedRegionKey) return false;
      if (appliedDistrictKey && normalizeFilterText(item.district) !== appliedDistrictKey) return false;

      if (activeProjectId && item.projectId !== activeProjectId) return false;
      if (assetTypeFilter && String(item.type || "").toLowerCase() !== assetTypeFilter.toLowerCase()) return false;

      const typeKey = String(item.type || "").toLowerCase();
      const layerEnabled =
        (typeKey === "vertical" && showLayerTransito) ||
        (typeKey === "horizontal" && showLayerMarcas) ||
        (typeKey === "mobiliario" && showLayerMobiliario) ||
        (!["vertical", "horizontal", "mobiliario"].includes(typeKey) && (showLayerTransito || showLayerMarcas || showLayerMobiliario));
      if (!layerEnabled) return false;

      const conservation = classifyAssetState(item);
      if (conservation === "operativo" && !showOperationalAssets) return false;
      if (conservation === "deteriorado" && !showDeterioratedAssets) return false;
      if (conservation === "no-operativo" && !showNoOperationalAssets) return false;
      if (assetStateFilter && conservation !== assetStateFilter) return false;

      const withPhoto = hasPhotoUrl(item);
      if (withPhoto && !showWithPhoto) return false;
      if (!withPhoto && !showWithoutPhoto) return false;

      const temporal = classifyTemporalFromAsset(item);
      if (temporal === "activo" && !showCurrentItems) return false;
      if (temporal === "programado" && !showProgrammedItems) return false;
      if (temporal === "finalizado" && !showFinalizedItems) return false;

      return true;
    });
  }, [
    activeProjectId,
    appliedDistrictFilter,
    appliedRegionFilter,
    assetTypeFilter,
    assetStateFilter,
    assets,
    showCurrentItems,
    showDeterioratedAssets,
    showFinalizedItems,
    showLayerMarcas,
    showLayerMobiliario,
    showLayerTransito,
    showNoOperationalAssets,
    showOperationalAssets,
    showProgrammedItems,
    showWithPhoto,
    showWithoutPhoto,
  ]);

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const appliedRegionKey = normalizeFilterText(appliedRegionFilter);
      const appliedDistrictKey = normalizeFilterText(appliedDistrictFilter);
      if (appliedRegionKey && normalizeFilterText(item.region) !== appliedRegionKey) return false;
      if (appliedDistrictKey && normalizeFilterText(item.district) !== appliedDistrictKey) return false;

      if (reportStatusFilter) {
        const term = reportStatusFilter.toLowerCase();
        if (!String(item.status || "").toLowerCase().includes(term)) return false;
      }

      const withPhoto = hasPhotoUrl(item);
      if (withPhoto && !showWithPhoto) return false;
      if (!withPhoto && !showWithoutPhoto) return false;

      const temporal = classifyTemporalFromReport(item);
      if (temporal === "activo" && !showCurrentItems) return false;
      if (temporal === "programado" && !showProgrammedItems) return false;
      if (temporal === "finalizado" && !showFinalizedItems) return false;

      return true;
    });
  }, [
    appliedDistrictFilter,
    appliedRegionFilter,
    reportStatusFilter,
    reports,
    showCurrentItems,
    showFinalizedItems,
    showProgrammedItems,
    showWithPhoto,
    showWithoutPhoto,
  ]);

  const regionOptions = useMemo(() => {
    const options = new Map<string, string>();
    const register = (value: string | null | undefined) => {
      const label = String(value || "").trim();
      if (!label) return;
      const key = normalizeFilterText(label);
      if (!key) return;
      if (!options.has(key)) options.set(key, label);
    };

    for (const item of assets) register(item.region);
    for (const item of reports) register(item.region);

    return [...options.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], "es", { sensitivity: "base" }))
      .map((entry) => entry[1]);
  }, [assets, reports]);

  const districtOptions = useMemo(() => {
    const options = new Map<string, string>();
    const selectedRegionKey = normalizeFilterText(selectedRegionFilter);
    const register = (district: string | null | undefined, region: string | null | undefined) => {
      const districtLabel = String(district || "").trim();
      if (!districtLabel) return;
      if (selectedRegionKey && normalizeFilterText(region) !== selectedRegionKey) return;
      const key = normalizeFilterText(districtLabel);
      if (!key) return;
      if (!options.has(key)) options.set(key, districtLabel);
    };

    for (const item of assets) register(item.district, item.region);
    for (const item of reports) register(item.district, item.region);

    return [...options.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], "es", { sensitivity: "base" }))
      .map((entry) => entry[1]);
  }, [assets, reports, selectedRegionFilter]);

  useEffect(() => {
    if (!selectedDistrictFilter) return;
    const selectedKey = normalizeFilterText(selectedDistrictFilter);
    const exists = districtOptions.some((item) => normalizeFilterText(item) === selectedKey);
    if (!exists) setSelectedDistrictFilter("");
  }, [districtOptions, selectedDistrictFilter]);

  const canApplyProjectChange = Boolean(projectPickerId) && projectPickerId !== activeProjectId;
  const isEventosMode = mapMode === "eventos";
  const isVisitor = String(user?.role || "").toLowerCase().includes("visit");
  const canManageMapItems = useMemo(() => {
    const role = String(user?.role || "").toLowerCase();
    return role.includes("admin") || role.includes("municipal");
  }, [user?.role]);
  const verticalIconById = useMemo(() => {
    return new Map(catalogVerticalIcons.map((icon) => [String(icon.id), icon.src]));
  }, [catalogVerticalIcons]);
  const horizontalIconById = useMemo(() => {
    return new Map(catalogHorizontalIcons.map((icon) => [String(icon.id), icon.src]));
  }, [catalogHorizontalIcons]);
  const verticalIconLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const icon of LEGACY_VERTICAL_ICONS) {
      map.set(String(icon.id), String(icon.label || icon.id));
    }
    for (const icon of catalogVerticalIcons) {
      map.set(String(icon.id), String(icon.label || icon.id));
    }
    return map;
  }, [catalogVerticalIcons]);
  const horizontalIconLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const icon of LEGACY_HORIZONTAL_ICONS) {
      map.set(String(icon.id), String(icon.label || icon.id));
    }
    for (const icon of catalogHorizontalIcons) {
      map.set(String(icon.id), String(icon.label || icon.id));
    }
    return map;
  }, [catalogHorizontalIcons]);
  const registrationIcons = useMemo(() => {
    if (registrationKind === "transito") {
      if (!registrationCategory) return [];
      return catalogVerticalIcons.filter((icon) => icon.category === registrationCategory);
    }
    if (registrationKind === "marcas") return catalogHorizontalIcons;
    return [];
  }, [catalogHorizontalIcons, catalogVerticalIcons, registrationCategory, registrationKind]);
  const filteredRegistrationIcons = useMemo(() => {
    const term = normalizeFilterText(registrationIconSearch);
    if (!term) return registrationIcons;
    return registrationIcons.filter((icon) => normalizeFilterText(`${icon.label} ${icon.id} ${icon.code}`).includes(term));
  }, [registrationIconSearch, registrationIcons]);
  const selectedRegistrationIcon = useMemo(() => {
    if (!registrationIconId) return null;
    const source = registrationKind === "transito" ? catalogVerticalIcons : registrationKind === "marcas" ? catalogHorizontalIcons : [];
    return source.find((icon) => icon.id === registrationIconId) || null;
  }, [catalogHorizontalIcons, catalogVerticalIcons, registrationIconId, registrationKind]);
  const registrationWidthValue = useMemo(() => parsePositiveNumber(registrationWidth), [registrationWidth]);
  const registrationLengthValue = useMemo(() => parsePositiveNumber(registrationLength), [registrationLength]);
  const registrationPriceValue = useMemo(() => parsePositiveNumber(registrationPrice), [registrationPrice]);
  const registrationAreaM2 = useMemo(() => {
    if (registrationKind !== "marcas") return 0;
    if (!registrationWidthValue || !registrationLengthValue) return 0;
    return registrationWidthValue * registrationLengthValue;
  }, [registrationKind, registrationLengthValue, registrationWidthValue]);
  const canSubmitRegistration = useMemo(() => {
    if (!draftPoint || !registrationKind) return false;
    if (registrationKind === "eventos") return true;
    if (registrationKind === "mobiliario") return Boolean(registrationMobiliarioName.trim());
    return Boolean(registrationIconId) && Boolean(registrationPriceValue);
  }, [draftPoint, registrationIconId, registrationKind, registrationMobiliarioName, registrationPriceValue]);
  const metradoLengthM = useMemo(() => {
    if (metradoPoints.length < 2) return 0;
    let total = 0;
    for (let index = 1; index < metradoPoints.length; index += 1) {
      total += haversineDistanceMeters(metradoPoints[index - 1], metradoPoints[index]);
    }
    return total;
  }, [metradoPoints]);
  const metradoWidthValue = useMemo(() => {
    const parsed = Number(String(metradoWidthM || "").replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) return 0;
    return parsed;
  }, [metradoWidthM]);
  const metradoAreaM2 = metradoLengthM * metradoWidthValue;
  const selectedMetradoRecord = useMemo(() => {
    if (!selectedMetradoId) return null;
    return metradoRecords.find((item) => item.id === selectedMetradoId) || null;
  }, [metradoRecords, selectedMetradoId]);
  const canRegisterMetrado = Boolean(activeProjectId) && metradoPoints.length >= 2;

  const counters = useMemo(() => {
    const assetsCount = filteredAssets.length;
    const reportsCount = filteredReports.length;
    const pendingReports = filteredReports.filter((item) => String(item.status || "").toLowerCase().includes("pendiente")).length;
    return { assetsCount, reportsCount, pendingReports };
  }, [filteredAssets, filteredReports]);

  const resolveAssetIconSrc = useCallback((item: AssetRecord): string => {
    const photo = String(item.photoUrl || "").trim();
    if (photo) return photo;
    const iconId = String(item.icon || "").trim();
    if (!iconId) return "";
    const key = String(item.type || "").toLowerCase();
    if (key === "vertical" || key === "transito") return verticalIconById.get(iconId) || "";
    if (key === "horizontal" || key === "marcas") return horizontalIconById.get(iconId) || "";
    return "";
  }, [horizontalIconById, verticalIconById]);
  const resolveAssetIconLabel = useCallback((item: AssetRecord): string => {
    const iconId = String(item.icon || "").trim();
    if (!iconId) return "-";
    const key = String(item.type || "").toLowerCase();
    if (key === "vertical" || key === "transito") return verticalIconLabelById.get(iconId) || iconId;
    if (key === "horizontal" || key === "marcas") return horizontalIconLabelById.get(iconId) || iconId;
    return verticalIconLabelById.get(iconId) || horizontalIconLabelById.get(iconId) || iconId;
  }, [horizontalIconLabelById, verticalIconLabelById]);

  const deleteAssetFromPopup = useCallback(async (item: AssetRecord) => {
    if (!canManageMapItems) return;
    if (!window.confirm(`Eliminar activo "${item.name || item.type}"?`)) return;
    try {
      setSubmitting(true);
      setError("");
      await deleteAsset(item.id);
      setSelection((current) => (current && current.kind === "asset" && current.id === item.id ? null : current));
      setInfo("Activo eliminado.");
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo eliminar el activo.");
    } finally {
      setSubmitting(false);
    }
  }, [canManageMapItems, handleApiError, loadData]);

  const deleteReportFromPopup = useCallback(async (item: ReportRecord) => {
    if (!canManageMapItems) return;
    if (!window.confirm(`Eliminar reporte "${item.type || "Reporte"}"?`)) return;
    try {
      setSubmitting(true);
      setError("");
      await deleteReport(item.id);
      setSelection((current) => (current && current.kind === "report" && current.id === item.id ? null : current));
      setInfo("Reporte eliminado.");
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo eliminar el reporte.");
    } finally {
      setSubmitting(false);
    }
  }, [canManageMapItems, handleApiError, loadData]);

  useEffect(() => {
    const map = mapRef.current;
    const assetsLayer = assetsLayerRef.current;
    const reportsLayer = reportsLayerRef.current;
    if (!map || !assetsLayer || !reportsLayer) return;

    assetsLayer.clearLayers();
    reportsLayer.clearLayers();

    const points: L.LatLngTuple[] = [];

    if (showAssets) {
      for (const item of filteredAssets) {
        if (!isValidCoordinate(item.lat, item.lng)) continue;
        points.push([item.lat, item.lng]);
        const typeKey = String(item.type || "").toLowerCase();
        const isVertical = typeKey === "vertical" || typeKey === "transito";
        const isHorizontal = typeKey === "horizontal" || typeKey === "marcas";
        const isSignal = isVertical || isHorizontal;
        const iconOptions = isVertical ? catalogVerticalIcons : isHorizontal ? catalogHorizontalIcons : [];
        const iconSrcById = new Map(iconOptions.map((icon) => [String(icon.id), String(icon.src)]));
        const rawItem = item as unknown as Record<string, unknown>;
        const legacyState = legacyStateFromAsset(item);
        const stateVisual = visualFromLegacyState(legacyState);
        const physicalStateLabel = labelAssetPhysicalState(item.statePhysical, classifyAssetState(item));
        const iconLabel = resolveAssetIconLabel(item);
        const verified = hasPhotoUrl(item);
        const verificationLabel = verified ? "Verificado" : "No verificado";
        const verificationColor = verified ? "#2fa84f" : "#6b778c";
        const laminaLabel = String(rawItem.lamina || item.category || "").trim() || "-";
        const soporteLabel = labelYesNo(rawItem.soporte);
        const installedAtLabel = item.installedAt ? toDateLabel(item.installedAt) : "-";
        const installedAtInput = toInputDate(item.installedAt);
        const currentIconId = String(item.icon || "").trim();
        const defaultIconId = currentIconId || (iconOptions.length ? String(iconOptions[0].id) : "");
        const iconSrc = resolveAssetIconSrc(item);
        const imageHtml = iconSrc
          ? `<div class="map-popup-preview" style="background-image:url('${escapeAttr(iconSrc)}')" aria-hidden="true"></div>`
          : "";
        const buildPopupView = (): string => {
          const actions = canManageMapItems
            ? `
                <div class="senal-popup-actions">
                  <button type="button" class="senal-action-btn" data-asset-edit="${escapeAttr(item.id)}" title="Editar">${POPUP_EDIT_ICON}</button>
                  <button type="button" class="senal-action-btn danger" data-asset-delete="${escapeAttr(item.id)}" title="Eliminar">${POPUP_DELETE_ICON}</button>
                </div>
              `
            : "";
          const verticalExtraHtml = isVertical
            ? `
                <div class="senal-row"><span>Tipo de lamina</span><strong>${escapeHtml(laminaLabel)}</strong></div>
                <div class="senal-row"><span>Soporte</span><strong>${escapeHtml(soporteLabel)}</strong></div>
                <div class="senal-row"><span>Estado fisico</span><strong>${escapeHtml(physicalStateLabel)}</strong></div>
                <div class="senal-row"><span>Verificacion</span><span class="estado-pill" style="background:${escapeAttr(verificationColor)}22;border-color:${escapeAttr(verificationColor)}55;color:${escapeAttr(verificationColor)}">${escapeHtml(verificationLabel)}</span></div>
              `
            : "";
          return `
            <div class="senal-popup map-popup-card--asset">
              <div class="senal-popup-head">
                <div class="senal-popup-title-wrap">
                  <div class="senal-popup-title">${escapeHtml(item.name || item.category || "Senal")}</div>
                  <div class="senal-popup-sub">${escapeHtml(assetModeSubtitle(item.type))}</div>
                </div>
                ${imageHtml}
                ${actions}
              </div>
              <div class="senal-popup-meta">
                <div class="senal-row"><span>Distrito</span><strong>${escapeHtml(item.district || "-")}</strong></div>
                <div class="senal-row"><span>Region</span><strong>${escapeHtml(item.region || "-")}</strong></div>
                <div class="senal-row"><span>Estado</span><span class="estado-pill" style="background:${escapeAttr(stateVisual.color)}22;border-color:${escapeAttr(stateVisual.color)}55;color:${escapeAttr(stateVisual.color)}">${escapeHtml(stateVisual.label)}</span></div>
                <div class="senal-row"><span>Senal</span><strong>${escapeHtml(iconLabel)}</strong></div>
                <div class="senal-row"><span>Fecha</span><strong>${escapeHtml(installedAtLabel)}</strong></div>
                ${verticalExtraHtml}
              </div>
            </div>
          `;
        };
        const buildPopupEdit = (): string => {
          const iconButtons = iconOptions
            .map((icon) => {
              const iconId = String(icon.id);
              const active = iconId === defaultIconId ? " active" : "";
              return `
                <button type="button" class="icon-option${active}" data-icon="${escapeAttr(iconId)}">
                  <span class="icon-thumb" style="background-image:url('${escapeAttr(icon.src)}')"></span>
                  <small>${escapeHtml(String(icon.label || icon.id))}</small>
                </button>
              `;
            })
            .join("");
          const priceVal = Number.isFinite(Number(item.price)) && Number(item.price) > 0 ? String(Math.round(Number(item.price))) : "";
          const fechaVal = legacyState === "sin_senal" ? "" : installedAtInput || todayIsoDate();
          const fechaHidden = legacyState === "sin_senal" ? " hidden" : "";
          const iconField = isSignal
            ? `
                <div class="senal-field">
                  <span>Icono</span>
                  <input type="text" class="icon-search js-asset-icon-search" placeholder="Buscar icono...">
                  <div class="icon-grid js-asset-icon-grid">${iconButtons}</div>
                </div>
              `
            : "";
          const priceField = isSignal
            ? `
                <div class="precio-row">
                  <label>Precio (S/)</label>
                  <div class="precio-input"><span>S/</span><input type="number" class="js-asset-precio" min="0" step="50" value="${escapeAttr(priceVal)}"></div>
                </div>
              `
            : "";
          return `
            <form class="senal-popup senal-popup--edit js-asset-edit-form" data-id="${escapeAttr(item.id)}">
              <div class="senal-popup-head">
                <div class="senal-popup-title-wrap">
                  <div class="senal-popup-title">Editar senal</div>
                  <div class="senal-popup-sub">Actualiza estado, icono o precio</div>
                </div>
              </div>
              <div class="senal-edit-body">
                <label class="senal-field">
                  <span>Tipo</span>
                  <input type="text" class="js-asset-nombre" value="${escapeAttr(item.name || "")}" placeholder="Nombre de senal">
                </label>
                <div class="senal-field">
                  <span>Estado</span>
                  <div class="estado-grid">
                    <button type="button" class="estado-option${legacyState === "nueva" ? " active" : ""}" data-estado="nueva">Operativa</button>
                    <button type="button" class="estado-option${legacyState === "antigua" ? " active" : ""}" data-estado="antigua">Deteriorada</button>
                    <button type="button" class="estado-option${legacyState === "sin_senal" ? " active" : ""}" data-estado="sin_senal">No operativa</button>
                  </div>
                </div>
                <div class="fecha-row js-asset-fecha-row${fechaHidden}">
                  <label>Fecha de colocacion</label>
                  <input type="date" class="js-asset-fecha" value="${escapeAttr(fechaVal)}">
                </div>
                ${priceField}
                ${iconField}
              </div>
              <div class="senal-edit-actions">
                <button type="button" class="senal-edit-btn ghost js-asset-cancel">Cancelar</button>
                <button type="submit" class="senal-edit-btn primary">Guardar</button>
              </div>
            </form>
          `;
        };
        let popupMode: "view" | "edit" = "view";
        const marker = L.marker([item.lat, item.lng], {
          icon: markerIcon(assetColor(item.type), stateVisual.color, iconSrc || undefined, stateVisual.color),
          draggable: editMode,
          title: item.name || item.type,
        })
          .bindPopup(buildPopupView())
          .on("click", () => setSelection({ kind: "asset", id: item.id }))
          .on("popupclose", () => {
            popupMode = "view";
          })
          .on("popupopen", () => {
            const openViewMode = () => {
              popupMode = "view";
              marker.setPopupContent(buildPopupView());
              requestAnimationFrame(bindViewActions);
            };
            const openEditMode = () => {
              if (!canManageMapItems) return;
              popupMode = "edit";
              marker.setPopupContent(buildPopupEdit());
              requestAnimationFrame(bindEditActions);
            };
            const bindViewActions = () => {
              const popupEl = marker.getPopup()?.getElement();
              if (!popupEl) return;
              const editBtn = popupEl.querySelector(`[data-asset-edit="${item.id}"]`) as HTMLButtonElement | null;
              const deleteBtn = popupEl.querySelector(`[data-asset-delete="${item.id}"]`) as HTMLButtonElement | null;
              if (editBtn) {
                editBtn.onclick = (ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setSelection({ kind: "asset", id: item.id });
                  setError("");
                  openEditMode();
                };
              }
              if (deleteBtn) {
                deleteBtn.onclick = (ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  marker.closePopup();
                  void deleteAssetFromPopup(item);
                };
              }
            };
            const bindEditActions = () => {
              const popupEl = marker.getPopup()?.getElement();
              if (!popupEl) return;
              const form = popupEl.querySelector(".js-asset-edit-form") as HTMLFormElement | null;
              if (!form) return;

              let stateSel: LegacyAssetState = legacyState;
              let iconSel = defaultIconId;

              const btnCancel = popupEl.querySelector(".js-asset-cancel") as HTMLButtonElement | null;
              const inputName = popupEl.querySelector(".js-asset-nombre") as HTMLInputElement | null;
              const inputDate = popupEl.querySelector(".js-asset-fecha") as HTMLInputElement | null;
              const dateRow = popupEl.querySelector(".js-asset-fecha-row") as HTMLDivElement | null;
              const inputPrice = popupEl.querySelector(".js-asset-precio") as HTMLInputElement | null;
              const iconSearch = popupEl.querySelector(".js-asset-icon-search") as HTMLInputElement | null;
              const iconGrid = popupEl.querySelector(".js-asset-icon-grid") as HTMLDivElement | null;

              const toggleDate = () => {
                if (!dateRow || !inputDate) return;
                const needs = stateSel !== "sin_senal";
                dateRow.classList.toggle("hidden", !needs);
                if (needs && !inputDate.value) inputDate.value = installedAtInput || todayIsoDate();
                if (!needs) inputDate.value = "";
              };

              toggleDate();

              popupEl.querySelectorAll(".estado-option").forEach((btn) => {
                btn.addEventListener("click", (ev) => {
                  ev.preventDefault();
                  const selected = (btn as HTMLButtonElement).getAttribute("data-estado") || "";
                  if (selected === "nueva" || selected === "antigua" || selected === "sin_senal") {
                    stateSel = selected;
                  }
                  popupEl.querySelectorAll(".estado-option").forEach((el) => el.classList.remove("active"));
                  btn.classList.add("active");
                  toggleDate();
                });
              });

              popupEl.querySelectorAll(".icon-option").forEach((btn) => {
                btn.addEventListener("click", (ev) => {
                  ev.preventDefault();
                  iconSel = (btn as HTMLButtonElement).getAttribute("data-icon") || iconSel;
                  popupEl.querySelectorAll(".icon-option").forEach((el) => el.classList.remove("active"));
                  btn.classList.add("active");
                  if (inputPrice) {
                    const current = Number(inputPrice.value);
                    if (!Number.isFinite(current) || current <= 0) {
                      inputPrice.value = "100";
                    }
                  }
                });
              });

              if (iconSearch && iconGrid) {
                iconSearch.addEventListener("input", () => {
                  const term = normalizeFilterText(iconSearch.value);
                  iconGrid.querySelectorAll(".icon-option").forEach((btn) => {
                    const id = (btn as HTMLButtonElement).getAttribute("data-icon") || "";
                    const label = btn.querySelector("small")?.textContent || "";
                    const key = normalizeFilterText(`${id} ${label}`);
                    (btn as HTMLButtonElement).style.display = !term || key.includes(term) ? "" : "none";
                  });
                });
              }

              if (btnCancel) {
                btnCancel.onclick = (ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  openViewMode();
                };
              }

              form.onsubmit = async (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                const nextName = inputName ? String(inputName.value || "").trim() : "";
                const nextDate = stateSel === "sin_senal" ? "" : inputDate ? String(inputDate.value || "").trim() : "";
                const nextPrice = inputPrice ? Number(inputPrice.value) : undefined;

                if (isSignal && iconOptions.length && !iconSel) {
                  window.alert("Selecciona un icono.");
                  return;
                }
                if (isSignal && (!Number.isFinite(nextPrice) || Number(nextPrice) <= 0)) {
                  window.alert("Ingresa un precio valido (mayor a 0).");
                  return;
                }
                if (stateSel !== "sin_senal" && !nextDate) {
                  window.alert("Selecciona una fecha de colocacion.");
                  return;
                }

                try {
                  setSubmitting(true);
                  setError("");
                  await updateAsset(item.id, {
                    name: nextName || undefined,
                    state: stateSel,
                    statePhysical: physicalStateFromLegacyState(stateSel),
                    icon: isSignal && iconSel ? iconSel : undefined,
                    price: isSignal && Number.isFinite(nextPrice) ? Number(nextPrice) : undefined,
                    installedAt: stateSel === "sin_senal" ? undefined : nextDate || undefined,
                  });
                  const nextVisual = visualFromLegacyState(stateSel);
                  const nextIconSrc = iconSel ? iconSrcById.get(iconSel) || iconSrc : iconSrc;
                  marker.setIcon(markerIcon(assetColor(item.type), nextVisual.color, nextIconSrc || undefined, nextVisual.color));
                  setInfo("Activo actualizado.");
                  setSelection({ kind: "asset", id: item.id });
                  marker.closePopup();
                  await loadData();
                } catch (err) {
                  handleApiError(err, "No se pudo actualizar la senal.");
                } finally {
                  setSubmitting(false);
                }
              };
            };

            if (popupMode === "edit") {
              bindEditActions();
            } else {
              bindViewActions();
            }
          })
          .addTo(assetsLayer);

        marker.on("dragend", async () => {
          const pos = marker.getLatLng();
          try {
            setSubmitting(true);
            await updateAsset(item.id, { lat: pos.lat, lng: pos.lng });
            setInfo("Activo actualizado en mapa.");
            setError("");
            await loadData();
          } catch (err) {
            handleApiError(err, "No se pudo mover el activo.");
          } finally {
            setSubmitting(false);
          }
        });
      }
    }

    if (showReports) {
      for (const item of filteredReports) {
        if (!isValidCoordinate(item.lat, item.lng)) continue;
        points.push([item.lat, item.lng]);
        const photoSrc = String(item.photoUrl || "").trim();
        const photoHtml = photoSrc
          ? `<div class="map-popup-preview" style="background-image:url('${escapeAttr(photoSrc)}')" aria-hidden="true"></div>`
          : "";
        const reportActions = canManageMapItems
          ? `
              <button type="button" class="map-popup-btn" data-report-edit="${escapeAttr(item.id)}">Editar</button>
              <button type="button" class="map-popup-btn danger" data-report-delete="${escapeAttr(item.id)}">Eliminar</button>
            `
          : "";
        const popup = `
          <div class="map-popup-card map-popup-card--report">
            <div class="map-popup-head">
              <div>
                <div class="map-popup-title">${escapeHtml(item.type || "Reporte")}</div>
                <div class="map-popup-subtitle">Reporte ciudadano</div>
              </div>
              ${photoHtml}
            </div>
            <div class="map-popup-meta">
              <div><span>Estado</span><strong>${escapeHtml(item.status || "pendiente")}</strong></div>
              <div><span>Distrito</span><strong>${escapeHtml(item.district || "-")}</strong></div>
              <div><span>Fecha</span><strong>${escapeHtml(toDateLabel(item.createdAt))}</strong></div>
            </div>
            <div class="map-popup-actions">
              <button type="button" class="map-popup-btn" data-report-select="${escapeAttr(item.id)}">Seleccionar</button>
              ${reportActions}
            </div>
          </div>
        `;
        const marker = L.marker([item.lat, item.lng], {
          icon: markerIcon(reportColor(item.status || ""), "#111827"),
          draggable: editMode,
          title: item.type,
        })
          .bindPopup(popup)
          .on("click", () => setSelection({ kind: "report", id: item.id }))
          .on("popupopen", () => {
            const popupEl = marker.getPopup()?.getElement();
            if (!popupEl) return;

            const selectBtn = popupEl.querySelector(`[data-report-select="${item.id}"]`) as HTMLButtonElement | null;
            const editBtn = popupEl.querySelector(`[data-report-edit="${item.id}"]`) as HTMLButtonElement | null;
            const deleteBtn = popupEl.querySelector(`[data-report-delete="${item.id}"]`) as HTMLButtonElement | null;

            if (selectBtn) {
              selectBtn.onclick = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setSelection({ kind: "report", id: item.id });
                setInfo(`Reporte seleccionado: ${item.type || "Reporte"}`);
                setError("");
                marker.closePopup();
              };
            }
            if (editBtn) {
              editBtn.onclick = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setSelection({ kind: "report", id: item.id });
                setInfo(`Edicion activa para reporte: ${item.type || "Reporte"}`);
                setError("");
                marker.closePopup();
              };
            }
            if (deleteBtn) {
              deleteBtn.onclick = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                marker.closePopup();
                void deleteReportFromPopup(item);
              };
            }
          })
          .addTo(reportsLayer);

        marker.on("dragend", async () => {
          const pos = marker.getLatLng();
          try {
            setSubmitting(true);
            await updateReport(item.id, { lat: pos.lat, lng: pos.lng });
            setInfo("Reporte actualizado en mapa.");
            setError("");
            await loadData();
          } catch (err) {
            handleApiError(err, "No se pudo mover el reporte.");
          } finally {
            setSubmitting(false);
          }
        });
      }
    }

    if (!didFitBoundsRef.current && points.length) {
      map.fitBounds(points, { padding: [30, 30] });
      didFitBoundsRef.current = true;
    }
  }, [
    catalogHorizontalIcons,
    catalogVerticalIcons,
    canManageMapItems,
    deleteAssetFromPopup,
    deleteReportFromPopup,
    editMode,
    filteredAssets,
    filteredReports,
    handleApiError,
    loadData,
    resolveAssetIconLabel,
    resolveAssetIconSrc,
    showAssets,
    showReports,
  ]);

  useEffect(() => {
    const metradoLayer = metradoLayerRef.current;
    if (!metradoLayer) return;

    metradoLayer.clearLayers();
    if (!metradoPoints.length) return;

    L.polyline(metradoPoints, {
      color: "#f59e0b",
      weight: 5,
      opacity: 0.92,
    }).addTo(metradoLayer);

    metradoPoints.forEach((point, index) => {
      L.circleMarker(point, {
        radius: index === metradoPoints.length - 1 ? 6 : 5,
        color: "#0c426a",
        weight: 2,
        fillColor: "#1d70b8",
        fillOpacity: 0.95,
      }).addTo(metradoLayer);
    });
  }, [metradoPoints]);

  useEffect(() => {
    const layer = metradoSavedLayerRef.current;
    if (!layer) return;

    layer.clearLayers();
    metradoRecords.forEach((record) => {
      if (record.points.length < 2) return;
      const isSelected = record.id === selectedMetradoId;
      const line = L.polyline(record.points, {
        color: isSelected ? "#b45309" : "#0284c7",
        weight: isSelected ? 7 : 5,
        opacity: isSelected ? 0.92 : 0.7,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layer);

      line.on("click", () => {
        setSelectedMetradoId(record.id);
        setInfo(`Trazado seleccionado: ${record.name}`);
        setError("");
      });
    });
  }, [metradoRecords, selectedMetradoId]);

  function resetRegistrationDraft(nextKind: RegistrationKind | null) {
    setRegistrationKind(nextKind);
    setRegistrationDate(todayIsoDate());
    setRegistrationPhysicalState("operativa");
    setRegistrationCategory("");
    setRegistrationIconId("");
    setRegistrationIconSearch("");
    setRegistrationWidth("");
    setRegistrationLength("");
    setRegistrationPrice("");
    setRegistrationLamina("I");
    setRegistrationSoporte("si");
    setRegistrationMobiliarioName("");
    setRegistrationEventType("falta");
    setRegistrationDescription("");
    setRegistrationDistrict("");
    setRegistrationPhotoDataUrl("");
    setRegistrationPhotoName("");
  }

  function handleRegistrationPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setRegistrationPhotoDataUrl("");
      setRegistrationPhotoName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      setRegistrationPhotoDataUrl(raw);
      setRegistrationPhotoName(file.name || "imagen");
    };
    reader.onerror = () => {
      setRegistrationPhotoDataUrl("");
      setRegistrationPhotoName("");
      setError("No se pudo leer la imagen seleccionada.");
    };
    reader.readAsDataURL(file);
  }

  async function handleCreateFromMap() {
    if (!draftPoint || !registrationKind) return;
    const [lat, lng] = draftPoint;
    try {
      setSubmitting(true);
      setError("");

      if (registrationKind === "eventos") {
        await createReport({
          type: registrationEventType || "falta",
          status: "pendiente",
          description: registrationDescription || undefined,
          photoUrl: registrationPhotoDataUrl || undefined,
          district: registrationDistrict || undefined,
          region: selectedRegionFilter || appliedRegionFilter || undefined,
          lat,
          lng,
        });
        setInfo("Evento registrado.");
      } else if (registrationKind === "mobiliario") {
        await createAsset({
          projectId: activeProjectId || undefined,
          type: "mobiliario",
          name: registrationMobiliarioName || "Mobiliario",
          category: "MOBILIARIO",
          icon: "mobiliario",
          state: mapPhysicalStateToAssetState(registrationPhysicalState),
          statePhysical: registrationPhysicalState,
          district: registrationDistrict || undefined,
          region: selectedRegionFilter || appliedRegionFilter || undefined,
          installedAt: registrationDate || undefined,
          photoUrl: registrationPhotoDataUrl || undefined,
          lat,
          lng,
        });
        setInfo("Mobiliario registrado.");
      } else {
        const isTransito = registrationKind === "transito";
        const icon = selectedRegistrationIcon;
        const width = registrationWidthValue;
        const length = registrationLengthValue;
        const areaM2 = isTransito ? undefined : registrationAreaM2 > 0 ? registrationAreaM2 : undefined;
        const baseName = icon?.label || (isTransito ? "Senal" : "Marca");

        await createAsset({
          projectId: activeProjectId || undefined,
          type: isTransito ? "vertical" : "horizontal",
          name: baseName,
          category: isTransito ? registrationCategory || undefined : "marca",
          icon: registrationIconId || undefined,
          state: mapPhysicalStateToAssetState(registrationPhysicalState),
          statePhysical: registrationPhysicalState,
          district: registrationDistrict || undefined,
          region: selectedRegionFilter || appliedRegionFilter || undefined,
          price: registrationPriceValue,
          installedAt: registrationDate || undefined,
          width,
          length,
          areaM2,
          photoUrl: registrationPhotoDataUrl || undefined,
          lat,
          lng,
        });
        setInfo(isTransito ? "Senal registrada." : "Marca vial registrada.");
      }

      setDraftPoint(null);
      setShowCreatePanel(false);
      setCreateMode("none");
      resetRegistrationDraft(null);
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo crear el registro.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveSelection() {
    try {
      setSubmitting(true);
      setError("");
      if (selectedAsset) {
        await updateAsset(selectedAsset.id, {
          name: selectedAssetName || undefined,
          state: selectedAssetState || undefined,
          district: selectedAssetDistrict || undefined,
        });
        setInfo("Activo actualizado.");
      } else if (selectedReport) {
        await updateReport(selectedReport.id, {
          status: selectedReportStatus || undefined,
          description: selectedReportDescription || undefined,
          district: selectedReportDistrict || undefined,
        });
        setInfo("Reporte actualizado.");
      } else {
        return;
      }
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo actualizar el elemento.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteSelection() {
    if (selectedAsset) {
      if (!window.confirm(`Eliminar activo "${selectedAsset.name || selectedAsset.type}"?`)) return;
    }
    if (selectedReport) {
      if (!window.confirm(`Eliminar reporte "${selectedReport.type}"?`)) return;
    }
    try {
      setSubmitting(true);
      setError("");
      if (selectedAsset) {
        await deleteAsset(selectedAsset.id);
        setInfo("Activo eliminado.");
      } else if (selectedReport) {
        await deleteReport(selectedReport.id);
        setInfo("Reporte eliminado.");
      } else {
        return;
      }
      setSelection(null);
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo eliminar el elemento.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleToggleCreatePanel() {
    if (isVisitor) {
      openCreatePanelFromPicker("eventos");
      return;
    }

    setShowAddPicker((previous) => {
      const next = !previous;
      if (next) {
        setAddPickerStep("main");
        setShowMetradoPanel(false);
        setMetradoDrawing(false);
        setShowCreatePanel(false);
        setCreateMode("none");
        resetRegistrationDraft(null);
        setDraftPoint(null);
        setSelection(null);
        setError("");
      }
      return next;
    });
  }

  function ensurePickerLayerVisibility(type: "transito" | "marcas" | "mobiliario" | "eventos") {
    if (type === "transito") {
      setShowLayerTransito(true);
      setShowAssets(true);
      return;
    }
    if (type === "marcas") {
      setShowLayerMarcas(true);
      setShowAssets(true);
      return;
    }
    if (type === "mobiliario") {
      setShowLayerMobiliario(true);
      setShowAssets(true);
      return;
    }
    setShowLayerEventos(true);
    setShowReports(true);
  }

  function openCreatePanelFromPicker(type: "transito" | "marcas" | "mobiliario" | "eventos") {
    setShowAddPicker(false);
    setAddPickerStep("main");
    setShowCreatePanel(false);
    setShowMetradoPanel(false);
    setMetradoDrawing(false);
    setShowVisualPanel(false);
    setShowVisualAdvanced(false);
    setSelection(null);
    setDraftPoint(null);
    setError("");
    setInfo("");
    ensurePickerLayerVisibility(type);

    if (type === "eventos") {
      setCreateMode("report");
      resetRegistrationDraft("eventos");
      setRegistrationDistrict((selectedDistrictFilter || appliedDistrictFilter || "").trim());
      return;
    }

    setCreateMode("asset");
    resetRegistrationDraft(type);
    setRegistrationDistrict((selectedDistrictFilter || appliedDistrictFilter || "").trim());
  }

  function handleAddPickerMainChoice(type: "transito" | "marcas" | "mobiliario" | "eventos") {
    if (type === "marcas") {
      setAddPickerStep("marcas");
      return;
    }
    openCreatePanelFromPicker(type);
  }

  function handleAddPickerMarcasChoice(type: "senalizacion" | "pintado") {
    if (type === "pintado") {
      setShowAddPicker(false);
      setAddPickerStep("main");
      setShowMetradoPanel(true);
      setShowVisualPanel(false);
      setShowVisualAdvanced(false);
      setShowCreatePanel(false);
      setCreateMode("none");
      resetRegistrationDraft(null);
      setDraftPoint(null);
      setSelection(null);
      setInfo("Metrado listo: inicia trazado para marcas viales.");
      return;
    }
    openCreatePanelFromPicker("marcas");
  }

  function handleToggleVisualPanel() {
    setShowVisualPanel((previous) => {
      const next = !previous;
      if (next) {
        setShowAddPicker(false);
        setShowMetradoPanel(false);
        setMetradoDrawing(false);
      } else {
        setShowVisualAdvanced(false);
      }
      return next;
    });
  }

  async function persistMetradoRecords(nextRecords: MetradoRecord[], successText: string): Promise<boolean> {
    if (!activeProject) {
      setError("Selecciona un proyecto para guardar el metrado.");
      return false;
    }

    try {
      setMetradoRecordsSaving(true);
      setError("");
      const currentData = asRecord(activeProject.data) || {};
      const payloadData: Record<string, unknown> = {
        ...currentData,
        metradoRegistros: serializeMetradoRecords(nextRecords),
      };

      const savedProject = await updateProject(activeProject.id, {
        name: activeProject.name,
        data: payloadData,
      });

      setProjects((previous) =>
        [...previous.map((project) => (project.id === savedProject.id ? savedProject : project))].sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""), "es"),
        ),
      );
      setMetradoRecords(nextRecords);
      setInfo(successText);
      setError("");
      return true;
    } catch (err) {
      handleApiError(err, "No se pudo guardar el metrado.");
      return false;
    } finally {
      setMetradoRecordsSaving(false);
    }
  }

  async function handleRegisterMetrado() {
    if (!activeProjectId) {
      setError("Selecciona un proyecto antes de registrar el trazado.");
      return;
    }
    if (metradoPoints.length < 2) {
      setError("Agrega al menos dos puntos para registrar el trazado.");
      return;
    }

    const now = new Date().toISOString();
    const newRecord: MetradoRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: metradoName.trim() || nextMetradoName(metradoRecords),
      points: metradoPoints.map((point) => [point[0], point[1]]),
      distanceM: metradoLengthM,
      widthM: metradoWidthValue,
      areaM2: metradoAreaM2,
      createdAt: now,
      updatedAt: now,
      inspectionPending: true,
    };

    const next = [...metradoRecords, newRecord];
    const ok = await persistMetradoRecords(next, "Trazado de metrado registrado.");
    if (!ok) return;

    setSelectedMetradoId(newRecord.id);
    setMetradoName("");
    setMetradoPoints([]);
    setMetradoDrawing(false);
    setMetradoRecordsOpen(true);
  }

  function handleOpenMetradoRecords() {
    setMetradoRecordsOpen(true);
  }

  function handleFocusMetradoRecord(recordId: string) {
    const map = mapRef.current;
    if (!map) return;

    const record = metradoRecords.find((item) => item.id === recordId);
    if (!record || record.points.length < 2) return;

    setSelectedMetradoId(record.id);
    setMetradoRecordsOpen(false);
    const bounds = L.latLngBounds(record.points);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 18 });
    setInfo(`Trazado enfocado: ${record.name}`);
    setError("");
  }

  async function handleDeleteMetradoRecord(recordId: string) {
    const record = metradoRecords.find((item) => item.id === recordId);
    if (!record) return;

    if (!window.confirm(`Eliminar trazado "${record.name}"?`)) return;

    const next = metradoRecords.filter((item) => item.id !== recordId);
    const ok = await persistMetradoRecords(next, "Trazado eliminado.");
    if (!ok) return;

    setSelectedMetradoId((previous) => (previous === recordId ? "" : previous));
  }

  function handleStartMetrado() {
    setShowMetradoPanel(true);
    setMetradoDrawing(true);
    setInfo("Metrado activo: haz click en el mapa para agregar puntos.");
    setError("");
  }

  function handleFinishMetrado() {
    setMetradoDrawing(false);
    setInfo("Metrado finalizado.");
  }

  function handleUndoMetrado() {
    setMetradoPoints((previous) => previous.slice(0, -1));
  }

  function handleClearMetrado() {
    setMetradoDrawing(false);
    setMetradoPoints([]);
    setInfo("Metrado limpiado.");
  }

  function handleCloseMetrado() {
    setShowMetradoPanel(false);
    setMetradoDrawing(false);
  }

  function handleCloseCreatePanel() {
    setShowCreatePanel(false);
    setCreateMode("none");
    resetRegistrationDraft(null);
    setDraftPoint(null);
  }

  function applyLayerDefaultsByMode(mode: MapMode) {
    const isEventos = mode === "eventos";
    setShowLayerTransito(!isEventos);
    setShowLayerMarcas(!isEventos);
    setShowLayerMobiliario(!isEventos);
    setShowLayerEventos(isEventos);
  }

  function applyMapMode(mode: MapMode) {
    setMapMode(mode);
    setShowAddPicker(false);
    setAddPickerStep("main");
    setSelection(null);
    setDraftPoint(null);
    setShowCreatePanel(false);
    setShowVisualAdvanced(false);
    setShowMetradoPanel(false);
    setMetradoDrawing(false);
    const defaults = getModeLayerDefaults(mode);
    applyLayerDefaultsByMode(mode);

    setShowAssets(defaults.showAssets);
    setShowReports(defaults.showReports);
    if (mode === "eventos") setAssetTypeFilter("");
    setCreateMode("none");
    resetRegistrationDraft(null);
  }

  function resetAdvancedVisualizationFilters() {
    setShowOperationalAssets(true);
    setShowDeterioratedAssets(true);
    setShowNoOperationalAssets(true);
    setShowWithPhoto(true);
    setShowWithoutPhoto(true);
    setShowCurrentItems(true);
    setShowProgrammedItems(true);
    setShowFinalizedItems(true);
  }

  function resetVisualizationFilters() {
    const defaults = getModeLayerDefaults(mapMode);
    applyLayerDefaultsByMode(mapMode);
    setShowAssets(defaults.showAssets);
    setShowReports(defaults.showReports);
    setAssetTypeFilter("");
    setReportStatusFilter("");
    setSelectedRegionFilter("");
    setSelectedDistrictFilter("");
    setAppliedRegionFilter("");
    setAppliedDistrictFilter("");
    setAssetStateFilter("");
    resetAdvancedVisualizationFilters();
  }

  function handleApplyGeoFilters() {
    setAppliedRegionFilter(selectedRegionFilter);
    setAppliedDistrictFilter(selectedDistrictFilter);
    setSelection(null);
    setInfo("Filtros del mapa aplicados.");
  }

  function handleClearGeoFilters() {
    setSelectedRegionFilter("");
    setSelectedDistrictFilter("");
    setAppliedRegionFilter("");
    setAppliedDistrictFilter("");
    setAssetStateFilter("");
    setAssetTypeFilter("");
    setReportStatusFilter("");
    setSelection(null);
    setInfo("Filtros del mapa limpiados.");
  }

  function handleApplyProjectSelection() {
    if (!projectPickerId) {
      setError("No hay proyecto disponible para este modo.");
      return;
    }
    setActiveProjectId(projectPickerId);
    setSelection(null);
    const project = projects.find((item) => item.id === projectPickerId);
    setInfo(project ? `Proyecto activo: ${project.name}` : "Proyecto aplicado.");
  }

  function handleOpenCreateProject() {
    setProjectModalMode("create");
    setProjectForm({
      ...EMPTY_PROJECT_FORM,
      recordType: mapMode === "eventos" ? "eventos" : mapMode === "acciones" ? "mantenimiento" : "senalizacion",
    });
    setProjectModalOpen(true);
    setError("");
  }

  function handleOpenEditProject() {
    if (!activeProject) {
      setError("No hay proyecto activo para modificar.");
      return;
    }
    setProjectModalMode("edit");
    setProjectForm(mapProjectToForm(activeProject));
    setProjectModalOpen(true);
    setError("");
  }

  function handleCloseProjectModal() {
    setProjectModalOpen(false);
    setProjectModalSubmitting(false);
  }

  async function handleSubmitProjectModal() {
    if (!projectForm.name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }
    try {
      setProjectModalSubmitting(true);
      setError("");
      const payload = toProjectPayload(projectForm);
      let saved: ProjectRecord | null = null;

      if (projectModalMode === "edit") {
        if (!activeProjectId) {
          setError("No hay proyecto activo para modificar.");
          return;
        }
        saved = await updateProject(activeProjectId, payload);
        setInfo("Proyecto actualizado.");
      } else {
        saved = await createProject(payload);
        setInfo("Proyecto creado.");
      }

      if (saved) {
        setActiveProjectId(saved.id);
        setProjectPickerId(saved.id);
      }
      setProjectModalOpen(false);
      await loadData();
    } catch (err) {
      handleApiError(err, "No se pudo guardar el proyecto.");
    } finally {
      setProjectModalSubmitting(false);
    }
  }

  async function handleSearchAddress() {
    const query = searchQuery.trim();
    if (!query) return;
    const map = mapRef.current;
    if (!map) return;

    try {
      setSearchingAddress(true);
      setError("");
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pe&addressdetails=0&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setError("No se pudo buscar la direccion en este momento.");
        return;
      }

      const data = (await response.json()) as GeocodeResult[];
      const first = data[0];
      if (!first) {
        setError("No se encontro una ubicacion para esa busqueda.");
        return;
      }

      const lat = Number(first.lat);
      const lng = Number(first.lon);
      if (!isValidCoordinate(lat, lng)) {
        setError("La ubicacion encontrada no es valida.");
        return;
      }

      map.setView([lat, lng], 16, { animate: true });

      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
      const marker = L.marker([lat, lng], {
        title: query,
      }).addTo(map);
      marker.bindPopup(`<div class="map-popup-card"><div class="map-popup-title">${escapeHtml(query)}</div></div>`).openPopup();
      searchMarkerRef.current = marker;
      setInfo(first.display_name ? `Ubicacion encontrada: ${first.display_name}` : "Ubicacion encontrada.");
    } catch {
      setError("No se pudo buscar la direccion.");
    } finally {
      setSearchingAddress(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</p> : null}

      <div className="map-page-fullbleed">
        <div className="map-page-frame">
          <div className="map-workspace">
          <div ref={mapContainerRef} className="map-canvas" />
          {createMode !== "none" && !showCreatePanel ? <div className="map-registro-hint">Haz click en el mapa para colocar la ubicacion.</div> : null}

          <div className="map-overlay-top">
            <div className="map-overlay-row">
              <div className="map-overlay-stack">
                <div className="map-floating-main-row">
                  <div className="map-floating-search-row">
                    <input
                      className="map-floating-search-input"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleSearchAddress();
                        }
                      }}
                      placeholder="Buscar un lugar..."
                    />
                    <button
                      type="button"
                      className="map-floating-toggle map-floating-toggle--dark"
                      onClick={handleSearchAddress}
                      disabled={searchingAddress || !searchQuery.trim()}
                    >
                      {searchingAddress ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                  <div className="map-floating-mode-row">
                    <button
                      type="button"
                      className={`map-mode-btn map-mode-btn--inventario ${mapMode === "inventario" ? "map-mode-btn--active" : ""}`}
                      onClick={() => applyMapMode("inventario")}
                    >
                      Inventario
                    </button>
                    <button
                      type="button"
                      className={`map-mode-btn map-mode-btn--acciones ${mapMode === "acciones" ? "map-mode-btn--active" : ""}`}
                      onClick={() => applyMapMode("acciones")}
                    >
                      Intervenciones
                    </button>
                    <button
                      type="button"
                      className={`map-mode-btn map-mode-btn--eventos ${mapMode === "eventos" ? "map-mode-btn--active" : ""}`}
                      onClick={() => applyMapMode("eventos")}
                    >
                      Evento
                    </button>
                  </div>
                </div>

                <div className="map-floating-project-row">
                  <div className="map-project-chip">
                    <span className="map-project-label">Registro</span>
                    <select
                      className="map-project-select"
                      value={projectPickerId}
                      disabled={!projectsForMode.length}
                      onChange={(event) => setProjectPickerId(event.target.value)}
                    >
                      {projectsForMode.length ? null : <option value="">Sin registros</option>}
                      {projectsForMode.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`map-project-actions map-project-actions--${mapMode}`}>
                    <button type="button" className="map-floating-toggle map-floating-toggle--project-action" onClick={handleOpenCreateProject}>
                      Crear
                    </button>
                    <button
                      type="button"
                      className="map-floating-toggle map-floating-toggle--project-action"
                      onClick={handleOpenEditProject}
                      disabled={!activeProjectId || !projectsForMode.length}
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      className="map-floating-toggle map-floating-toggle--project-action"
                      onClick={handleApplyProjectSelection}
                      disabled={!canApplyProjectChange}
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
                <p className="map-project-active">Activo: {activeProject?.name || "Sin proyecto"}</p>

                <div className="map-floating-toggle-row">
                  <button
                    type="button"
                    className={`map-floating-toggle ${showVisualPanel ? "map-floating-toggle--active" : ""}`}
                    onClick={handleToggleVisualPanel}
                  >
                    Visualizacion
                  </button>
                  <button
                    type="button"
                    className={`map-floating-toggle map-floating-toggle--dark ${showAddPicker ? "map-floating-toggle--active" : ""}`}
                    onClick={handleToggleCreatePanel}
                  >
                    <span className="map-floating-plus">+</span>
                    Agregar
                  </button>
                </div>

                {showAddPicker ? (
                  <div
                    className="map-add-picker-backdrop"
                    onClick={() => {
                      setShowAddPicker(false);
                      setAddPickerStep("main");
                    }}
                  >
                    <div
                      className="map-add-picker-card"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="map-add-picker-header">
                        <button
                          type="button"
                          className={`map-add-picker-back ${addPickerStep === "marcas" ? "" : "map-add-picker-back--hidden"}`}
                          onClick={() => setAddPickerStep("main")}
                          aria-hidden={addPickerStep === "marcas" ? "false" : "true"}
                          tabIndex={addPickerStep === "marcas" ? 0 : -1}
                        >
                          Volver
                        </button>
                        <h3 className="map-add-picker-title">
                          {addPickerStep === "marcas" ? "Marcas viales" : "Que deseas registrar?"}
                        </h3>
                      </div>

                      {addPickerStep === "main" ? (
                        <div className="map-add-picker-grid map-add-picker-grid--main" role="list">
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            disabled={isEventosMode}
                            onClick={() => handleAddPickerMainChoice("transito")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--transito" aria-hidden="true" />
                            <span className="map-add-picker-text">
                              Senales
                              <br />
                              de transito
                            </span>
                          </button>
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            disabled={isEventosMode}
                            onClick={() => handleAddPickerMainChoice("marcas")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--marcas" aria-hidden="true" />
                            <span className="map-add-picker-text">
                              Marcas
                              <br />
                              viales
                            </span>
                          </button>
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            disabled={isEventosMode}
                            onClick={() => handleAddPickerMainChoice("mobiliario")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--mobiliario" aria-hidden="true" />
                            <span className="map-add-picker-text">
                              Mobiliario
                              <br />
                              vial
                            </span>
                          </button>
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            onClick={() => handleAddPickerMainChoice("eventos")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--eventos" aria-hidden="true" />
                            <span className="map-add-picker-text">Eventos</span>
                          </button>
                        </div>
                      ) : (
                        <div className="map-add-picker-grid map-add-picker-grid--sub" role="list" aria-label="Opciones de marcas viales">
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            onClick={() => handleAddPickerMarcasChoice("pintado")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--pintado" aria-hidden="true" />
                            <span className="map-add-picker-text">
                              Lineas y
                              <br />
                              guionadas
                            </span>
                          </button>
                          <button
                            type="button"
                            className="map-add-picker-option map-add-picker-option--with-icon"
                            onClick={() => handleAddPickerMarcasChoice("senalizacion")}
                            role="listitem"
                          >
                            <span className="map-add-picker-icon map-add-picker-icon--senalizacion" aria-hidden="true" />
                            <span className="map-add-picker-text">
                              Simbologia
                              <br />
                              vial
                            </span>
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        className="map-add-picker-cancel"
                        onClick={() => {
                          setShowAddPicker(false);
                          setAddPickerStep("main");
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}

                {showVisualPanel ? (
                  <div className="map-overlay-card mt-2 max-w-[360px]">
                    <div className="map-panel-group">
                      <p className="map-panel-title">Region y distrito</p>
                      <div className="space-y-2">
                        <select
                          className="field-input !py-[9px]"
                          value={selectedRegionFilter}
                          onChange={(event) => {
                            setSelectedRegionFilter(event.target.value);
                            setSelectedDistrictFilter("");
                          }}
                        >
                          <option value="">Todas las regiones</option>
                          {regionOptions.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                        <select
                          className="field-input !py-[9px]"
                          value={selectedDistrictFilter}
                          onChange={(event) => setSelectedDistrictFilter(event.target.value)}
                        >
                          <option value="">Todos los distritos</option>
                          {districtOptions.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" className="map-action-primary" onClick={handleApplyGeoFilters}>
                          Aplicar seleccion
                        </button>
                        <button type="button" className="map-action-secondary" onClick={handleClearGeoFilters}>
                          Limpiar filtros
                        </button>
                      </div>
                    </div>

                    {!isEventosMode ? (
                      <div className="map-panel-group">
                        <p className="map-panel-title">Estado</p>
                        <div className="map-state-filter-row">
                          <button
                            type="button"
                            className={`map-state-filter-btn ${assetStateFilter === "operativo" ? "map-state-filter-btn--active" : ""}`}
                            onClick={() => setAssetStateFilter((previous) => (previous === "operativo" ? "" : "operativo"))}
                          >
                            Operativa
                          </button>
                          <button
                            type="button"
                            className={`map-state-filter-btn ${assetStateFilter === "deteriorado" ? "map-state-filter-btn--active" : ""}`}
                            onClick={() => setAssetStateFilter((previous) => (previous === "deteriorado" ? "" : "deteriorado"))}
                          >
                            Deteriorada
                          </button>
                          <button
                            type="button"
                            className={`map-state-filter-btn ${assetStateFilter === "no-operativo" ? "map-state-filter-btn--active" : ""}`}
                            onClick={() => setAssetStateFilter((previous) => (previous === "no-operativo" ? "" : "no-operativo"))}
                          >
                            No operativa
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="map-panel-section">
                      <label className="map-panel-check">
                        <input
                          type="checkbox"
                          checked={showLayerTransito}
                          disabled={isEventosMode}
                          onChange={(event) => setShowLayerTransito(event.target.checked)}
                        />
                        Senales transito
                      </label>
                      <label className="map-panel-check">
                        <input
                          type="checkbox"
                          checked={showLayerMarcas}
                          disabled={isEventosMode}
                          onChange={(event) => setShowLayerMarcas(event.target.checked)}
                        />
                        Marcas viales
                      </label>
                      <label className="map-panel-check">
                        <input
                          type="checkbox"
                          checked={showLayerMobiliario}
                          disabled={isEventosMode}
                          onChange={(event) => setShowLayerMobiliario(event.target.checked)}
                        />
                        Mobiliario vial
                      </label>
                      <label className="map-panel-check">
                        <input type="checkbox" checked={showLayerEventos} onChange={(event) => setShowLayerEventos(event.target.checked)} />
                        Eventos
                      </label>
                    </div>

                    <div className="mt-2">
                      <button
                        type="button"
                        className="map-action-primary w-full justify-center"
                        onClick={() => setShowVisualAdvanced((previous) => !previous)}
                      >
                        Configuracion avanzada
                      </button>
                    </div>
                    {showVisualAdvanced ? (
                      <div className="map-panel-advanced mt-3">
                        <div className="map-panel-group">
                          <p className="map-panel-title">Estado de conservacion</p>
                          <label className="map-panel-check">
                            <input
                              type="checkbox"
                              checked={showOperationalAssets}
                              disabled={isEventosMode}
                              onChange={(event) => setShowOperationalAssets(event.target.checked)}
                            />
                            Operativos
                          </label>
                          <label className="map-panel-check">
                            <input
                              type="checkbox"
                              checked={showDeterioratedAssets}
                              disabled={isEventosMode}
                              onChange={(event) => setShowDeterioratedAssets(event.target.checked)}
                            />
                            Deteriorados
                          </label>
                          <label className="map-panel-check">
                            <input
                              type="checkbox"
                              checked={showNoOperationalAssets}
                              disabled={isEventosMode}
                              onChange={(event) => setShowNoOperationalAssets(event.target.checked)}
                            />
                            No operativos
                          </label>
                        </div>
                        <div className="map-panel-group">
                          <p className="map-panel-title">Verificacion de campo</p>
                          <label className="map-panel-check">
                            <input type="checkbox" checked={showWithPhoto} onChange={(event) => setShowWithPhoto(event.target.checked)} />
                            Con fotografia
                          </label>
                          <label className="map-panel-check">
                            <input type="checkbox" checked={showWithoutPhoto} onChange={(event) => setShowWithoutPhoto(event.target.checked)} />
                            Sin fotografia
                          </label>
                        </div>
                        <div className="map-panel-group">
                          <p className="map-panel-title">Filtro de tiempo</p>
                          <label className="map-panel-check">
                            <input type="checkbox" checked={showCurrentItems} onChange={(event) => setShowCurrentItems(event.target.checked)} />
                            Activos ahora
                          </label>
                          <label className="map-panel-check">
                            <input type="checkbox" checked={showProgrammedItems} onChange={(event) => setShowProgrammedItems(event.target.checked)} />
                            Programados
                          </label>
                          <label className="map-panel-check">
                            <input type="checkbox" checked={!showFinalizedItems} onChange={(event) => setShowFinalizedItems(!event.target.checked)} />
                            Sin finalizados
                          </label>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="map-action-secondary w-full justify-center"
                            onClick={() => {
                              resetVisualizationFilters();
                              setEditMode(false);
                              setCreateMode("none");
                              resetRegistrationDraft(null);
                              setShowCreatePanel(false);
                              setDraftPoint(null);
                              setSelection(null);
                            }}
                          >
                            Restablecer
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showMetradoPanel ? (
                  <div className="map-overlay-card mt-2 max-w-[540px]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-ink">Metrado de pintura</h3>
                      <button type="button" className="map-action-secondary" onClick={handleCloseMetrado}>
                        Cerrar
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-ink/70">
                      {metradoDrawing
                        ? "Modo trazado activo: haz click en el mapa para agregar puntos."
                        : "Inicia trazado para medir longitud sobre el mapa."}
                    </p>
                    <p className="mt-1 text-sm text-ink/70">Proyecto: {activeProject?.name || "Sin proyecto"}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="field-label">Nombre del trazado</span>
                        <input
                          className="field-input !py-[9px]"
                          value={metradoName}
                          onChange={(event) => setMetradoName(event.target.value)}
                          placeholder="Ej: Av. Lima - tramo 1"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="field-label">Ancho (m)</span>
                        <input
                          className="field-input !py-[9px]"
                          type="number"
                          min="0"
                          step="0.1"
                          value={metradoWidthM}
                          onChange={(event) => setMetradoWidthM(event.target.value)}
                        />
                      </label>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="map-action-primary" onClick={handleStartMetrado} disabled={metradoDrawing}>
                        Iniciar
                      </button>
                      <button
                        type="button"
                        className="map-action-secondary"
                        onClick={handleFinishMetrado}
                        disabled={!metradoDrawing}
                      >
                        Finalizar
                      </button>
                      <button
                        type="button"
                        className="map-action-secondary"
                        onClick={handleUndoMetrado}
                        disabled={!metradoPoints.length}
                      >
                        Deshacer
                      </button>
                      <button
                        type="button"
                        className="map-action-secondary"
                        onClick={handleClearMetrado}
                        disabled={!metradoPoints.length}
                      >
                        Limpiar
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="map-action-primary"
                        onClick={handleRegisterMetrado}
                        disabled={!canRegisterMetrado || metradoRecordsSaving}
                      >
                        {metradoRecordsSaving ? "Guardando..." : "Registrar"}
                      </button>
                      <button type="button" className="map-action-secondary" onClick={handleOpenMetradoRecords}>
                        Trazos ({metradoRecords.length})
                      </button>
                    </div>
                    {!activeProjectId ? (
                      <p className="mt-1 text-xs text-amber-700">Selecciona un proyecto para guardar los trazados.</p>
                    ) : null}
                    {selectedMetradoRecord ? (
                      <p className="mt-1 text-xs text-ink/70">
                        Seleccionado: {selectedMetradoRecord.name} ({selectedMetradoRecord.distanceM.toFixed(1)} m)
                      </p>
                    ) : null}
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <article className="map-mini-stat">
                        <p className="map-mini-label">Puntos</p>
                        <p className="map-mini-value">{metradoPoints.length}</p>
                      </article>
                      <article className="map-mini-stat">
                        <p className="map-mini-label">Longitud</p>
                        <p className="map-mini-value">{metradoLengthM.toFixed(1)} m</p>
                      </article>
                      <article className="map-mini-stat">
                        <p className="map-mini-label">Area estimada</p>
                        <p className="map-mini-value">{metradoAreaM2.toFixed(1)} m2</p>
                      </article>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="map-stats-stack">
                <article className="map-mini-stat">
                  <p className="map-mini-label">Activos</p>
                  <p className="map-mini-value">{counters.assetsCount}</p>
                </article>
                <article className="map-mini-stat">
                  <p className="map-mini-label">Reportes</p>
                  <p className="map-mini-value">{counters.reportsCount}</p>
                </article>
                <article className="map-mini-stat map-mini-stat--warn">
                  <p className="map-mini-label">Pendientes</p>
                  <p className="map-mini-value">{counters.pendingReports}</p>
                </article>
              </div>
            </div>
          </div>

          <div className="map-overlay-bottom">
            {showCreatePanel && registrationKind ? (
              <div className="map-overlay-card map-registro-panel">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-ink">{registrationKindLabel(registrationKind)}</h3>
                  <span className="map-registro-chip">{registrationKind === "eventos" ? "Reporte" : "Inventario"}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  {draftPoint
                    ? `Coordenadas: ${draftPoint[0].toFixed(6)}, ${draftPoint[1].toFixed(6)}`
                    : "Haz click en el mapa para elegir coordenadas."}
                </p>
                <p className="mt-1 text-sm text-ink/70">Proyecto: {activeProject?.name || "Sin proyecto"}</p>

                <div className="map-registro-box mt-3 grid gap-2 sm:grid-cols-2">
                  <label className="block space-y-1">
                    <span className="field-label">Fecha</span>
                    <input type="date" className="field-input !py-[9px]" value={registrationDate} onChange={(event) => setRegistrationDate(event.target.value)} />
                  </label>
                  <label className="block space-y-1">
                    <span className="field-label">Distrito</span>
                    <input
                      className="field-input !py-[9px]"
                      placeholder="Ej: Miraflores"
                      value={registrationDistrict}
                      onChange={(event) => setRegistrationDistrict(event.target.value)}
                    />
                  </label>
                </div>

                {registrationKind === "transito" ? (
                  <div className="mt-3 space-y-3">
                    <div className="map-registro-box">
                      <p className="map-panel-title">Categoria</p>
                      <div className="map-registro-cat-grid mt-2">
                        <button
                          type="button"
                          className={`map-registro-cat ${registrationCategory === "preventiva" ? "map-registro-cat--active" : ""}`}
                          onClick={() => {
                            setRegistrationCategory("preventiva");
                            setRegistrationIconId("");
                          }}
                        >
                          <span className="map-registro-cat-icon map-registro-cat-icon--preventiva" aria-hidden="true" />
                          Preventiva
                        </button>
                        <button
                          type="button"
                          className={`map-registro-cat ${registrationCategory === "reglamentaria" ? "map-registro-cat--active" : ""}`}
                          onClick={() => {
                            setRegistrationCategory("reglamentaria");
                            setRegistrationIconId("");
                          }}
                        >
                          <span className="map-registro-cat-icon map-registro-cat-icon--reglamentaria" aria-hidden="true" />
                          Reglamentaria
                        </button>
                        <button
                          type="button"
                          className={`map-registro-cat ${registrationCategory === "informativa" ? "map-registro-cat--active" : ""}`}
                          onClick={() => {
                            setRegistrationCategory("informativa");
                            setRegistrationIconId("");
                          }}
                        >
                          <span className="map-registro-cat-icon map-registro-cat-icon--informativa" aria-hidden="true" />
                          Informativa
                        </button>
                      </div>
                    </div>
                    <div className="map-registro-box">
                      <input
                        className="field-input !py-[9px]"
                        placeholder="Buscar icono..."
                        disabled={!registrationCategory}
                        value={registrationIconSearch}
                        onChange={(event) => setRegistrationIconSearch(event.target.value)}
                      />
                      {!registrationCategory ? <p className="mt-2 text-xs font-semibold text-ink/70">Selecciona una categoria primero.</p> : null}
                      {registrationCategory ? (
                        <div className="map-registro-icon-grid mt-2">
                          {filteredRegistrationIcons.map((icon) => (
                            <button
                              key={icon.id}
                              type="button"
                              className={`map-registro-icon-option ${registrationIconId === icon.id ? "map-registro-icon-option--active" : ""}`}
                              onClick={() => setRegistrationIconId(icon.id)}
                            >
                              <span className="map-registro-icon-thumb" style={{ backgroundImage: `url(${icon.src})` }} />
                              <span>
                                <span className="map-registro-icon-code">{icon.code}</span>
                                <span className="map-registro-icon-label">{icon.label}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="map-registro-box grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ancho (cm)"
                        value={registrationWidth}
                        onChange={(event) => setRegistrationWidth(event.target.value)}
                      />
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Largo (cm)"
                        value={registrationLength}
                        onChange={(event) => setRegistrationLength(event.target.value)}
                      />
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Precio (S/)"
                        value={registrationPrice}
                        onChange={(event) => setRegistrationPrice(event.target.value)}
                      />
                      <input className="field-input !py-[9px]" placeholder="Icono seleccionado" value={selectedRegistrationIcon?.label || ""} readOnly />
                    </div>
                    <div className="map-registro-box">
                      <p className="map-panel-title">Lamina y soporte</p>
                      <div className="map-registro-pill-row mt-1">
                        {["I", "IV", "XI"].map((value) => (
                          <button
                            key={`lamina-${value}`}
                            type="button"
                            className={`map-registro-pill ${registrationLamina === value ? "map-registro-pill--active" : ""}`}
                            onClick={() => setRegistrationLamina(value)}
                          >
                            Lamina {value}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`map-registro-pill ${registrationSoporte === "si" ? "map-registro-pill--active" : ""}`}
                          onClick={() => setRegistrationSoporte("si")}
                        >
                          Soporte Si
                        </button>
                        <button
                          type="button"
                          className={`map-registro-pill ${registrationSoporte === "no" ? "map-registro-pill--active" : ""}`}
                          onClick={() => setRegistrationSoporte("no")}
                        >
                          Soporte No
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {registrationKind === "marcas" ? (
                  <div className="mt-3 space-y-3">
                    <div className="map-registro-box">
                      <input
                        className="field-input !py-[9px]"
                        placeholder="Buscar icono..."
                        value={registrationIconSearch}
                        onChange={(event) => setRegistrationIconSearch(event.target.value)}
                      />
                      <div className="map-registro-icon-grid mt-2">
                        {filteredRegistrationIcons.map((icon) => (
                          <button
                            key={icon.id}
                            type="button"
                            className={`map-registro-icon-option ${registrationIconId === icon.id ? "map-registro-icon-option--active" : ""}`}
                            onClick={() => setRegistrationIconId(icon.id)}
                          >
                            <span className="map-registro-icon-thumb" style={{ backgroundImage: `url(${icon.src})` }} />
                            <span>
                              <span className="map-registro-icon-code">{icon.code}</span>
                              <span className="map-registro-icon-label">{icon.label}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="map-registro-box grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ancho (m)"
                        value={registrationWidth}
                        onChange={(event) => setRegistrationWidth(event.target.value)}
                      />
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Largo (m)"
                        value={registrationLength}
                        onChange={(event) => setRegistrationLength(event.target.value)}
                      />
                      <input
                        className="field-input !py-[9px]"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Precio (S/)"
                        value={registrationPrice}
                        onChange={(event) => setRegistrationPrice(event.target.value)}
                      />
                      <input className="field-input !py-[9px]" placeholder="Area (m2)" value={registrationAreaM2 ? registrationAreaM2.toFixed(2) : "-"} readOnly />
                    </div>
                  </div>
                ) : null}

                {registrationKind === "mobiliario" ? (
                  <div className="mt-3 space-y-3">
                    <div className="map-registro-box">
                      <p className="map-panel-title">Tipo</p>
                      <div className="map-registro-pill-row mt-1">
                        {["Bolardo", "Tachas", "Tachon"].map((value) => (
                          <button
                            key={`mob-${value}`}
                            type="button"
                            className={`map-registro-pill ${registrationMobiliarioName === value ? "map-registro-pill--active" : ""}`}
                            onClick={() => setRegistrationMobiliarioName(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {registrationKind === "eventos" ? (
                  <div className="map-registro-box mt-3 grid gap-2 sm:grid-cols-2">
                    <select className="field-input !py-[9px]" value={registrationEventType} onChange={(event) => setRegistrationEventType(event.target.value)}>
                      <option value="falta">Falta de senal</option>
                      <option value="danada">Senal danada</option>
                      <option value="otro">Otro</option>
                    </select>
                    <input
                      className="field-input !py-[9px]"
                      placeholder="Descripcion"
                      value={registrationDescription}
                      onChange={(event) => setRegistrationDescription(event.target.value)}
                    />
                  </div>
                ) : null}

                {registrationKind !== "eventos" ? (
                  <div className="map-registro-box mt-3">
                    <p className="map-panel-title">Estado fisico</p>
                    <div className="map-registro-pill-row mt-1">
                      <button
                        type="button"
                        className={`map-registro-pill ${registrationPhysicalState === "operativa" ? "map-registro-pill--active map-registro-pill--ok" : ""}`}
                        onClick={() => setRegistrationPhysicalState("operativa")}
                      >
                        Operativa
                      </button>
                      <button
                        type="button"
                        className={`map-registro-pill ${registrationPhysicalState === "deteriorada" ? "map-registro-pill--active map-registro-pill--warn" : ""}`}
                        onClick={() => setRegistrationPhysicalState("deteriorada")}
                      >
                        Deteriorada
                      </button>
                      <button
                        type="button"
                        className={`map-registro-pill ${registrationPhysicalState === "no_operativa" ? "map-registro-pill--active map-registro-pill--bad" : ""}`}
                        onClick={() => setRegistrationPhysicalState("no_operativa")}
                      >
                        No operativa
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="map-registro-box mt-3">
                  <p className="map-panel-title">Inspeccion</p>
                  <label className="map-registro-upload-btn mt-1">
                    <span>{registrationPhotoName ? "Imagen: " : "Subir imagen"}</span>
                    <strong>{registrationPhotoName || "Seleccionar archivo"}</strong>
                    <input type="file" accept="image/*" onChange={handleRegistrationPhotoChange} />
                  </label>
                  <p className="map-registro-upload-help">Si no se adjunta imagen, el registro quedara sin verificacion visual.</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="map-action-primary" onClick={handleCreateFromMap} disabled={submitting || !canSubmitRegistration}>
                    {submitting ? "Guardando..." : "Registrar"}
                  </button>
                  {draftPoint ? (
                    <button type="button" className="map-action-secondary" onClick={() => setDraftPoint(null)}>
                      Limpiar punto
                    </button>
                  ) : null}
                  <button type="button" className="map-action-secondary" onClick={handleCloseCreatePanel}>
                    Cerrar
                  </button>
                </div>
              </div>
            ) : null}

            {selectedAsset || selectedReport ? (
              <div className="map-overlay-card">
                <h3 className="text-base font-extrabold text-ink">
                  {selectedAsset ? "Editar activo seleccionado" : "Editar reporte seleccionado"}
                </h3>
                {selectedAsset ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    <input className="field-input !py-[9px]" value={selectedAssetName} onChange={(e) => setSelectedAssetName(e.target.value)} placeholder="Nombre" />
                    <input className="field-input !py-[9px]" value={selectedAssetState} onChange={(e) => setSelectedAssetState(e.target.value)} placeholder="Estado" />
                    <input className="field-input !py-[9px]" value={selectedAssetDistrict} onChange={(e) => setSelectedAssetDistrict(e.target.value)} placeholder="Distrito" />
                  </div>
                ) : (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    <input className="field-input !py-[9px]" value={selectedReportStatus} onChange={(e) => setSelectedReportStatus(e.target.value)} placeholder="Estado" />
                    <input className="field-input !py-[9px]" value={selectedReportDistrict} onChange={(e) => setSelectedReportDistrict(e.target.value)} placeholder="Distrito" />
                    <input className="field-input !py-[9px]" value={selectedReportDescription} onChange={(e) => setSelectedReportDescription(e.target.value)} placeholder="Descripcion" />
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="map-action-primary" onClick={handleSaveSelection} disabled={submitting}>
                    {submitting ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button type="button" className="btn-danger" onClick={handleDeleteSelection} disabled={submitting}>
                    Eliminar
                  </button>
                  <button type="button" className="map-action-secondary" onClick={() => setSelection(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            ) : null}
          </div>

            <div className="map-legend" aria-hidden="true">
              <p className="map-legend-title">Estados</p>
              <p className="map-legend-item">
                <span className="map-legend-dot map-legend-dot--operativa" />
                Operativa
              </p>
              <p className="map-legend-item">
                <span className="map-legend-dot map-legend-dot--deteriorada" />
                Deteriorada
              </p>
              <p className="map-legend-item">
                <span className="map-legend-dot map-legend-dot--no-operativa" />
                No operativa
              </p>
            </div>
          </div>
        </div>
      </div>

      {metradoRecordsOpen ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/45 px-4 py-6">
          <div className="panel-soft w-full max-w-[720px] px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold text-ink">Trazos de metrado</h3>
              <button type="button" className="map-action-secondary" onClick={() => setMetradoRecordsOpen(false)}>
                Cerrar
              </button>
            </div>
            <p className="mt-1 text-sm text-ink/70">Proyecto: {activeProject?.name || "Sin proyecto"}</p>
            {metradoRecords.length ? (
              <div className="mt-4 max-h-[52vh] space-y-2 overflow-auto pr-1">
                {metradoRecords.map((record) => {
                  const selected = record.id === selectedMetradoId;
                  return (
                    <article
                      key={record.id}
                      className={`rounded-xl border px-3 py-3 ${selected ? "border-amber-300 bg-amber-50/70" : "border-slate-200 bg-white"}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-ink">{record.name}</p>
                          <p className="text-xs text-ink/70">Registrado: {toDateLabel(record.createdAt)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="map-action-secondary" onClick={() => handleFocusMetradoRecord(record.id)}>
                            Enfocar
                          </button>
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => {
                              void handleDeleteMetradoRecord(record.id);
                            }}
                            disabled={metradoRecordsSaving}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        <p className="text-xs text-ink/70">
                          Longitud: <strong className="text-ink">{record.distanceM.toFixed(1)} m</strong>
                        </p>
                        <p className="text-xs text-ink/70">
                          Area: <strong className="text-ink">{record.areaM2.toFixed(1)} m2</strong>
                        </p>
                        <p className="text-xs text-ink/70">
                          Estado:{" "}
                          <strong className="text-ink">{record.inspectionPending ? "Inspeccion pendiente" : "Inspeccion completa"}</strong>
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-ink/70">
                Este proyecto aun no tiene trazos de metrado registrados.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {projectModalOpen ? (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/45 px-4 py-6">
          <div className="panel-soft w-full max-w-[560px] px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold text-ink">
                {projectModalMode === "edit" ? "Modificar proyecto" : "Crear proyecto"}
              </h3>
              <button type="button" className="map-action-secondary" onClick={handleCloseProjectModal} disabled={projectModalSubmitting}>
                Cerrar
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1 sm:col-span-2">
                <span className="field-label">Nombre</span>
                <input
                  className="field-input !py-[9px]"
                  value={projectForm.name}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, name: event.target.value }))}
                  placeholder="Nombre del proyecto"
                />
              </label>

              <label className="block space-y-1">
                <span className="field-label">Ano</span>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  className="field-input !py-[9px]"
                  value={projectForm.year}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, year: event.target.value }))}
                  placeholder="2026"
                />
              </label>

              <label className="block space-y-1">
                <span className="field-label">Tipo</span>
                <select
                  className="field-input !py-[9px]"
                  value={projectForm.recordType}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, recordType: event.target.value }))}
                >
                  {recordTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="field-label">Inicio</span>
                <input
                  type="date"
                  className="field-input !py-[9px]"
                  value={projectForm.startDate}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, startDate: event.target.value }))}
                />
              </label>

              <label className="block space-y-1">
                <span className="field-label">Fin</span>
                <input
                  type="date"
                  className="field-input !py-[9px]"
                  value={projectForm.endDate}
                  onChange={(event) => setProjectForm((previous) => ({ ...previous, endDate: event.target.value }))}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" className="map-action-secondary" onClick={handleCloseProjectModal} disabled={projectModalSubmitting}>
                Cancelar
              </button>
              <button type="button" className="map-action-primary" onClick={handleSubmitProjectModal} disabled={projectModalSubmitting}>
                {projectModalSubmitting ? "Guardando..." : projectModalMode === "edit" ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

