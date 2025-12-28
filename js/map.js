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
    vertical: [
        { id: "stop", label: "PARE", src: "src/vertical/senal-de-stop.png" },
        { id: "velocidad", label: "Velocidad 80", src: "src/vertical/limite-de-velocidad-80.png" },
        { id: "bus", label: "Parada bus", src: "src/vertical/estacion-de-autobuses.png" },
        { id: "moto", label: "Moto", src: "src/vertical/moto.png" }
    ]
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
let marcadores = [];
let distritoLayer = null;
let avisosMarkers = [];
let pickingReporte = false;
let puntoReporte = null;
let marcadorReporte = null;
let reabrirModalReporte = false;

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

function renderizarSenales(lista) {
    marcadores.forEach(function(m){ map.removeLayer(m); });
    marcadores = [];

    lista.forEach(function(s){
        const icono = s.icono || iconoDefault();
        const iconInfo = iconoPorId(icono, modoActual);
        if(s.zona && (!s.region || s.region === "Sin region")){
            const reg = regionPorDistrito(s.zona);
            if(reg) s.region = reg;
        }

        function buildPopup(){
            const distrito = (s.zona && s.zona !== "Sin zona" && s.zona !== "Sin distrito") ? s.zona : "-";
            const region = regionPorDistrito(distrito) || (s.region && s.region !== "Sin region" ? s.region : "-");
            const precio = (typeof s.precio === "number" && isFinite(s.precio) && s.precio > 0)
                ? ("S/ " + Math.round(s.precio).toLocaleString("es-PE"))
                : "-";
            return ''
                + '<strong>' + s.tipo + '</strong><br>'
                + 'Distrito: ' + distrito + '<br>'
                + 'Region: ' + region + '<br>'
                + 'Estado: ' + s.estado + '<br>'
                + 'Icono: ' + (iconInfo ? iconInfo.label : icono) + '<br>'
                + 'Precio: ' + precio;
        }
        const marker = L.marker([s.lat, s.lng], {
            draggable: rolActual === "municipal",
            icon: crearIcono(s.estado, icono, modoActual)
        }).addTo(map);

        marker.bindPopup(buildPopup());
        marker.on("popupopen", async function(){
            const needsDistrito = !s.zona || s.zona === "Sin zona" || s.zona === "Sin distrito";
            const needsRegion = !s.region || s.region === "Sin region" || !regionPorDistrito(s.zona || "");
            if(s.__geoResolving) return;
            if(!needsDistrito && !needsRegion) return;
            s.__geoResolving = true;
            if(needsDistrito){
                const d = await inferirDistritoPorLatLng(s.lat, s.lng);
                if(d) s.zona = d;
            }
            const reg = regionPorDistrito(s.zona || "");
            if(reg) s.region = reg;
            marker.setPopupContent(buildPopup());
            if(typeof updateReportes === "function"){ updateReportes(); }
            s.__geoResolving = false;
        });

        marker.on("dragend", function (e) {
            const nueva = e.target.getLatLng();
            s.lat = nueva.lat;
            s.lng = nueva.lng;
            console.log('Senal ' + s.id + ' movida a:', nueva);
            alert('Se movio la senal ' + s.id + ' a nueva ubicacion.');
        });

        marcadores.push(marker);
    });
}

asegurarPreciosSenales();
renderizarSenales(senales);
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

function crearSenal(lat, lng, estado, icono, fecha, precio){
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

    datasetActual.push(nueva);
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
    renderizarSenales(senales);
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
    avisosMarkers.forEach(function(m){ map.removeLayer(m); });
    avisosMarkers = [];
    avisos.forEach(function(a){
        const m = L.marker([a.lat,a.lng],{icon: iconoAviso(a.estado)}).addTo(map);
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

        avisosMarkers.push(m);
    });
}

function agregarAviso(aviso){
    avisos.push(aviso);
    renderAvisos();
    if(typeof updateReportes === "function"){ updateReportes(); }
}
