import { products } from "../config/products.js";
import { GG_PRODUCT_MAP_DEFAULT } from "../config/gg-catalog.js";

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function firstDefined(obj, paths) {
  for (const path of paths) {
    const value = getByPath(obj, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
}

function normalizeStatus(rawStatus, rawEvent) {
  const status = String(rawStatus || "").toLowerCase();
  const event = String(rawEvent || "").toLowerCase();

  if (
    ["approved", "paid", "completed", "authorized", "confirmed"].includes(status) ||
    ["purchase_approved", "order.paid", "payment.approved", "sale.approved"].includes(event)
  ) {
    return "approved";
  }

  if (
    ["refunded", "refund", "chargeback", "canceled", "cancelled"].includes(status) ||
    ["payment.refunded", "sale.refunded", "sale.chargeback", "subscription.canceled"].includes(event)
  ) {
    return "refunded";
  }

  if (["pending", "waiting_payment", "processing"].includes(status)) {
    return "pending";
  }

  return status || "pending";
}

function loadProductMap() {
  const envRaw = process.env.GG_PRODUCT_MAP || "";
  try {
    const envMap = envRaw ? JSON.parse(envRaw) : {};
    return { ...GG_PRODUCT_MAP_DEFAULT, ...envMap };
  } catch {
    return { ...GG_PRODUCT_MAP_DEFAULT };
  }
}

export function normalizeGgCheckoutWebhook(body) {
  const eventId = String(
    firstDefined(body, ["eventId", "event_id", "id", "data.id", "data.order_id"]) || ""
  );
  const eventType = String(
    firstDefined(body, ["event", "event_type", "type", "data.event", "data.type"]) || ""
  );
  const email = String(
    firstDefined(body, [
      "email",
      "customer.email",
      "buyer.email",
      "data.customer.email",
      "data.buyer.email"
    ]) || ""
  ).toLowerCase();

  const rawProductSlug = firstDefined(body, [
    "productSlug",
    "product.slug",
    "data.product.slug",
    "metadata.productSlug",
    "custom_data.product_slug"
  ]);
  const productId = String(
    firstDefined(body, ["product.id", "data.product.id", "productId", "data.productId"]) || ""
  );
  const productMap = loadProductMap();
  const internalProduct = products.find((product) => product.id === productId);
  const productSlug = String(rawProductSlug || productMap[productId] || internalProduct?.slug || "").trim();

  const rawStatus = firstDefined(body, ["status", "order_status", "data.status", "payment.status"]);
  const status = normalizeStatus(rawStatus, eventType);

  return { eventId, eventType, status, email, productSlug };
}
