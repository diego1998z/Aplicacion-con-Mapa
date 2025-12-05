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
    danada: "#d93f3f",
    sin_senal: "#3f7ed9"
};

const ICONOS = {
    horizontal: [
        { id: "pista", label: "Pista", src: "src/horizontal/pista.png" },
        { id: "paso", label: "Paso peatonal", src: "src/horizontal/invalidez.png" },
        { id: "acceso", label: "Acceso", src: "src/horizontal/images.png" },
        { id: "ceda", label: "Ceda el paso", src: "src/horizontal/sedaelpaso.png" }
    ],
    vertical: [
        { id: "stop", label: "PARE", src: "src/vertical/senal-de-stop.png" },
        { id: "velocidad", label: "Velocidad 80", src: "src/vertical/limite-de-velocidad-80.png" },
        { id: "bus", label: "Parada bus", src: "src/vertical/estacion-de-autobuses.png" },
        { id: "moto", label: "Moto", src: "src/vertical/moto.png" }
    ]
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

let marcadores = [];
let distritoLayer = null;

function renderizarSenales(lista) {
    marcadores.forEach(function(m){ map.removeLayer(m); });
    marcadores = [];

    lista.forEach(function(s){
        const icono = s.icono || iconoDefault();
        const iconInfo = iconoPorId(icono, modoActual);
        const marker = L.marker([s.lat, s.lng], {
            draggable: true,
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
    +   '<div class="popup-tabs">'
    +       '<button class="tab-btn active" data-tab="estado">Estado</button>'
    +       '<button class="tab-btn" data-tab="icono">Icono</button>'
    +   '</div>'
    +   '<div class="tab-panel active" data-tab="estado">'
    +       '<div class="estado-grid">'
    +           '<button class="estado-option active" data-estado="nueva">Nueva</button>'
    +           '<button class="estado-option" data-estado="danada">Danada</button>'
    +           '<button class="estado-option" data-estado="sin_senal">Sin senal</button>'
    +       '</div>'
    +   '</div>'
    +   '<div class="tab-panel" data-tab="icono">'
    +       '<div class="icon-grid">' + iconsList + '</div>'
    +   '</div>'
    +   '<button class="btn-crear" data-lat="' + lat + '" data-lng="' + lng + '">Crear senal</button>'
    + '</div>';
}

function enlazarPopupCrear(lat, lng){
    const popupEl = document.querySelector(".popup-crear");
    if(!popupEl) return;

    let estadoSel = "nueva";
    let iconSel = iconoDefault();

    const iconDefaultBtn = popupEl.querySelector('.icon-option[data-icon="' + iconSel + '"]') || popupEl.querySelector(".icon-option");
    if(iconDefaultBtn){
        iconDefaultBtn.classList.add("active");
        iconSel = iconDefaultBtn.getAttribute("data-icon");
    }

    // Tabs
    popupEl.querySelectorAll(".tab-btn").forEach(function(btn){
        btn.addEventListener("click", function(){
            popupEl.querySelectorAll(".tab-btn").forEach(function(b){ b.classList.remove("active"); });
            popupEl.querySelectorAll(".tab-panel").forEach(function(p){ p.classList.remove("active"); });
            btn.classList.add("active");
            popupEl.querySelector('.tab-panel[data-tab="' + btn.getAttribute("data-tab") + '"]').classList.add("active");
        });
    });

    // Estado
    popupEl.querySelectorAll(".estado-option").forEach(function(btn){
        btn.addEventListener("click", function(){
            popupEl.querySelectorAll(".estado-option").forEach(function(b){ b.classList.remove("active"); });
            btn.classList.add("active");
            estadoSel = btn.getAttribute("data-estado");
        });
    });

    // Iconos
    popupEl.querySelectorAll(".icon-option").forEach(function(btn){
        btn.addEventListener("click", function(){
            popupEl.querySelectorAll(".icon-option").forEach(function(b){ b.classList.remove("active"); });
            btn.classList.add("active");
            iconSel = btn.getAttribute("data-icon");
        });
    });

    // Crear
    popupEl.querySelector(".btn-crear").addEventListener("click", function(){
        crearSenal(lat, lng, estadoSel, iconSel);
        map.closePopup();
    });
}

map.on("contextmenu", function(e){
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    L.popup()
        .setLatLng([lat, lng])
        .setContent(templateCrearPopup(lat, lng))
        .openOn(map);

    // dar tiempo a que el popup se inyecte
    setTimeout(function(){ enlazarPopupCrear(lat, lng); }, 0);
});

function crearSenal(lat, lng, estado, icono){
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
        region: regionSel || "Sin region"
    };

    datasetActual.push(nueva);
    renderizarSenales(datasetActual);
}

async function zoomADistrito(nombre){
    try{
        const url = "https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=" + encodeURIComponent(nombre + ", Lima, Peru") + "&limit=1";
        const res = await fetch(url);
        const data = await res.json();
        if(data && data[0]){
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 13);

            if(distritoLayer){
                map.removeLayer(distritoLayer);
                distritoLayer = null;
            }

            if(data[0].geojson){
                distritoLayer = L.geoJSON(data[0].geojson, {
                    style: { color: "#1d70b8", weight: 2, fillOpacity: 0.08 }
                }).addTo(map);
            }
        }
    }catch(err){
        console.warn("No se pudo ubicar el distrito:", err);
    }
}
