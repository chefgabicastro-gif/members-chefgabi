let API_BASE =
  localStorage.getItem("apiBase") ||
  (window.location.hostname === "localhost" ? "http://localhost:4000" : "");

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const playerSection = document.getElementById("playerSection");
const profileSection = document.getElementById("profileSection");
const onboardingModal = document.getElementById("onboardingModal");
const closeOnboardingBtn = document.getElementById("closeOnboardingBtn");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const rowsContainer = document.getElementById("rowsContainer");
const continueRail = document.getElementById("continueRail");
const logoutBtn = document.getElementById("logoutBtn");
const installBtn = document.getElementById("installBtn");

const unlockedMetric = document.getElementById("unlockedMetric");
const lockedMetric = document.getElementById("lockedMetric");
const journeyMetric = document.getElementById("journeyMetric");

const brandName = document.getElementById("brandName");
const brandTagline = document.getElementById("brandTagline");
const loginTitle = document.getElementById("loginTitle");
const loginDescription = document.getElementById("loginDescription");

const heroMedia = document.getElementById("heroMedia");
const heroDots = document.getElementById("heroDots");
const heroPill = document.getElementById("heroPill");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroWatchBtn = document.getElementById("heroWatchBtn");
const heroDetailsBtn = document.getElementById("heroDetailsBtn");

const userEmailEl = document.getElementById("userEmail");
const playerHero = document.getElementById("playerHero");
const playerTag = document.getElementById("playerTag");
const playerTitle = document.getElementById("playerTitle");
const playerDesc = document.getElementById("playerDesc");
const episodesList = document.getElementById("episodesList");
const achievementsList = document.getElementById("achievementsList");
const recommendedList = document.getElementById("recommendedList");
const backHomeBtn = document.getElementById("backHomeBtn");
const openExternalBtn = document.getElementById("openExternalBtn");

const subscriptionInfo = document.getElementById("subscriptionInfo");
const billingList = document.getElementById("billingList");
const searchInput = document.getElementById("searchInput");

const menuItems = Array.from(document.querySelectorAll(".menu-item"));
const topNavItems = Array.from(document.querySelectorAll(".top-nav-item"));
const mobileItems = Array.from(document.querySelectorAll(".mobile-item"));

let deferredPrompt = null;
let token = localStorage.getItem("members_token");
let featuredProduct = null;
let productCache = [];
let lessonProgressMap = {};
let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;
let searchTimer = null;

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
  [...menuItems, ...topNavItems, ...mobileItems].forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === nav);
  });
}

function showPanel(target) {
  const panels = [dashboardSection, playerSection, profileSection];
  panels.forEach((panel) => {
    if (panel === target) return;
    panel.classList.add("fading");
    setTimeout(() => {
      panel.classList.add("hidden");
      panel.classList.remove("fading");
    }, 180);
  });

  target.classList.remove("hidden");
  target.classList.add("fading");
  requestAnimationFrame(() => target.classList.remove("fading"));
}

function showHome() {
  showPanel(dashboardSection);
  setActiveNav("home");
}

function showPlayer() {
  showPanel(playerSection);
  setActiveNav("trilha");
}

function showProfile() {
  showPanel(profileSection);
  setActiveNav("perfil");
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

async function searchProducts(query) {
  const response = await fetch(`${API_BASE}/api/v1/products/search?q=${encodeURIComponent(query)}`, {
    headers: authHeaders()
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.products || [];
}

async function fetchProfile() {
  const response = await fetch(`${API_BASE}/api/v1/profile/me`, { headers: authHeaders() });
  if (!response.ok) return null;
  return response.json();
}

async function fetchBilling() {
  const response = await fetch(`${API_BASE}/api/v1/billing/history?limit=20`, { headers: authHeaders() });
  if (!response.ok) return [];
  const data = await response.json();
  return data.items || [];
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function showSkeleton() {
  continueRail.innerHTML = Array.from({ length: 3 })
    .map(() => '<div class="skeleton-card cinema"></div>')
    .join("");

  rowsContainer.innerHTML = `
    <section class="row-block">
      <div class="row-head"><h3 class="row-title">Conteudo em alta</h3></div>
      <div class="story-rail">
        ${Array.from({ length: 6 }).map(() => '<div class="skeleton-card story"></div>').join("")}
      </div>
    </section>
  `;
}

function statusBadge(product) {
  const statusClass = product.isUnlocked ? "unlocked" : "locked";
  const statusLabel = product.isUnlocked ? "Liberado" : "Bloqueado";
  return `<span class="badge ${statusClass}">${statusLabel}</span>`;
}

function buttonFor(product) {
  const hasCheckout = Boolean(product.hasCheckout);
  if (product.isUnlocked) {
    return `<button class="btn enter cta-enter" data-slug="${product.slug}">Entrar agora</button>`;
  }
  if (hasCheckout) {
    const price = product.price ? `R$ ${product.price}` : "Order Bump";
    return `<button class="btn unlock cta-unlock" data-slug="${product.slug}">Desbloquear ${price}</button>`;
  }
  return `<button class="btn wait" disabled>Disponivel no checkout</button>`;
}

function cinemaCardTemplate(product) {
  const price = product.price ? `R$ ${product.price}` : "Order Bump";
  return `
    <article class="cinema-card">
      <div class="cinema-cover" style="background-image:url('${product.cover}')">
        <div class="card-top">
          ${statusBadge(product)}
          <span class="price">${price}</span>
        </div>
      </div>
      <div class="card-body">
        <h4>${product.title}</h4>
        <p>${product.description}</p>
        <div class="actions">${buttonFor(product)}</div>
      </div>
    </article>
  `;
}

function storyCardTemplate(product) {
  const price = product.price ? `R$ ${product.price}` : "Order Bump";
  return `
    <article class="story-card">
      <div class="story-cover" style="background-image:url('${product.cover}')">
        <div class="story-top">
          ${statusBadge(product)}
          <span class="price">${price}</span>
        </div>
        <div class="story-body">
          <h4>${product.title}</h4>
          <p>${product.tagline || "Premium"}</p>
          <div class="meta">
            <span>${product.level || "PRO"}</span>
            <span>${product.runtime || "Trilha"}</span>
          </div>
          <div class="actions">${buttonFor(product)}</div>
        </div>
      </div>
    </article>
  `;
}

function rowTemplate(row) {
  return `
    <section class="row-block" id="row-${row.id}">
      <div class="row-head"><h3 class="row-title">${row.title}</h3></div>
      <div class="story-rail">${row.items.map((item) => storyCardTemplate(item)).join("")}</div>
    </section>
  `;
}

function bindActionButtons(scope) {
  scope.querySelectorAll(".cta-unlock").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await goToCheckout(slug);
    });
  });

  scope.querySelectorAll(".cta-enter").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const slug = event.currentTarget.getAttribute("data-slug");
      await openProductInternal(slug);
    });
  });
}

function setHeroSlides(products) {
  if (heroTimer) clearInterval(heroTimer);

  heroSlides = [...products.filter((item) => item.isUnlocked), ...products].slice(0, 6);
  if (!heroSlides.length) return;

  heroIndex = 0;
  renderHeroSlide(heroIndex);

  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    renderHeroSlide(heroIndex);
  }, 5000);
}

function renderHeroSlide(index) {
  const slide = heroSlides[index];
  if (!slide) return;
  featuredProduct = slide;

  heroMedia.style.opacity = "0.35";
  setTimeout(() => {
    heroMedia.style.backgroundImage = `url('${slide.cover}')`;
    heroMedia.style.opacity = "1";
  }, 120);

  heroPill.textContent = slide.isUnlocked ? "LIBERADO AGORA" : "DESTAQUE DA SEMANA";
  heroTitle.textContent = slide.title;
  heroDescription.textContent = slide.description;

  heroDots.innerHTML = heroSlides
    .map(
      (_item, idx) =>
        `<button class="hero-dot ${idx === index ? "active" : ""}" data-index="${idx}" aria-label="Ir para slide ${idx + 1}"></button>`
    )
    .join("");

  heroDots.querySelectorAll(".hero-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      heroIndex = Number(dot.getAttribute("data-index"));
      renderHeroSlide(heroIndex);
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

  setHeroSlides(products);

  const continueItems = products.filter((item) => item.isUnlocked).slice(0, 10);
  continueRail.innerHTML = continueItems.length
    ? continueItems.map((item) => cinemaCardTemplate(item)).join("")
    : "<p class='muted'>Nenhum conteudo liberado ainda.</p>";

  const highContent = {
    id: "high",
    title: "Conteudo em alta",
    items: products.slice(0, 12)
  };

  const unlockedRow = {
    id: "free",
    title: "Liberados para voce",
    items: products.filter((item) => item.isUnlocked)
  };

  const composedRows = [unlockedRow, ...rows, highContent].filter((row) => row.items && row.items.length);
  rowsContainer.innerHTML = composedRows.map((row) => rowTemplate(row)).join("");

  bindActionButtons(document);
}

function renderProfile(profile, billingItems) {
  if (!profile) return;
  const subscription = profile.subscription || {};

  subscriptionInfo.innerHTML = `
    <div class="sub-row"><span>Plano</span><strong>${subscription.plan || "-"}</strong></div>
    <div class="sub-row"><span>Status</span><strong>${subscription.status || "-"}</strong></div>
    <div class="sub-row"><span>Produtos ativos</span><strong>${subscription.activeProducts || 0}</strong></div>
    <div class="sub-row"><span>Proxima renovacao</span><strong>${subscription.renewDate ? formatDate(subscription.renewDate) : "-"}</strong></div>
  `;

  billingList.innerHTML = billingItems.length
    ? billingItems
        .map(
          (item) => `
      <div class="billing-item">
        <strong>${item.description}</strong>
        <span>${formatDate(item.date)} • ${item.status}</span>
        <small>R$ ${Number(item.amount || 0)}</small>
      </div>
    `
        )
        .join("")
    : "<p class='muted'>Sem cobrancas no historico.</p>";
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
  playerHero.style.backgroundImage = `linear-gradient(180deg, rgba(8, 11, 18, 0.15), rgba(7, 10, 18, 0.86)), url('${content.product.cover}')`;
  playerHero.style.backgroundSize = "cover";
  playerHero.style.backgroundPosition = "center";

  lessonProgressMap = Object.fromEntries((content.lessonProgress || []).map((item) => [item.lessonId, item]));
  const episodes = content.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))
  );

  episodesList.innerHTML = episodes
    .map(
      (lesson, index) => `
      <article class="episode ${index === 0 ? "current" : ""}" data-lesson-id="${lesson.id}" data-product-slug="${content.product.slug}">
        <div class="episode-thumb" style="background-image:url('${lesson.thumb}')"></div>
        <div>
          <h4>${lesson.title}</h4>
          <p>${lesson.moduleTitle}</p>
          <span>${lesson.durationMinutes} min • ${lessonProgressMap[lesson.id]?.watchedPercent || 0}%</span>
        </div>
      </article>
    `
    )
    .join("");

  episodesList.querySelectorAll(".episode").forEach((episodeEl) => {
    episodeEl.addEventListener("click", async () => {
      const lessonId = episodeEl.getAttribute("data-lesson-id");
      const productSlug = episodeEl.getAttribute("data-product-slug");
      await saveLessonProgress(productSlug, lessonId);
      episodesList.querySelectorAll(".episode").forEach((item) => item.classList.remove("current"));
      episodeEl.classList.add("current");
    });
  });

  achievementsList.innerHTML = (content.achievements || [])
    .map(
      (item) => `
      <div class="achievement-item">
        <div class="achievement-row"><strong>${item.title}</strong><span>${item.progress}%</span></div>
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
        <div><strong>${item.title}</strong><p>${item.tagline || "Recomendado"}</p></div>
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
      if (product.isUnlocked) await openProductInternal(slug);
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

async function saveLessonProgress(productSlug, lessonId) {
  const prev = lessonProgressMap[lessonId]?.watchedPercent || 0;
  const watchedPercent = Math.min(100, prev + 25);
  const completed = watchedPercent >= 100;

  await fetch(`${API_BASE}/api/v1/progress/${lessonId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ productSlug, watchedPercent, completed })
  });

  lessonProgressMap[lessonId] = { watchedPercent, completed };
}

function maybeShowOnboarding() {
  const email = localStorage.getItem("members_email") || "convidada";
  const key = `onboarding_seen_${email}`;
  if (!localStorage.getItem(key)) {
    onboardingModal.classList.remove("hidden");
    closeOnboardingBtn.onclick = () => {
      localStorage.setItem(key, "1");
      onboardingModal.classList.add("hidden");
    };
  }
}

async function loadDashboard() {
  showSkeleton();
  const [rows, products, profile, billingItems] = await Promise.all([
    fetchRows(),
    fetchProducts(),
    fetchProfile(),
    fetchBilling()
  ]);

  productCache = products;
  renderRows(rows, products);
  renderProfile(profile, billingItems);
}

function setView() {
  if (token) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    userEmailEl.textContent = localStorage.getItem("members_email") || "Area premium";
    showHome();
    maybeShowOnboarding();
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    playerSection.classList.add("hidden");
    profileSection.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    userEmailEl.textContent = "Convidada";
  }
}

function handleNav(nav) {
  if (nav === "home" || nav === "catalogo") {
    showHome();
    rowsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (nav === "trilha") {
    const unlocked = productCache.find((item) => item.isUnlocked);
    if (unlocked) {
      openProductInternal(unlocked.slug);
      return;
    }
    showHome();
    continueRail.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (nav === "perfil") {
    showProfile();
    return;
  }

  alert("Suporte: em breve conectaremos WhatsApp e central de ajuda.");
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
  continueRail.innerHTML = "";
  if (heroTimer) clearInterval(heroTimer);
  setView();
});

backHomeBtn.addEventListener("click", showHome);

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

[...menuItems, ...topNavItems, ...mobileItems].forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    handleNav(item.dataset.nav);
  });
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    const q = searchInput.value.trim();
    if (q.length < 2) {
      await loadDashboard();
      return;
    }

    showSkeleton();
    const results = await searchProducts(q);
    const searchRow = {
      id: "search",
      title: `Resultados para \"${q}\"`,
      items: results
    };

    continueRail.innerHTML = "<p class='muted'>Use os resultados abaixo para navegar rapido.</p>";
    rowsContainer.innerHTML = rowTemplate(searchRow);
    bindActionButtons(document);
  }, 260);
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
    if (brandResponse.ok) applyBrand(await brandResponse.json());
  } catch (_error) {}

  try {
    const configResponse = await fetch("/config.json");
    if (configResponse.ok) {
      const config = await configResponse.json();
      if (config.apiBase && !localStorage.getItem("apiBase") && !API_BASE) API_BASE = config.apiBase;
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