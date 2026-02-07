function leerConfigUrbbis(){
    try{
        if(typeof window !== "undefined" && window.URBBIS_CONFIG && typeof window.URBBIS_CONFIG === "object"){
            return window.URBBIS_CONFIG;
        }
    }catch(e){}
    try{
        const raw = localStorage.getItem("urbbisConfig");
        const cfg = raw ? JSON.parse(raw) : {};
        if(typeof window !== "undefined"){
            window.URBBIS_CONFIG = cfg || {};
        }
        return cfg || {};
    }catch(e){
        return {};
    }
}

const _cfgInitUrbbis = leerConfigUrbbis();
const _zoomInicial = (Number.isFinite(_cfgInitUrbbis.zoomInicial) ? _cfgInitUrbbis.zoomInicial : 13);

const map = L.map("map", {
    scrollWheelZoom: true,
    wheelPxPerZoomLevel: 45
}).setView([-12.0464, -77.0428], _zoomInicial);

let mapTilesReady = false;
function ensureMapTiles(){
    if(mapTilesReady) return;
    mapTilesReady = true;

    // Base limpia sin iconos; solo vias
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        maxNativeZoom: 20,
        maxZoom: 23,
        attribution: '&copy; OpenStreetMap, &copy; CARTO'
    }).addTo(map);

    // Capa de etiquetas (calles y lugares), sin iconos interactivos
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
        maxNativeZoom: 20,
        maxZoom: 23,
        pane: 'labels'
    }).addTo(map);
}
window.ensureMapTiles = ensureMapTiles;

const ESTADO_COLORES = {
    nueva: "#2fa84f",
    antigua: "#d93f3f",
    sin_senal: "#3f7ed9"
};

function escapeHtml(value){
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function labelEstado(estado){
    const map = { nueva:"Operativa", antigua:"Deteriorada", sin_senal:"No operativa" };
    return map[estado] || (estado || "-");
}

function estadoFisicoValorDesdeEstado(estado){
    if(estado === "antigua") return "deteriorada";
    if(estado === "sin_senal") return "no_operativa";
    if(estado === "nueva") return "operativa";
    return "";
}

function labelEstadoFisico(valor, estado){
    const map = {
        operativa: "Operativa",
        deteriorada: "Deteriorada",
        no_operativa: "No operativa (Ausente)"
    };
    const raw = String(valor || "").toLowerCase().trim();
    if(raw && map[raw]) return map[raw];
    const fromEstado = estadoFisicoValorDesdeEstado(estado);
    return fromEstado && map[fromEstado] ? map[fromEstado] : "-";
}

function toApiNumber(value){
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}

function buildAssetPayload(s, type){
    return {
        legacyId: Number.isFinite(Number(s.id)) ? Number(s.id) : undefined,
        type,
        name: s.nombre || "",
        category: s.tipo || "",
        icon: s.icono || "",
        state: s.estado || "",
        statePhysical: s.estado_fisico || s.estadoFisico || "",
        lat: s.lat,
        lng: s.lng,
        district: s.distrito || s.zona || "",
        region: s.region || "",
        price: typeof s.precio === "number" ? s.precio : undefined,
        installedAt: s.fecha_colocacion || "",
        width: s.dimensiones ? toApiNumber(s.dimensiones.ancho) : undefined,
        length: s.dimensiones ? toApiNumber(s.dimensiones.largo) : undefined,
        areaM2: typeof s.area_m2 === "number" ? s.area_m2 : undefined,
        photoUrl: s.inspeccionFoto || s.foto || null
    };
}

function labelSiNo(valor){
    const raw = String(valor || "").toLowerCase().trim();
    if(raw === "si" || raw === "sí") return "Sí";
    if(raw === "no") return "No";
    return valor ? String(valor) : "-";
}

// Se¤ales de tr nsito (vertical) por categoria
const VERTICAL_FILES_PREVENTIVA = [
    "P-10A.webp",
    "P-10B.webp",
    "P-11.webp",
    "P-12.webp",
    "P-13A.webp",
    "P-13B.webp",
    "P-14A.webp",
    "P-14B.webp",
    "P-15.webp",
    "P-16A.webp",
    "P-16B.webp",
    "P-17.webp",
    "P-18.webp",
    "P-19.webp",
    "P-1A.webp",
    "P-1B.webp",
    "P-20.webp",
    "P-21.webp",
    "P-22.webp",
    "P-23.webp",
    "P-24.webp",
    "P-25.webp",
    "P-26.webp",
    "P-27.webp",
    "P-28.webp",
    "P-29.webp",
    "P-2A.webp",
    "P-2B.webp",
    "P-30.webp",
    "P-31.webp",
    "P-32.webp",
    "P-33.webp",
    "P-34.webp",
    "P-35.webp",
    "P-36.webp",
    "P-37.webp",
    "P-38.webp",
    "P-39.webp",
    "P-3A.webp",
    "P-3B.webp",
    "P-40.webp",
    "P-41.webp",
    "P-42.webp",
    "P-43.webp",
    "P-44.webp",
    "P-45.webp",
    "P-46.webp",
    "P-47.webp",
    "P-48.webp",
    "P-49.webp",
    "P-4A.webp",
    "P-4B.webp",
    "P-5-1.webp",
    "P-5-2A.webp",
    "P-5-2B.webp",
    "P-50.webp",
    "P-51.webp",
    "P-52.webp",
    "P-53.webp",
    "P-54.webp",
    "P-55.webp",
    "P-56.webp",
    "P-57.webp",
    "P-58.webp",
    "P-59.webp",
    "P-6.webp",
    "P-60.webp",
    "P-61.webp",
    "P-62-Peso-bruto-m\u00e1ximo-permitido.webp",
    "P-66-R\u00e1fagas-de-viento-lateral.webp",
    "P-66A-Zona-de-arenamiento-en-la-v\u00eda.webp",
    "P-7.webp",
    "P-8.webp",
    "P-9A.webp",
    "P-9B.webp"
];

const VERTICAL_FILES_REGLAMENTARIA = [
    "R-1.webp",
    "R-10.webp",
    "R-11.webp",
    "R-12.webp",
    "R-13.webp",
    "R-14A.webp",
    "R-14B.webp",
    "R-15.webp",
    "R-16.webp",
    "R-17.webp",
    "R-18-1.webp",
    "R-18-2.webp",
    "R-18.webp",
    "R-19.webp",
    "R-2.webp",
    "R-20.webp",
    "R-21.webp",
    "R-22.webp",
    "R-23.webp",
    "R-24.webp",
    "R-25.webp",
    "R-26.webp",
    "R-27.webp",
    "R-27A.webp",
    "R-28.webp",
    "R-29.webp",
    "R-3.webp",
    "R-30-1.webp",
    "R-30-2.webp",
    "R-30-3.webp",
    "R-30-4.webp",
    "R-30.webp",
    "R-31.webp",
    "R-32.webp",
    "R-33.webp",
    "R-34.webp",
    "R-35.webp",
    "R-36.webp",
    "R-37.webp",
    "R-38.webp",
    "R-39.webp",
    "R-4.webp",
    "R-40.webp",
    "R-41.webp",
    "R-42.webp",
    "R-44.webp",
    "R-45.webp",
    "R-46.webp",
    "R-5-1.webp",
    "R-5-2.webp",
    "R-5-3.webp",
    "R-5-4.webp",
    "R-5.webp",
    "R-6.webp",
    "R-7.webp",
    "R-8.webp",
    "R-9.webp"
];

const VERTICAL_FILES_INFORMATIVA = [
    "I-1A-Escudo-indicador-de-carretera-del-sistema.webp",
    "I-1B-S\u00edmbolo-que-identifica-la-red-vial.webp",
    "I-20-llanteria.webp",
    "I-21-personas-con-movilidad-reducida.webp",
    "I-22-Servicio-de-informacion.webp",
    "I-23-Servicios-higienicos.webp",
    "I-24-Transporte-ferroviario.webp",
    "I-25-transporte-masivo-de-conductores.webp",
    "I-26-zona-recreativa.webp",
    "I-27-Tsunami-ruta-de-evacuacion.webp",
    "I-28-Zona-de-riesgo-por-Tsunami.webp",
    "I-29-Punto-de-encuentro-por-Tsunami.webp",
    "I-31-Estacionamiento-para-emergencias.webp",
    "i-10-Iglesia.webp",
    "i-11-Aeropuerto.webp",
    "i-12-Hospedaje.webp",
    "i-13-primeros-auxilios.webp",
    "i-14-hospital.webp",
    "i-15-servicios-sanitarios.webp",
    "i-16-restaurante.webp",
    "i-17-telefono.webp",
    "i-18-servicio-mecanico.webp",
    "i-19-grifo.webp",
    "i-32-Extintor-contra-incendios.webp",
    "i-33-Hidrante-y-manguera-contra-incendios.webp",
    "i-34-Salida-de-emergencia.webp",
    "i-35-Ruta-de-emergencia.webp",
    "i-36-estacionamiento-de-casa-rodante.webp",
    "i-37-se\u00f1al-de-prese\u00f1alizacion.webp",
    "i-38-se\u00f1al-de-prese\u00f1alizacion.webp",
    "i-5-Sitio-de-parqueo.webp",
    "i-6-Paradero-de-buses.webp",
    "i-7-Estacionamiento_de_taxis.webp",
    "i-8-via-para-ciclistas.webp",
    "i-9-Zona-militar.webp",
    "informativas-con-salida.webp",
    "informativas.webp",
    "t-1-Zona-de-camping.webp",
    "t-2-Museo.webp",
    "t-3-Muelle.webp",
    "t-4-Servicio-de-informaci\u00f3n-tur\u00edstica.webp"
];

function labelDesdeArchivoIcono(base){
    const raw = String(base || "");
    const clean = raw.replace(/_/g," ").trim();
    const parts = clean.split("-").filter(Boolean);
    if(parts.length < 3){
        return clean;
    }
    // Si no es formato codificado (P- / R- / I-), mostrar el nombre completo
    if(!/^[A-Za-z]$/.test(parts[0])){
        return clean.replace(/-/g," ").replace(/\s+/g," ").trim();
    }
    const rest = parts.slice(2).join(" ").replace(/-/g," ").replace(/\s+/g," ").trim();
    const norm = rest.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if(/[a-z]{2}/.test(norm)){
        return rest;
    }
    return clean;
}

function toWebpPath(path){
    return String(path || "").replace(/\.(png|jpg|jpeg)$/i, ".webp");
}

function buildIconosVertical(){
    const out = [];
    const groups = [
        { categoria: "preventiva", folder: "Preventiva", files: VERTICAL_FILES_PREVENTIVA },
        { categoria: "reglamentaria", folder: "Reglamentaria", files: VERTICAL_FILES_REGLAMENTARIA },
        { categoria: "informativa", folder: "Informativa", files: VERTICAL_FILES_INFORMATIVA }
    ];
    groups.forEach(function(g){
        (g.files || []).forEach(function(file){
            const base = String(file || "").replace(/\.(png|webp)$/i,"");
            out.push({
                id: base,
                label: labelDesdeArchivoIcono(base),
                categoria: g.categoria,
                src: toWebpPath("src/vertical/" + g.folder + "/" + encodeURIComponent(file))
            });
        });
    });
    return out;
}

const ICONOS = {
    horizontal: [
        { id: "pista", label: "Pista", src: toWebpPath("src/horizontal/pista.webp") },
        { id: "paso", label: "Paso peatonal", src: toWebpPath("src/horizontal/invalidez.webp") },
        { id: "acceso", label: "Acceso", src: toWebpPath("src/horizontal/images.webp") },
        { id: "ceda", label: "Ceda el paso", src: toWebpPath("src/horizontal/sedaelpaso.webp") },
        { id: "banda_transversal", label: "Banda transversal", src: toWebpPath("src/horizontal/ico_banda_transversal.webp") },
        { id: "crucero", label: "Crucero", src: toWebpPath("src/horizontal/ico_crucero.webp") },
        { id: "enrejado", label: "Enrejado amarillo", src: toWebpPath("src/horizontal/ico_enrrejado_amarillo.webp") },
        { id: "flecha_arriba", label: "Flecha recto", src: toWebpPath("src/horizontal/ico_flecha_arriba.webp") },
        { id: "flecha_arriba_der", label: "Recto y derecha", src: toWebpPath("src/horizontal/ico_flecha_arriba_giro_derecha.webp") },
        { id: "flecha_arriba_izq", label: "Recto y izquierda", src: toWebpPath("src/horizontal/ico_flecha_arriba_giro_izquierda.webp") },
        { id: "flecha_der", label: "Flecha giro der", src: toWebpPath("src/horizontal/ico_flecha_giro_der.webp") },
        { id: "flecha_izq", label: "Flecha giro izq", src: toWebpPath("src/horizontal/ico_flecha_giro_izq.webp") },
        { id: "isla", label: "Isla", src: toWebpPath("src/horizontal/ico_isla.webp") },
        { id: "isla_amarilla", label: "Isla amarilla", src: toWebpPath("src/horizontal/ico_isla_amarilla.webp") },
        { id: "linea_continua", label: "Linea continua", src: toWebpPath("src/horizontal/ico_linea_continua.webp") },
        { id: "linea_continua_amarilla", label: "Linea continua amarilla", src: toWebpPath("src/horizontal/ico_linea_continua_Amarillo.webp") },
        { id: "linea_continua_relieve", label: "Linea continua relieve", src: toWebpPath("src/horizontal/ico_linea_continua_relieve.webp") },
        { id: "linea_discontinua", label: "Linea discontinua", src: toWebpPath("src/horizontal/ico_linea_discontinua.webp") },
        { id: "linea_discontinua_amarilla", label: "Linea discontinua amarilla", src: toWebpPath("src/horizontal/ico_linea_discontinua_amarillo.webp") },
        { id: "linea_pare", label: "Linea PARE", src: toWebpPath("src/horizontal/ico_linea_pare.webp") },
        { id: "pare", label: "PARE horizontal", src: toWebpPath("src/horizontal/ico_pare.webp") },
        { id: "peatones", label: "Peatones", src: toWebpPath("src/horizontal/ico_peatones.webp") },
        { id: "vel_30", label: "Velocidad 30", src: toWebpPath("src/horizontal/ico_vel_30.webp") },
        { id: "vel_35", label: "Velocidad 35", src: toWebpPath("src/horizontal/ico_vel_35.webp") },
        { id: "vel_40", label: "Velocidad 40", src: toWebpPath("src/horizontal/ico_vel_40.webp") },
        { id: "zona_escolar", label: "Zona escolar", src: toWebpPath("src/horizontal/ico_zona_escolar.webp") }
    ],
    vertical: buildIconosVertical()
};

function hashEntero(str){
    const s = String(str || "");
    let h = 0;
    for(let i = 0; i < s.length; i++){
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

function precioBaseIcono(modo, iconId){
    const base = modo === "vertical" ? 5200 : 4200;
    const range = modo === "vertical" ? 2200 : 1800;
    const step = 50;
    const h = hashEntero((modo || "") + ":" + (iconId || ""));
    const slots = Math.floor(range / step) + 1;
    return base + ((h % slots) * step);
}

function construirPreciosIconos(){
    const out = { horizontal:{}, vertical:{} };
    ["horizontal","vertical"].forEach(function(modo){
        const usados = new Set();
        (ICONOS[modo] || []).forEach(function(icon){
            let p = precioBaseIcono(modo, icon.id);
            while(usados.has(p)){
                p += 50;
            }
            usados.add(p);
            out[modo][icon.id] = p;
        });
    });
    return out;
}

const PRECIOS_ICONOS = construirPreciosIconos();
function precioSugeridoPorIcono(modo, iconId){
    const map = PRECIOS_ICONOS[modo] || {};
    if(map && map[iconId]) return map[iconId];
    return modo === "vertical" ? 6000 : 4500;
}
window.precioSugeridoPorIcono = precioSugeridoPorIcono;

let rolActual = "municipal"; // municipal o visitante
let marcadores = []; // legacy (ya no se usa para render principal)
let distritoLayer = null;
let avisosMarkers = [];
let pickingReporte = false;
let puntoReporte = null;
let marcadorReporte = null;
let reabrirModalReporte = false;

// Capas de visualizacion (marcas viales / senales transito / mobiliario / eventos)
const layerMarcas = L.layerGroup().addTo(map);
const layerTransito = L.layerGroup().addTo(map);
const layerMobiliario = L.layerGroup();
const layerEventos = L.layerGroup().addTo(map);

const VISUALIZACION = {
    capas: { transito:true, marcas:true, mobiliario:true, eventos:true },
    conservacion: { operativos:true, deteriorados:true, no_operativos:true },
    verificacion: { con_foto:true, sin_foto:true },
    tiempo: { activos:true, programados:true, sin_finalizados:true }
};
window.URBBIS_VISUALIZACION = VISUALIZACION;

function setCapaVisible(key, visible){
    VISUALIZACION.capas[key] = !!visible;
    const mapHas = (grp)=>{
        try{ return map && grp && map.hasLayer(grp); }catch(e){ return false; }
    };
    const apply = (grp)=>{
        if(!grp) return;
        const should = !!visible;
        if(should && !mapHas(grp)){
            try{ grp.addTo(map); }catch(e){}
        }
        if(!should && mapHas(grp)){
            try{ map.removeLayer(grp); }catch(e){}
        }
    };
    if(key === "marcas") apply(layerMarcas);
    if(key === "transito") apply(layerTransito);
    if(key === "mobiliario") apply(layerMobiliario);
    if(key === "eventos") apply(layerEventos);
}
window.setCapaVisible = setCapaVisible;

function estadosSeleccionadosConservacion(){
    const out = new Set();
    if(VISUALIZACION.conservacion.operativos) out.add("nueva");
    if(VISUALIZACION.conservacion.deteriorados) out.add("antigua");
    if(VISUALIZACION.conservacion.no_operativos) out.add("sin_senal");
    return out;
}

function filtrarAvisosPorVisualizacion(data){
    let base = Array.isArray(data) ? data.slice() : [];
    try{
        let distrito = "";
        if(typeof cargarSesionScope === "function"){
            const scope = cargarSesionScope() || {};
            distrito = scope.distrito || "";
        }
        if(!distrito && typeof filtroDistrito !== "undefined"){
            distrito = filtroDistrito || "";
        }
        if(distrito){
            const low = String(distrito).toLowerCase();
            base = base.filter(a => String(a && a.distrito || "").toLowerCase() === low);
        }
    }catch(e){}

    // Verificacion de campo (foto)
    const conFoto = VISUALIZACION.verificacion.con_foto;
    const sinFoto = VISUALIZACION.verificacion.sin_foto;
    if(!(conFoto && sinFoto)){
        base = base.filter(a=>{
            const has = !!a.foto;
            if(has && conFoto) return true;
            if(!has && sinFoto) return true;
            return false;
        });
    }

    // Tiempo (interpretacion simple sobre estado del aviso)
    const allowed = new Set();
    if(VISUALIZACION.tiempo.activos){
        allowed.add("pendiente");
        allowed.add("atendido");
    }
    if(VISUALIZACION.tiempo.sin_finalizados){
        allowed.add("pendiente");
    }
    // programados: aun no aplica (sin datos)
    if(allowed.size){
        base = base.filter(a=>allowed.has(a.estado || "pendiente"));
    }

    return base;
}

function iconoMobiliario(estado){
    const color = colorPorEstado(estado);
    return L.divIcon({
        className:"estado-marker",
        html:'<div class="marker-bubble" style="border-color:'+color+';background:#fff;"><div class="marker-img" style="background:'+color+';width:18px;height:18px;border-radius:6px;display:grid;place-items:center;color:#fff;font-weight:900;font-size:12px;">M</div></div>',
        iconSize:[32,32],
        iconAnchor:[16,28],
        popupAnchor:[0,-20]
    });
}

const AVISO_COLORES = {
    pendiente: "#f7a800",
    atendido: "#2fa84f"
};

function iconoPorId(id, modo){
    const lista = ICONOS[modo] || [];
    return lista.find(function(i){ return i.id === id; }) || lista[0];
}

function colorPorEstado(estado){
    return ESTADO_COLORES[estado] || "#6c7890";
}

function iconoDefault(){
    const lista = ICONOS[modoActual] || [];
    return lista[0] ? lista[0].id : null;
}

function iconoDefaultPorModo(modo){
    const lista = ICONOS[modo] || [];
    return lista[0] ? lista[0].id : null;
}

function asegurarPreciosSenales(){
    try{
        if(Array.isArray(senalesHorizontal)){
            senalesHorizontal.forEach(function(s){
                if(!s) return;
                if(typeof s.precio === "number" && isFinite(s.precio) && s.precio > 0) return;
                s.precio = precioSugeridoPorIcono("horizontal", s.icono);
            });
        }
        if(Array.isArray(senalesVertical)){
            senalesVertical.forEach(function(s){
                if(!s) return;
                if(typeof s.precio === "number" && isFinite(s.precio) && s.precio > 0) return;
                s.precio = precioSugeridoPorIcono("vertical", s.icono);
            });
        }
    }catch(e){}
}

function normalizarNombreLugar(str){
    if(!str) return "";
    return String(str)
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9\s]/g," ")
        .replace(/\s+/g," ")
        .trim();
}

function regionPorDistrito(distrito){
    if(!distrito) return "";
    const objetivo = normalizarNombreLugar(distrito);
    try{
        for(const region of Object.keys(MAPA_REGIONES || {})){
            const lista = MAPA_REGIONES[region] || [];
            for(const d of lista){
                if(normalizarNombreLugar(d) === objetivo){
                    return region;
                }
            }
        }
    }catch(e){}
    return "";
}

async function inferirDistritoPorLatLng(lat, lng){
    try{
        const url = "https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=" + encodeURIComponent(lat) + "&lon=" + encodeURIComponent(lng);
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await res.json();
        const addr = (data && data.address) ? data.address : {};
        const candidatos = [
            addr.city_district,
            addr.district,
            addr.suburb,
            addr.municipality,
            addr.county,
            addr.neighbourhood
        ].filter(Boolean);

        let distritos = [];
        try{
            distritos = Object.values(MAPA_REGIONES || {}).flat();
        }catch(e){
            distritos = [];
        }
        const normDistritos = distritos.map(d=>normalizarNombreLugar(d));
        for(const c of candidatos){
            const n = normalizarNombreLugar(c);
            const idx = normDistritos.indexOf(n);
            if(idx >= 0) return distritos[idx];
        }
        return candidatos[0] || "";
    }catch(err){
        return "";
    }
}

function crearIcono(estado, iconoId, modo){
    const color = colorPorEstado(estado);
    const iconDef = iconoPorId(iconoId, modo);
    const html = ''
        + '<div class="marker-bubble" style="border-color:' + color + '">'
        +   '<div class="marker-img" style="background-image:url(\'' + iconDef.src + '\')"></div>'
        + '</div>';
    return L.divIcon({
        className: "estado-marker",
        html: html,
        iconSize: [42, 42],
        iconAnchor: [21, 38],
        popupAnchor: [0, -24]
    });
}

function aplicarSeleccionMarker(marker, selected){
    try{
        const el = marker.getElement ? marker.getElement() : null;
        if(el) el.classList.toggle("project-selected", !!selected);
    }catch(e){}
}

function enlazarSeleccionProyecto(marker, modo, item){
    if(!marker || !item) return;
    if(typeof window.toggleProjectItemSelection !== "function") return;
    const aplicarSiSeleccionado = ()=>{
        try{
            if(typeof window.isProjectSelectionActive === "function" && window.isProjectSelectionActive()){
                if(typeof window.isProjectItemSelected === "function" && window.isProjectItemSelected(modo, item.id)){
                    aplicarSeleccionMarker(marker, true);
                } else {
                    aplicarSeleccionMarker(marker, false);
                }
            } else {
                aplicarSeleccionMarker(marker, false);
            }
        }catch(e){}
    };
    marker.on("add", aplicarSiSeleccionado);
    aplicarSiSeleccionado();
    marker.on("click", function(){
        try{
            if(typeof window.isProjectSelectionActive !== "function" || !window.isProjectSelectionActive()) return;
            const changed = window.toggleProjectItemSelection(modo, item);
            if(!changed) return;
            const selected = (typeof window.isProjectItemSelected === "function")
                ? window.isProjectItemSelected(modo, item.id)
                : false;
            aplicarSeleccionMarker(marker, selected);
        }catch(e){}
    });
}

function renderizarSenalesModo(lista, modo, layerGroup) {
    if(!layerGroup || typeof layerGroup.clearLayers !== "function") return;
    layerGroup.clearLayers();

    (lista || []).forEach(function(s){
        const iconoInicial = s.icono || iconoDefaultPorModo(modo) || iconoDefault();
        if(s.zona && (!s.region || s.region === "Sin region")){
            const reg = regionPorDistrito(s.zona);
            if(reg) s.region = reg;
        }

        const svgEdit = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            + '<path d="M12 20h9"></path>'
            + '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>'
            + '</svg>';
        const svgTrash = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            + '<polyline points="3 6 5 6 21 6"></polyline>'
            + '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>'
            + '<path d="M10 11v6"></path>'
            + '<path d="M14 11v6"></path>'
            + '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>'
            + '</svg>';

        function precioSeguro(){
            const p = (typeof s.precio === "number" && isFinite(s.precio) && s.precio > 0) ? s.precio : 0;
            return p ? ("S/ " + Math.round(p).toLocaleString("es-PE")) : "-";
        }

        function fechaSeguro(){
            const f = String(s.fecha_colocacion || "").trim();
            return f ? f : "-";
        }

        function buildPopupView(){
            const distrito = (s.zona && s.zona !== "Sin zona" && s.zona !== "Sin distrito") ? s.zona : "-";
            const region = regionPorDistrito(distrito) || (s.region && s.region !== "Sin region" ? s.region : "-");
            const iconId = s.icono || iconoInicial;
            const iconInfo = iconoPorId(iconId, modo);
            const actions = (rolActual === "municipal")
                ? ('<div class="senal-popup-actions">'
                    + '<button type="button" class="senal-action-btn js-senal-edit" title="Editar">' + svgEdit + '</button>'
                    + '<button type="button" class="senal-action-btn danger js-senal-delete" title="Eliminar">' + svgTrash + '</button>'
                   + '</div>')
                : '';

            const estadoColor = colorPorEstado(s.estado);
            const extraVertical = (modo === "vertical") ? (function(){
                const lamina = s.lamina ? String(s.lamina) : "-";
                const soporte = labelSiNo(s.soporte);
                const estadoFisico = labelEstadoFisico(s.estado_fisico || s.estadoFisico, s.estado);
                const verificado = !!(s.inspeccionFoto);
                const verifLabel = verificado ? "Verificado" : "No verificado";
                const verifColor = verificado ? "#2fa84f" : "#6b778c";
                return ''
                    + '<div class="senal-row"><span>Tipo de l&aacute;mina</span><strong>' + escapeHtml(lamina) + '</strong></div>'
                    + '<div class="senal-row"><span>Soporte</span><strong>' + escapeHtml(soporte) + '</strong></div>'
                    + '<div class="senal-row"><span>Estado f&iacute;sico</span><strong>' + escapeHtml(estadoFisico) + '</strong></div>'
                    + '<div class="senal-row"><span>Verificaci&oacute;n</span>'
                    +   '<span class="estado-pill" style="background:' + verifColor + '22;border-color:' + verifColor + '55;color:' + verifColor + '">' + escapeHtml(verifLabel) + '</span>'
                    + '</div>';
            })() : '';
            return ''
                + '<div class="senal-popup" data-modo="' + modo + '" data-id="' + String(s.id || "") + '">'
                +   '<div class="senal-popup-head">'
                +     '<div class="senal-popup-title-wrap">'
                +       '<div class="senal-popup-title">' + escapeHtml(s.tipo || "Senal") + '</div>'
                +       '<div class="senal-popup-sub">' + (modo === "horizontal" ? "Marcas viales" : "Senales de transito") + '</div>'
                +     '</div>'
                +     actions
                +   '</div>'
                +   '<div class="senal-popup-meta">'
                +     '<div class="senal-row"><span>Distrito</span><strong>' + escapeHtml(distrito) + '</strong></div>'
                +     '<div class="senal-row"><span>Region</span><strong>' + escapeHtml(region) + '</strong></div>'
                +     '<div class="senal-row"><span>Estado</span><span class="estado-pill" style="background:' + estadoColor + '22;border-color:' + estadoColor + '55;color:' + estadoColor + '">' + escapeHtml(labelEstado(s.estado)) + '</span></div>'
                +     '<div class="senal-row"><span>Senal</span><strong>' + escapeHtml(iconInfo ? iconInfo.label : iconId) + '</strong></div>'
                +     '<div class="senal-row"><span>Fecha</span><strong>' + escapeHtml(fechaSeguro()) + '</strong></div>'
                +     extraVertical
                +   '</div>'
                + '</div>';
        }

        function buildPopupEdit(){
            const iconId = s.icono || iconoInicial || iconoDefaultPorModo(modo) || iconoDefault();
            const precioVal = (typeof s.precio === "number" && isFinite(s.precio) && s.precio > 0)
                ? String(Math.round(s.precio))
                : String(precioSugeridoPorIcono(modo, iconId));

            const fechaVal = (s.estado === "sin_senal") ? "" : (String(s.fecha_colocacion || "").trim() || new Date().toISOString().slice(0,10));
            const fechaHidden = (s.estado === "sin_senal") ? " hidden" : "";

            const iconsList = (ICONOS && ICONOS[modo] ? ICONOS[modo] : []).map(function(i){
                const active = i.id === iconId ? " active" : "";
                return ''
                + '<button type="button" class="icon-option' + active + '" data-icon="' + escapeHtml(i.id) + '">'
                    + '<span class="icon-thumb" style="background-image:url(\'' + i.src + '\')"></span>'
                    + '<small>' + escapeHtml(i.label) + '</small>'
                + '</button>';
            }).join("");

            return ''
                + '<form class="senal-popup senal-popup--edit js-senal-edit-form" data-modo="' + modo + '" data-id="' + String(s.id || "") + '">'
                +   '<div class="senal-popup-head">'
                +     '<div class="senal-popup-title-wrap">'
                +       '<div class="senal-popup-title">Editar senal</div>'
                +       '<div class="senal-popup-sub">Actualiza estado, icono o precio</div>'
                +     '</div>'
                +   '</div>'
                +   '<div class="senal-edit-body">'
                +     '<label class="senal-field">'
                +       '<span>Tipo</span>'
                +       '<input type="text" class="js-senal-tipo" value="' + escapeHtml(s.tipo || "") + '" placeholder="Tipo de senal">'
                +     '</label>'
                +     '<div class="senal-field">'
                +       '<span>Estado</span>'
                +       '<div class="estado-grid">'
                +           '<button type="button" class="estado-option' + (s.estado === "nueva" ? " active" : "") + '" data-estado="nueva">Operativa</button>'
                +           '<button type="button" class="estado-option' + (s.estado === "antigua" ? " active" : "") + '" data-estado="antigua">Deteriorada</button>'
                +           '<button type="button" class="estado-option' + (s.estado === "sin_senal" ? " active" : "") + '" data-estado="sin_senal">No operativa</button>'
                +       '</div>'
                +     '</div>'
                +     '<div class="fecha-row js-senal-fecha-row' + fechaHidden + '">'
                +       '<label>Fecha de colocacion</label>'
                +       '<input type="date" class="js-senal-fecha" value="' + escapeHtml(fechaVal) + '">'
                +     '</div>'
                +     '<div class="precio-row">'
                +       '<label>Precio (S/)</label>'
                +       '<div class="precio-input"><span>S/</span><input type="number" class="js-senal-precio" min="0" step="50" value="' + escapeHtml(precioVal) + '"></div>'
                +     '</div>'
                +     '<div class="senal-field">'
                +       '<span>Icono</span>'
                +       '<input type="text" class="icon-search js-senal-icon-search" placeholder="Buscar icono...">'
                +       '<div class="icon-grid js-senal-icon-grid">' + iconsList + '</div>'
                +     '</div>'
                +   '</div>'
                +   '<div class="senal-edit-actions">'
                +     '<button type="button" class="senal-edit-btn ghost js-senal-cancel">Cancelar</button>'
                +     '<button type="submit" class="senal-edit-btn primary">Guardar</button>'
                +   '</div>'
                + '</form>';
        }

        const marker = L.marker([s.lat, s.lng], {
            draggable: rolActual === "municipal",
            icon: crearIcono(s.estado, iconoInicial, modo)
        }).addTo(layerGroup);
        enlazarSeleccionProyecto(marker, modo, s);

        let uiMode = "view"; // view | edit
        marker.bindPopup(buildPopupView());

        function abrirVista(){
            uiMode = "view";
            try{ marker.setPopupContent(buildPopupView()); }catch(e){}
            requestAnimationFrame(enlazarAccionesVista);
        }

        function abrirEdicion(){
            if(rolActual !== "municipal") return;
            uiMode = "edit";
            try{ marker.setPopupContent(buildPopupEdit()); }catch(e){}
            requestAnimationFrame(enlazarAccionesEdicion);
        }

        function pasaFiltroEstado(obj){
            try{
                if(typeof filtroEstado !== "undefined" && filtroEstado){
                    return obj.estado === filtroEstado;
                }
            }catch(e){}
            try{
                const allowed = estadosSeleccionadosConservacion();
                if(allowed && allowed.size){
                    return allowed.has(obj.estado);
                }
            }catch(e){}
            return true;
        }

        function eliminarSenal(){
            if(rolActual !== "municipal") return;
            if(!confirm("¿Eliminar esta senal? Esta accion no se puede deshacer.")) return;
            try{
                const dataset = (modo === "horizontal") ? senalesHorizontal : senalesVertical;
                const idx = Array.isArray(dataset) ? dataset.findIndex(x => x && x.id === s.id) : -1;
                const snapshot = Object.assign({}, s);
                if(typeof registrarHistorialSenal === "function"){
                    registrarHistorialSenal({ accion:"ELIMINADA", modo, before:snapshot });
                }
                if(idx >= 0){
                    dataset.splice(idx, 1);
                }
                try{ layerGroup.removeLayer(marker); }catch(e){}
                try{ marker.closePopup(); }catch(e){}
                if(typeof updateReportes === "function"){ updateReportes(); }
                if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
                if(window.UrbbisApi && typeof window.UrbbisApi.deleteAsset === "function"){
                    if(s.dbId){
                        window.UrbbisApi.deleteAsset(s.dbId)
                            .catch((err)=> console.warn("No se pudo eliminar la señal en backend.", err));
                    } else {
                        console.warn("No se pudo eliminar en backend (dbId faltante).");
                    }
                }
            }catch(e){
                alert("No se pudo eliminar la senal.");
            }
        }

        function enlazarAccionesVista(){
            if(rolActual !== "municipal") return;
            const popup = marker.getPopup();
            const el = popup && typeof popup.getElement === "function" ? popup.getElement() : null;
            if(!el) return;
            const btnEdit = el.querySelector(".js-senal-edit");
            const btnDel = el.querySelector(".js-senal-delete");
            if(btnEdit) btnEdit.addEventListener("click", function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                abrirEdicion();
            });
            if(btnDel) btnDel.addEventListener("click", function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                eliminarSenal();
            });
        }

        function enlazarAccionesEdicion(){
            const popup = marker.getPopup();
            const el = popup && typeof popup.getElement === "function" ? popup.getElement() : null;
            if(!el) return;
            const form = el.querySelector(".js-senal-edit-form");
            if(!form) return;

            let estadoSel = s.estado || "nueva";
            let iconSel = s.icono || iconoInicial || iconoDefaultPorModo(modo) || iconoDefault();

            const btnCancel = el.querySelector(".js-senal-cancel");
            const inputTipo = el.querySelector(".js-senal-tipo");
            const inputFecha = el.querySelector(".js-senal-fecha");
            const fechaRow = el.querySelector(".js-senal-fecha-row");
            const inputPrecio = el.querySelector(".js-senal-precio");
            const iconSearch = el.querySelector(".js-senal-icon-search");
            const iconGrid = el.querySelector(".js-senal-icon-grid");

            const hoy = new Date().toISOString().slice(0,10);

            function toggleFecha(){
                if(!fechaRow || !inputFecha) return;
                const needs = (estadoSel === "nueva" || estadoSel === "antigua");
                fechaRow.classList.toggle("hidden", !needs);
                if(needs && !inputFecha.value){
                    inputFecha.value = String(s.fecha_colocacion || "").trim() || hoy;
                }
                if(!needs){
                    inputFecha.value = "";
                }
            }

            toggleFecha();

            el.querySelectorAll(".estado-option").forEach(function(btn){
                btn.addEventListener("click", function(ev){
                    ev.preventDefault();
                    estadoSel = btn.getAttribute("data-estado") || estadoSel;
                    el.querySelectorAll(".estado-option").forEach(b=>b.classList.remove("active"));
                    btn.classList.add("active");
                    toggleFecha();
                });
            });

            el.querySelectorAll(".icon-option").forEach(function(btn){
                btn.addEventListener("click", function(ev){
                    ev.preventDefault();
                    iconSel = btn.getAttribute("data-icon") || iconSel;
                    el.querySelectorAll(".icon-option").forEach(b=>b.classList.remove("active"));
                    btn.classList.add("active");
                    // Si el precio estaba vacio, sugerir segun el icono
                    try{
                        const current = inputPrecio ? Number(inputPrecio.value) : 0;
                        if(inputPrecio && (!Number.isFinite(current) || current <= 0)){
                            inputPrecio.value = String(precioSugeridoPorIcono(modo, iconSel));
                        }
                    }catch(e){}
                });
            });

            function norm(str){
                return String(str || "")
                    .toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
                    .trim();
            }

            function filtrarIconos(q){
                if(!iconGrid) return;
                const query = norm(q);
                iconGrid.querySelectorAll(".icon-option").forEach(function(btn){
                    const id = btn.getAttribute("data-icon") || "";
                    const label = (btn.querySelector("small") ? btn.querySelector("small").textContent : "");
                    const hay = norm(id + " " + label);
                    btn.style.display = (!query || hay.includes(query)) ? "" : "none";
                });
            }

            if(iconSearch){
                iconSearch.addEventListener("input", function(){
                    filtrarIconos(iconSearch.value);
                });
            }

            if(btnCancel){
                btnCancel.addEventListener("click", function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    abrirVista();
                });
            }

            form.addEventListener("submit", function(ev){
                ev.preventDefault();
                ev.stopPropagation();

                const before = {
                    tipo: s.tipo,
                    estado: s.estado,
                    estado_fisico: s.estado_fisico || s.estadoFisico || "",
                    fecha_colocacion: s.fecha_colocacion || "",
                    precio: s.precio,
                    icono: s.icono
                };

                const tipoNuevo = inputTipo ? String(inputTipo.value || "").trim() : "";
                const fechaNueva = (estadoSel === "sin_senal") ? "" : (inputFecha ? String(inputFecha.value || "").trim() : "");
                const precioNuevo = inputPrecio ? Number(inputPrecio.value) : 0;

                if(!iconSel){
                    alert("Selecciona un icono.");
                    return;
                }
                if(!Number.isFinite(precioNuevo) || precioNuevo <= 0){
                    alert("Ingresa un precio valido (mayor a 0).");
                    return;
                }
                if(estadoSel !== "sin_senal" && !fechaNueva){
                    alert("Selecciona una fecha de colocacion.");
                    return;
                }

                if(tipoNuevo){
                    s.tipo = tipoNuevo;
                }
                s.estado = estadoSel;
                try{
                    s.estado_fisico = estadoFisicoValorDesdeEstado(estadoSel);
                }catch(e){}
                s.fecha_colocacion = fechaNueva;
                s.icono = iconSel;
                s.precio = precioNuevo;

                try{
                    marker.setIcon(crearIcono(s.estado, s.icono, modo));
                }catch(e){}

                const after = {
                    tipo: s.tipo,
                    estado: s.estado,
                    estado_fisico: s.estado_fisico || s.estadoFisico || "",
                    fecha_colocacion: s.fecha_colocacion || "",
                    precio: s.precio,
                    icono: s.icono
                };

                if(typeof registrarHistorialSenal === "function"){
                    registrarHistorialSenal({ accion:"EDITADA", modo, before, after, senal:s });
                }

                if(typeof updateReportes === "function"){ updateReportes(); }
                if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
                if(window.UrbbisApi && typeof window.UrbbisApi.updateAsset === "function" && s.dbId){
                    const payload = buildAssetPayload(s, modo);
                    window.UrbbisApi.updateAsset(s.dbId, payload)
                        .catch((err)=> console.warn("No se pudo actualizar la señal en backend.", err));
                }

                // Si con el nuevo estado ya no pasa filtro, se oculta
                if(!pasaFiltroEstado(s)){
                    try{ layerGroup.removeLayer(marker); }catch(e){}
                    try{ marker.closePopup(); }catch(e){}
                    return;
                }

                abrirVista();
            });
        }

        marker.on("popupopen", async function(){
            const needsDistrito = !s.zona || s.zona === "Sin zona" || s.zona === "Sin distrito";
            const needsRegion = !s.region || s.region === "Sin region" || !regionPorDistrito(s.zona || "");
            const needGeo = needsDistrito || needsRegion;

            if(needGeo && !s.__geoResolving){
                s.__geoResolving = true;
                try{
                    if(needsDistrito){
                        const d = await inferirDistritoPorLatLng(s.lat, s.lng);
                        if(d) s.zona = d;
                    }
                    const reg = regionPorDistrito(s.zona || "");
                    if(reg) s.region = reg;
                    try{
                        marker.setPopupContent(uiMode === "edit" ? buildPopupEdit() : buildPopupView());
                    }catch(e){}
                    if(typeof updateReportes === "function"){ updateReportes(); }
                }catch(e){
                    console.warn("No se pudo resolver distrito/region:", e);
                }finally{
                    s.__geoResolving = false;
                }
            }

            requestAnimationFrame(function(){
                if(uiMode === "edit") enlazarAccionesEdicion();
                else enlazarAccionesVista();
            });
        });

        marker.on("dragend", function (e) {
            const nueva = e.target.getLatLng();
            s.lat = nueva.lat;
            s.lng = nueva.lng;
            console.log('Senal ' + s.id + ' movida a:', nueva);
            alert('Se movio la senal ' + s.id + ' a nueva ubicacion.');
            if(typeof updateReportes === "function"){ updateReportes(); }
            if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
            if(window.UrbbisApi && typeof window.UrbbisApi.updateAsset === "function" && s.dbId){
                const payload = buildAssetPayload(s, modo);
                window.UrbbisApi.updateAsset(s.dbId, payload)
                    .catch((err)=> console.warn("No se pudo actualizar la ubicación en backend.", err));
            }
        });

    });
}

function renderizarMobiliario(lista, layerGroup){
    if(!layerGroup || typeof layerGroup.clearLayers !== "function") return;
    layerGroup.clearLayers();
    (lista || []).forEach(function(s){
        const marker = L.marker([s.lat, s.lng], {
            draggable: rolActual === "municipal",
            icon: iconoMobiliario(s.estado)
        }).addTo(layerGroup);
        enlazarSeleccionProyecto(marker, "mobiliario", s);
        marker.bindPopup('<strong>Mobiliario vial</strong><br>'
            + 'Distrito: ' + (s.zona || "-") + '<br>'
            + 'Region: ' + (s.region || regionPorDistrito(s.zona || "") || "-") + '<br>'
            + 'Estado: ' + (s.estado || "-"));

        marker.on("dragend", function(e){
            const nueva = e.target.getLatLng();
            s.lat = nueva.lat;
            s.lng = nueva.lng;
            if(typeof updateReportes === "function"){ updateReportes(); }
            if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
            if(window.UrbbisApi && typeof window.UrbbisApi.updateAsset === "function" && s.dbId){
                const payload = buildAssetPayload(s, "mobiliario");
                window.UrbbisApi.updateAsset(s.dbId, payload)
                    .catch((err)=> console.warn("No se pudo actualizar mobiliario en backend.", err));
            }
        });
    });
}

function renderizarTodo(){
    const allowed = estadosSeleccionadosConservacion();
    function filtrarSenales(dataset){
        let base = Array.isArray(dataset) ? dataset.slice() : [];
        if(typeof filtroEstado !== "undefined" && filtroEstado){
            base = base.filter(s => s.estado === filtroEstado);
        } else if(allowed){
            if(allowed.size === 0) return [];
            base = base.filter(s => allowed.has(s.estado));
        }
        return base;
    }

    renderizarSenalesModo(filtrarSenales(senalesHorizontal), "horizontal", layerMarcas);
    renderizarSenalesModo(filtrarSenales(senalesVertical), "vertical", layerTransito);
    const mob = (typeof senalesMobiliario !== "undefined" && Array.isArray(senalesMobiliario)) ? senalesMobiliario : [];
    renderizarMobiliario(filtrarSenales(mob), layerMobiliario);
    renderAvisos();
}
window.renderizarTodo = renderizarTodo;

// Compat: llamadas antiguas
function renderizarSenales(){
    renderizarTodo();
}

asegurarPreciosSenales();
setCapaVisible("marcas", VISUALIZACION.capas.marcas);
setCapaVisible("transito", VISUALIZACION.capas.transito);
setCapaVisible("mobiliario", VISUALIZACION.capas.mobiliario);
setCapaVisible("eventos", VISUALIZACION.capas.eventos);
renderizarTodo();
if(typeof updateReportes === "function"){ updateReportes(); }

// Popup para crear senal con pestanas estado/icono
function templateCrearPopup(lat, lng){
    const iconsList = (ICONOS[modoActual] || []).map(function(i){
        return ''
        + '<button class="icon-option" data-icon="' + i.id + '">'
            +   '<span class="icon-thumb" style="background-image:url(\'' + i.src + '\')"></span>'
            +   '<small>' + i.label + '</small>'
        + '</button>';
    }).join("");

    return ''
    + '<div class="popup-crear">'
    +   '<div class="step estado-step active">'
    +       '<div class="step-title">Estado</div>'
    +       '<div class="estado-grid">'
    +           '<button class="estado-option" data-estado="nueva">Operativa</button>'
    +           '<button class="estado-option" data-estado="antigua">Deteriorada</button>'
    +           '<button class="estado-option" data-estado="sin_senal">No operativa</button>'
    +       '</div>'
    +       '<div class="fecha-row hidden">'
    +           '<label>Fecha de colocacion</label>'
    +           '<input type="date" id="inputFechaEstado" />'
    +       '</div>'
    +   '</div>'
    +   '<div class="step icono-step hidden">'
    +       '<div class="step-title">Icono</div>'
    +       '<input type="text" class="icon-search" placeholder="Buscar icono...">'
    +       '<div class="icon-grid">' + iconsList + '</div>'
    +       '<div class="precio-row">'
    +           '<label>Precio (S/)</label>'
    +           '<div class="precio-input"><span>S/</span><input type="number" id="inputPrecioSenal" min="0" step="50" placeholder="0"></div>'
    +       '</div>'
    +   '</div>'
    +   '<button class="btn-crear hidden" data-lat="' + lat + '" data-lng="' + lng + '" disabled>Crear senal</button>'
    + '</div>';
}

function enlazarPopupCrear(lat, lng){
    const popupEl = document.querySelector(".popup-crear");
    if(!popupEl) return;

    let estadoSel = null;
    let iconSel = null;
    let fechaSel = "";
    let precioSel = 0;

    const fechaRow = popupEl.querySelector(".fecha-row");
    const inputFecha = popupEl.querySelector("#inputFechaEstado");
    const inputPrecio = popupEl.querySelector("#inputPrecioSenal");
    const btnCrear = popupEl.querySelector(".btn-crear");
    const iconStep = popupEl.querySelector(".icono-step");
    const estadoStep = popupEl.querySelector(".estado-step");
    const iconSearch = popupEl.querySelector(".icon-search");

    const hoy = new Date().toISOString().slice(0,10);
    if(inputFecha) inputFecha.value = hoy;

    function norm(str){
        return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    function toggleFecha(){
        if(!fechaRow) return;
        if(estadoSel === "nueva" || estadoSel === "antigua"){
            fechaRow.classList.remove("hidden");
            if(inputFecha && !inputFecha.value) inputFecha.value = hoy;
            fechaSel = inputFecha ? inputFecha.value : "";
        } else {
            fechaRow.classList.add("hidden");
            fechaSel = "";
        }
        evaluarBoton();
        // Re-centrar si el alto del popup cambia
        setTimeout(function(){
            try{ if(map && map._popup){ centrarPopupCrear(map._popup); } }catch(e){}
        }, 0);
    }

    function evaluarBoton(){
        const precioOk = typeof precioSel === "number" && isFinite(precioSel) && precioSel > 0;
        const listo = estadoSel && iconSel && precioOk && (estadoSel === "sin_senal" || fechaSel);
        if(btnCrear){
            btnCrear.disabled = !listo;
            btnCrear.classList.toggle("hidden", !listo);
        }
    }

    // Estado
    popupEl.querySelectorAll(".estado-option").forEach(function(btn){
        btn.addEventListener("click", function(){
            popupEl.querySelectorAll(".estado-option").forEach(function(b){ b.classList.remove("active"); });
            btn.classList.add("active");
            estadoSel = btn.getAttribute("data-estado");
            if(estadoStep){
                estadoStep.classList.add("collapsed");
            }
            if(iconStep){
                iconStep.classList.remove("hidden");
            }
            toggleFecha();
            setTimeout(function(){
                try{ if(map && map._popup){ centrarPopupCrear(map._popup); } }catch(e){}
            }, 0);
        });
    });

    // Fecha
    if(inputFecha){
        inputFecha.addEventListener("change", function(){
            fechaSel = inputFecha.value;
            evaluarBoton();
            setTimeout(function(){
                try{ if(map && map._popup){ centrarPopupCrear(map._popup); } }catch(e){}
            }, 0);
        });
    }

    // Iconos
    const iconOptions = popupEl.querySelectorAll(".icon-option");
    popupEl.querySelectorAll(".icon-option").forEach(function(btn){
        btn.addEventListener("click", function(){
            if(!estadoSel) return;
            popupEl.querySelectorAll(".icon-option").forEach(function(b){ b.classList.remove("active"); });
            btn.classList.add("active");
            iconSel = btn.getAttribute("data-icon");

            if(inputPrecio){
                const actual = parseFloat(inputPrecio.value);
                if(!isFinite(actual) || actual <= 0){
                    inputPrecio.value = String(precioSugeridoPorIcono(modoActual, iconSel));
                }
                precioSel = parseFloat(inputPrecio.value) || 0;
            }
            evaluarBoton();
            setTimeout(function(){
                try{ if(map && map._popup){ centrarPopupCrear(map._popup); } }catch(e){}
            }, 0);
        });
    });
    if(inputPrecio){
        inputPrecio.addEventListener("input", function(){
            const v = parseFloat(inputPrecio.value);
            precioSel = (isFinite(v) && v >= 0) ? v : 0;
            evaluarBoton();
        });
    }
    if(iconSearch){
        iconSearch.addEventListener("input", function(){
            const term = norm(iconSearch.value);
            iconOptions.forEach(function(btn){
                const label = norm(btn.querySelector("small") ? btn.querySelector("small").textContent : "");
                const match = !term || label.includes(term);
                btn.style.display = match ? "grid" : "none";
            });
        });
    }

    // Crear
    popupEl.querySelector(".btn-crear").addEventListener("click", function(){
        crearSenal(lat, lng, estadoSel, iconSel, fechaSel, precioSel);
        map.closePopup();
    });
}

map.on("contextmenu", function(e){
    if(e && e.originalEvent){
        try{ L.DomEvent.preventDefault(e.originalEvent); }catch(err){}
    }

    // Municipal: crear señal
    if(rolActual === "municipal"){
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        L.popup({ closeButton: true, autoPan: false, className: "popup-crear-leaflet" })
            .setLatLng([lat, lng])
            .setContent(templateCrearPopup(lat, lng))
            .openOn(map);

        // dar tiempo a que el popup se inyecte
        setTimeout(function(){ enlazarPopupCrear(lat, lng); }, 0);
        return;
    }

    // Visitante: seleccionar punto de aviso (click derecho)
    if(rolActual === "visitante"){
        puntoReporte = e.latlng;
        pickingReporte = false;

        const info = document.getElementById("infoUbicacion");
        if(info){
            info.textContent = "Ubicacion seleccionada: " + e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5);
        }
        if(marcadorReporte){
            map.removeLayer(marcadorReporte);
            marcadorReporte = null;
        }
        const icon = L.divIcon({
            className:"estado-marker",
            html:'<div class="marker-bubble" style="border-color:#f7a800;background:#fff;"><div class="marker-img" style="background:#f7a800;width:14px;height:14px;border-radius:50%;"></div></div>',
            iconSize:[32,32],
            iconAnchor:[16,28],
            popupAnchor:[0,-20]
        });
        marcadorReporte = L.marker(puntoReporte,{icon}).addTo(map);

        const modal = document.getElementById("modalReporte");
        if(modal){
            modal.classList.remove("hidden");
        }
        reabrirModalReporte = false;
    }
});

function centrarPopupCrear(popup){
    try{
        const cfg = leerConfigUrbbis();
        const animOn = cfg && cfg.animaciones !== false;
        const duration = animOn ? (Number.isFinite(cfg.animDur) ? cfg.animDur : 0.55) : 0;
        if(!popup) return;
        const popupEl = typeof popup.getElement === "function" ? popup.getElement() : null;
        if(!popupEl) return;
        if(!popupEl.querySelector(".popup-crear")) return;

        const wrapper = popupEl.querySelector(".leaflet-popup-content-wrapper") || popupEl;
        const mapEl = map.getContainer();
        if(!mapEl) return;

        const mapRect = mapEl.getBoundingClientRect();
        const wRect = wrapper.getBoundingClientRect();

        const popupCenterX = wRect.left + (wRect.width / 2);
        const popupCenterY = wRect.top + (wRect.height / 2);
        const mapCenterX = mapRect.left + (mapRect.width / 2);
        const mapCenterY = mapRect.top + (mapRect.height / 2);

        // Queremos que el popup quede centrado pero un poco más abajo para
        // que se vea completo el contenido (especialmente en pantallas pequeñas).
        const padX = Math.max(12, mapRect.width * 0.04);
        const padTop = Math.max(12, mapRect.height * 0.06);
        const padBottom = Math.max(12, mapRect.height * 0.08);
        const offsetDown = Math.min(140, mapRect.height * 0.14);

        const minCenterX = mapRect.left + padX + (wRect.width / 2);
        const maxCenterX = mapRect.right - padX - (wRect.width / 2);
        const minCenterY = mapRect.top + padTop + (wRect.height / 2);
        const maxCenterY = mapRect.bottom - padBottom - (wRect.height / 2);

        let targetCenterX = mapCenterX;
        let targetCenterY = mapCenterY + offsetDown;

        if(Number.isFinite(minCenterX) && Number.isFinite(maxCenterX)){
            targetCenterX = Math.max(minCenterX, Math.min(maxCenterX, targetCenterX));
        }
        if(Number.isFinite(minCenterY) && Number.isFinite(maxCenterY)){
            targetCenterY = Math.max(minCenterY, Math.min(maxCenterY, targetCenterY));
        }

        let dx = popupCenterX - targetCenterX;
        let dy = popupCenterY - targetCenterY;

        const maxX = mapRect.width * 0.48;
        const maxY = mapRect.height * 0.48;
        dx = Math.max(-maxX, Math.min(maxX, dx));
        dy = Math.max(-maxY, Math.min(maxY, dy));

        map.panBy([dx, dy], { animate: animOn, duration: duration, easeLinearity: 0.22, noMoveStart: true });
    }catch(e){}
}

map.on("popupopen", function(ev){
    // Asegura medidas correctas (DOM + estilos ya aplicados)
    requestAnimationFrame(function(){
        requestAnimationFrame(function(){
            if(ev && ev.popup){
                centrarPopupCrear(ev.popup);
            }
        });
    });
});

map.on("click", function(e){
    if(pickingReporte){
        puntoReporte = e.latlng;
        const info = document.getElementById("infoUbicacion");
        if(info){ info.textContent = "Ubicacion seleccionada: " + e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5); }
        if(marcadorReporte){
            map.removeLayer(marcadorReporte);
            marcadorReporte = null;
        }
        const icon = L.divIcon({
            className:"estado-marker",
            html:'<div class="marker-bubble" style="border-color:#f7a800;background:#fff;"><div class="marker-img" style="background:#f7a800;width:14px;height:14px;border-radius:50%;"></div></div>',
            iconSize:[32,32],
            iconAnchor:[16,28],
            popupAnchor:[0,-20]
        });
        marcadorReporte = L.marker(puntoReporte,{icon}).addTo(map);
        // si venimos de "Elegir en mapa", reabrir modal
        if(reabrirModalReporte){
            const modal = document.getElementById("modalReporte");
            if(modal){ modal.classList.remove("hidden"); }
            pickingReporte = false;
            reabrirModalReporte = false;
        }
    }
});

function fmtPrecioHistorial(value){
    const n = Number(value);
    if(!Number.isFinite(n) || n <= 0) return "-";
    return "S/ " + Math.round(n).toLocaleString("es-PE");
}

function labelIconoHistorial(modo, iconId){
    if(!iconId) return "-";
    try{
        const info = iconoPorId(iconId, modo);
        if(info && info.label) return info.label;
    }catch(e){}
    return iconId;
}

function detectarCambiosSenal(modo, before, after){
    const cambios = [];
    if(!before || !after) return cambios;
    const bTipo = before.tipo || "";
    const aTipo = after.tipo || "";
    if(bTipo !== aTipo){
        cambios.push({ key:"tipo", label:"Tipo", from:bTipo || "-", to:aTipo || "-" });
    }

    const bEstado = before.estado || "";
    const aEstado = after.estado || "";
    if(bEstado !== aEstado){
        cambios.push({ key:"estado", label:"Estado", from:labelEstado(bEstado), to:labelEstado(aEstado) });
    }

    const bFecha = String(before.fecha_colocacion || "").trim();
    const aFecha = String(after.fecha_colocacion || "").trim();
    if(bFecha !== aFecha){
        cambios.push({ key:"fecha", label:"Fecha", from:bFecha || "-", to:aFecha || "-" });
    }

    const bPrecio = fmtPrecioHistorial(before.precio);
    const aPrecio = fmtPrecioHistorial(after.precio);
    if(bPrecio !== aPrecio){
        cambios.push({ key:"precio", label:"Precio", from:bPrecio, to:aPrecio });
    }

    const bIcon = before.icono || "";
    const aIcon = after.icono || "";
    if(bIcon !== aIcon){
        cambios.push({ key:"icono", label:"Icono", from:labelIconoHistorial(modo, bIcon), to:labelIconoHistorial(modo, aIcon) });
    }

    return cambios;
}

function idParaHistorial(modo, senalLike){
    const prefix = (modo === "vertical") ? "SV" : "SH";
    try{
        if(typeof idFormateado === "function" && typeof construirIndicePorZona === "function"){
            const dataset = (modo === "vertical") ? (typeof senalesVertical !== "undefined" ? senalesVertical : []) : (typeof senalesHorizontal !== "undefined" ? senalesHorizontal : []);
            const idxByZone = construirIndicePorZona(dataset);
            return idFormateado(prefix, senalLike, idxByZone);
        }
    }catch(e){}
    const base = (senalLike && (senalLike.id || senalLike.id === 0)) ? String(senalLike.id) : "";
    return "URB-" + prefix + "-" + base.padStart(4,"0");
}

function registrarHistorialSenal(input){
    try{
        if(typeof historialSenales === "undefined" || !Array.isArray(historialSenales)) return null;
    }catch(e){
        return null;
    }

    const accionIn = input && input.accion ? String(input.accion) : "EDITADA";
    const modo = (input && input.modo) ? String(input.modo) : "horizontal";
    const senal = input && input.senal ? input.senal : null;
    const before = input && input.before ? input.before : null;
    const after = input && input.after ? input.after : null;

    const base = senal || after || before || {};
    const distrito = (base && base.zona) ? base.zona : (base && base.distrito ? base.distrito : "");
    const region = regionPorDistrito(distrito || "") || (base && base.region ? base.region : "");

    const cambios = detectarCambiosSenal(modo, before, after);
    let accion = accionIn.toUpperCase();
    if(accion === "EDITADA" && cambios.length){
        const keys = cambios.map(c=>c.key);
        const hasEstado = keys.includes("estado");
        const onlyEstadoFecha = keys.every(k => (k === "estado" || k === "fecha"));
        if(hasEstado && onlyEstadoFecha){
            accion = "ESTADO";
        } else if(hasEstado){
            accion = "ACTUALIZADA";
        }
    }

    let detalle = "";
    if(accion === "CREADA"){
        detalle = "Se registro una senal.";
    } else if(accion === "ELIMINADA"){
        detalle = "Se elimino la senal.";
    } else if(cambios.length){
        detalle = cambios.map(c => c.label + ": " + c.from + " → " + c.to).join(" | ");
    } else {
        detalle = "Sin cambios.";
    }

    let idSeq = Date.now();
    try{
        if(typeof historialSenalesSeq !== "undefined"){
            idSeq = historialSenalesSeq;
            historialSenalesSeq += 1;
        }
    }catch(e){}

    const item = {
        id: idSeq,
        ts: new Date().toISOString(),
        accion,
        modo,
        urbId: idParaHistorial(modo, base),
        senalId: base && (base.id || base.id === 0) ? base.id : null,
        tipo: base && base.tipo ? base.tipo : "",
        distrito: distrito || "",
        region: region || "",
        detalle
    };

    try{
        historialSenales.unshift(item);
        if(historialSenales.length > 500){
            historialSenales.length = 500;
        }
    }catch(e){}

    return item;
}
window.registrarHistorialSenal = registrarHistorialSenal;

function crearSenal(lat, lng, estado, icono, fecha, precio, extra){
    const datasetActual = modoActual === "horizontal" ? senalesHorizontal : senalesVertical;
    senales = datasetActual; // referencia activa
    const nextId = datasetActual.reduce(function(max, s){ return Math.max(max, s.id); },0) + 1;
    const modoPrecio = modoActual === "horizontal" ? "horizontal" : "vertical";
    const iconFinal = icono || iconoDefault();
    const precioFinal = (typeof precio === "number" && isFinite(precio) && precio > 0)
        ? precio
        : precioSugeridoPorIcono(modoPrecio, iconFinal);

    // Capturar region/distrito actuales para que los filtros no oculten la nueva señal
    const regionSel = (typeof selectRegion !== "undefined" && selectRegion) ? selectRegion.value : "";
    const distritoSel = (typeof selectDistrito !== "undefined" && selectDistrito) ? selectDistrito.value : "";
    let distritoInfer = "Sin distrito";
    let regionInfer = "Sin region";
    try{
        if(distritoSel && distritoLayer && typeof distritoLayer.getBounds === "function"){
            const bounds = distritoLayer.getBounds();
            if(bounds && bounds.contains([parseFloat(lat), parseFloat(lng)])){
                distritoInfer = distritoSel;
                regionInfer = regionSel || regionPorDistrito(distritoInfer) || "Sin region";
            }
        }
    }catch(e){}

    const nueva = {
        id: nextId,
        tipo: "SENAL",
        estado: estado,
        estado_fisico: estadoFisicoValorDesdeEstado(estado),
        zona: distritoInfer,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        icono: iconFinal,
        region: regionInfer,
        nombre: "Nueva senal",
        precio: precioFinal,
        fecha_colocacion: estado === "sin_senal" ? "" : (fecha || new Date().toISOString().slice(0,10))
    };

    if(extra && typeof extra === "object"){
        try{
            Object.assign(nueva, extra);
        }catch(e){}
    }

    datasetActual.push(nueva);
    try{
        registrarHistorialSenal({ accion:"CREADA", modo: modoActual, senal: nueva });
    }catch(e){}
    renderizarSenales(datasetActual);
    if(typeof updateReportes === "function"){ updateReportes(); }
    if(typeof guardarProyectoActivo === "function"){ guardarProyectoActivo(); }
    // Siempre intentar inferir distrito/region por coordenadas para evitar errores
    // cuando se crea fuera del distrito seleccionado.
    inferirDistritoPorLatLng(nueva.lat, nueva.lng).then(function(d){
        if(d){
            nueva.zona = d;
        }
        const reg = regionPorDistrito(nueva.zona || "");
        if(reg){
            nueva.region = reg;
        }
        renderizarSenales(datasetActual);
        if(typeof updateReportes === "function"){ updateReportes(); }
    });

    return nueva;
}

async function zoomADistrito(nombre){
    try{
        const cfg = leerConfigUrbbis();
        const animOn = cfg && cfg.animaciones !== false;
        const dur = animOn ? (Number.isFinite(cfg.animDur) ? cfg.animDur : 1.2) : 0;
        const url = "https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=" + encodeURIComponent(nombre + ", Lima, Peru") + "&limit=1";
        const res = await fetch(url);
        const data = await res.json();
        if(data && data[0]){
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if(distritoLayer){
                map.removeLayer(distritoLayer);
                distritoLayer = null;
            }

            if(data[0].geojson){
                distritoLayer = L.geoJSON(data[0].geojson, {
                    interactive: false,
                    style: { color: "#1d70b8", weight: 2, fillOpacity: 0.08 }
                }).addTo(map);
                const bounds = distritoLayer.getBounds();
                const size = map.getSize();
                const pad = Math.max(50, Math.min(size.x, size.y) * 0.12); // 12% del menor lado, más respiro
                map.flyToBounds(bounds, {padding:[pad,pad], duration:Math.max(dur, 0.6), easeLinearity:0.2, maxZoom:16});
            } else {
                map.flyTo([lat, lon], 14, {duration:dur, easeLinearity:0.25});
            }
        }
    }catch(err){
        console.warn("No se pudo ubicar el distrito:", err);
    }
}

function setRol(nuevo){
    rolActual = nuevo;
    renderizarTodo();
    try{
        document.body.classList.toggle("role-municipal", rolActual === "municipal");
        document.body.classList.toggle("role-visitante", rolActual === "visitante");
    }catch(e){}
    const btnReportar = document.getElementById("btnReportar");
    if(btnReportar){
        btnReportar.style.display = rolActual === "municipal" ? "none" : "block";
    }
    const chipRol = document.getElementById("chipRol");
    if(chipRol){
        chipRol.textContent = "Rol: " + (rolActual === "municipal" ? "Municipal" : "Visitante");
    }
    const btnToggleRol = document.getElementById("btnToggleRol");
    if(btnToggleRol){
        if(rolActual === "municipal"){
            btnToggleRol.style.display = "inline-flex";
            btnToggleRol.textContent = "Cambiar a visitante";
        } else {
            btnToggleRol.style.display = "none";
        }
    }
    const mobileBanner = document.querySelector(".mobile-banner");
    if(mobileBanner){
        mobileBanner.textContent = rolActual === "municipal" ? "Vista Municipal" : "Vista Visitante";
    }
    if(typeof updateMobileBanner === "function"){
        updateMobileBanner();
    }
    if(typeof updateProjectUI === "function"){
        updateProjectUI();
    }
}

// Avisos ciudadanos
function iconoAviso(estado){
    const color = AVISO_COLORES[estado] || AVISO_COLORES.pendiente;
    return L.divIcon({
        className:"estado-marker",
        html:'<div class="marker-bubble" style="border-color:'+color+';background:#fff;"><div class="marker-img" style="background:'+color+';width:14px;height:14px;border-radius:50%;"></div></div>',
        iconSize:[32,32],
        iconAnchor:[16,28],
        popupAnchor:[0,-20]
    });
}

function abrirPopupEstadoAviso(aviso, latlng){
    if(!aviso) return;
    const container = document.createElement("div");
    container.className = "aviso-estado-popup";
    const titulo = document.createElement("div");
    titulo.className = "aviso-estado-title";
    titulo.textContent = "Estado del aviso";
    const desc = document.createElement("div");
    desc.className = "aviso-estado-desc";
    desc.textContent = (aviso.tipo || "Aviso") + " • " + (aviso.fecha || "");

    const actions = document.createElement("div");
    actions.className = "aviso-estado-actions";

    function mkBtn(label, value){
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "aviso-estado-btn" + (aviso.estado === value ? " active" : "");
        btn.textContent = label;
        btn.addEventListener("click", ()=>{
            aviso.estado = value;
            renderAvisos();
            if(typeof updateReportes === "function"){ updateReportes(); }
            if(window.UrbbisApi && typeof window.UrbbisApi.updateReport === "function" && aviso.dbId){
                window.UrbbisApi.updateReport(aviso.dbId, { status: value })
                    .catch((err)=> console.warn("No se pudo actualizar el aviso en backend.", err));
            }
            map.closePopup();
        });
        return btn;
    }

    actions.appendChild(mkBtn("Pendiente", "pendiente"));
    actions.appendChild(mkBtn("Atendido", "atendido"));

    container.appendChild(titulo);
    container.appendChild(desc);
    container.appendChild(actions);

    L.popup({closeButton:true, className:"popup-aviso-estado"})
        .setLatLng(latlng)
        .setContent(container)
        .openOn(map);
}

function renderAvisos(){
    if(!layerEventos || typeof layerEventos.clearLayers !== "function") return;
    layerEventos.clearLayers();
    const data = filtrarAvisosPorVisualizacion(avisos);
    data.forEach(function(a){
        const m = L.marker([a.lat,a.lng],{
            icon: iconoAviso(a.estado),
            draggable: rolActual === "municipal"
        }).addTo(layerEventos);
        enlazarSeleccionProyecto(m, "eventos", a);
        const fotoThumb = a.foto ? '<div class="aviso-thumb"><img src="'+a.foto+'" alt="Foto aviso"></div><button class="btnVerFoto" data-img="'+a.foto+'">Ver detalles</button>' : '';
        const popupHtml = '<div class="aviso-popup"><strong>Aviso: '+(a.tipo || "-")+'</strong><br>'
            + (a.descripcion || "-") + '<br>'
            + 'Estado: ' + (a.estado || "-") + '<br>'
            + (a.region ? ('Region: ' + a.region + '<br>') : '')
            + (a.distrito ? ('Distrito: ' + a.distrito + '<br>') : '')
            + (a.fecha || "-")
            + fotoThumb + '</div>';
        m.bindPopup(popupHtml);

        m.on("contextmenu", function(ev){
            if(ev && ev.originalEvent){
                try{
                    L.DomEvent.stopPropagation(ev.originalEvent);
                    L.DomEvent.preventDefault(ev.originalEvent);
                }catch(e){}
            }
            if(rolActual !== "municipal") return;
            abrirPopupEstadoAviso(a, ev.latlng);
        });

        m.on("dragend", function(e){
            if(rolActual !== "municipal") return;
            const nueva = e.target.getLatLng();
            a.lat = nueva.lat;
            a.lng = nueva.lng;
            if(typeof updateReportes === "function"){ updateReportes(); }
            if(window.UrbbisApi && typeof window.UrbbisApi.updateReport === "function" && a.dbId){
                window.UrbbisApi.updateReport(a.dbId, { lat: a.lat, lng: a.lng })
                    .catch((err)=> console.warn("No se pudo actualizar el aviso en backend.", err));
            }
        });
    });
}

function agregarAviso(aviso){
    avisos.push(aviso);
    renderAvisos();
    if(typeof updateReportes === "function"){ updateReportes(); }
    if(window.UrbbisApi && typeof window.UrbbisApi.createReport === "function"){
        const legacyId = Number.isFinite(Number(aviso.id)) ? Number(aviso.id) : undefined;
        const payload = {
            legacyId,
            type: aviso.tipo || "otro",
            description: aviso.descripcion || "",
            status: aviso.estado || "pendiente",
            lat: aviso.lat,
            lng: aviso.lng,
            district: aviso.distrito || "",
            region: aviso.region || "",
            userName: aviso.usuarioNombre || "",
            userEmail: aviso.usuarioEmail || "",
            userDni: aviso.usuarioDni || "",
            photoUrl: aviso.foto || null
        };
        window.UrbbisApi.createReport(payload)
            .then((remote)=>{
                if(!remote) return;
                aviso.dbId = remote.id;
                if(Number.isFinite(Number(remote.legacyId))) aviso.id = Number(remote.legacyId);
            })
            .catch((err)=> console.warn("No se pudo guardar el aviso en backend.", err));
    }
}


