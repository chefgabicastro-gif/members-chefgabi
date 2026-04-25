import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { requireAuth } from "./lib/auth.js";
import {
  createOrGetUserByEmail,
  createSession,
  deleteContentItem,
  findUserByEmail,
  findContentItemById,
  getBillingHistory,
  getHomeRows,
  getProgressByProduct,
  getUserProfile,
  grantEntitlement,
  hasWebhookEvent,
  listContentItems,
  listEntitlementsForUser,
  listProductsForUser,
  listUsers,
  listWebhookEvents,
  revokeEntitlement,
  saveWebhookEvent,
  upsertContentItem,
  upsertLessonProgress
} from "./lib/db.js";
import { products } from "./config/products.js";
import { normalizeGgCheckoutWebhook } from "./integrations/gg-checkout.js";
import { getCheckoutUrl } from "./config/checkout.js";
import { getAccessLink } from "./config/access-links.js";
import { buildProductContent } from "./config/content.js";
import { getProductWorkspace } from "./config/product-workspaces.js";
import { devotionalConfig, validateSchedule } from "./config/devotional.js";
import {
  deactivateDevotionalSubscriber,
  findDevotionalSubscriberByPhone,
  upsertDevotionalSubscriber
} from "./lib/db.js";
import { ensureWhatsAppNumber } from "./integrations/evolution.js";
import { getDevotionalStatus, runDevotionalDispatch } from "./services/devotional-service.js";
import { startDevotionalScheduler } from "./services/devotional-scheduler.js";
import {
  connectEvolutionInstance,
  createEvolutionInstance,
  deleteEvolutionInstance,
  fetchEvolutionConnectionState,
  fetchEvolutionInstances,
  logoutEvolutionInstance,
  restartEvolutionInstance,
  selectActiveEvolutionInstance
} from "./services/evolution-instance-service.js";

const app = express();
const PORT = process.env.PORT || 4000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "dev_webhook_secret";
const GG_WEBHOOK_SECRET = process.env.GG_WEBHOOK_SECRET || "";
const ADMIN_KEY = process.env.ADMIN_KEY || "dev_admin_key";
const DEFAULT_AUTO_GRANT_MAP = {
  "ribeiro.freire3@gmail.com": "brownie-upsell"
};
const envOrigins = (process.env.WEB_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const allowAllOrigins = envOrigins.includes("*");
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
  "https://members.chefgabriellacastro.site",
  "https://members-chefgabi-web.onrender.com",
  "https://chefgabi-members-web.onrender.com",
  ...envOrigins
]);

function loadAutoGrantMap() {
  const raw = process.env.AUTO_GRANT_EMAILS || "";
  if (!raw) return { ...DEFAULT_AUTO_GRANT_MAP };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { ...DEFAULT_AUTO_GRANT_MAP };
    }
    return { ...DEFAULT_AUTO_GRANT_MAP, ...parsed };
  } catch {
    return { ...DEFAULT_AUTO_GRANT_MAP };
  }
}

function getAutoGrantProductSlug(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;
  const map = loadAutoGrantMap();
  const slug = map[normalized];
  return typeof slug === "string" ? slug : null;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowAllOrigins) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    }
  })
);
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString("utf8");
    }
  })
);

function safeEqual(a, b) {
  const first = Buffer.from(String(a || ""));
  const second = Buffer.from(String(b || ""));
  if (first.length !== second.length) {
    return false;
  }
  return crypto.timingSafeEqual(first, second);
}

function isValidGgSignature(req) {
  if (!GG_WEBHOOK_SECRET) {
    return true;
  }

  const raw = req.rawBody || "";
  const provided =
    req.headers["x-gg-signature"] ||
    req.headers["x-signature"] ||
    req.headers["x-webhook-secret"] ||
    "";
  const expectedHex = crypto.createHmac("sha256", GG_WEBHOOK_SECRET).update(raw).digest("hex");
  const normalizedProvided = String(provided).replace(/^sha256=/i, "");

  return safeEqual(normalizedProvided, expectedHex) || safeEqual(provided, GG_WEBHOOK_SECRET);
}

function parseWebhookPayload(provider, body) {
  if (provider === "gg-checkout") {
    return normalizeGgCheckoutWebhook(body);
  }

  const { eventId, status, email, productSlug } = body || {};
  return { eventId, status: String(status || "").toLowerCase(), email, productSlug };
}

function entitlementChain(productSlug) {
  if (productSlug === "brownie-upsell") return ["brownie-basico", "brownie-pro", "brownie-upsell"];
  if (productSlug === "brownie-pro") return ["brownie-basico", "brownie-pro"];
  return [productSlug];
}

function grantProductChain({ userId, productSlug, source }) {
  const chain = entitlementChain(productSlug);
  chain.forEach((slug, index) => {
    grantEntitlement({
      userId,
      productSlug: slug,
      source: index === 0 ? source : `${source}:derived`,
      recordBilling: slug === productSlug
    });
  });
}

function revokeProductChain({ userId, productSlug, source }) {
  const chain = entitlementChain(productSlug);
  chain.forEach((slug, index) => {
    revokeEntitlement({
      userId,
      productSlug: slug,
      source: index === 0 ? source : `${source}:derived`
    });
  });
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "members-api",
    time: new Date().toISOString(),
    devotional: {
      enabled: devotionalConfig.enabled,
      timezone: devotionalConfig.timezone,
      schedule: devotionalConfig.schedule
    }
  });
});

app.post("/api/v1/auth/login", (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = createOrGetUserByEmail(email.trim().toLowerCase());
  const autoGrantSlug = getAutoGrantProductSlug(user.email);
  if (autoGrantSlug) {
    const userProducts = listProductsForUser(user.id);
    const alreadyUnlocked = userProducts.find((item) => item.slug === autoGrantSlug)?.isUnlocked;
    if (!alreadyUnlocked) {
      grantProductChain({
        userId: user.id,
        productSlug: autoGrantSlug,
        source: "auto_grant_login"
      });
    }
  }
  const token = createSession(user.id);
  return res.json({ token, user });
});

app.get("/api/v1/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/v1/products", requireAuth, (req, res) => {
  const items = listProductsForUser(req.user.id);
  res.json({ products: items });
});

app.get("/api/v1/products/search", requireAuth, (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const items = listProductsForUser(req.user.id);
  if (!q) {
    return res.json({ products: items.slice(0, 12) });
  }
  const words = q.split(/\s+/).filter(Boolean);
  const scored = items
    .map((item) => {
      const hay = `${item.title} ${item.tagline || ""} ${item.description || ""} ${item.category || ""}`.toLowerCase();
      const score = words.reduce((acc, word) => acc + (hay.includes(word) ? 1 : 0), 0);
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.item.isUnlocked) - Number(a.item.isUnlocked));
  return res.json({ products: scored.map((entry) => entry.item) });
});

app.get("/api/v1/products/:productSlug/access", requireAuth, (req, res) => {
  const productSlug = req.params.productSlug;
  const items = listProductsForUser(req.user.id);
  const product = items.find((item) => item.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (!product.isUnlocked) {
    return res.status(403).json({ error: "Product is locked for this user" });
  }

  const accessUrl = getAccessLink(productSlug);
  if (!accessUrl) {
    return res.status(404).json({
      error: "Access URL not configured for this product",
      productSlug
    });
  }

  return res.json({ accessUrl, productSlug });
});

app.get("/api/v1/products/:productSlug/workspace", requireAuth, (req, res) => {
  const productSlug = req.params.productSlug;
  const items = listProductsForUser(req.user.id);
  const product = items.find((item) => item.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (!product.isUnlocked) {
    return res.status(403).json({ error: "Product is locked for this user" });
  }

  const workspace = getProductWorkspace(productSlug);
  return res.json({
    product: {
      slug: product.slug,
      title: product.title,
      plan: product.tagline || product.level || null
    },
    workspace
  });
});

app.get("/api/v1/products/:productSlug/content", requireAuth, (req, res) => {
  const productSlug = req.params.productSlug;
  const items = listProductsForUser(req.user.id);
  const product = items.find((item) => item.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (!product.isUnlocked) {
    return res.status(403).json({ error: "Product is locked for this user" });
  }

  const content = buildProductContent(productSlug);
  if (!content) {
    return res.status(404).json({ error: "Content not found for this product" });
  }

  const externalAccessUrl = getAccessLink(productSlug);
  const lessonProgress = getProgressByProduct(req.user.id, productSlug);
  const workspace = getProductWorkspace(productSlug);
  return res.json({ ...content, externalAccessUrl, lessonProgress, workspace });
});

app.get("/api/v1/content-items", requireAuth, (_req, res) => {
  const items = listContentItems({ includeDrafts: false });
  return res.json({ items });
});

app.get("/api/v1/profile/me", requireAuth, (req, res) => {
  const profile = getUserProfile(req.user.id);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  return res.json(profile);
});

app.get("/api/v1/billing/history", requireAuth, (req, res) => {
  const limit = Number(req.query.limit || 20);
  const items = getBillingHistory(req.user.id, Math.min(Math.max(limit, 1), 200));
  return res.json({ items });
});

app.put("/api/v1/progress/:lessonId", requireAuth, (req, res) => {
  const lessonId = req.params.lessonId;
  const { productSlug, watchedPercent, completed } = req.body || {};
  if (!productSlug || typeof productSlug !== "string") {
    return res.status(400).json({ error: "productSlug is required" });
  }
  upsertLessonProgress({
    userId: req.user.id,
    productSlug,
    lessonId,
    watchedPercent: Number(watchedPercent || 0),
    completed: Boolean(completed)
  });
  return res.json({ success: true });
});

app.get("/api/v1/home/rows", requireAuth, (req, res) => {
  const rows = getHomeRows(req.user.id);
  res.json({ rows });
});

app.get("/api/v1/entitlements/me", requireAuth, (req, res) => {
  const entitlements = listEntitlementsForUser(req.user.id);
  res.json({ entitlements });
});

app.get("/api/v1/checkout/url/:productSlug", requireAuth, (req, res) => {
  const productSlug = req.params.productSlug;
  const product = products.find((item) => item.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const checkoutUrl = getCheckoutUrl(productSlug, req.user.email);
  if (!checkoutUrl) {
    return res.status(404).json({
      error: "Checkout URL not configured for this product",
      productSlug
    });
  }

  return res.json({ checkoutUrl, productSlug });
});

app.post("/api/v1/admin/entitlements/grant", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const { email, productSlug } = req.body || {};
  if (!email || !productSlug) {
    return res.status(400).json({ error: "email and productSlug are required" });
  }

  const user = createOrGetUserByEmail(String(email).toLowerCase());
  const product = products.find((p) => p.slug === productSlug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  grantProductChain({ userId: user.id, productSlug, source: "admin_manual" });
  return res.json({ success: true, userId: user.id, productSlug });
});

app.post("/api/v1/admin/entitlements/revoke", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const { email, productSlug } = req.body || {};
  if (!email || !productSlug) {
    return res.status(400).json({ error: "email and productSlug are required" });
  }

  const user = findUserByEmail(String(email).toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  revokeProductChain({ userId: user.id, productSlug, source: "admin_manual_revoke" });
  return res.json({ success: true, userId: user.id, productSlug });
});

app.get("/api/v1/admin/users", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }
  const limit = Number(req.query.limit || 100);
  const users = listUsers(Math.min(Math.max(limit, 1), 500));
  return res.json({ users });
});

app.get("/api/v1/admin/users/:email/entitlements", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }
  const email = decodeURIComponent(req.params.email || "").toLowerCase();
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const entitlements = listEntitlementsForUser(user.id);
  return res.json({ user, entitlements });
});

app.get("/api/v1/admin/webhooks/events", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }
  const limit = Number(req.query.limit || 50);
  const items = listWebhookEvents(Math.min(Math.max(limit, 1), 200));
  return res.json({ events: items });
});

app.post("/api/v1/devotional/subscribers", (req, res) => {
  try {
    const { phone, name, notes, timezone, schedule, isActive, source } = req.body || {};
    if (!phone) {
      return res.status(400).json({ error: "phone is required" });
    }

    const normalizedPhone = ensureWhatsAppNumber(phone);
    const finalSchedule =
      Array.isArray(schedule) && schedule.length > 0 ? schedule : devotionalConfig.schedule;
    if (!validateSchedule(finalSchedule)) {
      return res.status(400).json({ error: "schedule must use HH:MM format" });
    }

    const subscriber = upsertDevotionalSubscriber({
      phone: normalizedPhone,
      name,
      notes,
      timezone: timezone || devotionalConfig.timezone,
      schedule: finalSchedule,
      isActive: typeof isActive === "boolean" ? isActive : true,
      source: source || "api"
    });

    return res.status(201).json({ subscriber });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid subscriber payload" });
  }
});

app.get("/api/v1/devotional/subscribers/:phone", (req, res) => {
  try {
    const normalizedPhone = ensureWhatsAppNumber(req.params.phone);
    const subscriber = findDevotionalSubscriberByPhone(normalizedPhone);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    return res.json({ subscriber });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid phone" });
  }
});

app.delete("/api/v1/devotional/subscribers/:phone", (req, res) => {
  try {
    const normalizedPhone = ensureWhatsAppNumber(req.params.phone);
    const subscriber = deactivateDevotionalSubscriber(normalizedPhone);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    return res.json({ subscriber });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid phone" });
  }
});

app.get("/api/v1/admin/devotional/status", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }
  return res.json(getDevotionalStatus());
});

app.get("/api/v1/admin/content-items", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }
  return res.json({ items: listContentItems({ includeDrafts: true }) });
});

app.post("/api/v1/admin/content-items", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const title = String(req.body?.title || "").trim();
  const type = String(req.body?.type || "").trim();
  if (!title || !type) {
    return res.status(400).json({ error: "title and type are required" });
  }

  const item = upsertContentItem(req.body || {});
  return res.status(201).json({ item });
});

app.put("/api/v1/admin/content-items/:contentId", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const existing = findContentItemById(req.params.contentId);
  if (!existing) {
    return res.status(404).json({ error: "Content item not found" });
  }

  const item = upsertContentItem({
    ...existing,
    ...(req.body || {}),
    id: existing.id
  });
  return res.json({ item });
});

app.delete("/api/v1/admin/content-items/:contentId", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const removed = deleteContentItem(req.params.contentId);
  if (!removed) {
    return res.status(404).json({ error: "Content item not found" });
  }

  return res.json({ success: true, removed });
});

app.get("/api/v1/admin/devotional/evolution/instances", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const instances = await fetchEvolutionInstances();
    return res.json({ instances, activeInstance: getDevotionalStatus().activeEvolutionInstance });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch Evolution instances" });
  }
});

app.post("/api/v1/admin/devotional/evolution/instances", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const instanceName = String(req.body?.instanceName || "").trim();
  const number = String(req.body?.number || "").trim();
  const token = String(req.body?.token || "").trim();
  if (!instanceName) {
    return res.status(400).json({ error: "instanceName is required" });
  }

  try {
    const created = await createEvolutionInstance({ instanceName, number, token });
    selectActiveEvolutionInstance(instanceName);
    return res.status(201).json({ created, activeInstance: instanceName });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to create Evolution instance" });
  }
});

app.post("/api/v1/admin/devotional/evolution/instances/:instanceName/select", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  const instanceName = String(req.params.instanceName || "").trim();
  if (!instanceName) {
    return res.status(400).json({ error: "instanceName is required" });
  }

  const settings = selectActiveEvolutionInstance(instanceName);
  return res.json({ success: true, settings });
});

app.get("/api/v1/admin/devotional/evolution/instances/:instanceName/state", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const state = await fetchEvolutionConnectionState(req.params.instanceName);
    return res.json({ state });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch Evolution state" });
  }
});

app.post("/api/v1/admin/devotional/evolution/instances/:instanceName/connect", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const phone = req.body?.number ? ensureWhatsAppNumber(req.body.number) : "";
    const qr = await connectEvolutionInstance(req.params.instanceName, phone);
    return res.json({ qr });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to connect Evolution instance" });
  }
});

app.post("/api/v1/admin/devotional/evolution/instances/:instanceName/restart", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const result = await restartEvolutionInstance(req.params.instanceName);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to restart Evolution instance" });
  }
});

app.post("/api/v1/admin/devotional/evolution/instances/:instanceName/logout", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const result = await logoutEvolutionInstance(req.params.instanceName);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to logout Evolution instance" });
  }
});

app.delete("/api/v1/admin/devotional/evolution/instances/:instanceName", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const result = await deleteEvolutionInstance(req.params.instanceName);
    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to delete Evolution instance" });
  }
});

app.post("/api/v1/admin/devotional/send-now", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized admin key" });
  }

  try {
    const phone = req.body?.phone ? ensureWhatsAppNumber(req.body.phone) : null;
    const slot = req.body?.slot ? String(req.body.slot) : null;
    if (slot && !/^\d{2}:\d{2}$/.test(slot)) {
      return res.status(400).json({ error: "slot must use HH:MM format" });
    }

    const result = await runDevotionalDispatch({
      forceSlot: slot,
      targetPhone: phone
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected devotional error" });
  }
});

app.post("/api/v1/webhooks/:provider", (req, res) => {
  const provider = req.params.provider;
  const signature = req.headers["x-webhook-secret"];

  if (provider === "gg-checkout") {
    if (!isValidGgSignature(req)) {
      return res.status(401).json({ error: "Invalid GG webhook signature" });
    }
  } else if (signature !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  const { eventId, status, email, productSlug } = parseWebhookPayload(provider, req.body || {});
  if (!eventId || !status || !email || !productSlug) {
    return res
      .status(400)
      .json({
        error: "Unable to normalize webhook payload: eventId, status, email and productSlug are required"
      });
  }

  if (hasWebhookEvent(provider, eventId)) {
    return res.status(200).json({ success: true, deduplicated: true });
  }

  saveWebhookEvent({ provider, eventId, payload: req.body });
  const user = createOrGetUserByEmail(String(email).toLowerCase());

  if (["approved", "paid"].includes(String(status).toLowerCase())) {
    grantProductChain({ userId: user.id, productSlug, source: `${provider}:${eventId}` });
  }

  if (["refunded", "chargeback", "canceled", "cancelled"].includes(String(status).toLowerCase())) {
    revokeProductChain({ userId: user.id, productSlug, source: `${provider}:${eventId}` });
  }

  return res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  startDevotionalScheduler();
  // eslint-disable-next-line no-console
  console.log(`Members API running on port ${PORT}`);
});
