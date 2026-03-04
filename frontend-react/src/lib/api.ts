const TOKEN_KEY = "urbbisAuthToken";
const DEFAULT_API_BASE_URL = "http://localhost:3001";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  district: string;
  region: string;
};

export type LoginResponse = {
  token: string;
  user: SessionUser;
};

export class ApiError extends Error {
  status: number;
  payload: string;

  constructor(message: string, status: number, payload = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getApiBaseUrl(): string {
  return String(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function saveAuthToken(token: string): void {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export type ProjectRecord = {
  id: string;
  legacyId?: string | null;
  name: string;
  district?: string | null;
  year?: number | null;
  recordType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  data?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPayload = {
  legacyId?: string;
  name: string;
  district?: string;
  year?: number;
  recordType?: string;
  startDate?: string;
  endDate?: string;
  data?: Record<string, unknown>;
};

export type AssetRecord = {
  id: string;
  legacyId?: number | null;
  projectId?: string | null;
  type: string;
  name?: string | null;
  category?: string | null;
  icon?: string | null;
  state?: string | null;
  statePhysical?: string | null;
  lat: number;
  lng: number;
  district?: string | null;
  region?: string | null;
  price?: number | null;
  installedAt?: string | null;
  width?: number | null;
  length?: number | null;
  areaM2?: number | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetPayload = {
  legacyId?: number;
  projectId?: string;
  type: string;
  name?: string;
  category?: string;
  icon?: string;
  state?: string;
  statePhysical?: string;
  lat: number;
  lng: number;
  district?: string;
  region?: string;
  price?: number;
  installedAt?: string;
  width?: number;
  length?: number;
  areaM2?: number;
  photoUrl?: string;
};

export type ReportRecord = {
  id: string;
  legacyId?: number | null;
  projectId?: string | null;
  userId?: string | null;
  type: string;
  status?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  district?: string | null;
  region?: string | null;
  lat: number;
  lng: number;
  userName?: string | null;
  userEmail?: string | null;
  userDni?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReportPayload = {
  legacyId?: number;
  projectId?: string;
  userId?: string;
  type: string;
  lat: number;
  lng: number;
  description?: string;
  status?: string;
  district?: string;
  region?: string;
  userName?: string;
  userEmail?: string;
  userDni?: string;
  photoUrl?: string;
};

export type IconCatalogCategory = "preventiva" | "reglamentaria" | "informativa";

export type IconCatalogIcon = {
  id: string;
  label: string;
  code: string;
  src: string;
  category?: IconCatalogCategory;
};

export type IconCatalogResponse = {
  horizontal: IconCatalogIcon[];
  vertical: IconCatalogIcon[];
  generatedAt?: string;
};

export type PlanProjectRecord = {
  id: string;
  planId: string;
  projectLegacyId?: string | null;
  name: string;
  status: string;
  assignedAmount: number;
  executedAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type PlanRecord = {
  id: string;
  ownerKey: string;
  name: string;
  year: number;
  deadline?: string | null;
  status: string;
  amount: number;
  executed: number;
  createdAt: string;
  updatedAt: string;
  projects: PlanProjectRecord[];
};

export type PlanProjectPayload = {
  projectLegacyId?: string;
  name: string;
  status: string;
  assignedAmount: number;
  executedAmount: number;
};

export type PlanPayload = {
  ownerKey?: string;
  name: string;
  year: number;
  deadline?: string;
  status?: string;
  amount: number;
  executed?: number;
  projects?: PlanProjectPayload[];
};

export type PlanMutationResponse = {
  plan: PlanRecord;
  available?: number;
};

export type BudgetRecord = {
  id: string;
  ownerKey: string;
  year: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetPayload = {
  ownerKey?: string;
  year: number;
  total: number;
};

export type InterventionRecord = {
  id: string;
  planId: string;
  name: string;
  actionId?: string | null;
  actionName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  amount: number;
  phase: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InterventionPayload = {
  planId: string;
  name?: string;
  actionId?: string;
  actionName?: string;
  projectId?: string;
  projectName?: string;
  amount?: number;
  phase?: string;
  startDate?: string;
  endDate?: string;
};

function withQuery(path: string, query: QueryParams = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const raw = params.toString();
  return raw ? `${path}?${raw}` : path;
}

async function parseErrorPayload(res: Response): Promise<{ message: string; payload: string }> {
  const payload = await res.text().catch(() => "");
  if (!payload) {
    return { message: `Error HTTP ${res.status}`, payload: "" };
  }
  try {
    const parsed = JSON.parse(payload) as { error?: string; message?: string };
    const message = parsed.error || parsed.message || payload;
    return { message, payload };
  } catch {
    return { message: payload, payload };
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, { ...init, headers });
  if (!res.ok) {
    if (res.status === 401) clearAuthToken();
    const { message, payload } = await parseErrorPayload(res);
    throw new ApiError(message, res.status, payload);
  }

  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me(): Promise<SessionUser> {
  return request<SessionUser>("/auth/me");
}

export async function getProjects(query: QueryParams = {}): Promise<ProjectRecord[]> {
  return request<ProjectRecord[]>(withQuery("/projects", query));
}

export async function createProject(payload: ProjectPayload): Promise<ProjectRecord> {
  return request<ProjectRecord>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: string, payload: ProjectPayload): Promise<ProjectRecord> {
  return request<ProjectRecord>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await request<null>(`/projects/${id}`, {
    method: "DELETE",
  });
}

export async function getAssets(query: QueryParams = {}): Promise<AssetRecord[]> {
  return request<AssetRecord[]>(withQuery("/assets", query));
}

export async function getIconCatalog(): Promise<IconCatalogResponse> {
  return request<IconCatalogResponse>("/catalog/icons");
}

export async function createAsset(payload: AssetPayload): Promise<AssetRecord> {
  return request<AssetRecord>("/assets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAsset(id: string, payload: Partial<AssetPayload>): Promise<AssetRecord> {
  return request<AssetRecord>(`/assets/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAsset(id: string): Promise<void> {
  await request<null>(`/assets/${id}`, {
    method: "DELETE",
  });
}

export async function getReports(query: QueryParams = {}): Promise<ReportRecord[]> {
  return request<ReportRecord[]>(withQuery("/reports", query));
}

export async function createReport(payload: ReportPayload): Promise<ReportRecord> {
  return request<ReportRecord>("/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReport(id: string, payload: Partial<ReportPayload>): Promise<ReportRecord> {
  return request<ReportRecord>(`/reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteReport(id: string): Promise<void> {
  await request<null>(`/reports/${id}`, {
    method: "DELETE",
  });
}

export async function getPlans(query: QueryParams = {}): Promise<PlanRecord[]> {
  return request<PlanRecord[]>(withQuery("/plans", query));
}

export async function createPlan(payload: PlanPayload): Promise<PlanMutationResponse> {
  return request<PlanMutationResponse>("/plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePlan(id: string, payload: PlanPayload): Promise<PlanMutationResponse> {
  return request<PlanMutationResponse>(`/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePlan(id: string): Promise<void> {
  await request<null>(`/plans/${id}`, {
    method: "DELETE",
  });
}

export async function getBudgets(query: QueryParams = {}): Promise<BudgetRecord[]> {
  return request<BudgetRecord[]>(withQuery("/budgets", query));
}

export async function upsertBudget(payload: BudgetPayload): Promise<BudgetRecord> {
  return request<BudgetRecord>("/budgets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getInterventions(query: QueryParams = {}): Promise<InterventionRecord[]> {
  return request<InterventionRecord[]>(withQuery("/interventions", query));
}

export async function createIntervention(payload: InterventionPayload): Promise<InterventionRecord> {
  return request<InterventionRecord>("/interventions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateIntervention(id: string, payload: InterventionPayload): Promise<InterventionRecord> {
  return request<InterventionRecord>(`/interventions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteIntervention(id: string): Promise<void> {
  await request<null>(`/interventions/${id}`, {
    method: "DELETE",
  });
}
