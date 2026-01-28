const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const MAPA_REGIONES = {
  "Lima Norte": ["Ancon", "Carabayllo", "Comas", "Independencia", "Los Olivos", "Puente Piedra", "San Martin de Porres", "Santa Rosa"],
  "Lima Sur": ["Barranco", "Chorrillos", "Lurin", "Pachacamac", "Pucusana", "Punta Hermosa", "Punta Negra", "San Bartolo", "Santa Maria del Mar", "Villa El Salvador", "Villa Maria del Triunfo"],
  "Lima Este": ["Ate", "Chaclacayo", "Cieneguilla", "El Agustino", "La Molina", "San Juan de Lurigancho", "San Luis", "Santa Anita"],
  "Lima Oeste": ["Brena", "Jesus Maria", "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Isidro", "San Miguel"],
  "Lima Centro": ["Cercado de Lima", "Rimac", "La Victoria", "San Luis", "Brena", "Jesus Maria", "Lince"]
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const prisma = new PrismaClient();
  const password = process.env.SEED_PASSWORD || "Muni123";
  const passwordHash = await bcrypt.hash(password, 10);

  const entries = [];
  const seen = new Set();

  for (const [region, districts] of Object.entries(MAPA_REGIONES)) {
    for (const district of districts) {
      const key = slugify(district);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      entries.push({
        email: `${key}@muni.gob.pe`,
        district,
        region
      });
    }
  }

  entries.push({ email: "admin@muni.gob.pe", district: "", region: "", role: "admin" });

  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const email = entry.email;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      skipped += 1;
      continue;
    }
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: entry.role || "municipal",
        district: entry.district || undefined,
        region: entry.region || undefined
      }
    });
    created += 1;
  }

  await prisma.$disconnect();
  console.log(`Seeded users. created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
