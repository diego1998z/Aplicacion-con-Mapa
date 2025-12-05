// Filtros aplicados
let filtroRegion = "";
let filtroDistrito = "";
let filtroEstado = "";
let filtroTexto = "";

// Selecciones pendientes (solo region/distrito requieren confirmacion)
let selRegion = "";
let selDistrito = "";

function aplicarFiltros(){
    let base = senales;
    if(filtroEstado){
        base = base.filter(s=>s.estado===filtroEstado);
    }
    if(filtroTexto){
        const t = filtroTexto.toLowerCase();
        base = base.filter(s=>s.tipo.toLowerCase().includes(t) || s.zona.toLowerCase().includes(t));
    }
    renderizarSenales(base);
    if(typeof updateReportes === "function"){ updateReportes(); }
}

document.getElementById("inputBuscar").addEventListener("input",e=>{
    filtroTexto = e.target.value.trim();
    aplicarFiltros();
});

selectRegion.addEventListener("change",function(){
    selRegion = this.value;
    selDistrito = "";
    cargarDistritos(selRegion);
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
});

selectDistrito.addEventListener("change",function(){
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
    filtroEstado=""; filtroTexto=""; filtroRegion=""; filtroDistrito="";
    selRegion=""; selDistrito="";
    selectRegion.value=""; cargarDistritos(""); selectDistrito.disabled=true;
    document.getElementById("inputBuscar").value="";
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
    aplicarFiltros(); // muestra todo
  });

// Confirmar selección de filtros
document.getElementById("btnAplicarFiltros").addEventListener("click",()=>{
    filtroRegion = selRegion;
    filtroDistrito = selDistrito;
    aplicarFiltros();
    if(filtroDistrito){
        zoomADistrito(filtroDistrito);
    } else if(filtroRegion){
        // si solo hay region, hacer zoom ligero a Lima
        zoomADistrito(filtroRegion);
    }
});
