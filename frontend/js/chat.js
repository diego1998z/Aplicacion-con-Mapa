(function(){
  const toggle = document.getElementById("aiChatToggle");
  const panel = document.getElementById("aiChatPanel");
  const closeBtn = document.getElementById("aiChatClose");
  const title = document.getElementById("aiChatTitle");
  const body = document.getElementById("aiChatBody");
  const quick = document.getElementById("aiChatQuick");
  const form = document.getElementById("aiChatForm");
  const input = document.getElementById("aiChatInput");
  const status = document.getElementById("aiChatStatus");
  const supportPhone = "+51 993931475";
  const MAX_HISTORY_ITEMS = 12;

  if(!toggle || !panel || !body || !quick || !form || !input || !status){
    return;
  }

  const state = {
    mode: "other",
    active: false,
    preference: "balance",
    pending: false
  };
  const historyByMode = {
    inversion: [],
    "inversion-plan": []
  };
  const introShown = new Set();

  const prefLabels = {
    balance: "Balance",
    seguridad: "Seguridad",
    costo: "Costo",
    rapidez: "Rapidez"
  };

  const inventoryMainActions = [
    { id: "optimize", label: "Optimizar inversion" },
    { id: "auto", label: "Automatizar inversion" },
    { id: "critical", label: "Ranking critico" },
    { id: "proximity", label: "Prioridad cercania" },
    { id: "monthly_plan", label: "Plan mensual" },
    { id: "suggest", label: "Sugerencias" },
    { id: "report", label: "Reportes" },
    { id: "support", label: "Contactar soporte" },
    { id: "reset", label: "Restaurar valores" }
  ];

  const planMainActions = [
    { id: "plan_suggest", label: "Sugerir plan IA" },
    { id: "plan_optimize_top3", label: "Optimizar proyectos" },
    { id: "plan_compare", label: "Ver comparativo" },
    { id: "plan_apply", label: "Aplicar opcion IA" },
    { id: "plan_revert", label: "Revertir cambio IA" },
    { id: "plan_report", label: "Resumen presupuesto" },
    { id: "support", label: "Contactar soporte" }
  ];

  const prefActions = [
    { id: "pref_balance", label: "Balance" },
    { id: "pref_seguridad", label: "Seguridad" },
    { id: "pref_costo", label: "Costo" },
    { id: "pref_rapidez", label: "Rapidez" }
  ];

  const inventoryKeywords = {
    hospital: ["hospital", "clinica", "salud", "posta", "centro medico", "emergencia"],
    escuela: ["colegio", "escuela", "instituto", "universidad", "escolar", "alumno"],
    evento: ["accidente", "choque", "atropello", "incidente", "riesgo", "peligro", "evento"]
  };
  const INVENTORY_PROX_RADII = Object.freeze({
    evento: 600,
    hospital: 900,
    escuela: 900
  });

  function renderActions(actions){
    quick.innerHTML = "";
    (actions || []).forEach((action)=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ai-chat-chip";
      btn.textContent = action.label;
      btn.dataset.action = action.id;
      quick.appendChild(btn);
    });
  }

  function detectMode(){
    const activePage = document.querySelector("[data-dash-page]:not(.hidden)");
    const key = activePage ? activePage.getAttribute("data-dash-page") : "";
    if(key === "inversion-plan") return "inversion-plan";
    if(key === "inversion") return "inversion";
    return "other";
  }

  function getPlanAI(){
    if(window.UrbbisPlanAI && typeof window.UrbbisPlanAI.getStatus === "function"){
      return window.UrbbisPlanAI;
    }
    return null;
  }

  function rememberMessage(text, role, modeOverride){
    const modeKey = modeOverride || state.mode;
    if(modeKey !== "inversion" && modeKey !== "inversion-plan"){
      return;
    }
    const clean = String(text || "").trim();
    if(!clean){
      return;
    }
    const bucket = historyByMode[modeKey];
    if(!Array.isArray(bucket)){
      return;
    }
    bucket.push({
      role: role === "user" ? "user" : "assistant",
      text: clean
    });
    if(bucket.length > MAX_HISTORY_ITEMS){
      bucket.splice(0, bucket.length - MAX_HISTORY_ITEMS);
    }
  }

  function getRecentHistory(modeOverride){
    const modeKey = modeOverride || state.mode;
    const bucket = historyByMode[modeKey];
    if(!Array.isArray(bucket) || !bucket.length){
      return [];
    }
    return bucket.slice(-8).map((item)=> ({
      role: item.role,
      text: item.text
    }));
  }

  function escapeHtml(value){
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripChatMarkdownInline(value){
    return String(value || "")
      .replace(/^\s{0,3}#{1,6}\s*/u, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .trim();
  }

  function isChatBulletOnlyLine(value){
    return /^(?:[-*•]+)$/.test(String(value || "").trim());
  }

  function isChatRankLine(value){
    return /^\d+\.\s+/.test(String(value || "").trim());
  }

  function isChatProjectLine(value){
    return /^(?:🏗️\s*)?PROYECTO:/u.test(String(value || "").trim());
  }

  function isChatHeadingLine(value){
    const clean = String(value || "").trim();
    return /^(?:📊\s*)?Reporte\b/i.test(clean)
      || /^(?:🎯\s*)?Criterio\b/i.test(clean)
      || /^(?:🚀\s*)?Top\s+\d+\b/i.test(clean);
  }

  function isChatJoinableLine(value){
    const clean = String(value || "").trim();
    if(!clean) return false;
    return !isChatBulletOnlyLine(clean)
      && !isChatRankLine(clean)
      && !isChatProjectLine(clean)
      && !isChatHeadingLine(clean);
  }

  function preprocessAssistantText(text){
    const cleanedLines = String(text || "")
      .replace(/\r/g, "")
      .split("\n")
      .map((line)=> stripChatMarkdownInline(line));
    const merged = [];

    for(let i = 0; i < cleanedLines.length; i += 1){
      const line = cleanedLines[i];
      if(!line){
        if(merged.length && merged[merged.length - 1] !== ""){
          merged.push("");
        }
        continue;
      }
      if(isChatBulletOnlyLine(line)){
        const next = cleanedLines[i + 1] || "";
        const next2 = cleanedLines[i + 2] || "";
        if(next && /:$/.test(next) && next2 && isChatJoinableLine(next2) && !/:$/.test(next2)){
          merged.push("- " + next + " " + next2);
          i += 2;
          continue;
        }
        if(next){
          merged.push("- " + next);
          i += 1;
          continue;
        }
        continue;
      }
      if(/:$/.test(line)){
        const next = cleanedLines[i + 1] || "";
        if(isChatJoinableLine(next) && !/:$/.test(next)){
          merged.push(line + " " + next);
          i += 1;
          continue;
        }
      }
      merged.push(line);
    }

    while(merged.length && merged[0] === ""){
      merged.shift();
    }
    while(merged.length && merged[merged.length - 1] === ""){
      merged.pop();
    }
    return merged.join("\n");
  }

  function splitChatLabel(line){
    const clean = String(line || "").trim();
    const idx = clean.indexOf(":");
    if(idx <= 0 || idx > 42) return null;
    return {
      label: clean.slice(0, idx + 1).trim(),
      text: clean.slice(idx + 1).trim()
    };
  }

  function renderChatProjectLine(line){
    const name = String(line || "")
      .replace(/^(?:🏗️\s*)?PROYECTO:\s*/u, "")
      .trim();
    return ""
      + "<div class=\"ai-rich-project\">"
      +   "<div class=\"ai-rich-project-label\">🏗️ Proyecto</div>"
      +   "<div class=\"ai-rich-project-name\">" + escapeHtml(name || line) + "</div>"
      + "</div>";
  }

  function renderChatDetailLine(line, isBullet){
    const clean = String(line || "").trim().replace(/^(?:[-*•])\s+/, "");
    const detail = splitChatLabel(clean);
    const icon = isBullet ? "<span class=\"ai-rich-detail-mark\">•</span>" : "";
    if(detail){
      return ""
        + "<div class=\"ai-rich-detail" + (isBullet ? " ai-rich-detail--bullet" : "") + "\">"
        +   icon
        +   "<span class=\"ai-rich-detail-label\">" + escapeHtml(detail.label) + "</span>"
        +   "<span class=\"ai-rich-detail-text\">" + escapeHtml(detail.text) + "</span>"
        + "</div>";
    }
    return ""
      + "<div class=\"ai-rich-line" + (isBullet ? " ai-rich-line--bullet" : "") + "\">"
      +   icon
      +   "<span>" + escapeHtml(clean) + "</span>"
      + "</div>";
  }

  function renderChatGenericLine(line){
    const clean = String(line || "").trim();
    if(!clean) return "";
    if(isChatProjectLine(clean)){
      return renderChatProjectLine(clean);
    }
    if(/^(?:📊\s*)?Reporte\b/i.test(clean) || /^(?:🚀\s*)?Top\s+\d+\b/i.test(clean)){
      return "<div class=\"ai-rich-heading\">" + escapeHtml(clean) + "</div>";
    }
    if(/^(?:🎯\s*)?Criterio\b/i.test(clean)){
      return "<div class=\"ai-rich-summary\">" + escapeHtml(clean) + "</div>";
    }
    if(/^[-*]\s+/.test(clean)){
      return renderChatDetailLine(clean, true);
    }
    if(clean.length <= 80 && splitChatLabel(clean)){
      return renderChatDetailLine(clean, false);
    }
    return "<div class=\"ai-rich-line\">" + escapeHtml(clean) + "</div>";
  }

  function buildAssistantMessageHtml(text){
    const blocks = [];
    const lines = preprocessAssistantText(text)
      .split("\n")
      .map((line)=> line.trim());
    let current = [];

    lines.forEach((line)=>{
      if(!line){
        if(current.length){
          blocks.push(current);
          current = [];
        }
        return;
      }
      if(isChatRankLine(line) && current.length){
        blocks.push(current);
        current = [line];
        return;
      }
      current.push(line);
    });
    if(current.length){
      blocks.push(current);
    }
    if(!blocks.length){
      return "<div class=\"ai-rich-line\"></div>";
    }
    return blocks.map((lines)=>{
      const first = lines[0] || "";
      if(isChatRankLine(first)){
        return ""
          + "<section class=\"ai-rich-card\">"
          +   "<div class=\"ai-rich-rank\">" + escapeHtml(first) + "</div>"
          +   lines.slice(1).map((line)=>{
                if(isChatProjectLine(line)){
                  return renderChatProjectLine(line);
                }
                if(/^(?:[-*•])\s+/.test(line)){
                  return renderChatDetailLine(line, true);
                }
                return renderChatGenericLine(line);
              }).join("")
          + "</section>";
      }
      return "<div class=\"ai-rich-block\">" + lines.map(renderChatGenericLine).join("") + "</div>";
    }).join("");
  }

  function addMessage(text, role, options){
    const opts = options && typeof options === "object" ? options : {};
    const wrap = document.createElement("div");
    wrap.className = "ai-msg" + (role === "user" ? " ai-msg--user" : "");
    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble";
    if(role === "user"){
      bubble.textContent = text;
    } else {
      bubble.classList.add("ai-msg-bubble--rich");
      bubble.innerHTML = buildAssistantMessageHtml(text);
    }
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    if(opts.persist !== false){
      rememberMessage(text, role, opts.mode);
    }
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

  function snapshotInversion(base){
    if(!base || typeof base !== "object") return null;
    return {
      total: Number(base.total || 0),
      sumOper: Number(base.sumOper || 0),
      sumDet: Number(base.sumDet || 0),
      sumRepo: Number(base.sumRepo || 0)
    };
  }

  function getPlanContextForPrompt(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.getContext !== "function"){
      return null;
    }
    try{
      return planAI.getContext();
    }catch(e){
      return null;
    }
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

  function normalizeCommand(value){
    return normalizeText(value).replace(/\s+/g, " ").trim();
  }

  function extractSlashCommand(raw){
    const text = String(raw || "").trim();
    if(!text.startsWith("/")) return "";
    const rest = text.slice(1).trim();
    if(!rest) return "";
    const parts = rest.split(/\s+/).slice(0, 3);
    return normalizeCommand(parts.join(" "));
  }

  function commandEquals(cmd, variants){
    const normalized = normalizeCommand(cmd);
    return (variants || []).some((variant)=> normalized === normalizeCommand(variant));
  }

  function resolveLocalCommand(raw){
    const text = String(raw || "").trim();
    if(!text) return "";
    const slash = extractSlashCommand(text);
    const normalized = normalizeCommand(text);
    const isSlash = !!slash;
    const probe = slash || normalized;
    const words = probe ? probe.split(" ").length : 0;
    if(!isSlash && words > 3){
      return "";
    }

    if(state.mode === "inversion-plan"){
      if(commandEquals(probe, ["sugerir", "sugerencia", "plan ia", "ia plan"])) return "plan_suggest";
      if(commandEquals(probe, ["optimizar", "optimizar proyectos", "priorizar", "priorizar proyectos", "top 3", "top3"])) return "plan_optimize_top3";
      if(commandEquals(probe, ["comparar", "comparativo", "tabla"])) return "plan_compare";
      if(commandEquals(probe, ["aplicar", "aplicar ia", "usar ia"])) return "plan_apply";
      if(commandEquals(probe, ["revertir", "deshacer", "volver"])) return "plan_revert";
      if(commandEquals(probe, ["resumen", "reporte", "estado"])) return "plan_report";
      if(commandEquals(probe, ["soporte", "contacto"])) return "support";
      return "";
    }

    if(state.mode === "inversion"){
      if(commandEquals(probe, ["seguridad"])) return "pref_seguridad";
      if(commandEquals(probe, ["costo"])) return "pref_costo";
      if(commandEquals(probe, ["rapidez"])) return "pref_rapidez";
      if(commandEquals(probe, ["balance"])) return "pref_balance";
      if(commandEquals(probe, ["optimizar", "automatizar"])) return "optimize";
      if(commandEquals(probe, ["ranking", "ranking critico", "critico", "criticidad"])) return "critical";
      if(commandEquals(probe, ["cercania", "prioridad cercania", "proximidad"])) return "proximity";
      if(commandEquals(probe, ["plan mensual", "mensual", "cronograma"])) return "monthly_plan";
      if(commandEquals(probe, ["sugerencias", "sugerencia"])) return "suggest";
      if(commandEquals(probe, ["reporte", "resumen"])) return "report";
      if(commandEquals(probe, ["soporte", "contacto"])) return "support";
      if(commandEquals(probe, ["restaurar", "reset"])) return "reset";
      return "";
    }

    return "";
  }

  function isGreeting(raw){
    const text = normalizeCommand(raw);
    if(!text) return false;
    const greetings = [
      "hola",
      "hola ai",
      "buenas",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "hi",
      "hello"
    ];
    return greetings.includes(text);
  }

  function containsKeyword(text, keywords){
    if(!text || !Array.isArray(keywords) || !keywords.length) return false;
    const t = normalizeText(text);
    return keywords.some((k)=> t.includes(normalizeText(k)));
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
    list.forEach((p)=>{
      const d = distanceMeters(point, p);
      if(d < best) best = d;
    });
    return best;
  }

  function distanceScore(distance, maxDistance){
    if(!Number.isFinite(distance) || distance > maxDistance) return 0;
    const ratio = 1 - (distance / maxDistance);
    return Math.max(0, Math.min(1, ratio));
  }

  function getInventoryRows(){
    if(Array.isArray(window.aiInversionRows)){
      return window.aiInversionRows.slice().map((row)=> Object.assign({}, row));
    }
    return [];
  }

  function getReportsList(){
    try{
      if(Array.isArray(avisos)) return avisos.slice();
    }catch(e){}
    return [];
  }

  function collectInventoryPriorityContext(){
    const rows = getInventoryRows();
    const reports = getReportsList();
    const points = { hospital: [], escuela: [], evento: [] };

    reports.forEach((item)=>{
      const point = toPoint(item && item.lat, item && item.lng);
      if(!point) return;
      const text = [
        item && (item.tipo || item.type || ""),
        item && (item.descripcion || item.description || ""),
        item && (item.distrito || item.zona || "")
      ].join(" ");
      if(containsKeyword(text, inventoryKeywords.hospital)){
        points.hospital.push(point);
      }
      if(containsKeyword(text, inventoryKeywords.escuela)){
        points.escuela.push(point);
      }
      points.evento.push(point);
    });

    const criticalRows = rows.filter((row)=>{
      const status = String(row && row.estado || "");
      return status === "antigua" || status === "sin_senal";
    });
    const maxCost = criticalRows.reduce((max, row)=> Math.max(max, Number(row && row.inversion || 0)), 0);
    const totalMaintenance = criticalRows
      .filter((row)=> String(row.estado || "") === "antigua")
      .reduce((sum, row)=> sum + Number(row.inversion || 0), 0);
    const totalReplacement = criticalRows
      .filter((row)=> String(row.estado || "") === "sin_senal")
      .reduce((sum, row)=> sum + Number(row.inversion || 0), 0);

    const ranked = criticalRows.map((row)=>{
      const status = String(row.estado || "");
      const point = toPoint(row.lat, row.lng);
      const nearEvent = nearestDistanceMeters(point, points.evento);
      const nearHospital = nearestDistanceMeters(point, points.hospital);
      const nearEscuela = nearestDistanceMeters(point, points.escuela);

      const severity = status === "sin_senal" ? 2.4 : 1.8;
      const costScore = maxCost > 0 ? (Number(row.inversion || 0) / maxCost) : 0;
      const score = severity
        + (costScore * 1.4)
        + (distanceScore(nearEvent, INVENTORY_PROX_RADII.evento) * 1.5)
        + (distanceScore(nearHospital, INVENTORY_PROX_RADII.hospital) * 1.0)
        + (distanceScore(nearEscuela, INVENTORY_PROX_RADII.escuela) * 1.0);

      const reasons = [];
      reasons.push(status === "sin_senal" ? "activo por reponer" : "activo deteriorado");
      if(Number.isFinite(nearEvent) && nearEvent <= INVENTORY_PROX_RADII.evento){
        reasons.push("cerca de zona con eventos");
      }
      if(Number.isFinite(nearHospital) && nearHospital <= INVENTORY_PROX_RADII.hospital){
        reasons.push("cerca de hospital/salud");
      }
      if(Number.isFinite(nearEscuela) && nearEscuela <= INVENTORY_PROX_RADII.escuela){
        reasons.push("cerca de colegio/escuela");
      }
      if(!point){
        reasons.push("sin coordenada exacta");
      }

      return {
        id: String(row.id || ""),
        kind: String(row.kind || ""),
        name: row.name || "Activo",
        estado: status,
        inversion: Number(row.inversion || 0),
        point,
        nearEvent,
        nearHospital,
        nearEscuela,
        score,
        reasons
      };
    }).sort((a,b)=> b.score - a.score);

    return {
      rows,
      reports,
      points,
      criticalRows,
      ranked,
      totalMaintenance,
      totalReplacement
    };
  }

  function normalizeWeights(values){
    const list = Array.isArray(values) ? values.map((v)=> Math.max(0, Number(v || 0))) : [];
    const sum = list.reduce((a,b)=> a + b, 0);
    if(sum <= 0 || !list.length){
      return list.map(()=> 1 / Math.max(1, list.length));
    }
    return list.map((v)=> v / sum);
  }

  function buildInventoryMonthlyPlan(context){
    const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const replacementWeights = normalizeWeights([15,13,12,10,9,8,8,7,6,5,4,3]);
    const maintenanceWeights = normalizeWeights([6,7,8,8,9,9,9,9,9,9,9,8]);
    const replacementTotal = Number(context && context.totalReplacement || 0);
    const maintenanceTotal = Number(context && context.totalMaintenance || 0);

    return months.map((month, idx)=>{
      const replacement = Math.round(replacementTotal * replacementWeights[idx]);
      const maintenance = Math.round(maintenanceTotal * maintenanceWeights[idx]);
      return {
        month,
        replacement,
        maintenance,
        total: replacement + maintenance
      };
    });
  }

  function showInventoryCriticalRanking(){
    const ctx = collectInventoryPriorityContext();
    if(!ctx.rows.length){
      addMessage("No hay activos cargados en Inventario para analizar prioridad.", "ai");
      return;
    }
    if(!ctx.ranked.length){
      addMessage("No hay activos deteriorados o por reponer. El inventario actual no requiere priorizacion critica.", "ai");
      return;
    }
    const top = ctx.ranked.slice(0, 5);
    const lines = top.map((item, idx)=>{
      return (idx + 1) + ". " + item.name
        + " (" + (item.estado === "sin_senal" ? "Por reponer" : "Deteriorado") + ")"
        + " - " + formatMoney(item.inversion);
    });
    addMessage(
      "Ranking critico de activos (prioridad alta):\n"
      + lines.join("\n"),
      "ai"
    );
  }

  function showInventoryProximity(){
    const ctx = collectInventoryPriorityContext();
    if(!ctx.ranked.length){
      addMessage("No hay activos criticos con coordenadas para calcular cercania.", "ai");
      return;
    }
    const near = ctx.ranked.filter((item)=>{
      return (Number.isFinite(item.nearHospital) && item.nearHospital <= INVENTORY_PROX_RADII.hospital)
        || (Number.isFinite(item.nearEscuela) && item.nearEscuela <= INVENTORY_PROX_RADII.escuela)
        || (Number.isFinite(item.nearEvent) && item.nearEvent <= INVENTORY_PROX_RADII.evento);
    }).slice(0, 5);
    if(!near.length){
      addMessage("No se detectaron activos criticos cercanos a hospitales/colegios/eventos con los datos actuales.", "ai");
      return;
    }
    const lines = near.map((item, idx)=>{
      const tags = [];
      if(Number.isFinite(item.nearHospital) && item.nearHospital <= INVENTORY_PROX_RADII.hospital){
        tags.push("salud " + Math.round(item.nearHospital) + "m");
      }
      if(Number.isFinite(item.nearEscuela) && item.nearEscuela <= INVENTORY_PROX_RADII.escuela){
        tags.push("escuela " + Math.round(item.nearEscuela) + "m");
      }
      if(Number.isFinite(item.nearEvent) && item.nearEvent <= INVENTORY_PROX_RADII.evento){
        tags.push("evento " + Math.round(item.nearEvent) + "m");
      }
      return (idx + 1) + ". " + item.name + " - " + tags.join(", ");
    });
    addMessage(
      "Prioridad por cercania (hospitales/colegios/eventos):\n" + lines.join("\n")
      + "\nRadios usados: evento " + INVENTORY_PROX_RADII.evento + "m, salud " + INVENTORY_PROX_RADII.hospital + "m, escuela " + INVENTORY_PROX_RADII.escuela + "m.",
      "ai"
    );
  }

  function showInventoryMonthlyPlan(){
    const ctx = collectInventoryPriorityContext();
    if(!ctx.ranked.length){
      addMessage("No hay activos criticos para proponer un plan mensual.", "ai");
      return;
    }
    const plan = buildInventoryMonthlyPlan(ctx);
    const preview = plan.slice(0, 6).map((item)=>{
      return item.month + ": Reposicion " + formatMoney(item.replacement)
        + " | Mantenimiento " + formatMoney(item.maintenance);
    });
    const total = plan.reduce((sum, item)=> sum + item.total, 0);
    addMessage(
      "Plan mensual sugerido (primer semestre):\n"
      + preview.join("\n")
      + "\nTotal anual sugerido: " + formatMoney(total)
      + "\nMeta: priorizar reposicion al inicio y mantenimiento preventivo sostenido.",
      "ai"
    );
  }

  function getInventoryContextForPrompt(){
    const ctx = collectInventoryPriorityContext();
    const plan = buildInventoryMonthlyPlan(ctx);
    return {
      totalAssets: ctx.rows.length,
      criticalAssets: ctx.criticalRows.length,
      replacementTotal: Math.round(ctx.totalReplacement),
      maintenanceTotal: Math.round(ctx.totalMaintenance),
      reportPoints: {
        total: ctx.reports.length,
        hospital: ctx.points.hospital.length,
        escuela: ctx.points.escuela.length,
        evento: ctx.points.evento.length
      },
      proximityRadiusM: {
        evento: INVENTORY_PROX_RADII.evento,
        hospital: INVENTORY_PROX_RADII.hospital,
        escuela: INVENTORY_PROX_RADII.escuela
      },
      topCritical: ctx.ranked.slice(0, 5).map((item)=> ({
        name: item.name,
        estado: item.estado,
        inversion: Math.round(item.inversion),
        nearHospitalM: Number.isFinite(item.nearHospital) ? Math.round(item.nearHospital) : null,
        nearEscuelaM: Number.isFinite(item.nearEscuela) ? Math.round(item.nearEscuela) : null,
        nearEventoM: Number.isFinite(item.nearEvent) ? Math.round(item.nearEvent) : null
      })),
      monthlyPlan: plan.map((item)=> ({
        month: item.month,
        replacement: item.replacement,
        maintenance: item.maintenance
      }))
    };
  }

  async function consultarIAReal(query){
    if(!window.UrbbisApi || typeof window.UrbbisApi.chatPresupuestoAI !== "function"){
      throw new Error("API IA no disponible");
    }
    const payload = {
      query: String(query || "").trim(),
      preference: state.preference,
      mode: state.mode,
      history: getRecentHistory()
    };

    if(state.mode === "inversion"){
      const base = getBase();
      payload.inversionBase = snapshotInversion(base);
      payload.inventoryContext = getInventoryContextForPrompt();
      payload.override = (window.aiInversionOverride && typeof window.aiInversionOverride === "object")
        ? {
          total: Number(window.aiInversionOverride.total || 0),
          operativos: Number(window.aiInversionOverride.operativos || 0),
          deteriorados: Number(window.aiInversionOverride.deteriorados || 0),
          reposicion: Number(window.aiInversionOverride.reposicion || 0),
          pref: String(window.aiInversionOverride.pref || "")
        }
        : null;
    } else if(state.mode === "inversion-plan"){
      payload.planContext = getPlanContextForPrompt();
    }

    return window.UrbbisApi.chatPresupuestoAI(payload);
  }

  function setStatus(){
    if(state.pending){
      status.textContent = "Consultando IA...";
      toggle.classList.remove("is-active");
      return;
    }

    if(state.mode === "inversion"){
      const label = prefLabels[state.preference] || prefLabels.balance;
      status.textContent = state.active ? ("Simulacion activa (" + label + ")") : "Simulacion desactivada";
      toggle.classList.toggle("is-active", state.active);
      return;
    }

    if(state.mode === "inversion-plan"){
      const planAI = getPlanAI();
      const aiStatus = planAI ? planAI.getStatus() : null;
      if(aiStatus && aiStatus.hasApplied){
        status.textContent = "Cambio IA aplicado";
      } else if(aiStatus && aiStatus.hasScenario){
        status.textContent = "Comparativo IA listo para aplicar";
      } else {
        status.textContent = "Sugerencias de presupuesto";
      }
      toggle.classList.toggle("is-active", !!(aiStatus && aiStatus.hasApplied));
      return;
    }

    status.textContent = "Disponible en Inventario y Presupuesto";
    toggle.classList.remove("is-active");
  }

  function setPending(next){
    state.pending = !!next;
    input.disabled = state.pending;
    const sendBtn = form.querySelector(".ai-chat-send");
    if(sendBtn) sendBtn.disabled = state.pending;
    setStatus();
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
    if(typeof window.updateInversion === "function"){
      window.updateInversion();
    }
    setStatus();

    const deltaOper = oper - base.sumOper;
    const deltaDet = det - base.sumDet;
    const deltaRepo = repo - base.sumRepo;

    addMessage(
      "Escenario actualizado:\nOperativos " + formatMoney(oper)
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
    if(typeof window.updateInversion === "function"){
      window.updateInversion();
    }
    setStatus();
    addMessage("Simulacion desactivada. Valores originales restaurados.", "ai");
  }

  function showInventorySuggestions(){
    const ctx = collectInventoryPriorityContext();
    if(!ctx.rows.length){
      addMessage("No hay datos suficientes de inventario para sugerencias.", "ai");
      return;
    }
    const top = ctx.ranked.slice(0, 3);
    const topLines = top.map((item)=> "- " + item.name + " (" + (item.estado === "sin_senal" ? "por reponer" : "deteriorado") + ")");
    addMessage(
      "Sugerencias IA para inventario:\n"
      + "- Prioriza activos deteriorados y por reponer con mayor costo e impacto.\n"
      + "- Considera cercania a hospitales/colegios y zonas con eventos para subir prioridad.\n"
      + "- Ejecuta plan mensual: reposicion al inicio, mantenimiento preventivo continuo.\n"
      + (topLines.length ? ("Top inmediato:\n" + topLines.join("\n")) : ""),
      "ai"
    );
  }

  function showInventoryReport(){
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

  function showPlanReport(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.getContext !== "function"){
      addMessage("No se pudo leer el contexto de Presupuesto.", "ai");
      return;
    }
    const ctx = planAI.getContext();
    const reportSignals = ctx && ctx.reportSignals ? ctx.reportSignals : { total: 0, hotspots: [] };
    const summary = ctx && ctx.summary ? ctx.summary : null;
    const sensitiveParts = [];
    if(summary && Number(summary.nearHospitalCount || 0) > 0) sensitiveParts.push("salud (" + Number(summary.nearHospitalCount || 0) + ")");
    if(summary && Number(summary.nearEscuelaCount || 0) > 0) sensitiveParts.push("escuela (" + Number(summary.nearEscuelaCount || 0) + ")");
    if(summary && Number(summary.nearEventCount || 0) > 0) sensitiveParts.push("eventos (" + Number(summary.nearEventCount || 0) + ")");
    const hotspots = Array.isArray(reportSignals.hotspots) && reportSignals.hotspots.length
      ? reportSignals.hotspots.map((h)=> h.zone + " (" + h.count + ")").join(", ")
      : "Sin hotspots detectados";
    addMessage(
      "Panorama actual del presupuesto:\nPeriodo " + (ctx.year || "-")
        + "\nPresupuesto anual " + formatMoney(ctx.budgetTotal || 0)
        + "\nAsignado en planes " + formatMoney(ctx.assigned || 0)
        + "\nSaldo " + formatMoney(ctx.remaining || 0)
        + "\nReportes analizados " + (reportSignals.total || 0)
        + (summary && Number(summary.assetCount || 0) > 0 ? ("\nActivos vinculados " + Number(summary.assetCount || 0)) : "")
        + (summary && Number(summary.criticalCount || 0) > 0 ? ("\nActivos criticos " + Number(summary.criticalCount || 0)) : "")
        + (sensitiveParts.length ? ("\nLugares sensibles " + sensitiveParts.join(", ")) : "")
        + (summary && Number(summary.traceMeters || 0) > 0 ? ("\nTrazos asociados " + Math.round(Number(summary.traceMeters || 0)) + " m") : "")
        + "\nZonas clave: " + hotspots,
      "ai"
    );
  }

  function suggestPlanFromChat(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.suggest !== "function"){
      addMessage("El comparativo IA de Presupuesto no esta disponible.", "ai");
      return;
    }
    const result = planAI.suggest();
    if(result && result.ok){
      addMessage(result.message || "Comparativo IA generado.", "ai");
    } else {
      addMessage((result && result.message) || "No se pudo generar comparativo IA.", "ai");
    }
    setStatus();
  }

  function comparePlanFromChat(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.getStatus !== "function"){
      addMessage("El comparativo IA de Presupuesto no esta disponible.", "ai");
      return;
    }
    const st = planAI.getStatus();
    if(!st || !st.hasScenario){
      suggestPlanFromChat();
      return;
    }
    const ctx = typeof planAI.getContext === "function" ? planAI.getContext() : null;
    const summary = ctx && ctx.scenario && ctx.scenario.summaryNote
      ? String(ctx.scenario.summaryNote)
      : "El comparativo IA ya esta visible en Presupuesto. Puedes aplicar o revertir desde aqui.";
    addMessage("Ya tengo el comparativo listo.\n" + summary, "ai");
    setStatus();
  }

  function applyPlanFromChat(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.apply !== "function"){
      addMessage("No se pudo aplicar la sugerencia IA.", "ai");
      return;
    }
    const result = planAI.apply();
    addMessage((result && result.message) || "No se pudo aplicar la sugerencia IA.", "ai");
    setStatus();
  }

  function revertPlanFromChat(){
    const planAI = getPlanAI();
    if(!planAI || typeof planAI.revert !== "function"){
      addMessage("No se pudo revertir el cambio IA.", "ai");
      return;
    }
    const result = planAI.revert();
    addMessage((result && result.message) || "No se pudo revertir el cambio IA.", "ai");
    setStatus();
  }

  function showSupport(){
    addMessage("Contacto de soporte: " + supportPhone, "ai");
  }

  async function submitAssistantQuery(query, visibleText){
    const cleanQuery = String(query || "").trim();
    if(!cleanQuery){
      return;
    }
    addMessage(String(visibleText || cleanQuery), "user", { persist: false });
    await handleText(cleanQuery);
  }

  function handleInventoryAction(actionId){
    switch(actionId){
      case "optimize":
      case "auto":
        addMessage("Elige una preferencia para ajustar la inversion.", "ai");
        renderActions(prefActions);
        return;
      case "pref_balance":
        applyPreference("balance");
        renderActions(inventoryMainActions);
        return;
      case "pref_seguridad":
        applyPreference("seguridad");
        renderActions(inventoryMainActions);
        return;
      case "pref_costo":
        applyPreference("costo");
        renderActions(inventoryMainActions);
        return;
      case "pref_rapidez":
        applyPreference("rapidez");
        renderActions(inventoryMainActions);
        return;
      case "critical":
        showInventoryCriticalRanking();
        return;
      case "proximity":
        showInventoryProximity();
        return;
      case "monthly_plan":
        showInventoryMonthlyPlan();
        return;
      case "suggest":
        showInventorySuggestions();
        return;
      case "report":
        showInventoryReport();
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

  function handlePlanAction(actionId){
    switch(actionId){
      case "plan_suggest":
        suggestPlanFromChat();
        return;
      case "plan_optimize_top3":
        void submitAssistantQuery(
          "Optimizar proyectos de inversion y mostrar un Top 3 priorizado con analisis tecnico inferido, impacto en seguridad, costo y plazo.",
          "Optimizar proyectos"
        );
        return;
      case "plan_compare":
        comparePlanFromChat();
        return;
      case "plan_apply":
        applyPlanFromChat();
        return;
      case "plan_revert":
        revertPlanFromChat();
        return;
      case "plan_report":
        showPlanReport();
        return;
      case "support":
        showSupport();
        return;
      default:
        return;
    }
  }

  function handleAction(actionId){
    if(state.mode === "inversion-plan"){
      handlePlanAction(actionId);
      return;
    }
    handleInventoryAction(actionId);
  }

  async function handleText(text){
    const raw = String(text || "").trim();
    if(!raw){
      return;
    }
    rememberMessage(raw, "user");
    const localCommand = resolveLocalCommand(raw);
    if(localCommand){
      handleAction(localCommand);
      return;
    }
    if(isGreeting(raw)){
      const msg = state.mode === "inversion-plan"
        ? "Hola. Puedo revisar contigo el presupuesto, explicar por que la IA movio montos, comparar escenarios y priorizar un Top 3. Si quieres ir directo, usa /sugerir, /optimizar, /comparar, /aplicar o /revertir."
        : "Hola. Puedo ayudarte a priorizar inventario, revisar cercania y armar un plan mensual. Si prefieres atajos, usa /ranking, /cercania, /mensual o /seguridad.";
      addMessage(msg, "ai");
      return;
    }

    setPending(true);
    try{
      const result = await consultarIAReal(raw);
      const answer = result && result.answer ? String(result.answer) : "";
      if(answer){
        addMessage(answer, "ai");
      } else {
        addMessage("La IA no devolvio contenido. Intenta reformular la consulta.", "ai");
      }
    }catch(err){
      const msgErr = err && err.message ? String(err.message) : "No se pudo consultar la IA.";
      const missingGeminiKey = msgErr.includes("GEMINI_API_KEY no configurado en backend");
      const isMissingEndpoint = msgErr.includes("Cannot POST /ai/presupuesto-chat")
        || msgErr.includes("HTTP 404");
      if(missingGeminiKey){
        addMessage(
          "Gemini no esta configurado en backend. Agrega GEMINI_API_KEY en backend/.env y reinicia el servidor. "
          + "Mientras tanto puedes usar comandos locales del asistente.",
          "ai"
        );
      } else if(isMissingEndpoint){
        const hint = "La API actual no tiene habilitado /ai/presupuesto-chat. Si estas en local, usa base API http://localhost:3001 y reinicia backend.";
        if(state.mode === "inversion-plan"){
          addMessage(hint + " Mientras tanto puedo seguir con funciones locales: /sugerir, /comparar, /aplicar, /revertir.", "ai");
        } else if(state.mode === "inversion"){
          addMessage(hint + " Mientras tanto puedo seguir con funciones locales: /ranking, /cercania, /mensual.", "ai");
        } else {
          addMessage(hint, "ai");
        }
      } else {
        addMessage("No se pudo consultar Gemini: " + msgErr, "ai");
      }
    }finally{
      setPending(false);
    }
  }

  function openPanel(){
    if(state.mode === "other"){
      return;
    }
    panel.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closePanel(){
    panel.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
  }

  function syncModeUI(){
    const nextMode = detectMode();
    const changed = nextMode !== state.mode;
    state.mode = nextMode;

    const shouldShow = state.mode === "inversion" || state.mode === "inversion-plan";
    toggle.classList.toggle("hidden", !shouldShow);
    if(!shouldShow){
      closePanel();
      return;
    }

    if(title){
      title.textContent = state.mode === "inversion-plan" ? "Asistente de presupuesto" : "Asistente de inversion";
    }
    input.placeholder = state.mode === "inversion-plan"
      ? "Pregunta por mejoras, escenarios o prioridades..."
      : "Pregunta por prioridades o escenarios...";

    if(changed){
      if(state.mode === "inversion-plan"){
        renderActions(planMainActions);
      } else {
        renderActions(inventoryMainActions);
      }
    }

    setStatus();

    if(!introShown.has(state.mode)){
      const msg = state.mode === "inversion-plan"
        ? "Asistente de Presupuesto activo. Puedes escribirme normal y te explico que mejora cada escenario; si quieres ir rapido, usa /sugerir, /optimizar, /comparar, /aplicar o /revertir."
        : "Asistente de Inventario activo. Puedes escribirme normal para priorizar activos o pedir un plan; tambien puedes usar /ranking, /cercania, /mensual o /seguridad.";
      addMessage(msg, "ai");
      introShown.add(state.mode);
    }
  }

  toggle.addEventListener("click", ()=>{
    if(state.mode === "other"){
      return;
    }
    if(panel.classList.contains("hidden")){
      openPanel();
    } else {
      closePanel();
    }
  });

  if(closeBtn){
    closeBtn.addEventListener("click", closePanel);
  }

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if(state.pending || state.mode === "other") return;
    const value = input.value.trim();
    if(!value){
      return;
    }
    addMessage(value, "user", { persist: false });
    input.value = "";
    await handleText(value);
  });

  quick.addEventListener("click", (e)=>{
    if(state.pending || state.mode === "other") return;
    const btn = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
    if(!btn) return;
    handleAction(btn.getAttribute("data-action") || "");
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && !panel.classList.contains("hidden")){
      closePanel();
    }
  });

  document.addEventListener("dash:viewchange", ()=>{
    syncModeUI();
  });

  renderActions(inventoryMainActions);
  syncModeUI();
})();
