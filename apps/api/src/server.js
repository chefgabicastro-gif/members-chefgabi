import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { requireAuth } from "./lib/auth.js";
import {
  createOrGetUserByEmail,
  createSession,
  findUserByEmail,
  getBillingHistory,
  getHomeRows,
  getProgressByProduct,
  getUserProfile,
  grantEntitlement,
  hasWebhookEvent,
  listEntitlementsForUser,
  listProductsForUser,
  listUsers,
  listWebhookEvents,
  revokeEntitlement,
  saveWebhookEvent,
  upsertLessonProgress
} from "./lib/db.js";
import { products } from "./config/products.js";
import { normalizeGgCheckoutWebhook } from "./integrations/gg-checkout.js";
import { getCheckoutUrl } from "./config/checkout.js";
import { getAccessLink } from "./config/access-links.js";
import { buildProductContent } from "./config/content.js";
import { getProductWorkspace } from "./config/product-workspaces.js";

const app = express();
const PORT = process.env.PORT || 4000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "dev_webhook_secret";
const GG_WEBHOOK_SECRET = process.env.GG_WEBHOOK_SECRET || "";
const ADMIN_KEY = process.env.ADMIN_KEY || "dev_admin_key";
const envOrigins = (process.env.WEB_ORIGIN || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const allowAllOrigins = envOrigins.includes("*");
const allowedOrigins = new Set([
  "https://members.chefgabriellacastro.site",
  "https://chefgabi-members-web.onrender.com",
  ...envOrigins
]);

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
  res.json({ status: "ok", service: "members-api", time: new Date().toISOString() });
});

app.post("/api/v1/auth/login", (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = createOrGetUserByEmail(email.trim().toLowerCase());
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
  // eslint-disable-next-line no-console
  console.log(`Members API running on port ${PORT}`);
});
