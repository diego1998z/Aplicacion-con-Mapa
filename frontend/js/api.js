(() => {
  const DEFAULT_BASE = "http://localhost:3001";

  function getBaseUrl() {
    try {
      return localStorage.getItem("urbbisApiBase") || DEFAULT_BASE;
    } catch (e) {
      return DEFAULT_BASE;
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
      throw new Error(text || `HTTP ${res.status}`);
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
    getBudgets: (params = {}) => {
      const qs = new URLSearchParams(params);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return request(`/budgets${suffix}`);
    },
    upsertBudget: (data) => request("/budgets", { method: "POST", ...jsonBody(data) })
  };

  window.UrbbisApi = api;
})();
