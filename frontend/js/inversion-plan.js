(function(){
  const btnPlanNuevo = document.getElementById("btnPlanNuevo");
  const btnPlanEditar = document.getElementById("btnPlanEditar");
  const invAnualSelect = document.getElementById("invAnualSelect");
  const invAnualTotal = document.getElementById("invAnualTotal");
  const invAnualSub = document.getElementById("invAnualSub");
  const invAnualTrack = document.getElementById("invAnualTrack");
  const invAnualPct = document.getElementById("invAnualPct");
  const invAnualLegend = document.getElementById("invAnualLegend");
  const invAnualEjecutado = document.getElementById("invAnualEjecutado");
  const invAnualEjecutadoPct = document.getElementById("invAnualEjecutadoPct");
  const invPlanSelect = document.getElementById("invPlanSelect");
  const invPlanTitle = document.getElementById("invPlanTitle");
  const invPlanSub = document.getElementById("invPlanSub");
  const invPlanTotal = document.getElementById("invPlanTotal");
  const invPlanAssigned = document.getElementById("invPlanAssigned");
  const invPlanRemaining = document.getElementById("invPlanRemaining");
  const invPhasePlanificacionLabel = document.getElementById("invPhasePlanificacionLabel");
  const invPhaseEjecucionLabel = document.getElementById("invPhaseEjecucionLabel");
  const invPhaseEjecutadoLabel = document.getElementById("invPhaseEjecutadoLabel");
  const invPlanBoardList = document.getElementById("invPlanBoardList");
  const invIntervencionBuscar = document.getElementById("invIntervencionBuscar");
  const invIntervencionFase = document.getElementById("invIntervencionFase");

  const modalPresupuesto = document.getElementById("modalPresupuestoAnual");
  const presupuestoAnio = document.getElementById("presupuestoAnio");
  const presupuestoTotal = document.getElementById("presupuestoTotal");
  const btnPresupuestoEditar = document.getElementById("btnPresupuestoEditar");
  const btnPresupuestoEditarMini = document.getElementById("btnPresupuestoEditarMini");
  const btnPresupuestoClose = document.getElementById("btnPresupuestoClose");
  const btnPresupuestoCancelar = document.getElementById("btnPresupuestoCancelar");
  const btnPresupuestoGuardar = document.getElementById("btnPresupuestoGuardar");

  const modalPlan = document.getElementById("modalPlan");
  const planModalTitle = document.getElementById("planModalTitle");
  const planNombre = document.getElementById("planNombre");
  const planAnio = document.getElementById("planAnio");
  const planMonto = document.getElementById("planMonto");
  const planMontoHint = document.getElementById("planMontoHint");
  const planProjectName = document.getElementById("planProjectName");
  const btnPlanAddProject = document.getElementById("btnPlanAddProject");
  const planProjectsList = document.getElementById("planProjectsList");
  const planProjectsCount = document.getElementById("planProjectsCount");
  const btnPlanClose = document.getElementById("btnPlanClose");
  const btnPlanCancelar = document.getElementById("btnPlanCancelar");
  const btnPlanGuardar = document.getElementById("btnPlanGuardar");

  const modalIntervencion = document.getElementById("modalIntervencion");
  const intervencionModalTitle = document.getElementById("intervencionModalTitle");
  const intervencionPlan = document.getElementById("intervencionPlan");
  const intervencionPlanName = document.getElementById("intervencionPlanName");
  const intervencionMonto = document.getElementById("intervencionMonto");
  const intervencionFechaInicio = document.getElementById("intervencionFechaInicio");
  const intervencionFechaFin = document.getElementById("intervencionFechaFin");
  const intervencionProyecto = document.getElementById("intervencionProyecto");
  const intervencionAccion = document.getElementById("intervencionAccion");
  const intervencionFase = document.getElementById("intervencionFase");
  const btnIntervencionClose = document.getElementById("btnIntervencionClose");
  const btnIntervencionCancelar = document.getElementById("btnIntervencionCancelar");
  const btnIntervencionGuardar = document.getElementById("btnIntervencionGuardar");

  const modalIntervencionDetalle = document.getElementById("modalIntervencionDetalle");
  const btnIntervencionDetalleClose = document.getElementById("btnIntervencionDetalleClose");
  const intervencionDetalleTitle = document.getElementById("intervencionDetalleTitle");
  const intervencionDetalleMeta = document.getElementById("intervencionDetalleMeta");
  const intervencionDetalleTransito = document.getElementById("intervencionDetalleTransito");
  const intervencionDetalleMarcas = document.getElementById("intervencionDetalleMarcas");
  const intervencionDetalleMobiliario = document.getElementById("intervencionDetalleMobiliario");

  const modalPlanProject = document.getElementById("modalPlanProject");
  const planProjectModalTitle = document.getElementById("planProjectModalTitle");
  const planProjectPlanName = document.getElementById("planProjectPlanName");
  const planProjectSelect = document.getElementById("planProjectSelect");
  const planProjectAmount = document.getElementById("planProjectAmount");
  const planProjectAmountHint = document.getElementById("planProjectAmountHint");
  const planProjectPhase = document.getElementById("planProjectPhase");
  const planProjectActions = document.getElementById("planProjectActions");
  const btnPlanProjectClose = document.getElementById("btnPlanProjectClose");
  const btnPlanProjectCancel = document.getElementById("btnPlanProjectCancel");
  const btnPlanProjectSave = document.getElementById("btnPlanProjectSave");
  const aiPlanCompareCard = document.getElementById("aiPlanCompareCard");
  const aiPlanCompareMeta = document.getElementById("aiPlanCompareMeta");
  const aiPlanCompareHighlights = document.getElementById("aiPlanCompareHighlights");
  const aiPlanCompareBody = document.getElementById("aiPlanCompareBody");
  const aiPlanCompareNote = document.getElementById("aiPlanCompareNote");
  const btnPlanAISuggest = document.getElementById("btnPlanAISuggest");
  const btnPlanAIApply = document.getElementById("btnPlanAIApply");
  const btnPlanAIRevert = document.getElementById("btnPlanAIRevert");
  const btnPlanAIDiscard = document.getElementById("btnPlanAIDiscard");

  if(!invAnualTrack || !invPlanBoardList){
    return;
  }

  const PLAN_COLORS = [
    "plan-color-1",
    "plan-color-2",
    "plan-color-3",
    "plan-color-4",
    "plan-color-5",
    "plan-color-6",
    "plan-color-7",
    "plan-color-8",
    "plan-color-9",
    "plan-color-10",
    "plan-color-11",
    "plan-color-12",
    "plan-color-13",
    "plan-color-14",
    "plan-color-15",
    "plan-color-16",
    "plan-color-17",
    "plan-color-18",
    "plan-color-19",
    "plan-color-20"
  ];
  const PLAN_ESTADOS = {
    planificacion: "En planificacion",
    ejecucion: "En ejecucion",
    ejecutado: "Ejecutado"
  };

  let planesCache = [];
  let presupuestoCache = null;
  let planEditId = "";
  let planSeleccionadoId = "";
  let intervencionesCache = [];
  let intervencionEditId = "";
  let planDraftProjects = [];
  const groupFilters = new Map();
  const planCollapseState = new Map();
  let aiPlanScenario = null;
  let aiPlanSnapshotBeforeApply = null;
  let aiPlanAppliedScenarioId = "";

  const PLAN_AI_KEYWORDS = {
    hospital: ["hospital", "clinica", "salud", "emergencia", "posta", "centro medico", "ambulancia"],
    escuela: ["colegio", "escuela", "nido", "instituto", "universidad", "escolar", "estudiante"],
    evento: ["accidente", "choque", "atropello", "evento", "siniestro", "incidente", "riesgo", "peligro"]
  };
  const PLAN_AI_PROX_RADII = Object.freeze({
    evento: 600,
    hospital: 900,
    escuela: 900
  });

  function toPositiveNumber(value){
    const n = Number(value);
    if(!Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  function normalizeProyecto(proyecto, fallbackEstado){
    const base = (typeof proyecto === "string")
      ? { id: proyecto, nombre: proyecto }
      : Object.assign({ id: "", nombre: "Proyecto" }, proyecto || {});
    const estado = base.estado || fallbackEstado || "planificacion";
    const montoAsignado = toPositiveNumber(base.montoAsignado ?? base.monto ?? 0);
    let ejecutado = toPositiveNumber(base.ejecutado ?? 0);
    if(estado === "planificacion"){
      ejecutado = 0;
    } else if(estado === "ejecutado"){
      ejecutado = montoAsignado;
    } else if(montoAsignado > 0){
      ejecutado = Math.min(ejecutado, montoAsignado);
    }
    return {
      id: String(base.id || ""),
      nombre: String(base.nombre || "Proyecto"),
      estado,
      montoAsignado,
      ejecutado
    };
  }

  function proyectosHasDetalles(proyectos, fallbackEstado){
    if(!Array.isArray(proyectos) || !proyectos.length) return false;
    const fallback = fallbackEstado || "planificacion";
    return proyectos.some((p)=>{
      const monto = toPositiveNumber(p && (p.montoAsignado ?? p.monto) || 0);
      const ejec = toPositiveNumber(p && p.ejecutado || 0);
      const hasEstadoProp = !!(p && typeof p === "object" && Object.prototype.hasOwnProperty.call(p, "estado"));
      const estado = hasEstadoProp ? String(p.estado || "planificacion") : fallback;
      return monto > 0 || ejec > 0 || (hasEstadoProp && estado !== "planificacion");
    });
  }

  function calcPlanFromProyectos(proyectos){
    const list = Array.isArray(proyectos) ? proyectos : [];
    if(!list.length){
      return { monto: 0, ejecutado: 0, estado: "planificacion" };
    }
    let monto = 0;
    let ejecutado = 0;
    let allEjecutado = true;
    let anyEjecucion = false;
    list.forEach((p)=>{
      const estado = p.estado || "planificacion";
      const montoP = toPositiveNumber(p.montoAsignado ?? p.monto ?? 0);
      const ejecRaw = toPositiveNumber(p.ejecutado ?? 0);
      // Reglas por estado: planificacion = 0, ejecutado = monto (100%).
      let ejecP = ejecRaw;
      if(estado === "planificacion"){
        ejecP = 0;
      } else if(estado === "ejecutado"){
        ejecP = montoP;
      }
      const ejecClamped = montoP > 0 ? Math.min(ejecP, montoP) : ejecP;
      monto += montoP;
      ejecutado += ejecClamped;
      if(estado === "ejecucion" || estado === "ejecutado" || ejecClamped > 0){
        anyEjecucion = true;
      }
      if(estado !== "ejecutado"){
        allEjecutado = false;
      }
    });
    let estadoPlan = "planificacion";
    if(allEjecutado){
      estadoPlan = "ejecutado";
    } else if(anyEjecucion){
      estadoPlan = "ejecucion";
    }
    return { monto, ejecutado, estado: estadoPlan };
  }

  function planTieneDetalles(plan){
    if(plan && typeof plan._proyectosConDetalles === "boolean"){
      return plan._proyectosConDetalles;
    }
    return proyectosHasDetalles(plan && plan.proyectos, plan && plan.estado);
  }

  function escapeHtml(value){
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatMoney(value){
    const n = Number(value || 0);
    if(typeof formatearMonedaPEN === "function"){
      return formatearMonedaPEN(n);
    }
    return "S/ " + Math.round(n).toLocaleString("es-PE");
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsAnyKeyword(text, keywords){
    if(!text || !Array.isArray(keywords) || !keywords.length) return false;
    return keywords.some((k)=> text.includes(normalizeText(k)));
  }

  function safeAvisosList(){
    try{
      if(Array.isArray(avisos)) return avisos.slice();
    }catch(e){}
    return [];
  }

  function normalizeStateKey(value){
    return normalizeText(value).replace(/\s+/g, "_");
  }

  function toPoint(lat, lng){
    const nLat = Number(lat);
    const nLng = Number(lng);
    if(!Number.isFinite(nLat) || !Number.isFinite(nLng)) return null;
    return { lat: nLat, lng: nLng };
  }

  function distanceMeters(a, b){
    if(!a || !b) return Infinity;
    const toRad = (deg)=> deg * (Math.PI / 180);
    const R = 6371000;
    const dLat = toRad(Number(b.lat) - Number(a.lat));
    const dLng = toRad(Number(b.lng) - Number(a.lng));
    const lat1 = toRad(Number(a.lat));
    const lat2 = toRad(Number(b.lat));
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  }

  function nearestDistanceMeters(point, list){
    if(!point || !Array.isArray(list) || !list.length) return Infinity;
    let best = Infinity;
    list.forEach((target)=>{
      const next = distanceMeters(point, target);
      if(next < best) best = next;
    });
    return best;
  }

  function distanceScore(distance, maxDistance){
    if(!Number.isFinite(distance) || distance > maxDistance) return 0;
    const ratio = 1 - (distance / maxDistance);
    return Math.max(0, Math.min(1, ratio));
  }

  function getPlanAIAssetPoint(kind, item){
    if(!item) return null;
    if(kind === "metrado"){
      const puntos = Array.isArray(item.puntos) ? item.puntos : [];
      if(!puntos.length) return null;
      let sumLat = 0;
      let sumLng = 0;
      let count = 0;
      puntos.forEach((pt)=>{
        const point = Array.isArray(pt) ? toPoint(pt[0], pt[1]) : null;
        if(!point) return;
        sumLat += point.lat;
        sumLng += point.lng;
        count += 1;
      });
      if(!count) return null;
      return { lat: sumLat / count, lng: sumLng / count };
    }
    return toPoint(item.lat, item.lng);
  }

  function getPlanAIAssetCost(kind, item){
    try{
      if(kind === "metrado" && typeof precioInversionMetrado === "function"){
        return toPositiveNumber(precioInversionMetrado(item));
      }
      if(kind !== "metrado" && typeof precioInversionSenal === "function"){
        return toPositiveNumber(precioInversionSenal(kind, item));
      }
    }catch(e){}
    return 0;
  }

  function getPlanAIAssetState(kind, item){
    if(kind === "metrado"){
      const pending = typeof registroPendienteInspeccion === "function" ? !!registroPendienteInspeccion(item) : false;
      return pending ? "pendiente" : "registrada";
    }
    return normalizeStateKey(item && item.estado || "nueva") || "nueva";
  }

  function getPlanAIAssetTypeLabel(kind, count){
    const plural = Number(count || 0) !== 1;
    if(kind === "horizontal") return plural ? "marcas" : "marca";
    if(kind === "vertical") return plural ? "senales" : "senal";
    if(kind === "mobiliario") return plural ? "mobiliarios" : "mobiliario";
    if(kind === "metrado") return plural ? "trazos" : "trazo";
    return plural ? "activos" : "activo";
  }

  function buildPlanAIAssetBreakdown(typeCounts, limit){
    const entries = Object.entries(typeCounts || {})
      .filter(([, count])=> Number(count || 0) > 0)
      .sort((a,b)=> Number(b[1] || 0) - Number(a[1] || 0))
      .slice(0, limit || 2);
    return entries.map(([kind, count])=> count + " " + getPlanAIAssetTypeLabel(kind, count)).join(", ");
  }

  function formatCompactMeters(value){
    const n = Math.round(Number(value || 0));
    if(!Number.isFinite(n) || n <= 0) return "0 m";
    if(n >= 1000){
      const km = Math.round((n / 1000) * 10) / 10;
      return km.toLocaleString("es-PE", {
        minimumFractionDigits: km % 1 ? 1 : 0,
        maximumFractionDigits: 1
      }) + " km";
    }
    return n.toLocaleString("es-PE") + " m";
  }

  function planAIConfidenceLabel(value){
    const n = Number(value || 0);
    if(n >= 0.75) return "Alta";
    if(n >= 0.45) return "Media";
    return "Base";
  }

  function planAIPriorityLabel(score){
    const n = Number(score || 0);
    if(n >= 8) return "Muy alta";
    if(n >= 6) return "Alta";
    if(n >= 4.2) return "Media";
    return "Balanceada";
  }

  function planScenarioRound(value){
    return Math.max(0, Math.round(Number(value || 0)));
  }

  function getPlanAmountSignature(plans){
    return (plans || [])
      .map((plan)=> String(plan.id || "") + ":" + planScenarioRound(plan.monto))
      .sort()
      .join("|");
  }

  function formatDateTimeShort(value){
    try{
      const date = value ? new Date(value) : new Date();
      if(!Number.isFinite(date.getTime())) return "";
      return date.toLocaleString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }catch(e){
      return "";
    }
  }

  function normalizarProyectoKey(nombre){
    return String(nombre || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getAccionProyectoAsociado(accion){
    return String(accion && (accion.proyectoAsociado || accion.proyecto_asociado || accion.projectName) || "").trim();
  }

  function getEmailKey(){
    const normalizeKey = (value)=> String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"");

    try{
      if(typeof rolActual !== "undefined" && rolActual === "municipal"){
        const scope = (typeof cargarSesionScope === "function") ? cargarSesionScope() : { distrito:"" };
        if(scope && scope.distrito){
          return normalizeKey(scope.distrito);
        }
      }
    }catch(e){}

    let email = "";
    try{
      if(typeof getSessionEmail === "function"){
        email = getSessionEmail() || "";
      }
      if(!email){
        email = localStorage.getItem("correoActual") || "";
      }
    }catch(e){
      email = "";
    }
    if(typeof normalizarCorreo === "function"){
      return normalizarCorreo(email || "guest");
    }
    return normalizeKey(email || "guest");
  }

  function storageKey(prefix){
    return prefix + getEmailKey();
  }

  function safeStorageGet(key){
    try{
      return localStorage.getItem(key);
    }catch(e){
      return null;
    }
  }

  function safeStorageSet(key, value){
    try{
      localStorage.setItem(key, value);
    }catch(e){}
  }

  function cargarIntervenciones(){
    const raw = safeStorageGet(storageKey("intervenciones-"));
    if(!raw){
      intervencionesCache = Array.isArray(intervencionesCache) ? intervencionesCache : [];
      return;
    }
    try{
      const parsed = JSON.parse(raw);
      intervencionesCache = Array.isArray(parsed) ? parsed : [];
    }catch(e){
      intervencionesCache = [];
    }
  }

  function guardarIntervenciones(){
    safeStorageSet(storageKey("intervenciones-"), JSON.stringify(intervencionesCache || []));
  }

  function interventionFromApiPayload(item){
    return {
      id: item.id,
      dbId: item.id,
      planId: item.planId,
      nombre: item.name || item.actionName || "Intervension",
      accionId: item.actionId || "",
      accionNombre: item.actionName || item.name || "",
      proyectoId: item.projectId || "",
      proyectoNombre: item.projectName || "",
      monto: Number(item.amount || 0),
      fase: item.phase || "planificacion",
      fechaInicio: item.startDate ? String(item.startDate).slice(0,10) : "",
      fechaFin: item.endDate ? String(item.endDate).slice(0,10) : ""
    };
  }

  function interventionToApiPayload(item){
    return {
      planId: item.planId,
      name: item.nombre || item.accionNombre || "Intervension",
      actionId: item.accionId || undefined,
      actionName: item.accionNombre || undefined,
      projectId: item.proyectoId || undefined,
      projectName: item.proyectoNombre || undefined,
      amount: Number(item.monto || 0),
      phase: item.fase || "planificacion",
      startDate: item.fechaInicio || "",
      endDate: item.fechaFin || ""
    };
  }

  async function cargarIntervencionesApi(){
    if(!window.UrbbisApi || typeof window.UrbbisApi.getInterventions !== "function") return false;
    try{
      const remote = await window.UrbbisApi.getInterventions({ ownerKey: getEmailKey() });
      if(Array.isArray(remote)){
        intervencionesCache = remote.map(interventionFromApiPayload);
        guardarIntervenciones();
        return true;
      }
    }catch(e){
      console.warn("No se pudo cargar intervenciones desde backend.", e);
    }
    return false;
  }

  function syncInterventionToBackend(item){
    if(!window.UrbbisApi) return;
    const payload = interventionToApiPayload(item);
    if(item.dbId){
      if(typeof window.UrbbisApi.updateIntervention === "function"){
        window.UrbbisApi.updateIntervention(item.dbId, payload)
          .catch((err)=> console.warn("No se pudo actualizar intervencion en backend.", err));
      }
      return;
    }
    if(typeof window.UrbbisApi.createIntervention === "function"){
      window.UrbbisApi.createIntervention(payload)
        .then((remote)=>{
          if(remote && remote.id){
            item.dbId = remote.id;
            item.id = remote.id;
          }
        })
        .catch((err)=> console.warn("No se pudo crear intervencion en backend.", err));
    }
  }

  function deleteInterventionFromBackend(item){
    if(!window.UrbbisApi || !item || !item.dbId || typeof window.UrbbisApi.deleteIntervention !== "function") return;
    window.UrbbisApi.deleteIntervention(item.dbId)
      .catch((err)=> console.warn("No se pudo eliminar intervencion en backend.", err));
  }

  function normalizePlan(plan){
    const out = Object.assign({}, plan || {});
    out.id = out.id || ("plan-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6));
    out.nombre = out.nombre || "Plan";
    out.anio = Number(out.anio || 0) || new Date().getFullYear();
    out.monto = Number(out.monto || 0);
    if(!Array.isArray(out.proyectos)) out.proyectos = [];
    out.proyectos = out.proyectos.map((p)=>({
      id: String((p && p.id) || ""),
      nombre: String((p && p.nombre) || "Proyecto"),
      montoAsignado: Number((p && (p.montoAsignado ?? p.monto)) || 0)
    })).filter(p => p.id || p.nombre);
    return out;
  }

  function cargarPlanes(){
    if(!Array.isArray(planesCache)){
      planesCache = [];
    }
  }

  function guardarPlanes(){
    // Persistencia solo en backend; aqui solo mantenemos memoria.
  }

  function getMontoDisponiblePlanParaModal(anio, excludeId){
    const presupuesto = getPresupuesto();
    const total = Number(presupuesto && presupuesto.total || 0);
    if(!total) return 0;
    const plans = getPlanesDelAnio(anio);
    const usado = plans.reduce((sum, p)=>{
      if(excludeId && String(p.id || "") === String(excludeId)) return sum;
      return sum + toPositiveNumber(p.monto);
    }, 0);
    return Math.max(0, total - usado);
  }

  function actualizarMontoPlanDisponible(anio, excludeId){
    if(!planMontoHint) return;
    const disponible = getMontoDisponiblePlanParaModal(anio, excludeId);
    planMontoHint.textContent = "Disponible: " + formatMoney(disponible);
    if(planMonto){
      planMonto.max = String(Math.floor(disponible));
    }
  }

  function cargarPresupuesto(){
    if(!presupuestoCache){
      presupuestoCache = { year: new Date().getFullYear(), total: 0 };
    }
  }

  function guardarPresupuesto(next){
    presupuestoCache = Object.assign({}, next || {});
  }

  function getPresupuesto(){
    if(!presupuestoCache){
      cargarPresupuesto();
    }
    return presupuestoCache;
  }

  function planToApiPayload(plan){
    const totals = calcPlanPhaseTotals(plan ? plan.id : "");
    const status = totals.ejecutado >= totals.montoPlan && totals.montoPlan > 0
      ? "ejecutado"
      : ((totals.ejecucion + totals.ejecutado) > 0 ? "ejecucion" : "planificacion");
    return {
      ownerKey: getEmailKey(),
      name: plan.nombre || "Plan",
      year: Number(plan.anio || new Date().getFullYear()),
      deadline: "",
      status,
      amount: Number(plan.monto || 0),
      executed: Number(totals.ejecucion + totals.ejecutado || 0),
      projects: (plan.proyectos || []).map((p)=>({
        projectLegacyId: p.id || "",
        name: p.nombre || "Proyecto",
        status: "planificacion",
        assignedAmount: Number(p.montoAsignado || p.monto || 0),
        executedAmount: 0
      }))
    };
  }

  function planFromApiPayload(plan){
    return normalizePlan({
      id: plan.legacyId || plan.id,
      dbId: plan.id,
      creado: plan.createdAt || plan.created_at || plan.created || plan.createdOn || "",
      nombre: plan.name || "Plan",
      anio: plan.year || new Date().getFullYear(),
      monto: Number(plan.amount || 0),
      proyectos: Array.isArray(plan.projects) ? plan.projects.map((p)=>({
        id: p.projectLegacyId || "",
        nombre: p.name || "Proyecto",
        montoAsignado: Number(p.assignedAmount || 0)
      })) : []
    });
  }

  function normalizePlanResponse(remote){
    if(!remote) return { plan: null, available: null };
    if(remote.plan) return { plan: remote.plan, available: remote.available };
    return { plan: remote, available: null };
  }

  function applyAvailableHint(available){
    if(typeof available !== "number" || !Number.isFinite(available)) return;
    if(planMontoHint && modalPlan && !modalPlan.classList.contains("hidden")){
      planMontoHint.textContent = "Disponible: " + formatMoney(available);
    }
  }

  function handlePlanRemoteResponse(remote, plan){
    const normalized = normalizePlanResponse(remote);
    if(normalized.plan && normalized.plan.id && plan){
      plan.dbId = normalized.plan.id;
    }
    applyAvailableHint(normalized.available);
  }

  async function cargarPlanesApi(){
    if(!window.UrbbisApi || typeof window.UrbbisApi.getPlans !== "function") return;
    try{
      const remote = await window.UrbbisApi.getPlans({ ownerKey: getEmailKey() });
      if(Array.isArray(remote)){
        planesCache = remote.map(planFromApiPayload);
        guardarPlanes();
      }
    }catch(e){
      console.warn("No se pudo cargar planes desde backend.", e);
    }
  }

  async function cargarPresupuestoApi(){
    if(!window.UrbbisApi || typeof window.UrbbisApi.getBudgets !== "function") return;
    try{
      const remote = await window.UrbbisApi.getBudgets({ ownerKey: getEmailKey() });
      if(Array.isArray(remote) && remote.length){
        const current = remote[0];
        presupuestoCache = { year: current.year, total: Number(current.total || 0) };
        guardarPresupuesto(presupuestoCache);
      }
    }catch(e){
      console.warn("No se pudo cargar presupuesto desde backend.", e);
    }
  }

  function syncPlanToBackend(plan){
    if(!window.UrbbisApi) return;
    const payload = planToApiPayload(plan);
    if(plan.dbId){
      if(typeof window.UrbbisApi.updatePlan === "function"){
        window.UrbbisApi.updatePlan(plan.dbId, payload)
          .then((remote)=> handlePlanRemoteResponse(remote, plan))
          .catch((err)=> console.warn("No se pudo actualizar plan en backend.", err));
      }
      return;
    }
    if(typeof window.UrbbisApi.createPlan === "function"){
      window.UrbbisApi.createPlan(payload)
        .then((remote)=> handlePlanRemoteResponse(remote, plan))
        .catch((err)=> console.warn("No se pudo crear plan en backend.", err));
    }
  }

  function deletePlanFromBackend(plan){
    if(!window.UrbbisApi || !plan || !plan.dbId || typeof window.UrbbisApi.deletePlan !== "function") return;
    window.UrbbisApi.deletePlan(plan.dbId)
      .catch((err)=> console.warn("No se pudo eliminar plan en backend.", err));
  }

  function syncPresupuestoToBackend(presupuesto){
    if(!window.UrbbisApi || typeof window.UrbbisApi.upsertBudget !== "function") return;
    window.UrbbisApi.upsertBudget({
      ownerKey: getEmailKey(),
      year: Number(presupuesto.year || new Date().getFullYear()),
      total: Number(presupuesto.total || 0)
    }).catch((err)=> console.warn("No se pudo guardar presupuesto en backend.", err));
  }

  function periodoLabel(year){
    return "Ene-Dic " + year;
  }

  function estadoLabel(estado){
    return PLAN_ESTADOS[estado] || PLAN_ESTADOS.planificacion;
  }

  function obtenerProyectosMunicipales(){
    let list = [];
    try{
      if(typeof proyectosCache !== "undefined" && Array.isArray(proyectosCache)){
        list = proyectosCache.slice();
      }
    }catch(e){
      list = [];
    }
    let distrito = "";
    try{
      const scope = (typeof cargarSesionScope === "function") ? cargarSesionScope() : { distrito:"" };
      distrito = scope && scope.distrito ? scope.distrito : "";
    }catch(e){
      distrito = "";
    }
    if(!distrito && typeof scopeDistrito !== "undefined"){
      distrito = scopeDistrito || "";
    }
    if(distrito){
      const low = String(distrito).toLowerCase();
      list = list.filter(p=>{
        const pd = String(p && p.distrito || "").toLowerCase();
        return !pd || pd === low;
      });
    }
    list.sort((a,b)=> String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"));
    return list;
  }

  function obtenerProyectosInventario(){
    return obtenerProyectosMunicipales().filter((p)=>{
      const tipo = String(p && p.registroTipo || "inventario");
      return tipo !== "acciones" && tipo !== "eventos";
    });
  }

  function obtenerAccionesDisponibles(){
    const base = obtenerProyectosMunicipales();
    let list = base.filter((p)=> String(p && p.registroTipo || "") === "acciones");
    if(!list.length){
      list = base.filter((p)=> !p.registroTipo || String(p.registroTipo || "") === "acciones");
    }
    return list;
  }

  function obtenerProyectosAsociadosAcciones(){
    const acciones = obtenerAccionesDisponibles();
    const mapa = new Map();
    acciones.forEach((a)=>{
      const nombre = getAccionProyectoAsociado(a);
      if(!nombre) return;
      const key = normalizarProyectoKey(nombre);
      if(!key || mapa.has(key)) return;
      mapa.set(key, nombre);
    });
    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }

  function obtenerProyectosPlan(plan){
    if(!Array.isArray(plan && plan.proyectos)) return [];
    return plan.proyectos;
  }

  function calcProyectoPct(proyecto){
    const estado = String(proyecto && proyecto.estado || "planificacion");
    const monto = toPositiveNumber(proyecto && (proyecto.montoAsignado ?? proyecto.monto) || 0);
    const ejecRaw = toPositiveNumber(proyecto && proyecto.ejecutado || 0);
    if(estado === "planificacion") return 0;
    if(estado === "ejecutado") return monto > 0 ? 100 : 0;
    const ejec = monto > 0 ? Math.min(ejecRaw, monto) : ejecRaw;
    if(monto <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((ejec / monto) * 100)));
  }

  function syncProjectExecutionField(item){
    if(!item || !item.querySelector) return;
    const estadoEl = item.querySelector("select[data-field=\"estado\"]");
    const montoEl = item.querySelector("input[data-field=\"monto\"]");
    const ejecEl = item.querySelector("input[data-field=\"ejecutado\"]");
    if(!estadoEl || !montoEl || !ejecEl) return;
    const estado = estadoEl.value || "planificacion";
    const monto = toPositiveNumber(montoEl.value);
    if(estado === "planificacion"){
      ejecEl.value = "";
      ejecEl.disabled = true;
      return;
    }
    if(estado === "ejecutado"){
      ejecEl.value = monto > 0 ? String(monto) : "";
      ejecEl.disabled = true;
    } else {
      ejecEl.disabled = false;
      const ejecActual = toPositiveNumber(ejecEl.value);
      if(monto > 0 && ejecActual > monto){
        ejecEl.value = String(monto);
      }
    }
  }

  function gatherProyectosSeleccionados(){
    return planDraftProjects.slice();
  }

  function updatePlanTotalsFromProjects(){
    updateProjectsCount();
  }

  function renderProyectosList(){
    if(!planProjectsList) return;
    if(!planDraftProjects.length){
      planProjectsList.innerHTML = "<div class=\"plan-project-item\">Sin proyectos asociados.</div>";
      updateProjectsCount();
      return;
    }
    planProjectsList.innerHTML = planDraftProjects.map((p)=>(
      "<div class=\"plan-project-item\" data-id=\"" + escapeHtml(p.id) + "\">"
      + "<span>" + escapeHtml(p.nombre || "Proyecto") + "</span>"
      + "<div class=\"plan-project-actions\">"
      +   "<button type=\"button\" data-action=\"edit\">&#9998;</button>"
      +   "<button type=\"button\" data-action=\"remove\">&minus;</button>"
      + "</div>"
      + "</div>"
    )).join("");
    updateProjectsCount();
  }

  function updateProjectsCount(){
    if(!planProjectsCount) return;
    planProjectsCount.textContent = planDraftProjects.length + " asociados";
  }

  function getPlanById(id){
    if(!id) return null;
    return planesCache.find(p => String(p.id || "") === String(id)) || null;
  }

  function getPlanesDelAnio(anio){
    return planesCache.filter(p => Number(p.anio || 0) === Number(anio || 0));
  }

  function planCreatedTs(plan){
    if(!plan) return NaN;
    const raw = plan.creado || plan.createdAt || plan.created_at || plan.created || plan.ts || "";
    if(raw){
      const parsed = Date.parse(raw);
      if(Number.isFinite(parsed)) return parsed;
    }
    const id = String(plan.id || "");
    if(id.startsWith("plan-")){
      const parts = id.split("-");
      if(parts.length > 1){
        const parsed = parseInt(parts[1], 36);
        if(Number.isFinite(parsed)) return parsed;
      }
    }
    const numId = Number(plan.id);
    return Number.isFinite(numId) ? numId : NaN;
  }

  function ordenarPlanesRecientes(plans){
    return (plans || []).map((plan, idx)=>({
      plan,
      idx,
      key: planCreatedTs(plan)
    })).sort((a,b)=>{
      const ak = a.key;
      const bk = b.key;
      const aOk = Number.isFinite(ak);
      const bOk = Number.isFinite(bk);
      if(aOk && bOk && ak !== bk) return bk - ak;
      if(aOk && !bOk) return -1;
      if(!aOk && bOk) return 1;
      return b.idx - a.idx;
    }).map(item => item.plan);
  }

  function getIntervencionesPlan(planId){
    return intervencionesCache.filter(i => String(i.planId || "") === String(planId || ""));
  }

  function calcPlanPhaseTotals(planId){
    const plan = getPlanById(planId);
    const totals = { planificacion:0, ejecucion:0, ejecutado:0 };
    const list = getIntervencionesPlan(planId);
    list.forEach((i)=>{
      const fase = i.fase || "planificacion";
      totals[fase] = (totals[fase] || 0) + toPositiveNumber(i.monto);
    });
    const montoPlan = plan ? toPositiveNumber(plan.monto) : 0;
    const asignado = (totals.ejecucion || 0) + (totals.ejecutado || 0);
    const restante = Math.max(0, montoPlan - asignado);
    return { ...totals, montoPlan, asignado, restante };
  }

  function renderAnual(plans, presupuesto){
    const total = Number(presupuesto.total || 0);
    const anio = Number(presupuesto.year || new Date().getFullYear());
    if(invAnualTotal) invAnualTotal.textContent = formatMoney(total);
    if(invAnualSub) invAnualSub.textContent = total > 0 ? "Monto anual definido" : "Define el monto anual";
    if(invAnualSelect){
      invAnualSelect.innerHTML = "<option value=\"" + escapeHtml(anio) + "\">" + escapeHtml(periodoLabel(anio)) + "</option>";
    }
    const planTotals = plans.map((plan)=> ({ plan, totals: calcPlanPhaseTotals(plan.id) }));
    const sumPlanes = planTotals.reduce((sum, item)=> sum + toPositiveNumber(item.plan.monto), 0);
    const sumEjecutado = planTotals.reduce((sum, item)=> sum + toPositiveNumber(item.totals.asignado), 0);
    const pct = total > 0 ? Math.round((sumPlanes / total) * 100) : 0;
    if(invAnualPct) invAnualPct.textContent = Math.max(0, Math.min(100, pct));
    if(invAnualEjecutado) invAnualEjecutado.textContent = formatMoney(sumEjecutado);
    const pctEj = total > 0 ? Math.round((sumEjecutado / total) * 100) : 0;
    if(invAnualEjecutadoPct) invAnualEjecutadoPct.textContent = Math.max(0, Math.min(100, pctEj));

    if(invAnualTrack){
      invAnualTrack.innerHTML = "";
      if(total > 0 && plans.length){
        planTotals.forEach((item, idx)=>{
          const width = total > 0 ? Math.max(0, (toPositiveNumber(item.plan.monto) / total) * 100) : 0;
          if(width <= 0) return;
          const seg = document.createElement("div");
          seg.className = "inv-annual-seg " + PLAN_COLORS[idx % PLAN_COLORS.length];
          seg.style.width = width.toFixed(2) + "%";
          invAnualTrack.appendChild(seg);
        });
        const remaining = total - sumPlanes;
        if(remaining > 0){
          const rem = document.createElement("div");
          rem.className = "inv-annual-seg plan-color-remaining";
          rem.style.width = ((remaining / total) * 100).toFixed(2) + "%";
          invAnualTrack.appendChild(rem);
        }
      } else {
        const rem = document.createElement("div");
        rem.className = "inv-annual-seg plan-color-remaining";
        rem.style.width = "100%";
        invAnualTrack.appendChild(rem);
      }
    }

    if(invAnualLegend){
      const items = plans.map((plan, idx)=>({
        label: (plan.nombre || "Plan") + " total",
        cls: PLAN_COLORS[idx % PLAN_COLORS.length]
      }));
      items.push({ label: "Total presupuestario anual", cls: "plan-color-total" });
      if(total > 0){
        items.push({ label: "Por ejecutar", cls: "plan-color-remaining" });
      }
      invAnualLegend.innerHTML = items.map(item=>
        "<div class=\"inv-annual-legend-item\"><span class=\"inv-annual-dot " + item.cls + "\"></span>" + escapeHtml(item.label) + "</div>"
      ).join("");
    }
  }

  function renderPlanSelect(plans){
    if(!invPlanSelect) return;
    if(!plans.length){
      invPlanSelect.innerHTML = "<option value=\"\">Sin planes</option>";
      planSeleccionadoId = "";
      if(btnPlanEditar) btnPlanEditar.disabled = true;
      renderPlanResumen(null);
      renderIntervencionesTable(null);
      return;
    }
    invPlanSelect.innerHTML = plans.map((p)=>(
      "<option value=\"" + escapeHtml(p.id) + "\">" + escapeHtml(p.nombre || "Plan") + "</option>"
    )).join("");
    if(!planSeleccionadoId || !plans.some(p => String(p.id || "") === String(planSeleccionadoId))){
      planSeleccionadoId = plans[0].id;
    }
    invPlanSelect.value = planSeleccionadoId;
    if(btnPlanEditar) btnPlanEditar.disabled = !planSeleccionadoId;
    renderPlanResumen(getPlanById(planSeleccionadoId));
    renderIntervencionesTable(getPlanById(planSeleccionadoId));
  }

  function renderPlanBoard(plans){
    if(!invPlanBoardList) return;
    const ordered = ordenarPlanesRecientes(plans);
    if(!ordered.length){
      invPlanBoardList.innerHTML = "<div class=\"inv-plan-empty\">Registra un plan para visualizar el resumen.</div>";
      planSeleccionadoId = "";
      return;
    }
    if(!planSeleccionadoId || !ordered.some(p => String(p.id || "") === String(planSeleccionadoId))){
      planSeleccionadoId = ordered[0].id;
    }
    invPlanBoardList.innerHTML = ordered.map((plan)=>{
      let collapsed = planCollapseState.get(plan.id);
      if(typeof collapsed !== "boolean"){
        collapsed = true;
        planCollapseState.set(plan.id, true);
      }
      const totals = calcPlanPhaseTotals(plan.id);
      const montoPlan = totals.montoPlan;
      const pctPlan = montoPlan > 0 ? Math.round((totals.planificacion / montoPlan) * 100) : 0;
      const pctEjec = montoPlan > 0 ? Math.round((totals.ejecucion / montoPlan) * 100) : 0;
      const pctEje = montoPlan > 0 ? Math.round((totals.ejecutado / montoPlan) * 100) : 0;
      let list = getIntervencionesPlan(plan.id);
      let groupsHtml = "";
      if(!list.length){
        groupsHtml = "<div class=\"inv-plan-empty\">Sin intervenciones registradas.</div>";
      } else {
        const grupos = new Map();
        list.forEach((i)=>{
          const nombre = getIntervencionProyectoNombre(i);
          const key = normalizarProyectoKey(nombre);
          if(!grupos.has(key)){
            grupos.set(key, { nombre, items: [] });
          }
          grupos.get(key).items.push(i);
        });
        const gruposOrdenados = Array.from(grupos.values())
          .sort((a,b)=> a.nombre.localeCompare(b.nombre, "es"));
        groupsHtml = gruposOrdenados.map((grupo)=>{
          const groupKey = plan.id + ":" + normalizarProyectoKey(grupo.nombre || "");
          const filters = groupFilters.get(groupKey) || { query: "", fase: "todas" };
          let items = grupo.items.slice();
          if(filters.fase && filters.fase !== "todas"){
            items = items.filter(i => String(i.fase || "") === filters.fase);
          }
          if(filters.query){
            const q = filters.query.toLowerCase();
            items = items.filter(i => String(i.nombre || i.accionNombre || "").toLowerCase().includes(q));
          }
          return ""
            + "<div class=\"inv-interventions\" data-plan-id=\"" + escapeHtml(plan.id) + "\" data-proyecto-nombre=\"" + escapeHtml(grupo.nombre) + "\" data-group-key=\"" + escapeHtml(groupKey) + "\">"
            +   "<div class=\"inv-interventions-head\">"
            +     "<div>"
            +       "<h3>Proyecto asociado: " + escapeHtml(grupo.nombre) + "</h3>"
            +       "<span class=\"inv-interventions-sub\">Monto: " + escapeHtml(formatMoney(getMontoProyectoAsignado(plan, grupo.nombre))) + " · " + items.length + " intervenciones</span>"
            +     "</div>"
            +   "</div>"
            +   "<div class=\"inv-interventions-tools\">"
            +     "<input type=\"text\" class=\"inv-intervencion-buscar\" placeholder=\"Buscar intervencion...\" value=\"" + escapeHtml(filters.query || "") + "\">"
            +     "<select class=\"inv-intervencion-fase\" aria-label=\"Filtro de fases\">"
            +       "<option value=\"todas\"" + (filters.fase === "todas" ? " selected" : "") + ">Todas las fases</option>"
            +       "<option value=\"planificacion\"" + (filters.fase === "planificacion" ? " selected" : "") + ">En planificacion</option>"
            +       "<option value=\"ejecucion\"" + (filters.fase === "ejecucion" ? " selected" : "") + ">En ejecucion</option>"
            +       "<option value=\"ejecutado\"" + (filters.fase === "ejecutado" ? " selected" : "") + ">Ejecutado</option>"
            +     "</select>"
            +   "</div>"
            +   "<div class=\"inv-interventions-table-wrap\">"
            +     "<table class=\"inv-interventions-table\">"
            +       "<thead>"
            +         "<tr>"
            +           "<th>Intervenciones</th>"
            +           "<th>Fase</th>"
            +           "<th>Monto</th>"
            +           "<th>Avance</th>"
            +           "<th>Acciones</th>"
            +         "</tr>"
            +       "</thead>"
            +       "<tbody>" + (items.length ? items.map((i)=>{
                      const accion = getAccionById(i.accionId);
                      const nombreAccion = i.nombre || (accion ? accion.nombre : "") || i.accionNombre || "Intervension";
                      const monto = toPositiveNumber(i.monto);
                      const avanceMonto = (i.fase === "ejecutado" || i.fase === "ejecucion") ? calcularCostoAccion(accion) : 0;
                      const pct = monto > 0 ? Math.max(0, Math.min(100, Math.round((avanceMonto / monto) * 100))) : 0;
                      return ""
                        + "<tr data-intervencion-id=\"" + escapeHtml(i.id) + "\">"
                        +   "<td><button type=\"button\" class=\"inv-intervencion-link\" data-intervencion-link>" + escapeHtml(nombreAccion) + "</button></td>"
                        +   "<td><span class=\"inv-phase-pill " + escapeHtml(i.fase || "planificacion") + "\">" + escapeHtml(PLAN_ESTADOS[i.fase] || "En planificacion") + "</span></td>"
                        +   "<td>" + escapeHtml(formatMoney(monto)) + "</td>"
                        +   "<td>" + escapeHtml(formatMoney(avanceMonto)) + " (" + pct + "%)</td>"
                        +   "<td><div class=\"inv-table-actions\">"
                        +     "<button type=\"button\" data-intervencion-action=\"edit\">&#9998;</button>"
                        +     "<button type=\"button\" class=\"danger\" data-intervencion-action=\"delete\">&#10005;</button>"
                        +   "</div></td>"
                        + "</tr>";
                    }).join("") : "<tr><td colspan=\"5\" class=\"empty\">Sin intervenciones.</td></tr>") + "</tbody>"
            +     "</table>"
            +   "</div>"
            + "</div>";
        }).join("");
      }
      return ""
        + "<article class=\"inv-plan-card" + (collapsed ? " is-collapsed" : "") + "\" data-plan-id=\"" + escapeHtml(plan.id) + "\">"
        +   "<div class=\"inv-plan-card-head\">"
        +     "<div>"
        +       "<div class=\"inv-plan-card-title-row\">"
        +         "<button type=\"button\" class=\"inv-plan-toggle-icon\" data-plan-toggle aria-label=\"Mostrar proyectos\">&#9662;</button>"
        +         "<h4 class=\"inv-plan-card-title\">" + escapeHtml(plan.nombre || "Plan") + "</h4>"
        +         "<button type=\"button\" class=\"inv-plan-edit\" data-plan-action=\"edit\" title=\"Modificar plan\">&#9998;</button>"
        +       "</div>"
        +       "<span class=\"inv-plan-card-sub\">Total del plan y avance por fase.</span>"
        +     "</div>"
        +     "<div class=\"inv-plan-card-actions\">"
        +       "<button type=\"button\" class=\"dash-btn dash-btn--primary\" data-plan-project-add> Agregar proyecto asociado</button>"
        +       "<button type=\"button\" class=\"inv-plan-edit danger\" data-plan-action=\"delete\" title=\"Eliminar plan\">&#10005;</button>"
        +     "</div>"
        +   "</div>"
        +   "<div class=\"inv-plan-metrics\">"
        +     "<div class=\"inv-plan-metric\"><span>Total</span><strong>" + escapeHtml(formatMoney(montoPlan)) + "</strong></div>"
        +     "<div class=\"inv-plan-metric\"><span>Asignado en intervenciones</span><strong>" + escapeHtml(formatMoney(totals.asignado)) + "</strong></div>"
        +     "<div class=\"inv-plan-metric\"><span>Restante</span><strong>" + escapeHtml(formatMoney(totals.restante)) + "</strong></div>"
        +   "</div>"
        +   "<div class=\"inv-plan-phases\">"
        +     "<div class=\"inv-phase inv-phase--plan\"><span>Planificacion</span><strong>" + pctPlan + "% (" + escapeHtml(formatMoney(totals.planificacion)) + ")</strong></div>"
        +     "<div class=\"inv-phase inv-phase--exec\"><span>En ejecucion</span><strong>" + pctEjec + "% (" + escapeHtml(formatMoney(totals.ejecucion)) + ")</strong></div>"
        +     "<div class=\"inv-phase inv-phase--done\"><span>Ejecutado</span><strong>" + pctEje + "% (" + escapeHtml(formatMoney(totals.ejecutado)) + ")</strong></div>"
        +   "</div>"
        +   groupsHtml
        + "</article>";
    }).join("");
  }

  function getAvailableProjectBudget(plan, excludeName){
    if(!plan) return 0;
    const total = Number(plan.monto || 0);
    const used = (plan.proyectos || []).reduce((sum, p)=>{
      if(excludeName && String(p.nombre || "").toLowerCase() === String(excludeName || "").toLowerCase()){
        return sum;
      }
      return sum + Number(p.montoAsignado || p.monto || 0);
    }, 0);
    return Math.max(0, total - used);
  }

  function renderPlanProjectActionsList(projectName, plan){
    if(!planProjectActions) return;
    if(!projectName){
      planProjectActions.innerHTML = "<div class=\"inv-plan-empty\">Selecciona un proyecto asociado.</div>";
      return;
    }
    const acciones = obtenerAccionesDisponibles().filter((a)=>{
      return getAccionProyectoAsociado(a).toLowerCase() === projectName.toLowerCase();
    });
    if(!acciones.length){
      planProjectActions.innerHTML = "<div class=\"inv-plan-empty\">No hay intervenciones registradas para este proyecto.</div>";
      return;
    }
    const existing = new Set(
      intervencionesCache
        .filter(i => String(i.planId || "") === String(plan.id || ""))
        .filter(i => getIntervencionProyectoNombre(i).toLowerCase() === projectName.toLowerCase())
        .map(i => String(i.accionId || ""))
    );
    planProjectActions.innerHTML = acciones.map((a)=>{
      const checked = existing.has(String(a.id || ""));
      return ""
        + "<label class=\"plan-project-actions-item\">"
        +   "<input type=\"checkbox\" value=\"" + escapeHtml(a.id || "") + "\"" + (checked ? " checked" : "") + ">"
        +   "<span>" + escapeHtml(a.nombre || "Intervencion") + "</span>"
        + "</label>";
    }).join("");
  }

  function abrirModalPlanProject(planId){
    const plan = getPlanById(planId);
    if(!plan){
      alert("Selecciona un plan valido.");
      return;
    }
    if(planProjectPlanName){
      planProjectPlanName.value = (plan.nombre || "Plan");
    }
    if(planProjectModalTitle) planProjectModalTitle.textContent = "Agregar proyecto asociado";
    const proyectos = obtenerProyectosAsociadosAcciones();
    if(planProjectSelect){
      if(!proyectos.length){
        planProjectSelect.innerHTML = "<option value=\"\">Sin proyectos asociados</option>";
      } else {
        planProjectSelect.innerHTML = proyectos.map((p)=>(
          "<option value=\"" + escapeHtml(p.nombre || "") + "\">" + escapeHtml(p.nombre || "Proyecto asociado") + "</option>"
        )).join("");
      }
    }
    const selectedName = planProjectSelect && planProjectSelect.value ? planProjectSelect.value : (proyectos[0] ? proyectos[0].nombre : "");
    const existingMonto = getMontoProyectoAsignado(plan, selectedName);
    if(planProjectAmount) planProjectAmount.value = existingMonto ? String(existingMonto) : "";
    const available = getAvailableProjectBudget(plan, selectedName);
    if(planProjectAmountHint) planProjectAmountHint.textContent = "Disponible: " + formatMoney(available);
    if(planProjectPhase) planProjectPhase.value = "planificacion";
    renderPlanProjectActionsList(selectedName, plan);
    mostrarModal(modalPlanProject);
  }

  function cerrarModalPlanProject(){
    ocultarModal(modalPlanProject);
  }

  function guardarPlanProjectDesdeModal(){
    const plan = getPlanById(planSeleccionadoId);
    if(!plan){
      alert("Selecciona un plan valido.");
      return;
    }
    const projectName = planProjectSelect ? String(planProjectSelect.value || "").trim() : "";
    if(!projectName){
      alert("Selecciona un proyecto asociado.");
      return;
    }
    const monto = Number(planProjectAmount ? planProjectAmount.value : 0);
    if(!Number.isFinite(monto) || monto <= 0){
      alert("Ingresa un monto valido para el proyecto.");
      return;
    }
    const fase = planProjectPhase ? (planProjectPhase.value || "planificacion") : "planificacion";
    const available = getAvailableProjectBudget(plan, projectName);
    if(monto > available){
      alert("El monto del proyecto excede el disponible del plan. Disponible: " + formatMoney(available));
      return;
    }
    const existingIdx = (plan.proyectos || []).findIndex(p => String(p.nombre || "").toLowerCase() === projectName.toLowerCase());
    if(existingIdx >= 0){
      plan.proyectos[existingIdx].montoAsignado = monto;
    } else {
      plan.proyectos.push({ id: normalizarProyectoKey(projectName), nombre: projectName, montoAsignado: monto });
    }
    if(planProjectActions){
      const checks = Array.from(planProjectActions.querySelectorAll("input[type=\"checkbox\"]"));
      checks.forEach((chk)=>{
        if(!chk.checked) return;
        const accion = getAccionById(chk.value);
        if(!accion) return;
        const exists = intervencionesCache.some(i => String(i.planId || "") === String(plan.id || "") && String(i.accionId || "") === String(accion.id || ""));
        if(exists) return;
        const montoAccion = calcularCostoAccion(accion);
        const payload = {
          id: "interv-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6),
          planId: plan.id,
          planNombre: plan.nombre || "Plan",
          proyectoId: normalizarProyectoKey(projectName),
          proyectoNombre: projectName,
          accionId: accion.id,
          accionNombre: accion.nombre || "Intervension",
          nombre: accion.nombre || "Intervension",
          monto: montoAccion || 0,
          fase,
          fechaInicio: accion.fecha_inicio || accion.startDate || "",
          fechaFin: accion.fecha_fin || accion.endDate || ""
        };
        intervencionesCache.push(payload);
        syncInterventionToBackend(payload);
      });
    }
    guardarIntervenciones();
    syncPlanToBackend(plan);
    guardarPlanes();
    cerrarModalPlanProject();
    updateInversionPlanes();
  }

  function getIntervencionProyectoNombre(intervencion){
    const accion = getAccionById(intervencion && intervencion.accionId);
    const nombre = String(intervencion && (intervencion.proyectoNombre || getAccionProyectoAsociado(accion)) || "").trim();
    return nombre || "Sin proyecto asociado";
  }

  function getMontoProyectoAsignado(plan, nombreProyecto){
    if(!plan || !Array.isArray(plan.proyectos)) return 0;
    const found = plan.proyectos.find(p => String(p.nombre || "").toLowerCase() === String(nombreProyecto || "").toLowerCase());
    return found ? Number(found.montoAsignado || found.monto || 0) : 0;
  }

  function renderIntervencionesGrouped(){
    // Render ahora vive dentro de renderPlanBoard.
  }

  function renderPlanResumen(plan){
    if(!invPlanTitle || !invPlanTotal || !invPlanAssigned || !invPlanRemaining) return;
    if(!plan){
      invPlanTitle.textContent = "Sin plan";
      if(invPlanSub) invPlanSub.textContent = "Registra un plan para visualizar su detalle.";
      invPlanTotal.textContent = "S/ 0";
      invPlanAssigned.textContent = "S/ 0";
      invPlanRemaining.textContent = "S/ 0";
      if(invPhasePlanificacionLabel) invPhasePlanificacionLabel.textContent = "0% (S/ 0)";
      if(invPhaseEjecucionLabel) invPhaseEjecucionLabel.textContent = "0% (S/ 0)";
      if(invPhaseEjecutadoLabel) invPhaseEjecutadoLabel.textContent = "0% (S/ 0)";
      return;
    }
    const totals = calcPlanPhaseTotals(plan.id);
    const montoPlan = totals.montoPlan;
    const pctPlan = montoPlan > 0 ? Math.round((totals.planificacion / montoPlan) * 100) : 0;
    const pctEjec = montoPlan > 0 ? Math.round((totals.ejecucion / montoPlan) * 100) : 0;
    const pctEje = montoPlan > 0 ? Math.round((totals.ejecutado / montoPlan) * 100) : 0;
    invPlanTitle.textContent = (plan.nombre || "Plan") + " " + (plan.anio || "");
    if(invPlanSub) invPlanSub.textContent = "Total del plan y avance por fase.";
    invPlanTotal.textContent = formatMoney(montoPlan);
    invPlanAssigned.textContent = formatMoney(totals.asignado);
    invPlanRemaining.textContent = formatMoney(totals.restante);
    if(invPhasePlanificacionLabel) invPhasePlanificacionLabel.textContent = pctPlan + "% (" + formatMoney(totals.planificacion) + ")";
    if(invPhaseEjecucionLabel) invPhaseEjecucionLabel.textContent = pctEjec + "% (" + formatMoney(totals.ejecucion) + ")";
    if(invPhaseEjecutadoLabel) invPhaseEjecutadoLabel.textContent = pctEje + "% (" + formatMoney(totals.ejecutado) + ")";
  }

  function calcularCostoAccion(accion){
    if(!accion) return 0;
    let total = 0;
    try{
      if(typeof precioInversionSenal === "function"){
        total += (accion.senalesHorizontal || []).reduce((sum, s)=> sum + precioInversionSenal("horizontal", s), 0);
        total += (accion.senalesVertical || []).reduce((sum, s)=> sum + precioInversionSenal("vertical", s), 0);
        total += (accion.senalesMobiliario || []).reduce((sum, s)=> sum + precioInversionSenal("mobiliario", s), 0);
      }
      if(typeof precioInversionMetrado === "function"){
        total += (accion.metradoRegistros || []).reduce((sum, r)=> sum + precioInversionMetrado(r), 0);
      }
    }catch(e){}
    return total;
  }

  function getAccionById(id){
    return obtenerAccionesDisponibles().find(a => String(a.id || "") === String(id || "")) || null;
  }

  function getProyectoNombre(plan, proyectoId){
    const list = (plan && Array.isArray(plan.proyectos)) ? plan.proyectos : [];
    const found = list.find(p => String(p.id || "") === String(proyectoId || ""));
    if(found) return found.nombre || "Proyecto";
    const asociados = obtenerProyectosAsociadosAcciones();
    const match = asociados.find(p => String(p.id || "") === String(proyectoId || ""));
    if(match) return match.nombre || "Proyecto";
    return "Proyecto";
  }

  function renderIntervencionesTable(plan){
    if(!invIntervencionesBody) return;
    if(!plan){
      invIntervencionesBody.innerHTML = "<tr><td colspan=\"6\" class=\"empty\">Selecciona un plan.</td></tr>";
      return;
    }
    let list = getIntervencionesPlan(plan.id);
    const filtro = invIntervencionFase ? invIntervencionFase.value : "todas";
    if(filtro && filtro !== "todas"){
      list = list.filter(i => String(i.fase || "") === filtro);
    }
    const query = invIntervencionBuscar ? invIntervencionBuscar.value.trim().toLowerCase() : "";
    if(query){
      list = list.filter(i => String(i.nombre || i.accionNombre || "").toLowerCase().includes(query));
    }
    if(!list.length){
      invIntervencionesBody.innerHTML = "<tr><td colspan=\"6\" class=\"empty\">Sin intervenciones registradas.</td></tr>";
      return;
    }
    invIntervencionesBody.innerHTML = list.map((i)=>{
      const accion = getAccionById(i.accionId);
      const nombreAccion = i.nombre || (accion ? accion.nombre : "") || i.accionNombre || "Intervencion";
      const proyectoNombre = i.proyectoNombre || getProyectoNombre(plan, i.proyectoId);
      const monto = toPositiveNumber(i.monto);
      const avanceMonto = (i.fase === "ejecutado" || i.fase === "ejecucion") ? calcularCostoAccion(accion) : 0;
      const pct = monto > 0 ? Math.max(0, Math.min(100, Math.round((avanceMonto / monto) * 100))) : 0;
      return ""
        + "<tr data-intervencion-id=\"" + escapeHtml(i.id) + "\">"
        + "<td>" + escapeHtml(nombreAccion) + "</td>"
        + "<td>" + escapeHtml(proyectoNombre) + "</td>"
        + "<td><span class=\"inv-phase-pill " + escapeHtml(i.fase || "planificacion") + "\">" + escapeHtml(PLAN_ESTADOS[i.fase] || "En planificacion") + "</span></td>"
        + "<td>" + escapeHtml(formatMoney(monto)) + "</td>"
        + "<td>" + escapeHtml(formatMoney(avanceMonto)) + " (" + pct + "%)</td>"
        + "<td><div class=\"inv-table-actions\">"
        +   "<button type=\"button\" data-intervencion-action=\"edit\">&#9998;</button>"
        +   "<button type=\"button\" class=\"danger\" data-intervencion-action=\"delete\">&#10005;</button>"
        + "</div></td>"
        + "</tr>";
    }).join("");
  }

  function buildPlanAIActionKey(action){
    if(!action) return "";
    const id = String(action.id || "").trim();
    if(id) return id;
    return normalizarProyectoKey(getAccionProyectoAsociado(action) + "-" + (action.nombre || ""));
  }

  function getPlanAIProjectKeys(plan){
    const keys = new Set();
    const add = (value)=>{
      const key = normalizarProyectoKey(value);
      if(key) keys.add(key);
    };
    (plan && plan.proyectos || []).forEach((project)=>{
      add(project && project.id);
      add(project && project.nombre);
    });
    getIntervencionesPlan(plan && plan.id).forEach((intervencion)=>{
      add(intervencion && intervencion.proyectoId);
      add(intervencion && intervencion.proyectoNombre);
      const accion = getAccionById(intervencion && intervencion.accionId);
      add(getAccionProyectoAsociado(accion));
    });
    return keys;
  }

  function getPlanAIActionsForPlan(plan){
    const actions = obtenerAccionesDisponibles();
    const linkedProjects = getPlanAIProjectKeys(plan);
    const byId = new Map();
    const add = (action)=>{
      if(!action) return;
      const key = buildPlanAIActionKey(action);
      if(!key || byId.has(key)) return;
      byId.set(key, action);
    };

    getIntervencionesPlan(plan && plan.id).forEach((intervencion)=>{
      add(getAccionById(intervencion && intervencion.accionId));
    });

    actions.forEach((action)=>{
      const projectKey = normalizarProyectoKey(getAccionProyectoAsociado(action));
      if(projectKey && linkedProjects.has(projectKey)){
        add(action);
      }
    });

    return Array.from(byId.values());
  }

  function getPlanAIProjectCoverage(plan, actions){
    const actionProjects = new Set((actions || []).map((action)=> normalizarProyectoKey(getAccionProyectoAsociado(action))).filter(Boolean));
    const projects = Array.isArray(plan && plan.proyectos) ? plan.proyectos : [];
    if(!projects.length){
      return {
        projectCount: actionProjects.size,
        coveredProjectCount: actionProjects.size
      };
    }
    const coveredProjectCount = projects.filter((project)=>{
      const key = normalizarProyectoKey((project && project.nombre) || (project && project.id) || "");
      return key && actionProjects.has(key);
    }).length;
    return {
      projectCount: projects.length,
      coveredProjectCount
    };
  }

  function collectPlanAIInventoryStats(plan, reportSignals){
    const actions = getPlanAIActionsForPlan(plan);
    const interventions = getIntervencionesPlan(plan && plan.id);
    const seen = new Set();
    const assets = [];
    const typeCounts = { horizontal: 0, vertical: 0, mobiliario: 0, metrado: 0 };
    const points = reportSignals && reportSignals.points ? reportSignals.points : { hospital: [], escuela: [], evento: [] };
    let geocodedAssets = 0;
    let totalCost = 0;
    let criticalCost = 0;
    let criticalCount = 0;
    let replacementCount = 0;
    let maintenanceCount = 0;
    let pendingInspectionCount = 0;
    let nearHospitalCount = 0;
    let nearEscuelaCount = 0;
    let nearEventCount = 0;
    let traceCount = 0;
    let traceMeters = 0;
    let closestHospital = Infinity;
    let closestEscuela = Infinity;
    let closestEvent = Infinity;

    const registerAsset = (kind, list, action)=>{
      const source = Array.isArray(list) ? list : [];
      source.forEach((item, idx)=>{
        const baseId = String(item && item.id || "");
        const uniqueKey = baseId
          ? (kind + ":" + baseId)
          : (kind + ":" + buildPlanAIActionKey(action) + ":" + idx);
        if(seen.has(uniqueKey)) return;
        seen.add(uniqueKey);

        const point = getPlanAIAssetPoint(kind, item);
        const state = getPlanAIAssetState(kind, item);
        const cost = getPlanAIAssetCost(kind, item);
        const nearEvent = nearestDistanceMeters(point, points.evento);
        const nearHospital = nearestDistanceMeters(point, points.hospital);
        const nearEscuela = nearestDistanceMeters(point, points.escuela);
        const isCritical = state === "sin_senal" || state === "antigua" || state === "pendiente";
        const severity = state === "sin_senal" ? 2.4 : (state === "antigua" ? 1.8 : (state === "pendiente" ? 1.2 : 0.7));
        const typeWeight = kind === "vertical" ? 1.15 : (kind === "horizontal" ? 1.05 : (kind === "metrado" ? 0.95 : 0.9));
        const priority = severity
          + typeWeight
          + Math.min(1.4, cost / 3500)
          + (distanceScore(nearEvent, PLAN_AI_PROX_RADII.evento) * 1.5)
          + (distanceScore(nearHospital, PLAN_AI_PROX_RADII.hospital) * 1.1)
          + (distanceScore(nearEscuela, PLAN_AI_PROX_RADII.escuela) * 1.1);

        typeCounts[kind] = (typeCounts[kind] || 0) + 1;
        totalCost += cost;

        if(point){
          geocodedAssets += 1;
        }
        if(isCritical){
          criticalCount += 1;
          criticalCost += cost;
        }
        if(state === "sin_senal") replacementCount += 1;
        if(state === "antigua") maintenanceCount += 1;
        if(state === "pendiente") pendingInspectionCount += 1;
        if(Number.isFinite(nearEvent) && nearEvent <= PLAN_AI_PROX_RADII.evento) nearEventCount += 1;
        if(Number.isFinite(nearHospital) && nearHospital <= PLAN_AI_PROX_RADII.hospital) nearHospitalCount += 1;
        if(Number.isFinite(nearEscuela) && nearEscuela <= PLAN_AI_PROX_RADII.escuela) nearEscuelaCount += 1;
        if(Number.isFinite(nearEvent) && nearEvent < closestEvent) closestEvent = nearEvent;
        if(Number.isFinite(nearHospital) && nearHospital < closestHospital) closestHospital = nearHospital;
        if(Number.isFinite(nearEscuela) && nearEscuela < closestEscuela) closestEscuela = nearEscuela;
        if(kind === "metrado"){
          traceCount += 1;
          traceMeters += toPositiveNumber(item && (item.distancia_m ?? item.distanciaM ?? item.total_ml));
        }

        assets.push({
          id: baseId || uniqueKey,
          kind,
          state,
          point,
          cost,
          priority,
          label: String(item && (item.nombre || item.tipo || item.codigo) || getPlanAIAssetTypeLabel(kind, 1)),
          nearEvent,
          nearHospital,
          nearEscuela
        });
      });
    };

    actions.forEach((action)=>{
      registerAsset("horizontal", action && action.senalesHorizontal, action);
      registerAsset("vertical", action && action.senalesVertical, action);
      registerAsset("mobiliario", action && action.senalesMobiliario, action);
      registerAsset("metrado", action && action.metradoRegistros, action);
    });

    const coverage = getPlanAIProjectCoverage(plan, actions);
    const confidence = Math.min(1, Math.max(0.2,
      (actions.length ? 0.24 : 0)
      + (assets.length ? 0.24 : 0)
      + (assets.length ? ((geocodedAssets / assets.length) * 0.36) : 0)
      + ((reportSignals && reportSignals.geocoded) ? 0.16 : 0)
    ));

    return {
      actionsCount: actions.length,
      interventionsCount: interventions.length,
      projectCount: coverage.projectCount,
      coveredProjectCount: coverage.coveredProjectCount,
      assetCount: assets.length,
      geocodedAssets,
      totalCost: planScenarioRound(totalCost),
      criticalCost: planScenarioRound(criticalCost),
      criticalCount,
      replacementCount,
      maintenanceCount,
      pendingInspectionCount,
      nearHospitalCount,
      nearEscuelaCount,
      nearEventCount,
      sensitiveCount: nearHospitalCount + nearEscuelaCount + nearEventCount,
      traceCount,
      traceMeters: planScenarioRound(traceMeters),
      typeCounts,
      closest: {
        hospital: Number.isFinite(closestHospital) ? Math.round(closestHospital) : null,
        escuela: Number.isFinite(closestEscuela) ? Math.round(closestEscuela) : null,
        evento: Number.isFinite(closestEvent) ? Math.round(closestEvent) : null
      },
      confidence,
      confidenceLabel: planAIConfidenceLabel(confidence),
      topAssets: assets
        .slice()
        .sort((a,b)=> Number(b.priority || 0) - Number(a.priority || 0))
        .slice(0, 3)
        .map((asset)=> ({
          label: asset.label,
          kind: asset.kind,
          state: asset.state,
          cost: planScenarioRound(asset.cost)
        }))
    };
  }

  function collectPlanAIReportSignals(){
    const list = safeAvisosList();
    const zoneCounts = new Map();
    const points = { hospital: [], escuela: [], evento: [] };
    let hospital = 0;
    let escuela = 0;
    let evento = 0;
    let pendiente = 0;
    let geocoded = 0;

    list.forEach((item)=>{
      const rawText = [
        item && (item.tipo || item.type || ""),
        item && (item.descripcion || item.description || ""),
        item && (item.distrito || item.district || ""),
        item && (item.zona || "")
      ].join(" ");
      const text = normalizeText(rawText);
      const hasHospital = containsAnyKeyword(text, PLAN_AI_KEYWORDS.hospital);
      const hasEscuela = containsAnyKeyword(text, PLAN_AI_KEYWORDS.escuela);
      const hasEvento = containsAnyKeyword(text, PLAN_AI_KEYWORDS.evento);
      if(hasHospital) hospital += 1;
      if(hasEscuela) escuela += 1;
      if(hasEvento) evento += 1;

      const estado = normalizeText(item && (item.estado || item.status || ""));
      if(estado.includes("pendiente") || estado.includes("nuevo") || estado.includes("abierto")){
        pendiente += 1;
      }

      const point = toPoint(
        item && (item.lat ?? item.latitude),
        item && (item.lng ?? item.lon ?? item.longitude)
      );
      if(point){
        geocoded += 1;
        if(hasHospital) points.hospital.push(point);
        if(hasEscuela) points.escuela.push(point);
        points.evento.push(point);
      }

      const zona = String(item && (item.distrito || item.district || item.zona) || "Sin zona");
      zoneCounts.set(zona, (zoneCounts.get(zona) || 0) + 1);
    });

    const hotspots = Array.from(zoneCounts.entries())
      .map(([zone, count])=> ({ zone, count }))
      .sort((a,b)=> b.count - a.count)
      .slice(0, 3);

    return { total: list.length, hospital, escuela, evento, pendiente, hotspots, points, geocoded };
  }

  function buildPlanAIText(plan){
    const chunks = [plan && plan.nombre || ""];
    (plan && plan.proyectos || []).forEach((p)=>{
      chunks.push(p && p.nombre || "");
    });
    getIntervencionesPlan(plan && plan.id).forEach((i)=>{
      chunks.push(i && (i.nombre || i.accionNombre || ""), i && (i.proyectoNombre || ""));
    });
    return normalizeText(chunks.join(" "));
  }

  function buildPlanAIReasonSummary(metrics, context){
    const reasons = [];
    if(Number(metrics && metrics.replacementCount || 0) > 0){
      reasons.push({ weight: 3.3 + (metrics.replacementCount * 0.3), text: metrics.replacementCount + " activos por reponer" });
    }
    if(Number(metrics && metrics.maintenanceCount || 0) > 0){
      reasons.push({ weight: 2.6 + (metrics.maintenanceCount * 0.18), text: metrics.maintenanceCount + " activos deteriorados" });
    }
    if(Number(metrics && metrics.pendingInspectionCount || 0) > 0){
      reasons.push({ weight: 1.9 + (metrics.pendingInspectionCount * 0.15), text: metrics.pendingInspectionCount + " trazos con inspeccion pendiente" });
    }
    if(Number(metrics && metrics.nearHospitalCount || 0) > 0){
      reasons.push({ weight: 2.2 + (metrics.nearHospitalCount * 0.12), text: metrics.nearHospitalCount + " activos cerca de salud" });
    }
    if(Number(metrics && metrics.nearEscuelaCount || 0) > 0){
      reasons.push({ weight: 2.1 + (metrics.nearEscuelaCount * 0.12), text: metrics.nearEscuelaCount + " activos cerca de escuelas" });
    }
    if(Number(metrics && metrics.nearEventCount || 0) > 0){
      reasons.push({ weight: 2.4 + (metrics.nearEventCount * 0.12), text: metrics.nearEventCount + " activos en zonas con eventos" });
    }
    if(Number(metrics && metrics.traceMeters || 0) > 0){
      reasons.push({ weight: 1.7 + Math.min(1, Number(metrics.traceMeters || 0) / 1500), text: formatCompactMeters(metrics.traceMeters) + " de trazos asociados" });
    }
    if(context && context.hasHospital){
      reasons.push({ weight: 1.9 + Math.min(0.8, Number(context.reportSignals && context.reportSignals.hospital || 0) / 6), text: "entorno de salud y emergencia" });
    }
    if(context && context.hasEscuela){
      reasons.push({ weight: 1.7 + Math.min(0.7, Number(context.reportSignals && context.reportSignals.escuela || 0) / 6), text: "seguridad escolar" });
    }
    if(context && context.hasEvento){
      reasons.push({ weight: 1.6 + Math.min(0.7, Number(context.reportSignals && context.reportSignals.evento || 0) / 7), text: "respuesta a eventos recurrentes" });
    }
    if(context && Number(context.executionRatio || 0) < 0.45){
      reasons.push({ weight: 1.6, text: "avance bajo frente al monto actual" });
    }
    if(context && Number(context.planningRatio || 0) > 0.4){
      reasons.push({ weight: 1.8, text: "saldo en planificacion sin activar" });
    }
    if(context && !Number(context.interventionsCount || 0) && Number(metrics && metrics.assetCount || 0) > 0){
      reasons.push({ weight: 1.3, text: "sin intervenciones activas" });
    }
    if(!reasons.length){
      return "redistribucion balanceada segun cobertura y avance";
    }
    const seen = new Set();
    return reasons
      .sort((a,b)=> b.weight - a.weight)
      .filter((item)=>{
        if(seen.has(item.text)) return false;
        seen.add(item.text);
        return true;
      })
      .slice(0, 2)
      .map((item)=> item.text)
      .join("; ");
  }

  function buildPlanAISensitiveSummary(metrics, options){
    const opts = options && typeof options === "object" ? options : {};
    const entries = [];
    if(Number(metrics && metrics.nearHospitalCount || 0) > 0){
      entries.push({ label: "salud", count: Number(metrics.nearHospitalCount || 0) });
    }
    if(Number(metrics && metrics.nearEscuelaCount || 0) > 0){
      entries.push({ label: "escuela", count: Number(metrics.nearEscuelaCount || 0) });
    }
    if(Number(metrics && metrics.nearEventCount || 0) > 0){
      entries.push({ label: "eventos", count: Number(metrics.nearEventCount || 0) });
    }
    if(!entries.length){
      return "";
    }
    const max = Math.max(1, Number(opts.max || entries.length));
    return entries
      .slice(0, max)
      .map((entry)=> opts.withCount ? (entry.label + " (" + entry.count + ")") : entry.label)
      .join(", ");
  }

  function buildPlanAIImpactSummary(metrics, executionRatio, planningRatio){
    const parts = [];
    if(Number(metrics && metrics.criticalCount || 0) > 0){
      parts.push("prioriza " + metrics.criticalCount + " activos criticos");
    }
    const sensitiveSummary = buildPlanAISensitiveSummary(metrics, { withCount: true, max: 2 });
    if(sensitiveSummary){
      parts.push("cerca de " + sensitiveSummary);
    }
    if(Number(metrics && metrics.traceMeters || 0) > 0){
      parts.push("cubre " + formatCompactMeters(metrics.traceMeters) + " de trazos");
    }
    if(Number(planningRatio || 0) > 0.4){
      parts.push("mueve saldo hoy inmovilizado");
    }
    if(Number(executionRatio || 0) < 0.45){
      parts.push("empuja planes con baja ejecucion");
    }
    return parts.slice(0, 2).join(" · ") || "sostiene una distribucion balanceada";
  }

  function buildPlanAIEvidenceChips(metrics){
    const chips = [];
    if(Number(metrics && metrics.assetCount || 0) > 0){
      chips.push((metrics.assetCount || 0) + " activos");
      const breakdown = buildPlanAIAssetBreakdown(metrics.typeCounts, 2);
      if(breakdown) chips.push(breakdown);
    }
    if(Number(metrics && metrics.criticalCount || 0) > 0){
      chips.push((metrics.criticalCount || 0) + " criticos");
    }
    const sensitiveSummary = buildPlanAISensitiveSummary(metrics, { withCount: true, max: 3 });
    if(sensitiveSummary){
      chips.push("Sensibles: " + sensitiveSummary);
    }
    if(Number(metrics && metrics.coveredProjectCount || 0) > 0 && Number(metrics && metrics.projectCount || 0) > 0){
      chips.push(metrics.coveredProjectCount + "/" + metrics.projectCount + " proyectos enlazados");
    }
    if(Number(metrics && metrics.traceMeters || 0) > 0){
      chips.push(formatCompactMeters(metrics.traceMeters) + " trazados");
    }
    chips.push("Confianza " + (metrics && metrics.confidenceLabel || "Base"));
    return chips.slice(0, 5);
  }

  function evaluatePlanForAI(plan, reportSignals){
    const text = buildPlanAIText(plan);
    const totals = calcPlanPhaseTotals(plan.id);
    const monto = toPositiveNumber(plan && plan.monto);
    const executionRatio = monto > 0 ? Math.min(1, totals.asignado / monto) : 0;
    const planningRatio = monto > 0 ? Math.min(1, totals.planificacion / monto) : 0;
    const interventions = getIntervencionesPlan(plan.id);
    const metrics = collectPlanAIInventoryStats(plan, reportSignals);

    const hasHospital = containsAnyKeyword(text, PLAN_AI_KEYWORDS.hospital);
    const hasEscuela = containsAnyKeyword(text, PLAN_AI_KEYWORDS.escuela);
    const hasEvento = containsAnyKeyword(text, PLAN_AI_KEYWORDS.evento);

    let score = 1;

    score += Math.min(1.8, (metrics.assetCount * 0.08) + (metrics.actionsCount * 0.16));
    score += Math.min(2.8,
      (metrics.replacementCount * 0.42)
      + (metrics.maintenanceCount * 0.24)
      + (metrics.pendingInspectionCount * 0.16)
    );
    score += Math.min(2.2,
      (metrics.nearEventCount * 0.16)
      + (metrics.nearHospitalCount * 0.14)
      + (metrics.nearEscuelaCount * 0.14)
    );
    if(metrics.traceMeters > 0){
      score += Math.min(1.05, metrics.traceMeters / 1500);
    }
    if(metrics.projectCount > 0 && metrics.coveredProjectCount > 0){
      score += Math.min(0.9, (metrics.coveredProjectCount / metrics.projectCount) * 0.9);
    }

    if(hasHospital){
      score += 1.15 + Math.min(0.95, Number(reportSignals && reportSignals.hospital || 0) / 5);
    }
    if(hasEscuela){
      score += 1 + Math.min(0.85, Number(reportSignals && reportSignals.escuela || 0) / 6);
    }
    if(hasEvento){
      score += 0.9 + Math.min(0.8, Number(reportSignals && reportSignals.evento || 0) / 7);
    }

    if(executionRatio < 0.45){
      score += 0.95;
    } else if(executionRatio > 0.8){
      score -= 0.25;
    }

    if(planningRatio > 0.4){
      score += Math.min(1.05, planningRatio * 1.2);
    }

    if(!interventions.length && metrics.assetCount > 0){
      score += 0.55;
    }

    if(Number(reportSignals && reportSignals.pendiente || 0) > 0){
      score += Math.min(0.8, Number(reportSignals.pendiente || 0) / 15);
    }

    if(score < 0.35) score = 0.35;

    const reason = buildPlanAIReasonSummary(metrics, {
      hasHospital,
      hasEscuela,
      hasEvento,
      executionRatio,
      planningRatio,
      interventionsCount: interventions.length,
      reportSignals
    });

    return {
      planId: String(plan.id || ""),
      planName: plan.nombre || "Plan",
      actual: planScenarioRound(plan.monto),
      score,
      reason,
      impact: buildPlanAIImpactSummary(metrics, executionRatio, planningRatio),
      evidenceChips: buildPlanAIEvidenceChips(metrics),
      metrics,
      priorityLabel: planAIPriorityLabel(score),
      executionRatio,
      planningRatio
    };
  }

  function buildPlanAIScenarioForYear(plans, presupuesto){
    const year = Number(presupuesto && presupuesto.year || new Date().getFullYear());
    const budgetTotal = toPositiveNumber(presupuesto && presupuesto.total || 0);
    const assignedBefore = planScenarioRound((plans || []).reduce((sum, p)=> sum + toPositiveNumber(p && p.monto), 0));
    const reportSignals = collectPlanAIReportSignals();

    const evaluations = (plans || []).map((plan)=> evaluatePlanForAI(plan, reportSignals));
    const scoreTotal = evaluations.reduce((sum, item)=> sum + Math.max(0.001, Number(item.score || 0)), 0);

    let pool = assignedBefore;
    const remainingBudget = Math.max(0, budgetTotal - assignedBefore);
    if(budgetTotal > 0){
      if(pool <= 0){
        pool = budgetTotal * 0.82;
      } else {
        pool += remainingBudget * 0.75;
      }
    }
    if(pool <= 0){
      pool = Math.max(1000, evaluations.length * 1000);
    }
    pool = planScenarioRound(pool);

    const avgCurrent = evaluations.length ? (assignedBefore > 0 ? (assignedBefore / evaluations.length) : (pool / evaluations.length)) : 0;
    const minFloor = Math.max(0, planScenarioRound(Math.min(avgCurrent * 0.35, pool * 0.2)));

    const ranking = evaluations
      .slice()
      .sort((a,b)=> Number(b.score || 0) - Number(a.score || 0));
    const rankByPlanId = new Map(ranking.map((item, idx)=> [String(item.planId || ""), idx + 1]));

    const rows = evaluations.map((item)=> {
      const weightedTarget = scoreTotal > 0 ? (pool * item.score / scoreTotal) : (pool / Math.max(1, evaluations.length));
      const blended = item.actual > 0 ? (item.actual * 0.55 + weightedTarget * 0.45) : weightedTarget;
      const suggested = planScenarioRound(Math.max(minFloor, blended));
      return {
        planId: item.planId,
        planName: item.planName,
        actual: item.actual,
        suggested,
        delta: 0,
        reason: item.reason,
        impact: item.impact,
        evidenceChips: item.evidenceChips,
        metrics: item.metrics,
        score: item.score,
        priorityLabel: item.priorityLabel,
        priorityRank: rankByPlanId.get(String(item.planId || "")) || 0,
        confidenceLabel: item.metrics && item.metrics.confidenceLabel ? item.metrics.confidenceLabel : "Base"
      };
    });

    let diff = pool - rows.reduce((sum, row)=> sum + row.suggested, 0);
    const orderUp = rows.slice().sort((a,b)=> b.score - a.score || b.delta - a.delta);
    const orderDown = rows.slice().sort((a,b)=> b.suggested - a.suggested || a.score - b.score);
    let guard = 0;
    let idx = 0;
    while(diff !== 0 && rows.length && guard < 10000){
      const targetList = diff > 0 ? orderUp : orderDown;
      const row = targetList[idx % targetList.length];
      if(!row){
        break;
      }
      if(diff > 0){
        row.suggested += 1;
        diff -= 1;
      } else if(row.suggested > 0){
        row.suggested -= 1;
        diff += 1;
      }
      idx += 1;
      guard += 1;
    }

    rows.forEach((row)=>{
      row.delta = planScenarioRound(row.suggested - row.actual);
      if(row.suggested < row.actual){
        row.delta = -planScenarioRound(row.actual - row.suggested);
      }
    });

    const assignedAfter = planScenarioRound(rows.reduce((sum, row)=> sum + row.suggested, 0));
    const remainingAfter = Math.max(0, planScenarioRound(budgetTotal - assignedAfter));
    const baseSignature = getPlanAmountSignature(plans);

    const scenario = {
      id: "plan-ai-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,5),
      year,
      createdAt: new Date().toISOString(),
      budgetTotal: planScenarioRound(budgetTotal),
      assignedBefore: planScenarioRound(assignedBefore),
      assignedAfter: planScenarioRound(assignedAfter),
      remainingBefore: Math.max(0, planScenarioRound(budgetTotal - assignedBefore)),
      remainingAfter,
      reportSignals,
      rows,
      summary: summarizePlanAIScenarioRows(rows),
      note: "",
      baseSignature
    };
    scenario.note = buildPlanAIScenarioNote(scenario);
    return scenario;
  }

  function summarizePlanAIScenarioRows(rows){
    return (rows || []).reduce((acc, row)=>{
      const metrics = row && row.metrics ? row.metrics : {};
      acc.assetCount += Number(metrics.assetCount || 0);
      acc.criticalCount += Number(metrics.criticalCount || 0);
      acc.sensitiveCount += Number(metrics.sensitiveCount || 0);
      acc.nearHospitalCount += Number(metrics.nearHospitalCount || 0);
      acc.nearEscuelaCount += Number(metrics.nearEscuelaCount || 0);
      acc.nearEventCount += Number(metrics.nearEventCount || 0);
      acc.traceMeters += Number(metrics.traceMeters || 0);
      acc.geocodedAssets += Number(metrics.geocodedAssets || 0);
      acc.actionsCount += Number(metrics.actionsCount || 0);
      return acc;
    }, {
      assetCount: 0,
      criticalCount: 0,
      sensitiveCount: 0,
      nearHospitalCount: 0,
      nearEscuelaCount: 0,
      nearEventCount: 0,
      traceMeters: 0,
      geocodedAssets: 0,
      actionsCount: 0
    });
  }

  function buildPlanAIScenarioHighlights(scenario){
    if(!scenario || !Array.isArray(scenario.rows) || !scenario.rows.length){
      return [];
    }
    const summary = scenario.summary || summarizePlanAIScenarioRows(scenario.rows);
    const increases = scenario.rows
      .filter((row)=> Number(row.delta || 0) > 0)
      .sort((a,b)=> Number(b.delta || 0) - Number(a.delta || 0));
    const top = increases[0] || scenario.rows.slice().sort((a,b)=> Number(b.score || 0) - Number(a.score || 0))[0];
    const chips = [];
    if(top){
      chips.push({ label: "Mayor refuerzo", value: top.planName });
    }
    if(summary.criticalCount > 0){
      chips.push({ label: "Activos criticos", value: String(summary.criticalCount) });
    }
    const sensitiveSummary = buildPlanAISensitiveSummary(summary, { withCount: true, max: 3 });
    if(sensitiveSummary){
      chips.push({ label: "Lugares sensibles", value: sensitiveSummary });
    }
    if(summary.traceMeters > 0){
      chips.push({ label: "Trazos", value: formatCompactMeters(summary.traceMeters) });
    } else if(summary.assetCount > 0){
      chips.push({ label: "Activos enlazados", value: String(summary.assetCount) });
    }
    if(Number(scenario.reportSignals && scenario.reportSignals.total || 0) > 0){
      const geo = Number(scenario.reportSignals && scenario.reportSignals.geocoded || 0);
      chips.push({
        label: "Reportes",
        value: (scenario.reportSignals.total || 0) + (geo ? (" · " + geo + " geo") : "")
      });
    }
    return chips.slice(0, 4);
  }

  function getPlanAIImprovementLines(scenario){
    if(!scenario || !Array.isArray(scenario.rows) || !scenario.rows.length){
      return [];
    }
    const increases = scenario.rows
      .filter((row)=> Number(row.delta || 0) > 0)
      .sort((a,b)=> b.delta - a.delta);
    const decreases = scenario.rows
      .filter((row)=> Number(row.delta || 0) < 0)
      .sort((a,b)=> a.delta - b.delta);
    const reportSignals = scenario.reportSignals || {};
    const summary = scenario.summary || summarizePlanAIScenarioRows(scenario.rows);
    const lines = [];

    if(increases.length){
      const focusBoosts = increases.slice(0, 2);
      const named = focusBoosts.map((row)=> row.planName).join(" y ");
      const criticalFocus = focusBoosts.reduce((sum, row)=> sum + Number(row.metrics && row.metrics.criticalCount || 0), 0);
      const sensitiveFocus = focusBoosts.reduce((sum, row)=> sum + Number(row.metrics && row.metrics.sensitiveCount || 0), 0);
      const sensitiveSummary = buildPlanAISensitiveSummary({
        nearHospitalCount: focusBoosts.reduce((sum, row)=> sum + Number(row.metrics && row.metrics.nearHospitalCount || 0), 0),
        nearEscuelaCount: focusBoosts.reduce((sum, row)=> sum + Number(row.metrics && row.metrics.nearEscuelaCount || 0), 0),
        nearEventCount: focusBoosts.reduce((sum, row)=> sum + Number(row.metrics && row.metrics.nearEventCount || 0), 0)
      }, { withCount: true, max: 3 });
      if(criticalFocus || sensitiveFocus){
        lines.push("Refuerza " + named + " porque concentran " + criticalFocus + " activos criticos y cercania sensible en " + (sensitiveSummary || (sensitiveFocus + " casos vinculados")) + ".");
      } else {
        lines.push("Refuerza " + named + " por su mayor necesidad relativa y margen de impacto.");
      }
    }

    if(decreases.length){
      const released = Math.abs(planScenarioRound(decreases.reduce((sum, row)=> sum + Number(row.delta || 0), 0)));
      lines.push("Recorta planes menos urgentes para reubicar " + formatMoney(released) + " hacia frentes mas criticos.");
    }

    if(Number(scenario.assignedAfter || 0) > Number(scenario.assignedBefore || 0)){
      const activated = planScenarioRound(Number(scenario.assignedAfter || 0) - Number(scenario.assignedBefore || 0));
      lines.push("Activa " + formatMoney(activated) + " del saldo disponible sin exceder el presupuesto anual.");
    }

    if(summary.traceMeters > 0){
      const prefix = summary.geocodedAssets > 0
        ? ("Cruza " + summary.geocodedAssets + " activos georreferenciados e incorpora ")
        : "Incorpora ";
      lines.push(prefix + formatCompactMeters(summary.traceMeters) + " de trazos para decidir por cercania real.");
    } else if(summary.geocodedAssets > 0){
      lines.push("Cruza " + summary.geocodedAssets + " activos georreferenciados con reportes, salud y escuelas para decidir el refuerzo.");
    }

    if(reportSignals.total){
      const hotspotLead = Array.isArray(reportSignals.hotspots) ? reportSignals.hotspots.slice(0, 2) : [];
      if(hotspotLead.length){
        lines.push("Se alinea con reportes concentrados en " + hotspotLead.map((item)=> item.zone + " (" + item.count + ")").join(" y ") + ".");
      } else {
        lines.push("Toma como base " + reportSignals.total + " reportes locales para redistribuir prioridad.");
      }
    } else {
      lines.push("Se apoya en activos, trazos e intervenciones porque no hay reportes locales cargados.");
    }

    return lines.slice(0, 4);
  }

  function getPlanAISummaryLine(scenario){
    if(!scenario || !Array.isArray(scenario.rows) || !scenario.rows.length){
      return "No hay comparativo IA disponible.";
    }
    const increases = scenario.rows
      .filter((row)=> row.delta > 0)
      .sort((a,b)=> b.delta - a.delta);
    const decreases = scenario.rows
      .filter((row)=> row.delta < 0)
      .sort((a,b)=> a.delta - b.delta);
    const up = increases[0];
    const down = decreases[0];
    const summary = scenario.summary || summarizePlanAIScenarioRows(scenario.rows);
    const parts = [
      "Comparativo IA generado para " + scenario.rows.length + " planes"
        + (summary.assetCount ? (" con " + summary.assetCount + " activos vinculados") : "")
        + "."
    ];
    if(up){
      parts.push("Mayor refuerzo: " + up.planName + " (" + formatMoney(up.delta) + ").");
    }
    if(down){
      parts.push("Mayor ajuste: " + down.planName + " (-" + formatMoney(Math.abs(down.delta)) + ").");
    }
    parts.push("Total sugerido: " + formatMoney(scenario.assignedAfter) + ".");
    return parts.join(" ");
  }

  function buildPlanAIScenarioNote(scenario){
    if(!scenario || !Array.isArray(scenario.rows) || !scenario.rows.length){
      return "No hay comparativo IA disponible.";
    }
    const summary = scenario.summary || summarizePlanAIScenarioRows(scenario.rows);
    const lines = [getPlanAISummaryLine(scenario)];
    const sensitiveSummary = buildPlanAISensitiveSummary(summary, { withCount: true, max: 3 });
    if(summary.assetCount > 0){
      lines.push(
        "Base analizada: "
        + summary.assetCount + " activos, "
        + summary.criticalCount + " criticos, "
        + (sensitiveSummary ? ("lugares sensibles en " + sensitiveSummary) : "sin lugares sensibles destacados")
        + (summary.traceMeters > 0 ? (", " + formatCompactMeters(summary.traceMeters) + " de trazos.") : ".")
      );
    }
    const improvementLines = getPlanAIImprovementLines(scenario);
    if(improvementLines.length){
      lines.push("Que mejora esta propuesta:");
      improvementLines.forEach((line)=> lines.push("- " + line));
    }
    if(Number(scenario.budgetTotal || 0) > 0){
      lines.push("Saldo sugerido tras el ajuste: " + formatMoney(scenario.remainingAfter) + ".");
    } else {
      lines.push("Todavia no hay presupuesto anual definido para medir mejor el margen disponible.");
    }
    return lines.join("\n");
  }

  function renderPlanAIScenario(plans, presupuesto){
    if(!aiPlanCompareCard || !aiPlanCompareBody) return;
    aiPlanCompareCard.classList.remove("hidden");
    const emptyColspan = 6;

    const year = Number(presupuesto && presupuesto.year || new Date().getFullYear());
    const currentSignature = getPlanAmountSignature(plans || []);
    if(aiPlanScenario && aiPlanScenario.year !== year){
      aiPlanScenario = null;
      aiPlanAppliedScenarioId = "";
    }

    if(!Array.isArray(plans) || !plans.length){
      aiPlanCompareMeta.textContent = "No hay planes registrados para el periodo.";
      aiPlanCompareBody.innerHTML = "<tr><td colspan=\"" + emptyColspan + "\" class=\"empty\">Registra al menos un plan para solicitar sugerencias IA.</td></tr>";
      if(aiPlanCompareHighlights) aiPlanCompareHighlights.innerHTML = "";
      if(aiPlanCompareNote) aiPlanCompareNote.textContent = "Define planes y luego usa \"Sugerir con IA\" para obtener un comparativo.";
      if(btnPlanAIApply) btnPlanAIApply.disabled = true;
      if(btnPlanAIRevert) btnPlanAIRevert.disabled = !aiPlanSnapshotBeforeApply;
      if(btnPlanAIDiscard) btnPlanAIDiscard.disabled = !aiPlanScenario;
      return;
    }

    if(!aiPlanScenario || !Array.isArray(aiPlanScenario.rows) || !aiPlanScenario.rows.length){
      aiPlanCompareMeta.textContent = "Periodo " + year + " · Sin escenario IA aplicado.";
      aiPlanCompareBody.innerHTML = "<tr><td colspan=\"" + emptyColspan + "\" class=\"empty\">Solicita una sugerencia para ver comparativo.</td></tr>";
      if(aiPlanCompareHighlights) aiPlanCompareHighlights.innerHTML = "";
      if(aiPlanCompareNote){
        const baseNote = "La IA cruza senales, trazos, mobiliario, avance e incidencias para proponer una redistribucion.";
        aiPlanCompareNote.textContent = aiPlanSnapshotBeforeApply
          ? "Hay un cambio IA aplicado pendiente de revertir. " + baseNote
          : baseNote;
      }
      if(btnPlanAIApply) btnPlanAIApply.disabled = true;
      if(btnPlanAIRevert) btnPlanAIRevert.disabled = !aiPlanSnapshotBeforeApply;
      if(btnPlanAIDiscard) btnPlanAIDiscard.disabled = true;
      return;
    }

    const stale = aiPlanScenario.baseSignature && aiPlanScenario.baseSignature !== currentSignature;
    const generatedAt = formatDateTimeShort(aiPlanScenario.createdAt);
    aiPlanCompareMeta.textContent = "Periodo " + aiPlanScenario.year
      + " · Generado " + (generatedAt || "recientemente")
      + (stale ? " · Desactualizado por cambios manuales" : "");

    if(aiPlanCompareHighlights){
      const highlights = buildPlanAIScenarioHighlights(aiPlanScenario);
      aiPlanCompareHighlights.innerHTML = highlights.map((item)=>(
        "<div class=\"inv-plan-ai-highlight\">"
        +   "<span class=\"inv-plan-ai-highlight-label\">" + escapeHtml(item.label || "Dato") + "</span>"
        +   "<span class=\"inv-plan-ai-highlight-value\">" + escapeHtml(item.value || "-") + "</span>"
        + "</div>"
      )).join("");
    }

    aiPlanCompareBody.innerHTML = aiPlanScenario.rows.map((row)=>{
      const delta = Number(row.delta || 0);
      const deltaClass = delta > 0 ? "inv-plan-ai-delta-up" : (delta < 0 ? "inv-plan-ai-delta-down" : "");
      const sign = delta > 0 ? "+" : "";
      const planMeta = [
        row.priorityRank ? ("Prioridad #" + row.priorityRank) : "",
        row.priorityLabel || "",
        row.confidenceLabel ? ("Confianza " + row.confidenceLabel) : ""
      ].filter(Boolean).join(" · ");
      const evidenceChips = Array.isArray(row.evidenceChips) ? row.evidenceChips : [];
      return ""
        + "<tr data-plan-id=\"" + escapeHtml(row.planId) + "\">"
        +   "<td>"
        +     "<div class=\"inv-plan-ai-plan-name\">" + escapeHtml(row.planName || "Plan") + "</div>"
        +     "<div class=\"inv-plan-ai-plan-meta\">" + escapeHtml(planMeta || "Cobertura base") + "</div>"
        +   "</td>"
        +   "<td>" + escapeHtml(formatMoney(row.actual)) + "</td>"
        +   "<td>" + escapeHtml(formatMoney(row.suggested)) + "</td>"
        +   "<td class=\"" + deltaClass + "\">" + escapeHtml(sign + formatMoney(delta)) + "</td>"
        +   "<td>"
        +     "<div class=\"inv-plan-ai-cell-title\">" + escapeHtml(row.impact || "Impacto balanceado") + "</div>"
        +     "<div class=\"inv-plan-ai-cell-sub\">" + escapeHtml(row.reason || "Ajuste balanceado") + "</div>"
        +   "</td>"
        +   "<td>"
        +     (evidenceChips.length
          ? ("<div class=\"inv-plan-ai-evidence\">" + evidenceChips.map((chip)=> "<span class=\"inv-plan-ai-pill\">" + escapeHtml(chip) + "</span>").join("") + "</div>")
          : "<span class=\"inv-plan-ai-muted\">Sin evidencia adicional</span>")
        +   "</td>"
        + "</tr>";
    }).join("");

    if(aiPlanCompareNote){
      aiPlanCompareNote.textContent = aiPlanScenario.note || getPlanAISummaryLine(aiPlanScenario);
    }

    if(btnPlanAIApply){
      btnPlanAIApply.disabled = aiPlanAppliedScenarioId === aiPlanScenario.id;
    }
    if(btnPlanAIRevert){
      btnPlanAIRevert.disabled = !aiPlanSnapshotBeforeApply;
    }
    if(btnPlanAIDiscard){
      btnPlanAIDiscard.disabled = false;
    }
  }

  function suggestPlanAIScenario(){
    const presupuesto = getPresupuesto();
    const year = Number(presupuesto && presupuesto.year || new Date().getFullYear());
    const plans = getPlanesDelAnio(year);
    if(!plans.length){
      renderPlanAIScenario(plans, presupuesto);
      return {
        ok: false,
        message: "Primero registra al menos un plan para generar sugerencias."
      };
    }
    aiPlanScenario = buildPlanAIScenarioForYear(plans, presupuesto);
    aiPlanAppliedScenarioId = "";
    renderPlanAIScenario(plans, presupuesto);
    return {
      ok: true,
      scenario: aiPlanScenario,
      message: getPlanAISummaryLine(aiPlanScenario)
    };
  }

  function applyPlanAIScenario(){
    const presupuesto = getPresupuesto();
    const year = Number(presupuesto && presupuesto.year || new Date().getFullYear());
    const plans = getPlanesDelAnio(year);
    if(!plans.length){
      return { ok: false, message: "No hay planes para aplicar la sugerencia IA." };
    }
    if(!aiPlanScenario || !Array.isArray(aiPlanScenario.rows) || !aiPlanScenario.rows.length){
      return { ok: false, message: "Genera primero un comparativo IA." };
    }

    const currentSignature = getPlanAmountSignature(plans);
    if(aiPlanScenario.baseSignature && aiPlanScenario.baseSignature !== currentSignature){
      aiPlanScenario = buildPlanAIScenarioForYear(plans, presupuesto);
    }

    if(!aiPlanSnapshotBeforeApply){
      aiPlanSnapshotBeforeApply = {
        year,
        items: plans.map((plan)=> ({ id: String(plan.id || ""), monto: planScenarioRound(plan.monto) }))
      };
    }

    let changed = 0;
    aiPlanScenario.rows.forEach((row)=>{
      const plan = plans.find((item)=> String(item.id || "") === String(row.planId || ""));
      if(!plan) return;
      const nextAmount = planScenarioRound(row.suggested);
      if(planScenarioRound(plan.monto) === nextAmount) return;
      plan.monto = nextAmount;
      changed += 1;
      syncPlanToBackend(plan);
    });

    if(changed === 0){
      return { ok: false, message: "No hubo cambios que aplicar en los planes." };
    }

    guardarPlanes();
    aiPlanAppliedScenarioId = aiPlanScenario.id;
    updateInversionPlanes();
    return {
      ok: true,
      changed,
      message: "Se aplico la sugerencia IA en " + changed + " planes."
    };
  }

  function revertPlanAIScenario(){
    if(!aiPlanSnapshotBeforeApply || !Array.isArray(aiPlanSnapshotBeforeApply.items) || !aiPlanSnapshotBeforeApply.items.length){
      return { ok: false, message: "No hay cambios IA aplicados para revertir." };
    }
    const year = Number(aiPlanSnapshotBeforeApply.year || (getPresupuesto().year || new Date().getFullYear()));
    const plans = getPlanesDelAnio(year);
    let changed = 0;
    aiPlanSnapshotBeforeApply.items.forEach((saved)=>{
      const plan = plans.find((item)=> String(item.id || "") === String(saved.id || ""));
      if(!plan) return;
      const prevAmount = planScenarioRound(saved.monto);
      if(planScenarioRound(plan.monto) === prevAmount) return;
      plan.monto = prevAmount;
      changed += 1;
      syncPlanToBackend(plan);
    });

    if(changed === 0){
      aiPlanSnapshotBeforeApply = null;
      aiPlanAppliedScenarioId = "";
      updateInversionPlanes();
      return { ok: false, message: "No se detectaron diferencias para revertir." };
    }

    guardarPlanes();
    aiPlanSnapshotBeforeApply = null;
    aiPlanAppliedScenarioId = "";
    updateInversionPlanes();
    return {
      ok: true,
      changed,
      message: "Se revirtieron " + changed + " cambios aplicados por IA."
    };
  }

  function discardPlanAISuggestion(){
    aiPlanScenario = null;
    aiPlanAppliedScenarioId = "";
    updateInversionPlanes();
    return {
      ok: true,
      message: "Comparativo IA descartado."
    };
  }

  function getPlanAIChatContext(){
    const presupuesto = getPresupuesto();
    const year = Number(presupuesto && presupuesto.year || new Date().getFullYear());
    const plans = getPlanesDelAnio(year);
    const assigned = plans.reduce((sum, plan)=> sum + toPositiveNumber(plan.monto), 0);
    const reportSignals = collectPlanAIReportSignals();
    const evaluations = plans.map((plan)=> evaluatePlanForAI(plan, reportSignals));
    const byPlanId = new Map(evaluations.map((item)=> [String(item.planId || ""), item]));
    const liveSummary = summarizePlanAIScenarioRows(evaluations.map((item)=> ({ metrics: item.metrics })));
    return {
      year,
      budgetTotal: planScenarioRound(presupuesto && presupuesto.total || 0),
      assigned: planScenarioRound(assigned),
      remaining: Math.max(0, planScenarioRound((presupuesto && presupuesto.total || 0) - assigned)),
      plans: plans.map((plan)=> {
        const evaluation = byPlanId.get(String(plan.id || ""));
        const metrics = evaluation && evaluation.metrics ? evaluation.metrics : {};
        return {
          id: String(plan.id || ""),
          name: plan.nombre || "Plan",
          amount: planScenarioRound(plan.monto),
          assetCount: Number(metrics.assetCount || 0),
          criticalCount: Number(metrics.criticalCount || 0),
          sensitiveCount: Number(metrics.sensitiveCount || 0),
          traceMeters: Number(metrics.traceMeters || 0),
          confidence: metrics.confidenceLabel || "Base",
          priority: evaluation && evaluation.priorityLabel ? evaluation.priorityLabel : "Balanceada",
          reason: evaluation && evaluation.reason ? evaluation.reason : ""
        };
      }),
      reportSignals,
      summary: aiPlanScenario && aiPlanScenario.summary ? aiPlanScenario.summary : liveSummary,
      scenario: aiPlanScenario ? {
        assignedAfter: aiPlanScenario.assignedAfter,
        remainingAfter: aiPlanScenario.remainingAfter,
        summaryNote: buildPlanAIScenarioNote(aiPlanScenario),
        improvements: getPlanAIImprovementLines(aiPlanScenario),
        topChanges: aiPlanScenario.rows
          .slice()
          .sort((a,b)=> Math.abs(b.delta) - Math.abs(a.delta))
          .slice(0, 3)
          .map((row)=> ({
            plan: row.planName,
            delta: row.delta,
            reason: row.reason,
            impact: row.impact,
            evidence: row.evidenceChips,
            metrics: {
              assetCount: Number(row.metrics && row.metrics.assetCount || 0),
              criticalCount: Number(row.metrics && row.metrics.criticalCount || 0),
              sensitiveCount: Number(row.metrics && row.metrics.sensitiveCount || 0),
              traceMeters: Number(row.metrics && row.metrics.traceMeters || 0),
              confidence: row.confidenceLabel || "Base"
            }
          }))
      } : null,
      hasApplied: !!aiPlanSnapshotBeforeApply
    };
  }

  function getPlanAIStatus(){
    return {
      hasScenario: !!(aiPlanScenario && Array.isArray(aiPlanScenario.rows) && aiPlanScenario.rows.length),
      hasApplied: !!aiPlanSnapshotBeforeApply,
      scenarioId: aiPlanScenario ? aiPlanScenario.id : "",
      appliedScenarioId: aiPlanAppliedScenarioId || ""
    };
  }

  function updateInversionPlanes(){
    cargarPlanes();
    cargarIntervenciones();
    const presupuesto = getPresupuesto();
    const anio = Number(presupuesto.year || new Date().getFullYear());
    const plans = getPlanesDelAnio(anio);
    renderAnual(plans, presupuesto);
    renderPlanBoard(plans);
    renderIntervencionesGrouped();
    renderPlanAIScenario(plans, presupuesto);
  }

  function prepararProyectosParaModal(plan){
    if(!plan || !Array.isArray(plan.proyectos)) return [];
    const hasDetalles = planTieneDetalles(plan);
    const proyectos = plan.proyectos.map((p)=> normalizeProyecto(p, plan.estado));
    if(!proyectos.length) return proyectos;
    if(hasDetalles) return proyectos;
    const montoPlan = toPositiveNumber(plan.monto || 0);
    const ejecPlan = toPositiveNumber(plan.ejecutado || 0);
    if(montoPlan <= 0 && ejecPlan <= 0) return proyectos;
    const count = proyectos.length || 1;
    const montoUnit = montoPlan / count;
    const ejecUnit = ejecPlan / count;
    const estadoFallback = plan.estado || "planificacion";
    return proyectos.map((p)=> Object.assign({}, p, {
      estado: p.estado || estadoFallback,
      montoAsignado: p.montoAsignado > 0 ? p.montoAsignado : montoUnit,
      ejecutado: p.ejecutado > 0 ? p.ejecutado : ejecUnit
    }));
  }

  function abrirModalPlan(plan){
    const presupuesto = getPresupuesto();
    if(!presupuesto || !Number(presupuesto.total || 0)){
      abrirModalPresupuesto();
      return;
    }
    planEditId = plan ? String(plan.id || "") : "";
    if(planModalTitle) planModalTitle.textContent = plan ? "Modificar plan" : "Registrar plan";
    if(planNombre) planNombre.value = plan ? (plan.nombre || "") : "";
    const modalAnio = plan ? (plan.anio || presupuesto.year) : (presupuesto.year || "");
    if(planAnio) planAnio.value = String(modalAnio);
    if(planMonto) planMonto.value = plan ? Number(plan.monto || 0) : "";
    actualizarMontoPlanDisponible(modalAnio, planEditId);
    planDraftProjects = plan && Array.isArray(plan.proyectos)
      ? plan.proyectos.map(p => ({ id: String(p.id || ""), nombre: String(p.nombre || "Proyecto") }))
      : [];
    renderProyectosList();
    if(planProjectName) planProjectName.value = "";
    mostrarModal(modalPlan);
  }

  function cerrarModalPlan(){
    ocultarModal(modalPlan);
  }

  function abrirModalPresupuesto(){
    const presupuesto = getPresupuesto();
    if(presupuestoAnio) presupuestoAnio.value = presupuesto && presupuesto.year ? presupuesto.year : new Date().getFullYear();
    if(presupuestoTotal) presupuestoTotal.value = presupuesto && Number(presupuesto.total) ? Number(presupuesto.total) : "";
    mostrarModal(modalPresupuesto);
  }

  function cerrarModalPresupuesto(){
    ocultarModal(modalPresupuesto);
  }

  function mostrarModal(el){
    if(!el) return;
    el.classList.remove("hidden");
    el.setAttribute("aria-hidden","false");
  }

  function ocultarModal(el){
    if(!el) return;
    el.classList.add("hidden");
    el.setAttribute("aria-hidden","true");
  }

  function guardarPlanDesdeModal(){
    const nombre = planNombre ? planNombre.value.trim() : "";
    const anio = Number(planAnio ? planAnio.value : 0);
    const monto = Number(planMonto ? planMonto.value : 0);
    if(!nombre){
      alert("Ingresa un nombre para el plan.");
      return;
    }
    if(!anio || anio < 2000){
      alert("Ingresa un año valido.");
      return;
    }
    if(!Number.isFinite(monto) || monto <= 0){
      alert("Ingresa un monto total valido.");
      return;
    }
    const disponible = getMontoDisponiblePlanParaModal(anio, planEditId);
    if(monto > disponible){
      alert("El monto del plan excede el presupuesto anual disponible. Disponible: " + formatMoney(disponible));
      return;
    }
    const base = {
      id: planEditId || ("plan-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6)),
      nombre,
      monto,
      anio,
      proyectos: planDraftProjects.slice()
    };
    if(!planEditId){
      base.creado = new Date().toISOString();
    }
    if(planEditId){
      const idx = planesCache.findIndex(p => p.id === planEditId);
      if(idx >= 0){
        planesCache[idx] = normalizePlan(Object.assign({}, planesCache[idx], base));
        syncPlanToBackend(planesCache[idx]);
      }
    } else {
      const nuevo = normalizePlan(base);
      planesCache.push(nuevo);
      planSeleccionadoId = nuevo.id;
      syncPlanToBackend(nuevo);
    }
    guardarPlanes();
    cerrarModalPlan();
    updateInversionPlanes();
  }

  function guardarPresupuestoDesdeModal(){
    const anio = Number(presupuestoAnio ? presupuestoAnio.value : 0);
    const total = Number(presupuestoTotal ? presupuestoTotal.value : 0);
    if(!anio || anio < 2000){
      alert("Ingresa un anio valido.");
      return;
    }
    if(total < 0 || Number.isNaN(total)){
      alert("Ingresa un monto valido.");
      return;
    }
    guardarPresupuesto({ year: anio, total: total });
    syncPresupuestoToBackend({ year: anio, total: total });
    cerrarModalPresupuesto();
    updateInversionPlanes();
  }

  function toDateInputValue(value){
    if(!value) return "";
    return String(value).slice(0, 10);
  }

  function getIntervencionById(id){
    return intervencionesCache.find(i => String(i.id || "") === String(id || "")) || null;
  }

  function getMontoDisponiblePlan(planId, excludeId){
    const plan = getPlanById(planId);
    const total = plan ? toPositiveNumber(plan.monto) : 0;
    if(!total) return 0;
    let usado = 0;
    intervencionesCache.forEach((i)=>{
      if(String(i.planId || "") !== String(planId || "")) return;
      if(excludeId && String(i.id || "") === String(excludeId)) return;
      usado += toPositiveNumber(i.monto);
    });
    return Math.max(0, total - usado);
  }

  function actualizarLimiteIntervencionMonto(planId, excludeId){
    if(!intervencionMonto) return;
    const max = getMontoDisponiblePlan(planId, excludeId);
    if(Number.isFinite(max) && max > 0){
      intervencionMonto.max = String(Math.floor(max));
    } else {
      intervencionMonto.removeAttribute("max");
    }
    const current = toPositiveNumber(intervencionMonto.value);
    if(max >= 0 && current > max){
      intervencionMonto.value = String(Math.floor(max));
    }
  }

  function actualizarIntervencionPlanOptions(preselectId){
    if(!intervencionPlan) return null;
    const presupuesto = getPresupuesto();
    const plans = getPlanesDelAnio(presupuesto.year);
    if(!plans.length){
      intervencionPlan.innerHTML = "<option value=\"\">Sin planes</option>";
      if(intervencionPlanName) intervencionPlanName.value = "";
      return null;
    }
    intervencionPlan.innerHTML = plans.map((p)=>(
      "<option value=\"" + escapeHtml(p.id) + "\">" + escapeHtml(p.nombre || "Plan") + "</option>"
    )).join("");
    let selected = preselectId;
    if(!selected || !plans.some(p => String(p.id || "") === String(selected))){
      selected = (planSeleccionadoId && plans.some(p => String(p.id || "") === String(planSeleccionadoId)))
        ? planSeleccionadoId
        : plans[0].id;
    }
    intervencionPlan.value = selected;
    const plan = getPlanById(selected);
    if(intervencionPlanName){
      intervencionPlanName.value = plan ? ((plan.nombre || "Plan") + " " + (plan.anio || "")) : "";
    }
    return plan;
  }

  function actualizarIntervencionProyectoOptions(plan, preselectId){
    if(!intervencionProyecto) return;
    const selectedText = String(preselectId || "") || intervencionProyecto.getAttribute("data-selected-name") || "";
    if(selectedText){
      const key = normalizarProyectoKey(selectedText);
      intervencionProyecto.innerHTML = "<option value=\"" + escapeHtml(key) + "\">" + escapeHtml(selectedText) + "</option>";
      intervencionProyecto.value = key;
      return;
    }
    intervencionProyecto.innerHTML = "<option value=\"\">Sin proyecto asociado</option>";
  }

  function actualizarIntervencionAccionOptions(preselectId){
    if(!intervencionAccion) return null;
    const acciones = obtenerAccionesDisponibles();
    if(!acciones.length){
      intervencionAccion.innerHTML = "<option value=\"\">Sin intervenciones registradas</option>";
      return null;
    }
    intervencionAccion.innerHTML = acciones.map((a)=>(
      "<option value=\"" + escapeHtml(a.id) + "\">" + escapeHtml(a.nombre || "Accion") + "</option>"
    )).join("");
    if(preselectId && acciones.some(a => String(a.id || "") === String(preselectId))){
      intervencionAccion.value = preselectId;
    }
    const accion = getAccionById(intervencionAccion.value);
    syncIntervencionProyectoFromAccion(accion);
    return accion;
  }

  function syncIntervencionFechas(accion){
    if(!intervencionFechaInicio || !intervencionFechaFin) return;
    const inicio = accion && (accion.fecha_inicio || accion.startDate || accion.inicio) || "";
    const fin = accion && (accion.fecha_fin || accion.endDate || accion.fin) || "";
    intervencionFechaInicio.value = toDateInputValue(inicio);
    intervencionFechaFin.value = toDateInputValue(fin);
  }

  function syncIntervencionProyectoFromAccion(accion){
    if(!intervencionProyecto || !accion) return;
    const nombre = getAccionProyectoAsociado(accion);
    if(!nombre) return;
    const key = normalizarProyectoKey(nombre);
    if(!key) return;
    intervencionProyecto.innerHTML = "<option value=\"" + escapeHtml(key) + "\">" + escapeHtml(nombre) + "</option>";
    intervencionProyecto.value = key;
  }

  function abrirModalIntervencion(intervencion){
    const plan = actualizarIntervencionPlanOptions(intervencion ? intervencion.planId : "");
    if(!plan){
      alert("Registra un plan antes de agregar intervenciones.");
      return;
    }
    intervencionEditId = intervencion ? String(intervencion.id || "") : "";
    if(intervencionModalTitle){
      intervencionModalTitle.textContent = intervencion ? "Editar intervension" : "Nueva intervension";
    }
    if(intervencionProyecto){
      if(intervencion && intervencion.proyectoNombre){
        intervencionProyecto.setAttribute("data-selected-name", String(intervencion.proyectoNombre || ""));
      } else {
        intervencionProyecto.removeAttribute("data-selected-name");
      }
    }
    actualizarIntervencionProyectoOptions(plan, intervencion ? (intervencion.proyectoNombre || "") : "");
    const accion = actualizarIntervencionAccionOptions(intervencion ? intervencion.accionId : "");
    if(intervencionMonto) intervencionMonto.value = intervencion ? toPositiveNumber(intervencion.monto) : "";
    if(intervencionFase) intervencionFase.value = intervencion ? (intervencion.fase || "planificacion") : "planificacion";
    actualizarLimiteIntervencionMonto(plan.id, intervencionEditId);
    if(intervencion){
      if(intervencionFechaInicio) intervencionFechaInicio.value = toDateInputValue(intervencion.fechaInicio || intervencion.fecha_inicio || "");
      if(intervencionFechaFin) intervencionFechaFin.value = toDateInputValue(intervencion.fechaFin || intervencion.fecha_fin || "");
    } else {
      syncIntervencionFechas(accion);
    }
    mostrarModal(modalIntervencion);
  }

  function cerrarModalIntervencion(){
    ocultarModal(modalIntervencion);
  }

  function labelEstadoSimple(estado){
    if(estado === "nueva") return "Operativa";
    if(estado === "antigua") return "Deteriorada";
    if(estado === "sin_senal") return "No operativa";
    return estado || "";
  }

  function nombreActivo(item){
    if(!item) return "Activo";
    return item.nombre || item.tipo || item.icono || "Activo";
  }

  function renderDetalleList(container, items){
    if(!container) return;
    if(!items || !items.length){
      container.innerHTML = "<div class=\"inv-detail-empty\">Sin registros.</div>";
      return;
    }
    container.innerHTML = "<ul class=\"inv-detail-list\">" + items.map((it)=>{
      const estado = labelEstadoSimple(it && it.estado);
      const texto = escapeHtml(nombreActivo(it)) + (estado ? (" <span>(" + escapeHtml(estado) + ")</span>") : "");
      return "<li>" + texto + "</li>";
    }).join("") + "</ul>";
  }

  function abrirModalIntervencionDetalle(intervencion){
    if(!modalIntervencionDetalle || !intervencion) return;
    const accion = getAccionById(intervencion.accionId);
    const nombre = intervencion.nombre || intervencion.accionNombre || (accion ? accion.nombre : "") || "Intervencion";
    const proyecto = intervencion.proyectoNombre || getAccionProyectoAsociado(accion) || "Sin proyecto asociado";
    if(intervencionDetalleTitle){
      intervencionDetalleTitle.textContent = "Detalle: " + nombre;
    }
    if(intervencionDetalleMeta){
      const meta = []
        .concat(intervencion.planNombre ? ("Plan: " + intervencion.planNombre) : [])
        .concat(proyecto ? ("Proyecto: " + proyecto) : [])
        .concat(intervencion.fase ? ("Fase: " + (PLAN_ESTADOS[intervencion.fase] || intervencion.fase)) : [])
        .filter(Boolean);
      intervencionDetalleMeta.textContent = meta.join(" · ");
    }
    const vertical = accion && Array.isArray(accion.senalesVertical) ? accion.senalesVertical : [];
    const horizontal = accion && Array.isArray(accion.senalesHorizontal) ? accion.senalesHorizontal : [];
    const mobiliario = accion && Array.isArray(accion.senalesMobiliario) ? accion.senalesMobiliario : [];
    renderDetalleList(intervencionDetalleTransito, vertical);
    renderDetalleList(intervencionDetalleMarcas, horizontal);
    renderDetalleList(intervencionDetalleMobiliario, mobiliario);
    mostrarModal(modalIntervencionDetalle);
  }

  function cerrarModalIntervencionDetalle(){
    ocultarModal(modalIntervencionDetalle);
  }

  function guardarIntervencionDesdeModal(){
    const planId = intervencionPlan ? intervencionPlan.value : "";
    const plan = getPlanById(planId);
    if(!plan){
      alert("Selecciona un plan valido.");
      return;
    }
    const accionId = intervencionAccion ? intervencionAccion.value : "";
    if(!accionId){
      alert("Selecciona una accion disponible.");
      return;
    }
    const monto = toPositiveNumber(intervencionMonto ? intervencionMonto.value : 0);
    if(!monto){
      alert("Ingresa un monto valido.");
      return;
    }
    const maxDisponible = getMontoDisponiblePlan(planId, intervencionEditId);
    if(monto > maxDisponible){
      alert("El monto excede el disponible del plan. Disponible: " + formatMoney(maxDisponible));
      return;
    }
    const fase = intervencionFase ? (intervencionFase.value || "planificacion") : "planificacion";
    const accion = getAccionById(accionId);
    const nombreAccion = accion ? accion.nombre : (intervencionAccion && intervencionAccion.selectedOptions[0] ? intervencionAccion.selectedOptions[0].textContent : "");
    const proyectoDesdeAccion = getAccionProyectoAsociado(accion);
    let proyectoId = intervencionProyecto ? (intervencionProyecto.value || "") : "";
    let proyectoNombre = "";
    if(intervencionProyecto && intervencionProyecto.selectedOptions && intervencionProyecto.selectedOptions[0]){
      proyectoNombre = String(intervencionProyecto.selectedOptions[0].textContent || "").trim();
    }
    if(!proyectoNombre && proyectoDesdeAccion){
      proyectoNombre = proyectoDesdeAccion;
    }
    if(!proyectoNombre){
      proyectoNombre = getProyectoNombre(plan, proyectoId) || "Sin proyecto asociado";
    }
    if(!proyectoId && proyectoNombre){
      proyectoId = normalizarProyectoKey(proyectoNombre);
    }
    const payload = {
      id: intervencionEditId || ("interv-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6)),
      planId,
      planNombre: plan.nombre || "Plan",
      proyectoId,
      proyectoNombre,
      accionId,
      accionNombre: nombreAccion || "Intervension",
      nombre: nombreAccion || "Intervension",
      monto,
      fase,
      fechaInicio: intervencionFechaInicio ? intervencionFechaInicio.value : "",
      fechaFin: intervencionFechaFin ? intervencionFechaFin.value : ""
    };
    if(intervencionEditId){
      const idx = intervencionesCache.findIndex(i => String(i.id || "") === String(intervencionEditId));
      if(idx >= 0){
        payload.dbId = intervencionesCache[idx].dbId;
        intervencionesCache[idx] = payload;
      } else {
        intervencionesCache.push(payload);
      }
    } else {
      intervencionesCache.push(payload);
    }
    guardarIntervenciones();
    syncInterventionToBackend(payload);
    cerrarModalIntervencion();
    updateInversionPlanes();
  }

  if(btnPlanNuevo) btnPlanNuevo.addEventListener("click", ()=> abrirModalPlan(null));
  if(invPlanBoardList){
    invPlanBoardList.addEventListener("click", (e)=>{
      const planAction = e.target && e.target.closest ? e.target.closest("[data-plan-action]") : null;
      if(planAction){
        const action = planAction.getAttribute("data-plan-action");
        const card = planAction.closest("[data-plan-id]");
        const id = card ? card.getAttribute("data-plan-id") : "";
        const plan = getPlanById(id);
        if(!plan) return;
        if(action === "edit"){
          planSeleccionadoId = plan.id;
          abrirModalPlan(plan);
          return;
        }
        if(action === "delete"){
          const ok = confirm("Eliminar el plan y sus intervenciones?");
          if(!ok) return;
          deletePlanFromBackend(plan);
          const eliminadas = intervencionesCache.filter(i => String(i.planId || "") === String(plan.id || ""));
          eliminadas.forEach((i)=> deleteInterventionFromBackend(i));
          intervencionesCache = intervencionesCache.filter(i => String(i.planId || "") !== String(plan.id || ""));
          planesCache = planesCache.filter(p => String(p.id || "") !== String(plan.id || ""));
          if(planSeleccionadoId === plan.id){
            planSeleccionadoId = planesCache[0] ? planesCache[0].id : "";
          }
          guardarIntervenciones();
          guardarPlanes();
          updateInversionPlanes();
          return;
        }
      }
      const toggleBtn = e.target && e.target.closest ? e.target.closest("[data-plan-toggle]") : null;
      if(toggleBtn){
        const card = toggleBtn.closest("[data-plan-id]");
        const id = card ? card.getAttribute("data-plan-id") : "";
        if(!id) return;
        const current = planCollapseState.get(id);
        planCollapseState.set(id, !current);
        renderPlanBoard(getPlanesDelAnio(getPresupuesto().year));
        return;
      }
      const addProjectBtn = e.target && e.target.closest ? e.target.closest("[data-plan-project-add]") : null;
      if(addProjectBtn){
        const card = addProjectBtn.closest("[data-plan-id]");
        const id = card ? card.getAttribute("data-plan-id") : "";
        if(id) planSeleccionadoId = id;
        abrirModalPlanProject(id);
        return;
      }
      const newBtn = e.target && e.target.closest ? e.target.closest("[data-intervencion-new]") : null;
      if(newBtn){
        const wrap = newBtn.closest("[data-plan-id]");
        const planId = wrap ? wrap.getAttribute("data-plan-id") : "";
        if(planId){
          planSeleccionadoId = planId;
        }
        if(intervencionProyecto) intervencionProyecto.removeAttribute("data-selected-name");
        abrirModalIntervencion(null);
        return;
      }
      const nameBtn = e.target && e.target.closest ? e.target.closest("[data-intervencion-link]") : null;
      if(nameBtn){
        const row = nameBtn.closest("tr");
        const id = row ? row.getAttribute("data-intervencion-id") : "";
        const item = getIntervencionById(id);
        if(item){
          abrirModalIntervencionDetalle(item);
        }
        return;
      }
      const btn = e.target && e.target.closest ? e.target.closest("[data-intervencion-action]") : null;
      if(!btn) return;
      const action = btn.getAttribute("data-intervencion-action");
      const row = btn.closest("tr");
      const id = row ? row.getAttribute("data-intervencion-id") : "";
      const item = getIntervencionById(id);
      if(!item) return;
      if(action === "edit"){
        abrirModalIntervencion(item);
        return;
      }
      if(action === "delete"){
        const ok = confirm("Eliminar la intervension seleccionada?");
        if(!ok) return;
        deleteInterventionFromBackend(item);
        intervencionesCache = intervencionesCache.filter(i => String(i.id || "") !== String(id || ""));
        guardarIntervenciones();
        updateInversionPlanes();
      }
    });
    invPlanBoardList.addEventListener("input", (e)=>{
      const input = e.target && e.target.closest ? e.target.closest(".inv-intervencion-buscar") : null;
      if(!input) return;
      const wrap = input.closest("[data-group-key]");
      const key = wrap ? wrap.getAttribute("data-group-key") : "";
      if(!key) return;
      const current = groupFilters.get(key) || { query: "", fase: "todas" };
      current.query = input.value || "";
      groupFilters.set(key, current);
      renderPlanBoard(getPlanesDelAnio(getPresupuesto().year));
    });
    invPlanBoardList.addEventListener("change", (e)=>{
      const select = e.target && e.target.closest ? e.target.closest(".inv-intervencion-fase") : null;
      if(!select) return;
      const wrap = select.closest("[data-group-key]");
      const key = wrap ? wrap.getAttribute("data-group-key") : "";
      if(!key) return;
      const current = groupFilters.get(key) || { query: "", fase: "todas" };
      current.fase = select.value || "todas";
      groupFilters.set(key, current);
      renderPlanBoard(getPlanesDelAnio(getPresupuesto().year));
    });
  }

  if(btnPlanClose) btnPlanClose.addEventListener("click", cerrarModalPlan);
  if(btnPlanCancelar) btnPlanCancelar.addEventListener("click", cerrarModalPlan);
  if(btnPlanGuardar) btnPlanGuardar.addEventListener("click", guardarPlanDesdeModal);
  if(btnIntervencionDetalleClose) btnIntervencionDetalleClose.addEventListener("click", cerrarModalIntervencionDetalle);
  if(btnPlanAddProject){
    btnPlanAddProject.addEventListener("click", ()=>{
      if(!planProjectName) return;
      const nombre = planProjectName.value.trim();
      if(!nombre) return;
      const exists = planDraftProjects.some(p => String(p.nombre || "").toLowerCase() === nombre.toLowerCase());
      if(exists) return;
      planDraftProjects.push({ id: "assoc-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,5), nombre });
      planProjectName.value = "";
      renderProyectosList();
    });
  }
  if(planProjectName){
    planProjectName.addEventListener("keydown", (e)=>{
      if(e.key === "Enter"){
        e.preventDefault();
        if(btnPlanAddProject) btnPlanAddProject.click();
      }
    });
  }
  if(planAnio){
    planAnio.addEventListener("input", ()=>{
      const anio = Number(planAnio.value || 0);
      actualizarMontoPlanDisponible(anio, planEditId);
    });
  }
  if(planMonto){
    planMonto.addEventListener("input", ()=>{
      const anio = Number(planAnio ? planAnio.value : 0);
      actualizarMontoPlanDisponible(anio, planEditId);
    });
  }
  if(planProjectsList){
    planProjectsList.addEventListener("click", (e)=>{
      const btn = e.target && e.target.closest ? e.target.closest("button[data-action]") : null;
      if(!btn) return;
      const action = btn.getAttribute("data-action");
      const item = btn.closest(".plan-project-item");
      if(!item) return;
      const id = item.getAttribute("data-id");
      if(action === "remove"){
        planDraftProjects = planDraftProjects.filter(p => String(p.id || "") !== String(id || ""));
        renderProyectosList();
        return;
      }
      if(action === "edit"){
        const idx = planDraftProjects.findIndex(p => String(p.id || "") === String(id || ""));
        if(idx < 0) return;
        const nuevo = prompt("Editar nombre del proyecto:", planDraftProjects[idx].nombre || "");
        if(nuevo && nuevo.trim()){
          planDraftProjects[idx].nombre = nuevo.trim();
          renderProyectosList();
        }
      }
    });
  }

  if(btnPresupuestoEditar) btnPresupuestoEditar.addEventListener("click", abrirModalPresupuesto);
  if(btnPresupuestoEditarMini) btnPresupuestoEditarMini.addEventListener("click", abrirModalPresupuesto);
  if(btnPresupuestoClose) btnPresupuestoClose.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoCancelar) btnPresupuestoCancelar.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoGuardar) btnPresupuestoGuardar.addEventListener("click", guardarPresupuestoDesdeModal);

  if(btnIntervencionClose) btnIntervencionClose.addEventListener("click", cerrarModalIntervencion);
  if(btnIntervencionCancelar) btnIntervencionCancelar.addEventListener("click", cerrarModalIntervencion);
  if(btnIntervencionGuardar) btnIntervencionGuardar.addEventListener("click", guardarIntervencionDesdeModal);
  if(btnPlanProjectClose) btnPlanProjectClose.addEventListener("click", cerrarModalPlanProject);
  if(btnPlanProjectCancel) btnPlanProjectCancel.addEventListener("click", cerrarModalPlanProject);
  if(btnPlanProjectSave) btnPlanProjectSave.addEventListener("click", guardarPlanProjectDesdeModal);
  if(planProjectSelect){
    planProjectSelect.addEventListener("change", ()=>{
      const plan = getPlanById(planSeleccionadoId);
      if(!plan) return;
      const selectedName = planProjectSelect.value || "";
      if(planProjectAmount){
        const existingMonto = getMontoProyectoAsignado(plan, selectedName);
        planProjectAmount.value = existingMonto ? String(existingMonto) : "";
      }
      const available = getAvailableProjectBudget(plan, selectedName);
      if(planProjectAmountHint) planProjectAmountHint.textContent = "Disponible: " + formatMoney(available);
      renderPlanProjectActionsList(selectedName, plan);
    });
  }
  if(planProjectAmount){
    planProjectAmount.addEventListener("input", ()=>{
      const plan = getPlanById(planSeleccionadoId);
      if(!plan) return;
      const selectedName = planProjectSelect ? planProjectSelect.value : "";
      const available = getAvailableProjectBudget(plan, selectedName);
      if(planProjectAmountHint) planProjectAmountHint.textContent = "Disponible: " + formatMoney(available);
    });
  }
  if(intervencionMonto){
    intervencionMonto.addEventListener("input", ()=>{
      const planId = intervencionPlan ? intervencionPlan.value : "";
      if(planId) actualizarLimiteIntervencionMonto(planId, intervencionEditId);
    });
  }
  if(intervencionAccion){
    intervencionAccion.addEventListener("change", ()=>{
      const accion = getAccionById(intervencionAccion.value);
      syncIntervencionFechas(accion);
      syncIntervencionProyectoFromAccion(accion);
    });
  }

  if(btnPlanAISuggest){
    btnPlanAISuggest.addEventListener("click", ()=>{
      const result = suggestPlanAIScenario();
      if(!result.ok){
        alert(result.message || "No se pudo generar una sugerencia IA.");
      }
    });
  }
  if(btnPlanAIApply){
    btnPlanAIApply.addEventListener("click", ()=>{
      const result = applyPlanAIScenario();
      if(!result.ok){
        alert(result.message || "No se pudo aplicar la sugerencia IA.");
      }
    });
  }
  if(btnPlanAIRevert){
    btnPlanAIRevert.addEventListener("click", ()=>{
      const result = revertPlanAIScenario();
      if(!result.ok){
        alert(result.message || "No se pudo revertir el escenario IA.");
      }
    });
  }
  if(btnPlanAIDiscard){
    btnPlanAIDiscard.addEventListener("click", ()=>{
      const result = discardPlanAISuggestion();
      if(!result.ok){
        alert(result.message || "No se pudo descartar la sugerencia IA.");
      }
    });
  }

  window.UrbbisPlanAI = {
    suggest: suggestPlanAIScenario,
    apply: applyPlanAIScenario,
    revert: revertPlanAIScenario,
    discard: discardPlanAISuggestion,
    getContext: getPlanAIChatContext,
    getStatus: getPlanAIStatus
  };

  window.updateInversionPlanes = updateInversionPlanes;
  updateInversionPlanes();
  if(window.UrbbisApi){
    cargarPresupuestoApi().then(()=> updateInversionPlanes());
    cargarPlanesApi().then(()=> updateInversionPlanes());
    cargarIntervencionesApi().then(()=> updateInversionPlanes());
  }
})();
