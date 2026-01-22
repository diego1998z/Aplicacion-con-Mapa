// Regiones y distritos de Lima
const MAPA_REGIONES = {
  "Lima Norte": ["Ancon","Carabayllo","Comas","Independencia","Los Olivos","Puente Piedra","San Martin de Porres","Santa Rosa"],
  "Lima Sur": ["Barranco","Chorrillos","Lurin","Pachacamac","Pucusana","Punta Hermosa","Punta Negra","San Bartolo","Santa Maria del Mar","Villa El Salvador","Villa Maria del Triunfo"],
  "Lima Este": ["Ate","Chaclacayo","Cieneguilla","El Agustino","La Molina","San Juan de Lurigancho","San Luis","Santa Anita"],
  "Lima Oeste": ["Brena","Jesus Maria","La Victoria","Lince","Magdalena del Mar","Miraflores","Pueblo Libre","San Isidro","San Miguel"],
  "Lima Centro": ["Cercado de Lima","Rimac","La Victoria","San Luis","Brena","Jesus Maria","Lince"]
};

// Datos separados por tipo de senalizacion y su icono por defecto
const senalesHorizontal = [
  {
    id: 1,
    tipo: "Linea continua",
    nombre: "Linea guia",
    estado: "nueva",
    region: "Lima Este",
    zona: "Ate",
    precio: 4200,
    lat: -12.05,
    lng: -77.03,
    icono: "pista",
    fecha_colocacion: "2024-10-12",
  },
  {
    id: 2,
    tipo: "Paso peatonal",
    nombre: "Cruce seguro",
    estado: "antigua",
    region: "Lima Norte",
    zona: "Los Olivos",
    precio: 4550,
    lat: -12.048,
    lng: -77.045,
    icono: "paso",
    fecha_colocacion: "2024-09-03",
  },
  {
    id: 3,
    tipo: "Flecha direccional",
    nombre: "Direccion obligatoria",
    estado: "sin_senal",
    region: "Lima Oeste",
    zona: "Miraflores",
    precio: 4100,
    lat: -12.043,
    lng: -77.05,
    icono: "acceso",
    fecha_colocacion: "2024-08-21",
  },
];

const senalesVertical = [
  {
    id: 101,
    tipo: "Reglamentaria",
    nombre: "R-1",
    estado: "nueva",
    region: "Lima Centro",
    zona: "Cercado de Lima",
    precio: 6100,
    lat: -12.052,
    lng: -77.028,
    icono: "R-1",
    fecha_colocacion: "2024-11-01",
  },
  {
    id: 102,
    tipo: "Preventiva",
    nombre: "P-10A",
    estado: "antigua",
    region: "Lima Sur",
    zona: "Barranco",
    precio: 5750,
    lat: -12.047,
    lng: -77.04,
    icono: "P-10A",
    fecha_colocacion: "2024-07-18",
  },
  {
    id: 103,
    tipo: "Informativa",
    nombre: "I-22",
    estado: "sin_senal",
    region: "Lima Norte",
    zona: "Puente Piedra",
    precio: 6400,
    lat: -12.06,
    lng: -77.1,
    icono: "I-22-Servicio-de-informacion",
    fecha_colocacion: "2024-05-09",
  },
];

// Mobiliario vial (aun sin iconos / datos)
const senalesMobiliario = [];

// Dataset actual (inicial horizontal)
let senales = senalesHorizontal;
let modoActual = "horizontal";

// Avisos ciudadanos
let avisos = [];

// Historial de cambios de se¤ales (creadas / editadas / eliminadas / cambios de estado)
let historialSenales = [];
let historialSenalesSeq = 1;
