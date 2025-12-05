const selectZona=document.getElementById('selectZona');

function cargarZonas(){
    selectZona.innerHTML='<option value="">Todas</option>'+zonas.map(z=>`<option value="${z}">${z}</option>`).join('');
    selectZona.value="";
}
cargarZonas();

// Tabs de modo: horizontal / vertical
document.querySelectorAll(".tab-mode").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".tab-mode").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        modoActual = btn.dataset.mode;
        if(modoActual==="horizontal"){
            senales = senalesHorizontal;
            zonas = zonasHorizontal;
        } else {
            senales = senalesVertical;
            zonas = zonasVertical;
        }
        cargarZonas();
        renderizarSenales(senales);
    });
});
