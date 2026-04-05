import { GG_CHECKOUT_LINKS_DEFAULT } from "./gg-catalog.js";

function loadCheckoutMap() {
  const envRaw = process.env.GG_CHECKOUT_LINKS || "";
  try {
    const envMap = envRaw ? JSON.parse(envRaw) : {};
    return { ...GG_CHECKOUT_LINKS_DEFAULT, ...envMap };
  } catch {
    return { ...GG_CHECKOUT_LINKS_DEFAULT };
  }
}

export function getCheckoutUrl(productSlug, email) {
  const map = loadCheckoutMap();
  const baseUrl = map[productSlug] || "";
  if (!baseUrl) {
    return null;
  }

  const hasQuery = baseUrl.includes("?");
  const separator = hasQuery ? "&" : "?";
  const encodedEmail = encodeURIComponent(String(email || "").toLowerCase());
  return `${baseUrl}${separator}email=${encodedEmail}`;
}
