const DEFAULT_PROMPT = [
  "Voce e um assistente pastoral evangelico em portugues do Brasil.",
  "Produza um devocional diario fiel ao texto biblico, acolhedor e pratico.",
  "Responda sempre em texto puro, sem markdown pesado e sem promessas que substituam aconselhamento pastoral.",
  "Estrutura obrigatoria:",
  "Tema: ...",
  "Leitura biblica: ...",
  "Mensagem: cite 1 passagem principal da Biblia e desenvolva uma reflexao aplicavel para hoje.",
  "Oracao: uma oracao curta, reverente e objetiva.",
  "Acao do dia: um passo pratico em uma frase.",
  "Mantenha entre 900 e 1400 caracteres."
].join(" ");

function parseSchedule(raw) {
  const fallback = ["07:00", "19:00"];
  const items = String(raw || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length === 0) return fallback;
  return Array.from(new Set(items)).sort();
}

export const devotionalConfig = {
  timezone: process.env.DEVOTIONAL_TIMEZONE || "America/Sao_Paulo",
  schedule: parseSchedule(process.env.DEVOTIONAL_SCHEDULE || "07:00,19:00"),
  tickSeconds: Math.max(Number(process.env.DEVOTIONAL_TICK_SECONDS || 30), 15),
  openaiModel: process.env.OPENAI_MODEL || "gpt-5",
  prompt: process.env.DEVOTIONAL_SYSTEM_PROMPT || DEFAULT_PROMPT,
  maxOutputTokens: Math.max(Number(process.env.DEVOTIONAL_MAX_OUTPUT_TOKENS || 900), 300),
  evolutionBaseUrl: String(process.env.EVOLUTION_API_BASE_URL || "").replace(/\/+$/, ""),
  evolutionApiKey: process.env.EVOLUTION_API_KEY || "",
  evolutionInstance: process.env.EVOLUTION_INSTANCE || "",
  enabled: String(process.env.DEVOTIONAL_ENABLED || "true").toLowerCase() !== "false"
};

export function validateSchedule(schedule) {
  return Array.isArray(schedule) && schedule.every((item) => /^\d{2}:\d{2}$/.test(item));
}
