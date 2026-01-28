(function(){
  const btnPlanNuevo = document.getElementById("btnPlanNuevo");
  const invAnualSelect = document.getElementById("invAnualSelect");
  const invAnualTotal = document.getElementById("invAnualTotal");
  const invAnualSub = document.getElementById("invAnualSub");
  const invAnualTrack = document.getElementById("invAnualTrack");
  const invAnualPct = document.getElementById("invAnualPct");
  const invAnualLegend = document.getElementById("invAnualLegend");
  const invAnualEjecutado = document.getElementById("invAnualEjecutado");
  const invAnualEjecutadoPct = document.getElementById("invAnualEjecutadoPct");
  const invPlanTablaBody = document.getElementById("invPlanTablaBody");
  const invTotalPlanificacion = document.getElementById("invTotalPlanificacion");
  const invTotalEjecutado = document.getElementById("invTotalEjecutado");
  const invTotalEjecucion = document.getElementById("invTotalEjecucion");

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
  const planPlazo = document.getElementById("planPlazo");
  const planEstado = document.getElementById("planEstado");
  const planMonto = document.getElementById("planMonto");
  const planEjecutado = document.getElementById("planEjecutado");
  const planMontoLabel = document.getElementById("planMontoLabel");
  const planEjecutadoLabel = document.getElementById("planEjecutadoLabel");
  const planAvancePct = document.getElementById("planAvancePct");
  const planProjectsList = document.getElementById("planProjectsList");
  const planProjectsCount = document.getElementById("planProjectsCount");
  const btnPlanClose = document.getElementById("btnPlanClose");
  const btnPlanCancelar = document.getElementById("btnPlanCancelar");
  const btnPlanGuardar = document.getElementById("btnPlanGuardar");

  if(!invPlanTablaBody || !invAnualTrack){
    return;
  }

  const LS_PLANES_PREFIX = "urbbisPlanes:";
  const LS_PRESUPUESTO_PREFIX = "urbbisPresupuestoAnual:";
  const PLAN_COLORS = ["plan-color-1","plan-color-2","plan-color-3","plan-color-4"];
  const PLAN_ESTADOS = {
    planificacion: "En planificacion",
    ejecucion: "Ejecucion",
    ejecutado: "Ejecutado"
  };

  let planesCache = [];
  let presupuestoCache = null;
  let planEditId = "";
  let collapsedPlans = new Set();

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

  function getEmailKey(){
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
    return String(email || "guest").trim().toLowerCase();
  }

  function storageKey(prefix){
    return prefix + getEmailKey();
  }

  function normalizePlan(plan){
    const out = Object.assign({}, plan || {});
    out.id = out.id || ("plan-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6));
    out.nombre = out.nombre || "Plan";
    out.anio = Number(out.anio || 0) || new Date().getFullYear();
    out.plazo = out.plazo || "";
    out.estado = out.estado || "planificacion";
    out.monto = Number(out.monto || 0);
    out.ejecutado = Number(out.ejecutado || 0);
    if(!Array.isArray(out.proyectos)) out.proyectos = [];
    const hasDetalles = proyectosHasDetalles(out.proyectos, out.estado);
    out._proyectosConDetalles = hasDetalles;
    const fallbackEstado = out.estado || "planificacion";
    out.proyectos = out.proyectos.map((p)=> normalizeProyecto(p, fallbackEstado));
    if(hasDetalles){
      const derived = calcPlanFromProyectos(out.proyectos);
      out.monto = derived.monto;
      out.ejecutado = derived.ejecutado;
      out.estado = derived.estado;
    }
    return out;
  }

  function cargarPlanes(){
    planesCache = [];
    try{
      const raw = localStorage.getItem(storageKey(LS_PLANES_PREFIX));
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed)){
          planesCache = parsed.map(normalizePlan);
        }
      }
    }catch(e){
      planesCache = [];
    }
  }

  function guardarPlanes(){
    try{
      localStorage.setItem(storageKey(LS_PLANES_PREFIX), JSON.stringify(planesCache));
    }catch(e){}
  }

  function cargarPresupuesto(){
    presupuestoCache = null;
    try{
      const raw = localStorage.getItem(storageKey(LS_PRESUPUESTO_PREFIX));
      if(raw){
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed === "object"){
          presupuestoCache = parsed;
        }
      }
    }catch(e){
      presupuestoCache = null;
    }
    if(!presupuestoCache){
      presupuestoCache = { year: new Date().getFullYear(), total: 0 };
    }
  }

  function guardarPresupuesto(next){
    presupuestoCache = Object.assign({}, next || {});
    try{
      localStorage.setItem(storageKey(LS_PRESUPUESTO_PREFIX), JSON.stringify(presupuestoCache));
    }catch(e){}
  }

  function getPresupuesto(){
    if(!presupuestoCache){
      cargarPresupuesto();
    }
    return presupuestoCache;
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
    const proyectos = [];
    if(!planProjectsList) return proyectos;
    const items = planProjectsList.querySelectorAll(".plan-project-item");
    items.forEach((item)=>{
      const checkbox = item.querySelector("input[type=\"checkbox\"]");
      if(!checkbox || !checkbox.checked) return;
      const id = String(checkbox.value || "");
      const nombre = String(checkbox.dataset.name || "Proyecto");
      const estadoEl = item.querySelector("select[data-field=\"estado\"]");
      const montoEl = item.querySelector("input[data-field=\"monto\"]");
      const ejecEl = item.querySelector("input[data-field=\"ejecutado\"]");
      const estado = estadoEl ? estadoEl.value : "planificacion";
      const montoAsignado = toPositiveNumber(montoEl ? montoEl.value : 0);
      const ejecutadoRaw = toPositiveNumber(ejecEl ? ejecEl.value : 0);
      let ejecutado = ejecutadoRaw;
      if(estado === "planificacion"){
        ejecutado = 0;
      } else if(estado === "ejecutado"){
        ejecutado = montoAsignado;
      } else if(montoAsignado > 0){
        ejecutado = Math.min(ejecutadoRaw, montoAsignado);
      }
      proyectos.push({ id, nombre, estado, montoAsignado, ejecutado });
    });
    return proyectos;
  }

  function updatePlanTotalsFromProjects(){
    const proyectos = gatherProyectosSeleccionados();
    const derived = calcPlanFromProyectos(proyectos);
    const monto = toPositiveNumber(derived.monto);
    const ejecutado = toPositiveNumber(derived.ejecutado);
    const ejecutadoDisplay = monto > 0 ? Math.min(ejecutado, monto) : ejecutado;
    const pct = monto > 0 ? Math.round((ejecutadoDisplay / monto) * 100) : 0;
    const pctSafe = Math.max(0, Math.min(100, pct));
    if(planMonto){
      planMonto.value = String(monto);
    }
    if(planEjecutado){
      planEjecutado.value = String(ejecutadoDisplay);
    }
    if(planMontoLabel){
      planMontoLabel.textContent = formatMoney(monto);
    }
    if(planEjecutadoLabel){
      planEjecutadoLabel.textContent = formatMoney(ejecutadoDisplay);
    }
    if(planAvancePct){
      planAvancePct.textContent = String(pctSafe);
    }
    if(planEstado){
      planEstado.value = derived.estado || "planificacion";
    }
  }

  function toggleProjectDetails(checkbox){
    if(!checkbox || !checkbox.closest) return;
    const item = checkbox.closest(".plan-project-item");
    if(!item) return;
    const details = item.querySelector(".plan-project-details");
    if(!details) return;
    if(checkbox.checked){
      details.classList.remove("is-hidden");
    } else {
      details.classList.add("is-hidden");
    }
  }

  function renderProyectosList(selected){
    if(!planProjectsList) return;
    const list = obtenerProyectosMunicipales();
    const fallbackEstado = planEstado ? planEstado.value : "planificacion";
    const selectedMap = new Map((selected || []).map((s)=>{
      const id = String(s && s.id || s || "");
      return [id, normalizeProyecto(s, fallbackEstado)];
    }));
    if(!list.length){
      planProjectsList.innerHTML = "<div class=\"plan-project-item\">Sin proyectos disponibles.</div>";
      updateProjectsCount();
      updatePlanTotalsFromProjects();
      return;
    }
    planProjectsList.innerHTML = list.map((p)=>{
      const id = String(p.id || "");
      const name = String(p.nombre || "Proyecto");
      const selectedProj = selectedMap.get(id);
      const checked = selectedProj ? "checked" : "";
      const estadoVal = selectedProj ? selectedProj.estado : "planificacion";
      const montoVal = selectedProj && selectedProj.montoAsignado > 0 ? String(selectedProj.montoAsignado) : "";
      const ejecVal = (selectedProj && selectedProj.estado !== "planificacion" && selectedProj.ejecutado > 0)
        ? String(selectedProj.ejecutado)
        : "";
      const detailsHidden = selectedProj ? "" : " is-hidden";
      const estadoOptions = Object.keys(PLAN_ESTADOS).map((key)=>{
        const sel = key === estadoVal ? " selected" : "";
        return "<option value=\"" + escapeHtml(key) + "\"" + sel + ">" + escapeHtml(PLAN_ESTADOS[key]) + "</option>";
      }).join("");
      return "<label class=\"plan-project-item\" data-project-id=\"" + escapeHtml(id) + "\">"
        + "<input type=\"checkbox\" value=\"" + escapeHtml(id) + "\" data-name=\"" + escapeHtml(name) + "\" " + checked + "> "
        + "<span class=\"plan-project-name\">" + escapeHtml(name) + "</span>"
        + "<div class=\"plan-project-details" + detailsHidden + "\">"
        +   "<select data-field=\"estado\" aria-label=\"Estado de " + escapeHtml(name) + "\">" + estadoOptions + "</select>"
        +   "<input data-field=\"monto\" type=\"number\" min=\"0\" step=\"1\" placeholder=\"Monto\" value=\"" + escapeHtml(montoVal) + "\" aria-label=\"Monto asignado a " + escapeHtml(name) + "\">"
        +   "<input data-field=\"ejecutado\" type=\"number\" min=\"0\" step=\"1\" placeholder=\"Ejecutado\" value=\"" + escapeHtml(ejecVal) + "\" aria-label=\"Avance ejecutado de " + escapeHtml(name) + "\">"
        + "</div>"
        + "</label>";
    }).join("");
    planProjectsList.querySelectorAll(".plan-project-item").forEach((item)=> syncProjectExecutionField(item));
    updateProjectsCount();
    updatePlanTotalsFromProjects();
  }

  function updateProjectsCount(){
    if(!planProjectsCount || !planProjectsList) return;
    const checked = planProjectsList.querySelectorAll("input[type=\"checkbox\"]:checked").length;
    planProjectsCount.textContent = checked + " seleccionados";
  }

  function calcPlanTotals(plan){
    const estadoBase = (plan && plan.estado) || "planificacion";
    let monto = toPositiveNumber(plan && plan.monto || 0);
    let ejecutado = toPositiveNumber(plan && plan.ejecutado || 0);
    let estado = estadoBase;
    const proyectos = obtenerProyectosPlan(plan);
    if(planTieneDetalles(plan)){
      const normalized = proyectos.map((p)=> normalizeProyecto(p, estadoBase));
      const derived = calcPlanFromProyectos(normalized);
      monto = toPositiveNumber(derived.monto);
      ejecutado = toPositiveNumber(derived.ejecutado);
      estado = derived.estado || estadoBase;
    }
    const ejecutadoClamped = monto > 0 ? Math.min(ejecutado, monto) : ejecutado;
    return { monto, ejecutado: ejecutadoClamped, estado };
  }

  function calcPlanPct(plan){
    const totals = calcPlanTotals(plan);
    if(totals.monto <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((totals.ejecutado / totals.monto) * 100)));
  }

  function renderAnual(plans, presupuesto){
    const total = Number(presupuesto.total || 0);
    const anio = Number(presupuesto.year || new Date().getFullYear());
    if(invAnualTotal) invAnualTotal.textContent = formatMoney(total);
    if(invAnualSub) invAnualSub.textContent = total > 0 ? "Monto anual definido" : "Define el monto anual";
    if(invAnualSelect){
      invAnualSelect.innerHTML = "<option value=\"" + escapeHtml(anio) + "\">" + escapeHtml(periodoLabel(anio)) + "</option>";
    }
    const planTotals = plans.map((plan)=> ({ plan, totals: calcPlanTotals(plan) }));
    const sumPlanes = planTotals.reduce((sum, item)=> sum + toPositiveNumber(item.totals.monto), 0);
    const sumEjecutado = planTotals.reduce((sum, item)=>{
      const montoPlan = toPositiveNumber(item.totals.monto);
      const ejecPlan = toPositiveNumber(item.totals.ejecutado);
      return sum + (montoPlan > 0 ? Math.min(ejecPlan, montoPlan) : ejecPlan);
    }, 0);
    const pct = total > 0 ? Math.round((sumPlanes / total) * 100) : 0;
    if(invAnualPct) invAnualPct.textContent = Math.max(0, Math.min(100, pct));
    if(invAnualEjecutado) invAnualEjecutado.textContent = formatMoney(sumEjecutado);
    const pctEj = total > 0 ? Math.round((sumEjecutado / total) * 100) : 0;
    if(invAnualEjecutadoPct) invAnualEjecutadoPct.textContent = Math.max(0, Math.min(100, pctEj));

    if(invAnualTrack){
      invAnualTrack.innerHTML = "";
      if(total > 0 && plans.length){
        planTotals.forEach((item, idx)=>{
          const width = total > 0 ? Math.max(0, (toPositiveNumber(item.totals.monto) / total) * 100) : 0;
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
        label: (plan.nombre || "Plan") + " avance",
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

  function renderTablaPlanes(plans){
    if(!invPlanTablaBody) return;
    if(!plans.length){
      invPlanTablaBody.innerHTML = "<tr><td colspan=\"5\" class=\"empty\">Sin planes registrados.</td></tr>";
      return;
    }
    const rows = [];
    plans.forEach((plan, idx)=>{
      const id = String(plan.id || "");
      const collapsed = collapsedPlans.has(id);
      const totals = calcPlanTotals(plan);
      const pct = totals.monto > 0 ? Math.max(0, Math.min(100, Math.round((totals.ejecutado / totals.monto) * 100))) : 0;
      const monto = totals.monto;
      const ejecutado = totals.ejecutado;
      const plazoLabel = plan.plazo ? escapeHtml(plan.plazo) : "";
      const metaHtml = plazoLabel ? ("<span class=\"plan-group-meta\">" + plazoLabel + "</span>") : "";

      rows.push(
        "<tr class=\"plan-group\" data-plan-id=\"" + escapeHtml(id) + "\">"
        + "<td colspan=\"5\">"
        +   "<div class=\"plan-group-row\">"
        +     "<div class=\"plan-group-info\">"
        +       "<button type=\"button\" class=\"plan-toggle" + (collapsed ? " is-collapsed" : "") + "\" data-plan-action=\"toggle\" data-plan-id=\"" + escapeHtml(id) + "\">&#9662;</button>"
        +       "<span>" + escapeHtml(plan.nombre || "Plan") + "</span>"
        +       metaHtml
        +     "</div>"
        +     "<div class=\"plan-actions\">"
        +       "<button type=\"button\" class=\"plan-action\" data-plan-action=\"edit\" data-plan-id=\"" + escapeHtml(id) + "\">Editar</button>"
        +       "<button type=\"button\" class=\"plan-action plan-action--delete\" data-plan-action=\"delete\" data-plan-id=\"" + escapeHtml(id) + "\">Eliminar</button>"
        +     "</div>"
        +   "</div>"
        +   "<div class=\"plan-progress\">"
        +     "<div class=\"plan-progress-track\"><div class=\"plan-progress-fill\" style=\"width:" + pct + "%\"></div></div>"
        +     "<div class=\"plan-progress-label\">" + pct + "% (" + escapeHtml(formatMoney(ejecutado)) + " / " + escapeHtml(formatMoney(monto)) + ")</div>"
        +   "</div>"
        + "</td>"
        + "</tr>"
      );

      const proyectos = obtenerProyectosPlan(plan);
      if(!proyectos.length){
        rows.push(
          "<tr class=\"plan-project-row" + (collapsed ? " is-hidden" : "") + "\" data-plan-id=\"" + escapeHtml(id) + "\">"
          + "<td colspan=\"5\" class=\"empty\">Sin proyectos asignados.</td>"
          + "</tr>"
        );
        return;
      }

      const hasDetalles = planTieneDetalles(plan);
      const costoUnitario = (!hasDetalles && monto && proyectos.length) ? (monto / proyectos.length) : 0;
      const ejecUnitario = (!hasDetalles && ejecutado && proyectos.length) ? (ejecutado / proyectos.length) : 0;
      proyectos.forEach((proj)=>{
        const normalized = normalizeProyecto(proj, plan.estado);
        const nombre = normalized.nombre || "Proyecto";
        const estadoProj = hasDetalles ? normalized.estado : totals.estado;
        const estadoProjLabel = estadoLabel(estadoProj);
        const montoProj = hasDetalles ? normalized.montoAsignado : costoUnitario;
        const ejecProj = hasDetalles ? normalized.ejecutado : ejecUnitario;
        const pctProj = montoProj > 0 ? calcProyectoPct({ estado: estadoProj, montoAsignado: montoProj, ejecutado: ejecProj }) : pct;
        rows.push(
          "<tr class=\"plan-project-row" + (collapsed ? " is-hidden" : "") + "\" data-plan-id=\"" + escapeHtml(id) + "\">"
          + "<td>" + escapeHtml(nombre) + "</td>"
          + "<td>" + escapeHtml(String(plan.anio || "")) + "</td>"
          + "<td>" + escapeHtml(estadoProjLabel) + "</td>"
          + "<td><div class=\"plan-mini\"><div class=\"plan-mini-bar\"><span style=\"width:" + pctProj + "%\"></span></div><span class=\"plan-mini-label\">" + pctProj + "%</span></div></td>"
          + "<td>" + escapeHtml(formatMoney(montoProj)) + "</td>"
          + "</tr>"
        );
      });
    });
    invPlanTablaBody.innerHTML = rows.join("");
  }

  function renderResumen(plans){
    if(!invTotalPlanificacion || !invTotalEjecutado || !invTotalEjecucion) return;
    const totals = { planificacion:0, ejecucion:0, ejecutado:0 };
    plans.forEach((plan)=>{
      const proyectos = obtenerProyectosPlan(plan);
      if(Array.isArray(proyectos) && proyectos.length && planTieneDetalles(plan)){
        proyectos.forEach((proj)=>{
          const normalized = normalizeProyecto(proj, plan.estado);
          const estado = normalized.estado || "planificacion";
          totals[estado] = (totals[estado] || 0) + toPositiveNumber(normalized.montoAsignado);
        });
        return;
      }
      const estadoPlan = plan.estado || "planificacion";
      totals[estadoPlan] = (totals[estadoPlan] || 0) + toPositiveNumber(plan.monto || 0);
    });
    invTotalPlanificacion.textContent = formatMoney(totals.planificacion || 0);
    invTotalEjecucion.textContent = formatMoney(totals.ejecucion || 0);
    invTotalEjecutado.textContent = formatMoney(totals.ejecutado || 0);
    try{
      window.inversionPlanResumen = {
        planificacion: totals.planificacion || 0,
        ejecucion: totals.ejecucion || 0,
        ejecutado: totals.ejecutado || 0
      };
    }catch(e){}
  }

  function updateInversionPlanes(){
    cargarPlanes();
    const presupuesto = getPresupuesto();
    const anio = Number(presupuesto.year || new Date().getFullYear());
    const plans = planesCache.filter(p => Number(p.anio || 0) === anio);
    renderAnual(plans, presupuesto);
    renderTablaPlanes(plans);
    renderResumen(plans);
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
    if(planModalTitle) planModalTitle.textContent = plan ? "Editar plan" : "Registrar plan";
    if(planNombre) planNombre.value = plan ? (plan.nombre || "") : "";
    if(planAnio) planAnio.value = String(plan ? (plan.anio || presupuesto.year) : (presupuesto.year || ""));
    if(planPlazo) planPlazo.value = plan ? (plan.plazo || "") : "";
    if(planEstado) planEstado.value = plan ? (plan.estado || "planificacion") : "planificacion";
    if(planMonto) planMonto.value = plan ? Number(plan.monto || 0) : "";
    if(planEjecutado) planEjecutado.value = plan ? Number(plan.ejecutado || 0) : "";
    const proyectosModal = plan ? prepararProyectosParaModal(plan) : [];
    renderProyectosList(proyectosModal);
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
    const presupuesto = getPresupuesto();
    const nombre = planNombre ? planNombre.value.trim() : "";
    const plazo = planPlazo ? planPlazo.value.trim() : "";
    if(!nombre){
      alert("Ingresa un nombre para el plan.");
      return;
    }
    const seleccionados = gatherProyectosSeleccionados();
    if(!seleccionados.length){
      alert("Selecciona al menos un proyecto.");
      return;
    }
    for(let i=0;i<seleccionados.length;i++){
      const proj = seleccionados[i];
      const montoProj = toPositiveNumber(proj.montoAsignado);
      const ejecProj = toPositiveNumber(proj.ejecutado);
      if(montoProj <= 0){
        alert("Ingresa el monto asignado para \"" + (proj.nombre || "Proyecto") + "\".");
        return;
      }
      if(ejecProj < 0 || ejecProj > montoProj){
        alert("El avance ejecutado de \"" + (proj.nombre || "Proyecto") + "\" debe estar entre 0 y su monto asignado.");
        return;
      }
    }
    const derived = calcPlanFromProyectos(seleccionados);
    const monto = derived.monto;
    const ejecutado = derived.ejecutado;
    const estado = derived.estado || "planificacion";
    if(monto <= 0){
      alert("Asigna un monto valido en los proyectos del plan.");
      return;
    }
    if(planMonto) planMonto.value = String(monto);
    if(planEjecutado) planEjecutado.value = String(ejecutado);
    if(planEstado) planEstado.value = estado;
    const base = {
      id: planEditId || ("plan-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6)),
      nombre,
      anio: Number(presupuesto.year || new Date().getFullYear()),
      plazo,
      estado,
      monto,
      ejecutado,
      proyectos: seleccionados
    };
    if(planEditId){
      const idx = planesCache.findIndex(p => p.id === planEditId);
      if(idx >= 0){
        planesCache[idx] = normalizePlan(Object.assign({}, planesCache[idx], base));
      }
    } else {
      planesCache.push(normalizePlan(base));
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
    cerrarModalPresupuesto();
    updateInversionPlanes();
  }

  function handlePlanTableClick(e){
    const btn = e.target && e.target.closest ? e.target.closest("[data-plan-action]") : null;
    if(!btn) return;
    const action = btn.getAttribute("data-plan-action");
    const planId = btn.getAttribute("data-plan-id");
    if(!planId) return;
    if(action === "toggle"){
      if(collapsedPlans.has(planId)){
        collapsedPlans.delete(planId);
      } else {
        collapsedPlans.add(planId);
      }
      renderTablaPlanes(planesCache.filter(p => Number(p.anio || 0) === Number(getPresupuesto().year || 0)));
      return;
    }
    if(action === "edit"){
      const plan = planesCache.find(p => String(p.id || "") === String(planId));
      if(plan) abrirModalPlan(plan);
      return;
    }
    if(action === "delete"){
      const plan = planesCache.find(p => String(p.id || "") === String(planId));
      if(!plan) return;
      const ok = confirm("Eliminar el plan \"" + (plan.nombre || "Plan") + "\"?");
      if(!ok) return;
      planesCache = planesCache.filter(p => String(p.id || "") !== String(planId));
      guardarPlanes();
      updateInversionPlanes();
    }
  }

  if(btnPlanNuevo){
    btnPlanNuevo.addEventListener("click", ()=> abrirModalPlan(null));
  }
  if(btnPlanClose) btnPlanClose.addEventListener("click", cerrarModalPlan);
  if(btnPlanCancelar) btnPlanCancelar.addEventListener("click", cerrarModalPlan);
  if(btnPlanGuardar) btnPlanGuardar.addEventListener("click", guardarPlanDesdeModal);
  if(planProjectsList){
    planProjectsList.addEventListener("change", (e)=>{
      const target = e.target;
      if(target && target.matches && target.matches("input[type=\"checkbox\"]")){
        toggleProjectDetails(target);
        const item = target.closest(".plan-project-item");
        syncProjectExecutionField(item);
      }
      if(target && target.matches && target.matches("select[data-field=\"estado\"]")){
        const item = target.closest(".plan-project-item");
        syncProjectExecutionField(item);
      }
      updateProjectsCount();
      updatePlanTotalsFromProjects();
    });
    planProjectsList.addEventListener("input", (e)=>{
      const target = e.target;
      if(!target || !target.matches) return;
      if(target.matches("input[data-field=\"monto\"]")){
        const item = target.closest(".plan-project-item");
        syncProjectExecutionField(item);
      }
      if(target.matches("input[data-field], select[data-field]")) updatePlanTotalsFromProjects();
    });
  }

  if(btnPresupuestoEditar) btnPresupuestoEditar.addEventListener("click", abrirModalPresupuesto);
  if(btnPresupuestoClose) btnPresupuestoClose.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoCancelar) btnPresupuestoCancelar.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoGuardar) btnPresupuestoGuardar.addEventListener("click", guardarPresupuestoDesdeModal);

  if(invPlanTablaBody) invPlanTablaBody.addEventListener("click", handlePlanTableClick);

  window.updateInversionPlanes = updateInversionPlanes;
  updateInversionPlanes();
})();
