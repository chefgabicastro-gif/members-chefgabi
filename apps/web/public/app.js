let API_BASE =
  localStorage.getItem("apiBase") ||
  (window.location.hostname === "localhost" ? "http://localhost:4000" : "");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const rowsContainer = document.getElementById("rowsContainer");
const logoutBtn = document.getElementById("logoutBtn");
const installBtn = document.getElementById("installBtn");
const unlockedMetric = document.getElementById("unlockedMetric");
const lockedMetric = document.getElementById("lockedMetric");
const journeyMetric = document.getElementById("journeyMetric");
const brandName = document.getElementById("brandName");
const brandTagline = document.getElementById("brandTagline");
const loginTitle = document.getElementById("loginTitle");
const loginDescription = document.getElementById("loginDescription");
const heroPill = document.getElementById("heroPill");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const userEmailEl = document.getElementById("userEmail");

let deferredPrompt = null;
let token = localStorage.getItem("members_token");
let currentUser = null;

function applyBrand(config) {
  if (!config || typeof config !== "object") return;
  if (config.brandName) brandName.textContent = config.brandName;
  if (config.brandTagline) brandTagline.textContent = config.brandTagline;
  if (config.loginTitle) loginTitle.textContent = config.loginTitle;
  if (config.loginDescription) loginDescription.textContent = config.loginDescription;
  if (config.heroPill) heroPill.textContent = config.heroPill;
  if (config.heroTitle) heroTitle.textContent = config.heroTitle;
  if (config.heroDescription) heroDescription.textContent = config.heroDescription;
  if (config.brandName) document.title = config.brandName;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

async function login(email) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    throw new Error("Falha no login");
  }
  const data = await response.json();
  token = data.token;
  currentUser = data.user;
  localStorage.setItem("members_token", token);
  localStorage.setItem("members_email", data.user.email);
  userEmailEl.textContent = data.user.email;
}

async function fetchRows() {
  const response = await fetch(`${API_BASE}/api/v1/home/rows`, { headers: authHeaders() });
  if (!response.ok) {
    throw new Error("Sessao invalida");
  }
  const data = await response.json();
  return data.rows || [];
}

async function fetchProducts() {
  const response = await fetch(`${API_BASE}/api/v1/products`, { headers: authHeaders() });
  if (!response.ok) {
    throw new Error("Falha ao carregar catalogo");
  }
  const data = await response.json();
  return data.products || [];
}

function cardTemplate(product) {
  const statusClass = product.isUnlocked ? "unlocked" : "locked";
  const statusLabel = product.isUnlocked ? "Liberado" : "Bloqueado";
  const hasCheckout = Boolean(product.hasCheckout);
  const formattedPrice = product.price ? `R$ ${product.price}` : "Order Bump";
  const buttonLabel = product.isUnlocked
    ? "Entrar agora"
    : hasCheckout
      ? `Desbloquear ${formattedPrice}`
      : "Disponivel no checkout principal";
  const hint = product.isUnlocked
    ? "Acesso ativo no seu login."
    : hasCheckout
      ? "Ao concluir o checkout GG, o acesso libera automaticamente."
      : "Este item e liberado como order bump durante um checkout principal.";

  return `
    <article class="card">
      <div class="cover" style="background-image: url('${product.cover}')">
        <span class="badge ${statusClass}">${statusLabel}</span>
        <span class="price">${formattedPrice}</span>
      </div>
      <div class="card-body">
        <h4>${product.title}</h4>
        <small>${product.tagline || ""}</small>
        <p>${product.description}</p>
        <div class="meta">
          <span>${product.level || "Premium"}</span>
          <span>${product.runtime || "Conteudo completo"}</span>
        </div>
        <div class="actions">
          <button class="btn ${product.isUnlocked ? "enter cta-enter" : hasCheckout ? "unlock cta-unlock" : "wait"}" data-slug="${product.slug}" ${!product.isUnlocked && !hasCheckout ? "disabled" : ""}>
            ${buttonLabel}
          </button>
        </div>
        <div class="hint">${hint}</div>
      </div>
    </article>
  `;
}

function renderRows(rows, products) {
  if (!rows.length) {
    rowsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  const unlockedCount = products.filter((item) => item.isUnlocked).length;
  const lockedCount = products.length - unlockedCount;
  const journeyPct = products.length ? Math.round((unlockedCount / products.length) * 100) : 0;
  unlockedMetric.textContent = String(unlockedCount);
  lockedMetric.textContent = String(lockedCount);
  journeyMetric.textContent = `${journeyPct}%`;

  rowsContainer.innerHTML = rows
    .map(
      (row) => `
      <section class="row-block">
        <h3 class="row-title">${row.title}</h3>
        <div class="cards">
          ${row.items.map((item) => cardTemplate(item)).join("")}
        </div>
      </section>
    `
    )
    .join("");

  rowsContainer.querySelectorAll(".cta-unlock").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await goToCheckout(slug);
    });
  });

  rowsContainer.querySelectorAll(".cta-enter").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await openUnlockedProduct(slug);
    });
  });
}

async function goToCheckout(productSlug) {
  const response = await fetch(`${API_BASE}/api/v1/checkout/url/${productSlug}`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error || "Checkout indisponivel para este produto.");
    return;
  }

  window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
}

async function openUnlockedProduct(productSlug) {
  const response = await fetch(`${API_BASE}/api/v1/products/${productSlug}/access`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error || "Acesso ainda nao configurado para este produto.");
    return;
  }

  window.open(data.accessUrl, "_blank", "noopener,noreferrer");
}

async function loadDashboard() {
  const [rows, products] = await Promise.all([fetchRows(), fetchProducts()]);
  const continueWatching = {
    id: "continue",
    title: "Continue de onde parou",
    items: products.filter((p) => p.isUnlocked).slice(0, 2)
  };
  renderRows([continueWatching, ...rows], products);
}

function setView() {
  if (token) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    userEmailEl.textContent = localStorage.getItem("members_email") || "Area premium";
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    userEmailEl.textContent = "Convidada";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await login(emailInput.value.trim().toLowerCase());
    setView();
    await loadDashboard();
  } catch (error) {
    alert(error.message);
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("members_token");
  localStorage.removeItem("members_email");
  token = "";
  currentUser = null;
  rowsContainer.innerHTML = "";
  setView();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

window.addEventListener("load", async () => {
  try {
    const brandResponse = await fetch("/brand.json");
    if (brandResponse.ok) {
      const brandConfig = await brandResponse.json();
      applyBrand(brandConfig);
    }
  } catch (_error) {
    // Sem bloqueio se brand.json falhar.
  }

  try {
    const configResponse = await fetch("/config.json");
    if (configResponse.ok) {
      const config = await configResponse.json();
      if (config.apiBase && !localStorage.getItem("apiBase") && !API_BASE) {
        API_BASE = config.apiBase;
      }
    }
  } catch (_error) {
    // Fallback silencioso para API local.
  }

  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/sw.js");
  }
  setView();
  if (token) {
    try {
      await loadDashboard();
    } catch (_error) {
      localStorage.removeItem("members_token");
      token = "";
      setView();
    }
  }
});
