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

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function requireRole(roles = []) {
  return (req, res, next) => {
    const role = req.user && req.user.role ? String(req.user.role) : "";
    if (!roles.length || roles.includes(role)) {
      return next();
    }
    return res.status(403).json({ error: "No autorizado" });
  };
}

function getScopeFromUser(user) {
  if (!user) return { role: "", district: "", region: "", scopeKey: "" };
  const role = String(user.role || "");
  const district = String(user.district || "");
  const region = String(user.region || "");
  let scopeKey = "";
  if (role === "municipal" && district) {
    scopeKey = normalizeKey(district);
  } else if (user.email) {
    scopeKey = normalizeKey(user.email);
  }
  return { role, district, region, scopeKey };
}

function matchesDistrict(record, district) {
  if (!district) return true;
  const recDist = String(record && record.district || "");
  if (recDist && recDist.toLowerCase() === district.toLowerCase()) return true;
  const data = record && record.data && typeof record.data === "object" ? record.data : null;
  if (data && data.distrito && String(data.distrito).toLowerCase() === district.toLowerCase()) return true;
  return false;
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "urbbis-backend" });
});

// Auth
app.post("/auth/register", async (req, res, next) => {
  try {
    const { email, password, name, role, district, region } = req.body || {};
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
        role: role ? String(role) : "user",
        district: district ? String(district) : undefined,
        region: region ? String(region) : undefined
      }
    });
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      district: user.district || "",
      region: user.region || ""
    });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        district: user.district || "",
        region: user.region || ""
      }
    });
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
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      district: user.district || "",
      region: user.region || ""
    });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        district: user.district || "",
        region: user.region || ""
      }
    });
  } catch (err) {
    next(err);
  }
});

app.get("/auth/me", authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      district: user.district || "",
      region: user.region || ""
    });
  } catch (err) {
    next(err);
  }
});

// Projects
app.get("/projects", authRequired, async (req, res, next) => {
  try {
    const { legacyId } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (legacyId) where.legacyId = String(legacyId);
    if (scope.role !== "admin" && scope.district) {
      where.OR = [
        { district: scope.district },
        {
          district: null,
          data: { path: ["distrito"], equals: scope.district }
        }
      ];
    }
    const items = await prisma.project.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/projects", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { name, year, startDate, endDate, legacyId, district, data } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const scope = getScopeFromUser(req.user || {});
    const enforcedDistrict = (scope.role === "municipal" && scope.district) ? scope.district : (district ? String(district) : undefined);
    if (legacyId) {
      const created = await prisma.project.upsert({
        where: { legacyId: String(legacyId) },
        update: {
          name: String(name),
          year: toNumber(year) ?? undefined,
          startDate: toDate(startDate) ?? undefined,
          endDate: toDate(endDate) ?? undefined,
          district: enforcedDistrict,
          data: data ?? undefined
        },
        create: {
          legacyId: String(legacyId),
          name: String(name),
          year: toNumber(year) ?? undefined,
          startDate: toDate(startDate) ?? undefined,
          endDate: toDate(endDate) ?? undefined,
          district: enforcedDistrict,
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
        district: enforcedDistrict,
        data: data ?? undefined
      }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/projects/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year, startDate, endDate, legacyId, district, data } = req.body || {};
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.project.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Project not found" });
      if (!matchesDistrict(current, scope.district)) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: name ? String(name) : undefined,
        year: toNumber(year) ?? undefined,
        startDate: toDate(startDate) ?? undefined,
        endDate: toDate(endDate) ?? undefined,
        legacyId: legacyId ? String(legacyId) : undefined,
        district: (scope.role === "municipal" && scope.district) ? scope.district : (district ? String(district) : undefined),
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

app.delete("/projects/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.project.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Project not found" });
      if (!matchesDistrict(current, scope.district)) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
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
app.get("/assets", authRequired, async (req, res, next) => {
  try {
    const { projectId, type } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (projectId) where.projectId = String(projectId);
    if (type) where.type = String(type);
    if (scope.role !== "admin" && scope.district) {
      where.district = scope.district;
    }
    const items = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/assets", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.type) return res.status(400).json({ error: "type is required" });
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    if (lat === null || lng === null) {
      return res.status(400).json({ error: "lat and lng are required" });
    }
    const scope = getScopeFromUser(req.user || {});
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
      district: (scope.role === "municipal" && scope.district) ? scope.district : (body.district ? String(body.district) : undefined),
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

app.put("/assets/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.asset.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Asset not found" });
      if (String(current.district || "").toLowerCase() !== scope.district.toLowerCase()) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
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
        district: (scope.role === "municipal" && scope.district) ? scope.district : (body.district ? String(body.district) : undefined),
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

app.delete("/assets/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.asset.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Asset not found" });
      if (String(current.district || "").toLowerCase() !== scope.district.toLowerCase()) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
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
app.get("/reports", authRequired, async (req, res, next) => {
  try {
    const { projectId, type, status } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (projectId) where.projectId = String(projectId);
    if (type) where.type = String(type);
    if (status) where.status = String(status);
    if (scope.role !== "admin" && scope.district) {
      where.district = scope.district;
    }
    const items = await prisma.report.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/reports", authRequired, requireRole(["admin", "municipal", "visitante", "user"]), async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.type) return res.status(400).json({ error: "type is required" });
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    if (lat === null || lng === null) {
      return res.status(400).json({ error: "lat and lng are required" });
    }
    const scope = getScopeFromUser(req.user || {});
    const data = {
      legacyId: toNumber(body.legacyId) ?? undefined,
      projectId: body.projectId ? String(body.projectId) : undefined,
      userId: req.user && req.user.sub ? String(req.user.sub) : (body.userId ? String(body.userId) : undefined),
      type: String(body.type),
      description: body.description ? String(body.description) : undefined,
      status: body.status ? String(body.status) : undefined,
      lat,
      lng,
      district: (scope.role === "municipal" && scope.district) ? scope.district : (body.district ? String(body.district) : undefined),
      region: body.region ? String(body.region) : undefined,
      userName: body.userName ? String(body.userName) : undefined,
      userEmail: body.userEmail ? String(body.userEmail) : (req.user && req.user.email ? String(req.user.email) : undefined),
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

app.get("/plans", authRequired, async (req, res, next) => {
  try {
    const { ownerKey } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (scope.role === "admin") {
      if (ownerKey) where.ownerKey = String(ownerKey);
    } else if (scope.scopeKey) {
      where.ownerKey = scope.scopeKey;
    }
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

app.post("/plans", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const payload = normalizePlanPayload(req.body || {});
    const scope = getScopeFromUser(req.user || {});
    const enforcedOwnerKey = scope.role === "admin"
      ? (payload.ownerKey || scope.scopeKey)
      : scope.scopeKey;
    if (!enforcedOwnerKey) return res.status(400).json({ error: "ownerKey is required" });
    if (!payload.name) return res.status(400).json({ error: "name is required" });
    const created = await prisma.plan.create({
      data: {
        ownerKey: enforcedOwnerKey,
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

app.put("/plans/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = normalizePlanPayload(req.body || {});
    const scope = getScopeFromUser(req.user || {});
    const current = await prisma.plan.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: "Plan not found" });
    if (scope.role !== "admin" && current.ownerKey !== scope.scopeKey) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const updated = await prisma.plan.update({
      where: { id },
      data: {
        ownerKey: scope.role === "admin" ? (payload.ownerKey || current.ownerKey) : current.ownerKey,
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

app.delete("/plans/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const scope = getScopeFromUser(req.user || {});
    const current = await prisma.plan.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: "Plan not found" });
    if (scope.role !== "admin" && current.ownerKey !== scope.scopeKey) {
      return res.status(403).json({ error: "No autorizado" });
    }
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
app.get("/budgets", authRequired, async (req, res, next) => {
  try {
    const { ownerKey } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (scope.role === "admin") {
      if (ownerKey) where.ownerKey = String(ownerKey);
    } else if (scope.scopeKey) {
      where.ownerKey = scope.scopeKey;
    }
    const items = await prisma.annualBudget.findMany({
      where,
      orderBy: { year: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/budgets", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { ownerKey, year, total } = req.body || {};
    const scope = getScopeFromUser(req.user || {});
    const enforcedOwnerKey = scope.role === "admin"
      ? (ownerKey ? String(ownerKey) : scope.scopeKey)
      : scope.scopeKey;
    if (!enforcedOwnerKey) return res.status(400).json({ error: "ownerKey is required" });
    const parsedYear = Number(year || 0);
    if (!parsedYear) return res.status(400).json({ error: "year is required" });
    const data = {
      ownerKey: enforcedOwnerKey,
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

app.put("/reports/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const lat = toNumber(body.lat);
    const lng = toNumber(body.lng);
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.report.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Report not found" });
      if (String(current.district || "").toLowerCase() !== scope.district.toLowerCase()) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
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
        district: (scope.role === "municipal" && scope.district) ? scope.district : (body.district ? String(body.district) : undefined),
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

app.delete("/reports/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && scope.district) {
      const current = await prisma.report.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Report not found" });
      if (String(current.district || "").toLowerCase() !== scope.district.toLowerCase()) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
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
