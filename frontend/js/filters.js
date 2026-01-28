// Filtros aplicados
let filtroRegion = "";
let filtroDistrito = "";
let filtroEstado = "";
let filtroTexto = "";

// Selecciones pendientes (solo region/distrito requieren confirmacion)
let selRegion = "";
let selDistrito = "";

// Alcance fijo (por usuario municipal). Si est  seteado, region/distrito quedan bloqueados.
let scopeRegion = "";
let scopeDistrito = "";

function setScopeGeografico(region, distrito){
    scopeRegion = region || "";
    scopeDistrito = distrito || "";

    // Forzar valores si hay alcance
    if(scopeRegion || scopeDistrito){
        selRegion = scopeRegion;
        selDistrito = scopeDistrito;
        filtroRegion = scopeRegion;
        filtroDistrito = scopeDistrito;

        try{
            if(selectRegion) selectRegion.value = scopeRegion;
            if(typeof cargarDistritos === "function") cargarDistritos(scopeRegion);
            if(selectDistrito) selectDistrito.value = scopeDistrito;
        }catch(e){}

        try{
            if(selectRegion) selectRegion.disabled = true;
            if(selectDistrito) selectDistrito.disabled = true;
            const btnAplicar = document.getElementById("btnAplicarFiltros");
            if(btnAplicar) btnAplicar.disabled = true;
        }catch(e){}

        aplicarFiltros();
        try{ if(scopeDistrito && typeof zoomADistrito === "function") zoomADistrito(scopeDistrito); }catch(e){}
        return;
    }

    // Sin alcance: desbloquear
    try{
        if(selectRegion) selectRegion.disabled = false;
        if(selectDistrito) selectDistrito.disabled = !selRegion;
        const btnAplicar = document.getElementById("btnAplicarFiltros");
        if(btnAplicar) btnAplicar.disabled = false;
    }catch(e){}
}

function aplicarFiltros(){
    if(typeof renderizarTodo === "function"){
        renderizarTodo();
    } else {
        let base = senales;
        if(filtroEstado){
            base = base.filter(s=>s.estado===filtroEstado);
        }
        if(filtroTexto){
            const t = filtroTexto.toLowerCase();
            base = base.filter(s=>s.tipo.toLowerCase().includes(t) || s.zona.toLowerCase().includes(t));
        }
        renderizarSenales(base);
    }
    if(typeof updateReportes === "function"){ updateReportes(); }
}

document.getElementById("inputBuscar").addEventListener("input",e=>{
    // Solo autocompletado de lugares; no afecta filtrado de señales
});

selectRegion.addEventListener("change",function(){
    if(scopeRegion || scopeDistrito){
        // Bloqueado por alcance de usuario
        this.value = scopeRegion || "";
        return;
    }
    selRegion = this.value;
    selDistrito = "";
    cargarDistritos(selRegion);
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
});

selectDistrito.addEventListener("change",function(){
    if(scopeDistrito){
        this.value = scopeDistrito;
        return;
    }
    selDistrito = this.value;
});

document.querySelectorAll(".btnFiltro").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    filtroEstado = btn.dataset.estado;
    aplicarFiltros();
  });
});

document
  .getElementById("btnMostrarTodas")
  .addEventListener("click", () => {
    filtroEstado=""; filtroTexto="";

    if(scopeRegion || scopeDistrito){
        filtroRegion = scopeRegion;
        filtroDistrito = scopeDistrito;
        selRegion = scopeRegion;
        selDistrito = scopeDistrito;
        try{
            if(selectRegion) selectRegion.value = scopeRegion || "";
            if(typeof cargarDistritos === "function") cargarDistritos(scopeRegion || "");
            if(selectDistrito) selectDistrito.value = scopeDistrito || "";
        }catch(e){}
    } else {
        filtroRegion=""; filtroDistrito="";
        selRegion=""; selDistrito="";
        selectRegion.value=""; cargarDistritos(""); selectDistrito.disabled=true;
    }

    document.getElementById("inputBuscar").value="";
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
    aplicarFiltros(); // muestra todo
    try{
        if(scopeDistrito && typeof zoomADistrito === "function") zoomADistrito(scopeDistrito);
    }catch(e){}
  });

// Confirmar selección de filtros
document.getElementById("btnAplicarFiltros").addEventListener("click",()=>{
    if(scopeRegion || scopeDistrito){
        // bloqueado: mantener scope
        filtroRegion = scopeRegion;
        filtroDistrito = scopeDistrito;
    } else {
        filtroRegion = selRegion;
        filtroDistrito = selDistrito;
    }
    aplicarFiltros();
    if(filtroDistrito){
        zoomADistrito(filtroDistrito);
    } else if(filtroRegion){
        // si solo hay region, hacer zoom ligero a Lima
        zoomADistrito(filtroRegion);
    }
});
