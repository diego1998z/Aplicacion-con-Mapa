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
    out.proyectos = out.proyectos.map((p)=>{
      if(typeof p === "string"){
        return { id: p, nombre: p };
      }
      if(p && typeof p === "object"){
        return Object.assign({ id: "", nombre: "Proyecto" }, p);
      }
      return { id: "", nombre: "Proyecto" };
    });
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

  function renderProyectosList(selected){
    if(!planProjectsList) return;
    const list = obtenerProyectosMunicipales();
    const selectedSet = new Set((selected || []).map(s => String(s && s.id || s)));
    if(!list.length){
      planProjectsList.innerHTML = "<div class=\"plan-project-item\">Sin proyectos disponibles.</div>";
      updateProjectsCount();
      return;
    }
    planProjectsList.innerHTML = list.map((p)=>{
      const id = String(p.id || "");
      const name = String(p.nombre || "Proyecto");
      const checked = selectedSet.has(id) ? "checked" : "";
      return "<label class=\"plan-project-item\">"
        + "<input type=\"checkbox\" value=\"" + escapeHtml(id) + "\" data-name=\"" + escapeHtml(name) + "\" " + checked + "> "
        + escapeHtml(name)
        + "</label>";
    }).join("");
    updateProjectsCount();
  }

  function updateProjectsCount(){
    if(!planProjectsCount || !planProjectsList) return;
    const checked = planProjectsList.querySelectorAll("input[type=\"checkbox\"]:checked").length;
    planProjectsCount.textContent = checked + " seleccionados";
  }

  function calcPlanPct(plan){
    const monto = Number(plan.monto || 0);
    const ejec = Number(plan.ejecutado || 0);
    if(monto <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((ejec / monto) * 100)));
  }

  function renderAnual(plans, presupuesto){
    const total = Number(presupuesto.total || 0);
    const anio = Number(presupuesto.year || new Date().getFullYear());
    if(invAnualTotal) invAnualTotal.textContent = formatMoney(total);
    if(invAnualSub) invAnualSub.textContent = total > 0 ? "Monto anual definido" : "Define el monto anual";
    if(invAnualSelect){
      invAnualSelect.innerHTML = "<option value=\"" + escapeHtml(anio) + "\">" + escapeHtml(periodoLabel(anio)) + "</option>";
    }
    const sumPlanes = plans.reduce((sum, p)=> sum + Number(p.monto || 0), 0);
    const sumEjecutado = plans.reduce((sum, p)=>{
      const monto = Number(p.monto || 0);
      const ejec = Number(p.ejecutado || 0);
      return sum + Math.min(ejec, monto);
    }, 0);
    const pct = total > 0 ? Math.round((sumPlanes / total) * 100) : 0;
    if(invAnualPct) invAnualPct.textContent = Math.max(0, Math.min(100, pct));
    if(invAnualEjecutado) invAnualEjecutado.textContent = formatMoney(sumEjecutado);
    const pctEj = total > 0 ? Math.round((sumEjecutado / total) * 100) : 0;
    if(invAnualEjecutadoPct) invAnualEjecutadoPct.textContent = Math.max(0, Math.min(100, pctEj));

    if(invAnualTrack){
      invAnualTrack.innerHTML = "";
      if(total > 0 && plans.length){
        plans.forEach((plan, idx)=>{
          const width = Math.max(0, (Number(plan.monto || 0) / total) * 100);
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
      const pct = calcPlanPct(plan);
      const monto = Number(plan.monto || 0);
      const ejecutado = Number(plan.ejecutado || 0);
      const estado = estadoLabel(plan.estado);
      const plazoLabel = plan.plazo ? (" | " + escapeHtml(plan.plazo)) : "";

      rows.push(
        "<tr class=\"plan-group\" data-plan-id=\"" + escapeHtml(id) + "\">"
        + "<td colspan=\"5\">"
        +   "<div class=\"plan-group-row\">"
        +     "<div class=\"plan-group-info\">"
        +       "<button type=\"button\" class=\"plan-toggle" + (collapsed ? " is-collapsed" : "") + "\" data-plan-action=\"toggle\" data-plan-id=\"" + escapeHtml(id) + "\">&#9662;</button>"
        +       "<span>" + escapeHtml(plan.nombre || "Plan") + "</span>"
        +       "<span class=\"plan-group-meta\">" + escapeHtml(estado) + plazoLabel + "</span>"
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

      const costoUnitario = monto && proyectos.length ? (monto / proyectos.length) : 0;
      proyectos.forEach((proj)=>{
        const nombre = proj && proj.nombre ? proj.nombre : "Proyecto";
        rows.push(
          "<tr class=\"plan-project-row" + (collapsed ? " is-hidden" : "") + "\" data-plan-id=\"" + escapeHtml(id) + "\">"
          + "<td>" + escapeHtml(nombre) + "</td>"
          + "<td>" + escapeHtml(String(plan.anio || "")) + "</td>"
          + "<td>" + escapeHtml(estado) + "</td>"
          + "<td><div class=\"plan-mini\"><div class=\"plan-mini-bar\"><span style=\"width:" + pct + "%\"></span></div><span class=\"plan-mini-label\">" + pct + "%</span></div></td>"
          + "<td>" + escapeHtml(formatMoney(costoUnitario)) + "</td>"
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
      const estado = plan.estado || "planificacion";
      totals[estado] = (totals[estado] || 0) + Number(plan.monto || 0);
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
    renderProyectosList(plan ? plan.proyectos : []);
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
    const estado = planEstado ? planEstado.value : "planificacion";
    const monto = Number(planMonto ? planMonto.value : 0);
    const ejecutado = Number(planEjecutado ? planEjecutado.value : 0);
    if(!nombre){
      alert("Ingresa un nombre para el plan.");
      return;
    }
    if(!monto || monto <= 0){
      alert("Ingresa un monto valido para el plan.");
      return;
    }
    if(ejecutado < 0 || ejecutado > monto){
      alert("El avance ejecutado debe estar entre 0 y el monto asignado.");
      return;
    }
    const seleccionados = [];
    if(planProjectsList){
      planProjectsList.querySelectorAll("input[type=\"checkbox\"]:checked").forEach((input)=>{
        seleccionados.push({ id: String(input.value || ""), nombre: String(input.dataset.name || "Proyecto") });
      });
    }
    if(!seleccionados.length){
      alert("Selecciona al menos un proyecto.");
      return;
    }
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
  if(planProjectsList) planProjectsList.addEventListener("change", updateProjectsCount);

  if(btnPresupuestoEditar) btnPresupuestoEditar.addEventListener("click", abrirModalPresupuesto);
  if(btnPresupuestoClose) btnPresupuestoClose.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoCancelar) btnPresupuestoCancelar.addEventListener("click", cerrarModalPresupuesto);
  if(btnPresupuestoGuardar) btnPresupuestoGuardar.addEventListener("click", guardarPresupuestoDesdeModal);

  if(invPlanTablaBody) invPlanTablaBody.addEventListener("click", handlePlanTableClick);

  window.updateInversionPlanes = updateInversionPlanes;
  updateInversionPlanes();
})();
