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

const map = L.map("map").setView([-12.0464, -77.0428], _zoomInicial);

// Base limpia sin iconos; solo vias
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap, &copy; CARTO'
}).addTo(map);

// Capa de etiquetas (calles y lugares), sin iconos interactivos
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    pane: 'labels'
}).addTo(map);

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
    const map = { nueva:"Nueva", antigua:"Antigua", sin_senal:"Sin senal" };
    return map[estado] || (estado || "-");
}

// Se¤ales de tr nsito (vertical) por categoria
const VERTICAL_FILES_PREVENTIVA = [
    "P-10A.png",
    "P-10B.png",
    "P-11.png",
    "P-12.png",
    "P-13A.png",
    "P-13B.png",
    "P-14A.png",
    "P-14B.png",
    "P-15.png",
    "P-16A.png",
    "P-16B.png",
    "P-17.png",
    "P-18.png",
    "P-19.png",
    "P-1A.png",
    "P-1B.png",
    "P-20.png",
    "P-21.png",
    "P-22.png",
    "P-23.png",
    "P-24.png",
    "P-25.png",
    "P-26.png",
    "P-27.png",
    "P-28.png",
    "P-29.png",
    "P-2A.png",
    "P-2B.png",
    "P-30.png",
    "P-31.png",
    "P-32.png",
    "P-33.png",
    "P-34.png",
    "P-35.png",
    "P-36.png",
    "P-37.png",
    "P-38.png",
    "P-39.png",
    "P-3A.png",
    "P-3B.png",
    "P-40.png",
    "P-41.png",
    "P-42.png",
    "P-43.png",
    "P-44.png",
    "P-45.png",
    "P-46.png",
    "P-47.png",
    "P-48.png",
    "P-49.png",
    "P-4A.png",
    "P-4B.png",
    "P-5-1.png",
    "P-5-2A.png",
    "P-5-2B.png",
    "P-50.png",
    "P-51.png",
    "P-52.png",
    "P-53.png",
    "P-54.png",
    "P-55.png",
    "P-56.png",
    "P-57.png",
    "P-58.png",
    "P-59.png",
    "P-6.png",
    "P-60.png",
    "P-61.png",
    "P-62-Peso-bruto-m\u00e1ximo-permitido.png",
    "P-66-R\u00e1fagas-de-viento-lateral.png",
    "P-66A-Zona-de-arenamiento-en-la-v\u00eda.png",
    "P-7.png",
    "P-8.png",
    "P-9A.png",
    "P-9B.png"
];

const VERTICAL_FILES_REGLAMENTARIA = [
    "R-1.png",
    "R-10.png",
    "R-11.png",
    "R-12.png",
    "R-13.png",
    "R-14A.png",
    "R-14B.png",
    "R-15.png",
    "R-16.png",
    "R-17.png",
    "R-18-1.png",
    "R-18-2.png",
    "R-18.png",
    "R-19.png",
    "R-2.png",
    "R-20.png",
    "R-21.png",
    "R-22.png",
    "R-23.png",
    "R-24.png",
    "R-25.png",
    "R-26.png",
    "R-27.png",
    "R-27A.png",
    "R-28.png",
    "R-29.png",
    "R-3.png",
    "R-30-1.png",
    "R-30-2.png",
    "R-30-3.png",
    "R-30-4.png",
    "R-30.png",
    "R-31.png",
    "R-32.png",
    "R-33.png",
    "R-34.png",
    "R-35.png",
    "R-36.png",
    "R-37.png",
    "R-38.png",
    "R-39.png",
    "R-4.png",
    "R-40.png",
    "R-41.png",
    "R-42.png",
    "R-44.png",
    "R-45.png",
    "R-46.png",
    "R-5-1.png",
    "R-5-2.png",
    "R-5-3.png",
    "R-5-4.png",
    "R-5.png",
    "R-6.png",
    "R-7.png",
    "R-8.png",
    "R-9.png"
];

const VERTICAL_FILES_INFORMATIVA = [
    "I-1A-Escudo-indicador-de-carretera-del-sistema.png",
    "I-1B-S\u00edmbolo-que-identifica-la-red-vial.png",
    "I-20-llanteria.png",
    "I-21-personas-con-movilidad-reducida.png",
    "I-22-Servicio-de-informacion.png",
    "I-23-Servicios-higienicos.png",
    "I-24-Transporte-ferroviario.png",
    "I-25-transporte-masivo-de-conductores.png",
    "I-26-zona-recreativa.png",
    "I-27-Tsunami-ruta-de-evacuacion.png",
    "I-28-Zona-de-riesgo-por-Tsunami.png",
    "I-29-Punto-de-encuentro-por-Tsunami.png",
    "I-31-Estacionamiento-para-emergencias.png",
    "i-10-Iglesia.png",
    "i-11-Aeropuerto.png",
    "i-12-Hospedaje.png",
    "i-13-primeros-auxilios.png",
    "i-14-hospital.png",
    "i-15-servicios-sanitarios.png",
    "i-16-restaurante.png",
    "i-17-telefono.png",
    "i-18-servicio-mecanico.png",
    "i-19-grifo.png",
    "i-32-Extintor-contra-incendios.png",
    "i-33-Hidrante-y-manguera-contra-incendios.png",
    "i-34-Salida-de-emergencia.png",
    "i-35-Ruta-de-emergencia.png",
    "i-36-estacionamiento-de-casa-rodante.png",
    "i-37-se\u00f1al-de-prese\u00f1alizacion.png",
    "i-38-se\u00f1al-de-prese\u00f1alizacion.png",
    "i-5-Sitio-de-parqueo.png",
    "i-6-Paradero-de-buses.png",
    "i-7-Estacionamiento_de_taxis.png",
    "i-8-via-para-ciclistas.png",
    "i-9-Zona-militar.png",
    "informativas-con-salida.png",
    "informativas.png",
    "t-1-Zona-de-camping.png",
    "t-2-Museo.png",
    "t-3-Muelle.png",
    "t-4-Servicio-de-informaci\u00f3n-tur\u00edstica.png"
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

function buildIconosVertical(){
    const out = [];
    const groups = [
        { categoria: "preventiva", folder: "Preventiva", files: VERTICAL_FILES_PREVENTIVA },
        { categoria: "reglamentaria", folder: "Reglamentaria", files: VERTICAL_FILES_REGLAMENTARIA },
        { categoria: "informativa", folder: "Informativa", files: VERTICAL_FILES_INFORMATIVA }
    ];
    groups.forEach(function(g){
        (g.files || []).forEach(function(file){
            const base = String(file || "").replace(/\.png$/i,"");
            out.push({
                id: base,
                label: labelDesdeArchivoIcono(base),
                categoria: g.categoria,
                src: "src/vertical/" + g.folder + "/" + encodeURIComponent(file)
            });
        });
    });
    return out;
}

const ICONOS = {
    horizontal: [
        { id: "pista", label: "Pista", src: "src/horizontal/pista.png" },
        { id: "paso", label: "Paso peatonal", src: "src/horizontal/invalidez.png" },
        { id: "acceso", label: "Acceso", src: "src/horizontal/images.png" },
        { id: "ceda", label: "Ceda el paso", src: "src/horizontal/sedaelpaso.png" },
        { id: "banda_transversal", label: "Banda transversal", src: "src/horizontal/ico_banda_transversal.png" },
        { id: "crucero", label: "Crucero", src: "src/horizontal/ico_crucero.png" },
        { id: "enrejado", label: "Enrejado amarillo", src: "src/horizontal/ico_enrrejado_amarillo.png" },
        { id: "flecha_arriba", label: "Flecha recto", src: "src/horizontal/ico_flecha_arriba.png" },
        { id: "flecha_arriba_der", label: "Recto y derecha", src: "src/horizontal/ico_flecha_arriba_giro_derecha.png" },
        { id: "flecha_arriba_izq", label: "Recto y izquierda", src: "src/horizontal/ico_flecha_arriba_giro_izquierda.png" },
        { id: "flecha_der", label: "Flecha giro der", src: "src/horizontal/ico_flecha_giro_der.png" },
        { id: "flecha_izq", label: "Flecha giro izq", src: "src/horizontal/ico_flecha_giro_izq.png" },
        { id: "isla", label: "Isla", src: "src/horizontal/ico_isla.png" },
        { id: "isla_amarilla", label: "Isla amarilla", src: "src/horizontal/ico_isla_amarilla.png" },
        { id: "linea_continua", label: "Linea continua", src: "src/horizontal/ico_linea_continua.png" },
        { id: "linea_continua_amarilla", label: "Linea continua amarilla", src: "src/horizontal/ico_linea_continua_Amarillo.png" },
        { id: "linea_continua_relieve", label: "Linea continua relieve", src: "src/horizontal/ico_linea_continua_relieve.png" },
        { id: "linea_discontinua", label: "Linea discontinua", src: "src/horizontal/ico_linea_discontinua.png" },
        { id: "linea_discontinua_amarilla", label: "Linea discontinua amarilla", src: "src/horizontal/ico_linea_discontinua_amarillo.png" },
        { id: "linea_pare", label: "Linea PARE", src: "src/horizontal/ico_linea_pare.png" },
        { id: "pare", label: "PARE horizontal", src: "src/horizontal/ico_pare.png" },
        { id: "peatones", label: "Peatones", src: "src/horizontal/ico_peatones.png" },
        { id: "vel_30", label: "Velocidad 30", src: "src/horizontal/ico_vel_30.png" },
        { id: "vel_35", label: "Velocidad 35", src: "src/horizontal/ico_vel_35.png" },
        { id: "vel_40", label: "Velocidad 40", src: "src/horizontal/ico_vel_40.png" },
        { id: "zona_escolar", label: "Zona escolar", src: "src/horizontal/ico_zona_escolar.png" }
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
                +           '<button type="button" class="estado-option' + (s.estado === "nueva" ? " active" : "") + '" data-estado="nueva">Nueva</button>'
                +           '<button type="button" class="estado-option' + (s.estado === "antigua" ? " active" : "") + '" data-estado="antigua">Antigua</button>'
                +           '<button type="button" class="estado-option' + (s.estado === "sin_senal" ? " active" : "") + '" data-estado="sin_senal">Sin senal</button>'
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
                s.fecha_colocacion = fechaNueva;
                s.icono = iconSel;
                s.precio = precioNuevo;

                try{
                    marker.setIcon(crearIcono(s.estado, s.icono, modo));
                }catch(e){}

                const after = {
                    tipo: s.tipo,
                    estado: s.estado,
                    fecha_colocacion: s.fecha_colocacion || "",
                    precio: s.precio,
                    icono: s.icono
                };

                if(typeof registrarHistorialSenal === "function"){
                    registrarHistorialSenal({ accion:"EDITADA", modo, before, after, senal:s });
                }

                if(typeof updateReportes === "function"){ updateReportes(); }

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
        marker.bindPopup('<strong>Mobiliario vial</strong><br>'
            + 'Distrito: ' + (s.zona || "-") + '<br>'
            + 'Region: ' + (s.region || regionPorDistrito(s.zona || "") || "-") + '<br>'
            + 'Estado: ' + (s.estado || "-"));
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
    +           '<button class="estado-option" data-estado="nueva">Nueva</button>'
    +           '<button class="estado-option" data-estado="antigua">Antigua</button>'
    +           '<button class="estado-option" data-estado="sin_senal">Sin senal</button>'
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
        const m = L.marker([a.lat,a.lng],{icon: iconoAviso(a.estado)}).addTo(layerEventos);
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
    });
}

function agregarAviso(aviso){
    avisos.push(aviso);
    renderAvisos();
    if(typeof updateReportes === "function"){ updateReportes(); }
}
