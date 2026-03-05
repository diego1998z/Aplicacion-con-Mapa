(() => {
  const DEFAULT_BASE = "https://aplicacion-con-mapa-production.up.railway.app";
  const DEFAULT_LOCAL_BASE = "http://localhost:3001";

  function isLocalHost() {
    try {
      const host = String(window.location && window.location.hostname || "").toLowerCase();
      return host === "localhost" || host === "127.0.0.1";
    } catch (e) {
      return false;
    }
  }

  function getBaseUrl() {
    try {
      const stored = localStorage.getItem("urbbisApiBase");
      if (stored) {
        if (isLocalHost() && stored === DEFAULT_BASE) {
          return DEFAULT_LOCAL_BASE;
        }
        return stored;
      }
      return isLocalHost() ? DEFAULT_LOCAL_BASE : DEFAULT_BASE;
    } catch (e) {
      return isLocalHost() ? DEFAULT_LOCAL_BASE : DEFAULT_BASE;
    }
  }

  function setBaseUrl(url) {
    try {
      if (!url) {
        localStorage.removeItem("urbbisApiBase");
        return;
      }
      localStorage.setItem("urbbisApiBase", String(url));
    } catch (e) {}
  }

  function getToken() {
    try {
      return localStorage.getItem("urbbisAuthToken") || "";
    } catch (e) {
      return "";
    }
  }

  function setToken(token) {
    try {
      if (!token) {
        localStorage.removeItem("urbbisAuthToken");
        return;
      }
      localStorage.setItem("urbbisAuthToken", String(token));
    } catch (e) {}
  }

  function clearToken() {
    setToken("");
  }

  async function request(path, options = {}) {
    const base = getBaseUrl();
    const url = base.replace(/\/$/, "") + path;
    const headers = Object.assign({}, options.headers || {});
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, Object.assign({}, options, { headers }));
    if (!res.ok) {
      if (res.status === 401) {
        clearToken();
      }
      const text = await res.text().catch(() => "");
      let message = text || `HTTP ${res.status}`;
      try {
        const parsed = text ? JSON.parse(text) : null;
        if (parsed && typeof parsed.error === "string" && parsed.error.trim()) {
          message = parsed.error.trim();
        }
      } catch (e) {}
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  function jsonBody(data) {
    return {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {})
    };
  }

  const api = {
    getBaseUrl,
    setBaseUrl,
    getToken,
    setToken,
    clearToken,
    login: (data) => request("/auth/login", { method: "POST", ...jsonBody(data) }),
    register: (data) => request("/auth/register", { method: "POST", ...jsonBody(data) }),
    me: () => request("/auth/me"),
    getProjects: () => request("/projects"),
    createProject: (data) => request("/projects", { method: "POST", ...jsonBody(data) }),
    updateProject: (id, data) => request(`/projects/${id}`, { method: "PUT", ...jsonBody(data) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),
    getAssets: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/assets${suffix}`);
    },
    createAsset: (data) => request("/assets", { method: "POST", ...jsonBody(data) }),
    updateAsset: (id, data) => request(`/assets/${id}`, { method: "PUT", ...jsonBody(data) }),
    deleteAsset: (id) => request(`/assets/${id}`, { method: "DELETE" }),
    getReports: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/reports${suffix}`);
    },
    createReport: (data) => request("/reports", { method: "POST", ...jsonBody(data) }),
    updateReport: (id, data) => request(`/reports/${id}`, { method: "PUT", ...jsonBody(data) }),
    deleteReport: (id) => request(`/reports/${id}`, { method: "DELETE" }),
    getPlans: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/plans${suffix}`);
    },
    createPlan: (data) => request("/plans", { method: "POST", ...jsonBody(data) }),
    updatePlan: (id, data) => request(`/plans/${id}`, { method: "PUT", ...jsonBody(data) }),
    deletePlan: (id) => request(`/plans/${id}`, { method: "DELETE" }),
    getInterventions: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/interventions${suffix}`);
    },
    createIntervention: (data) => request("/interventions", { method: "POST", ...jsonBody(data) }),
    updateIntervention: (id, data) => request(`/interventions/${id}`, { method: "PUT", ...jsonBody(data) }),
    deleteIntervention: (id) => request(`/interventions/${id}`, { method: "DELETE" }),
    getBudgets: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/budgets${suffix}`);
    },
    upsertBudget: (data) => request("/budgets", { method: "POST", ...jsonBody(data) }),
    chatPresupuestoAI: (data) => request("/ai/presupuesto-chat", { method: "POST", ...jsonBody(data) })
  };

  window.UrbbisApi = api;
})();
