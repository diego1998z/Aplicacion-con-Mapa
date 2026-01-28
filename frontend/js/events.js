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
const metradoOptionsDetails = document.getElementById("metradoOptionsDetails");
const metradoStatus = document.getElementById("metradoStatus");
const btnMetradoInicio = document.getElementById("btnMetradoInicio");
const btnMetradoFin = document.getElementById("btnMetradoFin");
const btnMetradoUndo = document.getElementById("btnMetradoUndo");
const btnMetradoLimpiar = document.getElementById("btnMetradoLimpiar");
const btnMetradoInspeccion = document.getElementById("btnMetradoInspeccion");
const btnMetradoRegistrar = document.getElementById("btnMetradoRegistrar");
const metradoColor = document.getElementById("metradoColor");
const metradoLineas = document.getElementById("metradoLineas");
const metradoDistancia = document.getElementById("metradoDistancia");
const metradoMetrado = document.getElementById("metradoMetrado");
const btnMetradoCalcular = document.getElementById("btnMetradoCalcular");
const metradoUrbanExtra = document.getElementById("metradoUrbanExtra");
const metradoEje = document.getElementById("metradoEje");
const metradoLaterales = document.getElementById("metradoLaterales");
const metradoInternas = document.getElementById("metradoInternas");
const metradoArea = document.getElementById("metradoArea");
const metradoSnapVias = document.getElementById("metradoSnapVias");
const metradoNombre = document.getElementById("metradoNombre");
const metradoTipoPintura = document.getElementById("metradoTipoPintura");
const btnMetradoVerRegistros = document.getElementById("btnMetradoVerRegistros");
const modalMetradoRegistros = document.getElementById("modalMetradoRegistros");
const btnMetradoRegistrosClose = document.getElementById("btnMetradoRegistrosClose");
const metradoRegistrosList = document.getElementById("metradoRegistrosList");
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
const projectSwitcher = document.getElementById("projectSwitcher");
const selectProyecto = document.getElementById("selectProyecto");
const btnCambiarProyecto = document.getElementById("btnCambiarProyecto");
const btnAgregarProyecto = document.getElementById("btnAgregarProyecto");
const btnEditarProyecto = document.getElementById("btnEditarProyecto");
const modalProyecto = document.getElementById("modalProyecto");
const btnProyectoClose = document.getElementById("btnProyectoClose");
const btnProyectoCancelar = document.getElementById("btnProyectoCancelar");
const btnProyectoGuardar = document.getElementById("btnProyectoGuardar");
const inputProyectoNombre = document.getElementById("inputProyectoNombre");
const inputProyectoInicio = document.getElementById("inputProyectoInicio");
const inputProyectoFin = document.getElementById("inputProyectoFin");
const chkProyectoTransito = document.getElementById("chkProyectoTransito");
const chkProyectoMarcas = document.getElementById("chkProyectoMarcas");
const chkProyectoMobiliario = document.getElementById("chkProyectoMobiliario");
const chkProyectoMetrado = document.getElementById("chkProyectoMetrado");
const projectPreviewName = document.getElementById("projectPreviewName");
const projectPreviewDates = document.getElementById("projectPreviewDates");
const projectPreviewCount = document.getElementById("projectPreviewCount");
const tablaProyectoPreview = document.getElementById("tablaProyectoPreview");
const registroPicker = document.getElementById("registroPicker");
const registroPanel = document.getElementById("registroPanel");
const registroHint = document.getElementById("registroHint");
const btnRegistroCancelar = document.getElementById("btnRegistroCancelar");
const btnRegistroBack = document.getElementById("btnRegistroBack");
const registroPickerTitle = document.getElementById("registroPickerTitle");
const registroPickerGridMain = document.getElementById("registroPickerGridMain");
const registroPickerGridMarcas = document.getElementById("registroPickerGridMarcas");
const modalInspeccion = document.getElementById("modalInspeccion");
const modalInspeccionListado = document.getElementById("modalInspeccionListado");
const btnInspeccionClose = document.getElementById("btnInspeccionClose");
const btnInspeccionAgregar = document.getElementById("btnInspeccionAgregar");
const btnInspeccionFinalizar = document.getElementById("btnInspeccionFinalizar");
const btnInspeccionVerTodo = document.getElementById("btnInspeccionVerTodo");
const btnInspeccionListClose = document.getElementById("btnInspeccionListClose");
const inspeccionPrev = document.getElementById("inspeccionPrev");
const inspeccionPrevBody = document.getElementById("inspeccionPrevBody");
const inspeccionList = document.getElementById("inspeccionList");
const insDistancia = document.getElementById("insDistancia");
const insUbicacion = document.getElementById("insUbicacion");
const insComprende = document.getElementById("insComprende");
const insLi = document.getElementById("insLi");
const insLd = document.getElementById("insLd");
const insEc1 = document.getElementById("insEc1");
const insEc2 = document.getElementById("insEc2");
const insLiFoto = document.getElementById("insLiFoto");
const insLdFoto = document.getElementById("insLdFoto");
const insEc1Foto = document.getElementById("insEc1Foto");
const insEc2Foto = document.getElementById("insEc2Foto");
const dashboardOverlay = document.getElementById("dashboardOverlay");
const btnDashLogout = document.getElementById("btnDashLogout");
const dashUserName = document.getElementById("dashUserName");
const dashUserEmail = document.getElementById("dashUserEmail");
const dashAvatarInitials = document.getElementById("dashAvatarInitials");
const dashEntity = document.getElementById("dashEntity");
const dashMuniFoto = document.getElementById("dashMuniFoto");
const dashMuniNombre = document.getElementById("dashMuniNombre");
const dashMuniSub = document.getElementById("dashMuniSub");
const dashMuniSuperficie = document.getElementById("dashMuniSuperficie");
const dashMuniSubdivisiones = document.getElementById("dashMuniSubdivisiones");
const dashMuniPoblacion = document.getElementById("dashMuniPoblacion");
const dashScoreGeneral = document.getElementById("dashScoreGeneral");
const dashScoreLabel = document.getElementById("dashScoreLabel");
const dashTotalVertical = document.getElementById("dashTotalVertical");
const dashTotalMarcas = document.getElementById("dashTotalMarcas");
const dashTotalPintado = document.getElementById("dashTotalPintado");
const dashTotalMobiliario = document.getElementById("dashTotalMobiliario");
const dashPctOpt = document.getElementById("dashPctOpt");
const dashPctMid = document.getElementById("dashPctMid");
const dashPctCrit = document.getElementById("dashPctCrit");
const dashStateOpt = document.getElementById("dashStateOpt");
const dashStateMid = document.getElementById("dashStateMid");
const dashStateCrit = document.getElementById("dashStateCrit");
const dashAlertDeterioradas = document.getElementById("dashAlertDeterioradas");
const dashAlertAusentes = document.getElementById("dashAlertAusentes");
const dashInvEjecutada = document.getElementById("dashInvEjecutada");
const dashInvPlanificada = document.getElementById("dashInvPlanificada");
const dashEventoFalta = document.getElementById("dashEventoFalta");
const dashEventoDanada = document.getElementById("dashEventoDanada");
const dashEventoObstruida = document.getElementById("dashEventoObstruida");
const dashEventoOtro = document.getElementById("dashEventoOtro");
const dashProjectSelect = document.getElementById("dashProjectSelect");
const dashScore = document.getElementById("dashScore");
const dashTotalSenales = document.getElementById("dashTotalSenales");
const dashInversion = document.getElementById("dashInversion");
const dashAtencion = document.getElementById("dashAtencion");
const invTotal = document.getElementById("invTotal");
const invOperativos = document.getElementById("invOperativos");
const invOperativosPct = document.getElementById("invOperativosPct");
const invDeteriorados = document.getElementById("invDeteriorados");
const invDeterioradosPct = document.getElementById("invDeterioradosPct");
const invReposicion = document.getElementById("invReposicion");
const invBarTransito = document.getElementById("invBarTransito");
const invBarMarcas = document.getElementById("invBarMarcas");
const invBarMobiliario = document.getElementById("invBarMobiliario");
const invValTransito = document.getElementById("invValTransito");
const invValMarcas = document.getElementById("invValMarcas");
const invValMobiliario = document.getElementById("invValMobiliario");
const invTablaBody = document.getElementById("invTablaBody");
const invDistritoLabel = document.getElementById("invDistritoLabel");
const invProyectoSelect = document.getElementById("invProyectoSelect");
const invSinVerif = document.getElementById("invSinVerif");
const invMantenimiento = document.getElementById("invMantenimiento");
const invReposicionCrit = document.getElementById("invReposicionCrit");
const invTotalProxima = document.getElementById("invTotalProxima");
const apuCategoria = document.getElementById("apuCategoria");
const apuBuscar = document.getElementById("apuBuscar");
const apuCapitulo = document.getElementById("apuCapitulo");
const apuFecha = document.getElementById("apuFecha");
const apuMoneda = document.getElementById("apuMoneda");
const apuTotal = document.getElementById("apuTotal");
const apuTablaBody = document.getElementById("apuTablaBody");
const apuDetalleTitulo = document.getElementById("apuDetalleTitulo");
const apuDetalleSub = document.getElementById("apuDetalleSub");
const apuDetalleContenido = document.getElementById("apuDetalleContenido");

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
let metradoRegistrosLayer = null;
let metradoMarkerInicio = null;
let metradoMarkerFin = null;
let metradoRouteOutline = null;
let metradoRouteLine = null;
let metradoRouteFlow = null;
let metradoPreviewLine = null;
let metradoCursorMarker = null;
let metradoLoading = false;
let metradoCalculoActivo = false;
let metradoUltimoCalculo = null;
let metradoInspecciones = [];
let metradoInspeccionSeq = 1;
let metradoRegistros = [];
let metradoSnapEnabled = false;
let metradoSnapReady = false;
let metradoSnapLoading = false;
let metradoSnapIndex = new Map();
let metradoSnapFeatures = [];
let metradoSnapLast = null;
let metradoSnapHover = null;
let metradoSnapHighway = "";
let metradoSnapFailReason = "";
const METRADO_SNAP_CELL = 0.0025;
const METRADO_SNAP_MAX_M = 20;
const METRADO_SNAP_TARGET_POINTS = 1400000;
const METRADO_SNAP_WINDOW = 8;
const METRADO_SNAP_MAX_SEG_POINTS = 140;
const METRADO_SNAP_MAX_SEG_M = 160;
const METRADO_SNAP_MAX_PREVIEW_M = 100;
const METRADO_SNAP_MAX_JUMP_M = 22;
const METRADO_SNAP_SEG_SEARCH_M = 45;
const METRADO_SNAP_CONNECT_WINDOW = 320;
const METRADO_SNAP_CONNECT_MAX_M = 30;

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

function maxNumericId(list){
  if(!Array.isArray(list)) return 0;
  return list.reduce((max, item)=>{
    const val = Number(item && item.id);
    return Number.isFinite(val) ? Math.max(max, val) : max;
  }, 0);
}

function yearFromProyecto(proj){
  if(!proj) return null;
  try{
    if(typeof obtenerAnioProyectoBase === "function"){
      const y = obtenerAnioProyectoBase(proj.nombre || "");
      if(Number.isFinite(y)) return y;
    }
  }catch(e){}
  const raw = proj.fecha_inicio || proj.fecha_fin || "";
  const match = String(raw).match(/^(\d{4})/);
  return match ? Number(match[1]) : null;
}

function proyectoDataPayload(proj){
  return {
    creado: proj.creado || "",
    fecha_inicio: proj.fecha_inicio || "",
    fecha_fin: proj.fecha_fin || "",
    distrito: proj.distrito || "",
    senalesHorizontal: Array.isArray(proj.senalesHorizontal) ? proj.senalesHorizontal : [],
    senalesVertical: Array.isArray(proj.senalesVertical) ? proj.senalesVertical : [],
    senalesMobiliario: Array.isArray(proj.senalesMobiliario) ? proj.senalesMobiliario : [],
    metradoRegistros: Array.isArray(proj.metradoRegistros) ? proj.metradoRegistros : []
  };
}

function proyectoToApiPayload(proj){
  if(!proj) return null;
  return {
    legacyId: String(proj.id || ""),
    name: String(proj.nombre || "Proyecto"),
    year: yearFromProyecto(proj) || undefined,
    startDate: proj.fecha_inicio || "",
    endDate: proj.fecha_fin || "",
    district: proj.distrito || "",
    data: proyectoDataPayload(proj)
  };
}

function proyectoFromApi(p){
  if(!p) return null;
  const data = p.data && typeof p.data === "object" ? p.data : {};
  const proj = {
    id: p.legacyId || p.id,
    dbId: p.id,
    nombre: p.name || "Proyecto",
    creado: data.creado || (p.createdAt ? String(p.createdAt).slice(0,10) : hoyISO()),
    fecha_inicio: data.fecha_inicio || (p.startDate ? String(p.startDate).slice(0,10) : ""),
    fecha_fin: data.fecha_fin || (p.endDate ? String(p.endDate).slice(0,10) : ""),
    distrito: p.district || data.distrito || "",
    senalesHorizontal: Array.isArray(data.senalesHorizontal) ? data.senalesHorizontal : [],
    senalesVertical: Array.isArray(data.senalesVertical) ? data.senalesVertical : [],
    senalesMobiliario: Array.isArray(data.senalesMobiliario) ? data.senalesMobiliario : [],
    metradoRegistros: Array.isArray(data.metradoRegistros) ? data.metradoRegistros : []
  };
  if(!Array.isArray(proj.metradoRegistros)) proj.metradoRegistros = [];
  return proj;
}

function syncProyectoBackend(proj){
  if(!proj || !window.UrbbisApi) return;
  const payload = proyectoToApiPayload(proj);
  if(!payload || !payload.legacyId) return;
  if(proj.dbId){
    if(typeof window.UrbbisApi.updateProject === "function"){
      window.UrbbisApi.updateProject(proj.dbId, payload)
        .catch((err)=> console.warn("No se pudo actualizar el proyecto en backend.", err));
    }
    return;
  }
  if(typeof window.UrbbisApi.createProject === "function"){
    window.UrbbisApi.createProject(payload)
      .then((remote)=>{
        if(remote && remote.id){
          proj.dbId = remote.id;
        }
      })
      .catch((err)=> console.warn("No se pudo crear el proyecto en backend.", err));
  }
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

function asegurarMetradoRegistrosLayer(){
  try{
    if(metradoRegistrosLayer) return metradoRegistrosLayer;
    if(typeof L === "undefined") return null;
    if(typeof map === "undefined" || !map) return null;
    metradoRegistrosLayer = L.layerGroup().addTo(map);
    return metradoRegistrosLayer;
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
        className: "metrado-route-preview",
        interactive: false
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

function metradoSnapCellKey(lat, lng){
  const x = Math.floor(lng / METRADO_SNAP_CELL);
  const y = Math.floor(lat / METRADO_SNAP_CELL);
  return x + ":" + y;
}

function metradoSnapWidthMeters(highway){
  let t = String(highway || "").toLowerCase();
  if(t.includes("_link")) t = t.replace("_link", "");
  if(t.includes("motorway") || t.includes("trunk")) return 12;
  if(t.includes("primary")) return 10;
  if(t.includes("secondary")) return 9;
  if(t.includes("tertiary")) return 8;
  if(t.includes("residential") || t.includes("unclassified") || t.includes("living_street") || t.includes("road")) return 7;
  if(t.includes("service")) return 5;
  if(t.includes("footway") || t.includes("path") || t.includes("cycleway") || t.includes("steps") || t.includes("pedestrian")) return 3;
  return 6;
}

function metradoSnapWeightPx(highway){
  try{
    if(typeof map === "undefined" || !map || typeof map.containerPointToLatLng !== "function"){
      return 10;
    }
    const p0 = map.containerPointToLatLng([0, 0]);
    const p1 = map.containerPointToLatLng([0, 10]);
    const meters = map.distance(p0, p1);
    const metersPerPx = meters / 10;
    if(!metersPerPx || !Number.isFinite(metersPerPx)) return 10;
    const widthM = metradoSnapWidthMeters(highway);
    return Math.max(6, Math.min(28, Math.round(widthM / metersPerPx)));
  }catch(e){
    return 10;
  }
}

function metradoSnapAllowedHighway(highway){
  const t = String(highway || "").toLowerCase();
  if(!t) return false;
  if(t.includes("footway") || t.includes("path") || t.includes("cycleway") || t.includes("steps") || t.includes("pedestrian")) return false;
  if(t.includes("construction") || t.includes("proposed") || t.includes("abandoned")) return false;
  return true;
}

function metradoPesoPorHighway(highway){
  const weight = metradoSnapWeightPx(highway);
  return Number.isFinite(weight) ? weight : 8;
}

function proyectarEnSegmento(latlng, a, b){
  try{
    if(typeof map === "undefined" || !map || typeof map.project !== "function" || typeof map.unproject !== "function"){
      return null;
    }
    const p = map.project(latlng);
    const p1 = map.project(a);
    const p2 = map.project(b);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len2 = dx * dx + dy * dy;
    if(!len2){
      const dist = map.distance(latlng, a);
      return { latlng: a, dist, t: 0 };
    }
    let t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const proj = L.point(p1.x + t * dx, p1.y + t * dy);
    const projLatLng = map.unproject(proj);
    const dist = map.distance(latlng, projLatLng);
    return { latlng: projLatLng, dist, t };
  }catch(e){
    return null;
  }
}

function prepararViasMetrado(data){
  metradoSnapIndex = new Map();
  metradoSnapFeatures = [];
  let totalCoords = 0;
  const features = Array.isArray(data && data.features) ? data.features : [];
  features.forEach((feat)=>{
    const geom = feat && feat.geometry ? feat.geometry : null;
    if(!geom) return;
    const coords = geom.coordinates;
    if(!coords) return;
    const props = feat.properties || {};
    const highway = props.highway || "";
    if(!metradoSnapAllowedHighway(highway)) return;
    if(geom.type === "LineString" && Array.isArray(coords)){
      totalCoords += coords.length;
      return;
    }
    if(geom.type === "MultiLineString" && Array.isArray(coords)){
      coords.forEach((line)=>{ if(Array.isArray(line)) totalCoords += line.length; });
    }
  });

  const step = Math.max(1, Math.ceil(totalCoords / METRADO_SNAP_TARGET_POINTS));
  features.forEach((feat)=>{
    const geom = feat && feat.geometry ? feat.geometry : null;
    if(!geom) return;
    const coords = geom.coordinates;
    if(!coords) return;
    const props = feat.properties || {};
    const highway = props.highway || "";
    if(!metradoSnapAllowedHighway(highway)) return;

    const pushLine = (line)=>{
      if(!Array.isArray(line) || line.length < 2) return;
      const slim = [];
      for(let i = 0; i < line.length; i += step){
        const pt = line[i];
        if(!pt || pt.length < 2) continue;
        slim.push([pt[1], pt[0]]);
      }
      const last = line[line.length - 1];
      if(last && last.length >= 2){
        const lastLat = last[1];
        const lastLng = last[0];
        const prev = slim.length ? slim[slim.length - 1] : null;
        if(!prev || prev[0] !== lastLat || prev[1] !== lastLng){
          slim.push([lastLat, lastLng]);
        }
      }
      if(slim.length < 2) return;
      const idx = metradoSnapFeatures.length;
      metradoSnapFeatures.push({ highway, coords: slim });
      slim.forEach((pt, i)=>{
        const key = metradoSnapCellKey(pt[0], pt[1]);
        const bucket = metradoSnapIndex.get(key) || [];
        bucket.push([pt[0], pt[1], idx, i]);
        if(bucket.length === 1) metradoSnapIndex.set(key, bucket);
      });
    };

    if(geom.type === "LineString"){
      pushLine(coords);
    } else if(geom.type === "MultiLineString"){
      coords.forEach((line)=> pushLine(line));
    }
  });
}

async function cargarViasMetrado(){
  if(metradoSnapLoading || metradoSnapReady) return;
  metradoSnapLoading = true;
  try{
    setMetradoStatus("Cargando vias para ajuste...");
    const res = await fetch("src/lima_callao_vias.geojson", { cache: "force-cache" });
    if(!res.ok) throw new Error("Error al cargar vias.");
    const data = await res.json();
    prepararViasMetrado(data);
    metradoSnapReady = true;
    setMetradoStatus("Ajuste a vias listo.");
  }catch(e){
    metradoSnapReady = false;
    metradoSnapEnabled = false;
    if(metradoSnapVias) metradoSnapVias.checked = false;
    setMetradoStatus("No se pudo cargar vias para ajuste.");
  }finally{
    metradoSnapLoading = false;
  }
}

function buscarSnapMetrado(latlng){
  if(!metradoSnapEnabled || !metradoSnapReady) return null;
  if(!latlng) return null;
  let best = null;
  let bestDist = Infinity;
  const lat = latlng.lat;
  const lng = latlng.lng;
  const baseX = Math.floor(lng / METRADO_SNAP_CELL);
  const baseY = Math.floor(lat / METRADO_SNAP_CELL);
  for(let dx = -1; dx <= 1; dx++){
    for(let dy = -1; dy <= 1; dy++){
      const key = (baseX + dx) + ":" + (baseY + dy);
      const bucket = metradoSnapIndex.get(key);
      if(!bucket) continue;
      for(let i = 0; i < bucket.length; i++){
        const item = bucket[i];
        const feature = metradoSnapFeatures[item[2]];
        if(!feature) continue;
        const coordIndex = item[3];
        const pointLatLng = L.latLng(item[0], item[1]);
        let bestLocalDist = map.distance(latlng, pointLatLng);
        let bestLocalLatLng = pointLatLng;
        let bestLocalSegment = null;

        if(bestLocalDist <= METRADO_SNAP_SEG_SEARCH_M){
          const coords = feature.coords || [];
          if(coordIndex > 0 && coords[coordIndex - 1]){
            const prev = L.latLng(coords[coordIndex - 1][0], coords[coordIndex - 1][1]);
            const proj = proyectarEnSegmento(latlng, prev, pointLatLng);
            if(proj && proj.dist < bestLocalDist){
              bestLocalDist = proj.dist;
              bestLocalLatLng = proj.latlng;
              bestLocalSegment = coordIndex - 1;
            }
          }
          if(coordIndex < coords.length - 1 && coords[coordIndex + 1]){
            const next = L.latLng(coords[coordIndex + 1][0], coords[coordIndex + 1][1]);
            const proj = proyectarEnSegmento(latlng, pointLatLng, next);
            if(proj && proj.dist < bestLocalDist){
              bestLocalDist = proj.dist;
              bestLocalLatLng = proj.latlng;
              bestLocalSegment = coordIndex;
            }
          }
        }

        if(bestLocalDist < bestDist){
          bestDist = bestLocalDist;
          best = {
            latlng: bestLocalLatLng,
            featureIndex: item[2],
            coordIndex: coordIndex,
            segmentIndex: bestLocalSegment,
            highway: feature.highway || ""
          };
        }
      }
    }
  }
  if(!best || bestDist > METRADO_SNAP_MAX_M) return null;
  return best;
}

function limitarSegmentoMetrado(segment){
  if(segment.length <= METRADO_SNAP_MAX_SEG_POINTS) return segment;
  const step = Math.ceil(segment.length / METRADO_SNAP_MAX_SEG_POINTS);
  const out = [];
  for(let i = 0; i < segment.length; i += step){
    out.push(segment[i]);
  }
  if(out[out.length - 1] !== segment[segment.length - 1]){
    out.push(segment[segment.length - 1]);
  }
  return out;
}

function recortarSegmentoPorDistancia(segment, maxM){
  if(!segment || segment.length < 2) return segment;
  if(typeof map === "undefined" || !map || typeof map.distance !== "function") return segment;
  const out = [segment[segment.length - 1]];
  let total = 0;
  for(let i = segment.length - 2; i >= 0; i--){
    total += map.distance(segment[i + 1], segment[i]);
    out.push(segment[i]);
    if(total >= maxM) break;
  }
  return out.reverse();
}

function buscarConexionMetrado(lastSnap, snap){
  if(!lastSnap || !snap) return null;
  if(lastSnap.featureIndex === snap.featureIndex) return null;
  if(typeof map === "undefined" || !map || typeof map.distance !== "function") return null;
  const feature = metradoSnapFeatures[lastSnap.featureIndex];
  if(!feature || !Array.isArray(feature.coords) || !feature.coords.length) return null;
  const coords = feature.coords;
  const startIndex = Math.max(0, Math.min(coords.length - 1, lastSnap.coordIndex));
  const start = Math.max(0, startIndex - METRADO_SNAP_CONNECT_WINDOW);
  const end = Math.min(coords.length - 1, startIndex + METRADO_SNAP_CONNECT_WINDOW);
  let bestIndex = -1;
  let bestDist = Infinity;
  for(let i = start; i <= end; i++){
    const pt = coords[i];
    if(!pt || pt.length < 2) continue;
    const latlng = L.latLng(pt[0], pt[1]);
    const dist = map.distance(latlng, snap.latlng);
    if(dist < bestDist){
      bestDist = dist;
      bestIndex = i;
    }
  }
  if(bestIndex < 0 || bestDist > METRADO_SNAP_CONNECT_MAX_M) return null;
  const forward = startIndex <= bestIndex;
  const segStart = forward ? startIndex : bestIndex;
  const segEnd = forward ? bestIndex : startIndex;
  let segment = coords.slice(segStart, segEnd + 1).map((pt)=> L.latLng(pt[0], pt[1]));
  if(!forward) segment = segment.reverse();
  if(segment.length && lastSnap.latlng){
    segment[0] = lastSnap.latlng;
  }
  segment = limitarSegmentoMetrado(segment);
  return { puntos: segment, coordIndex: bestIndex, dist: bestDist };
}

function construirPreviewMetrado(snap){
  if(!snap) return [];
  const feature = metradoSnapFeatures[snap.featureIndex];
  if(!feature) return [];
  const coords = feature.coords || [];
  if(!coords.length) return [];

  if(metradoSnapLast && metradoSnapLast.featureIndex === snap.featureIndex){
    const start = Math.min(metradoSnapLast.coordIndex, snap.coordIndex);
    const end = Math.max(metradoSnapLast.coordIndex, snap.coordIndex);
    let segment = coords.slice(start, end + 1).map((pt)=> L.latLng(pt[0], pt[1]));
    if(metradoSnapLast.coordIndex > snap.coordIndex){
      segment = segment.reverse();
    }
    if(segment.length <= 1){
      const base = metradoSnapLast.latlng || (segment[0] || snap.latlng);
      if(base && snap.latlng && base !== snap.latlng){
        segment = [base, snap.latlng];
      } else {
        segment = base ? [base] : [];
      }
    } else {
      if(metradoSnapLast.latlng){
        segment[0] = metradoSnapLast.latlng;
      }
      if(snap.latlng){
        segment[segment.length - 1] = snap.latlng;
      }
    }
    segment = recortarSegmentoPorDistancia(segment, METRADO_SNAP_MAX_PREVIEW_M);
    return limitarSegmentoMetrado(segment);
  }

  const start = Math.max(0, snap.coordIndex - METRADO_SNAP_WINDOW);
  const end = Math.min(coords.length - 1, snap.coordIndex + METRADO_SNAP_WINDOW);
  const preview = coords.slice(start, end + 1).map((pt)=> L.latLng(pt[0], pt[1]));
  if(preview.length && snap.latlng){
    preview[preview.length - 1] = snap.latlng;
  }
  return preview;
}

function ajustarPreviewMetrado(highway){
  if(!metradoPreviewLine || typeof metradoPreviewLine.setStyle !== "function") return;
  const weight = metradoSnapEnabled ? metradoSnapWeightPx(highway) : 7;
  const opacity = metradoSnapEnabled ? 0.32 : 0.55;
  metradoPreviewLine.setStyle({ weight, opacity });
}

function actualizarPesosMetrado(){
  const baseWeight = metradoPesoPorHighway(metradoSnapHighway);
  const outlineWeight = baseWeight + 4;
  const flowWeight = Math.max(3, baseWeight - 3);

  try{
    if(metradoRouteOutline && typeof metradoRouteOutline.setStyle === "function"){
      metradoRouteOutline.setStyle({ weight: outlineWeight });
    }
    if(metradoRouteLine && typeof metradoRouteLine.setStyle === "function"){
      metradoRouteLine.setStyle({ weight: baseWeight });
    }
    if(metradoRouteFlow && typeof metradoRouteFlow.setStyle === "function"){
      metradoRouteFlow.setStyle({ weight: flowWeight });
    }
    if(metradoPreviewLine && typeof metradoPreviewLine.setStyle === "function"){
      const highway = metradoSnapHover ? metradoSnapHover.highway : metradoSnapHighway;
      const weight = metradoPesoPorHighway(highway || "");
      const opacity = metradoSnapEnabled ? 0.32 : 0.55;
      metradoPreviewLine.setStyle({ weight, opacity });
    }
    if(metradoRegistrosLayer && typeof metradoRegistrosLayer.eachLayer === "function"){
      metradoRegistrosLayer.eachLayer((layer)=>{
        if(!layer || typeof layer.setStyle !== "function") return;
        const weight = metradoPesoPorHighway(layer._metradoHighway || "");
        layer.setStyle({ weight: weight });
        if(layer._metradoBaseStyle){
          layer._metradoBaseStyle.weight = weight;
        }
      });
    }
  }catch(e){}
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

function formatoML(m){
  const n = (typeof m === "number" && isFinite(m)) ? Math.max(0, m) : 0;
  const v = Math.round(n);
  try{
    return v.toLocaleString("es-PE") + " ml";
  }catch(e){
    return String(v) + " ml";
  }
}

function formatoM2(m2){
  const n = (typeof m2 === "number" && isFinite(m2)) ? Math.max(0, m2) : 0;
  try{
    return n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m\u00B2";
  }catch(e){
    return n.toFixed(2) + " m\u00B2";
  }
}

function getRadioValue(name, fallback){
  try{
    const el = document.querySelector('input[name="' + name + '"]:checked');
    const val = el ? String(el.value || "") : "";
    return val || (fallback || "");
  }catch(e){
    return fallback || "";
  }
}

function getMetradoConfig(){
  const ancho = Number(getRadioValue("metradoAncho", "0.10"));
  const via = getRadioValue("metradoVia", "urbana");
  const sentido = getRadioValue("metradoSentido", "unico");
  const sep = getRadioValue("metradoSep", "si");
  return {
    ancho: (Number.isFinite(ancho) && ancho > 0) ? ancho : 0.10,
    via,
    sentido,
    separador: sep
  };
}

function calcularLineasMetrado(longitudM, cfg){
  const L = (typeof longitudM === "number" && isFinite(longitudM)) ? Math.max(0, longitudM) : 0;
  const c = cfg || getMetradoConfig();

  let eje = 0;
  let laterales = 0;
  let internas = 0;

  if(!L){
    return { eje:0, laterales:0, internas:0, total:0, area:0, cfg:c };
  }

  if(c.via === "autopista"){
    // Autopista (default beta): 2 calzadas separadas, 3 carriles por sentido.
    // - Internas: 2 calzadas x 2 separaciones internas = 4L
    // - Laterales: solo bordes externos = 2L
    internas = L * 4;
    laterales = L * 2;
  } else if(c.via === "carretera"){
    // Carretera: doble sentido, una sola calzada.
    eje = L * 1;
    laterales = L * 2;
  } else {
    // Calle urbana
    if(c.sentido === "unico"){
      laterales = L * 2;
    } else {
      if(c.separador === "si"){
        // Avenida con separador central: 2 calzadas
        // - Laterales: 2 calzadas x 2 laterales = 4L
        // - Internas: 2 calzadas x 1 separacion interna = 2L
        laterales = L * 4;
        internas = L * 2;
      } else {
        // Calle local doble sentido (sin separador)
        eje = L * 1;
        laterales = L * 2;
      }
    }
  }

  const total = eje + laterales + internas;
  const area = total * c.ancho;
  return { eje, laterales, internas, total, area, cfg:c };
}

function renderResultadosLineas(res){
  if(!metradoMetrado || !metradoEje || !metradoLaterales || !metradoInternas || !metradoArea) return;
  const setLinea = (el, valor, emptyText)=>{
    if(!el) return;
    const line = (typeof el.closest === "function") ? el.closest(".metrado-line") : null;
    const v = (typeof valor === "number" && isFinite(valor)) ? Math.max(0, valor) : 0;
    const zero = !(v > 0);
    if(line) line.classList.toggle("is-zero", zero);
    el.textContent = zero ? (emptyText || "No aplica") : formatoML(v);
  };
  if(!res || !res.total){
    metradoMetrado.textContent = "-";
    [metradoEje, metradoLaterales, metradoInternas, metradoArea].forEach((el)=>{
      if(!el) return;
      const line = (typeof el.closest === "function") ? el.closest(".metrado-line") : null;
      if(line) line.classList.remove("is-zero");
      el.textContent = "-";
    });
    return;
  }
  metradoMetrado.textContent = formatoML(res.total);
  setLinea(metradoEje, res.eje, "No aplica");
  setLinea(metradoLaterales, res.laterales, "No aplica");
  setLinea(metradoInternas, res.internas, "No aplica");
  metradoArea.textContent = formatoM2(res.area);
}

function actualizarEstadoBtnCalcular(){
  const listo = (typeof metradoDistanciaM === "number" && metradoDistanciaM > 0) && Array.isArray(metradoPuntos) && metradoPuntos.length >= 2;
  if(btnMetradoCalcular) btnMetradoCalcular.disabled = !listo;
  if(btnMetradoInspeccion) btnMetradoInspeccion.disabled = !listo;
  if(btnMetradoRegistrar) btnMetradoRegistrar.disabled = !listo;
}

function syncMetradoFormState(){
  const via = getRadioValue("metradoVia", "urbana");
  const isUrbana = via === "urbana";
  if(metradoUrbanExtra){
    metradoUrbanExtra.classList.toggle("hidden", !isUrbana);
  }
  if(isUrbana){
    const sentido = getRadioValue("metradoSentido", "unico");
    const disableSep = sentido === "unico";
    try{
      document.querySelectorAll('input[name="metradoSep"]').forEach((i)=>{
        i.disabled = disableSep;
      });
      if(disableSep){
        const no = document.querySelector('input[name="metradoSep"][value="no"]');
        if(no) no.checked = true;
      }
    }catch(e){}
  }
  actualizarEstadoBtnCalcular();
}

function colorLineaMetrado(){
  const c = metradoColor ? String(metradoColor.value || "") : "amarillo";
  if(c === "blanco") return "#ffffff";
  return "#f7d21e";
}

function actualizarResultadosMetrado(){
  if(metradoDistancia){
    metradoDistancia.textContent = metradoDistanciaM ? formatoMetros(metradoDistanciaM) : "-";
  }

  const listo = (typeof metradoDistanciaM === "number" && metradoDistanciaM > 0) && Array.isArray(metradoPuntos) && metradoPuntos.length >= 2;
  metradoCalculoActivo = listo;
  actualizarEstadoBtnCalcular();

  if(!metradoCalculoActivo){
    renderResultadosLineas(null);
    return;
  }

  const cfg = getMetradoConfig();
  const res = calcularLineasMetrado(metradoDistanciaM, cfg);
  metradoUltimoCalculo = res;
  renderResultadosLineas(res);
}

function escapeHtml(str){
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str){
  return escapeHtml(str).replace(/\r|\n/g, " ");
}

function leerNumeroInput(el){
  const val = el ? Number(el.value) : NaN;
  return Number.isFinite(val) ? val : null;
}

function leerTextoInput(el){
  return el && typeof el.value === "string" ? el.value.trim() : "";
}

function leerArchivoDataUrl(file){
  return new Promise((resolve)=>{
    if(!file){
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = function(ev){
      resolve(ev.target && ev.target.result ? ev.target.result : null);
    };
    reader.onerror = function(){ resolve(null); };
    reader.readAsDataURL(file);
  });
}

async function leerFotoInput(input){
  if(!input || !input.files || !input.files[0]) return null;
  return leerArchivoDataUrl(input.files[0]);
}

function limpiarInspeccionForm(){
  if(insUbicacion) insUbicacion.value = "";
  if(insComprende) insComprende.value = "";
  if(insLi) insLi.value = "";
  if(insLd) insLd.value = "";
  if(insEc1) insEc1.value = "";
  if(insEc2) insEc2.value = "";
  [insLiFoto, insLdFoto, insEc1Foto, insEc2Foto].forEach((input)=>{
    if(input) input.value = "";
  });
}

function renderInspeccionPrev(){
  if(!inspeccionPrev || !inspeccionPrevBody) return;
  const last = metradoInspecciones.length ? metradoInspecciones[metradoInspecciones.length - 1] : null;
  if(!last){
    inspeccionPrev.classList.add("hidden");
    inspeccionPrevBody.innerHTML = "";
    return;
  }
  const ubicacion = escapeHtml(last.ubicacion || "Sin ubicacion");
  const comprende = last.comprende ? escapeHtml(last.comprende) : "";
  inspeccionPrevBody.innerHTML = ""
    + "<div><strong>Ubicaci&oacute;n:</strong> " + ubicacion + "</div>"
    + (comprende ? ("<div><strong>Comprende:</strong> " + comprende + "</div>") : "")
    + "<div><strong>Distancia:</strong> " + (last.distancia || 0) + " m</div>"
    + "<div><strong>Lateral izq:</strong> " + (last.retro.li ?? "-") + "</div>"
    + "<div><strong>Lateral der:</strong> " + (last.retro.ld ?? "-") + "</div>"
    + "<div><strong>Eje central 1:</strong> " + (last.retro.ec1 ?? "-") + "</div>"
    + "<div><strong>Eje central 2:</strong> " + (last.retro.ec2 ?? "-") + "</div>";
  inspeccionPrev.classList.remove("hidden");
}

function renderInspeccionRow(label, valor, foto){
  const v = (valor === 0 || valor) ? String(valor) : "-";
  const fotoHtml = foto ? ('<a href="#" class="inspeccion-link btnVerFoto" data-img="' + escapeAttr(foto) + '">Foto</a>') : '<span class="inspeccion-item-sub">Sin foto</span>';
  return ""
    + "<div class=\"inspeccion-item-row\">"
    + "<span>" + escapeHtml(label) + "</span>"
    + "<div><strong>" + escapeHtml(v) + "</strong>" + fotoHtml + "</div>"
    + "</div>";
}

function renderInspeccionList(){
  if(!inspeccionList) return;
  if(!metradoInspecciones.length){
    inspeccionList.innerHTML = "<div class=\"inspeccion-item\"><div class=\"inspeccion-item-title\">Sin mediciones registradas.</div></div>";
    return;
  }
  inspeccionList.innerHTML = metradoInspecciones.map((item, idx)=>{
    const titulo = escapeHtml(item.ubicacion || ("Medicion " + (idx + 1)));
    const comprende = item.comprende ? escapeHtml(item.comprende) : "";
    const fecha = escapeHtml(item.fecha || "");
    const historial = Array.isArray(item.historial) ? item.historial : [];
    const hist = historial.length;
    const dist = item.distancia || 0;
    const historialHtml = hist ? (
      "<div class=\"inspeccion-history-controls\">"
      + "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-history\">Ver historial (" + hist + ")</button>"
      + "</div>"
      + "<div class=\"inspeccion-history hidden\">"
      + historial.map((h)=>(
        "<div class=\"inspeccion-history-item\">"
        + "<span class=\"inspeccion-history-date\">" + escapeHtml(h.fecha || "") + "</span>"
        + "<span class=\"inspeccion-history-text\">" + escapeHtml(h.cambios || "") + "</span>"
        + "</div>"
      )).join("")
      + "</div>"
    ) : "<div class=\"inspeccion-history-empty\">Sin historial de cambios.</div>";
    return ""
      + "<div class=\"inspeccion-item\" data-id=\"" + item.id + "\">"
      +   "<div class=\"inspeccion-item-head\">"
      +     "<div>"
      +       "<div class=\"inspeccion-item-title\">Ubicaci&oacute;n: " + titulo + "</div>"
      +       "<div class=\"inspeccion-item-sub\">Distancia: " + dist + " m" + (fecha ? (" \u00B7 " + fecha) : "") + "</div>"
      +       (comprende ? ("<div class=\"inspeccion-item-sub\">Comprende: " + comprende + "</div>") : "")
      +     "</div>"
      +     "<div class=\"inspeccion-item-actions\">"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-edit\">Editar</button>"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-delete\">Eliminar</button>"
      +     "</div>"
      +   "</div>"
      +   "<div class=\"inspeccion-item-rows\">"
      +     renderInspeccionRow("Lateral izquierda", item.retro.li, item.fotos.li)
      +     renderInspeccionRow("Lateral derecha", item.retro.ld, item.fotos.ld)
      +     renderInspeccionRow("Eje central 1", item.retro.ec1, item.fotos.ec1)
      +     renderInspeccionRow("Eje central 2", item.retro.ec2, item.fotos.ec2)
      +   "</div>"
      +   "<div class=\"inspeccion-item-meta\">Historial: " + hist + " cambios</div>"
      +   historialHtml
      +   "<div class=\"inspeccion-edit hidden\">"
      +     "<label>Distancia (m)</label>"
      +     "<input type=\"number\" class=\"ins-edit-distancia\" min=\"0\" step=\"1\" value=\"" + escapeAttr(dist) + "\">"
      +     "<label>Ubicaci&oacute;n / progresiva</label>"
      +     "<input type=\"text\" class=\"ins-edit-ubicacion\" value=\"" + escapeAttr(item.ubicacion || "") + "\">"
      +     "<label>Comprende</label>"
      +     "<input type=\"text\" class=\"ins-edit-comprende\" value=\"" + escapeAttr(item.comprende || "") + "\">"
      +     "<div class=\"inspeccion-edit-row\" data-field=\"li\">"
      +       "<span>Lateral izquierda</span>"
      +       "<input type=\"number\" class=\"ins-edit-value\" data-field=\"li\" min=\"0\" step=\"1\" value=\"" + escapeAttr(item.retro.li ?? "") + "\">"
      +       "<label class=\"inspeccion-file\"><input type=\"file\" class=\"ins-edit-foto\" data-field=\"li\" accept=\"image/*\"><span>Subir</span></label>"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-clear\" data-field=\"li\">Quitar</button>"
      +     "</div>"
      +     "<div class=\"inspeccion-edit-row\" data-field=\"ld\">"
      +       "<span>Lateral derecha</span>"
      +       "<input type=\"number\" class=\"ins-edit-value\" data-field=\"ld\" min=\"0\" step=\"1\" value=\"" + escapeAttr(item.retro.ld ?? "") + "\">"
      +       "<label class=\"inspeccion-file\"><input type=\"file\" class=\"ins-edit-foto\" data-field=\"ld\" accept=\"image/*\"><span>Subir</span></label>"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-clear\" data-field=\"ld\">Quitar</button>"
      +     "</div>"
      +     "<div class=\"inspeccion-edit-row\" data-field=\"ec1\">"
      +       "<span>Eje central 1</span>"
      +       "<input type=\"number\" class=\"ins-edit-value\" data-field=\"ec1\" min=\"0\" step=\"1\" value=\"" + escapeAttr(item.retro.ec1 ?? "") + "\">"
      +       "<label class=\"inspeccion-file\"><input type=\"file\" class=\"ins-edit-foto\" data-field=\"ec1\" accept=\"image/*\"><span>Subir</span></label>"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-clear\" data-field=\"ec1\">Quitar</button>"
      +     "</div>"
      +     "<div class=\"inspeccion-edit-row\" data-field=\"ec2\">"
      +       "<span>Eje central 2</span>"
      +       "<input type=\"number\" class=\"ins-edit-value\" data-field=\"ec2\" min=\"0\" step=\"1\" value=\"" + escapeAttr(item.retro.ec2 ?? "") + "\">"
      +       "<label class=\"inspeccion-file\"><input type=\"file\" class=\"ins-edit-foto\" data-field=\"ec2\" accept=\"image/*\"><span>Subir</span></label>"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-clear\" data-field=\"ec2\">Quitar</button>"
      +     "</div>"
      +     "<div class=\"inspeccion-edit-actions\">"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-inspeccion-cancel\">Cancelar</button>"
      +       "<button type=\"button\" class=\"map-panel-btn btn-inspeccion-update\">Actualizar</button>"
      +     "</div>"
      +   "</div>"
      + "</div>";
  }).join("");
}

async function crearInspeccionDesdeForm(){
  if(!insDistancia) return null;
  const distancia = Number(insDistancia.value);
  if(!Number.isFinite(distancia) || distancia <= 0){
    alert("Ingresa la distancia de medicion.");
    return null;
  }
  const ubicacion = leerTextoInput(insUbicacion);
  if(!ubicacion){
    alert("Ingresa la ubicacion o progresiva.");
    return null;
  }
  const comprende = leerTextoInput(insComprende);
  const retro = {
    li: leerNumeroInput(insLi),
    ld: leerNumeroInput(insLd),
    ec1: leerNumeroInput(insEc1),
    ec2: leerNumeroInput(insEc2)
  };
  const fotos = {
    li: await leerFotoInput(insLiFoto),
    ld: await leerFotoInput(insLdFoto),
    ec1: await leerFotoInput(insEc1Foto),
    ec2: await leerFotoInput(insEc2Foto)
  };
  const tieneDatos = Boolean(ubicacion || comprende || retro.li || retro.ld || retro.ec1 || retro.ec2 || fotos.li || fotos.ld || fotos.ec1 || fotos.ec2);
  if(!tieneDatos){
    alert("Completa los datos de la inspeccion.");
    return null;
  }
  return {
    id: metradoInspeccionSeq++,
    fecha: hoyISO(),
    distancia,
    ubicacion,
    comprende,
    retro,
    fotos,
    historial: []
  };
}

function abrirModalInspeccion(){
  if(!modalInspeccion) return;
  modalInspeccion.classList.remove("hidden");
  modalInspeccion.setAttribute("aria-hidden","false");
  renderInspeccionPrev();
}

function cerrarModalInspeccion(){
  if(!modalInspeccion) return;
  modalInspeccion.classList.add("hidden");
  modalInspeccion.setAttribute("aria-hidden","true");
}

function abrirModalInspeccionListado(){
  if(!modalInspeccionListado) return;
  renderInspeccionList();
  modalInspeccionListado.classList.remove("hidden");
  modalInspeccionListado.setAttribute("aria-hidden","false");
}

function cerrarModalInspeccionListado(){
  if(!modalInspeccionListado) return;
  modalInspeccionListado.classList.add("hidden");
  modalInspeccionListado.setAttribute("aria-hidden","true");
}

async function actualizarInspeccionDesdeItem(item){
  if(!item) return;
  const id = Number(item.getAttribute("data-id"));
  const ins = metradoInspecciones.find(i => i.id === id);
  if(!ins) return;
  const cambios = [];

  const distInput = item.querySelector(".ins-edit-distancia");
  const newDist = distInput ? Number(distInput.value) : NaN;
  if(Number.isFinite(newDist) && newDist > 0 && newDist !== ins.distancia){
    cambios.push("Distancia: " + ins.distancia + " -> " + newDist);
    ins.distancia = newDist;
  }

  const ubInput = item.querySelector(".ins-edit-ubicacion");
  const newUb = ubInput ? ubInput.value.trim() : "";
  if(newUb && newUb !== ins.ubicacion){
    cambios.push("Ubicacion actualizada");
    ins.ubicacion = newUb;
  }

  const compInput = item.querySelector(".ins-edit-comprende");
  const newComp = compInput ? compInput.value.trim() : "";
  if(newComp !== (ins.comprende || "")){
    cambios.push("Comprende actualizado");
    ins.comprende = newComp;
  }

  const fields = ["li","ld","ec1","ec2"];
  for(const field of fields){
    const valInput = item.querySelector(".ins-edit-value[data-field=\"" + field + "\"]");
    const raw = valInput ? valInput.value : "";
    const newVal = raw === "" ? null : Number(raw);
    const oldVal = ins.retro[field];
    if((newVal === null && oldVal !== null && oldVal !== undefined) || (Number.isFinite(newVal) && newVal !== oldVal)){
      cambios.push("Valor " + field + " actualizado");
      ins.retro[field] = Number.isFinite(newVal) ? newVal : null;
    }

    const clearBtn = item.querySelector(".btn-inspeccion-clear[data-field=\"" + field + "\"]");
    if(clearBtn && clearBtn.classList.contains("is-clear")){
      if(ins.fotos[field]){
        cambios.push("Foto " + field + " eliminada");
      }
      ins.fotos[field] = null;
      clearBtn.classList.remove("is-clear");
    }

    const fileInput = item.querySelector(".ins-edit-foto[data-field=\"" + field + "\"]");
    if(fileInput && fileInput.files && fileInput.files[0]){
      const dataUrl = await leerArchivoDataUrl(fileInput.files[0]);
      if(dataUrl){
        ins.fotos[field] = dataUrl;
        cambios.push("Foto " + field + " actualizada");
      }
      fileInput.value = "";
    }
  }

  if(cambios.length){
    ins.historial = Array.isArray(ins.historial) ? ins.historial : [];
    ins.historial.push({ fecha: hoyISO(), cambios: cambios.join(" | ") });
  }
  renderInspeccionList();
  renderInspeccionPrev();
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

function guardarRutaMetradoRegistrada(){
  try{
    if(typeof L === "undefined") return;
    if(!Array.isArray(metradoPuntos) || metradoPuntos.length < 2) return;
    const layer = asegurarMetradoRegistrosLayer();
    if(!layer) return;
    const color = colorLineaMetrado();
    const weight = metradoPesoPorHighway(metradoSnapHighway);
      L.polyline(metradoPuntos.slice(), {
        color: color,
        weight: weight,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
        className: "metrado-route-saved",
        interactive: false
      }).addTo(layer);
    }catch(e){}
  }

function nombreRegistroMetrado(registro){
  const raw = registro && typeof registro.nombre === "string" ? registro.nombre.trim() : "";
  if(raw) return raw;
  const id = registro && registro.id ? String(registro.id) : "";
  return "Trazado " + (id || "-");
}

function renderMetradoRegistrosOnMap(){
  const layer = asegurarMetradoRegistrosLayer();
  if(!layer) return;
  try{
    if(typeof layer.clearLayers === "function") layer.clearLayers();
  }catch(e){}

  const list = Array.isArray(metradoRegistros) ? metradoRegistros : [];
  list.forEach((registro)=>{
    if(!registro || !Array.isArray(registro.puntos) || registro.puntos.length < 2) return;
    const inspecciones = Array.isArray(registro.inspecciones) ? registro.inspecciones.length : 0;
    const pendiente = !!registro.inspeccion_pendiente || inspecciones === 0;
    const baseColor = registro.color || "#0c426a";
    const color = pendiente ? "#d93f3f" : baseColor;
    const weight = metradoPesoPorHighway(registro.highway || "");
    const opts = {
      color: color,
      weight: weight,
      opacity: pendiente ? 0.75 : 0.85,
      dashArray: pendiente ? "7 10" : null,
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-saved",
      interactive: false
    };
    const line = L.polyline(registro.puntos.slice(), opts).addTo(layer);
    const hitWeight = Math.max(weight + 10, 14);
    const hitLine = L.polyline(registro.puntos.slice(), {
      color: "#000000",
      weight: hitWeight,
      opacity: 0.01,
      lineCap: "round",
      lineJoin: "round",
      className: "metrado-route-hit",
      interactive: true,
      bubblingMouseEvents: false
    }).addTo(layer);
    line._metradoId = registro.id;
    line._metradoHighway = registro.highway || "";
    line._metradoRecord = registro;
    line._metradoBaseStyle = {
      color: opts.color,
      weight: opts.weight,
      opacity: opts.opacity,
      dashArray: opts.dashArray
    };
    line.on("add", ()=>{ aplicarSeleccionMetradoLinea(line, registro); });
    hitLine.on("click", ()=>{
      try{
        if(!projectSelectionActive) return;
        if(chkProyectoMetrado && !chkProyectoMetrado.checked){
          chkProyectoMetrado.checked = true;
        }
        toggleProjectItemSelection("metrado", registro);
        aplicarSeleccionMetradoLinea(line, registro);
      }catch(err){}
    });
    aplicarSeleccionMetradoLinea(line, registro);
  });
}

function aplicarSeleccionMetradoLinea(line, registro){
  if(!line || !line._metradoBaseStyle || !registro) return;
  const base = line._metradoBaseStyle;
  const selected = !!(projectSelectionActive && projectSelection && projectSelection.metrado && projectSelection.metrado.has(String(registro.id || "")));
  const style = selected
    ? { color: base.color, weight: base.weight + 3, opacity: 1, dashArray: base.dashArray }
    : { color: base.color, weight: base.weight, opacity: base.opacity, dashArray: base.dashArray };
  try{
    if(typeof line.setStyle === "function") line.setStyle(style);
  }catch(e){}
}

function aplicarSeleccionMetradoMapa(){
  if(!metradoRegistrosLayer || typeof metradoRegistrosLayer.eachLayer !== "function") return;
  try{
    metradoRegistrosLayer.eachLayer((layer)=>{
      if(layer && layer._metradoRecord){
        aplicarSeleccionMetradoLinea(layer, layer._metradoRecord);
      }
    });
  }catch(e){}
}

function renderMetradoRegistrosList(){
  if(!metradoRegistrosList) return;
  const list = Array.isArray(metradoRegistros) ? metradoRegistros : [];
  if(!list.length){
    metradoRegistrosList.innerHTML = "<div class=\"inspeccion-item\"><div class=\"inspeccion-item-title\">Sin trazos registrados.</div></div>";
    return;
  }
  metradoRegistrosList.innerHTML = list.map((registro)=>{
    const nombre = escapeHtml(nombreRegistroMetrado(registro));
    const fecha = escapeHtml(registro.fecha || "-");
    const dist = Number.isFinite(Number(registro.distancia_m)) ? (Math.round(Number(registro.distancia_m)) + " m") : "-";
    const inspecciones = Array.isArray(registro.inspecciones) ? registro.inspecciones.length : 0;
    const pendiente = !!registro.inspeccion_pendiente || inspecciones === 0;
    const totalLineas = (registro.resultados && Number.isFinite(registro.resultados.total)) ? formatoML(registro.resultados.total) : "-";
    const insText = pendiente
      ? "Inspeccion pendiente"
      : ("Inspeccion: " + inspecciones + " medicion" + (inspecciones === 1 ? "" : "es"));
    const tagClass = pendiente ? "metrado-registro-tag--pending" : "metrado-registro-tag--ok";
    const idAttr = escapeAttr(registro.id);
    return ""
      + "<div class=\"inspeccion-item metrado-registro-item\" data-id=\"" + idAttr + "\">"
      +   "<div class=\"inspeccion-item-head\">"
      +     "<div>"
      +       "<div class=\"inspeccion-item-title\">" + nombre + "</div>"
      +       "<div class=\"inspeccion-item-sub\">Fecha: " + fecha + " \u00B7 Distancia: " + dist + "</div>"
      +     "</div>"
      +     "<div class=\"inspeccion-item-actions\">"
      +       "<button type=\"button\" class=\"inspeccion-btn btn-metrado-focus\" data-id=\"" + idAttr + "\">Ver en mapa</button>"
      +       "<button type=\"button\" class=\"inspeccion-btn inspeccion-btn--danger btn-metrado-delete\" data-id=\"" + idAttr + "\">Eliminar trazo</button>"
      +     "</div>"
      +   "</div>"
      +   "<div class=\"metrado-registro-meta\">"
      +     "<span class=\"metrado-registro-tag " + tagClass + "\">" + escapeHtml(insText) + "</span>"
      +     "<span class=\"metrado-registro-tag\">Total lineas: " + escapeHtml(String(totalLineas)) + "</span>"
      +   "</div>"
      + "</div>";
  }).join("");
}

function actualizarMetradoRegistrosUI(){
  renderMetradoRegistrosOnMap();
  renderMetradoRegistrosList();
  aplicarSeleccionMetradoMapa();
}

function abrirModalMetradoRegistros(){
  if(!modalMetradoRegistros) return;
  renderMetradoRegistrosList();
  modalMetradoRegistros.classList.remove("hidden");
  modalMetradoRegistros.setAttribute("aria-hidden","false");
}

function cerrarModalMetradoRegistros(){
  if(!modalMetradoRegistros) return;
  modalMetradoRegistros.classList.add("hidden");
  modalMetradoRegistros.setAttribute("aria-hidden","true");
}

function focusMetradoRegistro(id){
  if(!id) return;
  const registro = (Array.isArray(metradoRegistros) ? metradoRegistros : []).find(r => String(r.id) === String(id));
  if(!registro || !Array.isArray(registro.puntos) || registro.puntos.length < 2) return;
  try{
    if(typeof map !== "undefined" && map && typeof map.fitBounds === "function"){
      const latlngs = registro.puntos.map(p => L.latLng(p[0], p[1]));
      map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
    }
  }catch(e){}
  try{
    if(metradoRegistrosLayer && typeof metradoRegistrosLayer.eachLayer === "function"){
      metradoRegistrosLayer.eachLayer((layer)=>{
        if(layer && layer.setStyle && layer._metradoBaseStyle){
          layer.setStyle({
            color: layer._metradoBaseStyle.color,
            weight: layer._metradoBaseStyle.weight,
            opacity: layer._metradoBaseStyle.opacity,
            dashArray: layer._metradoBaseStyle.dashArray
          });
        }
      });
      metradoRegistrosLayer.eachLayer((layer)=>{
        if(layer && layer.setStyle && String(layer._metradoId) === String(id)){
          const baseWeight = (layer._metradoBaseStyle && Number.isFinite(layer._metradoBaseStyle.weight))
            ? layer._metradoBaseStyle.weight
            : 7;
          layer.setStyle({ weight: baseWeight + 3, opacity: 1 });
        }
      });
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
  metradoSnapLast = null;
  metradoSnapHover = null;
  metradoSnapHighway = "";
  metradoSnapFailReason = "";
  metradoInicioLatLng = null;
  metradoFinLatLng = null;
  metradoDistanciaM = 0;
  metradoPicking = "";
  metradoLoading = false;
  metradoCalculoActivo = false;
  metradoUltimoCalculo = null;
  metradoInspecciones = [];
  if(metradoNombre) metradoNombre.value = "";
  renderInspeccionPrev();
  renderInspeccionList();
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
  const weight = metradoPesoPorHighway(metradoSnapHighway);
  const outlineWeight = weight + 4;
  const flowWeight = Math.max(3, weight - 3);
    if(!metradoRouteOutline){
      metradoRouteOutline = L.polyline(puntos, {
        color: "#0b2230",
        weight: outlineWeight,
        opacity: 0.22,
        lineCap: "round",
        lineJoin: "round",
        className: "metrado-route-outline",
        interactive: false
      }).addTo(layer);
    } else {
      metradoRouteOutline.setLatLngs(puntos);
      if(typeof metradoRouteOutline.setStyle === "function"){
        metradoRouteOutline.setStyle({ weight: outlineWeight });
      }
    }
    if(!metradoRouteLine){
      metradoRouteLine = L.polyline(puntos, {
        color: color,
        weight: weight,
        opacity: 0.88,
        lineCap: "round",
        lineJoin: "round",
        className: "metrado-route-line",
        interactive: false
      }).addTo(layer);
    } else {
      metradoRouteLine.setLatLngs(puntos);
      if(typeof metradoRouteLine.setStyle === "function"){
        metradoRouteLine.setStyle({ weight: weight });
      }
    }

  const flowColor = (color === "#ffffff") ? "rgba(12,66,106,0.70)" : "rgba(255,255,255,0.70)";
    if(!metradoRouteFlow){
      metradoRouteFlow = L.polyline(puntos, {
        color: flowColor,
        weight: flowWeight,
        opacity: 0.70,
        dashArray: "10 16",
        lineCap: "round",
        lineJoin: "round",
        className: "metrado-route-flow",
        interactive: false
      }).addTo(layer);
    } else {
    metradoRouteFlow.setLatLngs(puntos);
    if(typeof metradoRouteFlow.setStyle === "function"){
      metradoRouteFlow.setStyle({ color: flowColor, weight: flowWeight });
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

function pushPuntoMetrado(latlng){
  if(!latlng) return false;
  try{
    const last = metradoPuntos.length ? metradoPuntos[metradoPuntos.length - 1] : null;
    if(last && typeof map !== "undefined" && map && typeof map.distance === "function"){
      const d = map.distance(last, latlng);
      if(d < 1.5) return false;
    }
  }catch(e){}
  metradoPuntos.push(latlng);
  return true;
}

function agregarPuntosMetrado(puntos){
  const list = Array.isArray(puntos) ? puntos : [];
  let added = false;
  list.forEach((latlng)=>{
    if(pushPuntoMetrado(latlng)) added = true;
  });
  if(added) actualizarTrazadoMetrado();
  return added;
}

function agregarPuntoMetrado(rawLatLng){
  if(!rawLatLng) return false;
  return agregarPuntosMetrado([rawLatLng]);
}

function agregarPuntoMetradoSnapped(snap){
  if(!snap || !snap.latlng) return false;
  metradoSnapFailReason = "";
  let puntos = [];
  if(metradoSnapLast && metradoSnapLast.featureIndex === snap.featureIndex){
    const feature = metradoSnapFeatures[snap.featureIndex];
    const coords = feature ? feature.coords : null;
    if(coords && coords.length){
      const forward = metradoSnapLast.coordIndex <= snap.coordIndex;
      const start = forward ? metradoSnapLast.coordIndex : snap.coordIndex;
      const end = forward ? snap.coordIndex : metradoSnapLast.coordIndex;
      if(start === end){
        puntos = [snap.latlng];
      } else {
        let total = 0;
        let last = null;
        let limitReached = false;
        for(let i = start; i <= end; i++){
          const idx = forward ? i : (start + end - i);
          const pt = coords[idx];
          if(!pt || pt.length < 2) continue;
          const latlng = L.latLng(pt[0], pt[1]);
          if(last){
            const dist = map.distance(last, latlng);
            if(Number.isFinite(dist) && total + dist > METRADO_SNAP_MAX_SEG_M){
              limitReached = true;
              break;
            }
            if(Number.isFinite(dist)) total += dist;
          }
          puntos.push(latlng);
          last = latlng;
        }
        if(limitReached){
          metradoSnapFailReason = "tramo";
        }
        if(puntos.length && metradoSnapLast.latlng){
          puntos[0] = metradoSnapLast.latlng;
        }
        if(puntos.length && snap.latlng){
          puntos[puntos.length - 1] = snap.latlng;
        }
        if(metradoPuntos.length && puntos.length){
          puntos = puntos.slice(1);
        }
        puntos = limitarSegmentoMetrado(puntos);
      }
    }
  } else {
    if(metradoPuntos.length){
      const lastPoint = metradoPuntos[metradoPuntos.length - 1];
      const jump = map.distance(lastPoint, snap.latlng);
      const jumpLimit = Math.max(METRADO_SNAP_MAX_JUMP_M, metradoSnapWidthMeters(snap.highway) * 2.2);
      if(jump > jumpLimit){
        const puente = buscarConexionMetrado(metradoSnapLast, snap);
        if(puente && Array.isArray(puente.puntos) && puente.puntos.length){
          puntos = puente.puntos.slice();
          if(puntos.length && snap.latlng){
            puntos.push(snap.latlng);
          }
        } else if(puente){
          puntos = [snap.latlng];
        } else {
          metradoSnapFailReason = "salto";
          return false;
        }
      }
    }
    if(!puntos.length) puntos = [snap.latlng];
  }
  const ok = agregarPuntosMetrado(puntos);
  if(ok){
    metradoSnapLast = {
      featureIndex: snap.featureIndex,
      coordIndex: snap.coordIndex,
      segmentIndex: snap.segmentIndex,
      latlng: snap.latlng
    };
    metradoSnapHighway = snap.highway || metradoSnapHighway;
  }
  return ok;
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
  if(metradoOptionsDetails) metradoOptionsDetails.open = true;
  if(btnMapMetrado) btnMapMetrado.classList.add("active");
  if(visualizacionPanel) visualizacionPanel.classList.add("hidden");
    if(btnMapVisualizacion) btnMapVisualizacion.classList.remove("active");
    if(visualizacionAvanzada) visualizacionAvanzada.classList.add("hidden");
    try{ syncMetradoFormState(); }catch(e){}
    try{ actualizarResultadosMetrado(); }catch(e){}
    if(metradoSnapEnabled) cargarViasMetrado();
    try{ actualizarMetradoRegistrosUI(); }catch(e){}
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

let proyectosCache = [];
let proyectoActivoId = "";
let projectSelectionActive = false;
let projectSelection = {
  vertical: new Set(),
  horizontal: new Set(),
  mobiliario: new Set(),
  metrado: new Set()
};
let proyectoEditId = "";
const APU_SOURCES = {
  transito: "src/senales-de-transito.json",
  marcas: "src/marcas-viales.json",
  mobiliario: "src/mobiliario-vial.json"
};
const apuState = {
  loaded: false,
  data: {},
  categoria: "transito",
  selectedCodigo: ""
};
const APU_MAP_TRANSITO = {
  preventiva: "1.01",
  reglamentaria: "1.02",
  informativa: "1.03"
};
const APU_MAP_MOBILIARIO = {
  bolardo: "3.02",
  tachas: "3.01",
  tachon: "3.03"
};
const APU_MAP_MARCAS = {
  termoplastico_spray: "13.01",
  termoplastico_extrusion: "13.02",
  pintura_trafico: "13.05"
};

function apuToNumber(value){
  if(value === null || value === undefined || value === "") return NaN;
  const num = Number(String(value).replace(",", "."));
  return Number.isFinite(num) ? num : NaN;
}

function apuNormalizarLista(raw){
  if(Array.isArray(raw)) return raw;
  if(raw && Array.isArray(raw.detalle)) return raw.detalle;
  return [];
}

function apuSumarParciales(items){
  let total = 0;
  let has = false;
  (items || []).forEach((it)=>{
    const parcialRaw = it.parcial ?? it.parcial_total ?? it.total ?? null;
    const parcialNum = apuToNumber(parcialRaw);
    if(Number.isFinite(parcialNum)){
      total += parcialNum;
      has = true;
      return;
    }
    const cantidad = apuToNumber(it.cantidad ?? it.hh ?? it.factor ?? it.cant ?? "");
    const precio = apuToNumber(it.precio_unitario ?? it.precio ?? it.base ?? "");
    if(Number.isFinite(cantidad) && Number.isFinite(precio)){
      total += cantidad * precio;
      has = true;
    }
  });
  return { total, has };
}

function calcularCostoDirectoPartida(partida){
  if(!partida) return NaN;
  let total = 0;
  let hasAny = false;
  const materiales = apuNormalizarLista(partida.materiales);
  const equipos = apuNormalizarLista(partida.equipos);
  const mano = apuNormalizarLista(partida.mano_obra);
  const matSum = apuSumarParciales(materiales);
  if(matSum.has){ total += matSum.total; hasAny = true; }
  const eqSum = apuSumarParciales(equipos);
  if(eqSum.has){ total += eqSum.total; hasAny = true; }
  if(mano.length){
    const moSum = apuSumarParciales(mano);
    if(moSum.has){ total += moSum.total; hasAny = true; }
  } else if(partida.mano_obra && partida.mano_obra.subtotal !== undefined){
    const moSub = apuToNumber(partida.mano_obra.subtotal);
    if(Number.isFinite(moSub)){ total += moSub; hasAny = true; }
  }
  if(hasAny) return total;
  const fallback = apuToNumber(partida.costo_directo);
  return Number.isFinite(fallback) ? fallback : NaN;
}

function normalizarApuKey(texto){
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function buscarPartidaApu(categoria, codigo){
  if(!apuState.loaded) return null;
  const pack = apuState.data[categoria];
  const partidas = pack && Array.isArray(pack.partidas) ? pack.partidas : [];
  return partidas.find(p => String(p.codigo || "") === String(codigo || "")) || null;
}

function obtenerCostoDirectoApu(categoria, codigo){
  const partida = buscarPartidaApu(categoria, codigo);
  if(!partida) return NaN;
  return calcularCostoDirectoPartida(partida);
}

function obtenerCostoApuSenal(modo, senal){
  if(!apuState.loaded || !senal) return NaN;
  if(modo === "vertical"){
    const key = normalizarApuKey(senal.tipo || senal.categoria || "");
    const codigo = APU_MAP_TRANSITO[key];
    if(codigo) return obtenerCostoDirectoApu("transito", codigo);
  }
  if(modo === "mobiliario"){
    const key = normalizarApuKey(senal.nombre || "");
    const codigo = APU_MAP_MOBILIARIO[key];
    if(codigo) return obtenerCostoDirectoApu("mobiliario", codigo);
  }
  return NaN;
}

function etiquetaPinturaMetrado(tipo){
  if(tipo === "termoplastico_spray") return "Termoplastico en spray";
  if(tipo === "termoplastico_extrusion") return "Termoplastico en extrusion";
  if(tipo === "pintura_trafico") return "Pintura trafico";
  if(!tipo) return "Pintura trafico";
  return "Pintura";
}

function obtenerCostoApuMetrado(registro){
  if(!registro) return NaN;
  const tipo = String(registro.pintura_tipo || "pintura_trafico");
  const codigo = APU_MAP_MARCAS[tipo];
  if(!codigo) return NaN;
  const costoUnitario = obtenerCostoDirectoApu("marcas", codigo);
  const area = registro.resultados && Number.isFinite(Number(registro.resultados.area))
    ? Number(registro.resultados.area)
    : 0;
  if(!Number.isFinite(costoUnitario) || !(area > 0)) return NaN;
  return costoUnitario * area;
}

function obtenerApuRelacion(kind, item){
  if(!item) return null;
  if(kind === "vertical"){
    const key = normalizarApuKey(item.tipo || item.categoria || "");
    const codigo = APU_MAP_TRANSITO[key] || "";
    return { categoria: "transito", codigo };
  }
  if(kind === "mobiliario"){
    const key = normalizarApuKey(item.nombre || "");
    const codigo = APU_MAP_MOBILIARIO[key] || "";
    return { categoria: "mobiliario", codigo };
  }
  if(kind === "metrado"){
    const tipo = String(item.pintura_tipo || "pintura_trafico");
    const codigo = APU_MAP_MARCAS[tipo] || APU_MAP_MARCAS.pintura_trafico || "";
    return { categoria: "marcas", codigo };
  }
  if(kind === "horizontal"){
    const tipo = String(item.pintura_tipo || "pintura_trafico");
    const codigo = APU_MAP_MARCAS[tipo] || APU_MAP_MARCAS.pintura_trafico || "";
    return { categoria: "marcas", codigo };
  }
  return null;
}

function cloneSenales(list){
  if(!Array.isArray(list)) return [];
  return list.map(s => Object.assign({}, s));
}

function cloneMetradoRegistros(list){
  const base = Array.isArray(list) ? list : [];
  try{
    return JSON.parse(JSON.stringify(base));
  }catch(e){
    return base.map(r => Object.assign({}, r));
  }
}

function obtenerSeedProyectos(){
  try{
    if(typeof proyectosSeed === "undefined" || !Array.isArray(proyectosSeed) || !proyectosSeed.length){
      return null;
    }
    const meta = (typeof proyectosSeedMeta === "object" && proyectosSeedMeta) ? proyectosSeedMeta : {};
    const scopeD = (typeof scopeDistrito !== "undefined") ? scopeDistrito : "";
    if(meta && meta.distrito){
      if(!scopeD) return null;
      if(String(meta.distrito).toLowerCase() !== String(scopeD).toLowerCase()) return null;
    }
    const filtered = proyectosSeed.filter((p)=>{
      const pid = String(p && p.id || "");
      if(pid === "proj-demo-lince") return false;
      return true;
    });
    if(!filtered.length) return null;
    let cloned = null;
    try{
      cloned = JSON.parse(JSON.stringify(filtered));
    }catch(e){
      cloned = filtered.map(p => Object.assign({}, p));
    }
    let active = (typeof proyectoActivoSeedId !== "undefined") ? String(proyectoActivoSeedId || "") : "";
    if(active && !cloned.some(p => String(p && p.id || "") === active)){
      active = "";
    }
    if(!active){
      active = cloned[0] ? String(cloned[0].id || "") : "";
    }
    cloned.forEach((p)=>{ if(!Array.isArray(p.metradoRegistros)) p.metradoRegistros = []; });
    return { proyectos: cloned, activo: active };
  }catch(e){
    return null;
  }
}

function reemplazarSenales(target, source){
  if(!Array.isArray(target)) return;
  target.length = 0;
  (Array.isArray(source) ? source : []).forEach((s)=> target.push(Object.assign({}, s)));
}

const BASE_SENALES = (function(){
  return {
    horizontal: cloneSenales(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []),
    vertical: cloneSenales(typeof senalesVertical !== "undefined" ? senalesVertical : []),
    mobiliario: cloneSenales(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : [])
  };
})();

function crearProyectoBase(nombre){
  const id = "proj-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6);
  return {
    id,
    nombre: nombre || "Proyecto",
    creado: hoyISO(),
    senalesHorizontal: cloneSenales(BASE_SENALES.horizontal),
    senalesVertical: cloneSenales(BASE_SENALES.vertical),
    senalesMobiliario: cloneSenales(BASE_SENALES.mobiliario),
    metradoRegistros: []
  };
}

function crearProyectoDemo(nombre, distrito){
  const nowId = "proj-demo-lince";
  const horiz = cloneSenales(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []);
  const vert = cloneSenales(typeof senalesVertical !== "undefined" ? senalesVertical : []);
  const mob = cloneSenales(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : []);
  const met = cloneMetradoRegistros(typeof metradoRegistros !== "undefined" ? metradoRegistros : []);
  return {
    id: nowId,
    nombre: nombre || "Proyecto modelo",
    creado: hoyISO(),
    distrito: distrito || "Lince",
    senalesHorizontal: horiz,
    senalesVertical: vert,
    senalesMobiliario: mob,
    metradoRegistros: met
  };
}

function asegurarProyectoDemo(){
  const nombreDemo = "Av.Arequipa con Av.Juan Pardo y Jr.Tomas Guido";
  const distritoDemo = "Lince";
  const existsIdx = proyectosCache.findIndex(p => (p.id === "proj-demo-lince") || (String(p.nombre||"").toLowerCase() === nombreDemo.toLowerCase()));
  const nuevo = crearProyectoDemo(nombreDemo, distritoDemo);
  if(existsIdx >= 0){
    proyectosCache[existsIdx] = nuevo;
  }else{
    proyectosCache.unshift(nuevo);
  }
  proyectoActivoId = nuevo.id;
  aplicarProyecto(nuevo);
  guardarProyectos();
  actualizarSelectProyecto();
  actualizarInvProyectoSelect();
  actualizarDashProyectoSelect();
}

function guardarProyectos(){
  if(!window.UrbbisApi || typeof syncProyectoBackend !== "function") return;
  proyectosCache.forEach((p)=> syncProyectoBackend(p));
}

async function cargarProyectos(){
  proyectosCache = [];
  proyectoActivoId = "";
  const canApi = window.UrbbisApi && typeof window.UrbbisApi.getProjects === "function";
  if(canApi){
    try{
      const items = await window.UrbbisApi.getProjects();
      if(Array.isArray(items) && items.length){
        proyectosCache = items.map(proyectoFromApi).filter(Boolean);
        proyectoActivoId = proyectosCache[0] ? proyectosCache[0].id : "";
        try{ window.__projectsBackendLoaded = true; }catch(e){}
        return;
      }
    }catch(e){
      console.warn("No se pudo cargar proyectos desde backend.", e);
    }
  }

  const seed = obtenerSeedProyectos();
  if(seed && Array.isArray(seed.proyectos) && seed.proyectos.length){
    proyectosCache = seed.proyectos;
    proyectoActivoId = seed.activo || "";
    guardarProyectos();
    return;
  }

  proyectosCache = [
    crearProyectoBase("Registro senalizacion 2026"),
    crearProyectoBase("Registro senalizacion 2025")
  ];
  proyectoActivoId = proyectosCache[0].id;
  guardarProyectos();
}

function aplicarProyecto(proj){
  if(!proj) return;
  let horiz = proj.senalesHorizontal;
  let vert = proj.senalesVertical;
  let mob = proj.senalesMobiliario;
  let met = proj.metradoRegistros;
  if(esProyectoBaseNombre(proj.nombre)){
    const year = obtenerAnioProyectoBase(proj.nombre);
    horiz = filtrarSenalesPorAnioYScope(horiz, year);
    vert = filtrarSenalesPorAnioYScope(vert, year);
    mob = filtrarSenalesPorAnioYScope(mob, year);
    met = filtrarMetradoPorAnio(met, year);
  }
  reemplazarSenales(senalesHorizontal, horiz);
  reemplazarSenales(senalesVertical, vert);
  reemplazarSenales(senalesMobiliario, mob);
  metradoRegistros = cloneMetradoRegistros(met);
  actualizarMetradoRegistrosUI();
  try{ limpiarRutaMetrado(); }catch(e){}
  proyectoActivoId = proj.id;
  if(selectProyecto) selectProyecto.value = proj.id;
  guardarProyectos();
  if(typeof renderizarTodo === "function") renderizarTodo();
  if(typeof updateReportes === "function") updateReportes();
  if(typeof updateDashboard === "function") updateDashboard();
  if(typeof updateInversion === "function") updateInversion();
}

function actualizarSelectProyecto(){
  if(!selectProyecto) return;
  selectProyecto.innerHTML = proyectosCache.map(p => (
    '<option value="' + p.id + '">' + String(p.nombre || "Proyecto") + '</option>'
  )).join("");
}

function setProyectoActivoPorId(id){
  const proj = proyectosCache.find(p => p.id === id) || proyectosCache[0];
  if(!proj) return;
  aplicarProyecto(proj);
}

function esProyectoBaseNombre(nombre){
  const n = String(nombre || "").toLowerCase().trim();
  return n === "registro senalizacion 2026" || n === "registro senalizacion 2025";
}

function obtenerAnioProyectoBase(nombre){
  const m = String(nombre || "").match(/(20\d{2})/);
  return m ? Number(m[1]) : null;
}

function normalizarNombreSimple(valor){
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function mismoDistrito(a, b){
  if(!a || !b) return false;
  try{
    if(typeof normalizarNombreLugar === "function"){
      return normalizarNombreLugar(a) === normalizarNombreLugar(b);
    }
  }catch(e){}
  return normalizarNombreSimple(a) === normalizarNombreSimple(b);
}

function anioDesdeFecha(valor){
  const m = String(valor || "").match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

function filtrarSenalesPorAnioYScope(list, year){
  const base = Array.isArray(list) ? list : [];
  const scopeD = (typeof scopeDistrito !== "undefined") ? scopeDistrito : "";
  return base.filter((s)=>{
    if(scopeD){
      const dist = s && (s.zona || s.distrito || "");
      if(dist && !mismoDistrito(dist, scopeD)) return false;
    }
    if(!year) return true;
    const fecha = s && (s.fecha_colocacion || s.fecha || s.fecha_instalacion || s.creado || "");
    const anio = anioDesdeFecha(fecha);
    return !anio || anio === year;
  });
}

function filtrarMetradoPorAnio(list, year){
  const base = Array.isArray(list) ? list : [];
  if(!year) return base;
  return base.filter((r)=>{
    const fecha = r && (r.fecha || r.creado || "");
    const anio = anioDesdeFecha(fecha);
    return !anio || anio === year;
  });
}

function sincronizarProyectosBase(){
  let changed = false;
  const seed = obtenerSeedProyectos();
  const seedMap = seed && Array.isArray(seed.proyectos)
    ? new Map(seed.proyectos.map(p => [String(p && p.nombre || "").toLowerCase().trim(), p]))
    : null;
  (proyectosCache || []).forEach((p)=>{
    if(!esProyectoBaseNombre(p.nombre)) return;
    p.senalesHorizontal = cloneSenales(BASE_SENALES.horizontal);
    p.senalesVertical = cloneSenales(BASE_SENALES.vertical);
    p.senalesMobiliario = cloneSenales(BASE_SENALES.mobiliario);
    if(!Array.isArray(p.metradoRegistros) || p.metradoRegistros.length === 0){
      if(seedMap){
        const key = String(p && p.nombre || "").toLowerCase().trim();
        const seedProj = seedMap.get(key);
        if(seedProj && Array.isArray(seedProj.metradoRegistros) && seedProj.metradoRegistros.length){
          p.metradoRegistros = cloneMetradoRegistros(seedProj.metradoRegistros);
        } else {
          p.metradoRegistros = [];
        }
      } else {
        p.metradoRegistros = [];
      }
    }
    p.baseSeeded = true;
    changed = true;
  });
  return changed;
}

async function initProyectos(){
  if(rolActual !== "municipal"){
    proyectosCache = [];
    proyectoActivoId = "";
    if(selectProyecto) selectProyecto.innerHTML = "";
    metradoRegistros = [];
    actualizarMetradoRegistrosUI();
    try{ limpiarRutaMetrado(); }catch(e){}
    updateProjectUI();
    return;
  }
  await cargarProyectos();

  const scopeD = (typeof scopeDistrito !== "undefined") ? scopeDistrito : "";
  const scopeLower = String(scopeD || "").toLowerCase();
  let changed = false;

  // Quitar demo si existe (en cualquier distrito)
  const idxDemo = proyectosCache.findIndex(p =>
    (p.id === "proj-demo-lince")
    || (p.demoSeeded && p.demoSource === "urbbis-20260122")
  );
  if(idxDemo >= 0){
    proyectosCache.splice(idxDemo, 1);
    if(proyectoActivoId === "proj-demo-lince"){
      proyectoActivoId = "";
    }
    changed = true;
  }

  // Asegurar proyectos base
  const nombresBase = ["Registro senalizacion 2026", "Registro senalizacion 2025"];
  const existing = new Set((proyectosCache || []).map(p => String(p.nombre || "").toLowerCase()));
  const nuevos = [];
  nombresBase.forEach((nombre)=>{
    if(existing.has(nombre.toLowerCase())) return;
    const proj = crearProyectoBase(nombre);
    if(scopeD) proj.distrito = scopeD;
    nuevos.push(proj);
  });
  if(nuevos.length){
    proyectosCache.unshift(...nuevos);
    if(!proyectoActivoId){
      proyectoActivoId = nuevos[0].id;
    }
    changed = true;
  }
  if(sincronizarProyectosBase()) changed = true;
  if(changed) guardarProyectos();

  actualizarSelectProyecto();
  if(!proyectoActivoId || !proyectosCache.some(p => p.id === proyectoActivoId)){
    proyectoActivoId = proyectosCache[0] ? proyectosCache[0].id : "";
  }
  if(proyectoActivoId){
    setProyectoActivoPorId(proyectoActivoId);
  }
  updateProjectUI();
}

function updateProjectUI(){
  if(!projectSwitcher) return;
  const visible = rolActual === "municipal" && proyectosCache.length > 0;
  projectSwitcher.classList.toggle("hidden", !visible);
  if(btnCambiarProyecto) btnCambiarProyecto.disabled = !visible;
  if(btnAgregarProyecto) btnAgregarProyecto.disabled = !visible;
}

function guardarProyectoActivo(){
  if(!proyectoActivoId) return;
  const idx = proyectosCache.findIndex(p => p.id === proyectoActivoId);
  if(idx < 0) return;
  proyectosCache[idx].senalesHorizontal = cloneSenales(senalesHorizontal);
  proyectosCache[idx].senalesVertical = cloneSenales(senalesVertical);
  proyectosCache[idx].senalesMobiliario = cloneSenales(senalesMobiliario);
  proyectosCache[idx].metradoRegistros = cloneMetradoRegistros(metradoRegistros);
  guardarProyectos();
}

window.initProyectos = initProyectos;
window.guardarProyectoActivo = guardarProyectoActivo;
window.updateProjectUI = updateProjectUI;

function resetProjectSelection(){
  projectSelection = {
    vertical: new Set(),
    horizontal: new Set(),
    mobiliario: new Set(),
    metrado: new Set()
  };
}

function cargarSeleccionDesdeProyecto(proj){
  resetProjectSelection();
  if(!proj) return;
  if(Array.isArray(proj.senalesVertical)){
    proj.senalesVertical.forEach(s => projectSelection.vertical.add(String(s.id || "")));
  }
  if(Array.isArray(proj.senalesHorizontal)){
    proj.senalesHorizontal.forEach(s => projectSelection.horizontal.add(String(s.id || "")));
  }
  if(Array.isArray(proj.senalesMobiliario)){
    proj.senalesMobiliario.forEach(s => projectSelection.mobiliario.add(String(s.id || "")));
  }
  if(Array.isArray(proj.metradoRegistros)){
    proj.metradoRegistros.forEach(r => projectSelection.metrado.add(String(r.id || "")));
  }
}

function isProjectSelectionActive(){
  return !!projectSelectionActive;
}

function isProjectItemSelected(modo, id){
  const key = String(id || "");
  if(!key) return false;
  const set = projectSelection && projectSelection[modo];
  return !!(set && set.has(key));
}

function toggleProjectItemSelection(modo, item){
  if(!projectSelectionActive || !item) return false;
  const key = String(item.id || "");
  if(!key) return false;
  if(modo === "vertical" && chkProyectoTransito && !chkProyectoTransito.checked) return false;
  if(modo === "horizontal" && chkProyectoMarcas && !chkProyectoMarcas.checked) return false;
  if(modo === "mobiliario" && chkProyectoMobiliario && !chkProyectoMobiliario.checked) return false;
  if(modo === "metrado" && chkProyectoMetrado && !chkProyectoMetrado.checked) return false;
  const set = projectSelection && projectSelection[modo];
  if(!set) return false;
  if(set.has(key)) set.delete(key);
  else set.add(key);
  updateProyectoPreview();
  return true;
}

window.isProjectSelectionActive = isProjectSelectionActive;
window.isProjectItemSelected = isProjectItemSelected;
window.toggleProjectItemSelection = toggleProjectItemSelection;

function labelEstadoProyecto(estado){
  if(typeof labelEstadoSeguro === "function") return labelEstadoSeguro(estado);
  if(estado === "nueva") return "Operativa";
  if(estado === "antigua") return "Deteriorada";
  if(estado === "sin_senal") return "No operativa";
  return estado || "-";
}

function getProyectoSeleccionadoActivos(){
  const items = [];
  const filtrarPorSet = (list, set)=> {
    if(!projectSelectionActive) return Array.isArray(list) ? list : [];
    if(!set || !set.size) return [];
    return (Array.isArray(list) ? list : []).filter(s => set.has(String(s.id || "")));
  };
  const addItems = (list, tipoLabel, modoKey)=> {
    (Array.isArray(list) ? list : []).forEach((s)=>{
      const distrito = s.zona || s.distrito || "";
      const region = s.region || (typeof regionPorDistrito === "function" ? (regionPorDistrito(distrito) || "") : "");
      const ubicacion = (distrito || region) ? (String(distrito || "-") + (region ? " / " + region : "")) : "-";
      const nombre = s.nombre || s.tipo || s.icono || "Activo";
      items.push({
        id: String(s.id || ""),
        modo: modoKey || "",
        tipo: tipoLabel,
        nombre,
        estado: s.estado,
        verificado: !!s.inspeccionFoto,
        ubicacion
      });
    });
  };
  if(chkProyectoTransito && chkProyectoTransito.checked){
    const base = typeof senalesVertical !== "undefined" ? senalesVertical : [];
    addItems(filtrarPorSet(base, projectSelection.vertical), "Senales de transito", "vertical");
  }
  if(chkProyectoMarcas && chkProyectoMarcas.checked){
    const base = typeof senalesHorizontal !== "undefined" ? senalesHorizontal : [];
    addItems(filtrarPorSet(base, projectSelection.horizontal), "Marcas viales", "horizontal");
  }
  if(chkProyectoMobiliario && chkProyectoMobiliario.checked){
    const base = typeof senalesMobiliario !== "undefined" ? senalesMobiliario : [];
    addItems(filtrarPorSet(base, projectSelection.mobiliario), "Mobiliario vial", "mobiliario");
  }
  if(chkProyectoMetrado && chkProyectoMetrado.checked){
    const base = Array.isArray(metradoRegistros) ? metradoRegistros : [];
    (filtrarPorSet(base, projectSelection.metrado)).forEach((r)=>{
      const nombre = nombreRegistroMetrado(r);
      const insCount = Array.isArray(r.inspecciones) ? r.inspecciones.length : 0;
      const pendiente = !!r.inspeccion_pendiente || insCount === 0;
      const estado = pendiente ? "Pendiente" : "Con inspeccion";
      const ubicacion = r.highway ? ("Via: " + r.highway) : (r.config && r.config.via ? ("Via: " + r.config.via) : "-");
      items.push({
        id: String(r.id || ""),
        modo: "metrado",
        tipo: "Trazos (lineas y guionadas)",
        nombre,
        estado,
        verificado: !pendiente,
        ubicacion
      });
    });
  }
  return items;
}

function updateProyectoPreview(){
  const name = inputProyectoNombre ? inputProyectoNombre.value.trim() : "";
  const inicio = inputProyectoInicio ? inputProyectoInicio.value : "";
  const fin = inputProyectoFin ? inputProyectoFin.value : "";
  let cleared = false;
  if(projectSelectionActive){
    if(chkProyectoTransito && !chkProyectoTransito.checked && projectSelection.vertical.size){
      projectSelection.vertical.clear();
      cleared = true;
    }
    if(chkProyectoMarcas && !chkProyectoMarcas.checked && projectSelection.horizontal.size){
      projectSelection.horizontal.clear();
      cleared = true;
    }
    if(chkProyectoMobiliario && !chkProyectoMobiliario.checked && projectSelection.mobiliario.size){
      projectSelection.mobiliario.clear();
      cleared = true;
    }
    if(chkProyectoMetrado && !chkProyectoMetrado.checked && projectSelection.metrado.size){
      projectSelection.metrado.clear();
      cleared = true;
    }
  }
  if(projectPreviewName) projectPreviewName.textContent = name || "Sin nombre";
  if(projectPreviewDates){
    if(inicio || fin){
      const iniTxt = inicio ? ("Inicio: " + inicio) : "Inicio: -";
      const finTxt = fin ? ("Fin: " + fin) : "Fin: -";
      projectPreviewDates.textContent = iniTxt + " | " + finTxt;
    } else {
      projectPreviewDates.textContent = "Sin fechas";
    }
  }
  aplicarSeleccionMetradoMapa();
  const data = getProyectoSeleccionadoActivos();
  if(projectPreviewCount) projectPreviewCount.textContent = data.length + " activos";
  const tbody = tablaProyectoPreview ? tablaProyectoPreview.querySelector("tbody") : null;
  if(tbody){
    if(!data.length){
      tbody.innerHTML = "<tr><td colspan=\"6\">Sin activos seleccionados.</td></tr>";
    } else {
      tbody.innerHTML = data.map((s)=>(
        "<tr>"
        + "<td>" + escapeHtml(s.tipo) + "</td>"
        + "<td>" + escapeHtml(s.nombre) + "</td>"
        + "<td>" + escapeHtml(labelEstadoProyecto(s.estado)) + "</td>"
        + "<td>" + (s.verificado ? "Verificado" : "No verificado") + "</td>"
        + "<td>" + escapeHtml(s.ubicacion) + "</td>"
        + "<td><button type=\"button\" class=\"project-remove-btn\" data-modo=\"" + escapeAttr(s.modo) + "\" data-id=\"" + escapeAttr(s.id) + "\">Quitar</button></td>"
        + "</tr>"
      )).join("");
    }
  }
  if(btnProyectoGuardar){
    btnProyectoGuardar.disabled = !name || data.length === 0;
  }
  if(cleared){
    try{ if(typeof renderizarTodo === "function"){ renderizarTodo(); } }catch(e){}
  }
}

function abrirModalProyecto(){
  if(!modalProyecto) return;
  projectSelectionActive = true;
  proyectoEditId = "";
  resetProjectSelection();
  if(inputProyectoNombre) inputProyectoNombre.value = "";
  if(inputProyectoInicio) inputProyectoInicio.value = hoyISO();
  if(inputProyectoFin) inputProyectoFin.value = "";
  if(chkProyectoTransito) chkProyectoTransito.checked = true;
  if(chkProyectoMarcas) chkProyectoMarcas.checked = true;
  if(chkProyectoMobiliario) chkProyectoMobiliario.checked = true;
  if(chkProyectoMetrado) chkProyectoMetrado.checked = true;
  updateProyectoPreview();
  modalProyecto.classList.remove("hidden");
  modalProyecto.setAttribute("aria-hidden","false");
  try{ document.body.classList.add("project-select-mode"); }catch(e){}
  try{ if(typeof renderizarTodo === "function"){ renderizarTodo(); } }catch(e){}
}

function abrirModalProyectoEditar(){
  if(!modalProyecto) return;
  const proj = proyectosCache.find(p => p.id === proyectoActivoId) || proyectosCache[0];
  if(!proj){
    alert("No hay proyecto activo para modificar.");
    return;
  }
  projectSelectionActive = true;
  proyectoEditId = proj.id;
  cargarSeleccionDesdeProyecto(proj);
  if(inputProyectoNombre) inputProyectoNombre.value = proj.nombre || "";
  if(inputProyectoInicio) inputProyectoInicio.value = proj.fecha_inicio || "";
  if(inputProyectoFin) inputProyectoFin.value = proj.fecha_fin || "";
  if(chkProyectoTransito) chkProyectoTransito.checked = (proj.senalesVertical || []).length > 0;
  if(chkProyectoMarcas) chkProyectoMarcas.checked = (proj.senalesHorizontal || []).length > 0;
  if(chkProyectoMobiliario) chkProyectoMobiliario.checked = (proj.senalesMobiliario || []).length > 0;
  if(chkProyectoMetrado) chkProyectoMetrado.checked = (proj.metradoRegistros || []).length > 0;
  updateProyectoPreview();
  modalProyecto.classList.remove("hidden");
  modalProyecto.setAttribute("aria-hidden","false");
  try{ document.body.classList.add("project-select-mode"); }catch(e){}
  try{ if(typeof renderizarTodo === "function"){ renderizarTodo(); } }catch(e){}
}

function cerrarModalProyecto(){
  if(!modalProyecto) return;
  modalProyecto.classList.add("hidden");
  modalProyecto.setAttribute("aria-hidden","true");
  projectSelectionActive = false;
  resetProjectSelection();
  aplicarSeleccionMetradoMapa();
  try{ document.body.classList.remove("project-select-mode"); }catch(e){}
  try{ if(typeof renderizarTodo === "function"){ renderizarTodo(); } }catch(e){}
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

function redondearMoneda(valor){
  const n = Number(valor || 0);
  return Math.round(n * 100) / 100;
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

let dashProyectoFiltro = "active";

function actualizarDashProyectoSelect(){
  if(!dashProjectSelect) return;
  const actual = dashProjectSelect.value || dashProyectoFiltro || "active";
  let html = '<option value="active">Proyecto activo</option>'
    + '<option value="todos">Todos los proyectos</option>';
  if(Array.isArray(proyectosCache) && proyectosCache.length){
    html += '<optgroup label="Proyectos">';
    html += proyectosCache.map(p => (
      '<option value="' + escapeAttr(p.id) + '">' + escapeHtml(p.nombre || "Proyecto") + '</option>'
    )).join("");
    html += '</optgroup>';
  }
  dashProjectSelect.innerHTML = html;
  const hasProject = Array.isArray(proyectosCache) && proyectosCache.some(p => String(p.id || "") === String(actual));
  dashProjectSelect.value = (actual === "active" || actual === "todos" || hasProject) ? actual : "active";
  dashProyectoFiltro = dashProjectSelect.value;
}

function obtenerListasDashboard(){
  const filtro = dashProjectSelect ? dashProjectSelect.value : dashProyectoFiltro;
  dashProyectoFiltro = filtro || "active";
  const fallback = ()=>({
    horiz: filtrarPorSeleccion(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []),
    vert: filtrarPorSeleccion(typeof senalesVertical !== "undefined" ? senalesVertical : []),
    mob: filtrarPorSeleccion(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : []),
    metrado: Array.isArray(metradoRegistros) ? metradoRegistros : []
  });
  if(!filtro || filtro === "active" || !Array.isArray(proyectosCache) || !proyectosCache.length){
    return fallback();
  }
  if(filtro === "todos"){
    const horiz = [];
    const vert = [];
    const mob = [];
    const metrado = [];
    proyectosCache.forEach((p)=>{
      horiz.push(...filtrarPorSeleccion(p.senalesHorizontal || []));
      vert.push(...filtrarPorSeleccion(p.senalesVertical || []));
      mob.push(...filtrarPorSeleccion(p.senalesMobiliario || []));
      if(Array.isArray(p.metradoRegistros)) metrado.push(...p.metradoRegistros);
    });
    return { horiz, vert, mob, metrado };
  }
  const proj = proyectosCache.find(p => String(p.id || "") === String(filtro));
  if(!proj) return fallback();
  return {
    horiz: filtrarPorSeleccion(proj.senalesHorizontal || []),
    vert: filtrarPorSeleccion(proj.senalesVertical || []),
    mob: filtrarPorSeleccion(proj.senalesMobiliario || []),
    metrado: Array.isArray(proj.metradoRegistros) ? proj.metradoRegistros : []
  };
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
  if(!apuState.loaded){
    cargarApuData().then(()=> updateDashboard()).catch(()=>{});
  }

  const profileName = getProfileName();
  if(dashUserName) dashUserName.textContent = profileName || nombreDesdeCorreo(correo);
  if(dashUserEmail) dashUserEmail.textContent = correo || "";
  if(dashAvatarInitials) dashAvatarInitials.textContent = inicialesDesdeCorreo(correo);

  let scope = { region:"", distrito:"" };
  try{
    if(typeof cargarSesionScope === "function"){
      scope = cargarSesionScope() || scope;
    }
  }catch(e){}
  let distrito = scope && scope.distrito ? scope.distrito : "";
  let region = scope && scope.region ? scope.region : "";
  if(!distrito && typeof filtroDistrito !== "undefined"){
    distrito = filtroDistrito || "";
  }
  if(!region && distrito && typeof regionPorDistrito === "function"){
    region = regionPorDistrito(distrito) || "";
  }

  const muniNombre = rolActual === "visitante"
    ? "Portal ciudadano"
    : (distrito ? ("Municipalidad de " + distrito) : "Municipalidad Metropolitana de Lima");
  if(dashMuniNombre) dashMuniNombre.textContent = muniNombre.toUpperCase();
  if(dashMuniSub) dashMuniSub.textContent = (region || "Lima") + " - Peru";
  if(dashMuniFoto){
    const slug = distrito ? slugDistrito(distrito) : "lima";
    const base = "src/fotos de municipalidades/";
    const primary = base + "Muni-" + slug + ".jpg";
    const alt = base + "Muni." + slug + ".jpg";
    const fallback = base + "Muni-lima.jpg";
    dashMuniFoto.onerror = function(){
      if(!dashMuniFoto.dataset.fallback){
        dashMuniFoto.dataset.fallback = "1";
        dashMuniFoto.src = encodeURI(alt);
      } else {
        dashMuniFoto.src = encodeURI(fallback);
      }
    };
    if(dashMuniFoto.getAttribute("data-src") !== primary){
      dashMuniFoto.setAttribute("data-src", primary);
      dashMuniFoto.src = encodeURI(primary);
    }
  }

  const MUNICIPAL_INFO = (typeof window !== "undefined" && window.MUNICIPAL_INFO) ? window.MUNICIPAL_INFO : {
    "Lince": { superficie:"3.03 km2", subdivisiones:"9 sectores", poblacion:"63,854 hab." },
    "Lima": { superficie:"2,672.0 km2", subdivisiones:"43 distritos", poblacion:"9,674,755 hab." }
  };
  const infoKey = distrito || "Lima";
  const info = MUNICIPAL_INFO[infoKey] || MUNICIPAL_INFO[slugDistrito(infoKey)] || {};
  if(dashMuniSuperficie) dashMuniSuperficie.textContent = info.superficie || "-";
  if(dashMuniSubdivisiones) dashMuniSubdivisiones.textContent = info.subdivisiones || "-";
  if(dashMuniPoblacion) dashMuniPoblacion.textContent = info.poblacion || "-";

  if(dashEntity){
    if(rolActual === "visitante"){
      dashEntity.textContent = "Entidad: Portal ciudadano";
    } else if(typeof filtroDistrito !== "undefined" && filtroDistrito){
      dashEntity.textContent = "Entidad: Municipalidad de " + filtroDistrito;
    } else {
      dashEntity.textContent = "Entidad: Municipalidad Metropolitana de Lima";
    }
  }

  actualizarDashProyectoSelect();
  const data = obtenerListasDashboard();
  const horiz = data.horiz;
  const vert = data.vert;
  const mob = data.mob;
  const metrado = data.metrado;
  const all = horiz.concat(vert, mob);

  const total = all.length;
  const nNueva = all.filter(s => s.estado === "nueva").length;
  const nAntigua = all.filter(s => s.estado === "antigua").length;
  const nSin = all.filter(s => s.estado === "sin_senal").length;

  const score = total ? Math.round(((nNueva * 1.0) + (nAntigua * 0.6) + (nSin * 0.0)) / total * 100) : 0;
  const atencion = nAntigua + nSin;

  // Estimación simple (ajustable) por tipo de señalización
  const sumHoriz = horiz.reduce((sum, s)=> sum + precioInversionSenal("horizontal", s), 0);
  const sumMetrado = metrado.reduce((sum, r)=> sum + precioInversionMetrado(r), 0);
  const sumVert = vert.reduce((sum, s)=> sum + precioInversionSenal("vertical", s), 0);
  const sumMob = mob.reduce((sum, s)=> sum + precioInversionSenal("mobiliario", s), 0);
  const inversion = sumHoriz + sumMetrado + sumVert + sumMob;

  if(dashScore) dashScore.textContent = String(score);
  if(dashTotalSenales) dashTotalSenales.textContent = String(total);
  if(dashAtencion) dashAtencion.textContent = String(atencion);
  if(dashInversion) dashInversion.textContent = formatearMonedaPEN(inversion);

  // Totales municipales (todos los proyectos del distrito)
  let projects = Array.isArray(proyectosCache) ? proyectosCache.slice() : [];
  if(distrito){
    const low = String(distrito).toLowerCase();
    projects = projects.filter(p=>{
      const pd = String(p && p.distrito || "").toLowerCase();
      return !pd || pd === low;
    });
  }
  let aggVert = [];
  let aggHoriz = [];
  let aggMob = [];
  let aggMetrado = [];
  if(projects.length){
    projects.forEach((p)=>{
      if(Array.isArray(p.senalesVertical)) aggVert.push(...p.senalesVertical);
      if(Array.isArray(p.senalesHorizontal)) aggHoriz.push(...p.senalesHorizontal);
      if(Array.isArray(p.senalesMobiliario)) aggMob.push(...p.senalesMobiliario);
      if(Array.isArray(p.metradoRegistros)) aggMetrado.push(...p.metradoRegistros);
    });
  } else {
    aggVert = Array.isArray(senalesVertical) ? senalesVertical.slice() : [];
    aggHoriz = Array.isArray(senalesHorizontal) ? senalesHorizontal.slice() : [];
    aggMob = Array.isArray(senalesMobiliario) ? senalesMobiliario.slice() : [];
    aggMetrado = Array.isArray(metradoRegistros) ? metradoRegistros.slice() : [];
  }
  const totalVert = aggVert.length;
  const totalHoriz = aggHoriz.length;
  const totalMob = aggMob.length;
  const totalMl = aggMetrado.reduce((sum, r)=>{
    if(r && r.resultados && Number.isFinite(Number(r.resultados.total))){
      return sum + Number(r.resultados.total);
    }
    if(Number.isFinite(Number(r && r.distancia_m))){
      return sum + Number(r.distancia_m);
    }
    return sum;
  }, 0);
  if(dashTotalVertical) dashTotalVertical.textContent = String(totalVert);
  if(dashTotalMarcas) dashTotalMarcas.textContent = String(totalHoriz);
  if(dashTotalMobiliario) dashTotalMobiliario.textContent = String(totalMob);
  if(dashTotalPintado){
    if(typeof formatoML === "function"){
      dashTotalPintado.textContent = formatoML(totalMl);
    } else {
      dashTotalPintado.textContent = Math.round(totalMl).toLocaleString("es-PE") + " ml";
    }
  }

  const aggSignals = aggVert.concat(aggHoriz, aggMob);
  const aggTotal = aggSignals.length;
  const aggNueva = aggSignals.filter(s => s && s.estado === "nueva").length;
  const aggAntigua = aggSignals.filter(s => s && s.estado === "antigua").length;
  const aggSin = aggSignals.filter(s => s && s.estado === "sin_senal").length;
  const pctOpt = aggTotal ? Math.round((aggNueva / aggTotal) * 100) : 0;
  const pctMid = aggTotal ? Math.round((aggAntigua / aggTotal) * 100) : 0;
  const pctCrit = aggTotal ? Math.round((aggSin / aggTotal) * 100) : 0;
  if(dashPctOpt) dashPctOpt.textContent = String(pctOpt);
  if(dashPctMid) dashPctMid.textContent = String(pctMid);
  if(dashPctCrit) dashPctCrit.textContent = String(pctCrit);
  if(dashStateOpt) dashStateOpt.style.width = pctOpt + "%";
  if(dashStateMid) dashStateMid.style.width = pctMid + "%";
  if(dashStateCrit) dashStateCrit.style.width = pctCrit + "%";

  const scoreGeneral = aggTotal ? Math.round(((aggNueva * 1.0) + (aggAntigua * 0.6) + (aggSin * 0.0)) / aggTotal * 100) : 0;
  if(dashScoreGeneral) dashScoreGeneral.textContent = String(scoreGeneral);
  if(dashScoreLabel){
    let label = "Regular";
    if(scoreGeneral >= 80) label = "Optimo";
    else if(scoreGeneral >= 60) label = "Bueno";
    else if(scoreGeneral >= 40) label = "Regular";
    else label = "Critico";
    dashScoreLabel.textContent = label;
  }

  if(dashAlertDeterioradas) dashAlertDeterioradas.textContent = String(aggAntigua);
  if(dashAlertAusentes) dashAlertAusentes.textContent = String(aggSin);

  const resumen = (function(){
    try{
      if(!window.inversionPlanResumen && typeof updateInversionPlanes === "function"){
        updateInversionPlanes();
      }
      return window.inversionPlanResumen || null;
    }catch(e){
      return null;
    }
  })();
  const ejecutada = resumen && Number.isFinite(Number(resumen.ejecutado)) ? Number(resumen.ejecutado) : 0;
  const planificada = resumen && Number.isFinite(Number(resumen.planificacion)) ? Number(resumen.planificacion) : 0;
  if(dashInvEjecutada) dashInvEjecutada.textContent = formatearMonedaPEN(ejecutada);
  if(dashInvPlanificada) dashInvPlanificada.textContent = formatearMonedaPEN(planificada);

  const eventos = Array.isArray(avisos) ? avisos.slice() : [];
  let eventosFiltrados = eventos;
  if(distrito){
    eventosFiltrados = eventos.filter(a => (a.distrito || a.zona || "") === distrito);
  }
  const counts = { falta:0, danada:0, obstruida:0, otro:0 };
  eventosFiltrados.forEach((a)=>{
    if(a && a.estado && a.estado === "atendido") return;
    const tipo = a && a.tipo ? a.tipo : "otro";
    if(counts.hasOwnProperty(tipo)){
      counts[tipo] += 1;
    } else {
      counts.otro += 1;
    }
  });
  if(dashEventoFalta) dashEventoFalta.textContent = String(counts.falta || 0);
  if(dashEventoDanada) dashEventoDanada.textContent = String(counts.danada || 0);
  if(dashEventoObstruida) dashEventoObstruida.textContent = String(counts.obstruida || 0);
  if(dashEventoOtro) dashEventoOtro.textContent = String(counts.otro || 0);
}

window.updateDashboard = updateDashboard;

function labelEstadoSeguro(estado){
  if(typeof labelEstado === "function") return labelEstado(estado);
  if(estado === "nueva") return "Operativa";
  if(estado === "antigua") return "Deteriorada";
  if(estado === "sin_senal") return "No operativa";
  return estado || "-";
}

function cantidadLabel(s){
  if(s && typeof s.area_m2 === "number" && Number.isFinite(s.area_m2)){
    return s.area_m2.toFixed(2) + " m2";
  }
  return "1 und";
}

let invProyectoFiltro = "active";
let invRowsCache = [];
let invMapaMarker = null;
let invMapaLine = null;

function actualizarInvProyectoSelect(){
  if(!invProyectoSelect) return;
  const actual = invProyectoSelect.value || invProyectoFiltro || "active";
  let html = '<option value="active">Proyecto activo</option>'
    + '<option value="todos">Todos los proyectos</option>';
  if(Array.isArray(proyectosCache) && proyectosCache.length){
    html += '<optgroup label="Proyectos">';
    html += proyectosCache.map(p => (
      '<option value="' + escapeAttr(p.id) + '">' + escapeHtml(p.nombre || "Proyecto") + '</option>'
    )).join("");
    html += '</optgroup>';
  }
  invProyectoSelect.innerHTML = html;
  const hasProject = Array.isArray(proyectosCache) && proyectosCache.some(p => String(p.id || "") === String(actual));
  invProyectoSelect.value = (actual === "active" || actual === "todos" || hasProject) ? actual : "active";
  invProyectoFiltro = invProyectoSelect.value;
}

function actualizarInvDistritoLabel(){
  if(!invDistritoLabel) return;
  let distrito = "";
  try{
    const scope = typeof cargarSesionScope === "function" ? cargarSesionScope() : { distrito:"" };
    distrito = scope && scope.distrito ? scope.distrito : "";
  }catch(e){}
  if(!distrito && typeof filtroDistrito !== "undefined") distrito = filtroDistrito || "";
  invDistritoLabel.textContent = distrito || "Todos";
}

function obtenerListasInversion(){
  const filtro = invProyectoSelect ? invProyectoSelect.value : invProyectoFiltro;
  invProyectoFiltro = filtro || "active";
  const fallback = ()=>{
    return {
      horiz: filtrarPorSeleccion(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []),
      vert: filtrarPorSeleccion(typeof senalesVertical !== "undefined" ? senalesVertical : []),
      mob: filtrarPorSeleccion(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : []),
      metrado: Array.isArray(metradoRegistros) ? metradoRegistros : []
    };
  };
  if(!filtro || filtro === "active" || !Array.isArray(proyectosCache) || !proyectosCache.length){
    return fallback();
  }
  if(filtro === "todos"){
    const horiz = [];
    const vert = [];
    const mob = [];
    const metrado = [];
    proyectosCache.forEach((p)=>{
      horiz.push(...filtrarPorSeleccion(p.senalesHorizontal || []));
      vert.push(...filtrarPorSeleccion(p.senalesVertical || []));
      mob.push(...filtrarPorSeleccion(p.senalesMobiliario || []));
      if(Array.isArray(p.metradoRegistros)) metrado.push(...p.metradoRegistros);
    });
    return { horiz, vert, mob, metrado };
  }
  const proj = proyectosCache.find(p => String(p.id || "") === String(filtro));
  if(!proj) return fallback();
  return {
    horiz: filtrarPorSeleccion(proj.senalesHorizontal || []),
    vert: filtrarPorSeleccion(proj.senalesVertical || []),
    mob: filtrarPorSeleccion(proj.senalesMobiliario || []),
    metrado: Array.isArray(proj.metradoRegistros) ? proj.metradoRegistros : []
  };
}

function obtenerOverrideInversion(item){
  const raw = item && (item.inversion_override ?? item.inversionOverride);
  const num = Number(raw);
  return Number.isFinite(num) ? num : NaN;
}

function setOverrideInversion(item, value){
  if(!item) return;
  if(value === null){
    delete item.inversion_override;
    delete item.inversionOverride;
    return;
  }
  item.inversion_override = value;
}

function precioInversionSenal(modo, senal){
  const override = obtenerOverrideInversion(senal);
  if(Number.isFinite(override)) return override;
  const apu = obtenerCostoApuSenal(modo, senal);
  if(Number.isFinite(apu)) return apu;
  return precioDeSenal(modo, senal);
}

function precioInversionMetrado(registro){
  const override = obtenerOverrideInversion(registro);
  if(Number.isFinite(override)) return override;
  const apu = obtenerCostoApuMetrado(registro);
  if(Number.isFinite(apu)) return apu;
  return 0;
}

function precioInversionItem(kind, item){
  if(kind === "metrado") return precioInversionMetrado(item);
  return precioInversionSenal(kind, item);
}

function estadoClaveInversion(kind, item){
  if(kind === "metrado") return "nueva";
  return (item && item.estado) ? item.estado : "";
}

function labelEstadoInversion(kind, item){
  if(kind === "metrado"){
    return item && item.inspeccion_pendiente ? "Inspeccion pendiente" : "Inspeccion registrada";
  }
  return labelEstadoSeguro(item ? item.estado : "");
}

function verificadoInversion(kind, item){
  if(kind === "metrado"){
    return item ? !item.inspeccion_pendiente : false;
  }
  return !!(item && item.inspeccionFoto);
}

function limpiarInversionMapa(){
  try{
    if(typeof map === "undefined" || !map) return;
    if(invMapaMarker){ map.removeLayer(invMapaMarker); invMapaMarker = null; }
    if(invMapaLine){ map.removeLayer(invMapaLine); invMapaLine = null; }
  }catch(e){}
}

function abrirApuRelacionado(row){
  if(!row || !row.ref) return;
  const relacion = obtenerApuRelacion(row.kind, row.ref);
  setDashView("apu");
  const aplicar = ()=>{
    if(relacion){
      apuState.categoria = relacion.categoria || "transito";
      if(apuCategoria) apuCategoria.value = apuState.categoria;
      if(apuBuscar) apuBuscar.value = "";
      apuState.selectedCodigo = relacion.codigo || "";
    }
    renderApuTabla();
  };
  if(apuState.loaded){
    aplicar();
  } else {
    cargarApuData().then(aplicar).catch(()=> updateApu());
  }
}

function enfocarInversionEnMapa(row){
  if(!row || !row.ref) return;
  if(typeof map === "undefined" || !map) return;
  if(typeof setDashView === "function") setDashView("mapa");

  setTimeout(()=>{
    try{ if(map && typeof map.invalidateSize === "function") map.invalidateSize(); }catch(e){}
    limpiarInversionMapa();
    const item = row.ref;
    if(row.kind === "metrado"){
      const puntos = Array.isArray(item.puntos) ? item.puntos : [];
      if(puntos.length >= 2 && typeof L !== "undefined"){
        invMapaLine = L.polyline(puntos, { color:"#0b5d5b", weight:6, opacity:0.85 }).addTo(map);
        const bounds = L.latLngBounds(puntos.map(p => L.latLng(p[0], p[1])));
        map.fitBounds(bounds, { padding:[50,50] });
        const label = item.nombre || "Trazado";
        invMapaLine.bindPopup("<strong>" + escapeHtml(label) + "</strong>").openPopup();
        return;
      }
    }
    const lat = Number(item.lat);
    const lng = Number(item.lng);
    if(!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const label = row.kind === "mobiliario"
      ? (item.nombre || "Mobiliario")
      : (item.nombre || item.tipo || "Activo");
    if(typeof map.flyTo === "function"){
      map.flyTo([lat, lng], 17, { duration: 1.1, easeLinearity: 0.25 });
    } else {
      map.setView([lat, lng], 17);
    }
    if(typeof L !== "undefined"){
      invMapaMarker = L.marker([lat, lng]).addTo(map);
      invMapaMarker.bindPopup("<strong>" + escapeHtml(label) + "</strong>").openPopup();
    }
  }, 200);
}

function buscarItemInversion(kind, id){
  const key = String(id || "");
  if(kind === "metrado"){
    return (Array.isArray(metradoRegistros) ? metradoRegistros : []).find(r => String(r.id) === key) || null;
  }
  if(kind === "vertical"){
    return (Array.isArray(senalesVertical) ? senalesVertical : []).find(s => String(s.id) === key) || null;
  }
  if(kind === "horizontal"){
    return (Array.isArray(senalesHorizontal) ? senalesHorizontal : []).find(s => String(s.id) === key) || null;
  }
  if(kind === "mobiliario"){
    return (Array.isArray(senalesMobiliario) ? senalesMobiliario : []).find(s => String(s.id) === key) || null;
  }
  return null;
}

function updateInversion(){
  if(!invTotal || !invOperativos || !invDeteriorados || !invReposicion) return;
  if(!apuState.loaded){
    cargarApuData().then(()=> updateInversion()).catch(()=>{});
  }
  actualizarInvProyectoSelect();
  actualizarInvDistritoLabel();
  const data = obtenerListasInversion();
  const horiz = data.horiz;
  const vert = data.vert;
  const mob = data.mob;
  const metradoList = data.metrado;

  const sumHorizSenales = horiz.reduce((sum, s)=> sum + precioInversionSenal("horizontal", s), 0);
  const sumMetrado = metradoList.reduce((sum, r)=> sum + precioInversionMetrado(r), 0);
  const sumVert = vert.reduce((sum, s)=> sum + precioInversionSenal("vertical", s), 0);
  const sumMob = mob.reduce((sum, s)=> sum + precioInversionSenal("mobiliario", s), 0);
  const sumMarcas = sumHorizSenales + sumMetrado;
  let total = sumMarcas + sumVert + sumMob;

  const rows = []
    .concat(horiz.map(s => ({ kind: "horizontal", ref: s, id: s.id, area_m2: s.area_m2 })))
    .concat(vert.map(s => ({ kind: "vertical", ref: s, id: s.id, area_m2: s.area_m2 })))
    .concat(mob.map(s => ({ kind: "mobiliario", ref: s, id: s.id, area_m2: s.area_m2 })))
    .concat(metradoList.map(r => ({
      kind: "metrado",
      ref: r,
      id: r.id,
      area_m2: r && r.resultados && Number.isFinite(Number(r.resultados.area)) ? Number(r.resultados.area) : null
    })));
  invRowsCache = rows.slice();

  let sumOper = rows.filter(r => estadoClaveInversion(r.kind, r.ref) === "nueva")
    .reduce((sum, r)=> sum + precioInversionItem(r.kind, r.ref), 0);
  let sumDet = rows.filter(r => estadoClaveInversion(r.kind, r.ref) === "antigua")
    .reduce((sum, r)=> sum + precioInversionItem(r.kind, r.ref), 0);
  let sumRepo = rows.filter(r => estadoClaveInversion(r.kind, r.ref) === "sin_senal")
    .reduce((sum, r)=> sum + precioInversionItem(r.kind, r.ref), 0);

  try{
    window.aiInversionBase = { total, sumOper, sumDet, sumRepo };
  }catch(e){}

  const aiOverride = (typeof window.aiInversionOverride === "object" && window.aiInversionOverride) ? window.aiInversionOverride : null;
  if(aiOverride){
    const oOper = Number(aiOverride.operativos);
    const oDet = Number(aiOverride.deteriorados);
    const oRepo = Number(aiOverride.reposicion);
    const oTotal = Number(aiOverride.total);
    const hasOverrideValues = Number.isFinite(oOper) || Number.isFinite(oDet) || Number.isFinite(oRepo);

    if(Number.isFinite(oOper)) sumOper = Math.max(0, oOper);
    if(Number.isFinite(oDet)) sumDet = Math.max(0, oDet);
    if(Number.isFinite(oRepo)) sumRepo = Math.max(0, oRepo);
    if(Number.isFinite(oTotal) && oTotal > 0){
      total = oTotal;
    } else if(hasOverrideValues){
      total = sumOper + sumDet + sumRepo;
    }
  }

  if(invTotal) invTotal.textContent = formatearMonedaPEN(total);
  if(invOperativos) invOperativos.textContent = formatearMonedaPEN(sumOper);
  if(invDeteriorados) invDeteriorados.textContent = formatearMonedaPEN(sumDet);
  if(invReposicion) invReposicion.textContent = formatearMonedaPEN(sumRepo);
  if(invOperativosPct) invOperativosPct.textContent = total ? Math.round((sumOper / total) * 100) + "%" : "0%";
  if(invDeterioradosPct) invDeterioradosPct.textContent = total ? Math.round((sumDet / total) * 100) + "%" : "0%";

  const pctTransito = total ? Math.round((sumVert / total) * 100) : 0;
  const pctMarcas = total ? Math.round((sumMarcas / total) * 100) : 0;
  const pctMobiliario = total ? Math.round((sumMob / total) * 100) : 0;
  if(invBarTransito) invBarTransito.style.width = pctTransito + "%";
  if(invBarMarcas) invBarMarcas.style.width = pctMarcas + "%";
  if(invBarMobiliario) invBarMobiliario.style.width = pctMobiliario + "%";
  if(invValTransito) invValTransito.textContent = formatearMonedaPEN(sumVert);
  if(invValMarcas) invValMarcas.textContent = formatearMonedaPEN(sumMarcas);
  if(invValMobiliario) invValMobiliario.textContent = formatearMonedaPEN(sumMob);

  if(invTablaBody){
    if(!rows.length){
      invTablaBody.innerHTML = "<tr><td colspan=\"5\">Sin activos registrados.</td></tr>";
    } else {
      invTablaBody.innerHTML = rows.map((row, idx)=>{
        const s = row.ref || {};
        const nombre = (row.kind === "metrado")
          ? String(s.nombre || "Trazado")
          : String(s.nombre || s.tipo || "Activo");
        const tipo = (row.kind === "metrado")
          ? String(s.pintura_label || etiquetaPinturaMetrado(s.pintura_tipo))
          : (row.kind === "mobiliario")
            ? String(s.nombre || "Mobiliario")
            : String(s.tipo || (s.icono ? "Senal" : "Activo"));
        const cantidad = (row.kind === "metrado")
          ? cantidadLabel({ area_m2: row.area_m2 })
          : cantidadLabel(s);
        const precio = precioInversionItem(row.kind, s);
        const idAttr = escapeAttr(String(row.id || ""));
        const kindAttr = escapeAttr(String(row.kind || ""));
        return "<tr data-kind=\"" + kindAttr + "\" data-id=\"" + idAttr + "\" data-row=\"" + idx + "\">"
          + "<td>" + escapeHtml(nombre) + "</td>"
          + "<td>" + escapeHtml(tipo) + "</td>"
          + "<td>" + escapeHtml(cantidad) + "</td>"
          + "<td>" + escapeHtml(labelEstadoInversion(row.kind, s)) + "</td>"
          + "<td class=\"inv-price-cell\">"
          +   "<span>" + formatearMonedaPEN(precio) + "</span>"
          +   "<div class=\"inv-price-actions\">"
          +     "<button type=\"button\" class=\"inv-edit-btn\" data-kind=\"" + kindAttr + "\" data-id=\"" + idAttr + "\">Editar</button>"
          +     "<button type=\"button\" class=\"inv-map-btn\" data-kind=\"" + kindAttr + "\" data-id=\"" + idAttr + "\">Ver mapa</button>"
          +     "<button type=\"button\" class=\"inv-apu-btn\" data-kind=\"" + kindAttr + "\" data-id=\"" + idAttr + "\">Ver APU</button>"
          +   "</div>"
          + "</td>"
          + "</tr>";
      }).join("");
    }
  }

  const sinVerif = rows.filter(r => !verificadoInversion(r.kind, r.ref))
    .reduce((sum, r)=> sum + precioInversionItem(r.kind, r.ref), 0);
  const mantenimiento = sumDet;
  const reposicion = sumRepo;
  const totalProx = sinVerif + mantenimiento + reposicion;
  if(invSinVerif) invSinVerif.textContent = formatearMonedaPEN(sinVerif);
  if(invMantenimiento) invMantenimiento.textContent = formatearMonedaPEN(mantenimiento);
  if(invReposicionCrit) invReposicionCrit.textContent = formatearMonedaPEN(reposicion);
  if(invTotalProxima) invTotalProxima.textContent = formatearMonedaPEN(totalProx);
}

window.updateInversion = updateInversion;

function normalizarPartidaApu(p){
  const out = Object.assign({}, p || {});
  const cd = Number(out.costo_directo);
  const hasCd = Number.isFinite(cd);
  if(hasCd){
    if(!Number.isFinite(Number(out.utilidad))){
      out.utilidad = redondearMoneda(cd * 0.10);
    }
    if(!Number.isFinite(Number(out.gastos_generales))){
      out.gastos_generales = redondearMoneda(cd * 0.165);
    }
    if(!Number.isFinite(Number(out.igv))){
      const base = cd + Number(out.utilidad || 0) + Number(out.gastos_generales || 0);
      out.igv = redondearMoneda(base * 0.18);
    }
    if(!Number.isFinite(Number(out.precio_unitario_total))){
      const total = cd + Number(out.utilidad || 0) + Number(out.gastos_generales || 0) + Number(out.igv || 0);
      out.precio_unitario_total = redondearMoneda(total);
    }
  }
  return out;
}

async function cargarApuData(){
  if(apuState.loaded) return;
  const entries = Object.entries(APU_SOURCES);
  const out = {};
  for(const [key, path] of entries){
    try{
      const res = await fetch(path, { cache: "no-store" });
      if(!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const partidas = Array.isArray(json.partidas) ? json.partidas.map(normalizarPartidaApu) : [];
      out[key] = {
        capitulo: json.capitulo || "",
        fecha: json.fecha || "",
        moneda: json.moneda || "PEN",
        partidas
      };
    }catch(e){
      out[key] = { capitulo: "", fecha: "", moneda: "PEN", partidas: [] };
    }
  }
  apuState.data = out;
  apuState.loaded = true;
}

function obtenerPartidasApu(){
  const key = apuCategoria ? apuCategoria.value : apuState.categoria;
  apuState.categoria = key || "transito";
  const pack = apuState.data[apuState.categoria] || { partidas: [] };
  return pack;
}

function filtrarPartidasApu(partidas){
  const q = apuBuscar ? (apuBuscar.value || "").trim().toLowerCase() : "";
  if(!q) return partidas;
  return (partidas || []).filter((p)=>{
    const hay = String(p.codigo || "") + " " + String(p.partida || "");
    return hay.toLowerCase().includes(q);
  });
}

function renderApuDetalle(partida){
  if(!apuDetalleContenido || !apuDetalleTitulo || !apuDetalleSub){
    return;
  }
  if(!partida){
    apuDetalleTitulo.textContent = "Detalle de partida";
    apuDetalleSub.textContent = "Selecciona una partida para ver insumos.";
    apuDetalleContenido.innerHTML = "";
    return;
  }
  apuDetalleTitulo.textContent = String(partida.partida || "Partida");
  apuDetalleSub.textContent = "Codigo " + String(partida.codigo || "-") + " · Unidad " + String(partida.unidad || "-");

  const sections = [
    { key: "materiales", title: "Materiales" },
    { key: "mano_obra", title: "Mano de obra" },
    { key: "equipos", title: "Equipos y herramientas" }
  ];

  function normalizarLista(raw){
    if(Array.isArray(raw)) return raw;
    if(raw && Array.isArray(raw.detalle)) return raw.detalle;
    return [];
  }
  function toNumber(value){
    if(value === null || value === undefined || value === "") return NaN;
    const num = Number(String(value).replace(",", "."));
    return Number.isFinite(num) ? num : NaN;
  }
  function resolveParcial(item){
    const raw = item.parcial ?? item.parcial_total ?? item.total ?? null;
    const rawNum = toNumber(raw);
    if(Number.isFinite(rawNum)) return rawNum;
    const cantidad = toNumber(item.cantidad ?? item.hh ?? item.factor ?? item.cant ?? "");
    const precio = toNumber(item.precio_unitario ?? item.precio ?? item.base ?? "");
    if(Number.isFinite(cantidad) && Number.isFinite(precio)) return cantidad * precio;
    return NaN;
  }
  function formatNumber(value){
    return Number.isFinite(value) ? value.toFixed(2) : "";
  }

  let html = sections.map((sec)=>{
    const lista = normalizarLista(partida[sec.key]);
    if(!lista.length) return "";
    let totalParcial = 0;
    let hasParcial = false;
    const rows = lista.map((it)=>{
      const desc = it.descripcion || "-";
      const unidad = it.unidad || it.unid || "-";
      const cantidad = (it.cantidad ?? it.hh ?? it.factor ?? "");
      const precio = (it.precio_unitario ?? it.precio ?? "");
      const parcialNum = resolveParcial(it);
      if(Number.isFinite(parcialNum)){
        totalParcial += parcialNum;
        hasParcial = true;
      }
      const parcialRaw = (it.parcial ?? it.parcial_total ?? it.total ?? "");
      const parcial = parcialRaw !== "" ? String(parcialRaw) : formatNumber(parcialNum);
      return "<tr>"
        + "<td>" + escapeHtml(desc) + "</td>"
        + "<td>" + escapeHtml(unidad) + "</td>"
        + "<td>" + escapeHtml(String(cantidad)) + "</td>"
        + "<td>" + escapeHtml(String(precio)) + "</td>"
        + "<td>" + escapeHtml(String(parcial)) + "</td>"
        + "</tr>";
    }).join("");
    const totalRow = hasParcial
      ? "<tfoot><tr class=\"apu-detail-total\"><td colspan=\"4\">Total parcial</td><td>"
        + escapeHtml(formatNumber(totalParcial))
        + "</td></tr></tfoot>"
      : "";
    return "<div class=\"apu-detail-section\">"
      + "<h4>" + escapeHtml(sec.title) + "</h4>"
      + "<table class=\"apu-detail-table\">"
      + "<thead><tr><th>Descripcion</th><th>Unidad</th><th>Cantidad</th><th>Precio</th><th>Parcial</th></tr></thead>"
      + "<tbody>" + rows + "</tbody>"
      + totalRow
      + "</table>"
      + "</div>";
  }).join("");

  const sub = Array.isArray(partida.subpartidas) ? partida.subpartidas : [];
  if(sub.length){
    const rows = sub.map((it)=>{
      const desc = it.descripcion || "-";
      const unidad = it.unidad || "-";
      const precio = (it.precio ?? it.costo ?? "");
      return "<tr>"
        + "<td>" + escapeHtml(desc) + "</td>"
        + "<td>" + escapeHtml(unidad) + "</td>"
        + "<td>" + escapeHtml(String(precio)) + "</td>"
        + "</tr>";
    }).join("");
    html += "<div class=\"apu-detail-section\">"
      + "<h4>Subpartidas</h4>"
      + "<table class=\"apu-detail-table\">"
      + "<thead><tr><th>Descripcion</th><th>Unidad</th><th>Precio</th></tr></thead>"
      + "<tbody>" + rows + "</tbody>"
      + "</table>"
      + "</div>";
  }
  apuDetalleContenido.innerHTML = html || "<div class=\"apu-empty\">Sin detalle disponible.</div>";
}

function renderApuTabla(){
  if(!apuTablaBody) return;
  const pack = obtenerPartidasApu();
  const partidas = filtrarPartidasApu(pack.partidas || []);
  if(apuCapitulo) apuCapitulo.textContent = "Capitulo: " + (pack.capitulo || "-");
  if(apuFecha) apuFecha.textContent = "Fecha: " + (pack.fecha || "-");
  if(apuMoneda) apuMoneda.textContent = "Moneda: " + (pack.moneda || "PEN");
  if(apuTotal) apuTotal.textContent = "Items: " + partidas.length;

  if(!partidas.length){
    apuTablaBody.innerHTML = "<tr><td colspan=\"4\">Sin datos para esta partida.</td></tr>";
    renderApuDetalle(null);
    return;
  }

  if(!apuState.selectedCodigo || !partidas.some(p => String(p.codigo || "") === apuState.selectedCodigo)){
    apuState.selectedCodigo = String(partidas[0].codigo || "");
  }

  apuTablaBody.innerHTML = partidas.map((p)=>{
    const codigo = String(p.codigo || "");
    const isSel = codigo === apuState.selectedCodigo ? " is-selected" : "";
    const costoDirecto = calcularCostoDirectoPartida(p);
    const costoTexto = Number.isFinite(costoDirecto) ? costoDirecto.toFixed(2) : "-";
    return "<tr class=\"" + isSel + "\" data-codigo=\"" + escapeAttr(codigo) + "\">"
      + "<td>" + escapeHtml(codigo || "-") + "</td>"
      + "<td>" + escapeHtml(p.partida || "-") + "</td>"
      + "<td>" + escapeHtml(p.unidad || "-") + "</td>"
      + "<td>" + escapeHtml(costoTexto) + "</td>"
      + "</tr>";
  }).join("");

  const seleccionado = partidas.find(p => String(p.codigo || "") === apuState.selectedCodigo);
  renderApuDetalle(seleccionado || null);
}

function updateApu(){
  if(!apuTablaBody) return;
  cargarApuData().then(renderApuTabla).catch(()=> renderApuTabla());
}

window.updateApu = updateApu;

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

  if(view === "inversion"){
    updateInversion();
  }
  if(view === "inversion-plan"){
    if(typeof updateInversionPlanes === "function") updateInversionPlanes();
  }
  if(view === "apu"){
    updateApu();
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
    alert("El rol ahora se define por autenticación. Usa una cuenta con el rol correcto.");
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

    const nextAvisoId = maxNumericId(avisos) + 1;
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

function slugDistrito(distrito){
  return String(distrito || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

const MUNICIPAL_ACCOUNTS = (function(){
  const pass = "Muni123!";
  const list = [];
  const distritos = new Set();
  try{
    if(typeof MAPA_REGIONES === "object" && MAPA_REGIONES){
      Object.values(MAPA_REGIONES).forEach((arr)=>{
        if(!Array.isArray(arr)) return;
        arr.forEach((d)=>{ if(d) distritos.add(d); });
      });
    }
  }catch(e){}

  if(distritos.size){
    Array.from(distritos).sort().forEach((d)=>{
      const slug = slugDistrito(d);
      if(!slug) return;
      list.push({ email: slug + "@muni.gob.pe", pass, distrito: d });
    });
  } else {
    list.push(
      { email: "sanisidro@muni.gob.pe", pass, distrito: "San Isidro" },
      { email: "miraflores@muni.gob.pe", pass, distrito: "Miraflores" },
      { email: "jesusmaria@muni.gob.pe", pass, distrito: "Jesus Maria" }
    );
  }

  // Municipalidad metropolitana (sin alcance fijo)
  list.push({ email: "muni@muni.gob.pe", pass, distrito: "" });
  return list;
})();

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
    const correo = localStorage.getItem("correoActual");
    if(correo && inputCorreo) inputCorreo.value = correo;
  }catch(e){}

  if(window.UrbbisApi && typeof window.UrbbisApi.me === "function" && window.UrbbisApi.getToken){
    const token = window.UrbbisApi.getToken();
    if(token){
      window.UrbbisApi.me()
        .then((user)=>{
          if(!user) return;
          const role = user.role || "user";
          setRol(role);
          try{
            if(inputCorreo) inputCorreo.value = user.email || "";
            if(user.email) localStorage.setItem("correoActual", user.email);
          }catch(e){}
          const scope = (role === "municipal")
            ? { region: user.region || (obtenerScopePorCorreo(user.email || "").region || ""), distrito: user.district || (obtenerScopePorCorreo(user.email || "").distrito || "") }
            : { region:"", distrito:"" };
          guardarSesionScope(scope.region || "", scope.distrito || "");
          try{
            if(typeof setScopeGeografico === "function"){
              setScopeGeografico(scope.region || "", scope.distrito || "");
            }
          }catch(e){}
          try{ initProyectos(); }catch(e){}
          updateMobileBanner();
          if(loginOverlay) loginOverlay.classList.add("hidden");
          try{ document.body.classList.add("dash-shell"); }catch(e){}
          abrirDashboard();
        })
        .catch(()=> {
          if(window.UrbbisApi) window.UrbbisApi.clearToken();
        });
    }
  }
}

if(formLogin){
  formLogin.addEventListener("submit",(e)=>{
    e.preventDefault();
    const correo = inputCorreo ? inputCorreo.value.trim() : "";
    const clave = inputClave ? inputClave.value : "";
    if(!correo || !clave) return;
    if(!window.UrbbisApi || typeof window.UrbbisApi.login !== "function"){
      alert("Backend no disponible para autenticación.");
      return;
    }

    window.UrbbisApi.login({ email: correo, password: clave })
      .then((resp)=>{
        if(!resp || !resp.token || !resp.user){
          alert("Respuesta inválida del servidor.");
          return;
        }
        window.UrbbisApi.setToken(resp.token);
        const role = resp.user.role || "user";
        setRol(role);
        try{
          if(resp.user.email) localStorage.setItem("correoActual", resp.user.email);
        }catch(e){}
        const scope = (role === "municipal")
          ? { region: resp.user.region || (obtenerScopePorCorreo(resp.user.email || "").region || ""), distrito: resp.user.district || (obtenerScopePorCorreo(resp.user.email || "").distrito || "") }
          : { region:"", distrito:"" };
        guardarSesionScope(scope.region || "", scope.distrito || "");
        try{
          if(typeof setScopeGeografico === "function"){
            setScopeGeografico(scope.region || "", scope.distrito || "");
          }
        }catch(e){}
        try{ initProyectos(); }catch(e){}
        if(loginOverlay) loginOverlay.classList.add("hidden");
        updateMobileBanner();
        try{ document.body.classList.add("dash-shell"); }catch(e){}
        abrirDashboard();
      })
      .catch(()=>{
        alert("Credenciales incorrectas.");
      });
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
    if(window.UrbbisApi) window.UrbbisApi.clearToken();
  }catch(e){}
  cerrarModalProyecto();
  proyectosCache = [];
  proyectoActivoId = "";
  if(selectProyecto) selectProyecto.innerHTML = "";
  updateProjectUI();
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
      updateAndPersistConfig({ zoomInicial: Math.max(10, Math.min(23, v)) });
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
    try{ if(typeof guardarProyectoActivo === "function") guardarProyectoActivo(); }catch(e){}
    const correo = (typeof getSessionEmail === "function") ? (getSessionEmail() || "") : "";
    const scope = (typeof cargarSesionScope === "function") ? cargarSesionScope() : { region:"", distrito:"" };
    const payload = {
      app: "Urbbis",
      version: 1,
      exportedAt: now.toISOString(),
      config: loadUrbbisConfig(),
      usuario: {
        correo: correo || "",
        rol: (typeof rolActual !== "undefined") ? rolActual : "",
        scope
      },
      senalesHorizontal: typeof senalesHorizontal !== "undefined" ? senalesHorizontal : [],
      senalesVertical: typeof senalesVertical !== "undefined" ? senalesVertical : [],
      senalesMobiliario: typeof senalesMobiliario !== "undefined" ? senalesMobiliario : [],
      metradoRegistros: Array.isArray(metradoRegistros) ? metradoRegistros : [],
      avisos: typeof avisos !== "undefined" ? avisos : [],
      historialSenales: (typeof historialSenales !== "undefined" && Array.isArray(historialSenales)) ? historialSenales : [],
      proyectos: Array.isArray(proyectosCache) ? proyectosCache : [],
      proyectoActivoId: proyectoActivoId || ""
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
        const m = Array.isArray(parsed.senalesMobiliario) ? parsed.senalesMobiliario : null;
        const met = Array.isArray(parsed.metradoRegistros) ? parsed.metradoRegistros : null;
        const a = Array.isArray(parsed.avisos) ? parsed.avisos : null;
        const hist = Array.isArray(parsed.historialSenales) ? parsed.historialSenales : null;

        if(h && typeof senalesHorizontal !== "undefined"){
          senalesHorizontal.splice(0, senalesHorizontal.length, ...h);
        }
        if(v && typeof senalesVertical !== "undefined"){
          senalesVertical.splice(0, senalesVertical.length, ...v);
        }
        if(m && typeof senalesMobiliario !== "undefined"){
          senalesMobiliario.splice(0, senalesMobiliario.length, ...m);
        }
        if(met && typeof metradoRegistros !== "undefined"){
          metradoRegistros = met;
          try{ if(typeof actualizarMetradoRegistrosUI === "function") actualizarMetradoRegistrosUI(); }catch(e){}
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

        // Proyectos: ahora se sincronizan solo con backend (sin localStorage).
        if(Array.isArray(parsed.proyectos)){
          const incoming = parsed.proyectos.map((p)=>{
            const base = Object.assign({}, p || {});
            if(!Array.isArray(base.senalesHorizontal)) base.senalesHorizontal = [];
            if(!Array.isArray(base.senalesVertical)) base.senalesVertical = [];
            if(!Array.isArray(base.senalesMobiliario)) base.senalesMobiliario = [];
            if(!Array.isArray(base.metradoRegistros)) base.metradoRegistros = [];
            return base;
          });
          proyectosCache = incoming;
          proyectoActivoId = parsed.proyectoActivoId ? String(parsed.proyectoActivoId) : (incoming[0] ? incoming[0].id : "");
          guardarProyectos();
          actualizarSelectProyecto();
          if(proyectoActivoId){
            setProyectoActivoPorId(proyectoActivoId);
          }
          updateProjectUI();
        }

        if(parsed.config && typeof parsed.config === "object"){
          updateAndPersistConfig(parsed.config);
        }

        // Sincronizar importacion con backend (activos, avisos y proyectos)
        (async ()=>{
          if(!window.UrbbisApi) return;
          try{
            const pushAsset = async (item, type)=>{
              if(!item) return;
              const payload = {
                legacyId: Number.isFinite(Number(item.id)) ? Number(item.id) : undefined,
                type,
                name: item.nombre || "",
                category: item.tipo || "",
                icon: item.icono || "",
                state: item.estado || "",
                statePhysical: item.estado_fisico || "",
                lat: item.lat,
                lng: item.lng,
                district: item.distrito || item.zona || "",
                region: item.region || "",
                price: typeof item.precio === "number" ? item.precio : undefined,
                installedAt: item.fecha_colocacion || "",
                width: item.dimensiones && Number.isFinite(Number(item.dimensiones.ancho)) ? Number(item.dimensiones.ancho) : undefined,
                length: item.dimensiones && Number.isFinite(Number(item.dimensiones.largo)) ? Number(item.dimensiones.largo) : undefined,
                areaM2: typeof item.area_m2 === "number" ? item.area_m2 : undefined,
                photoUrl: item.inspeccionFoto || null
              };
              const remote = await window.UrbbisApi.createAsset(payload);
              if(remote && remote.id) item.dbId = remote.id;
            };

            const pushReport = async (item)=>{
              if(!item) return;
              const payload = {
                legacyId: Number.isFinite(Number(item.id)) ? Number(item.id) : undefined,
                type: item.tipo || "otro",
                description: item.descripcion || "",
                status: item.estado || "pendiente",
                lat: item.lat,
                lng: item.lng,
                district: item.distrito || "",
                region: item.region || "",
                userName: item.usuarioNombre || "",
                userEmail: item.usuarioEmail || "",
                userDni: item.usuarioDni || "",
                photoUrl: item.foto || null
              };
              const remote = await window.UrbbisApi.createReport(payload);
              if(remote && remote.id) item.dbId = remote.id;
            };

            for(const item of (h || [])){ await pushAsset(item, "horizontal"); }
            for(const item of (v || [])){ await pushAsset(item, "vertical"); }
            for(const item of (m || [])){ await pushAsset(item, "mobiliario"); }
            for(const item of (a || [])){ await pushReport(item); }
          }catch(syncErr){
            console.warn("No se pudo sincronizar importacion con backend.", syncErr);
          }
        })();

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
      +   '<div class="registro-label">Tipo</div>'
      +   '<div class="registro-pill-row" id="regTipoMobiliario">'
      +     '<button type="button" class="registro-pill" data-mob-type="Bolardo">Bolardo</button>'
      +     '<button type="button" class="registro-pill" data-mob-type="Tachas">Tachas</button>'
      +     '<button type="button" class="registro-pill" data-mob-type="Tachon">Tachon</button>'
      +   '</div>'
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
    const mob = e.target && e.target.closest ? e.target.closest("[data-mob-type]") : null;
    if(mob){
      registroDraft.nombre = mob.getAttribute("data-mob-type") || "";
      const row = mob.parentElement;
      if(row) row.querySelectorAll("[data-mob-type]").forEach(p=>p.classList.remove("active"));
      mob.classList.add("active");
      actualizarEstadoSubmitRegistro();
      return;
    }
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
      const nextAvisoId = maxNumericId(avisos) + 1;
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
      const nextId = maxNumericId(mob) + 1;
      const fecha = registroDraft.fecha || hoyISO();
      const estado = estadoFisicoAEstado(registroDraft.estadoFisico);
      const distrito = (typeof inferirDistritoPorLatLng === "function")
        ? (await inferirDistritoPorLatLng(registroLatLng.lat, registroLatLng.lng))
        : "Sin distrito";
      const region = (typeof regionPorDistrito === "function") ? (regionPorDistrito(distrito || "") || "Sin region") : "Sin region";
      const nuevoMob = {
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
      };
      mob.push(nuevoMob);
      if(window.UrbbisApi && typeof window.UrbbisApi.createAsset === "function"){
        const payload = {
          legacyId: Number.isFinite(Number(nuevoMob.id)) ? Number(nuevoMob.id) : undefined,
          type: "mobiliario",
          name: nuevoMob.nombre || "Mobiliario",
          category: nuevoMob.tipo || "",
          icon: nuevoMob.icono || "",
          state: nuevoMob.estado || "",
          lat: nuevoMob.lat,
          lng: nuevoMob.lng,
          district: nuevoMob.zona || "",
          region: nuevoMob.region || "",
          installedAt: nuevoMob.fecha_colocacion || "",
          photoUrl: nuevoMob.inspeccionFoto || null
        };
        window.UrbbisApi.createAsset(payload)
          .then((remote)=>{
            if(!remote) return;
            nuevoMob.dbId = remote.id;
            if(Number.isFinite(Number(remote.legacyId))) nuevoMob.id = Number(remote.legacyId);
          })
          .catch((err)=> console.warn("No se pudo guardar mobiliario en backend.", err));
      }
      if(typeof renderizarTodo === "function"){ renderizarTodo(); }
      if(typeof updateReportes === "function"){ updateReportes(); }
      if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
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
        estado_fisico: registroDraft.estadoFisico || "",
        area_m2: (tipo === "marcas" && typeof registroDraft.area_m2 === "number" && isFinite(registroDraft.area_m2))
          ? registroDraft.area_m2
          : null,
        lamina: registroDraft.lamina || "",
        soporte: registroDraft.soporte || "",
        inspeccionFoto: registroDraft.inspeccionFoto || null
      });
      if(nueva && window.UrbbisApi && typeof window.UrbbisApi.createAsset === "function"){
        const payload = {
          legacyId: Number.isFinite(Number(nueva.id)) ? Number(nueva.id) : undefined,
          type: modo,
          name: nueva.nombre || "",
          category: nueva.tipo || "",
          icon: nueva.icono || "",
          state: nueva.estado || "",
          statePhysical: nueva.estado_fisico || "",
          lat: nueva.lat,
          lng: nueva.lng,
          district: nueva.distrito || nueva.zona || "",
          region: nueva.region || "",
          price: typeof nueva.precio === "number" ? nueva.precio : undefined,
          installedAt: nueva.fecha_colocacion || "",
          width: nueva.dimensiones && Number.isFinite(Number(nueva.dimensiones.ancho)) ? Number(nueva.dimensiones.ancho) : undefined,
          length: nueva.dimensiones && Number.isFinite(Number(nueva.dimensiones.largo)) ? Number(nueva.dimensiones.largo) : undefined,
          areaM2: typeof nueva.area_m2 === "number" ? nueva.area_m2 : undefined,
          photoUrl: nueva.inspeccionFoto || null
        };
        window.UrbbisApi.createAsset(payload)
          .then((remote)=>{
            if(!remote) return;
            nueva.dbId = remote.id;
            if(Number.isFinite(Number(remote.legacyId))) nueva.id = Number(remote.legacyId);
          })
          .catch((err)=> console.warn("No se pudo guardar la señal en backend.", err));
      }
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
    if(metradoSnapVias){
      metradoSnapVias.checked = true;
    }
    metradoSnapEnabled = true;
    cargarViasMetrado();
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
    if(metradoOptionsDetails) metradoOptionsDetails.open = false;
    actualizarResultadosMetrado();
  });
}
if(btnMetradoUndo){
  btnMetradoUndo.addEventListener("click", deshacerPuntoMetrado);
}
if(btnMetradoLimpiar){
  btnMetradoLimpiar.addEventListener("click", limpiarRutaMetrado);
}
if(btnMetradoInspeccion){
  btnMetradoInspeccion.addEventListener("click", ()=>{
    if(rolActual !== "municipal"){
      setMetradoStatus("Disponible solo para municipalidad.");
      return;
    }
    if(!metradoCalculoActivo){
      setMetradoStatus("Primero traza una l\u00ednea para abrir inspeccion.");
      return;
    }
    abrirModalInspeccion();
  });
}
if(btnMetradoRegistrar){
  btnMetradoRegistrar.addEventListener("click", ()=>{
    if(rolActual !== "municipal"){
      setMetradoStatus("Disponible solo para municipalidad.");
      return;
    }
    if(!metradoCalculoActivo || !metradoUltimoCalculo){
      setMetradoStatus("Primero traza una l\u00ednea.");
      return;
    }
    const tieneInspeccion = metradoInspecciones.length > 0;
    const nombreInput = metradoNombre ? metradoNombre.value.trim() : "";
    const nombreRegistro = nombreInput || ("Trazado " + (metradoRegistros.length + 1));
    const colorRegistro = colorLineaMetrado();
    const pinturaTipo = metradoTipoPintura ? String(metradoTipoPintura.value || "") : "";
    const pinturaLabel = metradoTipoPintura
      ? String((metradoTipoPintura.options[metradoTipoPintura.selectedIndex] || {}).text || "")
      : "";
    const registro = {
      id: metradoRegistros.length + 1,
      nombre: nombreRegistro,
      fecha: hoyISO(),
      distancia_m: Math.round(metradoDistanciaM || 0),
      resultados: metradoUltimoCalculo,
      config: getMetradoConfig(),
      pintura_tipo: pinturaTipo,
      pintura_label: pinturaLabel,
      color: colorRegistro,
      highway: metradoSnapHighway || "",
      puntos: metradoPuntos.map(p => [Number(p.lat), Number(p.lng)]),
      inspecciones: metradoInspecciones.slice(),
      inspeccion_pendiente: !tieneInspeccion
    };
    metradoRegistros.push(registro);
    if(metradoNombre) metradoNombre.value = "";
    actualizarMetradoRegistrosUI();
    if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
    limpiarRutaMetrado();
    setMetradoStatus(
      tieneInspeccion
        ? "Registro guardado con inspeccion. Trazado conservado en el proyecto."
        : "Registro guardado. Falta inspeccion. Trazado conservado en el proyecto."
    );
  });
}
  if(metradoPanel){
    metradoPanel.addEventListener("change", (e)=>{
      const t = e && e.target ? e.target : null;
      if(!t || !t.name) return;
      if(["metradoAncho","metradoVia","metradoSep","metradoSentido"].includes(t.name)){
        try{ syncMetradoFormState(); }catch(err){}
        if(metradoCalculoActivo){
          actualizarResultadosMetrado();
        }
      }
    });
  }
  if(metradoSnapVias){
    metradoSnapEnabled = metradoSnapVias.checked;
    metradoSnapVias.addEventListener("change", ()=>{
      metradoSnapEnabled = metradoSnapVias.checked;
      metradoSnapLast = null;
      metradoSnapHover = null;
      if(metradoSnapEnabled){
        cargarViasMetrado();
        actualizarPesosMetrado();
      }
    });
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
try{ syncMetradoFormState(); }catch(e){}

if(selectProyecto){
  selectProyecto.addEventListener("change", ()=>{
    if(!btnCambiarProyecto){
      setProyectoActivoPorId(selectProyecto.value);
      return;
    }
    btnCambiarProyecto.disabled = !selectProyecto.value;
  });
}
if(invProyectoSelect){
  invProyectoSelect.addEventListener("change", ()=>{
    invProyectoFiltro = invProyectoSelect.value || "active";
    updateInversion();
  });
}
if(dashProjectSelect){
  dashProjectSelect.addEventListener("change", ()=>{
    dashProyectoFiltro = dashProjectSelect.value || "active";
    updateDashboard();
  });
}
if(btnCambiarProyecto){
  btnCambiarProyecto.addEventListener("click", ()=>{
    setProyectoActivoPorId(selectProyecto ? selectProyecto.value : "");
  });
}
if(apuCategoria){
  apuCategoria.addEventListener("change", ()=>{
    apuState.categoria = apuCategoria.value || "transito";
    apuState.selectedCodigo = "";
    updateApu();
  });
}
if(apuBuscar){
  apuBuscar.addEventListener("input", ()=>{
    apuState.selectedCodigo = "";
    renderApuTabla();
  });
}
if(apuTablaBody){
  apuTablaBody.addEventListener("click", (e)=>{
    const row = e.target && e.target.closest ? e.target.closest("tr[data-codigo]") : null;
    if(!row) return;
    apuState.selectedCodigo = row.getAttribute("data-codigo") || "";
    renderApuTabla();
  });
}
if(invTablaBody){
  invTablaBody.addEventListener("click", (e)=>{
    const target = e.target;
    const rowEl = target && target.closest ? target.closest("tr[data-row]") : null;
    const rowIndex = rowEl ? Number(rowEl.getAttribute("data-row")) : NaN;
    const row = Number.isFinite(rowIndex) ? invRowsCache[rowIndex] : null;

    const apuBtn = target && target.closest ? target.closest(".inv-apu-btn") : null;
    if(apuBtn){
      if(row) abrirApuRelacionado(row);
      return;
    }

    const mapBtn = target && target.closest ? target.closest(".inv-map-btn") : null;
    if(mapBtn){
      if(row) enfocarInversionEnMapa(row);
      return;
    }

    const btn = target && target.closest ? target.closest(".inv-edit-btn") : null;
    if(!btn || rolActual !== "municipal") return;
    const item = row ? row.ref : null;
    const kind = row ? row.kind : (btn.getAttribute("data-kind") || "");
    if(!item) return;
    const actual = precioInversionItem(kind, item);
    const valor = prompt("Nuevo valor de inversion (S/):", Number.isFinite(actual) ? actual.toFixed(2) : "");
    if(valor === null) return;
    const limpio = String(valor).trim();
    if(!limpio){
      setOverrideInversion(item, null);
      updateInversion();
      if(typeof guardarProyectos === "function"){
        guardarProyectos();
      } else if(typeof guardarProyectoActivo === "function"){
        guardarProyectoActivo();
      }
      return;
    }
    const num = Number(limpio.replace(",", "."));
    if(!Number.isFinite(num) || num < 0){
      alert("Ingresa un valor valido.");
      return;
    }
    setOverrideInversion(item, num);
    updateInversion();
    if(typeof guardarProyectos === "function"){
      guardarProyectos();
    } else if(typeof guardarProyectoActivo === "function"){
      guardarProyectoActivo();
    }
  });
}
if(btnAgregarProyecto){
  btnAgregarProyecto.addEventListener("click", ()=>{
    if(rolActual !== "municipal") return;
    abrirModalProyecto();
  });
}
if(btnEditarProyecto){
  btnEditarProyecto.addEventListener("click", ()=>{
    if(rolActual !== "municipal") return;
    abrirModalProyectoEditar();
  });
}
if(btnProyectoClose){
  btnProyectoClose.addEventListener("click", cerrarModalProyecto);
}
if(btnProyectoCancelar){
  btnProyectoCancelar.addEventListener("click", cerrarModalProyecto);
}
["input","change"].forEach((evt)=>{
  if(inputProyectoNombre) inputProyectoNombre.addEventListener(evt, updateProyectoPreview);
  if(inputProyectoInicio) inputProyectoInicio.addEventListener(evt, updateProyectoPreview);
  if(inputProyectoFin) inputProyectoFin.addEventListener(evt, updateProyectoPreview);
  if(chkProyectoTransito) chkProyectoTransito.addEventListener(evt, updateProyectoPreview);
  if(chkProyectoMarcas) chkProyectoMarcas.addEventListener(evt, updateProyectoPreview);
  if(chkProyectoMobiliario) chkProyectoMobiliario.addEventListener(evt, updateProyectoPreview);
  if(chkProyectoMetrado) chkProyectoMetrado.addEventListener(evt, updateProyectoPreview);
});
if(btnProyectoGuardar){
  btnProyectoGuardar.addEventListener("click", ()=>{
    const nombre = inputProyectoNombre ? inputProyectoNombre.value.trim() : "";
    if(!nombre){
      alert("Ingresa un nombre para el proyecto.");
      return;
    }
    const includeTransito = !!(chkProyectoTransito && chkProyectoTransito.checked);
    const includeMarcas = !!(chkProyectoMarcas && chkProyectoMarcas.checked);
    const includeMobiliario = !!(chkProyectoMobiliario && chkProyectoMobiliario.checked);
    const includeMetrado = !!(chkProyectoMetrado && chkProyectoMetrado.checked);
    if(!includeTransito && !includeMarcas && !includeMobiliario && !includeMetrado){
      alert("Selecciona al menos un tipo de activo.");
      return;
    }
    const inicio = inputProyectoInicio ? inputProyectoInicio.value : "";
    const fin = inputProyectoFin ? inputProyectoFin.value : "";
    if(inicio && fin && fin < inicio){
      alert("La fecha fin debe ser mayor o igual a la fecha inicio.");
      return;
    }

    const filtrarSeleccion = (list, set, include, cloner)=>{
      if(!include) return [];
      const base = Array.isArray(list) ? list : [];
      const cloneFn = (typeof cloner === "function") ? cloner : cloneSenales;
      if(!projectSelectionActive) return cloneFn(base);
      if(!set || !set.size) return [];
      return cloneFn(base.filter(s => set.has(String(s.id || ""))));
    };

    const seleccionadas = []
      .concat(filtrarSeleccion(typeof senalesVertical !== "undefined" ? senalesVertical : [], projectSelection.vertical, includeTransito, cloneSenales))
      .concat(filtrarSeleccion(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : [], projectSelection.horizontal, includeMarcas, cloneSenales))
      .concat(filtrarSeleccion(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : [], projectSelection.mobiliario, includeMobiliario, cloneSenales))
      .concat(filtrarSeleccion(typeof metradoRegistros !== "undefined" ? metradoRegistros : [], projectSelection.metrado, includeMetrado, cloneMetradoRegistros));
    if(projectSelectionActive && !seleccionadas.length){
      alert("Selecciona senales y trazos en el mapa para el proyecto.");
      return;
    }

    const base = {
      nombre,
      fecha_inicio: inicio || "",
      fecha_fin: fin || "",
      senalesHorizontal: filtrarSeleccion(typeof senalesHorizontal !== "undefined" ? senalesHorizontal : [], projectSelection.horizontal, includeMarcas, cloneSenales),
      senalesVertical: filtrarSeleccion(typeof senalesVertical !== "undefined" ? senalesVertical : [], projectSelection.vertical, includeTransito, cloneSenales),
      senalesMobiliario: filtrarSeleccion(typeof senalesMobiliario !== "undefined" ? senalesMobiliario : [], projectSelection.mobiliario, includeMobiliario, cloneSenales),
      metradoRegistros: filtrarSeleccion(typeof metradoRegistros !== "undefined" ? metradoRegistros : [], projectSelection.metrado, includeMetrado, cloneMetradoRegistros)
    };

    if(proyectoEditId){
      const idx = proyectosCache.findIndex(p => p.id === proyectoEditId);
      if(idx >= 0){
        const prev = proyectosCache[idx];
        proyectosCache[idx] = Object.assign({}, prev, base);
        proyectosCache[idx].id = prev.id;
        proyectosCache[idx].creado = prev.creado || hoyISO();
        setProyectoActivoPorId(proyectosCache[idx].id);
        syncProyectoBackend(proyectosCache[idx]);
      } else {
        const nuevo = Object.assign({
          id: "proj-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6),
          creado: hoyISO()
        }, base);
        proyectosCache.push(nuevo);
        setProyectoActivoPorId(nuevo.id);
        syncProyectoBackend(nuevo);
      }
    } else {
      const nuevo = Object.assign({
        id: "proj-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,6),
        creado: hoyISO()
      }, base);
      proyectosCache.push(nuevo);
      setProyectoActivoPorId(nuevo.id);
      syncProyectoBackend(nuevo);
    }
    guardarProyectos();
    actualizarSelectProyecto();
    actualizarInvProyectoSelect();
    actualizarDashProyectoSelect();
    updateProjectUI();
    cerrarModalProyecto();
  });
}

if(tablaProyectoPreview){
  tablaProyectoPreview.addEventListener("click", (e)=>{
    const btn = e.target && e.target.closest ? e.target.closest(".project-remove-btn") : null;
    if(!btn) return;
    if(!projectSelectionActive) return;
    const modo = btn.getAttribute("data-modo") || "";
    const id = btn.getAttribute("data-id") || "";
    if(!modo || !id || !projectSelection || !projectSelection[modo]) return;
    projectSelection[modo].delete(String(id));
    updateProyectoPreview();
    try{ if(typeof renderizarTodo === "function"){ renderizarTodo(); } }catch(err){}
  });
}
if(btnInspeccionClose){
  btnInspeccionClose.addEventListener("click", cerrarModalInspeccion);
}
if(btnInspeccionListClose){
  btnInspeccionListClose.addEventListener("click", cerrarModalInspeccionListado);
}
if(btnMetradoVerRegistros){
  btnMetradoVerRegistros.addEventListener("click", abrirModalMetradoRegistros);
}
if(btnMetradoRegistrosClose){
  btnMetradoRegistrosClose.addEventListener("click", cerrarModalMetradoRegistros);
}
if(metradoRegistrosList){
  metradoRegistrosList.addEventListener("click", (e)=>{
    const target = e.target;
    if(target && target.closest){
      const deleteBtn = target.closest(".btn-metrado-delete");
      if(deleteBtn){
        const id = deleteBtn.getAttribute("data-id") || "";
        metradoRegistros = (Array.isArray(metradoRegistros) ? metradoRegistros : []).filter(r => String(r.id) !== String(id));
        actualizarMetradoRegistrosUI();
        guardarProyectoActivo();
        return;
      }
      const focusBtn = target.closest(".btn-metrado-focus");
      if(focusBtn){
        focusMetradoRegistro(focusBtn.getAttribute("data-id") || "");
      }
    }
  });
}
if(btnInspeccionVerTodo){
  btnInspeccionVerTodo.addEventListener("click", ()=>{
    cerrarModalInspeccion();
    abrirModalInspeccionListado();
  });
}
if(btnInspeccionAgregar){
  btnInspeccionAgregar.addEventListener("click", async ()=>{
    const ins = await crearInspeccionDesdeForm();
    if(!ins) return;
    metradoInspecciones.push(ins);
    limpiarInspeccionForm();
    renderInspeccionPrev();
    renderInspeccionList();
  });
}
if(btnInspeccionFinalizar){
  btnInspeccionFinalizar.addEventListener("click", async ()=>{
    const ubicacion = leerTextoInput(insUbicacion);
    const tieneDatos = ubicacion || leerTextoInput(insComprende)
      || leerNumeroInput(insLi) || leerNumeroInput(insLd) || leerNumeroInput(insEc1) || leerNumeroInput(insEc2)
      || (insLiFoto && insLiFoto.files && insLiFoto.files[0])
      || (insLdFoto && insLdFoto.files && insLdFoto.files[0])
      || (insEc1Foto && insEc1Foto.files && insEc1Foto.files[0])
      || (insEc2Foto && insEc2Foto.files && insEc2Foto.files[0]);
    if(tieneDatos){
      const ins = await crearInspeccionDesdeForm();
      if(!ins) return;
      metradoInspecciones.push(ins);
      limpiarInspeccionForm();
      renderInspeccionPrev();
      renderInspeccionList();
    }
    cerrarModalInspeccion();
  });
}
if(inspeccionList){
  inspeccionList.addEventListener("click", async (e)=>{
    const target = e.target;
    const item = target && target.closest ? target.closest(".inspeccion-item") : null;
    if(!item) return;
    if(target.classList.contains("btn-inspeccion-edit")){
      const panel = item.querySelector(".inspeccion-edit");
      if(panel) panel.classList.toggle("hidden");
      return;
    }
    if(target.classList.contains("btn-inspeccion-cancel")){
      const panel = item.querySelector(".inspeccion-edit");
      if(panel) panel.classList.add("hidden");
      return;
    }
    if(target.classList.contains("btn-inspeccion-delete")){
      const id = Number(item.getAttribute("data-id"));
      metradoInspecciones = metradoInspecciones.filter(i => i.id !== id);
      renderInspeccionList();
      renderInspeccionPrev();
      return;
    }
    if(target.classList.contains("btn-inspeccion-history")){
      const hist = item.querySelector(".inspeccion-history");
      if(hist) hist.classList.toggle("hidden");
      return;
    }
    if(target.classList.contains("btn-inspeccion-clear")){
      target.classList.toggle("is-clear");
      target.textContent = target.classList.contains("is-clear") ? "Quitar ✓" : "Quitar";
      return;
    }
    if(target.classList.contains("btn-inspeccion-update")){
      await actualizarInspeccionDesdeItem(item);
      return;
    }
  });
}

// Capturar puntos de metrado en el mapa
try{
  if(typeof map !== "undefined" && map && typeof map.on === "function"){
    map.on("click", (e)=>{
      if(metradoPicking !== "draw") return;
      if(!e || !e.latlng) return;
      if(metradoLoading) return;

      let ok = false;
      if(!metradoSnapEnabled){
        if(metradoSnapVias){
          metradoSnapVias.checked = true;
        }
        metradoSnapEnabled = true;
        cargarViasMetrado();
        setMetradoStatus("Activa el ajuste a vias para trazar solo en pistas.");
        return;
      }
      if(!metradoSnapReady){
        setMetradoStatus("Cargando vias para ajuste. Espera un momento.");
        return;
      }
      let snap = buscarSnapMetrado(e.latlng);
      if(!snap && metradoSnapHover){
        snap = metradoSnapHover;
      }
      if(!snap){
        setMetradoStatus("Acerca el cursor a una pista para continuar el trazado.");
        return;
      }
      ok = agregarPuntoMetradoSnapped(snap);
      if(!ok){
        if(metradoSnapFailReason === "salto"){
          setMetradoStatus("Para cambiar de pista, hazlo cerca de la interseccion.");
        } else if(metradoSnapFailReason === "tramo"){
          setMetradoStatus("Tramo largo. Acerca el cursor para continuar.");
        } else {
          setMetradoStatus("Acerca el cursor a la pista para continuar.");
        }
        return;
      }

      if(metradoPuntos.length === 1){
        setMetradoStatus("Inicio listo. Sigue marcando puntos sobre la pista y finaliza.");
      } else if(metradoSnapFailReason === "tramo"){
        setMetradoStatus("Tramo largo. Sigue trazando desde el ultimo punto.");
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
        let snap = null;
        if(metradoSnapEnabled && metradoSnapReady){
          snap = buscarSnapMetrado(e.latlng);
        }
        metradoSnapHover = snap;
        if(snap){
          if(metradoCursorMarker) metradoCursorMarker.setLatLng(snap.latlng);
          if(metradoPreviewLine){
            const preview = construirPreviewMetrado(snap);
            metradoPreviewLine.setLatLngs(preview);
          }
          ajustarPreviewMetrado(snap.highway);
        } else {
          if(metradoCursorMarker) metradoCursorMarker.setLatLng(e.latlng);
          if(metradoPreviewLine){
            metradoPreviewLine.setLatLngs([]);
          }
          ajustarPreviewMetrado("");
        }
      }catch(err){}
    });

    map.on("zoomend", ()=>{
      actualizarPesosMetrado();
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
