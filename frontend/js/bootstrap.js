(() => {
  if (!window.UrbbisApi) return;

  function hasToken() {
    try {
      return !!(window.UrbbisApi.getToken && window.UrbbisApi.getToken());
    } catch (e) {
      return false;
    }
  }

  function toDateOnly(value) {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    } catch (e) {
      return "";
    }
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function assetToLocal(a) {
    const legacyId = toNumber(a.legacyId);
    return {
      id: legacyId !== null ? legacyId : (toNumber(a.id) ?? 0),
      dbId: a.id,
      tipo: a.category || (a.type === "horizontal" ? "Marca" : "Senal"),
      estado: a.state || "",
      estado_fisico: a.statePhysical || "",
      zona: a.district || "",
      lat: a.lat,
      lng: a.lng,
      icono: a.icon || "",
      region: a.region || "",
      nombre: a.name || "",
      precio: typeof a.price === "number" ? a.price : 0,
      fecha_colocacion: toDateOnly(a.installedAt),
      dimensiones: {
        ancho: toNumber(a.width),
        largo: toNumber(a.length)
      },
      area_m2: toNumber(a.areaM2),
      inspeccionFoto: a.photoUrl || null,
      distrito: a.district || ""
    };
  }

  function reportToLocal(r) {
    const legacyId = toNumber(r.legacyId);
    return {
      id: legacyId !== null ? legacyId : (toNumber(r.id) ?? 0),
      dbId: r.id,
      tipo: r.type || "otro",
      descripcion: r.description || "",
      estado: r.status || "pendiente",
      fecha: toDateOnly(r.createdAt),
      lat: r.lat,
      lng: r.lng,
      foto: r.photoUrl || null,
      region: r.region || "",
      distrito: r.district || "",
      usuario: "municipal",
      usuarioEmail: r.userEmail || "",
      usuarioNombre: r.userName || "",
      usuarioDni: r.userDni || ""
    };
  }

  async function syncRemoteData(options = {}) {
    if (!hasToken()) return;
    try {
      const types = Array.isArray(options.types) && options.types.length
        ? options.types
        : ["horizontal", "vertical", "mobiliario"];
      const assetsPromises = types.map((type) => window.UrbbisApi.getAssets({ type }));
      const reportsPromise = (options.includeReports === false)
        ? Promise.resolve([])
        : window.UrbbisApi.getReports();

      const results = await Promise.all([...assetsPromises, reportsPromise]);
      const reports = results[results.length - 1];
      const assetsByType = results.slice(0, -1);

      const mappedByType = {
        horizontal: [],
        vertical: [],
        mobiliario: []
      };

      types.forEach((type, idx) => {
        const list = assetsByType[idx];
        if (!Array.isArray(list)) return;
        const target = mappedByType[type] || [];
        list.forEach((a) => {
          if (!a) return;
          target.push(assetToLocal(a));
        });
        mappedByType[type] = target;
      });

      if (typeof senalesHorizontal !== "undefined" && Array.isArray(senalesHorizontal)) {
        senalesHorizontal.splice(0, senalesHorizontal.length, ...(mappedByType.horizontal || []));
      }
      if (typeof senalesVertical !== "undefined" && Array.isArray(senalesVertical)) {
        senalesVertical.splice(0, senalesVertical.length, ...(mappedByType.vertical || []));
      }
      if (typeof senalesMobiliario !== "undefined" && Array.isArray(senalesMobiliario)) {
        senalesMobiliario.splice(0, senalesMobiliario.length, ...(mappedByType.mobiliario || []));
      }

      if (Array.isArray(reports) && typeof avisos !== "undefined" && Array.isArray(avisos)) {
        const mapped = reports.map(reportToLocal);
        avisos.splice(0, avisos.length, ...mapped);
      }

      if (typeof renderizarTodo === "function") renderizarTodo();
      if (typeof updateReportes === "function") updateReportes();
      if (typeof updateDashboard === "function") updateDashboard();
      if (typeof updateInversion === "function") updateInversion();
      if (typeof updateInversionPlanes === "function") updateInversionPlanes();
    } catch (err) {
      console.warn("No se pudo sincronizar con el backend.", err);
    }
  }

  window.UrbbisSyncRemoteData = syncRemoteData;

  if (hasToken()) {
    syncRemoteData({ reason: "boot" });
  }
  // Proyectos ahora se cargan desde backend dentro de initProyectos().
})();
