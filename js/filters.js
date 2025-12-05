
document.getElementById("inputBuscar").addEventListener("input",e=>{
    const t=e.target.value.toLowerCase();
    renderizarSenales(senales.filter(s=>s.tipo.toLowerCase().includes(t)||s.zona.toLowerCase().includes(t)));
});
selectZona.addEventListener("change",function(){
    const z=this.value;
    renderizarSenales(z===""?senales:senales.filter(s=>s.zona===z));
});
