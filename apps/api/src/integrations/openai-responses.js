import { devotionalConfig } from "../config/devotional.js";

const OPENAI_URL = "https://api.openai.com/v1/responses";

function extractText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const chunks = [];
  for (const output of response?.output || []) {
    for (const content of output?.content || []) {
      if (content?.type === "output_text" && content.text) {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join("\n").trim();
}

export async function generateDevotionalMessage({ slot, dateLabel, audience = "individual" }) {
  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY nao configurada");
  }

  const periodLabel = slot === "07:00" ? "manha" : slot === "19:00" ? "noite" : "dia";
  const body = {
    model: devotionalConfig.openaiModel,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              `Gere um devocional para o periodo da ${periodLabel}.`,
              `Data local: ${dateLabel}.`,
              `Publico: ${audience}.`,
              "Escreva em portugues do Brasil.",
              "Inclua referencia biblica explicita e uma reflexao pratica alinhada ao texto."
            ].join(" ")
          }
        ]
      }
    ],
    instructions: devotionalConfig.prompt,
    max_output_tokens: devotionalConfig.maxOutputTokens
  };

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao gerar devocional no OpenAI: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  const text = extractText(json);
  if (!text) {
    throw new Error("OpenAI retornou resposta sem texto");
  }

  return {
    id: json.id || null,
    text
  };
}
