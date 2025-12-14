// Referencias principales
const btnUbicacion = document.getElementById("btnUbicacion");
const btnToggleRol = document.getElementById("btnToggleRol");
const modalReporte = document.getElementById("modalReporte");
const btnReportar = document.getElementById("btnReportar");
const btnCancelarReporte = document.getElementById("btnCancelarReporte");
const btnEnviarReporte = document.getElementById("btnEnviarReporte");
const inputTipoProblema = document.getElementById("inputTipoProblema");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputFoto = document.getElementById("inputFoto");
const infoUbicacion = document.getElementById("infoUbicacion");
const btnElegirMapa = document.getElementById("btnElegirMapa");
const loginOverlay = document.getElementById("loginOverlay");
const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("inputCorreo");
const inputClave = document.getElementById("inputClave");
const btnLogout = document.getElementById("btnLogout");
const btnMenu = document.getElementById("btnMenu");
const sidebar = document.getElementById("sidebar");
const btnFloatingFilters = document.getElementById("btnFloatingFilters");
const btnFloatingReport = document.getElementById("btnFloatingReport");
const mapContainer = document.getElementById("map");
const bboxLima = "-77.2,-11.7,-76.8,-12.3"; // Lima Metropolitana aprox
let overlayFoto = null;

// Banner de rol en mobile
const mobileBanner = document.createElement("div");
mobileBanner.className = "mobile-banner hidden";
(mapContainer || document.body).appendChild(mobileBanner);

function isMobileViewport(){
  return window.innerWidth <= 900;
}

function hideFABs(){
  if(btnFloatingFilters) btnFloatingFilters.classList.add("fab-hidden");
  if(btnFloatingReport) btnFloatingReport.classList.add("fab-hidden");
}

function showFABs(){
  if(btnFloatingFilters){
    btnFloatingFilters.classList.remove("fab-hidden","offset");
  }
  if(btnFloatingReport){
    btnFloatingReport.classList.remove("fab-hidden","offset");
  }
}

function expandSidebar(){
  if(!sidebar) return;
  sidebar.classList.add("expanded");
  sidebar.scrollTop = 0;
  if(btnFloatingFilters) btnFloatingFilters.classList.add("offset");
  if(btnFloatingReport) btnFloatingReport.classList.add("offset");
  if(isMobileViewport()) hideFABs();
}

function collapseSidebar(){
  if(!sidebar) return;
  sidebar.classList.remove("expanded");
  showFABs();
}

function collapseSidebarAfterAction(){
  if(isMobileViewport()){
    collapseSidebar();
  } else {
    showFABs();
  }
}

function updateMobileBanner(){
  if(!mobileBanner) return;
  mobileBanner.textContent = rolActual === "municipal" ? "Vista Municipal" : "Vista Visitante";
  repositionMobileBanner();
  if(isMobileViewport()){
    mobileBanner.classList.remove("hidden");
  } else {
    mobileBanner.classList.add("hidden");
  }
}

updateMobileBanner();
window.addEventListener("resize", ()=>{
  repositionMobileBanner();
  updateMobileBanner();
});

function repositionMobileBanner(){
  if(!mobileBanner) return;
  let offsetTop = 8;
  const header = document.querySelector(".topbar");
  const mobileSearch = document.getElementById("mobileSearch");
  if(header){
    const rect = header.getBoundingClientRect();
    offsetTop = rect.bottom + 8;
  }
  if(mobileSearch && isMobileViewport()){
    const rectSearch = mobileSearch.getBoundingClientRect();
    offsetTop = rectSearch.bottom + 8;
  }
  mobileBanner.style.top = offsetTop + "px";
  mobileBanner.style.right = "12px";
}

// Ubicacion actual
if(btnUbicacion){
  btnUbicacion.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      map.setView([lat, lon], 16);
      L.marker([lat, lon]).addTo(map).bindPopup("Tu ubicacion").openPopup();
    });
  });
}

// Cambiar rol
if(btnToggleRol){
  btnToggleRol.addEventListener("click", ()=>{
    const nuevo = rolActual === "municipal" ? "visitante" : "municipal";
    setRol(nuevo);
    guardarSesionRol(nuevo);
    updateMobileBanner();
  });
  // init
  setRol(rolActual);
  updateMobileBanner();
}

function buildNominatimUrl(texto, limit=5){
  return `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_geojson=0&q=${encodeURIComponent(texto)}&limit=${limit}&countrycodes=pe&viewbox=${bboxLima}&bounded=1`;
}

function normalizarTexto(str){
  if(!str) return "";
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function distritosLocales(){
  try{
    const all = Object.values(MAPA_REGIONES || {}).flat();
    return Array.from(new Set(all));
  }catch(e){
    return [];
  }
}
function abrirModalReporte(){
  if(!modalReporte) return;
  modalReporte.classList.remove("hidden");
  pickingReporte = true;
  puntoReporte = null;
  if(infoUbicacion) infoUbicacion.textContent = "Haz click en el mapa para fijar la ubicacion.";
}
function cerrarModalReporte(){
  if(!modalReporte) return;
  modalReporte.classList.add("hidden");
  pickingReporte = false;
  puntoReporte = null;
  inputDescripcion.value = "";
  inputFoto.value = "";
  if(typeof marcadorReporte !== "undefined" && marcadorReporte){
    map.removeLayer(marcadorReporte);
    marcadorReporte = null;
  }
  reabrirModalReporte = false;
}

if(btnReportar){ btnReportar.addEventListener("click", abrirModalReporte); }
if(btnCancelarReporte){ btnCancelarReporte.addEventListener("click", cerrarModalReporte); }
if(btnElegirMapa){
  btnElegirMapa.addEventListener("click", ()=>{
    reabrirModalReporte = true;
    pickingReporte = true;
    if(modalReporte) modalReporte.classList.add("hidden");
  });
}

// Ver foto completa desde popup de aviso
function crearOverlayFoto(){
  if(overlayFoto) return overlayFoto;
  overlayFoto = document.createElement("div");
  overlayFoto.className = "foto-fullscreen hidden";
  const img = document.createElement("img");
  overlayFoto.appendChild(img);
  overlayFoto.addEventListener("click", ()=> {
    overlayFoto.classList.add("hidden");
    overlayFoto.classList.remove("active");
  });
  document.body.appendChild(overlayFoto);
  return overlayFoto;
}

document.addEventListener("click", (e)=>{
  if(e.target && e.target.classList.contains("btnVerFoto")){
    const src = e.target.getAttribute("data-img");
    if(!src) return;
    const ov = crearOverlayFoto();
    const img = ov.querySelector("img");
    img.src = src;
    ov.classList.remove("hidden");
    setTimeout(()=>ov.classList.add("active"),10);
  }
});

if(btnEnviarReporte){
  btnEnviarReporte.addEventListener("click", ()=>{
    if(!puntoReporte){
      alert("Selecciona un punto en el mapa.");
      return;
    }
    const tipo = inputTipoProblema ? inputTipoProblema.value : "otro";
    const desc = inputDescripcion ? inputDescripcion.value.trim() : "";
    const fecha = new Date().toISOString().slice(0,10);

    const aviso = {
      tipo,
      descripcion: desc || "Sin descripcion",
      estado: "pendiente",
      fecha,
      lat: puntoReporte.lat,
      lng: puntoReporte.lng,
      foto: null
    };

    if(inputFoto && inputFoto.files && inputFoto.files[0]){
      const file = inputFoto.files[0];
      const reader = new FileReader();
      reader.onload = function(e){
        aviso.foto = e.target.result;
        agregarAviso(aviso);
        cerrarModalReporte();
      };
      reader.readAsDataURL(file);
    } else {
      agregarAviso(aviso);
      cerrarModalReporte();
    }
  });
}

// Login
function detectarRolPorCorreo(correo){
  const low = correo.toLowerCase();
  if(low.includes("gob") || low.includes("muni") || low.endsWith(".gob.pe")) return "municipal";
  return "visitante";
}

function guardarSesionRol(rol){
  try{
    localStorage.setItem("rolActual", rol);
    if(inputCorreo && inputCorreo.value) localStorage.setItem("correoActual", inputCorreo.value);
  }catch(e){}
}

function cargarSesionRol(){
  try{
    const rol = localStorage.getItem("rolActual");
    const correo = localStorage.getItem("correoActual");
    if(correo && inputCorreo) inputCorreo.value = correo;
    if(rol){
      setRol(rol);
      updateMobileBanner();
      if(loginOverlay) loginOverlay.classList.add("hidden");
      return;
    }
  }catch(e){}
}

if(formLogin){
  formLogin.addEventListener("submit",(e)=>{
    e.preventDefault();
    const correo = inputCorreo ? inputCorreo.value.trim() : "";
    const clave = inputClave ? inputClave.value : "";
    if(!correo || !clave) return;

    // credenciales de ejemplo
    const credMunicipal = { email:"muni@muni.gob.pe", pass:"Muni123!" };
    const credVisitante = { email:"visitante@correo.com", pass:"Visitante123" };

    let rol = null;
    if(correo.toLowerCase() === credMunicipal.email && clave === credMunicipal.pass){
      rol = "municipal";
    } else if(correo.toLowerCase() === credVisitante.email && clave === credVisitante.pass){
      rol = "visitante";
    } else {
      rol = detectarRolPorCorreo(correo);
    }

    setRol(rol);
    guardarSesionRol(rol);
    if(loginOverlay) loginOverlay.classList.add("hidden");
    updateMobileBanner();
  });
}

// Inicializar sesión si existe
cargarSesionRol();

// Logout
if(btnLogout){
  btnLogout.addEventListener("click", ()=>{
    try{
      localStorage.removeItem("rolActual");
      localStorage.removeItem("correoActual");
    }catch(e){}
    setRol("visitante");
    updateMobileBanner();
    if(loginOverlay) loginOverlay.classList.remove("hidden");
    if(inputCorreo) inputCorreo.value="";
    if(inputClave) inputClave.value="";
  });
}

// Toggle sidebar en mobile
if(btnMenu && sidebar){
  btnMenu.addEventListener("click", ()=>{
    const expanded = sidebar.classList.toggle("expanded");
    if(expanded && isMobileViewport()){
      hideFABs();
    } else {
      showFABs();
    }
  });
}
if(btnFloatingFilters && sidebar){
  btnFloatingFilters.addEventListener("click", ()=>{
    const willExpand = !sidebar.classList.contains("expanded");
    if(willExpand){
      expandSidebar();
    } else {
      collapseSidebar();
    }
  });
}
if(btnFloatingReport && sidebar){
  btnFloatingReport.addEventListener("click", ()=>{
    expandSidebar();
    sidebar.scrollTop = sidebar.scrollHeight;
    const reportes = document.getElementById("reportes");
    if(reportes){
      reportes.scrollIntoView({behavior:"smooth"});
    }
  });
}

const btnAplicarFiltros = document.getElementById("btnAplicarFiltros");
const btnMostrarTodas = document.getElementById("btnMostrarTodas");
if(btnAplicarFiltros){
  btnAplicarFiltros.addEventListener("click", collapseSidebarAfterAction);
}
if(btnMostrarTodas){
  btnMostrarTodas.addEventListener("click", collapseSidebarAfterAction);
}

// AUTOCOMPLETADO
const inputBuscar = document.getElementById("inputBuscar");
const contSug = document.getElementById("sugerencias");
let timeoutAutocomplete;

inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.trim();
  if (texto.length < 2) {
    contSug.style.display = "none";
    contSug.innerHTML = "";
    return;
  }

  clearTimeout(timeoutAutocomplete);
  timeoutAutocomplete = setTimeout(async () => {
    const norm = normalizarTexto(texto);
    contSug.innerHTML = "";

    // Sugerencias locales (distritos)
    const locales = distritosLocales()
      .filter(d => normalizarTexto(d).includes(norm))
      .slice(0,5)
      .map(d => ({label:d, type:"local"}));

    // Sugerencias externas
    let externas = [];
    try{
      const url = buildNominatimUrl(texto,7);
      const res = await fetch(url);
      externas = await res.json();
    }catch(err){
      externas = [];
    }
    const externasMapped = (externas || []).map(item=>{
      const label = item.display_name;
      const esLima = (item.address && (item.address.city === "Lima" || item.address.town === "Lima" || item.address.state === "Lima")) || label.toLowerCase().includes("lima");
      return {label, lat:item.lat, lon:item.lon, type:"ext", esLima};
    });

    const sugerencias = [...locales, ...externasMapped];
    if(!sugerencias.length){
      contSug.style.display = "none";
      return;
    }

    sugerencias.forEach(item=>{
      const div = document.createElement("div");
      div.className = "sugerencia-item";
      div.innerText = item.label;
      if(item.esLima || item.type==="local") div.style.fontWeight = "700";
      div.addEventListener("click", async () => {
        inputBuscar.value = item.label;
        contSug.style.display = "none";
        if(item.type === "local"){
          await zoomADistrito(item.label);
        } else if(item.lat && item.lon){
          map.setView([item.lat, item.lon], 16);
          L.marker([item.lat, item.lon])
            .addTo(map)
            .bindPopup(`<strong>${item.label}</strong>`)
            .openPopup();
        }
      });
      contSug.appendChild(div);
    });
    contSug.style.display = "block";
  }, 500);
});

document
  .getElementById("btnBuscarDireccion")
  .addEventListener("click", async () => {
    const texto = inputBuscar.value;
    if(!texto.trim()){
      alert("Ingresa un texto para buscar.");
      return;
    }
    const url = buildNominatimUrl(texto,1);
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) {
      alert("No encontrado");
      return;
    }
    const lugar = data[0];
    map.flyTo([parseFloat(lugar.lat), parseFloat(lugar.lon)], 16, {duration:1.2, easeLinearity:0.25});
    L.marker([lugar.lat, lugar.lon])
      .addTo(map)
      .bindPopup(`<strong>${texto}</strong>`)
      .openPopup();
  });

// Mobile search listeners
const inputBuscarMobile = document.getElementById("inputBuscarMobile");
const contSugMobile = document.getElementById("sugerenciasMobile");
const btnBuscarDireccionMobile = document.getElementById("btnBuscarDireccionMobile");
let timeoutAutocompleteMobile;

function bindSearch(inputEl, contEl){
  inputEl.addEventListener("input", () => {
    const texto = inputEl.value.trim();
    if (texto.length < 2) {
      contEl.style.display = "none";
      contEl.innerHTML = "";
      return;
    }
    clearTimeout(timeoutAutocompleteMobile);
    timeoutAutocompleteMobile = setTimeout(async () => {
      const norm = normalizarTexto(texto);
      contEl.innerHTML = "";

      const locales = distritosLocales()
        .filter(d => normalizarTexto(d).includes(norm))
        .slice(0,5)
        .map(d => ({label:d, type:"local"}));

      let externas = [];
      try{
        const url = buildNominatimUrl(texto,7);
        const res = await fetch(url);
        externas = await res.json();
      }catch(err){ externas = []; }

      const externasMapped = (externas || []).map(item=>{
        const label = item.display_name;
        const esLima = (item.address && (item.address.city === "Lima" || item.address.town === "Lima" || item.address.state === "Lima")) || label.toLowerCase().includes("lima");
        return {label, lat:item.lat, lon:item.lon, type:"ext", esLima};
      });

      const sugerencias = [...locales, ...externasMapped];
      if(!sugerencias.length){
        contEl.style.display = "none";
        return;
      }

      sugerencias.forEach(item=>{
        const div = document.createElement("div");
        div.className = "sugerencia-item";
        div.innerText = item.label;
        if(item.esLima || item.type==="local") div.style.fontWeight = "700";
        div.addEventListener("click", async () => {
          inputEl.value = item.label;
          contEl.style.display = "none";
          if(item.type === "local"){
            await zoomADistrito(item.label);
          } else if(item.lat && item.lon){
            map.flyTo([parseFloat(item.lat), parseFloat(item.lon)], 16, {duration:1.2, easeLinearity:0.25});
            L.marker([item.lat, item.lon])
              .addTo(map)
              .bindPopup(`<strong>${item.label}</strong>`)
              .openPopup();
          }
        });
        contEl.appendChild(div);
      });
      contEl.style.display = "block";
    }, 500);
  });
}

if(inputBuscarMobile && contSugMobile){
  bindSearch(inputBuscarMobile, contSugMobile);
}
if(btnBuscarDireccionMobile && inputBuscarMobile){
  btnBuscarDireccionMobile.addEventListener("click", async () => {
    const texto = inputBuscarMobile.value;
    if(!texto.trim()){
      alert("Ingresa un texto para buscar.");
      return;
    }
    const url = buildNominatimUrl(texto,1);
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) {
      alert("No encontrado");
      return;
    }
    const lugar = data[0];
    map.flyTo([parseFloat(lugar.lat), parseFloat(lugar.lon)], 16, {duration:1.2, easeLinearity:0.25});
    L.marker([lugar.lat, lugar.lon])
      .addTo(map)
      .bindPopup(`<strong>${texto}</strong>`)
      .openPopup();
  });
}
