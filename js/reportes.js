// Construye las tablas de reportes para horizontal y vertical con base en filtros de region/distrito
function filtrarRegionDistrito(dataset, regionOverride, distritoOverride){
    const region = typeof regionOverride !== "undefined" ? regionOverride : (typeof filtroRegion !== "undefined" ? filtroRegion : "");
    const distrito = typeof distritoOverride !== "undefined" ? distritoOverride : (typeof filtroDistrito !== "undefined" ? filtroDistrito : "");

    let base = dataset || [];
    if(region){
        base = base.filter(function(s){ return s.region === region; });
    }
    if(distrito){
        base = base.filter(function(s){ return s.zona === distrito; });
    }
    return base;
}

function renderTabla(idTabla, data){
    const tbody = document.querySelector(idTabla + " tbody");
    if(!tbody) return;
    if(!data.length){
        tbody.innerHTML = '<tr><td colspan="4" class="empty">Sin datos para esta seleccion</td></tr>';
        return;
    }
    const rows = data.map(function(s){
        return ''
        + '<tr>'
        +   '<td>' + s.tipo + '</td>'
        +   '<td>' + (s.nombre || "-") + '</td>'
        +   '<td>' + s.estado + '</td>'
        +   '<td>' + (s.fecha_colocacion || "-") + '</td>'
        + '</tr>';
    }).join("");
    tbody.innerHTML = rows;
}

function updateReportes(){
    const horiz = filtrarRegionDistrito(senalesHorizontal, filtroRegion, filtroDistrito);
    const vert = filtrarRegionDistrito(senalesVertical, filtroRegion, filtroDistrito);
    renderTabla("#tablaHorizontal", horiz);
    renderTabla("#tablaVertical", vert);
    renderTablaAvisos();
}

// Inicial
updateReportes();

// Toggle de visibilidad de reportes
const reportesSection = document.getElementById("reportes");
const btnToggleReportes = document.getElementById("btnToggleReportes");
if(btnToggleReportes && reportesSection){
    btnToggleReportes.addEventListener("click", ()=>{
        if(typeof updateReportes === "function"){ updateReportes(); }
        const willShow = reportesSection.classList.contains("hidden");
        if(willShow){
            reportesSection.classList.remove("hidden");
            reportesSection.classList.remove("mobile-visible");
            const sheet = reportesSection.querySelector(".reportes-sheet");
            if(sheet){ sheet.style.transform = ""; }
            btnToggleReportes.textContent = "Ocultar reportes";
            const header = document.querySelector(".topbar");
            const headerH = header ? header.getBoundingClientRect().height : 0;
            const top = reportesSection.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
            window.scrollTo({top: Math.max(0, top), behavior:"smooth"});
        } else {
            reportesSection.classList.add("hidden");
            btnToggleReportes.textContent = "Ver reportes";
        }
    });
}

function renderTablaAvisos(){
    const tbody = document.querySelector("#tablaAvisos tbody");
    if(!tbody) return;
    const data = avisos;
    if(!data.length){
        tbody.innerHTML = '<tr><td colspan="4" class="empty">Sin avisos</td></tr>';
        return;
    }
    const rows = data.map(function(a){
        return ''
        + '<tr>'
        +   '<td>' + a.tipo + '</td>'
        +   '<td>' + (a.descripcion || "-") + '</td>'
        +   '<td>' + a.estado + '</td>'
        +   '<td>' + (a.fecha || "-") + '</td>'
        + '</tr>';
    }).join("");
    tbody.innerHTML = rows;
}
