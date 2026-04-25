import { devotionalConfig } from "../config/devotional.js";
import { getActiveEvolutionInstance } from "../services/evolution-instance-service.js";

function normalizePhone(phone) {
  return String(phone || "").replace(/\D+/g, "");
}

export function ensureWhatsAppNumber(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw new Error("Telefone invalido");
  }
  return normalized;
}

export async function sendTextMessage({ phone, text }) {
  if (!devotionalConfig.evolutionBaseUrl) {
    throw new Error("EVOLUTION_API_BASE_URL nao configurada");
  }
  if (!devotionalConfig.evolutionApiKey) {
    throw new Error("EVOLUTION_API_KEY nao configurada");
  }
  const activeInstance = getActiveEvolutionInstance();
  if (!activeInstance) {
    throw new Error("Nenhuma instancia Evolution ativa configurada");
  }

  const response = await fetch(
    `${devotionalConfig.evolutionBaseUrl}/message/sendText/${encodeURIComponent(activeInstance)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: devotionalConfig.evolutionApiKey
      },
      body: JSON.stringify({
        number: ensureWhatsAppNumber(phone),
        text,
        delay: 500,
        linkPreview: false
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar mensagem no Evolution: ${response.status} ${errorText}`);
  }

  return response.json();
}
