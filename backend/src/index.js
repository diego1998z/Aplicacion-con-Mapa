const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

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

function getRecordTypeFromBody(body) {
  if (!body) return undefined;
  if (body.recordType) return String(body.recordType);
  if (body.registroTipo) return String(body.registroTipo);
  const data = body.data && typeof body.data === "object" ? body.data : null;
  if (data && data.registroTipo) return String(data.registroTipo);
  return undefined;
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

function countBy(list, keyGetter) {
  const out = {};
  const arr = Array.isArray(list) ? list : [];
  arr.forEach((item) => {
    const key = String(keyGetter(item) || "").trim().toLowerCase();
    if (!key) return;
    out[key] = (out[key] || 0) + 1;
  });
  return out;
}

function sumBy(list, valueGetter) {
  const arr = Array.isArray(list) ? list : [];
  return arr.reduce((acc, item) => {
    const num = Number(valueGetter(item));
    return Number.isFinite(num) ? acc + num : acc;
  }, 0);
}

function parseJsonSafe(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    return {};
  }
}

function extractGeminiText(payload) {
  const candidates = Array.isArray(payload && payload.candidates) ? payload.candidates : [];
  if (!candidates.length) return "";
  const parts = Array.isArray(candidates[0] && candidates[0].content && candidates[0].content.parts)
    ? candidates[0].content.parts
    : [];
  return parts
    .map((p) => (p && typeof p.text === "string" ? p.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

function formatMoneyPEN(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "S/ 0";
  return "S/ " + Math.round(num).toLocaleString("es-PE");
}

function pickTopEntries(dict, limit = 3) {
  const entries = Object.entries(dict && typeof dict === "object" ? dict : {});
  return entries
    .map(([key, value]) => ({ key, value: Number(value || 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function construirRespuestaLocalGratis({ prompt, contextJson }) {
  const ctx = parseJsonSafe(contextJson);
  const resumen = ctx && ctx.resumen && typeof ctx.resumen === "object" ? ctx.resumen : {};
  const inversion = ctx && ctx.inversion && typeof ctx.inversion === "object" ? ctx.inversion : {};
  const reportesPorTipo = resumen && resumen.reportesPorTipo && typeof resumen.reportesPorTipo === "object"
    ? resumen.reportesPorTipo
    : {};
  const topTipos = pickTopEntries(reportesPorTipo, 3);
  const topDistritos = Array.isArray(resumen.topDistritos) ? resumen.topDistritos.slice(0, 3) : [];
  const planes = Array.isArray(inversion.planesRecientes) ? inversion.planesRecientes : [];
  const planificado = Number(inversion.montoPlanificado || 0);
  const ejecutado = Number(inversion.montoEjecutado || 0);
  const avance = planificado > 0 ? Math.round((ejecutado / planificado) * 100) : 0;

  const zonasTexto = topDistritos.length
    ? topDistritos
      .map((z, i) => `${i + 1}. ${z.district || "Sin distrito"} (${Number(z.count || 0)} reportes)`)
      .join("\n")
    : "1. Sin concentracion clara de reportes en los datos actuales.";

  const tiposTexto = topTipos.length
    ? topTipos.map((t) => `${t.key} (${t.value})`).join(", ")
    : "sin tipologia predominante";

  const recs = [];
  recs.push("- Priorizar activos deteriorados y por reponer en zonas con mayor concentracion de reportes.");
  recs.push("- Ejecutar mantenimiento preventivo mensual en corredores con alto flujo antes de reposicion masiva.");
  if (topTipos.some((t) => t.key.includes("falta") || t.key.includes("sin"))) {
    recs.push("- Acelerar reposicion de señalizacion ausente y reforzar vertical/horizontal en cruces criticos.");
  }
  if (topTipos.some((t) => t.key.includes("danad") || t.key.includes("deterior"))) {
    recs.push("- Programar renovacion de marcas viales y senales con desgaste visible en ventanas quincenales.");
  }
  if (!recs.length) {
    recs.push("- Mantener esquema mixto: 60% mantenimiento preventivo, 40% reposicion dirigida por reportes.");
  }

  const consulta = String(prompt || "").trim();
  const diagnostico = [
    `Se analizaron ${Number(resumen.totalActivos || 0)} activos y ${Number(resumen.totalReportes || 0)} reportes.`,
    `Planes: ${planes.length} registrados, avance aproximado ${Math.max(0, Math.min(100, avance))}% (${formatMoneyPEN(ejecutado)} de ${formatMoneyPEN(planificado)}).`,
    `Tipos de reporte mas frecuentes: ${tiposTexto}.`
  ].join(" ");

  return [
    "Modo IA local gratuito activo (sin GEMINI_API_KEY).",
    "1) Diagnostico breve",
    diagnostico,
    "",
    "2) Zonas prioritarias (max 3, con motivo)",
    zonasTexto,
    "",
    "3) Recomendaciones concretas",
    recs.slice(0, 4).join("\n"),
    "",
    "4) Riesgos/supuestos",
    "- Analisis basado en datos cargados actualmente; si faltan reportes de campo, la prioridad puede variar.",
    "- La precision mejora al registrar eventos georreferenciados y actualizar estado real de activos.",
    "",
    "Consulta recibida:",
    consulta || "(sin consulta)"
  ].join("\n");
}

async function consultarGeminiPresupuesto({ prompt, contextJson }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  if (!apiKey) {
    return {
      model: "local-free-fallback",
      answer: construirRespuestaLocalGratis({ prompt, contextJson })
    };
  }

  const systemInstruction = [
    "Eres un analista tecnico de inversion vial para municipalidades del Peru.",
    "Responde solo en espanol.",
    "Usa exclusivamente el contexto JSON proporcionado y la consulta del usuario.",
    "Si faltan datos, dilo explicitamente y propone como obtenerlos.",
    "Entrega una respuesta accionable con este formato:",
    "1) Diagnostico breve",
    "2) Zonas prioritarias (max 3, con motivo)",
    "3) Recomendaciones concretas (marcas viales, senalizacion horizontal y vertical)",
    "4) Riesgos/supuestos",
    "No inventes cifras ni cites fuentes no entregadas."
  ].join(" ");

  const userPrompt = [
    "Consulta del usuario:",
    prompt,
    "",
    "Contexto local (JSON):",
    contextJson
  ].join("\n");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 900
        }
      })
    });

    const rawText = await res.text();
    const payload = parseJsonSafe(rawText);
    if (!res.ok) {
      const msg = payload && payload.error && payload.error.message
        ? String(payload.error.message)
        : (rawText || `Gemini HTTP ${res.status}`);
      const err = new Error(msg);
      err.status = 502;
      throw err;
    }

    const answer = extractGeminiText(payload);
    if (!answer) {
      const err = new Error("Gemini no devolvio contenido util");
      err.status = 502;
      throw err;
    }
    return { model, answer };
  } finally {
    clearTimeout(timeout);
  }
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
    const { legacyId, recordType, registroTipo } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const andFilters = [];
    if (legacyId) andFilters.push({ legacyId: String(legacyId) });
    const typeFilter = recordType || registroTipo;
    if (typeFilter) {
      const t = String(typeFilter);
      andFilters.push({
        OR: [
          { recordType: t },
          {
            recordType: null,
            data: { path: ["registroTipo"], equals: t }
          }
        ]
      });
    }
    if (scope.role !== "admin" && scope.district) {
      andFilters.push({
        OR: [
          { district: scope.district },
          {
            district: null,
            data: { path: ["distrito"], equals: scope.district }
          }
        ]
      });
    }
    const where = andFilters.length ? { AND: andFilters } : {};
    const items = await prisma.project.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/projects", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { name, year, startDate, endDate, legacyId, district, data } = req.body || {};
    const recordType = getRecordTypeFromBody(req.body || {});
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
          recordType,
          data: data ?? undefined
        },
        create: {
          legacyId: String(legacyId),
          name: String(name),
          year: toNumber(year) ?? undefined,
          startDate: toDate(startDate) ?? undefined,
          endDate: toDate(endDate) ?? undefined,
          district: enforcedDistrict,
          recordType,
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
        recordType,
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
    const recordType = getRecordTypeFromBody(req.body || {});
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
        recordType: recordType ?? undefined,
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

// Interventions (acciones del plan)
function normalizeInterventionPayload(body) {
  const startRaw = body.startDate || body.fechaInicio || body.fecha_inicio;
  const endRaw = body.endDate || body.fechaFin || body.fecha_fin;
  return {
    planId: String(body.planId || ""),
    name: String(body.name || body.actionName || "Intervencion"),
    actionId: body.actionId ? String(body.actionId) : undefined,
    actionName: body.actionName ? String(body.actionName) : undefined,
    projectId: body.projectId ? String(body.projectId) : undefined,
    projectName: body.projectName ? String(body.projectName) : undefined,
    amount: toNumber(body.amount) ?? 0,
    phase: String(body.phase || "planificacion"),
    startDate: toDate(startRaw) ?? undefined,
    endDate: toDate(endRaw) ?? undefined
  };
}

async function validarPresupuestoPlan({ ownerKey, year, amount, excludePlanId }) {
  if (!ownerKey || !year) {
    return { ok: false, message: "ownerKey y year son requeridos" };
  }
  const budget = await prisma.annualBudget.findUnique({
    where: { ownerKey_year: { ownerKey, year } }
  });
  if (!budget || !Number.isFinite(budget.total) || budget.total <= 0) {
    return { ok: false, message: "Presupuesto anual no definido" };
  }
  const sum = await prisma.plan.aggregate({
    where: {
      ownerKey,
      year,
      ...(excludePlanId ? { NOT: { id: excludePlanId } } : {})
    },
    _sum: { amount: true }
  });
  const used = Number(sum._sum.amount || 0);
  const available = Math.max(0, Number(budget.total) - used);
  if (Number(amount || 0) > available) {
    return { ok: false, message: "El monto del plan excede el presupuesto anual disponible", available };
  }
  return { ok: true, available };
}

app.get("/interventions", authRequired, async (req, res, next) => {
  try {
    const { planId, ownerKey } = req.query || {};
    const scope = getScopeFromUser(req.user || {});
    const where = {};
    if (planId) where.planId = String(planId);
    if (scope.role === "admin") {
      if (ownerKey) where.plan = { ownerKey: String(ownerKey) };
    } else if (scope.scopeKey) {
      where.plan = { ownerKey: scope.scopeKey };
    }
    const items = await prisma.intervention.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

app.post("/interventions", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const payload = normalizeInterventionPayload(req.body || {});
    if (!payload.planId) return res.status(400).json({ error: "planId is required" });
    const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && plan.ownerKey !== scope.scopeKey) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const created = await prisma.intervention.create({ data: payload });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

app.put("/interventions/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = normalizeInterventionPayload(req.body || {});
    const current = await prisma.intervention.findUnique({
      where: { id },
      include: { plan: true }
    });
    if (!current) return res.status(404).json({ error: "Intervention not found" });
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && current.plan && current.plan.ownerKey !== scope.scopeKey) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const updated = await prisma.intervention.update({
      where: { id },
      data: {
        name: payload.name || undefined,
        actionId: payload.actionId ?? undefined,
        actionName: payload.actionName ?? undefined,
        projectId: payload.projectId ?? undefined,
        projectName: payload.projectName ?? undefined,
        amount: payload.amount ?? undefined,
        phase: payload.phase || undefined,
        startDate: payload.startDate ?? undefined,
        endDate: payload.endDate ?? undefined
      }
    });
    res.json(updated);
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Intervention not found" });
    }
    next(err);
  }
});

app.delete("/interventions/:id", authRequired, requireRole(["admin", "municipal"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await prisma.intervention.findUnique({
      where: { id },
      include: { plan: true }
    });
    if (!current) return res.status(404).json({ error: "Intervention not found" });
    const scope = getScopeFromUser(req.user || {});
    if (scope.role !== "admin" && current.plan && current.plan.ownerKey !== scope.scopeKey) {
      return res.status(403).json({ error: "No autorizado" });
    }
    await prisma.intervention.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err && err.code === "P2025") {
      return res.status(404).json({ error: "Intervention not found" });
    }
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
    if (!payload.year) return res.status(400).json({ error: "year is required" });
    const budgetCheck = await validarPresupuestoPlan({
      ownerKey: enforcedOwnerKey,
      year: payload.year,
      amount: payload.amount
    });
    if (!budgetCheck.ok) {
      return res.status(400).json({ error: budgetCheck.message, available: budgetCheck.available });
    }
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
    const availableAfter = Math.max(0, Number(budgetCheck.available || 0) - Number(payload.amount || 0));
    res.status(201).json({ plan: created, available: availableAfter });
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
    const nextYear = payload.year || current.year;
    const nextAmount = payload.amount ?? current.amount;
    const nextOwnerKey = scope.role === "admin" ? (payload.ownerKey || current.ownerKey) : current.ownerKey;
    const budgetCheck = await validarPresupuestoPlan({
      ownerKey: nextOwnerKey,
      year: nextYear,
      amount: nextAmount,
      excludePlanId: id
    });
    if (!budgetCheck.ok) {
      return res.status(400).json({ error: budgetCheck.message, available: budgetCheck.available });
    }
    const updated = await prisma.plan.update({
      where: { id },
      data: {
        ownerKey: nextOwnerKey,
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
    const availableAfter = Math.max(0, Number(budgetCheck.available || 0) - Number(nextAmount || 0));
    res.json({ plan: updated, available: availableAfter });
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

// AI presupuesto (Gemini)
app.post("/ai/presupuesto-chat", authRequired, async (req, res, next) => {
  try {
    const query = String(req.body && req.body.query || "").trim();
    if (!query) {
      return res.status(400).json({ error: "query es requerido" });
    }

    const scope = getScopeFromUser(req.user || {});
    const ownerKeyInput = req.body && req.body.ownerKey ? String(req.body.ownerKey) : "";
    const ownerKey = scope.role === "admin"
      ? (ownerKeyInput || scope.scopeKey || "")
      : (scope.scopeKey || "");

    const assetWhere = {};
    const reportWhere = {};
    if (scope.role !== "admin" && scope.district) {
      assetWhere.district = scope.district;
      reportWhere.district = scope.district;
    } else if (req.body && req.body.district) {
      const district = String(req.body.district);
      assetWhere.district = district;
      reportWhere.district = district;
    }

    const planWhere = ownerKey ? { ownerKey } : undefined;
    const budgetWhere = ownerKey ? { ownerKey } : undefined;

    const [assets, reports, plans, budgets] = await Promise.all([
      prisma.asset.findMany({
        where: assetWhere,
        select: { type: true, state: true, statePhysical: true, district: true, price: true }
      }),
      prisma.report.findMany({
        where: reportWhere,
        select: { type: true, status: true, district: true, createdAt: true }
      }),
      prisma.plan.findMany({
        where: planWhere,
        orderBy: { year: "desc" },
        take: 8,
        select: { id: true, name: true, year: true, amount: true, executed: true, status: true }
      }),
      prisma.annualBudget.findMany({
        where: budgetWhere,
        orderBy: { year: "desc" },
        take: 5,
        select: { year: true, total: true }
      })
    ]);

    const activosPorTipo = countBy(assets, (a) => a.type || "sin_tipo");
    const reportesPorTipo = countBy(reports, (r) => r.type || "sin_tipo");
    const reportesPorEstado = countBy(reports, (r) => r.status || "sin_estado");
    const reportesPorDistrito = countBy(reports, (r) => r.district || "sin_distrito");
    const topDistritos = Object.entries(reportesPorDistrito)
      .map(([district, count]) => ({ district, count: Number(count) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const inversionBase = req.body && req.body.inversionBase && typeof req.body.inversionBase === "object"
      ? req.body.inversionBase
      : null;
    const inversionOverride = req.body && req.body.override && typeof req.body.override === "object"
      ? req.body.override
      : null;
    const preference = req.body && req.body.preference ? String(req.body.preference) : "";

    const context = {
      fecha: new Date().toISOString().slice(0, 10),
      alcance: {
        role: scope.role || "",
        district: scope.district || "",
        region: scope.region || "",
        ownerKey: ownerKey || ""
      },
      resumen: {
        totalActivos: assets.length,
        totalReportes: reports.length,
        activosPorTipo,
        reportesPorTipo,
        reportesPorEstado,
        topDistritos
      },
      inversion: {
        presupuestoReciente: budgets.map((b) => ({ year: b.year, total: Number(b.total || 0) })),
        planesRecientes: plans.map((p) => ({
          id: p.id,
          name: p.name,
          year: p.year,
          amount: Number(p.amount || 0),
          executed: Number(p.executed || 0),
          status: p.status
        })),
        montoPlanificado: sumBy(plans, (p) => p.amount),
        montoEjecutado: sumBy(plans, (p) => p.executed),
        preferenciaUsuario: preference || "",
        snapshotFrontend: inversionBase ? {
          total: Number(inversionBase.total || 0),
          operativos: Number(inversionBase.sumOper || 0),
          deteriorados: Number(inversionBase.sumDet || 0),
          reposicion: Number(inversionBase.sumRepo || 0)
        } : null,
        escenarioFrontend: inversionOverride ? {
          total: Number(inversionOverride.total || 0),
          operativos: Number(inversionOverride.operativos || 0),
          deteriorados: Number(inversionOverride.deteriorados || 0),
          reposicion: Number(inversionOverride.reposicion || 0),
          preferencia: inversionOverride.pref ? String(inversionOverride.pref) : ""
        } : null
      }
    };

    const contextJson = JSON.stringify(context, null, 2);
    const ai = await consultarGeminiPresupuesto({
      prompt: query,
      contextJson
    });

    res.json({
      answer: ai.answer,
      model: ai.model,
      stats: {
        totalActivos: assets.length,
        totalReportes: reports.length,
        distritosAnalizados: topDistritos.length
      }
    });
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
  const status = Number(err && err.status) || 500;
  const expose = !!(err && (err.expose || status < 500 || status === 502 || status === 503));
  const message = expose
    ? String((err && err.message) || "Error")
    : "Internal server error";
  const payload = { error: message };
  if (err && err.code) payload.code = String(err.code);
  res.status(status).json(payload);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
