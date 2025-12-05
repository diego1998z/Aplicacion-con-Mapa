document.getElementById("btnUbicacion").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 16);
    L.marker([lat, lon]).addTo(map).bindPopup("Tu ubicacion").openPopup();
  });
});

// AUTOCOMPLETADO
const inputBuscar = document.getElementById("inputBuscar");
const contSug = document.getElementById("sugerencias");
let timeoutAutocomplete;

inputBuscar.addEventListener("input", () => {
  const texto = inputBuscar.value.trim();
  if (texto.length < 3) {
    contSug.style.display = "none";
    contSug.innerHTML = "";
    return;
  }

  clearTimeout(timeoutAutocomplete);
  timeoutAutocomplete = setTimeout(async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      texto
    )}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    contSug.innerHTML = "";
    if (!data.length) {
      contSug.style.display = "none";
      return;
    }

    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "sugerencia-item";
      div.innerText = item.display_name;
      div.addEventListener("click", () => {
        inputBuscar.value = item.display_name;
        contSug.style.display = "none";
        map.setView([item.lat, item.lon], 16);
        L.marker([item.lat, item.lon])
          .addTo(map)
          .bindPopup(`<strong>${item.display_name}</strong>`)
          .openPopup();
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
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      texto
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) {
      alert("No encontrado");
      return;
    }
    const lugar = data[0];
    map.setView([lugar.lat, lugar.lon], 16);
    L.marker([lugar.lat, lugar.lon])
      .addTo(map)
      .bindPopup(`<strong>${texto}</strong>`)
      .openPopup();
  });
