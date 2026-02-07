// Datos ligeros para arranque rapido. El dataset completo se carga bajo demanda.
var MAPA_REGIONES = {
  "Lima Norte": ["Ancon","Carabayllo","Comas","Independencia","Los Olivos","Puente Piedra","San Martin de Porres","Santa Rosa"],
  "Lima Sur": ["Barranco","Chorrillos","Lurin","Pachacamac","Pucusana","Punta Hermosa","Punta Negra","San Bartolo","Santa Maria del Mar","Villa El Salvador","Villa Maria del Triunfo"],
  "Lima Este": ["Ate","Chaclacayo","Cieneguilla","El Agustino","La Molina","San Juan de Lurigancho","San Luis","Santa Anita"],
  "Lima Oeste": ["Brena","Jesus Maria","La Victoria","Lince","Magdalena del Mar","Miraflores","Pueblo Libre","San Isidro","San Miguel"],
  "Lima Centro": ["Cercado de Lima","Rimac","La Victoria","San Luis","Brena","Jesus Maria","Lince"]
};

var avisos = [];
var senalesHorizontal = [];
var senalesVertical = [];
var senalesMobiliario = [];
var proyectosSeed = [];
var proyectosSeedMeta = {};
var proyectoActivoSeedId = "";
