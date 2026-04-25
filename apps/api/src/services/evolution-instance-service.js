import { devotionalConfig } from "../config/devotional.js";
import { getDevotionalSettings, setActiveEvolutionInstance } from "../lib/db.js";

function evolutionHeaders(extra = {}) {
  return {
    apikey: devotionalConfig.evolutionApiKey,
    ...extra
  };
}

function ensureEvolutionConfigured() {
  if (!devotionalConfig.evolutionBaseUrl) {
    throw new Error("EVOLUTION_API_BASE_URL nao configurada");
  }
  if (!devotionalConfig.evolutionApiKey) {
    throw new Error("EVOLUTION_API_KEY nao configurada");
  }
}

async function evolutionRequest(pathname, options = {}) {
  ensureEvolutionConfigured();
  const response = await fetch(`${devotionalConfig.evolutionBaseUrl}${pathname}`, {
    ...options,
    headers: {
      ...evolutionHeaders(options.headers || {})
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Evolution API ${response.status}: ${errorText}`);
  }

  return response.json().catch(() => ({}));
}

export function getActiveEvolutionInstance() {
  const settings = getDevotionalSettings();
  return settings.activeEvolutionInstance || devotionalConfig.evolutionInstance || "";
}

export async function fetchEvolutionInstances() {
  const items = await evolutionRequest("/instance/fetchInstances");
  const activeInstance = getActiveEvolutionInstance();
  return (Array.isArray(items) ? items : [])
    .map((entry) => {
      const instance = entry?.instance || {};
      return {
        instanceName: instance.instanceName || "",
        instanceId: instance.instanceId || "",
        status: instance.status || "unknown",
        owner: instance.owner || "",
        profileName: instance.profileName || "",
        profilePictureUrl: instance.profilePictureUrl || null,
        integration: instance.integration?.integration || "",
        serverUrl: instance.serverUrl || devotionalConfig.evolutionBaseUrl,
        apikey: instance.apikey || null,
        isActive: instance.instanceName === activeInstance
      };
    })
    .sort((a, b) => Number(b.isActive) - Number(a.isActive) || a.instanceName.localeCompare(b.instanceName));
}

export async function fetchEvolutionConnectionState(instanceName) {
  const data = await evolutionRequest(`/instance/connectionState/${encodeURIComponent(instanceName)}`);
  return {
    instanceName: data?.instance?.instanceName || instanceName,
    state: data?.instance?.state || "unknown"
  };
}

export async function connectEvolutionInstance(instanceName, phone = "") {
  const query = phone ? `?number=${encodeURIComponent(phone)}` : "";
  return evolutionRequest(`/instance/connect/${encodeURIComponent(instanceName)}${query}`);
}

export async function createEvolutionInstance({ instanceName, number = "", token = "" }) {
  const payload = {
    instanceName,
    token,
    qrcode: true,
    number,
    integration: "WHATSAPP-BAILEYS"
  };

  return evolutionRequest("/instance/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function restartEvolutionInstance(instanceName) {
  return evolutionRequest(`/instance/restart/${encodeURIComponent(instanceName)}`, {
    method: "PUT"
  });
}

export async function logoutEvolutionInstance(instanceName) {
  return evolutionRequest(`/instance/logout/${encodeURIComponent(instanceName)}`, {
    method: "DELETE"
  });
}

export async function deleteEvolutionInstance(instanceName) {
  return evolutionRequest(`/instance/delete/${encodeURIComponent(instanceName)}`, {
    method: "DELETE"
  });
}

export function selectActiveEvolutionInstance(instanceName) {
  return setActiveEvolutionInstance(instanceName);
}
