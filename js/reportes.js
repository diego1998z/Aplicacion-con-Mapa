// Construye las tablas de reportes para horizontal y vertical con base en filtros de region/distrito
function filtrarRegionDistrito(dataset){
    let base = dataset;
    if(filtroRegion){
        base = base.filter(function(s){ return s.region === filtroRegion; });
    }
    if(filtroDistrito){
        base = base.filter(function(s){ return s.zona === filtroDistrito; });
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
    const horiz = filtrarRegionDistrito(senalesHorizontal);
    const vert = filtrarRegionDistrito(senalesVertical);
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
        const visible = reportesSection.classList.toggle("hidden");
        btnToggleReportes.textContent = visible ? "Ver reportes" : "Ocultar reportes";
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
