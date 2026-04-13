const DEFAULT_PRODUCT_WORKSPACES = {
  "brownie-basico": {
    areaDeMembros: "https://browniexpress.lovable.app/",
    materialExtra: "https://drive.google.com/drive/folders/1K39vt9BSN1eorXSFACoh2XCOiaWraIsD?usp=drive_link",
    networking: "https://chat.whatsapp.com/LmYYTy6HORE5Z9xCNaAA48"
  },
  "brownie-pro": {
    areaDeMembros: "https://browniexpress.lovable.app/",
    materialExtra: "https://drive.google.com/drive/folders/1K39vt9BSN1eorXSFACoh2XCOiaWraIsD?usp=drive_link",
    networking: "https://chat.whatsapp.com/LmYYTy6HORE5Z9xCNaAA48"
  },
  "brownie-upsell": {
    areaDeMembros: "https://browniexpress.lovable.app/",
    materialExtra: "https://drive.google.com/drive/folders/1K39vt9BSN1eorXSFACoh2XCOiaWraIsD?usp=drive_link",
    networking: "https://chat.whatsapp.com/LmYYTy6HORE5Z9xCNaAA48"
  }
};

function loadWorkspaceMap() {
  const envRaw = process.env.PRODUCT_WORKSPACES || "";
  try {
    const envMap = envRaw ? JSON.parse(envRaw) : {};
    return { ...DEFAULT_PRODUCT_WORKSPACES, ...envMap };
  } catch {
    return { ...DEFAULT_PRODUCT_WORKSPACES };
  }
}

function normalizeUrl(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function buildSections(workspace) {
  return [
    {
      id: "members-area",
      title: "Area de membros",
      description: "Acesso principal ao produto e trilha de aulas.",
      url: normalizeUrl(workspace.areaDeMembros),
      available: Boolean(normalizeUrl(workspace.areaDeMembros))
    },
    {
      id: "extra-material",
      title: "Material extra",
      description: "Arquivos de apoio: apostilas, checklists e bonus.",
      url: normalizeUrl(workspace.materialExtra),
      available: Boolean(normalizeUrl(workspace.materialExtra))
    },
    {
      id: "networking",
      title: "Grupo de networking",
      description: "Comunidade para networking e suporte entre alunas.",
      url: normalizeUrl(workspace.networking),
      available: Boolean(normalizeUrl(workspace.networking))
    }
  ];
}

export function getProductWorkspace(productSlug) {
  const map = loadWorkspaceMap();
  const workspace = map[productSlug] || {};

  return {
    productSlug,
    sections: buildSections(workspace),
    configured: Boolean(workspace.areaDeMembros || workspace.materialExtra || workspace.networking)
  };
}
