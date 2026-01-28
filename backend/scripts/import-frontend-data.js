const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function loadFrontendData() {
  const dataPath = path.join(__dirname, "../../frontend/js/data.js");
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(
    `${code}\nthis.__DATA__ = { senalesHorizontal, senalesVertical, senalesMobiliario, avisos };`,
    sandbox
  );
  return sandbox.__DATA__ || {};
}

function mapAsset(item, type) {
  return {
    legacyId: toNumber(item.id) ?? undefined,
    type,
    name: item.nombre || "",
    category: item.tipo || "",
    icon: item.icono || "",
    state: item.estado || "",
    statePhysical: item.estado_fisico || "",
    lat: Number(item.lat),
    lng: Number(item.lng),
    district: item.distrito || item.zona || "",
    region: item.region || "",
    price: toNumber(item.precio) ?? undefined,
    installedAt: toDate(item.fecha_colocacion) ?? undefined,
    width: item.dimensiones ? toNumber(item.dimensiones.ancho) ?? undefined : undefined,
    length: item.dimensiones ? toNumber(item.dimensiones.largo) ?? undefined : undefined,
    areaM2: toNumber(item.area_m2) ?? undefined,
    photoUrl: item.inspeccionFoto || null
  };
}

function mapReport(item) {
  return {
    legacyId: toNumber(item.id) ?? undefined,
    type: item.tipo || "otro",
    description: item.descripcion || "",
    status: item.estado || "pendiente",
    lat: Number(item.lat),
    lng: Number(item.lng),
    district: item.distrito || "",
    region: item.region || "",
    userName: item.usuarioNombre || "",
    userEmail: item.usuarioEmail || "",
    userDni: item.usuarioDni || "",
    photoUrl: item.foto || null
  };
}

async function upsertAsset(data) {
  if (data.legacyId !== undefined && data.legacyId !== null) {
    return prisma.asset.upsert({
      where: { legacyId: data.legacyId },
      update: data,
      create: data
    });
  }
  return prisma.asset.create({ data });
}

async function upsertReport(data) {
  if (data.legacyId !== undefined && data.legacyId !== null) {
    return prisma.report.upsert({
      where: { legacyId: data.legacyId },
      update: data,
      create: data
    });
  }
  return prisma.report.create({ data });
}

async function main() {
  const data = loadFrontendData();
  const horiz = Array.isArray(data.senalesHorizontal) ? data.senalesHorizontal : [];
  const vert = Array.isArray(data.senalesVertical) ? data.senalesVertical : [];
  const mob = Array.isArray(data.senalesMobiliario) ? data.senalesMobiliario : [];
  const avisos = Array.isArray(data.avisos) ? data.avisos : [];

  let assetsCount = 0;
  for (const item of horiz) {
    await upsertAsset(mapAsset(item, "horizontal"));
    assetsCount += 1;
  }
  for (const item of vert) {
    await upsertAsset(mapAsset(item, "vertical"));
    assetsCount += 1;
  }
  for (const item of mob) {
    await upsertAsset(mapAsset(item, "mobiliario"));
    assetsCount += 1;
  }

  let reportsCount = 0;
  for (const item of avisos) {
    await upsertReport(mapReport(item));
    reportsCount += 1;
  }

  console.log(`Importados ${assetsCount} activos y ${reportsCount} reportes.`);
}

main()
  .catch((err) => {
    console.error("Error al importar datos:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
