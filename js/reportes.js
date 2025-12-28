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

function codigoRegion(region){
    const map = {
        "Lima Norte": "LN",
        "Lima Sur": "LS",
        "Lima Este": "LE",
        "Lima Oeste": "LO",
        "Lima Centro": "LC"
    };
    return map[region] || "NA";
}

function normalizarLugar(str){
    if(!str) return "";
    return String(str)
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9\s-]/g," ")
        .replace(/\s+/g," ")
        .trim();
}

function generarCodigoDistritoBase(distrito){
    if(!distrito) return "UNK";
    const stop = new Set(["de","del","la","las","los","y","san","santa","santo","maria","martin","juan"]);
    const parts = normalizarLugar(distrito)
        .split(/[\s-]+/g)
        .filter(Boolean);
    const significativas = parts.filter(p=>!stop.has(p));
    const baseParts = significativas.length ? significativas : parts;
    if(baseParts.length === 0) return "UNK";
    if(baseParts.length === 1){
        return baseParts[0].toUpperCase().slice(0,3).padEnd(3,"X");
    }
    const acronym = baseParts.slice(0,4).map(p=>p[0].toUpperCase()).join("");
    return acronym.slice(0,3).padEnd(3,"X");
}

let _cacheDistritoCodes = null;
function construirMapaCodigosDistritos(){
    if(_cacheDistritoCodes) return _cacheDistritoCodes;
    let distritos = [];
    try{
        distritos = Object.values(MAPA_REGIONES || {}).flat();
    }catch(e){
        distritos = [];
    }
    const items = distritos
        .filter(Boolean)
        .map(d => ({ name: d, norm: normalizarLugar(d) }))
        .sort((a,b)=>a.norm.localeCompare(b.norm));

    const used = new Set();
    const result = new Map();

    for(const it of items){
        let code = generarCodigoDistritoBase(it.name);
        if(!used.has(code)){
            used.add(code);
            result.set(it.norm, code);
            continue;
        }
        // Resolver colisiones extendiendo a 4 letras o agregando sufijo numérico
        const raw = normalizarLugar(it.name).replace(/[^a-z0-9]/g,"");
        let alt = (raw.toUpperCase().slice(0,4) || code + "X");
        if(!used.has(alt)){
            used.add(alt);
            result.set(it.norm, alt);
            continue;
        }
        let n = 2;
        while(n < 100){
            const suff = String(n).padStart(2,"0");
            const candidate = code.slice(0,2) + suff; // 4 chars
            if(!used.has(candidate)){
                used.add(candidate);
                result.set(it.norm, candidate);
                break;
            }
            n++;
        }
        if(!result.has(it.norm)){
            result.set(it.norm, alt);
        }
    }
    _cacheDistritoCodes = result;
    return result;
}

function codigoDistrito(distrito){
    if(!distrito) return "UNK";
    const norm = normalizarLugar(distrito);
    const map = construirMapaCodigosDistritos();
    return map.get(norm) || generarCodigoDistritoBase(distrito);
}

function construirIndicePorZona(dataset){
    const idx = new Map();
    (dataset || []).forEach(s=>{
        const key = (s.region || "") + "|" + (s.zona || "");
        if(!idx.has(key)) idx.set(key, []);
        idx.get(key).push(s.id || 0);
    });
    idx.forEach((arr,key)=>{
        arr.sort((a,b)=>a-b);
        idx.set(key, arr);
    });
    return idx;
}

function idFormateado(prefix, s, idxByZone){
    const regCode = codigoRegion(s.region || "");
    const distCode = codigoDistrito(s.zona || "");
    const key = (s.region || "") + "|" + (s.zona || "");
    const arr = idxByZone && idxByZone.get(key) ? idxByZone.get(key) : [];
    const pos = arr.indexOf(s.id || 0);
    const seq = pos >= 0 ? (pos + 1) : (s.id || 0);
    const seqPadded = String(seq || 0).padStart(4,"0");
    return "URB-" + prefix + "-" + regCode + "-" + distCode + "-" + seqPadded;
}

function nombreIconoPorModo(modo, iconId){
    try{
        const list = (typeof ICONOS !== "undefined" && ICONOS && ICONOS[modo]) ? ICONOS[modo] : [];
        const found = (list || []).find(i => i.id === iconId);
        if(found && found.label) return found.label;
    }catch(e){}
    return iconId || "-";
}

function renderTabla(idTabla, data, prefix, idxByZone, modoIconos){
    const tbody = document.querySelector(idTabla + " tbody");
    if(!tbody) return;
    if(!data.length){
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Sin datos para esta seleccion</td></tr>';
        return;
    }
    const rows = data.map(function(s){
        const nombreIcono = nombreIconoPorModo(modoIconos, s.icono);
        return ''
        + '<tr>'
        +   '<td>' + idFormateado(prefix, s, idxByZone) + '</td>'
        +   '<td>' + s.tipo + '</td>'
        +   '<td>' + (nombreIcono || "-") + '</td>'
        +   '<td>' + s.estado + '</td>'
        +   '<td>' + (s.fecha_colocacion || "-") + '</td>'
        + '</tr>';
    }).join("");
    tbody.innerHTML = rows;
}

function updateReportes(){
    const horiz = filtrarRegionDistrito(senalesHorizontal, filtroRegion, filtroDistrito);
    const vert = filtrarRegionDistrito(senalesVertical, filtroRegion, filtroDistrito);
    const idxH = construirIndicePorZona(senalesHorizontal);
    const idxV = construirIndicePorZona(senalesVertical);
    renderTabla("#tablaHorizontal", horiz, "SH", idxH, "horizontal");
    renderTabla("#tablaVertical", vert, "SV", idxV, "vertical");
    renderTablaAvisos();
    renderTablaAvisosTareas();
    if(typeof updateDashboard === "function"){ updateDashboard(); }
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

function renderTablaAvisosTareas(){
    const tbody = document.querySelector("#tablaAvisosTareas tbody");
    if(!tbody) return;
    const q = document.getElementById("filtroAvisoTextoTareas");
    const selEstado = document.getElementById("filtroAvisoEstadoTareas");
    const selOrden = document.getElementById("filtroAvisoOrdenTareas");

    let data = Array.isArray(avisos) ? avisos.slice() : [];

    if(typeof filtroRegion !== "undefined" && filtroRegion){
        data = data.filter(a => a.region === filtroRegion);
    }
    if(typeof filtroDistrito !== "undefined" && filtroDistrito){
        data = data.filter(a => a.distrito === filtroDistrito);
    }

    const texto = q ? (q.value || "").trim().toLowerCase() : "";
    const estado = selEstado ? selEstado.value : "";

    if(texto){
        data = data.filter(a=>{
            const hay = (a.tipo || "") + " " + (a.descripcion || "") + " " + (a.region || "") + " " + (a.distrito || "")
                + " " + (a.usuario || "") + " " + (a.usuarioEmail || "") + " " + (a.usuarioNombre || "") + " " + (a.usuarioDni || "");
            return hay.toLowerCase().includes(texto);
        });
    }
    if(estado){
        data = data.filter(a => a.estado === estado);
    }

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
        const usuario = a.usuario || "-";
        const email = a.usuarioEmail || "-";
        const nombre = a.usuarioNombre || "-";
        const dni = a.usuarioDni || "-";
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
        + '</tr>'
        + '<tr class="aviso-meta-row">'
        +   '<td colspan="8">'
        +     '<div class="aviso-meta">'
        +       '<span><strong>Usuario:</strong> ' + usuario + '</span>'
        +       '<span><strong>Email:</strong> ' + email + '</span>'
        +       '<span><strong>Nombre:</strong> ' + nombre + '</span>'
        +       '<span><strong>DNI:</strong> ' + dni + '</span>'
        +     '</div>'
        +   '</td>'
        + '</tr>';
    }).join("");
    tbody.innerHTML = rows;
}

function bindFiltrosAvisosTareas(){
    const ids = ["filtroAvisoTextoTareas","filtroAvisoEstadoTareas","filtroAvisoOrdenTareas"];
    ids.forEach(id=>{
        const el = document.getElementById(id);
        if(!el) return;
        el.addEventListener("input", renderTablaAvisosTareas);
        el.addEventListener("change", renderTablaAvisosTareas);
    });
    const btnLimpiar = document.getElementById("btnLimpiarFiltrosAvisosTareas");
    if(btnLimpiar){
        btnLimpiar.addEventListener("click", ()=>{
            ids.forEach(id=>{
                const el = document.getElementById(id);
                if(!el) return;
                if(el.tagName === "SELECT") el.value = "";
                else el.value = "";
            });
            const orden = document.getElementById("filtroAvisoOrdenTareas");
            if(orden) orden.value = "antiguos";
            renderTablaAvisosTareas();
        });
    }
}

bindFiltrosAvisosTareas();
