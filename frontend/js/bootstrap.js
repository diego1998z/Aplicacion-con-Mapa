(() => {
  if (!window.UrbbisApi) return;

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

  async function syncRemoteData() {
    try {
      const [assets, reports] = await Promise.all([
        window.UrbbisApi.getAssets(),
        window.UrbbisApi.getReports()
      ]);

      if (Array.isArray(assets)) {
        const horiz = [];
        const vert = [];
        const mob = [];
        assets.forEach((a) => {
          if (!a || !a.type) return;
          const item = assetToLocal(a);
          if (a.type === "horizontal") horiz.push(item);
          else if (a.type === "vertical") vert.push(item);
          else if (a.type === "mobiliario") mob.push(item);
        });
        if (typeof senalesHorizontal !== "undefined" && Array.isArray(senalesHorizontal)) {
          senalesHorizontal.splice(0, senalesHorizontal.length, ...horiz);
        }
        if (typeof senalesVertical !== "undefined" && Array.isArray(senalesVertical)) {
          senalesVertical.splice(0, senalesVertical.length, ...vert);
        }
        if (typeof senalesMobiliario !== "undefined" && Array.isArray(senalesMobiliario)) {
          senalesMobiliario.splice(0, senalesMobiliario.length, ...mob);
        }
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

  syncRemoteData();
  // Proyectos ahora se cargan desde backend dentro de initProyectos().
})();
