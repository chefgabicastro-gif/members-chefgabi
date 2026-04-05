import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { products } from "../config/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../../data/db.json");

const initialDb = {
  users: [],
  sessions: [],
  entitlements: [],
  webhookEvents: [],
  products
};

function ensureDb() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(dbPath, "utf8");
  const db = JSON.parse(raw);
  const catalogChanged =
    !Array.isArray(db.products) ||
    db.products.length !== products.length ||
    db.products.some((item) => !products.find((source) => source.slug === item.slug));

  if (catalogChanged) {
    db.products = products;
    writeDb(db);
  }

  return db;
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function createOrGetUserByEmail(email) {
  const db = readDb();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);
  }
  return user;
}

export function createSession(userId) {
  const db = readDb();
  const token = crypto.randomBytes(24).toString("hex");
  db.sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString()
  });
  writeDb(db);
  return token;
}

export function findUserByToken(token) {
  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) {
    return null;
  }
  return db.users.find((u) => u.id === session.userId) ?? null;
}

export function listProductsForUser(userId) {
  const db = readDb();
  return db.products.map((product) => {
    const entitlement = db.entitlements.find(
      (e) => e.userId === userId && e.productSlug === product.slug && e.status === "active"
    );
    return {
      ...product,
      isUnlocked: Boolean(entitlement)
    };
  });
}

export function getHomeRows(userId) {
  const items = listProductsForUser(userId);
  const unlocked = items.filter((p) => p.isUnlocked);
  const locked = items.filter((p) => !p.isUnlocked);
  return [
    { id: "unlocked", title: "Liberados para voce", items: unlocked },
    { id: "locked", title: "Desbloqueie agora", items: locked }
  ];
}

export function grantEntitlement({ userId, productSlug, source }) {
  const db = readDb();
  const existing = db.entitlements.find(
    (e) => e.userId === userId && e.productSlug === productSlug
  );

  if (existing) {
    existing.status = "active";
    existing.source = source;
    existing.updatedAt = new Date().toISOString();
  } else {
    db.entitlements.push({
      id: crypto.randomUUID(),
      userId,
      productSlug,
      status: "active",
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  writeDb(db);
}

export function revokeEntitlement({ userId, productSlug, source }) {
  const db = readDb();
  const existing = db.entitlements.find(
    (e) => e.userId === userId && e.productSlug === productSlug
  );
  if (existing) {
    existing.status = "revoked";
    existing.source = source;
    existing.updatedAt = new Date().toISOString();
    writeDb(db);
  }
}

export function hasWebhookEvent(provider, eventId) {
  const db = readDb();
  return db.webhookEvents.some((e) => e.provider === provider && e.eventId === eventId);
}

export function saveWebhookEvent({ provider, eventId, payload }) {
  const db = readDb();
  db.webhookEvents.push({
    id: crypto.randomUUID(),
    provider,
    eventId,
    payload,
    createdAt: new Date().toISOString()
  });
  writeDb(db);
}

export function listEntitlementsForUser(userId) {
  const db = readDb();
  return db.entitlements.filter((e) => e.userId === userId);
}

export function listWebhookEvents(limit = 50) {
  const db = readDb();
  return db.webhookEvents.slice(-limit).reverse();
}
