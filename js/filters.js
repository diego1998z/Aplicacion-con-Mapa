let filtroRegion = "";
let filtroDistrito = "";
let filtroEstado = "";
let filtroTexto = "";

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
}

document.getElementById("inputBuscar").addEventListener("input",e=>{
    filtroTexto = e.target.value.trim();
    aplicarFiltros();
});

selectRegion.addEventListener("change",function(){
    filtroRegion = this.value;
    filtroDistrito = "";
    cargarDistritos(filtroRegion);
    // Al cambiar region, limpiar estado
    filtroEstado = "";
    document.querySelectorAll(".btnFiltro").forEach(b=>b.classList.remove("active"));
    aplicarFiltros();
});

selectDistrito.addEventListener("change",function(){
    filtroDistrito = this.value;
    aplicarFiltros();
    if(filtroDistrito){
        zoomADistrito(filtroDistrito);
    }
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
    selectRegion.value=""; cargarDistritos(""); selectDistrito.disabled=true;
    document.getElementById("inputBuscar").value="";
    aplicarFiltros();
  });
