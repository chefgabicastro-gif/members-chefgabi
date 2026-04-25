const DEFAULT_API_BASE =
  window.location.hostname === "localhost" ? "http://localhost:4000" : window.location.origin.replace(":3000", ":4000");

const API_FALLBACKS = [DEFAULT_API_BASE, "http://127.0.0.1:4000", "https://da-crise-ao-chamado-api.onrender.com"];
const ADMIN_KEY_STORAGE = "dcc_content_admin_key";
const ADMIN_API_STORAGE = "dcc_content_admin_api_base";

let apiBase = localStorage.getItem(ADMIN_API_STORAGE) || DEFAULT_API_BASE;
let adminKey = localStorage.getItem(ADMIN_KEY_STORAGE) || "";
let contentItems = [];
let currentContentId = "";

const authForm = document.getElementById("authForm");
const adminKeyInput = document.getElementById("adminKeyInput");
const authMessage = document.getElementById("authMessage");
const contentForm = document.getElementById("contentForm");
const formMessage = document.getElementById("formMessage");
const resetFormButton = document.getElementById("resetFormButton");
const refreshButton = document.getElementById("refreshButton");
const deleteButton = document.getElementById("deleteButton");
const searchInput = document.getElementById("searchInput");
const contentList = document.getElementById("contentList");
const publishedCount = document.getElementById("publishedCount");
const draftCount = document.getElementById("draftCount");

const contentIdInput = document.getElementById("contentIdInput");
const typeInput = document.getElementById("typeInput");
const statusInput = document.getElementById("statusInput");
const titleInput = document.getElementById("titleInput");
const durationInput = document.getElementById("durationInput");
const moduleInput = document.getElementById("moduleInput");
const phaseInput = document.getElementById("phaseInput");
const summaryInput = document.getElementById("summaryInput");
const coverUrlInput = document.getElementById("coverUrlInput");
const verseInput = document.getElementById("verseInput");
const mediaUrlInput = document.getElementById("mediaUrlInput");
const downloadUrlInput = document.getElementById("downloadUrlInput");
const tagsInput = document.getElementById("tagsInput");
const introInput = document.getElementById("introInput");
const studyBaseInput = document.getElementById("studyBaseInput");
const conceptInput = document.getElementById("conceptInput");
const reflectionInput = document.getElementById("reflectionInput");
const applicationInput = document.getElementById("applicationInput");
const selfRevealInput = document.getElementById("selfRevealInput");
const godRevealInput = document.getElementById("godRevealInput");
const journalingInput = document.getElementById("journalingInput");
const prayerInput = document.getElementById("prayerInput");
const closingInput = document.getElementById("closingInput");

function setAuthMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.classList.remove("is-error", "is-success");
  if (type) authMessage.classList.add(type);
}

function setFormMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.classList.remove("is-error", "is-success");
  if (type) formMessage.classList.add(type);
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

function normalizeTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function resetForm() {
  currentContentId = "";
  contentIdInput.value = "";
  contentForm.reset();
  typeInput.value = "video";
  statusInput.value = "published";
  deleteButton.disabled = true;
  setFormMessage("Preencha os campos e publique um novo material premium.", "");
}

function fillForm(item) {
  currentContentId = item.id;
  contentIdInput.value = item.id || "";
  typeInput.value = item.type || "video";
  statusInput.value = item.status || "published";
  titleInput.value = item.title || "";
  durationInput.value = item.duration || "";
  moduleInput.value = item.module || "";
  phaseInput.value = item.phase || "";
  summaryInput.value = item.summary || "";
  coverUrlInput.value = item.coverUrl || "";
  verseInput.value = item.verse || "";
  mediaUrlInput.value = item.mediaUrl || "";
  downloadUrlInput.value = item.downloadUrl || "";
  tagsInput.value = Array.isArray(item.tags) ? item.tags.join(", ") : "";
  introInput.value = item.intro || "";
  studyBaseInput.value = item.studyBase || "";
  conceptInput.value = item.concept || "";
  reflectionInput.value = item.reflection || "";
  applicationInput.value = item.application || "";
  selfRevealInput.value = item.selfReveal || "";
  godRevealInput.value = item.godReveal || "";
  journalingInput.value = item.journaling || "";
  prayerInput.value = item.prayer || "";
  closingInput.value = item.closing || "";
  deleteButton.disabled = false;
  setFormMessage("Voce esta editando um material existente.", "is-success");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateSnapshot() {
  publishedCount.textContent = String(contentItems.filter((item) => item.status === "published").length);
  draftCount.textContent = String(contentItems.filter((item) => item.status !== "published").length);
}

function itemTypeLabel(type) {
  if (type === "video") return "Video";
  if (type === "audio") return "Audio";
  if (type === "pdf") return "PDF";
  if (type === "infographic") return "Infografico";
  if (type === "study") return "Estudo";
  return "Conteudo";
}

function renderContentList(query = "") {
  const q = query.trim().toLowerCase();
  const items = contentItems.filter((item) =>
    q
      ? [item.title, item.summary, item.module, item.phase, item.verse, ...(item.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true
  );

  if (!items.length) {
    contentList.innerHTML =
      '<article class="empty-card">Ainda nao ha materiais cadastrados. Crie o primeiro conteudo aqui ao lado e o acervo comeca a ganhar vida.</article>';
    return;
  }

  contentList.innerHTML = items
    .map(
      (item) => `
        <article class="content-item">
          <div class="content-item-head">
            <div>
              <span class="card-label">${itemTypeLabel(item.type)}</span>
              <strong>${item.title}</strong>
            </div>
            <span class="chip ${item.status === "published" ? "active" : "draft"}">${
              item.status === "published" ? "Publicado" : "Rascunho"
            }</span>
          </div>
          <p>${item.summary || "Sem resumo ainda."}</p>
          <div class="content-item-meta">
            ${item.module ? `<span class="chip">${item.module}</span>` : ""}
            ${item.phase ? `<span class="chip">${item.phase}</span>` : ""}
            ${item.duration ? `<span class="chip">${item.duration}</span>` : ""}
            ${item.verse ? `<span class="chip warning">${item.verse}</span>` : ""}
          </div>
          <div class="content-item-actions">
            <button class="ghost-btn" type="button" data-edit-id="${item.id}">Editar</button>
            <button class="danger-btn" type="button" data-delete-id="${item.id}">Excluir</button>
            ${
              item.mediaUrl
                ? `<button class="ghost-btn" type="button" data-open-url="${item.mediaUrl}">Abrir link</button>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

async function loadContentItems() {
  const response = await apiFetch("/api/v1/admin/content-items", {
    headers: adminHeaders(false)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Nao foi possivel carregar o acervo agora.");
  }

  contentItems = Array.isArray(payload.items) ? payload.items : [];
  updateSnapshot();
  renderContentList(searchInput.value);
}

function buildPayload() {
  return {
    id: contentIdInput.value.trim() || undefined,
    type: typeInput.value,
    status: statusInput.value,
    title: titleInput.value.trim(),
    duration: durationInput.value.trim(),
    module: moduleInput.value.trim(),
    phase: phaseInput.value.trim(),
    summary: summaryInput.value.trim(),
    coverUrl: coverUrlInput.value.trim(),
    verse: verseInput.value.trim(),
    mediaUrl: mediaUrlInput.value.trim(),
    downloadUrl: downloadUrlInput.value.trim(),
    tags: normalizeTags(tagsInput.value),
    intro: introInput.value.trim(),
    studyBase: studyBaseInput.value.trim(),
    concept: conceptInput.value.trim(),
    reflection: reflectionInput.value.trim(),
    application: applicationInput.value.trim(),
    selfReveal: selfRevealInput.value.trim(),
    godReveal: godRevealInput.value.trim(),
    journaling: journalingInput.value.trim(),
    prayer: prayerInput.value.trim(),
    closing: closingInput.value.trim()
  };
}

async function saveContentItem(event) {
  event.preventDefault();

  const payload = buildPayload();
  if (!payload.title || !payload.type) {
    setFormMessage("Titulo e tipo sao obrigatorios para salvar o material.", "is-error");
    return;
  }

  setFormMessage("Salvando material...", "is-success");

  const method = currentContentId ? "PUT" : "POST";
  const path = currentContentId ? `/api/v1/admin/content-items/${currentContentId}` : "/api/v1/admin/content-items";
  const response = await apiFetch(path, {
    method,
    headers: adminHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Nao foi possivel salvar o material agora.");
  }

  await loadContentItems();
  if (data.item) fillForm(data.item);
  setFormMessage("Material salvo com sucesso. O app premium ja pode consumir essa publicacao.", "is-success");
}

async function removeContentItem(id) {
  if (!id) return;

  const response = await apiFetch(`/api/v1/admin/content-items/${id}`, {
    method: "DELETE",
    headers: adminHeaders(false)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Nao foi possivel excluir este material.");
  }

  await loadContentItems();
  if (currentContentId === id) resetForm();
  setFormMessage("Material removido com sucesso.", "is-success");
}

async function handleAuth(event) {
  event.preventDefault();
  adminKey = adminKeyInput.value.trim();
  if (!adminKey) {
    setAuthMessage("Cole sua chave admin para liberar o painel.", "is-error");
    return;
  }

  localStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
  setAuthMessage("Validando acesso e carregando acervo...", "is-success");

  try {
    await loadContentItems();
    setAuthMessage("Painel liberado. Agora voce pode operar o acervo premium.", "is-success");
    setFormMessage("Tudo pronto para cadastrar o proximo material.", "");
  } catch (error) {
    setAuthMessage(error.message || "Nao foi possivel abrir o painel agora.", "is-error");
  }
}

authForm.addEventListener("submit", handleAuth);
contentForm.addEventListener("submit", async (event) => {
  try {
    await saveContentItem(event);
  } catch (error) {
    setFormMessage(error.message || "Falha ao salvar o material.", "is-error");
  }
});

resetFormButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", async () => {
  try {
    await loadContentItems();
    setFormMessage("Lista atualizada com sucesso.", "is-success");
  } catch (error) {
    setFormMessage(error.message || "Falha ao atualizar o acervo.", "is-error");
  }
});

deleteButton.addEventListener("click", async () => {
  if (!currentContentId) return;
  const confirmed = window.confirm("Deseja realmente excluir este material do acervo?");
  if (!confirmed) return;
  try {
    await removeContentItem(currentContentId);
  } catch (error) {
    setFormMessage(error.message || "Falha ao excluir o material.", "is-error");
  }
});

searchInput.addEventListener("input", () => renderContentList(searchInput.value));

contentList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const editButton = target.closest("[data-edit-id]");
  if (editButton instanceof HTMLElement) {
    const item = contentItems.find((entry) => entry.id === editButton.dataset.editId);
    if (item) fillForm(item);
    return;
  }

  const deleteAction = target.closest("[data-delete-id]");
  if (deleteAction instanceof HTMLElement) {
    const confirmed = window.confirm("Deseja realmente excluir este material do acervo?");
    if (!confirmed) return;
    try {
      await removeContentItem(deleteAction.dataset.deleteId || "");
    } catch (error) {
      setFormMessage(error.message || "Falha ao excluir o material.", "is-error");
    }
    return;
  }

  const openUrlButton = target.closest("[data-open-url]");
  if (openUrlButton instanceof HTMLElement) {
    window.open(openUrlButton.dataset.openUrl || "", "_blank", "noopener,noreferrer");
  }
});

function bootstrap() {
  adminKeyInput.value = adminKey;
  resetForm();
  if (!adminKey) return;

  loadContentItems()
    .then(() => setAuthMessage("Painel restaurado neste navegador.", "is-success"))
    .catch((error) => setAuthMessage(error.message || "Nao foi possivel restaurar o painel.", "is-error"));
}

bootstrap();
