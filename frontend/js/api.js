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

  async function request(path, options = {}) {
    const base = getBaseUrl();
    const url = base.replace(/\/$/, "") + path;
    const res = await fetch(url, options);
    if (!res.ok) {
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
    deleteReport: (id) => request(`/reports/${id}`, { method: "DELETE" })
  };

  window.UrbbisApi = api;
})();
