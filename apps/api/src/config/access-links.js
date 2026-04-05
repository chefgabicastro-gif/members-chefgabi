const DEFAULT_ACCESS_LINKS = {};

function loadAccessLinksMap() {
  const envRaw = process.env.PRODUCT_ACCESS_LINKS || "";
  try {
    const envMap = envRaw ? JSON.parse(envRaw) : {};
    return { ...DEFAULT_ACCESS_LINKS, ...envMap };
  } catch {
    return { ...DEFAULT_ACCESS_LINKS };
  }
}

export function getAccessLink(productSlug) {
  const map = loadAccessLinksMap();
  return map[productSlug] || null;
}

