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

  if(!invAnualTrack || !invPlanBoardList){
    return;
  }

  const PLAN_COLORS = ["plan-color-1","plan-color-2","plan-color-3","plan-color-4"];
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
      nombre: String((p && p.nombre) || "Proyecto")
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
        assignedAmount: 0,
        executedAmount: 0
      }))
    };
  }

  function planFromApiPayload(plan){
    return normalizePlan({
      id: plan.legacyId || plan.id,
      dbId: plan.id,
      nombre: plan.name || "Plan",
      anio: plan.year || new Date().getFullYear(),
      monto: Number(plan.amount || 0),
      proyectos: Array.isArray(plan.projects) ? plan.projects.map((p)=>({
        id: p.projectLegacyId || "",
        nombre: p.name || "Proyecto"
      })) : []
    });
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
          .catch((err)=> console.warn("No se pudo actualizar plan en backend.", err));
      }
      return;
    }
    if(typeof window.UrbbisApi.createPlan === "function"){
      window.UrbbisApi.createPlan(payload)
        .then((remote)=>{
          if(remote && remote.id){
            plan.dbId = remote.id;
          }
        })
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
    if(!plans.length){
      invPlanBoardList.innerHTML = "<div class=\"inv-plan-empty\">Registra un plan para visualizar el resumen.</div>";
      planSeleccionadoId = "";
      return;
    }
    if(!planSeleccionadoId || !plans.some(p => String(p.id || "") === String(planSeleccionadoId))){
      planSeleccionadoId = plans[0].id;
    }
    invPlanBoardList.innerHTML = plans.map((plan)=>{
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
            +       "<h3>" + escapeHtml(grupo.nombre) + "</h3>"
            +       "<span class=\"inv-interventions-sub\">" + items.length + " intervenciones</span>"
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
                        +   "<td>" + escapeHtml(nombreAccion) + "</td>"
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
        + "<article class=\"inv-plan-card\" data-plan-id=\"" + escapeHtml(plan.id) + "\">"
        +   "<div class=\"inv-plan-card-head\">"
        +     "<div>"
        +       "<h4 class=\"inv-plan-card-title\">" + escapeHtml(plan.nombre || "Plan") + " " + escapeHtml(plan.anio || "") + "</h4>"
        +       "<span class=\"inv-plan-card-sub\">Total del plan y avance por fase.</span>"
        +     "</div>"
        +     "<div class=\"inv-plan-card-actions\">"
        +       "<button type=\"button\" class=\"dash-btn dash-btn--primary\" data-intervencion-new> Nueva Intervension</button>"
        +       "<button type=\"button\" class=\"inv-plan-edit\" data-plan-action=\"edit\" title=\"Modificar plan\">&#9998;</button>"
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

  function getIntervencionProyectoNombre(intervencion){
    const accion = getAccionById(intervencion && intervencion.accionId);
    const nombre = String(intervencion && (intervencion.proyectoNombre || getAccionProyectoAsociado(accion)) || "").trim();
    return nombre || "Sin proyecto asociado";
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

  function updateInversionPlanes(){
    cargarPlanes();
    cargarIntervenciones();
    const presupuesto = getPresupuesto();
    const anio = Number(presupuesto.year || new Date().getFullYear());
    const plans = getPlanesDelAnio(anio);
    renderAnual(plans, presupuesto);
    renderPlanBoard(plans);
    renderIntervencionesGrouped();
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
      intervencionAccion.innerHTML = "<option value=\"\">Sin acciones registradas</option>";
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
  if(btnPresupuestoClose) btnPresupuestoClose.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoCancelar) btnPresupuestoCancelar.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoGuardar) btnPresupuestoGuardar.addEventListener("click", guardarPresupuestoDesdeModal);

  if(btnIntervencionClose) btnIntervencionClose.addEventListener("click", cerrarModalIntervencion);
  if(btnIntervencionCancelar) btnIntervencionCancelar.addEventListener("click", cerrarModalIntervencion);
  if(btnIntervencionGuardar) btnIntervencionGuardar.addEventListener("click", guardarIntervencionDesdeModal);
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

  window.updateInversionPlanes = updateInversionPlanes;
  updateInversionPlanes();
  if(window.UrbbisApi){
    cargarPresupuestoApi().then(()=> updateInversionPlanes());
    cargarPlanesApi().then(()=> updateInversionPlanes());
    cargarIntervencionesApi().then(()=> updateInversionPlanes());
  }
})();
