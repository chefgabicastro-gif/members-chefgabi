const DEFAULT_API_BASE =
  window.location.hostname === "localhost" ? "http://localhost:4000" : window.location.origin.replace(":3000", ":4000");

const API_FALLBACKS = [DEFAULT_API_BASE, "http://127.0.0.1:4000", "https://da-crise-ao-chamado-api.onrender.com"];
const ADMIN_KEY_STORAGE = "devotional_admin_key";
const ADMIN_API_STORAGE = "devotional_admin_api_base";

let apiBase = localStorage.getItem(ADMIN_API_STORAGE) || DEFAULT_API_BASE;
let adminKey = localStorage.getItem(ADMIN_KEY_STORAGE) || "";
let selectedQrInstance = "";
let dashboardData = {
  status: null,
  instances: []
};

const authForm = document.getElementById("authForm");
const adminKeyInput = document.getElementById("adminKeyInput");
const authMessage = document.getElementById("authMessage");
const activeInstanceValue = document.getElementById("activeInstanceValue");
const activeInstanceCopy = document.getElementById("activeInstanceCopy");
const scheduleValue = document.getElementById("scheduleValue");
const timezoneValue = document.getElementById("timezoneValue");
const subscriberCountValue = document.getElementById("subscriberCountValue");
const dispatchCountValue = document.getElementById("dispatchCountValue");
const createInstanceForm = document.getElementById("createInstanceForm");
const instanceNameInput = document.getElementById("instanceNameInput");
const instanceNumberInput = document.getElementById("instanceNumberInput");
const instanceTokenInput = document.getElementById("instanceTokenInput");
const instancesList = document.getElementById("instancesList");
const qrCanvas = document.getElementById("qrCanvas");
const qrInstanceName = document.getElementById("qrInstanceName");
const qrStatusText = document.getElementById("qrStatusText");
const pairingCodeValue = document.getElementById("pairingCodeValue");
const refreshQrBtn = document.getElementById("refreshQrBtn");
const pollStateBtn = document.getElementById("pollStateBtn");
const refreshInstancesBtn = document.getElementById("refreshInstancesBtn");
const subscriberForm = document.getElementById("subscriberForm");
const subscriberPhoneInput = document.getElementById("subscriberPhoneInput");
const subscriberNameInput = document.getElementById("subscriberNameInput");
const subscriberNotesInput = document.getElementById("subscriberNotesInput");
const subscriberList = document.getElementById("subscriberList");
const manualSendForm = document.getElementById("manualSendForm");
const sendSlotInput = document.getElementById("sendSlotInput");
const sendPhoneInput = document.getElementById("sendPhoneInput");
const sendResultText = document.getElementById("sendResultText");
const dispatchList = document.getElementById("dispatchList");

function setAuthMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.style.color =
    type === "error" ? "#ffb7c0" : type === "success" ? "#bcffd7" : "var(--muted)";
}

function adminHeaders(includeJson = true) {
  const headers = {
    "x-admin-key": adminKey
  };
  if (includeJson) headers["Content-Type"] = "application/json";
  return headers;
}

async function apiFetch(pathname, options = {}) {
  let lastError = null;
  const candidates = Array.from(new Set([apiBase, ...API_FALLBACKS].filter(Boolean)));

  for (const candidate of candidates) {
    try {
      const response = await fetch(`${candidate}${pathname}`, options);
      apiBase = candidate;
      localStorage.setItem(ADMIN_API_STORAGE, candidate);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Nao foi possivel conectar na API.");
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D+/g, "");
}

function renderSnapshot() {
  const status = dashboardData.status || {};
  const subscribers = status.subscribers || [];
  const dispatches = status.recentDispatches || [];
  activeInstanceValue.textContent = status.activeEvolutionInstance || "Nenhuma ativa";
  activeInstanceCopy.textContent = status.enabled
    ? "O scheduler esta ligado e usa esta instancia para os envios."
    : "O bot esta desativado no backend neste momento.";
  scheduleValue.textContent = (status.schedule || []).join(" • ") || "-";
  timezoneValue.textContent = `Fuso: ${status.timezone || "-"}`;
  subscriberCountValue.textContent = String(subscribers.filter((item) => item.isActive).length);
  dispatchCountValue.textContent = `${dispatches.length} envios recentes`;
}

function badgeForState(state) {
  const normalized = String(state || "").toLowerCase();
  if (normalized === "open") return '<span class="chip active">Conectada</span>';
  if (normalized === "close") return '<span class="chip warning">Desconectada</span>';
  return `<span class="chip">${state || "Desconhecido"}</span>`;
}

function renderInstances() {
  const activeInstance = dashboardData.status?.activeEvolutionInstance || "";
  const items = dashboardData.instances || [];
  instancesList.innerHTML = items.length
    ? items
        .map(
          (item) => `
        <article class="instance-card ${item.instanceName === activeInstance ? "active" : ""}">
          <div class="instance-head">
            <div>
              <strong>${item.instanceName}</strong>
              <p>${item.profileName || item.owner || "Sem perfil conectado ainda."}</p>
            </div>
            ${badgeForState(item.status)}
          </div>
          <div class="chip-row">
            ${item.instanceName === activeInstance ? '<span class="chip active">Ativa no bot</span>' : ""}
            <span class="chip">${item.integration || "WHATSAPP-BAILEYS"}</span>
            <span class="chip">${item.owner || "Sem owner"}</span>
          </div>
          <div class="instance-actions">
            <button class="ghost-btn" type="button" data-action="connect" data-instance="${item.instanceName}">Gerar QR</button>
            <button class="ghost-btn" type="button" data-action="state" data-instance="${item.instanceName}">Ver status</button>
            <button class="ghost-btn" type="button" data-action="select" data-instance="${item.instanceName}">Usar no bot</button>
            <button class="ghost-btn" type="button" data-action="restart" data-instance="${item.instanceName}">Reiniciar</button>
            <button class="danger-btn" type="button" data-action="logout" data-instance="${item.instanceName}">Desconectar</button>
          </div>
        </article>
      `
        )
        .join("")
    : '<article class="instance-card"><p>Nenhuma instancia encontrada ainda. Crie a primeira acima para iniciar o pareamento.</p></article>';
}

function renderSubscribers() {
  const subscribers = dashboardData.status?.subscribers || [];
  subscriberList.innerHTML = subscribers.length
    ? subscribers
        .map(
          (item) => `
        <article class="subscriber-card">
          <div class="subscriber-head">
            <div>
              <strong>${item.name || item.phone}</strong>
              <p>${item.notes || "Sem observacoes."}</p>
            </div>
            ${item.isActive ? '<span class="chip active">Ativo</span>' : '<span class="chip danger">Inativo</span>'}
          </div>
          <div class="chip-row">
            <span class="chip">${item.phone}</span>
            <span class="chip">${(item.schedule || []).join(" • ")}</span>
            <span class="chip">${item.timezone || "America/Sao_Paulo"}</span>
          </div>
        </article>
      `
        )
        .join("")
    : '<article class="subscriber-card"><p>Nenhum assinante cadastrado ainda.</p></article>';
}

function renderDispatches() {
  const dispatches = dashboardData.status?.recentDispatches || [];
  dispatchList.innerHTML = dispatches.length
    ? dispatches
        .map(
          (item) => `
        <article class="dispatch-card">
          <div class="dispatch-head">
            <div>
              <strong>${item.phone}</strong>
              <p>${item.dispatchKey}</p>
            </div>
            <span class="chip ${item.status === "sent" ? "active" : ""}">${item.status}</span>
          </div>
          <div class="chip-row">
            <span class="chip">${item.schedule}</span>
            <span class="chip">${item.timezone}</span>
            <span class="chip">${new Date(item.createdAt).toLocaleString("pt-BR")}</span>
          </div>
        </article>
      `
        )
        .join("")
    : '<article class="dispatch-card"><p>Nenhum envio registrado ainda.</p></article>';
}

async function renderQrCode(payload, instanceName) {
  selectedQrInstance = instanceName;
  qrInstanceName.textContent = instanceName;
  qrStatusText.textContent = "QR gerado. Escaneie com o WhatsApp do numero que vai operar o bot.";
  pairingCodeValue.textContent = payload?.pairingCode || "-";

  const canvasContext = qrCanvas.getContext("2d");
  canvasContext.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

  const qrValue = payload?.code || payload?.pairingCode;
  if (!qrValue) {
    qrStatusText.textContent = "A Evolution nao retornou um QR valido para esta instancia.";
    return;
  }

  await window.QRCode.toCanvas(qrCanvas, qrValue, {
    width: 280,
    margin: 1,
    color: {
      dark: "#07110d",
      light: "#ffffff"
    }
  });
}

async function loadDashboard() {
  const [statusResponse, instancesResponse] = await Promise.all([
    apiFetch("/api/v1/admin/devotional/status", { headers: adminHeaders(false) }),
    apiFetch("/api/v1/admin/devotional/evolution/instances", { headers: adminHeaders(false) })
  ]);

  if (!statusResponse.ok) {
    const payload = await statusResponse.json().catch(() => ({}));
    throw new Error(payload.error || "Falha ao carregar status do painel.");
  }
  if (!instancesResponse.ok) {
    const payload = await instancesResponse.json().catch(() => ({}));
    throw new Error(payload.error || "Falha ao carregar instancias da Evolution.");
  }

  const statusData = await statusResponse.json();
  const instancesData = await instancesResponse.json();
  dashboardData = {
    status: statusData,
    instances: instancesData.instances || []
  };

  renderSnapshot();
  renderInstances();
  renderSubscribers();
  renderDispatches();
}

async function handleAuth(event) {
  event.preventDefault();
  adminKey = adminKeyInput.value.trim();
  if (!adminKey) {
    setAuthMessage("Cole a x-admin-key para liberar o painel.", "error");
    return;
  }

  localStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
  setAuthMessage("Validando acesso ao painel...", "success");

  try {
    await loadDashboard();
    setAuthMessage("Painel liberado e sincronizado com a API.", "success");
  } catch (error) {
    setAuthMessage(error.message || "Nao foi possivel abrir o painel agora.", "error");
  }
}

async function createInstance(event) {
  event.preventDefault();
  const payload = {
    instanceName: instanceNameInput.value.trim(),
    number: normalizePhone(instanceNumberInput.value),
    token: instanceTokenInput.value.trim()
  };

  const response = await apiFetch("/api/v1/admin/devotional/evolution/instances", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    setAuthMessage(data.error || "Falha ao criar instancia.", "error");
    return;
  }

  setAuthMessage(`Instancia ${payload.instanceName} criada. Agora gere o QR para parear.`, "success");
  createInstanceForm.reset();
  await loadDashboard();
}

async function handleInstanceAction(event) {
  const button = event.target.closest("[data-action]");
  if (!(button instanceof HTMLButtonElement)) return;

  const action = button.dataset.action;
  const instanceName = button.dataset.instance;
  if (!action || !instanceName) return;

  const pathMap = {
    state: { path: `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(instanceName)}/state`, method: "GET" },
    select: { path: `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(instanceName)}/select`, method: "POST" },
    restart: { path: `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(instanceName)}/restart`, method: "POST" },
    logout: { path: `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(instanceName)}/logout`, method: "POST" }
  };

  if (action === "connect") {
    const response = await apiFetch(
      `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(instanceName)}/connect`,
      {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({})
      }
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setAuthMessage(data.error || "Falha ao gerar QR.", "error");
      return;
    }
    await renderQrCode(data.qr, instanceName);
    setAuthMessage(`QR carregado para ${instanceName}.`, "success");
    return;
  }

  const config = pathMap[action];
  if (!config) return;

  const response = await apiFetch(config.path, {
    method: config.method,
    headers: adminHeaders(config.method !== "GET")
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    setAuthMessage(data.error || "Operacao falhou.", "error");
    return;
  }

  if (action === "state") {
    const state = data.state?.state || "unknown";
    setAuthMessage(`Status de ${instanceName}: ${state}.`, "success");
  }

  if (action === "select") {
    setAuthMessage(`Instancia ${instanceName} agora e a linha ativa do bot.`, "success");
  }

  if (action === "restart") {
    setAuthMessage(`Instancia ${instanceName} reiniciada.`, "success");
  }

  if (action === "logout") {
    setAuthMessage(`Instancia ${instanceName} desconectada. Gere um novo QR se quiser religar.`, "success");
  }

  await loadDashboard();
}

async function saveSubscriber(event) {
  event.preventDefault();
  const payload = {
    phone: normalizePhone(subscriberPhoneInput.value),
    name: subscriberNameInput.value.trim(),
    notes: subscriberNotesInput.value.trim()
  };

  const response = await apiFetch("/api/v1/devotional/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    setAuthMessage(data.error || "Falha ao cadastrar assinante.", "error");
    return;
  }

  setAuthMessage(`Assinante ${payload.phone} cadastrado com sucesso.`, "success");
  subscriberForm.reset();
  await loadDashboard();
}

async function manualSend(event) {
  event.preventDefault();
  const payload = {
    slot: sendSlotInput.value,
    phone: normalizePhone(sendPhoneInput.value)
  };

  const response = await apiFetch("/api/v1/admin/devotional/send-now", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  sendResultText.textContent = JSON.stringify(data, null, 2);

  if (!response.ok) {
    setAuthMessage(data.error || "Falha ao disparar devocional.", "error");
    return;
  }

  setAuthMessage("Disparo executado. Confira o resultado e o historico abaixo.", "success");
  await loadDashboard();
}

async function refreshSelectedQr() {
  if (!selectedQrInstance) {
    setAuthMessage("Selecione uma instancia e gere o QR primeiro.", "error");
    return;
  }

  const response = await apiFetch(
    `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(selectedQrInstance)}/connect`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({})
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    setAuthMessage(data.error || "Falha ao atualizar QR.", "error");
    return;
  }

  await renderQrCode(data.qr, selectedQrInstance);
}

async function pollSelectedState() {
  if (!selectedQrInstance) {
    setAuthMessage("Selecione uma instancia primeiro.", "error");
    return;
  }

  const response = await apiFetch(
    `/api/v1/admin/devotional/evolution/instances/${encodeURIComponent(selectedQrInstance)}/state`,
    {
      headers: adminHeaders(false)
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    setAuthMessage(data.error || "Falha ao consultar status da linha.", "error");
    return;
  }

  const state = data.state?.state || "unknown";
  qrStatusText.textContent =
    state === "open"
      ? "Linha conectada com sucesso. Se quiser, agora marque esta instancia como ativa no bot."
      : `Estado atual da linha: ${state}.`;
  setAuthMessage(`Status de ${selectedQrInstance}: ${state}.`, "success");
  await loadDashboard();
}

function bootstrap() {
  adminKeyInput.value = adminKey;
  authForm.addEventListener("submit", handleAuth);
  createInstanceForm.addEventListener("submit", createInstance);
  instancesList.addEventListener("click", handleInstanceAction);
  subscriberForm.addEventListener("submit", saveSubscriber);
  manualSendForm.addEventListener("submit", manualSend);
  refreshQrBtn.addEventListener("click", refreshSelectedQr);
  pollStateBtn.addEventListener("click", pollSelectedState);
  refreshInstancesBtn.addEventListener("click", loadDashboard);

  if (adminKey) {
    loadDashboard()
      .then(() => setAuthMessage("Painel carregado com a chave salva neste navegador.", "success"))
      .catch((error) => setAuthMessage(error.message || "Falha ao recarregar o painel.", "error"));
  }
}

bootstrap();
