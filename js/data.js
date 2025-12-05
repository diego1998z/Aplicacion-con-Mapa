// Datos separados por tipo de senalizacion y su icono por defecto
const senalesHorizontal = [
  {
    id: 1,
    tipo: "Linea continua",
    estado: "nueva",
    zona: "Zona Norte",
    lat: -12.05,
    lng: -77.03,
    icono: "pista",
  },
  {
    id: 2,
    tipo: "Paso peatonal",
    estado: "danada",
    zona: "Zona Sur",
    lat: -12.048,
    lng: -77.045,
    icono: "paso",
  },
  {
    id: 3,
    tipo: "Flecha direccional",
    estado: "sin_senal",
    zona: "Miraflores",
    lat: -12.043,
    lng: -77.05,
    icono: "acceso",
  },
];

const senalesVertical = [
  {
    id: 101,
    tipo: "PARE",
    estado: "nueva",
    zona: "Zona Norte",
    lat: -12.052,
    lng: -77.028,
    icono: "stop",
  },
  {
    id: 102,
    tipo: "CEDA EL PASO",
    estado: "danada",
    zona: "Zona Sur",
    lat: -12.047,
    lng: -77.04,
    icono: "moto",
  },
  {
    id: 103,
    tipo: "ALTURA MAXIMA",
    estado: "sin_senal",
    zona: "Callao",
    lat: -12.06,
    lng: -77.1,
    icono: "velocidad",
  },
];

// Zonas por tipo
const zonasHorizontal = ["Zona Norte", "Zona Sur", "Miraflores"];
const zonasVertical = ["Zona Norte", "Zona Sur", "Callao"];

// Dataset actual (inicial horizontal)
let senales = senalesHorizontal;
let zonas = zonasHorizontal;
let modoActual = "horizontal";
