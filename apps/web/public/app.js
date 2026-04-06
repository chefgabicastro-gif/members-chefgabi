let API_BASE =
  localStorage.getItem("apiBase") ||
  (window.location.hostname === "localhost" ? "http://localhost:4000" : "");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const playerSection = document.getElementById("playerSection");
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
const heroPanel = document.getElementById("heroPanel");
const heroWatchBtn = document.getElementById("heroWatchBtn");
const heroDetailsBtn = document.getElementById("heroDetailsBtn");
const playerHero = document.getElementById("playerHero");
const playerTag = document.getElementById("playerTag");
const playerTitle = document.getElementById("playerTitle");
const playerDesc = document.getElementById("playerDesc");
const episodesList = document.getElementById("episodesList");
const achievementsList = document.getElementById("achievementsList");
const recommendedList = document.getElementById("recommendedList");
const backHomeBtn = document.getElementById("backHomeBtn");
const openExternalBtn = document.getElementById("openExternalBtn");
const menuItems = Array.from(document.querySelectorAll(".menu-item"));
const mobileItems = Array.from(document.querySelectorAll(".mobile-item"));

let deferredPrompt = null;
let token = localStorage.getItem("members_token");
let featuredProduct = null;
let productCache = [];

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

function setActiveNav(nav) {
  menuItems.forEach((item) => item.classList.toggle("active", item.dataset.nav === nav));
  mobileItems.forEach((item) => item.classList.toggle("active", item.dataset.nav === nav));
}

function showHome() {
  dashboardSection.classList.remove("hidden");
  playerSection.classList.add("hidden");
  setActiveNav("home");
}

function showPlayer() {
  dashboardSection.classList.add("hidden");
  playerSection.classList.remove("hidden");
  setActiveNav("trilha");
}

async function login(email) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!response.ok) throw new Error("Falha no login");
  const data = await response.json();
  token = data.token;
  localStorage.setItem("members_token", token);
  localStorage.setItem("members_email", data.user.email);
  userEmailEl.textContent = data.user.email;
}

async function fetchRows() {
  const response = await fetch(`${API_BASE}/api/v1/home/rows`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Sessao invalida");
  const data = await response.json();
  return data.rows || [];
}

async function fetchProducts() {
  const response = await fetch(`${API_BASE}/api/v1/products`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Falha ao carregar catalogo");
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
      : "Disponivel no checkout";

  return `
    <article class="card">
      <div class="cover" style="background-image: url('${product.cover}')">
        <span class="badge ${statusClass}">${statusLabel}</span>
        <span class="price">${formattedPrice}</span>
      </div>
      <div class="card-body">
        <h4>${product.title}</h4>
        <small>${product.tagline || "Premium"}</small>
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
      </div>
    </article>
  `;
}

function railTemplate(row) {
  return `
    <section class="row-block" id="row-${row.id}">
      <div class="row-head">
        <h3 class="row-title">${row.title}</h3>
        <div class="row-nav">
          <button class="row-btn" data-row="${row.id}" data-dir="left">‹</button>
          <button class="row-btn" data-row="${row.id}" data-dir="right">›</button>
        </div>
      </div>
      <div id="rail-${row.id}" class="rail-track">
        ${row.items.map((item) => cardTemplate(item)).join("")}
      </div>
    </section>
  `;
}

function setHeroFeatured(products) {
  featuredProduct = products.find((item) => item.isUnlocked) || products[0] || null;
  if (!featuredProduct) return;

  heroTitle.textContent = `${featuredProduct.title} - ${featuredProduct.tagline || "Destaque"}`;
  heroDescription.textContent = featuredProduct.description;
  heroPill.textContent = featuredProduct.isUnlocked ? "LIBERADO AGORA" : "DESTAQUE DA SEMANA";
  heroPanel.style.backgroundImage = `linear-gradient(110deg, rgba(255, 140, 66, 0.2), rgba(17, 24, 39, 0.82)), linear-gradient(150deg, #131a2a, #101521), url('${featuredProduct.cover}')`;
  heroPanel.style.backgroundSize = "cover";
  heroPanel.style.backgroundPosition = "center";
}

function attachRowEvents() {
  rowsContainer.querySelectorAll(".cta-unlock").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await goToCheckout(slug);
    });
  });

  rowsContainer.querySelectorAll(".cta-enter").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await openProductInternal(slug);
    });
  });

  rowsContainer.querySelectorAll(".row-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const row = event.currentTarget.getAttribute("data-row");
      const dir = event.currentTarget.getAttribute("data-dir");
      const rail = document.getElementById(`rail-${row}`);
      if (!rail) return;
      rail.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
    });
  });
}

function renderRows(rows, products) {
  const unlockedCount = products.filter((item) => item.isUnlocked).length;
  const lockedCount = products.length - unlockedCount;
  const journeyPct = products.length ? Math.round((unlockedCount / products.length) * 100) : 0;
  unlockedMetric.textContent = String(unlockedCount);
  lockedMetric.textContent = String(lockedCount);
  journeyMetric.textContent = `${journeyPct}%`;

  setHeroFeatured(products);
  rowsContainer.innerHTML = rows.map((row) => railTemplate(row)).join("");
  attachRowEvents();
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

function renderPlayer(content) {
  playerTitle.textContent = content.product.title;
  playerDesc.textContent = content.product.description;
  playerTag.textContent = content.product.tagline || "Conteudo premium";
  playerHero.style.backgroundImage = `linear-gradient(180deg, rgba(8, 11, 18, 0.15), rgba(7, 10, 18, 0.82)), url('${content.product.cover}')`;
  playerHero.style.backgroundSize = "cover";
  playerHero.style.backgroundPosition = "center";

  const episodes = content.modules.flatMap((module) => module.lessons.map((lesson, index) => ({ ...lesson, moduleTitle: module.title, index })));
  episodesList.innerHTML = episodes
    .map(
      (lesson, idx) => `
      <article class="episode ${idx === 0 ? "current" : ""}">
        <div class="episode-thumb" style="background-image:url('${lesson.thumb}')"></div>
        <div>
          <h4>${lesson.title}</h4>
          <p>${lesson.moduleTitle}</p>
          <span>${lesson.durationMinutes} min</span>
        </div>
      </article>
    `
    )
    .join("");

  achievementsList.innerHTML = (content.achievements || [])
    .map(
      (item) => `
      <div class="achievement-item">
        <div class="achievement-row">
          <strong>${item.title}</strong>
          <span>${item.progress}%</span>
        </div>
        <div class="progress"><span style="width:${item.progress}%"></span></div>
      </div>
    `
    )
    .join("");

  recommendedList.innerHTML = (content.recommended || [])
    .map(
      (item) => `
      <button class="mini-card" data-slug="${item.slug}">
        <div class="mini-cover" style="background-image:url('${item.cover}')"></div>
        <div>
          <strong>${item.title}</strong>
          <p>${item.tagline || "Recomendado"}</p>
        </div>
      </button>
    `
    )
    .join("");

  recommendedList.querySelectorAll(".mini-card").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      const product = productCache.find((item) => item.slug === slug);
      if (!product) return;
      if (!product.isUnlocked && product.hasCheckout) {
        await goToCheckout(slug);
        return;
      }
      if (product.isUnlocked) {
        await openProductInternal(slug);
      }
    });
  });

  if (content.externalAccessUrl) {
    openExternalBtn.classList.remove("hidden");
    openExternalBtn.onclick = () => window.open(content.externalAccessUrl, "_blank", "noopener,noreferrer");
  } else {
    openExternalBtn.classList.add("hidden");
  }
}

async function openProductInternal(productSlug) {
  const response = await fetch(`${API_BASE}/api/v1/products/${productSlug}/content`, {
    headers: authHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error || "Conteudo indisponivel para este produto.");
    return;
  }
  renderPlayer(data);
  showPlayer();
}

async function loadDashboard() {
  const [rows, products] = await Promise.all([fetchRows(), fetchProducts()]);
  productCache = products;
  const continueWatching = {
    id: "continue",
    title: "Continue assistindo",
    items: products.filter((p) => p.isUnlocked).slice(0, 8)
  };
  const trending = {
    id: "trending",
    title: "Conteudo em alta",
    items: products.slice(0, 8)
  };
  renderRows([continueWatching, ...rows, trending], products);
}

function setView() {
  if (token) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    userEmailEl.textContent = localStorage.getItem("members_email") || "Area premium";
    showHome();
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    playerSection.classList.add("hidden");
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
  rowsContainer.innerHTML = "";
  setView();
});

backHomeBtn.addEventListener("click", () => {
  showHome();
});

heroWatchBtn.addEventListener("click", async () => {
  if (!featuredProduct) return;
  if (featuredProduct.isUnlocked) {
    await openProductInternal(featuredProduct.slug);
    return;
  }
  if (featuredProduct.hasCheckout) {
    await goToCheckout(featuredProduct.slug);
  }
});

heroDetailsBtn.addEventListener("click", () => {
  rowsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
});

[...menuItems, ...mobileItems].forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const nav = item.dataset.nav;
    setActiveNav(nav);
    if (nav === "home") {
      showHome();
      return;
    }
    rowsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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
      applyBrand(await brandResponse.json());
    }
  } catch (_error) {}

  try {
    const configResponse = await fetch("/config.json");
    if (configResponse.ok) {
      const config = await configResponse.json();
      if (config.apiBase && !localStorage.getItem("apiBase") && !API_BASE) {
        API_BASE = config.apiBase;
      }
    }
  } catch (_error) {}

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
