(function(){
  const toggle = document.getElementById("aiChatToggle");
  const panel = document.getElementById("aiChatPanel");
  const closeBtn = document.getElementById("aiChatClose");
  const body = document.getElementById("aiChatBody");
  const quick = document.getElementById("aiChatQuick");
  const form = document.getElementById("aiChatForm");
  const input = document.getElementById("aiChatInput");
  const status = document.getElementById("aiChatStatus");
  const supportPhone = "+51 993931475";

  if(!toggle || !panel || !body || !quick || !form || !input || !status){
    return;
  }

  const state = {
    active: false,
    preference: "balance"
  };

  const prefLabels = {
    balance: "Balance",
    seguridad: "Seguridad",
    costo: "Costo",
    rapidez: "Rapidez"
  };

  const mainActions = [
    { id: "optimize", label: "Optimizar inversion" },
    { id: "auto", label: "Automatizar inversion" },
    { id: "suggest", label: "Sugerencias" },
    { id: "report", label: "Reportes" },
    { id: "support", label: "Contactar soporte" },
    { id: "reset", label: "Restaurar valores" }
  ];

  const prefActions = [
    { id: "pref_balance", label: "Balance" },
    { id: "pref_seguridad", label: "Seguridad" },
    { id: "pref_costo", label: "Costo" },
    { id: "pref_rapidez", label: "Rapidez" }
  ];

  function renderActions(actions){
    quick.innerHTML = "";
    actions.forEach((action)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ai-chat-chip";
      btn.textContent = action.label;
      btn.dataset.action = action.id;
      quick.appendChild(btn);
    });
  }

  function addMessage(text, role){
    const wrap = document.createElement("div");
    wrap.className = "ai-msg" + (role === "user" ? " ai-msg--user" : "");
    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function setStatus(){
    const label = prefLabels[state.preference] || prefLabels.balance;
    status.textContent = state.active ? ("Simulacion activa (" + label + ")") : "Simulacion desactivada";
    toggle.classList.toggle("is-active", state.active);
  }

  function formatMoney(value){
    const n = Number(value || 0);
    if(typeof formatearMonedaPEN === "function"){
      return formatearMonedaPEN(n);
    }
    return "S/ " + Math.round(n).toLocaleString("es-PE");
  }

  function formatSigned(value){
    const n = Number(value || 0);
    const sign = n >= 0 ? "+" : "-";
    return sign + formatMoney(Math.abs(n));
  }

  function getBase(){
    const base = window.aiInversionBase;
    if(base && Number.isFinite(base.total)){
      return base;
    }
    if(typeof window.updateInversion === "function"){
      window.updateInversion();
    }
    return window.aiInversionBase || null;
  }

  function applyPreference(pref){
    const base = getBase();
    if(!base || !Number.isFinite(base.total) || base.total <= 0){
      addMessage("No hay datos de inversion disponibles.", "ai");
      return;
    }

    const targets = {
      balance: { oper: 0.65, det: 0.23 },
      seguridad: { oper: 0.75, det: 0.18 },
      costo: { oper: 0.58, det: 0.27 },
      rapidez: { oper: 0.68, det: 0.22 }
    };

    const target = targets[pref] || targets.balance;
    const total = Math.round(base.total);
    let oper = Math.round(total * target.oper);
    let det = Math.round(total * target.det);
    let repo = total - oper - det;

    if(repo < 0){
      repo = 0;
      det = Math.max(0, total - oper);
    }

    window.aiInversionOverride = {
      total,
      operativos: oper,
      deteriorados: det,
      reposicion: repo,
      pref
    };

    state.active = true;
    state.preference = pref;
    setStatus();
    if(typeof window.updateInversion === "function"){
      window.updateInversion();
    }

    const deltaOper = oper - base.sumOper;
    const deltaDet = det - base.sumDet;
    const deltaRepo = repo - base.sumRepo;

    addMessage(
      "Listo. Nuevo escenario:\nOperativos " + formatMoney(oper)
        + "\nDeteriorados " + formatMoney(det)
        + "\nReposicion " + formatMoney(repo)
        + "\nImpacto: Operativos " + formatSigned(deltaOper)
        + ", Deteriorados " + formatSigned(deltaDet)
        + ", Reposicion " + formatSigned(deltaRepo),
      "ai"
    );
  }

  function clearOverride(){
    window.aiInversionOverride = null;
    state.active = false;
    setStatus();
    if(typeof window.updateInversion === "function"){
      window.updateInversion();
    }
    addMessage("Simulacion desactivada. Valores originales restaurados.", "ai");
  }

  function showSuggestions(){
    const base = getBase();
    if(!base){
      addMessage("No hay datos suficientes para sugerencias.", "ai");
      return;
    }
    addMessage(
      "Sugerencias rapidas:\n- Priorizar mantenimiento preventivo.\n- Rebalancear presupuesto hacia operativos.\n- Programar inspecciones pendientes.\n- Revisar costos de reposicion critica.",
      "ai"
    );
  }

  function showReport(){
    const base = getBase();
    if(!base){
      addMessage("No hay datos de inversion disponibles.", "ai");
      return;
    }
    let total = base.total;
    let oper = base.sumOper;
    let det = base.sumDet;
    let repo = base.sumRepo;
    const override = window.aiInversionOverride;
    const hasOverride = override
      && Number.isFinite(Number(override.operativos))
      && Number.isFinite(Number(override.deteriorados))
      && Number.isFinite(Number(override.reposicion));
    if(hasOverride){
      oper = Number(override.operativos);
      det = Number(override.deteriorados);
      repo = Number(override.reposicion);
      const oTotal = Number(override.total);
      if(Number.isFinite(oTotal) && oTotal > 0){
        total = oTotal;
      }
    }
    addMessage(
      (hasOverride ? "Reporte (escenario AI)" : "Reporte actual") + ":\nTotal " + formatMoney(total)
        + "\nOperativos " + formatMoney(oper)
        + "\nDeteriorados " + formatMoney(det)
        + "\nReposicion " + formatMoney(repo),
      "ai"
    );
  }

  function showSupport(){
    addMessage("Contacto de soporte: " + supportPhone, "ai");
  }

  function handleAction(actionId){
    switch(actionId){
      case "optimize":
      case "auto":
        addMessage("Elige una preferencia para ajustar la inversion.", "ai");
        renderActions(prefActions);
        return;
      case "pref_balance":
        applyPreference("balance");
        renderActions(mainActions);
        return;
      case "pref_seguridad":
        applyPreference("seguridad");
        renderActions(mainActions);
        return;
      case "pref_costo":
        applyPreference("costo");
        renderActions(mainActions);
        return;
      case "pref_rapidez":
        applyPreference("rapidez");
        renderActions(mainActions);
        return;
      case "suggest":
        showSuggestions();
        return;
      case "report":
        showReport();
        return;
      case "support":
        showSupport();
        return;
      case "reset":
        clearOverride();
        return;
      default:
        return;
    }
  }

  function handleText(text){
    const raw = String(text || "").trim();
    if(!raw){
      return;
    }
    const msg = raw.toLowerCase();
    if(msg.includes("seguridad")){
      applyPreference("seguridad");
      renderActions(mainActions);
      return;
    }
    if(msg.includes("costo")){
      applyPreference("costo");
      renderActions(mainActions);
      return;
    }
    if(msg.includes("rapidez")){
      applyPreference("rapidez");
      renderActions(mainActions);
      return;
    }
    if(msg.includes("balance")){
      applyPreference("balance");
      renderActions(mainActions);
      return;
    }
    if(msg.includes("optimizar") || msg.includes("automatizar")){
      addMessage("Elige una preferencia para ajustar la inversion.", "ai");
      renderActions(prefActions);
      return;
    }
    if(msg.includes("sugerencia")){
      showSuggestions();
      return;
    }
    if(msg.includes("reporte")){
      showReport();
      return;
    }
    if(msg.includes("soporte") || msg.includes("contacto")){
      showSupport();
      return;
    }
    if(msg.includes("restaurar") || msg.includes("reset")){
      clearOverride();
      return;
    }

    addMessage("Soy una demo local. Usa los botones para acciones rapidas.", "ai");
  }

  function openPanel(){
    panel.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closePanel(){
    panel.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", ()=>{
    if(panel.classList.contains("hidden")){
      openPanel();
    } else {
      closePanel();
    }
  });

  if(closeBtn){
    closeBtn.addEventListener("click", closePanel);
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const value = input.value.trim();
    if(!value){
      return;
    }
    addMessage(value, "user");
    input.value = "";
    handleText(value);
  });

  quick.addEventListener("click", (e)=>{
    const btn = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
    if(!btn) return;
    handleAction(btn.getAttribute("data-action") || "");
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && !panel.classList.contains("hidden")){
      closePanel();
    }
  });

  renderActions(mainActions);
  setStatus();
  addMessage("Hola, soy el asistente de inversion. Puedo simular mejoras y ajustar los valores del panel.", "ai");
})();
