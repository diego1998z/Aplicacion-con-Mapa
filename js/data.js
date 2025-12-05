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
    estado: "nueva",
    region: "Lima Este",
    zona: "Ate",
    lat: -12.05,
    lng: -77.03,
    icono: "pista",
  },
  {
    id: 2,
    tipo: "Paso peatonal",
    estado: "danada",
    region: "Lima Norte",
    zona: "Los Olivos",
    lat: -12.048,
    lng: -77.045,
    icono: "paso",
  },
  {
    id: 3,
    tipo: "Flecha direccional",
    estado: "sin_senal",
    region: "Lima Oeste",
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
    region: "Lima Centro",
    zona: "Cercado de Lima",
    lat: -12.052,
    lng: -77.028,
    icono: "stop",
  },
  {
    id: 102,
    tipo: "CEDA EL PASO",
    estado: "danada",
    region: "Lima Sur",
    zona: "Barranco",
    lat: -12.047,
    lng: -77.04,
    icono: "moto",
  },
  {
    id: 103,
    tipo: "ALTURA MAXIMA",
    estado: "sin_senal",
    region: "Lima Norte",
    zona: "Puente Piedra",
    lat: -12.06,
    lng: -77.1,
    icono: "velocidad",
  },
];

// Dataset actual (inicial horizontal)
let senales = senalesHorizontal;
let modoActual = "horizontal";
