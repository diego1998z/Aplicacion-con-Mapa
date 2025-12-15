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
    const q = document.getElementById("filtroAvisoTexto");
    const selTipo = document.getElementById("filtroAvisoTipo");
    const selEstado = document.getElementById("filtroAvisoEstado");
    const inDesde = document.getElementById("filtroAvisoDesde");
    const inHasta = document.getElementById("filtroAvisoHasta");
    const selOrden = document.getElementById("filtroAvisoOrden");

    let data = Array.isArray(avisos) ? avisos.slice() : [];

    // Filtrar por region/distrito seleccionado en filtros principales
    if(typeof filtroRegion !== "undefined" && filtroRegion){
        data = data.filter(a => a.region === filtroRegion);
    }
    if(typeof filtroDistrito !== "undefined" && filtroDistrito){
        data = data.filter(a => a.distrito === filtroDistrito);
    }

    // Filtros propios del reporte
    const texto = q ? (q.value || "").trim().toLowerCase() : "";
    const tipo = selTipo ? selTipo.value : "";
    const estado = selEstado ? selEstado.value : "";
    const desde = inDesde && inDesde.value ? inDesde.value : "";
    const hasta = inHasta && inHasta.value ? inHasta.value : "";

    if(texto){
        data = data.filter(a=>{
            const hay = (a.tipo || "") + " " + (a.descripcion || "") + " " + (a.region || "") + " " + (a.distrito || "");
            return hay.toLowerCase().includes(texto);
        });
    }
    if(tipo){
        data = data.filter(a => a.tipo === tipo);
    }
    if(estado){
        data = data.filter(a => a.estado === estado);
    }
    if(desde){
        data = data.filter(a => (a.fecha || "") >= desde);
    }
    if(hasta){
        data = data.filter(a => (a.fecha || "") <= hasta);
    }

    // Orden por antiguedad
    const orden = selOrden ? selOrden.value : "antiguos";
    data.sort((a,b)=>{
        const fa = a.fecha || "";
        const fb = b.fecha || "";
        if(orden === "recientes") return fb.localeCompare(fa);
        return fa.localeCompare(fb);
    });

    if(!data.length){
        tbody.innerHTML = '<tr><td colspan="8" class="empty">Sin avisos</td></tr>';
        return;
    }
    const rows = data.map(function(a){
        const linkImg = a.foto ? '<a href="#" class="btnVerFoto aviso-img-link" data-img="'+a.foto+'">Ver</a>' : '-';
        return ''
        + '<tr>'
        +   '<td>' + (a.id || "-") + '</td>'
        +   '<td>' + (a.region || "-") + '</td>'
        +   '<td>' + (a.distrito || "-") + '</td>'
        +   '<td>' + (a.tipo || "-") + '</td>'
        +   '<td>' + (a.descripcion || "-") + '</td>'
        +   '<td>' + (a.estado || "-") + '</td>'
        +   '<td>' + (a.fecha || "-") + '</td>'
        +   '<td>' + linkImg + '</td>'
        + '</tr>';
    }).join("");
    tbody.innerHTML = rows;
}

function bindFiltrosAvisos(){
    const ids = ["filtroAvisoTexto","filtroAvisoTipo","filtroAvisoEstado","filtroAvisoDesde","filtroAvisoHasta","filtroAvisoOrden"];
    ids.forEach(id=>{
        const el = document.getElementById(id);
        if(!el) return;
        el.addEventListener("input", renderTablaAvisos);
        el.addEventListener("change", renderTablaAvisos);
    });
    const btnLimpiar = document.getElementById("btnLimpiarFiltrosAvisos");
    if(btnLimpiar){
        btnLimpiar.addEventListener("click", ()=>{
            ids.forEach(id=>{
                const el = document.getElementById(id);
                if(!el) return;
                if(el.tagName === "SELECT") el.value = "";
                else el.value = "";
            });
            const orden = document.getElementById("filtroAvisoOrden");
            if(orden) orden.value = "antiguos";
            renderTablaAvisos();
        });
    }
}

bindFiltrosAvisos();
