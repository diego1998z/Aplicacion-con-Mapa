const map = L.map("map").setView([-12.0464, -77.0428], 13);

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

let rolActual = "municipal"; // municipal o visitante
let marcadores = [];
let distritoLayer = null;
let avisosMarkers = [];
let pickingReporte = false;
let puntoReporte = null;
let marcadorReporte = null;
let reabrirModalReporte = false;

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
        const marker = L.marker([s.lat, s.lng], {
            draggable: rolActual === "municipal",
            icon: crearIcono(s.estado, icono, modoActual)
        }).addTo(map);

        const popupHtml = ''
            + '<strong>' + s.tipo + '</strong><br>'
            + 'Zona: ' + s.zona + '<br>'
            + 'Region: ' + (s.region || '') + '<br>'
            + 'Estado: ' + s.estado + '<br>'
            + 'Icono: ' + (iconInfo ? iconInfo.label : icono);

        marker.bindPopup(popupHtml);

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

    const fechaRow = popupEl.querySelector(".fecha-row");
    const inputFecha = popupEl.querySelector("#inputFechaEstado");
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
    }

    function evaluarBoton(){
        const listo = estadoSel && iconSel && (estadoSel === "sin_senal" || fechaSel);
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
        });
    });

    // Fecha
    if(inputFecha){
        inputFecha.addEventListener("change", function(){
            fechaSel = inputFecha.value;
            evaluarBoton();
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
            evaluarBoton();
        });
    });
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
        crearSenal(lat, lng, estadoSel, iconSel, fechaSel);
        map.closePopup();
    });
}

map.on("contextmenu", function(e){
    if(rolActual !== "municipal") return;
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    L.popup()
        .setLatLng([lat, lng])
        .setContent(templateCrearPopup(lat, lng))
        .openOn(map);

    // dar tiempo a que el popup se inyecte
    setTimeout(function(){ enlazarPopupCrear(lat, lng); }, 0);
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

function crearSenal(lat, lng, estado, icono, fecha){
    const datasetActual = modoActual === "horizontal" ? senalesHorizontal : senalesVertical;
    senales = datasetActual; // referencia activa
    const nextId = datasetActual.reduce(function(max, s){ return Math.max(max, s.id); },0) + 1;

    // Capturar region/distrito actuales para que los filtros no oculten la nueva señal
    const regionSel = (typeof selectRegion !== "undefined" && selectRegion) ? selectRegion.value : "";
    const distritoSel = (typeof selectDistrito !== "undefined" && selectDistrito) ? selectDistrito.value : "";

    const nueva = {
        id: nextId,
        tipo: "SENAL",
        estado: estado,
        zona: distritoSel || "Sin zona",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        icono: icono || iconoDefault(),
        region: regionSel || "Sin region",
        nombre: "Nueva senal",
        fecha_colocacion: estado === "sin_senal" ? "" : (fecha || new Date().toISOString().slice(0,10))
    };

    datasetActual.push(nueva);
    renderizarSenales(datasetActual);
    if(typeof updateReportes === "function"){ updateReportes(); }
}

async function zoomADistrito(nombre){
    try{
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
                map.flyToBounds(bounds, {padding:[pad,pad], duration:1.6, easeLinearity:0.2, maxZoom:16});
            } else {
                map.flyTo([lat, lon], 14, {duration:1.2, easeLinearity:0.25});
            }
        }
    }catch(err){
        console.warn("No se pudo ubicar el distrito:", err);
    }
}

function setRol(nuevo){
    rolActual = nuevo;
    renderizarSenales(senales);
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
function renderAvisos(){
    avisosMarkers.forEach(function(m){ map.removeLayer(m); });
    avisosMarkers = [];
    avisos.forEach(function(a){
        const icon = L.divIcon({
            className:"estado-marker",
            html:'<div class="marker-bubble" style="border-color:#f7a800;background:#fff;"><div class="marker-img" style="background-image:url(\'\');width:14px;height:14px;border-radius:50%;background:#f7a800;"></div></div>',
            iconSize:[32,32],
            iconAnchor:[16,28],
            popupAnchor:[0,-20]
        });
        const m = L.marker([a.lat,a.lng],{icon}).addTo(map);
        const fotoThumb = a.foto ? '<div class="aviso-thumb"><img src="'+a.foto+'" alt="Foto aviso"></div><button class="btnVerFoto" data-img="'+a.foto+'">Ver detalles</button>' : '';
        const popupHtml = '<div class="aviso-popup"><strong>Aviso: '+a.tipo+'</strong><br>'+a.descripcion+'<br>'+a.fecha+fotoThumb+'</div>';
        m.bindPopup(popupHtml);
        avisosMarkers.push(m);
    });
}

function agregarAviso(aviso){
    avisos.push(aviso);
    renderAvisos();
    if(typeof updateReportes === "function"){ updateReportes(); }
}
