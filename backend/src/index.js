const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "urbbis-backend" });
});

// Projects
app.get("/projects", async (req, res, next) => {
  try {
    const items = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/projects", async (req, res, next) => {
  try {
    const { name, year, startDate, endDate } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const created = await prisma.project.create({
      data: {
        name: String(name),
        year: toNumber(year) ?? undefined,
        startDate: toDate(startDate) ?? undefined,
        endDate: toDate(endDate) ?? undefined
      }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/projects/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year, startDate, endDate } = req.body || {};
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name ? String(name) : undefined,
        year: toNumber(year) ?? undefined,
        startDate: toDate(startDate) ?? undefined,
        endDate: toDate(endDate) ?? undefined
      }
    });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    next(err);
  }
});

app.delete("/projects/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }
    next(err);
  }
});

// Assets (señales / marcas / mobiliario)
app.get("/assets", async (req, res, next) => {
  try {
    const { projectId, type } = req.query || {};
    const where = {};
    if (projectId) where.projectId = String(projectId);
    if (type) where.type = String(type);
    const items = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/assets", async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.type) return res.status(400).json({ error: "type is required" });
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    if (lat === null || lng === null) {
      return res.status(400).json({ error: "lat and lng are required" });
    }
    const created = await prisma.asset.create({
      data: {
        legacyId: toNumber(body.legacyId) ?? undefined,
        projectId: body.projectId ? String(body.projectId) : undefined,
        type: String(body.type),
        name: body.name ? String(body.name) : undefined,
        category: body.category ? String(body.category) : undefined,
        icon: body.icon ? String(body.icon) : undefined,
        state: body.state ? String(body.state) : undefined,
        statePhysical: body.statePhysical ? String(body.statePhysical) : undefined,
        lat,
        lng,
        district: body.district ? String(body.district) : undefined,
        region: body.region ? String(body.region) : undefined,
        price: toNumber(body.price) ?? undefined,
        installedAt: toDate(body.installedAt) ?? undefined,
        width: toNumber(body.width) ?? undefined,
        length: toNumber(body.length) ?? undefined,
        areaM2: toNumber(body.areaM2) ?? undefined,
        photoUrl: body.photoUrl ? String(body.photoUrl) : undefined
      }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/assets/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        legacyId: toNumber(body.legacyId) ?? undefined,
        projectId: body.projectId ? String(body.projectId) : undefined,
        type: body.type ? String(body.type) : undefined,
        name: body.name ? String(body.name) : undefined,
        category: body.category ? String(body.category) : undefined,
        icon: body.icon ? String(body.icon) : undefined,
        state: body.state ? String(body.state) : undefined,
        statePhysical: body.statePhysical ? String(body.statePhysical) : undefined,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        district: body.district ? String(body.district) : undefined,
        region: body.region ? String(body.region) : undefined,
        price: toNumber(body.price) ?? undefined,
        installedAt: toDate(body.installedAt) ?? undefined,
        width: toNumber(body.width) ?? undefined,
        length: toNumber(body.length) ?? undefined,
        areaM2: toNumber(body.areaM2) ?? undefined,
        photoUrl: body.photoUrl ? String(body.photoUrl) : undefined
      }
    });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Asset not found" });
    }
    next(err);
  }
});

app.delete("/assets/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.asset.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Asset not found" });
    }
    next(err);
  }
});

// Reports (avisos ciudadanos)
app.get("/reports", async (req, res, next) => {
  try {
    const { projectId, type, status } = req.query || {};
    const where = {};
    if (projectId) where.projectId = String(projectId);
    if (type) where.type = String(type);
    if (status) where.status = String(status);
    const items = await prisma.report.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/reports", async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.type) return res.status(400).json({ error: "type is required" });
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    if (lat === null || lng === null) {
      return res.status(400).json({ error: "lat and lng are required" });
    }
    const created = await prisma.report.create({
      data: {
        legacyId: toNumber(body.legacyId) ?? undefined,
        projectId: body.projectId ? String(body.projectId) : undefined,
        userId: body.userId ? String(body.userId) : undefined,
        type: String(body.type),
        description: body.description ? String(body.description) : undefined,
        status: body.status ? String(body.status) : undefined,
        lat,
        lng,
        district: body.district ? String(body.district) : undefined,
        region: body.region ? String(body.region) : undefined,
        userName: body.userName ? String(body.userName) : undefined,
        userEmail: body.userEmail ? String(body.userEmail) : undefined,
        userDni: body.userDni ? String(body.userDni) : undefined,
        photoUrl: body.photoUrl ? String(body.photoUrl) : undefined
      }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/reports/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    const updated = await prisma.report.update({
      where: { id },
      data: {
        legacyId: toNumber(body.legacyId) ?? undefined,
        projectId: body.projectId ? String(body.projectId) : undefined,
        userId: body.userId ? String(body.userId) : undefined,
        type: body.type ? String(body.type) : undefined,
        description: body.description ? String(body.description) : undefined,
        status: body.status ? String(body.status) : undefined,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        district: body.district ? String(body.district) : undefined,
        region: body.region ? String(body.region) : undefined,
        userName: body.userName ? String(body.userName) : undefined,
        userEmail: body.userEmail ? String(body.userEmail) : undefined,
        userDni: body.userDni ? String(body.userDni) : undefined,
        photoUrl: body.photoUrl ? String(body.photoUrl) : undefined
      }
    });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Report not found" });
    }
    next(err);
  }
});

app.delete("/reports/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.report.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Report not found" });
    }
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
