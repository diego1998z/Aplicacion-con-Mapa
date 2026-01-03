// Referencias principales
const btnUbicacion = document.getElementById("btnUbicacion");
const btnToggleRol = document.getElementById("btnToggleRol");
const modalReporte = document.getElementById("modalReporte");
const btnReportar = document.getElementById("btnReportar");
const btnCancelarReporte = document.getElementById("btnCancelarReporte");
const btnEnviarReporte = document.getElementById("btnEnviarReporte");
const inputTipoProblema = document.getElementById("inputTipoProblema");
const inputNombreReporte = document.getElementById("inputNombreReporte");
const inputDniReporte = document.getElementById("inputDniReporte");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputFoto = document.getElementById("inputFoto");
const infoUbicacion = document.getElementById("infoUbicacion");
const btnElegirMapa = document.getElementById("btnElegirMapa");
const loginOverlay = document.getElementById("loginOverlay");
const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("inputCorreo");
const inputClave = document.getElementById("inputClave");
const btnLogout = document.getElementById("btnLogout");
const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");
const btnFloatingFilters = document.getElementById("btnFloatingFilters");
const btnFloatingReport = document.getElementById("btnFloatingReport");
const btnFloatingLogout = document.getElementById("btnFloatingLogout");
const btnMapVisualizacion = document.getElementById("btnMapVisualizacion");
const btnMapMetrado = document.getElementById("btnMapMetrado");
const btnMapAgregar = document.getElementById("btnMapAgregar");
const visualizacionPanel = document.getElementById("visualizacionPanel");
const metradoPanel = document.getElementById("metradoPanel");
const metradoStatus = document.getElementById("metradoStatus");
const btnMetradoInicio = document.getElementById("btnMetradoInicio");
const btnMetradoFin = document.getElementById("btnMetradoFin");
const btnMetradoUndo = document.getElementById("btnMetradoUndo");
const btnMetradoLimpiar = document.getElementById("btnMetradoLimpiar");
const metradoColor = document.getElementById("metradoColor");
const metradoLineas = document.getElementById("metradoLineas");
const metradoDistancia = document.getElementById("metradoDistancia");
const metradoMetrado = document.getElementById("metradoMetrado");
const btnVisualizacionAvanzada = document.getElementById("btnVisualizacionAvanzada");
const visualizacionAvanzada = document.getElementById("visualizacionAvanzada");
const btnVisualizacionReset = document.getElementById("btnVisualizacionReset");
const chkLayerTransito = document.getElementById("chkLayerTransito");
const chkLayerMarcas = document.getElementById("chkLayerMarcas");
const chkLayerMobiliario = document.getElementById("chkLayerMobiliario");
const chkLayerEventos = document.getElementById("chkLayerEventos");
const chkConsOperativos = document.getElementById("chkConsOperativos");
const chkConsDeteriorados = document.getElementById("chkConsDeteriorados");
const chkConsNoOperativos = document.getElementById("chkConsNoOperativos");
const chkFotoCon = document.getElementById("chkFotoCon");
const chkFotoSin = document.getElementById("chkFotoSin");
const chkTiempoActivos = document.getElementById("chkTiempoActivos");
const chkTiempoProgramados = document.getElementById("chkTiempoProgramados");
const chkTiempoSinFinalizados = document.getElementById("chkTiempoSinFinalizados");
const reportesPanel = document.getElementById("reportes");
const btnCerrarReportes = document.getElementById("btnCerrarReportes");
const reportesSheet = reportesPanel ? reportesPanel.querySelector(".reportes-sheet") : null;
const mapContainer = document.getElementById("map");
const mapFloatingControls = document.getElementById("mapFloatingControls");
const registroPicker = document.getElementById("registroPicker");
const registroPanel = document.getElementById("registroPanel");
const registroHint = document.getElementById("registroHint");
const btnRegistroCancelar = document.getElementById("btnRegistroCancelar");
const btnRegistroBack = document.getElementById("btnRegistroBack");
const registroPickerTitle = document.getElementById("registroPickerTitle");
const registroPickerGridMain = document.getElementById("registroPickerGridMain");
const registroPickerGridMarcas = document.getElementById("registroPickerGridMarcas");
const dashboardOverlay = document.getElementById("dashboardOverlay");
const btnDashLogout = document.getElementById("btnDashLogout");
const dashUserName = document.getElementById("dashUserName");
const dashUserEmail = document.getElementById("dashUserEmail");
const dashAvatarInitials = document.getElementById("dashAvatarInitials");
const dashEntity = document.getElementById("dashEntity");
const dashScore = document.getElementById("dashScore");
const dashTotalSenales = document.getElementById("dashTotalSenales");
const dashInversion = document.getElementById("dashInversion");
const dashAtencion = document.getElementById("dashAtencion");

// Configuracion
const cfgNombre = document.getElementById("cfgNombre");
const cfgEmail = document.getElementById("cfgEmail");
const cfgRol = document.getElementById("cfgRol");
const btnCfgGuardarPerfil = document.getElementById("btnCfgGuardarPerfil");
const cfgTemaOscuro = document.getElementById("cfgTemaOscuro");
const cfgAnimaciones = document.getElementById("cfgAnimaciones");
const cfgNotificaciones = document.getElementById("cfgNotificaciones");
const cfgZoomInicial = document.getElementById("cfgZoomInicial");
const cfgAnimDur = document.getElementById("cfgAnimDur");
const btnCfgIrALima = document.getElementById("btnCfgIrALima");
const btnCfgExportar = document.getElementById("btnCfgExportar");
const cfgImportar = document.getElementById("cfgImportar");
const bboxLima = "-77.2,-11.7,-76.8,-12.3"; // Lima Metropolitana aprox
let overlayFoto = null;

// Flujo de registro desde "Agregar"
let registroTipo = "";
let pickingRegistro = false;
let registroLatLng = null;
let registroMarker = null;
let registroDraft = null;

// Metrado de pintura (trazado manual)
let metradoPicking = ""; // "draw"
let metradoPuntos = [];
let metradoInicioLatLng = null;
let metradoFinLatLng = null;
let metradoDistanciaM = 0;
let metradoLayer = null;
let metradoMarkerInicio = null;
let metradoMarkerFin = null;
let metradoRouteOutline = null;
let metradoRouteLine = null;
let metradoRouteFlow = null;
let metradoPreviewLine = null;
let metradoCursorMarker = null;
let metradoLoading = false;

function mostrarRegistroHint(texto){
  if(!registroHint) return;
  if(!texto){
    registroHint.classList.add("hidden");
    registroHint.setAttribute("aria-hidden","true");
    return;
  }
  registroHint.textContent = texto;
  registroHint.classList.remove("hidden");
  registroHint.setAttribute("aria-hidden","false");
}

function cerrarRegistroPanel(){
  if(registroPanel){
    registroPanel.classList.add("hidden");
    registroPanel.setAttribute("aria-hidden","true");
    registroPanel.innerHTML = "";
  }
  mostrarRegistroHint("");
  registroTipo = "";
  registroDraft = null;
  pickingRegistro = false;
  registroLatLng = null;
  try{
    if(registroMarker && typeof map !== "undefined" && map){
      map.removeLayer(registroMarker);
    }
  }catch(e){}
  registroMarker = null;
}

function asegurarMetradoLayer(){
  try{
    if(metradoLayer) return metradoLayer;
    if(typeof L === "undefined") return null;
    if(typeof map === "undefined" || !map) return null;
    metradoLayer = L.layerGroup().addTo(map);
    return metradoLayer;
  }catch(e){
    return null;
  }
}

function iconoMetrado(letra, tipo){
  try{
    if(typeof L === "undefined") return null;
    const cls = tipo === "fin" ? "metrado-pin-icon metrado-pin-icon--fin" : "metrado-pin-icon metrado-pin-icon--inicio";
    return L.divIcon({
      className:"metrado-pin",
      html:'<div class="' + cls + '">' + (letra || "") + '</div>',
      iconSize:[28,28],
      iconAnchor:[14,14]
    });
  }catch(e){
    return null;
  }
}

function iconoMetradoCursor(){
  try{
    if(typeof L === "undefined") return null;
    const color = colorLineaMetrado();
    return L.divIcon({
      className:"metrado-cursor",
      html:'<div class="metrado-cursor-dot" style="background:' + color + '"></div>',
      iconSize:[18,18],
      iconAnchor:[9,9]
    });
  }catch(e){
    return null;
  }
}

function asegurarMetradoCursor(){
  const layer = asegurarMetradoLayer();
  if(!layer) return;
  if(metradoCursorMarker) return;
  try{
    metradoCursorMarker = L.marker([0,0], {
      interactive:false,
      keyboard:false,
      icon: iconoMetradoCursor() || undefined
    }).addTo(layer);
  }catch(e){
    metradoCursorMarker = null;
  }
}

function asegurarMetradoPreview(){
  const layer = asegurarMetradoLayer();
  if(!layer) return;
  if(metradoPreviewLine) return;
  try{
    metradoPreviewLine = L.polyline([], {
      color: colorLineaMetrado(),
      weight: 7,
      opacity: 0.55,
      dashArray: "10 12",
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-preview"
    }).addTo(layer);
  }catch(e){
    metradoPreviewLine = null;
  }
}

function ocultarMetradoPreview(){
  const layer = asegurarMetradoLayer();
  if(layer){
    try{
      if(metradoPreviewLine) layer.removeLayer(metradoPreviewLine);
      if(metradoCursorMarker) layer.removeLayer(metradoCursorMarker);
    }catch(e){}
  }
  metradoPreviewLine = null;
  metradoCursorMarker = null;
}

function setMetradoStatus(texto){
  if(!metradoStatus) return;
  metradoStatus.textContent = texto || "";
}

function formatoMetros(m){
  const n = (typeof m === "number" && isFinite(m)) ? Math.max(0, m) : 0;
  const v = Math.round(n);
  try{
    return v.toLocaleString("es-PE") + " m";
  }catch(e){
    return String(v) + " m";
  }
}

function colorLineaMetrado(){
  const c = metradoColor ? String(metradoColor.value || "") : "amarillo";
  if(c === "blanco") return "#ffffff";
  return "#f7d21e";
}

function actualizarResultadosMetrado(){
  const lineas = metradoLineas ? parseInt(metradoLineas.value, 10) : 1;
  const nLineas = (Number.isFinite(lineas) && lineas > 0) ? lineas : 1;
  if(metradoDistancia){
    metradoDistancia.textContent = metradoDistanciaM ? formatoMetros(metradoDistanciaM) : "-";
  }
  if(metradoMetrado){
    const total = metradoDistanciaM ? (metradoDistanciaM * nLineas) : 0;
    metradoMetrado.textContent = metradoDistanciaM ? formatoMetros(total) : "-";
  }
}

function aplicarEstiloRutaMetrado(){
  const color = colorLineaMetrado();
  try{
    if(metradoRouteLine && typeof metradoRouteLine.setStyle === "function"){
      metradoRouteLine.setStyle({ color: color });
    }
    if(metradoRouteFlow && typeof metradoRouteFlow.setStyle === "function"){
      const flowColor = (color === "#ffffff") ? "rgba(12,66,106,0.70)" : "rgba(255,255,255,0.70)";
      metradoRouteFlow.setStyle({ color: flowColor });
    }
    if(metradoPreviewLine && typeof metradoPreviewLine.setStyle === "function"){
      metradoPreviewLine.setStyle({ color: color });
    }
    if(metradoCursorMarker && typeof metradoCursorMarker.setIcon === "function"){
      metradoCursorMarker.setIcon(iconoMetradoCursor() || undefined);
    }
  }catch(e){}
}

function limpiarRutaMetrado(){
  const layer = asegurarMetradoLayer();
  if(layer){
    try{
      if(metradoMarkerInicio) layer.removeLayer(metradoMarkerInicio);
      if(metradoMarkerFin) layer.removeLayer(metradoMarkerFin);
      if(metradoRouteOutline) layer.removeLayer(metradoRouteOutline);
      if(metradoRouteLine) layer.removeLayer(metradoRouteLine);
      if(metradoRouteFlow) layer.removeLayer(metradoRouteFlow);
    }catch(e){}
  }
  ocultarMetradoPreview();
  metradoMarkerInicio = null;
  metradoMarkerFin = null;
  metradoRouteOutline = null;
  metradoRouteLine = null;
  metradoRouteFlow = null;
  metradoPuntos = [];
  metradoInicioLatLng = null;
  metradoFinLatLng = null;
  metradoDistanciaM = 0;
  metradoPicking = "";
  metradoLoading = false;
  if(btnMetradoFin) btnMetradoFin.disabled = true;
  if(btnMetradoUndo) btnMetradoUndo.disabled = true;
  setMetradoStatus("Inicia el trazado y marca puntos sobre la pista.");
  actualizarResultadosMetrado();
  mostrarRegistroHint("");
}

function distanciaPolylineMetrado(puntos){
  try{
    if(typeof map === "undefined" || !map || typeof map.distance !== "function") return 0;
    const arr = Array.isArray(puntos) ? puntos : [];
    let total = 0;
    for(let i = 1; i < arr.length; i++){
      total += map.distance(arr[i - 1], arr[i]);
    }
    return total;
  }catch(e){
    return 0;
  }
}

function dibujarRutaMetrado(latlngs){
  const layer = asegurarMetradoLayer();
  if(!layer) return;
  const puntos = Array.isArray(latlngs) ? latlngs : [];
  if(puntos.length < 2){
    try{
      if(metradoRouteOutline) layer.removeLayer(metradoRouteOutline);
      if(metradoRouteLine) layer.removeLayer(metradoRouteLine);
      if(metradoRouteFlow) layer.removeLayer(metradoRouteFlow);
    }catch(e){}
    metradoRouteOutline = null;
    metradoRouteLine = null;
    metradoRouteFlow = null;
    return;
  }

  const color = colorLineaMetrado();
  const weight = 8;
  if(!metradoRouteOutline){
    metradoRouteOutline = L.polyline(puntos, {
      color: "#0b2230",
      weight: weight + 4,
      opacity: 0.22,
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-outline"
    }).addTo(layer);
  } else {
    metradoRouteOutline.setLatLngs(puntos);
  }
  if(!metradoRouteLine){
    metradoRouteLine = L.polyline(puntos, {
      color: color,
      weight: weight,
      opacity: 0.88,
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-line"
    }).addTo(layer);
  } else {
    metradoRouteLine.setLatLngs(puntos);
  }

  const flowColor = (color === "#ffffff") ? "rgba(12,66,106,0.70)" : "rgba(255,255,255,0.70)";
  if(!metradoRouteFlow){
    metradoRouteFlow = L.polyline(puntos, {
      color: flowColor,
      weight: Math.max(3, weight - 3),
      opacity: 0.70,
      dashArray: "10 16",
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-flow"
    }).addTo(layer);
  } else {
    metradoRouteFlow.setLatLngs(puntos);
    if(typeof metradoRouteFlow.setStyle === "function"){
      metradoRouteFlow.setStyle({ color: flowColor });
    }
  }
  aplicarEstiloRutaMetrado();
}

function actualizarTrazadoMetrado(){
  const layer = asegurarMetradoLayer();
  if(!layer) return;

  metradoInicioLatLng = metradoPuntos.length ? metradoPuntos[0] : null;
  metradoFinLatLng = metradoPuntos.length ? metradoPuntos[metradoPuntos.length - 1] : null;

  // Marcadores A/B
  try{
    if(metradoInicioLatLng){
      if(!metradoMarkerInicio){
        metradoMarkerInicio = L.marker(metradoInicioLatLng, { icon: iconoMetrado("A", "inicio") || undefined }).addTo(layer);
      } else {
        metradoMarkerInicio.setLatLng(metradoInicioLatLng);
      }
    } else if(metradoMarkerInicio){
      layer.removeLayer(metradoMarkerInicio);
      metradoMarkerInicio = null;
    }

    if(metradoFinLatLng && metradoPuntos.length >= 2){
      if(!metradoMarkerFin){
        metradoMarkerFin = L.marker(metradoFinLatLng, { icon: iconoMetrado("B", "fin") || undefined }).addTo(layer);
      } else {
        metradoMarkerFin.setLatLng(metradoFinLatLng);
      }
    } else if(metradoMarkerFin){
      layer.removeLayer(metradoMarkerFin);
      metradoMarkerFin = null;
    }
  }catch(e){}

  dibujarRutaMetrado(metradoPuntos);
  metradoDistanciaM = distanciaPolylineMetrado(metradoPuntos);
  actualizarResultadosMetrado();

  if(btnMetradoUndo) btnMetradoUndo.disabled = metradoPuntos.length === 0;
}

function agregarPuntoMetrado(rawLatLng){
  if(!rawLatLng) return false;
  const latlng = rawLatLng;
  try{
    const last = metradoPuntos.length ? metradoPuntos[metradoPuntos.length - 1] : null;
    if(last && typeof map !== "undefined" && map && typeof map.distance === "function"){
      const d = map.distance(last, latlng);
      if(d < 1.5) return false;
    }
  }catch(e){}
  metradoPuntos.push(latlng);
  actualizarTrazadoMetrado();
  return true;
}

function deshacerPuntoMetrado(){
  if(!metradoPuntos.length) return;
  metradoPuntos.pop();
  actualizarTrazadoMetrado();
  if(!metradoPuntos.length){
    setMetradoStatus("Inicia el trazado y marca puntos sobre la pista.");
  }
}

function abrirRegistroPicker(){
  if(!registroPicker) return;
  cerrarRegistroPanel();
  setRegistroPickerStep("main");
  registroPicker.classList.remove("hidden");
  registroPicker.setAttribute("aria-hidden","false");
}

function cerrarRegistroPicker(){
  if(!registroPicker) return;
  registroPicker.classList.add("hidden");
  registroPicker.setAttribute("aria-hidden","true");
}

let registroPickerStep = "main"; // main | marcas
function setRegistroPickerStep(step){
  registroPickerStep = step === "marcas" ? "marcas" : "main";
  const isMarcas = registroPickerStep === "marcas";
  try{
    if(registroPickerTitle){
      registroPickerTitle.textContent = isMarcas ? "Marcas viales" : "¿Qué deseas registrar?";
    }
    if(registroPickerGridMain){
      registroPickerGridMain.classList.toggle("hidden", isMarcas);
      registroPickerGridMain.setAttribute("aria-hidden", String(isMarcas));
    }
    if(registroPickerGridMarcas){
      registroPickerGridMarcas.classList.toggle("hidden", !isMarcas);
      registroPickerGridMarcas.setAttribute("aria-hidden", String(!isMarcas));
    }
    if(btnRegistroBack){
      btnRegistroBack.classList.toggle("hidden", !isMarcas);
      btnRegistroBack.setAttribute("aria-hidden", String(!isMarcas));
    }
  }catch(e){}
}

function abrirMetradoPanel(){
  if(!metradoPanel) return;
  cerrarRegistroPicker();
  cerrarRegistroPanel();
  metradoPanel.classList.remove("hidden");
  if(btnMapMetrado) btnMapMetrado.classList.add("active");
  if(visualizacionPanel) visualizacionPanel.classList.add("hidden");
  if(btnMapVisualizacion) btnMapVisualizacion.classList.remove("active");
  if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
  try{ actualizarResultadosMetrado(); }catch(e){}
}

function iconoRegistroTemporal(){
  try{
    return L.divIcon({
      className:"registro-pin",
      html:'<div class="registro-pin-icon"></div>',
      iconSize:[22, 34],
      iconAnchor:[11, 30]
    });
  }catch(e){
    return null;
  }
}

function colocarRegistroMarker(latlng){
  try{
    if(registroMarker && typeof map !== "undefined" && map){
      map.removeLayer(registroMarker);
      registroMarker = null;
    }
  }catch(e){}
  try{
    if(typeof map === "undefined" || !map || !latlng) return;
    const icon = iconoRegistroTemporal();
    registroMarker = L.marker(latlng, { draggable:true, icon: icon || undefined }).addTo(map);
    registroMarker.on("dragend", ()=>{
      try{ registroLatLng = registroMarker.getLatLng(); }catch(e){}
    });
  }catch(e){}
}

function iniciarSeleccionUbicacion(tipo){
  registroTipo = tipo;
  registroLatLng = null;
  registroDraft = null;
  pickingRegistro = true;
  mostrarRegistroHint("Haz click en el mapa para colocar la ubicaci\u00F3n.");
  cerrarRegistroPicker();
  try{
    if(visualizacionPanel) visualizacionPanel.classList.add("hidden");
    if(btnMapVisualizacion) btnMapVisualizacion.classList.remove("active");
    if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
  }catch(e){}

  // Asegurar que la capa elegida sea visible
  try{
    if(tipo === "transito" && chkLayerTransito){
      chkLayerTransito.checked = true;
      window.setCapaVisible && window.setCapaVisible("transito", true);
      setModoCreacion("vertical");
    }
    if(tipo === "marcas" && chkLayerMarcas){
      chkLayerMarcas.checked = true;
      window.setCapaVisible && window.setCapaVisible("marcas", true);
      setModoCreacion("horizontal");
    }
    if(tipo === "mobiliario" && chkLayerMobiliario){
      chkLayerMobiliario.checked = true;
      window.setCapaVisible && window.setCapaVisible("mobiliario", true);
    }
    if(tipo === "eventos" && chkLayerEventos){
      chkLayerEventos.checked = true;
      window.setCapaVisible && window.setCapaVisible("eventos", true);
    }
  }catch(e){}
}

function loadUrbbisConfig(){
  try{
    const raw = localStorage.getItem("urbbisConfig");
    if(!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  }catch(e){
    return {};
  }
}

function saveUrbbisConfig(cfg){
  try{
    localStorage.setItem("urbbisConfig", JSON.stringify(cfg || {}));
  }catch(e){}
}

function applyUrbbisConfig(cfg){
  const c = cfg || {};
  try{
    document.body.classList.toggle("theme-dark", !!c.temaOscuro);
  }catch(e){}
  try{
    window.URBBIS_CONFIG = c;
  }catch(e){}
}

function getSessionEmail(){
  try{
    const fromInput = (inputCorreo && inputCorreo.value) ? inputCorreo.value.trim() : "";
    if(fromInput) return fromInput;
    return localStorage.getItem("correoActual") || "";
  }catch(e){
    return "";
  }
}

function getProfileName(){
  try{
    const cfg = loadUrbbisConfig();
    if(cfg && cfg.profileName) return String(cfg.profileName);
    return "";
  }catch(e){
    return "";
  }
}

function updateConfigUI(){
  const cfg = loadUrbbisConfig();
  const correo = getSessionEmail();
  const name = (cfg && cfg.profileName) ? String(cfg.profileName) : "";
  if(cfgNombre) cfgNombre.value = name || (correo ? nombreDesdeCorreo(correo) : "");
  if(cfgEmail) cfgEmail.value = correo || "-";
  if(cfgRol) cfgRol.value = rolActual === "municipal" ? "Municipal" : "Visitante";

  if(cfgTemaOscuro) cfgTemaOscuro.checked = !!cfg.temaOscuro;
  if(cfgAnimaciones) cfgAnimaciones.checked = cfg.animaciones !== false;
  if(cfgNotificaciones) cfgNotificaciones.checked = !!cfg.notificaciones;
  if(cfgZoomInicial) cfgZoomInicial.value = String(Number.isFinite(cfg.zoomInicial) ? cfg.zoomInicial : 13);
  if(cfgAnimDur) cfgAnimDur.value = String(Number.isFinite(cfg.animDur) ? cfg.animDur : 0.6);

  applyUrbbisConfig(cfg);
}

function updateAndPersistConfig(partial){
  const current = loadUrbbisConfig();
  const next = Object.assign({}, current, partial || {});
  saveUrbbisConfig(next);
  applyUrbbisConfig(next);
  updateConfigUI();
  if(typeof updateDashboard === "function"){ updateDashboard(); }
}

function capitalizeWord(str){
  const s = String(str || "").trim();
  if(!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function nombreDesdeCorreo(correo){
  const c = String(correo || "").trim();
  const user = (c.split("@")[0] || "").trim();
  if(!user) return "Usuario";
  const parts = user.split(/[._-]+/g).filter(Boolean);
  const name = parts.map(capitalizeWord).join(" ");
  return name || capitalizeWord(user) || "Usuario";
}

function inicialesDesdeCorreo(correo){
  const name = nombreDesdeCorreo(correo);
  const parts = name.split(/\s+/g).filter(Boolean);
  const a = (parts[0] && parts[0][0]) ? parts[0][0] : "U";
  const b = (parts[1] && parts[1][0]) ? parts[1][0] : ((parts[0] && parts[0][1]) ? parts[0][1] : "R");
  return (a + b).toUpperCase();
}

function formatearMonedaPEN(monto){
  const n = Number(monto || 0);
  try{
    return new Intl.NumberFormat("es-PE", {style:"currency", currency:"PEN", maximumFractionDigits:0}).format(n);
  }catch(e){
    return "S/ " + Math.round(n).toLocaleString("es-PE");
  }
}

function filtrarPorSeleccion(dataset){
  let base = Array.isArray(dataset) ? dataset.slice() : [];
  try{
    if(typeof filtroRegion !== "undefined" && filtroRegion){
      base = base.filter(s => s.region === filtroRegion);
    }
    if(typeof filtroDistrito !== "undefined" && filtroDistrito){
      base = base.filter(s => s.zona === filtroDistrito);
    }
  }catch(e){}
  return base;
}

function precioDeSenal(modo, senal){
  try{
    const p = senal && typeof senal.precio === "number" ? senal.precio : NaN;
    if(Number.isFinite(p) && p > 0) return p;
    if(typeof window.precioSugeridoPorIcono === "function"){
      return window.precioSugeridoPorIcono(modo, senal ? senal.icono : null);
    }
  }catch(e){}
  return 0;
}

function updateDashboard(){
  if(!dashboardOverlay) return;
  const correo = getSessionEmail();

  const profileName = getProfileName();
  if(dashUserName) dashUserName.textContent = profileName || nombreDesdeCorreo(correo);
  if(dashUserEmail) dashUserEmail.textContent = correo || "";
  if(dashAvatarInitials) dashAvatarInitials.textContent = inicialesDesdeCorreo(correo);

  if(dashEntity){
    if(rolActual === "visitante"){
      dashEntity.textContent = "Entidad: Portal ciudadano";
    } else if(typeof filtroDistrito !== "undefined" && filtroDistrito){
      dashEntity.textContent = "Entidad: Municipalidad de " + filtroDistrito;
    } else {
      dashEntity.textContent = "Entidad: Municipalidad Metropolitana de Lima";
    }
  }

  const horiz = filtrarPorSeleccion(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []);
  const vert = filtrarPorSeleccion(typeof senalesVertical !== "undefined" ? senalesVertical : []);
  const all = horiz.concat(vert);

  const total = all.length;
  const nNueva = all.filter(s => s.estado === "nueva").length;
  const nAntigua = all.filter(s => s.estado === "antigua").length;
  const nSin = all.filter(s => s.estado === "sin_senal").length;

  const score = total ? Math.round(((nNueva * 1.0) + (nAntigua * 0.6) + (nSin * 0.0)) / total * 100) : 0;
  const atencion = nAntigua + nSin;

  // Estimación simple (ajustable) por tipo de señalización
  const inversion = horiz.reduce((sum, s)=> sum + precioDeSenal("horizontal", s), 0)
    + vert.reduce((sum, s)=> sum + precioDeSenal("vertical", s), 0);

  if(dashScore) dashScore.textContent = String(score);
  if(dashTotalSenales) dashTotalSenales.textContent = String(total);
  if(dashAtencion) dashAtencion.textContent = String(atencion);
  if(dashInversion) dashInversion.textContent = formatearMonedaPEN(inversion);
}

window.updateDashboard = updateDashboard;

function abrirDashboard(){
  setDashView("dashboard");
}

function cerrarDashboard(){
  if(!dashboardOverlay) return;
  dashboardOverlay.classList.add("hidden");
  dashboardOverlay.setAttribute("aria-hidden","true");
}

let dashViewActual = "dashboard";
function setDashView(view){
  if(!dashboardOverlay) return;
  if(view === "reportes" && rolActual === "visitante"){
    view = "dashboard";
  }
  dashViewActual = view;
  try{ document.body.classList.add("dash-shell"); }catch(e){}

  dashboardOverlay.classList.remove("hidden");
  dashboardOverlay.setAttribute("aria-hidden","false");

  dashboardOverlay.classList.toggle("dash-mode-mapa", view === "mapa");
  dashboardOverlay.classList.toggle("dash-mode-reportes", view === "reportes");
  try{ repositionMapFloatingControls(); }catch(e){}

  // Activar item del menu
  try{
    dashboardOverlay.querySelectorAll(".dash-link").forEach(btn=>{
      btn.classList.toggle("active", btn.getAttribute("data-dash") === view);
    });
  }catch(e){}

  // Mostrar pagina interna (dashboard/tareas/config)
  try{
    const pages = dashboardOverlay.querySelectorAll("[data-dash-page]");
    pages.forEach(p=>{
      const key = p.getAttribute("data-dash-page");
      const shouldShow = (view === key);
      p.classList.toggle("hidden", !shouldShow);
    });
  }catch(e){}

  if(view === "dashboard"){
    updateDashboard();
  }

  if(view === "tareas"){
    try{
      if(typeof updateReportes === "function"){ updateReportes(); }
    }catch(e){}
  }

  if(view === "mapa"){
    // Cerrar reportes si estaban abiertos
    try{
      if(reportesPanel){
        reportesPanel.classList.add("hidden");
        reportesPanel.classList.remove("mobile-visible");
      }
      const btnDesktop = document.getElementById("btnToggleReportes");
      if(btnDesktop) btnDesktop.textContent = "Ver reportes";
    }catch(e){}

    // Recalcular tamaño del mapa al quedar visible
    setTimeout(()=>{
      try{
        if(typeof map !== "undefined" && map && typeof map.invalidateSize === "function"){
          map.invalidateSize();
        }
      }catch(e){}
    }, 60);
    return;
  }

  if(view === "reportes"){
    try{
      if(typeof updateReportes === "function"){ updateReportes(); }
    }catch(e){}
    // Abrir reportes según viewport
    setTimeout(()=>{
      try{
        if(isMobileViewport()){
          if(reportesPanel){
            reportesPanel.classList.remove("hidden");
            reportesPanel.classList.add("mobile-visible");
            if(reportesSheet){ reportesSheet.style.transform = "translateY(0)"; }
          }
        } else {
          const btnDesktop = document.getElementById("btnToggleReportes");
          if(btnDesktop){
            const willShow = reportesPanel && reportesPanel.classList.contains("hidden");
            if(willShow){
              btnDesktop.click();
            } else {
              // si ya estaba abierto, solo scroll suave al contenedor
              const header = document.querySelector(".topbar");
              const headerH = header ? header.getBoundingClientRect().height : 0;
              const top = reportesPanel.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
              window.scrollTo({top: Math.max(0, top), behavior:"smooth"});
            }
          } else if(reportesPanel){
            reportesPanel.classList.remove("hidden");
            reportesPanel.classList.remove("mobile-visible");
            if(reportesSheet){ reportesSheet.style.transform = ""; }
            const top = reportesPanel.getBoundingClientRect().top + window.pageYOffset - 12;
            window.scrollTo({top: Math.max(0, top), behavior:"smooth"});
          }
        }
      }catch(e){}
    }, 0);
    return;
  }
}
window.setDashView = setDashView;

// Banner de rol en mobile
const mobileBanner = document.createElement("div");
mobileBanner.className = "mobile-banner hidden";
(mapContainer || document.body).appendChild(mobileBanner);

// Inicializar configuracion (tema/valores)
updateConfigUI();

function isMobileViewport(){
  return window.innerWidth <= 900;
}

function hideFABs(){
  if(btnFloatingFilters) btnFloatingFilters.classList.add("fab-hidden");
  if(btnFloatingReport) btnFloatingReport.classList.add("fab-hidden");
  if(btnFloatingLogout) btnFloatingLogout.classList.add("fab-hidden");
}

function showFABs(){
  if(btnFloatingFilters){
    btnFloatingFilters.classList.remove("fab-hidden","offset");
  }
  if(btnFloatingReport){
    btnFloatingReport.classList.remove("fab-hidden","offset");
  }
  if(btnFloatingLogout){
    btnFloatingLogout.classList.remove("fab-hidden","offset");
  }
}

function expandSidebar(){
  if(!sidebar) return;
  sidebar.classList.add("expanded");
  sidebar.scrollTop = 0;
  if(btnFloatingFilters) btnFloatingFilters.classList.add("offset");
  if(btnFloatingReport) btnFloatingReport.classList.add("offset");
  if(btnFloatingLogout) btnFloatingLogout.classList.add("offset");
  if(isMobileViewport()) hideFABs();
}

function collapseSidebar(){
  if(!sidebar) return;
  sidebar.classList.remove("expanded");
  showFABs();
}

function collapseSidebarAfterAction(){
  if(isMobileViewport()){
    collapseSidebar();
  } else {
    showFABs();
  }
}

function updateMobileBanner(){
  if(!mobileBanner) return;
  mobileBanner.textContent = rolActual === "municipal" ? "Vista Municipal" : "Vista Visitante";
  repositionMobileBanner();
  if(isMobileViewport()){
    mobileBanner.classList.remove("hidden");
  } else {
    mobileBanner.classList.add("hidden");
  }
}

updateMobileBanner();
repositionMapFloatingControls();
window.addEventListener("resize", ()=>{
  repositionMapFloatingControls();
  repositionMobileBanner();
  updateMobileBanner();
});

function repositionMobileBanner(){
  if(!mobileBanner) return;
  let offsetTop = 8;
  if(isMobileViewport() && dashboardOverlay && !dashboardOverlay.classList.contains("hidden")){
    if(dashboardOverlay.classList.contains("dash-mode-mapa") || dashboardOverlay.classList.contains("dash-mode-reportes")){
      const dashSide = dashboardOverlay.querySelector(".dash-sidebar");
      if(dashSide){
        offsetTop = Math.max(offsetTop, dashSide.getBoundingClientRect().bottom + 8);
      }
    }
  }
  if(isMobileViewport() && mapFloatingControls){
    const rectControls = mapFloatingControls.getBoundingClientRect();
    offsetTop = Math.max(offsetTop, rectControls.bottom + 8);
  }
  mobileBanner.style.top = offsetTop + "px";
  mobileBanner.style.right = "12px";
}

function repositionMapFloatingControls(){
  if(!mapFloatingControls) return;
  mapFloatingControls.style.top = "";
  if(!isMobileViewport()) return;
  if(!dashboardOverlay || dashboardOverlay.classList.contains("hidden")) return;
  if(!(dashboardOverlay.classList.contains("dash-mode-mapa") || dashboardOverlay.classList.contains("dash-mode-reportes"))) return;
  const dashSide = dashboardOverlay.querySelector(".dash-sidebar");
  if(!dashSide) return;
  const rectSide = dashSide.getBoundingClientRect();
  const nextTop = Math.max(12, rectSide.bottom + 12);
  mapFloatingControls.style.top = nextTop + "px";
}

// Ubicacion actual
if(btnUbicacion){
  btnUbicacion.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      map.setView([lat, lon], 16);
      L.marker([lat, lon]).addTo(map).bindPopup("Tu ubicacion").openPopup();
    });
    collapseSidebarAfterAction();
  });
}

// Cambiar rol
if(btnToggleRol){
  btnToggleRol.addEventListener("click", ()=>{
    const nuevo = rolActual === "municipal" ? "visitante" : "municipal";
    setRol(nuevo);
    guardarSesionRol(nuevo);
    updateMobileBanner();
    if(nuevo === "visitante" && typeof dashViewActual !== "undefined" && dashViewActual === "reportes"){
      setDashView("dashboard");
    }
  });
  // init
  setRol(rolActual);
  updateMobileBanner();
}

function buildNominatimUrl(texto, limit=5){
  return `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_geojson=0&q=${encodeURIComponent(texto)}&limit=${limit}&countrycodes=pe&viewbox=${bboxLima}&bounded=1`;
}

function normalizarTexto(str){
  if(!str) return "";
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function distritosLocales(){
  try{
    const all = Object.values(MAPA_REGIONES || {}).flat();
    return Array.from(new Set(all));
  }catch(e){
    return [];
  }
}
function abrirModalReporte(){
  if(!modalReporte) return;
  modalReporte.classList.remove("hidden");
  pickingReporte = false;
  puntoReporte = null;
  if(infoUbicacion) infoUbicacion.textContent = "Pulsa 'Elegir en mapa' o haz click derecho en el mapa para fijar la ubicacion.";
  try{
    const correo = (function(){
      try{ return localStorage.getItem("correoActual") || ""; }catch(e){ return ""; }
    })();
    if(inputNombreReporte && !inputNombreReporte.value){
      const last = (function(){ try{ return localStorage.getItem("nombreAviso") || ""; }catch(e){ return ""; } })();
      inputNombreReporte.value = last || (correo ? nombreDesdeCorreo(correo) : "");
    }
    if(inputDniReporte && !inputDniReporte.value){
      const lastDni = (function(){ try{ return localStorage.getItem("dniAviso") || ""; }catch(e){ return ""; } })();
      inputDniReporte.value = lastDni || "";
    }
  }catch(e){}
}
function cerrarModalReporte(){
  if(!modalReporte) return;
  modalReporte.classList.add("hidden");
  pickingReporte = false;
  puntoReporte = null;
  inputDescripcion.value = "";
  inputFoto.value = "";
  if(typeof marcadorReporte !== "undefined" && marcadorReporte){
    map.removeLayer(marcadorReporte);
    marcadorReporte = null;
  }
  reabrirModalReporte = false;
}

if(btnReportar){ btnReportar.addEventListener("click", abrirModalReporte); }
if(btnCancelarReporte){ btnCancelarReporte.addEventListener("click", cerrarModalReporte); }
if(btnElegirMapa){
  btnElegirMapa.addEventListener("click", ()=>{
    reabrirModalReporte = true;
    pickingReporte = true;
    if(modalReporte) modalReporte.classList.add("hidden");
  });
}

// Ver foto completa desde popup de aviso
function crearOverlayFoto(){
  if(overlayFoto) return overlayFoto;
  overlayFoto = document.createElement("div");
  overlayFoto.className = "foto-fullscreen hidden";
  const img = document.createElement("img");
  overlayFoto.appendChild(img);
  overlayFoto.addEventListener("click", ()=> {
    overlayFoto.classList.add("hidden");
    overlayFoto.classList.remove("active");
  });
  document.body.appendChild(overlayFoto);
  return overlayFoto;
}

document.addEventListener("click", (e)=>{
  if(e.target && e.target.classList.contains("btnVerFoto")){
    try{ e.preventDefault(); }catch(err){}
    const src = e.target.getAttribute("data-img");
    if(!src) return;
    const ov = crearOverlayFoto();
    const img = ov.querySelector("img");
    img.src = src;
    ov.classList.remove("hidden");
    setTimeout(()=>ov.classList.add("active"),10);
  }
});

if(btnEnviarReporte){
  btnEnviarReporte.addEventListener("click", ()=>{
    if(!puntoReporte){
      alert("Selecciona un punto en el mapa.");
      return;
    }
    const tipo = inputTipoProblema ? inputTipoProblema.value : "otro";
    const desc = inputDescripcion ? inputDescripcion.value.trim() : "";
    const nombre = inputNombreReporte ? inputNombreReporte.value.trim() : "";
    const dni = inputDniReporte ? inputDniReporte.value.trim() : "";
    if(dni && !/^\d{8}$/.test(dni)){
      alert("El DNI debe tener 8 digitos.");
      return;
    }
    const fecha = new Date().toISOString().slice(0,10);

    const nextAvisoId = (Array.isArray(avisos) ? avisos.reduce((m,a)=> Math.max(m, a.id || 0), 0) : 0) + 1;
    const selRegionEl = document.getElementById("selectRegion");
    const selDistritoEl = document.getElementById("selectDistrito");
    const region = selRegionEl ? selRegionEl.value : "";
    const distrito = selDistritoEl ? selDistritoEl.value : "";

    const correoActual = (function(){
      try{ return localStorage.getItem("correoActual") || ""; }catch(e){ return ""; }
    })();
    const usuario = correoActual ? (correoActual.split("@")[0] || correoActual) : "anonimo";

    const aviso = {
      id: nextAvisoId,
      tipo,
      descripcion: desc || "Sin descripcion",
      estado: "pendiente",
      fecha,
      lat: puntoReporte.lat,
      lng: puntoReporte.lng,
      foto: null,
      region: region || "",
      distrito: distrito || "",
      usuario: usuario,
      usuarioEmail: correoActual || "",
      usuarioNombre: nombre || (correoActual ? nombreDesdeCorreo(correoActual) : ""),
      usuarioDni: dni || ""
    };

    try{
      if(nombre) localStorage.setItem("nombreAviso", nombre);
      if(dni) localStorage.setItem("dniAviso", dni);
    }catch(e){}

    if(inputFoto && inputFoto.files && inputFoto.files[0]){
      const file = inputFoto.files[0];
      const reader = new FileReader();
      reader.onload = function(e){
        aviso.foto = e.target.result;
        agregarAviso(aviso);
        cerrarModalReporte();
      };
      reader.readAsDataURL(file);
    } else {
      agregarAviso(aviso);
      cerrarModalReporte();
    }
  });
}

// Login
function detectarRolPorCorreo(correo){
  const low = correo.toLowerCase();
  if(low.includes("gob") || low.includes("muni") || low.endsWith(".gob.pe")) return "municipal";
  return "visitante";
}

const MUNICIPAL_ACCOUNTS = [
  { email: "sanisidro@muni.gob.pe", pass: "Muni123!", distrito: "San Isidro" },
  { email: "miraflores@muni.gob.pe", pass: "Muni123!", distrito: "Miraflores" },
  { email: "jesusmaria@muni.gob.pe", pass: "Muni123!", distrito: "Jesus Maria" },
  // Municipalidad metropolitana (sin alcance fijo)
  { email: "muni@muni.gob.pe", pass: "Muni123!", distrito: "" }
];

const VISITANTE_ACCOUNT = { email:"visitante@correo.com", pass:"Visitante123" };

const LS_SCOPE_REGION = "urbbisScopeRegion";
const LS_SCOPE_DISTRITO = "urbbisScopeDistrito";

function normalizarCorreo(correo){
  return String(correo || "").trim().toLowerCase();
}

function buscarCuentaMunicipal(correo){
  const low = normalizarCorreo(correo);
  return MUNICIPAL_ACCOUNTS.find(a => normalizarCorreo(a.email) === low) || null;
}

function obtenerScopePorCorreo(correo){
  const acc = buscarCuentaMunicipal(correo);
  if(acc && acc.distrito){
    const region = (typeof regionPorDistrito === "function") ? (regionPorDistrito(acc.distrito) || "") : "";
    return { region, distrito: acc.distrito };
  }
  return { region:"", distrito:"" };
}

function guardarSesionScope(region, distrito){
  try{
    localStorage.setItem(LS_SCOPE_REGION, region || "");
    localStorage.setItem(LS_SCOPE_DISTRITO, distrito || "");
  }catch(e){}
}

function cargarSesionScope(){
  try{
    return {
      region: localStorage.getItem(LS_SCOPE_REGION) || "",
      distrito: localStorage.getItem(LS_SCOPE_DISTRITO) || ""
    };
  }catch(e){
    return { region:"", distrito:"" };
  }
}

function limpiarSesionScope(){
  try{
    localStorage.removeItem(LS_SCOPE_REGION);
    localStorage.removeItem(LS_SCOPE_DISTRITO);
  }catch(e){}
}

function guardarSesionRol(rol){
  try{
    localStorage.setItem("rolActual", rol);
    if(inputCorreo && inputCorreo.value) localStorage.setItem("correoActual", inputCorreo.value);
  }catch(e){}
}

function cargarSesionRol(){
  try{
    const rol = localStorage.getItem("rolActual");
    const correo = localStorage.getItem("correoActual");
    if(correo && inputCorreo) inputCorreo.value = correo;
    if(rol){
      setRol(rol);
      // Aplicar alcance guardado o inferido por correo (para cuentas municipales por distrito)
      try{
        const scopeSaved = cargarSesionScope();
        const scope = (scopeSaved && (scopeSaved.region || scopeSaved.distrito)) ? scopeSaved : obtenerScopePorCorreo(correo || "");
        if(typeof setScopeGeografico === "function"){
          setScopeGeografico(scope.region || "", scope.distrito || "");
        }
      }catch(e){}
      updateMobileBanner();
      if(loginOverlay) loginOverlay.classList.add("hidden");
      try{ document.body.classList.add("dash-shell"); }catch(e){}
      abrirDashboard();
      return;
    }
  }catch(e){}
}

if(formLogin){
  formLogin.addEventListener("submit",(e)=>{
    e.preventDefault();
    const correo = inputCorreo ? inputCorreo.value.trim() : "";
    const clave = inputClave ? inputClave.value : "";
    if(!correo || !clave) return;

    const low = normalizarCorreo(correo);
    const cuentaMunicipal = buscarCuentaMunicipal(low);
    const esVisitanteDemo = (low === normalizarCorreo(VISITANTE_ACCOUNT.email));

    let rol = null;
    let scope = { region:"", distrito:"" };

    // Si el correo corresponde a una cuenta demo, validar clave
    if(cuentaMunicipal){
      if(clave !== cuentaMunicipal.pass){
        alert("Contraseña incorrecta.");
        return;
      }
      rol = "municipal";
      if(cuentaMunicipal.distrito){
        scope = obtenerScopePorCorreo(correo);
      }
    } else if(esVisitanteDemo){
      if(clave !== VISITANTE_ACCOUNT.pass){
        alert("Contraseña incorrecta.");
        return;
      }
      rol = "visitante";
    } else {
      // Modo demo: permitir acceso, rol inferido por correo
      rol = detectarRolPorCorreo(correo);
      // Si cae en municipal y el correo coincide con una cuenta por distrito, aplicar scope
      if(rol === "municipal"){
        scope = obtenerScopePorCorreo(correo);
      }
    }

    setRol(rol);
    guardarSesionRol(rol);
    guardarSesionScope(scope.region || "", scope.distrito || "");
    try{
      if(typeof setScopeGeografico === "function"){
        setScopeGeografico(scope.region || "", scope.distrito || "");
      }
    }catch(e){}
    if(loginOverlay) loginOverlay.classList.add("hidden");
    updateMobileBanner();
    try{ document.body.classList.add("dash-shell"); }catch(e){}
    abrirDashboard();
  });
}

// Inicializar sesión si existe
cargarSesionRol();

// Logout
function ejecutarLogout(){
  try{
    localStorage.removeItem("rolActual");
    localStorage.removeItem("correoActual");
    limpiarSesionScope();
  }catch(e){}
  try{
    if(typeof setScopeGeografico === "function"){
      setScopeGeografico("", "");
    }
  }catch(e){}
  setRol("visitante");
  updateMobileBanner();
  cerrarDashboard();
  try{ document.body.classList.remove("dash-shell"); }catch(e){}
  if(loginOverlay) loginOverlay.classList.remove("hidden");
  if(inputCorreo) inputCorreo.value="";
  if(inputClave) inputClave.value="";
  if(reportesPanel){
    reportesPanel.classList.add("hidden");
    reportesPanel.classList.remove("mobile-visible");
  }
  collapseSidebar();
  showFABs();
}

if(btnLogout){
  btnLogout.addEventListener("click", ejecutarLogout);
}
if(btnFloatingLogout){
  btnFloatingLogout.addEventListener("click", ejecutarLogout);
}
if(btnDashLogout){
  btnDashLogout.addEventListener("click", ejecutarLogout);
}

// Navegación dashboard
if(dashboardOverlay){
  dashboardOverlay.addEventListener("click", (e)=>{
    const btn = e.target && e.target.closest ? e.target.closest("[data-dash],[data-dash-go]") : null;
    if(!btn) return;

    const go = btn.getAttribute("data-dash-go");
    const key = go || btn.getAttribute("data-dash");
    if(!key) return;

    // Marcar activo en menú solo si es un link del menú
    if(btn.classList.contains("dash-link")){
      dashboardOverlay.querySelectorAll(".dash-link").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    }

    setDashView(key);
  });
}

// Acciones configuracion
if(btnCfgGuardarPerfil){
  btnCfgGuardarPerfil.addEventListener("click", ()=>{
    const name = cfgNombre ? cfgNombre.value.trim() : "";
    updateAndPersistConfig({ profileName: name });
    alert("Configuracion guardada.");
  });
}
if(cfgTemaOscuro){
  cfgTemaOscuro.addEventListener("change", ()=>{
    updateAndPersistConfig({ temaOscuro: !!cfgTemaOscuro.checked });
  });
}
if(cfgAnimaciones){
  cfgAnimaciones.addEventListener("change", ()=>{
    updateAndPersistConfig({ animaciones: !!cfgAnimaciones.checked });
  });
}
if(cfgNotificaciones){
  cfgNotificaciones.addEventListener("change", ()=>{
    updateAndPersistConfig({ notificaciones: !!cfgNotificaciones.checked });
  });
}
if(cfgZoomInicial){
  cfgZoomInicial.addEventListener("change", ()=>{
    const v = parseInt(cfgZoomInicial.value, 10);
    if(Number.isFinite(v)){
      updateAndPersistConfig({ zoomInicial: Math.max(10, Math.min(19, v)) });
    }
  });
}
if(cfgAnimDur){
  cfgAnimDur.addEventListener("change", ()=>{
    const v = parseFloat(cfgAnimDur.value);
    if(Number.isFinite(v)){
      updateAndPersistConfig({ animDur: Math.max(0, Math.min(3, v)) });
    }
  });
}
if(btnCfgIrALima){
  btnCfgIrALima.addEventListener("click", ()=>{
    try{
      const cfg = loadUrbbisConfig();
      const zoom = Number.isFinite(cfg.zoomInicial) ? cfg.zoomInicial : 13;
      const dur = Number.isFinite(cfg.animDur) ? cfg.animDur : 0.8;
      if(typeof map !== "undefined" && map && typeof map.flyTo === "function"){
        map.flyTo([-12.0464, -77.0428], zoom, { duration: dur, easeLinearity: 0.25 });
      }
      setDashView("mapa");
    }catch(e){}
  });
}

function descargarJSON(nombreArchivo, dataObj){
  try{
    const json = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 2000);
  }catch(e){
    alert("No se pudo exportar.");
  }
}

if(btnCfgExportar){
  btnCfgExportar.addEventListener("click", ()=>{
    const now = new Date();
    const stamp = now.toISOString().slice(0,10).replace(/-/g,"");
    const payload = {
      app: "Urbbis",
      version: 1,
      exportedAt: now.toISOString(),
      config: loadUrbbisConfig(),
      senalesHorizontal: typeof senalesHorizontal !== "undefined" ? senalesHorizontal : [],
      senalesVertical: typeof senalesVertical !== "undefined" ? senalesVertical : [],
      avisos: typeof avisos !== "undefined" ? avisos : [],
      historialSenales: (typeof historialSenales !== "undefined" && Array.isArray(historialSenales)) ? historialSenales : []
    };
    descargarJSON("urbbis-datos-" + stamp + ".json", payload);
  });
}

if(cfgImportar){
  cfgImportar.addEventListener("change", ()=>{
    const file = cfgImportar.files && cfgImportar.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try{
        const text = String(ev.target.result || "");
        const parsed = JSON.parse(text);
        if(!parsed || typeof parsed !== "object") throw new Error("Formato invalido");

        const h = Array.isArray(parsed.senalesHorizontal) ? parsed.senalesHorizontal : null;
        const v = Array.isArray(parsed.senalesVertical) ? parsed.senalesVertical : null;
        const a = Array.isArray(parsed.avisos) ? parsed.avisos : null;
        const hist = Array.isArray(parsed.historialSenales) ? parsed.historialSenales : null;

        if(h && typeof senalesHorizontal !== "undefined"){
          senalesHorizontal.splice(0, senalesHorizontal.length, ...h);
        }
        if(v && typeof senalesVertical !== "undefined"){
          senalesVertical.splice(0, senalesVertical.length, ...v);
        }
        if(a && typeof avisos !== "undefined"){
          avisos = a;
          try{
            if(typeof renderAvisos === "function"){ renderAvisos(); }
          }catch(e){}
        }

        if(hist && typeof historialSenales !== "undefined" && Array.isArray(historialSenales)){
          historialSenales.splice(0, historialSenales.length, ...hist);
          try{
            const maxId = historialSenales.reduce((m,it)=> Math.max(m, Number(it && it.id) || 0), 0);
            if(typeof historialSenalesSeq !== "undefined"){
              historialSenalesSeq = Math.max(historialSenalesSeq || 1, maxId + 1);
            }
          }catch(e){}
        }

        if(parsed.config && typeof parsed.config === "object"){
          updateAndPersistConfig(parsed.config);
        }

        try{
          if(typeof aplicarFiltros === "function"){ aplicarFiltros(); }
          if(typeof updateReportes === "function"){ updateReportes(); }
        }catch(e){}

        alert("Datos importados correctamente.");
      }catch(err){
        alert("Archivo JSON invalido.");
      }finally{
        cfgImportar.value = "";
      }
    };
    reader.readAsText(file);
  });
}

// Abrir dashboard al hacer click en la marca (opcional)
const brandEl = document.querySelector(".topbar .brand");
if(brandEl){
  brandEl.style.cursor = "pointer";
  brandEl.addEventListener("click", ()=>{
    if(loginOverlay && !loginOverlay.classList.contains("hidden")) return;
    abrirDashboard();
  });
}

// Acciones flotantes (desktop y mobile)
if(btnMapVisualizacion){
  btnMapVisualizacion.addEventListener("click", ()=>{
    const open = visualizacionPanel ? visualizacionPanel.classList.contains("hidden") : false;
    if(!visualizacionPanel) return;
    if(open){
      visualizacionPanel.classList.remove("hidden");
      btnMapVisualizacion.classList.add("active");
      if(metradoPanel) metradoPanel.classList.add("hidden");
      if(btnMapMetrado) btnMapMetrado.classList.remove("active");
    } else {
      visualizacionPanel.classList.add("hidden");
      btnMapVisualizacion.classList.remove("active");
      if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
    }
  });
}
if(btnMapMetrado){
  btnMapMetrado.addEventListener("click", ()=>{
    if(!metradoPanel) return;
    const open = metradoPanel.classList.contains("hidden");
    if(open){
      metradoPanel.classList.remove("hidden");
      btnMapMetrado.classList.add("active");
      if(visualizacionPanel) visualizacionPanel.classList.add("hidden");
      if(btnMapVisualizacion) btnMapVisualizacion.classList.remove("active");
      if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
      actualizarResultadosMetrado();
    } else {
      metradoPanel.classList.add("hidden");
      btnMapMetrado.classList.remove("active");
      metradoPicking = "";
      mostrarRegistroHint("");
      ocultarMetradoPreview();
    }
  });
}
if(btnMapAgregar){
  btnMapAgregar.addEventListener("click", ()=>{
    if(rolActual === "visitante"){
      try{ abrirModalReporte(); }catch(e){}
      return;
    }
    if(metradoPanel) metradoPanel.classList.add("hidden");
    if(btnMapMetrado) btnMapMetrado.classList.remove("active");
    metradoPicking = "";
    abrirRegistroPicker();
  });
}

// Picker "¿Qué deseas registrar?"
if(registroPicker){
  try{
    const opciones = registroPicker.querySelectorAll(".registro-picker-option[data-registro-tipo]");
    opciones.forEach((btn)=>{
      btn.addEventListener("click", ()=>{
        const tipo = btn.getAttribute("data-registro-tipo") || "";
        if(!tipo) return;
        if(tipo === "marcas"){
          setRegistroPickerStep("marcas");
          return;
        }
        iniciarSeleccionUbicacion(tipo);
      });
    });

    const opcionesMarcas = registroPicker.querySelectorAll(".registro-picker-option[data-registro-marcas]");
    opcionesMarcas.forEach((btn)=>{
      btn.addEventListener("click", (e)=>{
        try{ e.preventDefault(); }catch(err){}
        try{ e.stopPropagation(); }catch(err){}
        const sub = btn.getAttribute("data-registro-marcas") || "";
        if(sub === "pintado"){
          abrirMetradoPanel();
          return;
        }
        if(sub === "senalizacion"){
          iniciarSeleccionUbicacion("marcas");
          return;
        }
      });
    });

    registroPicker.addEventListener("click", (e)=>{
      if(e && e.target === registroPicker){
        cerrarRegistroPicker();
        mostrarRegistroHint("");
      }
    });
  }catch(e){}
}
if(btnRegistroCancelar){
  btnRegistroCancelar.addEventListener("click", ()=>{
    cerrarRegistroPicker();
    mostrarRegistroHint("");
  });
}
if(btnRegistroBack){
  btnRegistroBack.addEventListener("click", ()=>{
    setRegistroPickerStep("main");
  });
}

function hoyISO(){
  try{ return new Date().toISOString().slice(0,10); }catch(e){ return ""; }
}

function capitalizar(str){
  const s = String(str || "");
  if(!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function estadoFisicoAEstado(valor){
  if(valor === "deteriorada") return "antigua";
  if(valor === "no_operativa") return "sin_senal";
  return "nueva";
}

function iconosParaRegistro(tipo){
  try{
    if(typeof ICONOS === "undefined" || !ICONOS) return [];
    if(tipo === "transito") return ICONOS.vertical || [];
    if(tipo === "marcas") return ICONOS.horizontal || [];
  }catch(e){}
  return [];
}

function filtrarIconos(list, query, categoria){
  let base = Array.isArray(list) ? list.slice() : [];
  const q = normalizarTexto(query || "");
  const cat = String(categoria || "");
  if(cat){
    base = base.filter(i => String((i && i.categoria) ? i.categoria : "") === cat);
  }
  if(q){
    base = base.filter(i=>{
      const hay = normalizarTexto((i && i.label ? i.label : "") + " " + (i && i.id ? i.id : ""));
      return hay.includes(q);
    });
  }
  return base;
}

function renderIconGridHtml(list, selectedId){
  return (list || []).map(function(i){
    const active = selectedId && i.id === selectedId ? " active" : "";
    return ''
      + '<button type="button" class="icon-option' + active + '" data-icon="' + i.id + '">'
      +   '<span class="icon-thumb" style="background-image:url(\'' + i.src + '\')"></span>'
      +   '<small>' + (i.label || i.id) + '</small>'
      + '</button>';
  }).join("");
}

function abrirRegistroPanel(tipo){
  if(!registroPanel) return;

  const fecha = hoyISO();
  registroDraft = {
    tipo,
    fecha,
    estadoFisico: "operativa",
    categoria: "",
    icono: "",
    ancho: "",
    largo: "",
    lamina: "I",
    soporte: "si",
    inspeccionFoto: null,
    nombre: "",
    descripcion: "",
    eventoTipo: "falta"
  };

  const titleMap = {
    transito: "Se&ntilde;ales de tr&aacute;nsito",
    marcas: "Marcas viales",
    mobiliario: "Mobiliario vial",
    eventos: "Eventos"
  };
  const iconClassMap = {
    transito: "registro-opt-icon--transito",
    marcas: "registro-opt-icon--marcas",
    mobiliario: "registro-opt-icon--mobiliario",
    eventos: "registro-opt-icon--eventos"
  };
  const titleHtml = titleMap[tipo] || "Registro";
  const iconClass = iconClassMap[tipo] || "registro-opt-icon--eventos";

  function fieldFecha(label){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">' + label + '</div>'
      +   '<input id="regFecha" type="date" class="registro-input" value="' + fecha + '">'
      + '</div>';
  }

  function fieldEstadoFisico(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">Estado f&iacute;sico</div>'
      +   '<div class="registro-pill-row" id="regEstadoFisico">'
      +     '<button type="button" class="registro-pill registro-pill--ok active" data-estado-fisico="operativa">Operativa</button>'
      +     '<button type="button" class="registro-pill registro-pill--warn" data-estado-fisico="deteriorada">Deteriorada</button>'
      +     '<button type="button" class="registro-pill registro-pill--bad" data-estado-fisico="no_operativa">No operativa <span class="registro-pill-sub">(Ausente)</span></button>'
      +   '</div>'
      + '</div>';
  }

  function fieldInspeccion(label){
    return ''
      + '<div class="registro-field registro-upload">'
      +   '<div class="registro-label">' + label + '</div>'
      +   '<label class="registro-upload-btn">'
      +     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%230c426a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
      +     '<span id="regUploadLabel">Seleccionar imagen</span>'
      +     '<input id="regFoto" type="file" accept="image/*" style="display:none">'
      +   '</label>'
      +   '<div class="registro-help">Si no se adjunta imagen, quedar&aacute; como no verificada.</div>'
      + '</div>';
  }

  function fieldDimensiones(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">Dimensiones (cm)</div>'
      +   '<div class="registro-dim-row">'
      +     '<input id="regAncho" type="number" class="registro-input" placeholder="Ancho" min="0" step="1">'
      +     '<div class="registro-dim-x">x</div>'
      +     '<input id="regLargo" type="number" class="registro-input" placeholder="Largo" min="0" step="1">'
      +   '</div>'
      + '</div>';
  }

  function fieldDimensionesM2(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">Dimensiones (m)</div>'
      +   '<div class="registro-dim-row">'
      +     '<input id="regAncho" type="number" class="registro-input" placeholder="Ancho" min="0" step="0.01" inputmode="decimal">'
      +     '<div class="registro-dim-x">x</div>'
      +     '<input id="regLargo" type="number" class="registro-input" placeholder="Alto" min="0" step="0.01" inputmode="decimal">'
      +   '</div>'
      +   '<div class="registro-area-row">'
      +     '<span>&Aacute;rea</span>'
      +     '<strong id="regAreaM2">-</strong>'
      +   '</div>'
      + '</div>';
  }

  function fieldLaminaSoporte(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-pill-row">'
      +     '<div class="registro-label" style="min-width:140px">Tipo de l&aacute;mina</div>'
      +     '<button type="button" class="registro-pill active" data-lamina="I">I</button>'
      +     '<button type="button" class="registro-pill" data-lamina="IV">IV</button>'
      +     '<button type="button" class="registro-pill" data-lamina="XI">XI</button>'
      +   '</div>'
      + '</div>'
      + '<div class="registro-field">'
      +   '<div class="registro-pill-row">'
      +     '<div class="registro-label" style="min-width:140px">Soporte</div>'
      +     '<button type="button" class="registro-pill active" data-soporte="si">S&iacute;</button>'
      +     '<button type="button" class="registro-pill" data-soporte="no">No</button>'
      +   '</div>'
      + '</div>';
  }

  function fieldIconos(modoLabel){
    const list = iconosParaRegistro(tipo);
    const isTransito = (tipo === "transito");
    const html = isTransito ? "" : renderIconGridHtml(list, "");
    const cats = isTransito
      ? ''
        + '<div class="registro-cat-grid" id="regCats">'
        +   '<button type="button" class="registro-cat" data-cat="preventiva"><span class="registro-cat-icon registro-cat-icon--preventiva" aria-hidden="true"></span>Preventiva</button>'
        +   '<button type="button" class="registro-cat" data-cat="reglamentaria"><span class="registro-cat-icon registro-cat-icon--reglamentaria" aria-hidden="true"></span>Reglamentaria</button>'
        +   '<button type="button" class="registro-cat" data-cat="informativa"><span class="registro-cat-icon registro-cat-icon--informativa" aria-hidden="true"></span>Informativa</button>'
        + '</div>'
      : '';

    const hiddenClass = isTransito ? " hidden" : "";
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">' + modoLabel + '</div>'
      +   cats
      +   '<input id="regIconSearch" type="text" class="registro-input' + hiddenClass + '" placeholder="Buscar...">'
      +   '<div class="icon-grid' + hiddenClass + '" id="regIconGrid">' + html + '</div>'
      + '</div>';
  }

  function fieldEvento(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">Tipo de evento</div>'
      +   '<select id="regEventoTipo" class="registro-input">'
      +     '<option value="falta">Falta de se&ntilde;al</option>'
      +     '<option value="danada">Se&ntilde;al da&ntilde;ada</option>'
      +     '<option value="otro">Otro</option>'
      +   '</select>'
      + '</div>'
      + '<div class="registro-field">'
      +   '<div class="registro-label">Descripci&oacute;n</div>'
      +   '<input id="regEventoDesc" type="text" class="registro-input" placeholder="Describe el problema...">'
      + '</div>'
      + fieldInspeccion("Imagen");
  }

  function fieldNombreMobiliario(){
    return ''
      + '<div class="registro-field">'
      +   '<div class="registro-label">Nombre / tipo</div>'
      +   '<input id="regNombre" type="text" class="registro-input" placeholder="Ej: Bolardo, sem&aacute;foro, etc.">'
      + '</div>';
  }

  let bodyHtml = "";
  if(tipo === "transito"){
    bodyHtml = fieldFecha("Fecha de instalaci&oacute;n")
      + fieldIconos("Tipo de se&ntilde;al")
      + fieldDimensiones()
      + fieldLaminaSoporte()
      + fieldEstadoFisico()
      + fieldInspeccion("Inspecci&oacute;n");
  } else if(tipo === "marcas"){
    bodyHtml = fieldFecha("Fecha de instalaci&oacute;n")
      + fieldIconos("Tipo de marca")
      + fieldDimensionesM2()
      + fieldEstadoFisico()
      + fieldInspeccion("Inspecci&oacute;n");
  } else if(tipo === "mobiliario"){
    bodyHtml = fieldFecha("Fecha de instalaci&oacute;n")
      + fieldNombreMobiliario()
      + fieldEstadoFisico()
      + fieldInspeccion("Inspecci&oacute;n");
  } else if(tipo === "eventos"){
    bodyHtml = fieldFecha("Fecha")
      + fieldEvento();
  }

  registroPanel.innerHTML = ''
    + '<div class="registro-panel-head">'
    +   '<div class="registro-panel-title"><span class="registro-opt-icon ' + iconClass + '" aria-hidden="true"></span>' + titleHtml + '</div>'
    +   '<button type="button" class="registro-panel-close" id="btnRegistroPanelClose">&times;</button>'
    + '</div>'
    + '<div class="registro-panel-body">'
    +   bodyHtml
    +   '<button type="button" class="registro-submit" id="btnRegistroSubmit" disabled>Registrar</button>'
    + '</div>';

  registroPanel.classList.remove("hidden");
  registroPanel.setAttribute("aria-hidden","false");
  mostrarRegistroHint("");

  bindRegistroPanelInteractions(tipo);
}

function actualizarEstadoSubmitRegistro(){
  const btn = registroPanel ? registroPanel.querySelector("#btnRegistroSubmit") : null;
  if(!btn) return;
  if(!registroDraft || !registroLatLng){
    btn.disabled = true;
    return;
  }
  if(registroDraft.tipo === "eventos"){
    btn.disabled = false;
    return;
  }
  if(registroDraft.tipo === "mobiliario"){
    btn.disabled = !registroDraft.nombre;
    return;
  }
  // transito / marcas
  btn.disabled = !registroDraft.icono;
}

function bindRegistroPanelInteractions(tipo){
  if(!registroPanel) return;

  const btnClose = registroPanel.querySelector("#btnRegistroPanelClose");
  if(btnClose){
    btnClose.addEventListener("click", cerrarRegistroPanel);
  }

  const inFecha = registroPanel.querySelector("#regFecha");
  if(inFecha){
    inFecha.addEventListener("change", ()=>{ if(registroDraft) registroDraft.fecha = inFecha.value || ""; });
  }

  const inNombre = registroPanel.querySelector("#regNombre");
  if(inNombre){
    inNombre.addEventListener("input", ()=>{
      if(registroDraft) registroDraft.nombre = (inNombre.value || "").trim();
      actualizarEstadoSubmitRegistro();
    });
  }

  const inDesc = registroPanel.querySelector("#regEventoDesc");
  if(inDesc){
    inDesc.addEventListener("input", ()=>{ if(registroDraft) registroDraft.descripcion = (inDesc.value || "").trim(); });
  }

  const selEvento = registroPanel.querySelector("#regEventoTipo");
  if(selEvento){
    selEvento.addEventListener("change", ()=>{ if(registroDraft) registroDraft.eventoTipo = selEvento.value || "falta"; });
  }

  // Estado f¡sico
  const estadoWrap = registroPanel.querySelector("#regEstadoFisico");
  if(estadoWrap){
    estadoWrap.addEventListener("click", (e)=>{
      const b = e.target && e.target.closest ? e.target.closest("[data-estado-fisico]") : null;
      if(!b || !registroDraft) return;
      const val = b.getAttribute("data-estado-fisico") || "operativa";
      registroDraft.estadoFisico = val;
      estadoWrap.querySelectorAll(".registro-pill").forEach(p=>p.classList.remove("active"));
      b.classList.add("active");
    });
  }

  // Lamina / soporte
  registroPanel.addEventListener("click", (e)=>{
    if(!registroDraft) return;
    const lam = e.target && e.target.closest ? e.target.closest("[data-lamina]") : null;
    if(lam){
      registroDraft.lamina = lam.getAttribute("data-lamina") || "I";
      const row = lam.parentElement;
      if(row) row.querySelectorAll("[data-lamina]").forEach(p=>p.classList.remove("active"));
      lam.classList.add("active");
      return;
    }
    const sop = e.target && e.target.closest ? e.target.closest("[data-soporte]") : null;
    if(sop){
      registroDraft.soporte = sop.getAttribute("data-soporte") || "si";
      const row = sop.parentElement;
      if(row) row.querySelectorAll("[data-soporte]").forEach(p=>p.classList.remove("active"));
      sop.classList.add("active");
      return;
    }
  });

  // Dimensiones
  const inAncho = registroPanel.querySelector("#regAncho");
  const inLargo = registroPanel.querySelector("#regLargo");
  const outArea = registroPanel.querySelector("#regAreaM2");
  function actualizarAreaM2(){
    if(!outArea) return;
    const a = inAncho ? Number(inAncho.value) : NaN;
    const b = inLargo ? Number(inLargo.value) : NaN;
    if(!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0){
      outArea.textContent = "-";
      if(registroDraft) registroDraft.area_m2 = null;
      return;
    }
    const area = a * b;
    outArea.textContent = area.toFixed(2) + " m\u00B2";
    if(registroDraft) registroDraft.area_m2 = area;
  }
  if(inAncho){
    inAncho.addEventListener("input", ()=>{
      if(registroDraft) registroDraft.ancho = inAncho.value || "";
      actualizarAreaM2();
    });
  }
  if(inLargo){
    inLargo.addEventListener("input", ()=>{
      if(registroDraft) registroDraft.largo = inLargo.value || "";
      actualizarAreaM2();
    });
  }
  actualizarAreaM2();

  // Foto
  const inFoto = registroPanel.querySelector("#regFoto");
  const label = registroPanel.querySelector("#regUploadLabel");
  if(inFoto){
    inFoto.addEventListener("change", ()=>{
      if(!registroDraft) return;
      if(inFoto.files && inFoto.files[0]){
        const file = inFoto.files[0];
        if(label) label.textContent = file.name.length > 22 ? (file.name.slice(0,19) + "...") : file.name;
        const reader = new FileReader();
        reader.onload = function(ev){
          registroDraft.inspeccionFoto = ev.target && ev.target.result ? ev.target.result : null;
        };
        reader.readAsDataURL(file);
      } else {
        registroDraft.inspeccionFoto = null;
        if(label) label.textContent = "Seleccionar imagen";
      }
    });
  }

  // Categor¡as (transito)
  const cats = registroPanel.querySelector("#regCats");
  if(cats){
    cats.addEventListener("click",(e)=>{
      const b = e.target && e.target.closest ? e.target.closest("[data-cat]") : null;
      if(!b || !registroDraft) return;
      registroDraft.categoria = b.getAttribute("data-cat") || "";
      registroDraft.icono = "";
      cats.querySelectorAll(".registro-cat").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      if(inputSearch){
        inputSearch.classList.remove("hidden");
        inputSearch.value = "";
        try{ inputSearch.focus(); }catch(err){}
      }
      if(grid){
        grid.classList.remove("hidden");
        try{ grid.scrollTop = 0; }catch(err){}
      }
      actualizarIconGrid();
      actualizarEstadoSubmitRegistro();
    });
  }

  // Iconos + buscador
  const inputSearch = registroPanel.querySelector("#regIconSearch");
  const grid = registroPanel.querySelector("#regIconGrid");
  function actualizarIconGrid(){
    if(!grid) return;
    const all = iconosParaRegistro(tipo);
    const filtered = filtrarIconos(all, inputSearch ? inputSearch.value : "", registroDraft ? registroDraft.categoria : "");
    grid.innerHTML = renderIconGridHtml(filtered, registroDraft ? registroDraft.icono : "");
  }
  if(inputSearch){
    inputSearch.addEventListener("input", actualizarIconGrid);
  }
  if(grid){
    grid.addEventListener("click",(e)=>{
      const btn = e.target && e.target.closest ? e.target.closest(".icon-option") : null;
      if(!btn || !registroDraft) return;
      const id = btn.getAttribute("data-icon") || "";
      registroDraft.icono = id;
      grid.querySelectorAll(".icon-option").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      actualizarEstadoSubmitRegistro();
    });
  }

  // Submit
  const btnSubmit = registroPanel.querySelector("#btnRegistroSubmit");
  if(btnSubmit){
    btnSubmit.addEventListener("click", registrarRegistroDraft);
  }

  actualizarEstadoSubmitRegistro();
}

async function registrarRegistroDraft(){
  if(!registroDraft || !registroLatLng) return;
  const tipo = registroDraft.tipo;

  try{
    // Eventos
    if(tipo === "eventos"){
      const nextAvisoId = (Array.isArray(avisos) ? avisos.reduce((m,a)=> Math.max(m, a.id || 0), 0) : 0) + 1;
      const fecha = registroDraft.fecha || hoyISO();
      const distrito = (typeof inferirDistritoPorLatLng === "function")
        ? (await inferirDistritoPorLatLng(registroLatLng.lat, registroLatLng.lng))
        : "";
      const region = (typeof regionPorDistrito === "function") ? (regionPorDistrito(distrito || "") || "") : "";
      const aviso = {
        id: nextAvisoId,
        tipo: registroDraft.eventoTipo || "otro",
        descripcion: registroDraft.descripcion || "Sin descripcion",
        estado: "pendiente",
        fecha,
        lat: registroLatLng.lat,
        lng: registroLatLng.lng,
        foto: registroDraft.inspeccionFoto || null,
        region: region || "",
        distrito: distrito || "",
        usuario: "municipal",
        usuarioEmail: "",
        usuarioNombre: "Municipalidad",
        usuarioDni: ""
      };
      if(typeof agregarAviso === "function"){ agregarAviso(aviso); }
      cerrarRegistroPanel();
      return;
    }

    // Mobiliario vial (dataset propio)
    if(tipo === "mobiliario"){
      const mob = (typeof senalesMobiliario !== "undefined" && Array.isArray(senalesMobiliario)) ? senalesMobiliario : [];
      const nextId = mob.reduce((m,s)=> Math.max(m, s.id || 0), 0) + 1;
      const fecha = registroDraft.fecha || hoyISO();
      const estado = estadoFisicoAEstado(registroDraft.estadoFisico);
      const distrito = (typeof inferirDistritoPorLatLng === "function")
        ? (await inferirDistritoPorLatLng(registroLatLng.lat, registroLatLng.lng))
        : "Sin distrito";
      const region = (typeof regionPorDistrito === "function") ? (regionPorDistrito(distrito || "") || "Sin region") : "Sin region";
      mob.push({
        id: nextId,
        tipo: "MOBILIARIO",
        nombre: registroDraft.nombre || "Mobiliario",
        estado,
        region,
        zona: distrito,
        lat: registroLatLng.lat,
        lng: registroLatLng.lng,
        icono: "mobiliario",
        fecha_colocacion: fecha,
        inspeccionFoto: registroDraft.inspeccionFoto || null
      });
      if(typeof renderizarTodo === "function"){ renderizarTodo(); }
      if(typeof updateReportes === "function"){ updateReportes(); }
      cerrarRegistroPanel();
      return;
    }

    // Se¤ales / Marcas -> reusa crearSenal
    const modo = (tipo === "transito") ? "vertical" : "horizontal";
    setModoCreacion(modo);
    const estado = estadoFisicoAEstado(registroDraft.estadoFisico);
    const fecha = registroDraft.fecha || hoyISO();
    const icono = registroDraft.icono || "";

    if(typeof crearSenal === "function"){
      const nueva = crearSenal(registroLatLng.lat, registroLatLng.lng, estado, icono, fecha, undefined, {
        tipo: registroDraft.categoria ? capitalizar(registroDraft.categoria) : (tipo === "transito" ? "Senal" : "Marca"),
        nombre: (function(){
          try{
            const list = (modo === "vertical" ? (ICONOS.vertical || []) : (ICONOS.horizontal || []));
            const found = (list || []).find(i => i.id === icono);
            return found && found.label ? found.label : (icono || "Registro");
          }catch(e){
            return icono || "Registro";
          }
        })(),
        dimensiones: {
          ancho: registroDraft.ancho ? Number(registroDraft.ancho) : null,
          largo: registroDraft.largo ? Number(registroDraft.largo) : null
        },
        area_m2: (tipo === "marcas" && typeof registroDraft.area_m2 === "number" && isFinite(registroDraft.area_m2))
          ? registroDraft.area_m2
          : null,
        lamina: registroDraft.lamina || "",
        soporte: registroDraft.soporte || "",
        inspeccionFoto: registroDraft.inspeccionFoto || null
      });
      // Asegurar refresco tras el registro
      try{
        if(nueva && typeof updateReportes === "function"){ updateReportes(); }
      }catch(e){}
    }

    cerrarRegistroPanel();
  }catch(err){
    alert("No se pudo registrar. Revisa los datos.");
    console.warn(err);
  }
}

// Capturar ubicacion en el mapa para el flujo de registro
try{
  if(typeof map !== "undefined" && map && typeof map.on === "function"){
    map.on("click", (e)=>{
      if(!pickingRegistro) return;
      if(!registroTipo) return;
      if(!e || !e.latlng) return;
      pickingRegistro = false;
      registroLatLng = e.latlng;
      colocarRegistroMarker(registroLatLng);
      abrirRegistroPanel(registroTipo);
      try{
        if(map && typeof map.panTo === "function"){
          map.panTo(registroLatLng, {animate:true, duration:0.6});
        }
      }catch(err){}
    });
  }
}catch(e){}

function setModoCreacion(modo){
  // `modoActual` y `senales` estan declarados como variables globales (no como props de `window`)
  // y se consumen desde `js/map.js`. Por eso aqui debemos asignar directamente a esos bindings.
  try{
    if(typeof modoActual !== "undefined") modoActual = modo;
    if(typeof senales !== "undefined"){
      if(modo === "horizontal" && typeof senalesHorizontal !== "undefined") senales = senalesHorizontal;
      if(modo === "vertical" && typeof senalesVertical !== "undefined") senales = senalesVertical;
    }
  }catch(e){}

  // Mantener tambien las props por si algun codigo externo las usa (debug / consola).
  try{
    window.modoActual = modo;
    if(modo === "horizontal") window.senales = window.senalesHorizontal;
    if(modo === "vertical") window.senales = window.senalesVertical;
  }catch(e){}
}

function syncVisualizacionToMap(){
  const vis = window.URBBIS_VISUALIZACION;
  if(!vis) return;

  try{
    if(chkLayerMarcas) window.setCapaVisible("marcas", chkLayerMarcas.checked);
    if(chkLayerTransito) window.setCapaVisible("transito", chkLayerTransito.checked);
    if(chkLayerMobiliario) window.setCapaVisible("mobiliario", chkLayerMobiliario.checked);
    if(chkLayerEventos) window.setCapaVisible("eventos", chkLayerEventos.checked);
  }catch(e){}

  try{
    if(chkConsOperativos) vis.conservacion.operativos = chkConsOperativos.checked;
    if(chkConsDeteriorados) vis.conservacion.deteriorados = chkConsDeteriorados.checked;
    if(chkConsNoOperativos) vis.conservacion.no_operativos = chkConsNoOperativos.checked;

    if(chkFotoCon) vis.verificacion.con_foto = chkFotoCon.checked;
    if(chkFotoSin) vis.verificacion.sin_foto = chkFotoSin.checked;

    if(chkTiempoActivos) vis.tiempo.activos = chkTiempoActivos.checked;
    if(chkTiempoProgramados) vis.tiempo.programados = chkTiempoProgramados.checked;
    if(chkTiempoSinFinalizados) vis.tiempo.sin_finalizados = chkTiempoSinFinalizados.checked;
  }catch(e){}

  try{
    if(typeof renderizarTodo === "function") renderizarTodo();
    if(typeof updateReportes === "function") updateReportes();
  }catch(e){}
}

function initVisualizacionUI(){
  if(!visualizacionPanel) return;

  // defaults
  if(chkLayerMarcas) chkLayerMarcas.checked = true;
  if(chkLayerTransito) chkLayerTransito.checked = true;
  if(chkLayerMobiliario) chkLayerMobiliario.checked = true;
  if(chkLayerEventos) chkLayerEventos.checked = true;

  if(chkConsOperativos) chkConsOperativos.checked = true;
  if(chkConsDeteriorados) chkConsDeteriorados.checked = true;
  if(chkConsNoOperativos) chkConsNoOperativos.checked = true;

  if(chkFotoCon) chkFotoCon.checked = true;
  if(chkFotoSin) chkFotoSin.checked = true;

  if(chkTiempoActivos) chkTiempoActivos.checked = true;
  if(chkTiempoProgramados) chkTiempoProgramados.checked = true;
  if(chkTiempoSinFinalizados) chkTiempoSinFinalizados.checked = true;

  [chkLayerMarcas, chkLayerTransito, chkLayerMobiliario, chkLayerEventos,
    chkConsOperativos, chkConsDeteriorados, chkConsNoOperativos,
    chkFotoCon, chkFotoSin,
    chkTiempoActivos, chkTiempoProgramados, chkTiempoSinFinalizados].forEach((el)=>{
    if(!el) return;
    el.addEventListener("change", ()=>{
      // Si el usuario marca una capa de senales, usarla como modo para crear (municipal)
      if(el === chkLayerMarcas && chkLayerMarcas.checked) setModoCreacion("horizontal");
      if(el === chkLayerTransito && chkLayerTransito.checked) setModoCreacion("vertical");
      syncVisualizacionToMap();
    });
  });

  if(btnVisualizacionAvanzada && visualizacionAvanzada){
    btnVisualizacionAvanzada.addEventListener("click", ()=>{
      const open = visualizacionAvanzada.classList.contains("hidden");
      visualizacionAvanzada.classList.toggle("hidden", !open);
    });
  }

  if(btnVisualizacionReset){
    btnVisualizacionReset.addEventListener("click", ()=>{
      if(chkLayerMarcas) chkLayerMarcas.checked = true;
      if(chkLayerTransito) chkLayerTransito.checked = true;
      if(chkLayerMobiliario) chkLayerMobiliario.checked = true;
      if(chkLayerEventos) chkLayerEventos.checked = true;
      if(chkConsOperativos) chkConsOperativos.checked = true;
      if(chkConsDeteriorados) chkConsDeteriorados.checked = true;
      if(chkConsNoOperativos) chkConsNoOperativos.checked = true;
      if(chkFotoCon) chkFotoCon.checked = true;
      if(chkFotoSin) chkFotoSin.checked = true;
      if(chkTiempoActivos) chkTiempoActivos.checked = true;
      if(chkTiempoProgramados) chkTiempoProgramados.checked = true;
      if(chkTiempoSinFinalizados) chkTiempoSinFinalizados.checked = true;
      setModoCreacion("horizontal");
      syncVisualizacionToMap();
    });
  }

  // click fuera para cerrar
  document.addEventListener("click", (e)=>{
    if(!visualizacionPanel || visualizacionPanel.classList.contains("hidden")) return;
    const target = e.target;
    if(btnMapVisualizacion && (target === btnMapVisualizacion || btnMapVisualizacion.contains(target))) return;
    if(visualizacionPanel.contains(target)) return;
    visualizacionPanel.classList.add("hidden");
    if(btnMapVisualizacion) btnMapVisualizacion.classList.remove("active");
    if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
  });

  syncVisualizacionToMap();
}
initVisualizacionUI();

// Metrado UI
if(btnMetradoInicio){
  btnMetradoInicio.addEventListener("click", ()=>{
    if(rolActual !== "municipal"){
      setMetradoStatus("Disponible solo para municipalidad.");
      return;
    }
    cerrarRegistroPicker();
    cerrarRegistroPanel();
    limpiarRutaMetrado();
    metradoPicking = "draw";
    if(btnMetradoFin) btnMetradoFin.disabled = false;
    setMetradoStatus("Modo trazado: haz click para agregar puntos sobre la pista.");
    mostrarRegistroHint("Click en el mapa para agregar puntos del trazado.");
    try{
      if(typeof map !== "undefined" && map && typeof map.getCenter === "function"){
        asegurarMetradoCursor();
        asegurarMetradoPreview();
        const c = map.getCenter();
        if(metradoCursorMarker) metradoCursorMarker.setLatLng(c);
        if(metradoPreviewLine) metradoPreviewLine.setLatLngs([]);
        aplicarEstiloRutaMetrado();
      }
    }catch(e){}
  });
}
if(btnMetradoFin){
  btnMetradoFin.addEventListener("click", ()=>{
    if(rolActual !== "municipal"){
      setMetradoStatus("Disponible solo para municipalidad.");
      return;
    }
    metradoPicking = "";
    if(btnMetradoFin) btnMetradoFin.disabled = true;
    mostrarRegistroHint("");
    ocultarMetradoPreview();
    if(metradoPuntos.length < 2){
      setMetradoStatus("Trazado finalizado. Agrega mas puntos si necesitas distancia.");
    } else {
      setMetradoStatus("Trazado finalizado.");
    }
  });
}
if(btnMetradoUndo){
  btnMetradoUndo.addEventListener("click", deshacerPuntoMetrado);
}
if(btnMetradoLimpiar){
  btnMetradoLimpiar.addEventListener("click", limpiarRutaMetrado);
}
if(metradoColor){
  metradoColor.addEventListener("change", ()=>{
    aplicarEstiloRutaMetrado();
  });
}
if(metradoLineas){
  metradoLineas.addEventListener("change", ()=>{
    actualizarResultadosMetrado();
  });
}

// Capturar puntos de metrado en el mapa
try{
  if(typeof map !== "undefined" && map && typeof map.on === "function"){
    map.on("click", (e)=>{
      if(metradoPicking !== "draw") return;
      if(!e || !e.latlng) return;
      if(metradoLoading) return;

      const ok = agregarPuntoMetrado(e.latlng);
      if(!ok) return;

      if(metradoPuntos.length === 1){
        setMetradoStatus("Inicio listo. Sigue marcando puntos sobre la pista y finaliza.");
      } else {
        setMetradoStatus("Puntos: " + metradoPuntos.length + " \u00B7 Distancia: " + formatoMetros(metradoDistanciaM));
      }
    });

    map.on("mousemove", (e)=>{
      if(metradoPicking !== "draw") return;
      if(!e || !e.latlng) return;
      asegurarMetradoCursor();
      asegurarMetradoPreview();
      try{
        if(metradoCursorMarker) metradoCursorMarker.setLatLng(e.latlng);
        if(metradoPreviewLine){
          if(metradoPuntos.length){
            const last = metradoPuntos[metradoPuntos.length - 1];
            metradoPreviewLine.setLatLngs([last, e.latlng]);
          } else {
            metradoPreviewLine.setLatLngs([]);
          }
        }
      }catch(err){}
    });
  }
}catch(e){}

// Click fuera para cerrar metrado
document.addEventListener("click", (e)=>{
  if(!metradoPanel || metradoPanel.classList.contains("hidden")) return;
  const target = e.target;
  if(metradoPicking) return;
  if(btnMapMetrado && (target === btnMapMetrado || btnMapMetrado.contains(target))) return;
  if(metradoPanel.contains(target)) return;
  if(mapContainer && mapContainer.contains(target)) return;
  metradoPanel.classList.add("hidden");
  if(btnMapMetrado) btnMapMetrado.classList.remove("active");
  metradoPicking = "";
  mostrarRegistroHint("");
});

// Toggle sidebar en mobile
if(btnMenu && sidebar){
  btnMenu.addEventListener("click", ()=>{
    const expanded = sidebar.classList.toggle("expanded");
    if(expanded && isMobileViewport()){
      hideFABs();
    } else {
      showFABs();
    }
  });
}
if(btnFloatingFilters && sidebar){
  btnFloatingFilters.addEventListener("click", ()=>{
    const willExpand = !sidebar.classList.contains("expanded");
    if(willExpand){
      expandSidebar();
    } else {
      collapseSidebar();
    }
  });
}
if(btnFloatingReport && sidebar){
  btnFloatingReport.addEventListener("click", ()=>{
    if(typeof updateReportes === "function"){ updateReportes(); }
    // Ir directo a la seccion de reportes
    if(isMobileViewport()){
      if(reportesPanel){
        reportesPanel.classList.remove("hidden");
        reportesPanel.classList.add("mobile-visible");
        if(reportesSheet){
          reportesSheet.style.transform = "translateY(0)";
        }
      }
      collapseSidebar();
      hideFABs();
    } else {
      if(reportesPanel){
        reportesPanel.classList.remove("hidden");
        reportesPanel.classList.remove("mobile-visible");
        if(reportesSheet){
          reportesSheet.style.transform = "";
        }
        if(typeof updateReportes === "function"){ updateReportes(); }
        const header = document.querySelector(".topbar");
        const headerH = header ? header.getBoundingClientRect().height : 0;
        const top = reportesPanel.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        window.scrollTo({top: Math.max(0, top), behavior:"smooth"});
      }
      collapseSidebar();
    }
  });
}

const btnAplicarFiltros = document.getElementById("btnAplicarFiltros");
const btnMostrarTodas = document.getElementById("btnMostrarTodas");
if(btnAplicarFiltros){
  btnAplicarFiltros.addEventListener("click", collapseSidebarAfterAction);
}
if(btnMostrarTodas){
  btnMostrarTodas.addEventListener("click", collapseSidebarAfterAction);
}
document.querySelectorAll(".btnFiltro").forEach((btn)=>{
  btn.addEventListener("click", collapseSidebarAfterAction);
});

if(btnCerrarReportes && reportesPanel){
  btnCerrarReportes.addEventListener("click", ()=>{
    reportesPanel.classList.remove("mobile-visible");
    reportesPanel.classList.add("hidden");
    if(reportesSheet){
      reportesSheet.style.transform = "translateY(100%)";
    }
    showFABs();
  });
}

// Drag para hoja de reportes en mobile
if(reportesSheet && isMobileViewport()){
  let startY = 0;
  let currentY = 0;
  let dragging = false;

  const onMove = (clientY)=>{
    if(!dragging) return;
    currentY = clientY;
    const delta = Math.max(0, currentY - startY);
    reportesSheet.style.transform = `translateY(${delta}px)`;
  };

  const endDrag = ()=>{
    if(!dragging) return;
    const delta = Math.max(0, currentY - startY);
    dragging = false;
    if(delta > 120){
      reportesPanel.classList.remove("mobile-visible");
      reportesPanel.classList.add("hidden");
      reportesSheet.style.transform = "translateY(100%)";
      showFABs();
    } else {
      reportesSheet.style.transform = "translateY(0)";
    }
  };

  reportesSheet.addEventListener("touchstart",(e)=>{
    dragging = true;
    startY = e.touches[0].clientY;
    currentY = startY;
  });
  reportesSheet.addEventListener("touchmove",(e)=>{
    onMove(e.touches[0].clientY);
  });
  reportesSheet.addEventListener("touchend", endDrag);
  reportesSheet.addEventListener("mousedown",(e)=>{
    dragging = true;
    startY = e.clientY;
    currentY = startY;
  });
  window.addEventListener("mousemove",(e)=> onMove(e.clientY));
  window.addEventListener("mouseup", endDrag);
}

// AUTOCOMPLETADO
const inputBuscar = document.getElementById("inputBuscar");
const contSug = document.getElementById("sugerencias");
let timeoutAutocomplete;

inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.trim();
  if (texto.length < 2) {
    contSug.style.display = "none";
    contSug.innerHTML = "";
    return;
  }

  clearTimeout(timeoutAutocomplete);
  timeoutAutocomplete = setTimeout(async () => {
    const norm = normalizarTexto(texto);
    contSug.innerHTML = "";

    // Sugerencias locales (distritos)
    const locales = distritosLocales()
      .filter(d => normalizarTexto(d).includes(norm))
      .slice(0,5)
      .map(d => ({label:d, type:"local"}));

    // Sugerencias externas
    let externas = [];
    try{
      const url = buildNominatimUrl(texto,7);
      const res = await fetch(url);
      externas = await res.json();
    }catch(err){
      externas = [];
    }
    const externasMapped = (externas || []).map(item=>{
      const label = item.display_name;
      const esLima = (item.address && (item.address.city === "Lima" || item.address.town === "Lima" || item.address.state === "Lima")) || label.toLowerCase().includes("lima");
      return {label, lat:item.lat, lon:item.lon, type:"ext", esLima};
    });

    const sugerencias = [...locales, ...externasMapped];
    if(!sugerencias.length){
      contSug.style.display = "none";
      return;
    }

    sugerencias.forEach(item=>{
      const div = document.createElement("div");
      div.className = "sugerencia-item";
      div.innerText = item.label;
      if(item.esLima || item.type==="local") div.style.fontWeight = "700";
      div.addEventListener("click", async () => {
        inputBuscar.value = item.label;
        contSug.style.display = "none";
        if(item.type === "local"){
          await zoomADistrito(item.label);
        } else if(item.lat && item.lon){
          map.setView([item.lat, item.lon], 16);
          L.marker([item.lat, item.lon])
            .addTo(map)
            .bindPopup(`<strong>${item.label}</strong>`)
            .openPopup();
        }
      });
      contSug.appendChild(div);
    });
    contSug.style.display = "block";
  }, 500);
});

document
  .getElementById("btnBuscarDireccion")
  .addEventListener("click", async () => {
    const texto = inputBuscar.value;
    if(!texto.trim()){
      alert("Ingresa un texto para buscar.");
      return;
    }
    const url = buildNominatimUrl(texto,1);
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) {
      alert("No encontrado");
      return;
    }
    const lugar = data[0];
    map.flyTo([parseFloat(lugar.lat), parseFloat(lugar.lon)], 16, {duration:1.2, easeLinearity:0.25});
    L.marker([lugar.lat, lugar.lon])
      .addTo(map)
      .bindPopup(`<strong>${texto}</strong>`)
      .openPopup();
  });

// Mobile search listeners
const inputBuscarMobile = document.getElementById("inputBuscarMobile");
const contSugMobile = document.getElementById("sugerenciasMobile");
const btnBuscarDireccionMobile = document.getElementById("btnBuscarDireccionMobile");
let timeoutAutocompleteMobile;

function bindSearch(inputEl, contEl){
  inputEl.addEventListener("input", () => {
    const texto = inputEl.value.trim();
    if (texto.length < 2) {
      contEl.style.display = "none";
      contEl.innerHTML = "";
      return;
    }
    clearTimeout(timeoutAutocompleteMobile);
    timeoutAutocompleteMobile = setTimeout(async () => {
      const norm = normalizarTexto(texto);
      contEl.innerHTML = "";

      const locales = distritosLocales()
        .filter(d => normalizarTexto(d).includes(norm))
        .slice(0,5)
        .map(d => ({label:d, type:"local"}));

      let externas = [];
      try{
        const url = buildNominatimUrl(texto,7);
        const res = await fetch(url);
        externas = await res.json();
      }catch(err){ externas = []; }

      const externasMapped = (externas || []).map(item=>{
        const label = item.display_name;
        const esLima = (item.address && (item.address.city === "Lima" || item.address.town === "Lima" || item.address.state === "Lima")) || label.toLowerCase().includes("lima");
        return {label, lat:item.lat, lon:item.lon, type:"ext", esLima};
      });

      const sugerencias = [...locales, ...externasMapped];
      if(!sugerencias.length){
        contEl.style.display = "none";
        return;
      }

      sugerencias.forEach(item=>{
        const div = document.createElement("div");
        div.className = "sugerencia-item";
        div.innerText = item.label;
        if(item.esLima || item.type==="local") div.style.fontWeight = "700";
        div.addEventListener("click", async () => {
          inputEl.value = item.label;
          contEl.style.display = "none";
          if(item.type === "local"){
            await zoomADistrito(item.label);
          } else if(item.lat && item.lon){
            map.flyTo([parseFloat(item.lat), parseFloat(item.lon)], 16, {duration:1.2, easeLinearity:0.25});
            L.marker([item.lat, item.lon])
              .addTo(map)
              .bindPopup(`<strong>${item.label}</strong>`)
              .openPopup();
          }
        });
        contEl.appendChild(div);
      });
      contEl.style.display = "block";
    }, 500);
  });
}

if(inputBuscarMobile && contSugMobile){
  bindSearch(inputBuscarMobile, contSugMobile);
}
if(btnBuscarDireccionMobile && inputBuscarMobile){
  btnBuscarDireccionMobile.addEventListener("click", async () => {
    const texto = inputBuscarMobile.value;
    if(!texto.trim()){
      alert("Ingresa un texto para buscar.");
      return;
    }
    const url = buildNominatimUrl(texto,1);
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) {
      alert("No encontrado");
      return;
    }
    const lugar = data[0];
    map.flyTo([parseFloat(lugar.lat), parseFloat(lugar.lon)], 16, {duration:1.2, easeLinearity:0.25});
    L.marker([lugar.lat, lugar.lon])
      .addTo(map)
      .bindPopup(`<strong>${texto}</strong>`)
      .openPopup();
  });
}
