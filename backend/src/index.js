const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "12h" });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Token requerido" });
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalido" });
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "urbbis-backend" });
});

// Auth
app.post("/auth/register", async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email y password son requeridos" });
    }
    const normalized = String(email).trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email: normalized } });
    if (exists) {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: {
        email: normalized,
        passwordHash,
        name: name ? String(name) : undefined,
        role: role ? String(role) : "user"
      }
    });
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email y password son requeridos" });
    }
    const normalized = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

app.get("/auth/me", authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
});

// Projects
app.get("/projects", async (req, res, next) => {
  try {
    const { legacyId } = req.query || {};
    const where = {};
    if (legacyId) where.legacyId = String(legacyId);
    const items = await prisma.project.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/projects", async (req, res, next) => {
  try {
    const { name, year, startDate, endDate, legacyId, district, data } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    if (legacyId) {
      const created = await prisma.project.upsert({
        where: { legacyId: String(legacyId) },
        update: {
          name: String(name),
          year: toNumber(year) ?? undefined,
          startDate: toDate(startDate) ?? undefined,
          endDate: toDate(endDate) ?? undefined,
          district: district ? String(district) : undefined,
          data: data ?? undefined
        },
        create: {
          legacyId: String(legacyId),
          name: String(name),
          year: toNumber(year) ?? undefined,
          startDate: toDate(startDate) ?? undefined,
          endDate: toDate(endDate) ?? undefined,
          district: district ? String(district) : undefined,
          data: data ?? undefined
        }
      });
      return res.status(201).json(created);
    }
    const created = await prisma.project.create({
      data: {
        name: String(name),
        year: toNumber(year) ?? undefined,
        startDate: toDate(startDate) ?? undefined,
        endDate: toDate(endDate) ?? undefined,
        district: district ? String(district) : undefined,
        data: data ?? undefined
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
    const { name, year, startDate, endDate, legacyId, district, data } = req.body || {};
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name ? String(name) : undefined,
        year: toNumber(year) ?? undefined,
        startDate: toDate(startDate) ?? undefined,
        endDate: toDate(endDate) ?? undefined,
        legacyId: legacyId ? String(legacyId) : undefined,
        district: district ? String(district) : undefined,
        data: data ?? undefined
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
    const data = {
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
    };

    if (data.legacyId !== undefined && data.legacyId !== null) {
      const created = await prisma.asset.upsert({
        where: { legacyId: data.legacyId },
        update: data,
        create: data
      });
      return res.status(201).json(created);
    }

    const created = await prisma.asset.create({ data });
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
    const data = {
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
    };

    if (data.legacyId !== undefined && data.legacyId !== null) {
      const created = await prisma.report.upsert({
        where: { legacyId: data.legacyId },
        update: data,
        create: data
      });
      return res.status(201).json(created);
    }

    const created = await prisma.report.create({ data });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Plans
function normalizePlanPayload(body) {
  const projects = Array.isArray(body.projects) ? body.projects : [];
  return {
    ownerKey: String(body.ownerKey || ""),
    name: String(body.name || ""),
    year: Number(body.year || 0),
    deadline: body.deadline ? String(body.deadline) : undefined,
    status: String(body.status || "planificacion"),
    amount: toNumber(body.amount) ?? 0,
    executed: toNumber(body.executed) ?? 0,
    projects: projects.map((p) => ({
      projectLegacyId: p.projectLegacyId ? String(p.projectLegacyId) : undefined,
      name: String(p.name || "Proyecto"),
      status: String(p.status || "planificacion"),
      assignedAmount: toNumber(p.assignedAmount) ?? 0,
      executedAmount: toNumber(p.executedAmount) ?? 0
    }))
  };
}

app.get("/plans", async (req, res, next) => {
  try {
    const { ownerKey } = req.query || {};
    const where = {};
    if (ownerKey) where.ownerKey = String(ownerKey);
    const items = await prisma.plan.findMany({
      where,
      include: { projects: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/plans", async (req, res, next) => {
  try {
    const payload = normalizePlanPayload(req.body || {});
    if (!payload.ownerKey) return res.status(400).json({ error: "ownerKey is required" });
    if (!payload.name) return res.status(400).json({ error: "name is required" });
    const created = await prisma.plan.create({
      data: {
        ownerKey: payload.ownerKey,
        name: payload.name,
        year: payload.year,
        deadline: payload.deadline,
        status: payload.status,
        amount: payload.amount,
        executed: payload.executed,
        projects: {
          create: payload.projects
        }
      },
      include: { projects: true }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/plans/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = normalizePlanPayload(req.body || {});
    const updated = await prisma.plan.update({
      where: { id },
      data: {
        ownerKey: payload.ownerKey || undefined,
        name: payload.name || undefined,
        year: payload.year || undefined,
        deadline: payload.deadline,
        status: payload.status || undefined,
        amount: payload.amount ?? undefined,
        executed: payload.executed ?? undefined,
        projects: {
          deleteMany: {},
          create: payload.projects
        }
      },
      include: { projects: true }
    });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Plan not found" });
    }
    next(err);
  }
});

app.delete("/plans/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.plan.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Plan not found" });
    }
    next(err);
  }
});

// Budgets
app.get("/budgets", async (req, res, next) => {
  try {
    const { ownerKey } = req.query || {};
    const where = {};
    if (ownerKey) where.ownerKey = String(ownerKey);
    const items = await prisma.annualBudget.findMany({
      where,
      orderBy: { year: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/budgets", async (req, res, next) => {
  try {
    const { ownerKey, year, total } = req.body || {};
    if (!ownerKey) return res.status(400).json({ error: "ownerKey is required" });
    const parsedYear = Number(year || 0);
    if (!parsedYear) return res.status(400).json({ error: "year is required" });
    const data = {
      ownerKey: String(ownerKey),
      year: parsedYear,
      total: toNumber(total) ?? 0
    };
    const upserted = await prisma.annualBudget.upsert({
      where: { ownerKey_year: { ownerKey: data.ownerKey, year: data.year } },
      update: { total: data.total },
      create: data
    });
    res.status(201).json(upserted);
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
