const selectRegion=document.getElementById('selectRegion');
const selectDistrito=document.getElementById('selectDistrito');

function cargarRegiones(){
    const regiones = Object.keys(MAPA_REGIONES);
    selectRegion.innerHTML='<option value="">Todas</option>'+regiones.map(r=>`<option value="${r}">${r}</option>`).join('');
    selectRegion.value="";
    selectDistrito.disabled = true;
}

function cargarDistritos(region){
    const distritos = region ? MAPA_REGIONES[region] || [] : [];
    selectDistrito.innerHTML='<option value="">Todos</option>'+distritos.map(d=>`<option value="${d}">${d}</option>`).join('');
    selectDistrito.value="";
    selectDistrito.disabled = !region;
}

cargarRegiones();
cargarDistritos("");

// Tabs de modo (legacy): se mantienen por compatibilidad (topbar oculto)
