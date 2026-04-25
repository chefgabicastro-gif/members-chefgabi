const appData = {
  progress: 32,
  featured: {
    id: "journey-main",
    label: "Jornada premium",
    title: "Da Crise ao Chamado",
    description:
      "Uma trilha cinematografica para sair da exaustao, reorganizar a mente, curar a identidade e responder ao chamado com profundidade.",
    tags: ["4 modulos", "video + audio + leitura", "continue do ponto em que parou"],
    sections: [
      { title: "Modulo 1 - O colapso", description: "Reconhecer a crise sem culpa espiritual." },
      { title: "Modulo 2 - O rotulo", description: "Romper narrativas que sequestraram sua identidade." },
      { title: "Modulo 3 - A reconstrucao", description: "Consolidar nova percepcao, nova mente e nova estrutura." },
      { title: "Modulo 4 - O chamado", description: "Transformar dor atravessada em direcao e missao." }
    ],
    deliverables: [
      { title: "Video principal", description: "Aulas com narrativa forte, estudo biblico e aplicacao real." },
      { title: "Audio complementar", description: "Faixas para escuta noturna, meditativa e de reforco." },
      { title: "Material escrito", description: "Resumo, reflexao guiada, exercicios e checkpoints." }
    ]
  },
  formats: [
    { id: "modulos", title: "Video por modulo", copy: "A trilha principal com estrutura cinematografica e progressiva." },
    { id: "audios", title: "Audios guiados", copy: "Escuta para madrugada, ansiedade, respiracao e acolhimento." },
    { id: "leituras", title: "Leituras premium", copy: "Resumos, devocionais, biblioteca de versiculos e PDFs." },
    { id: "planos", title: "Planos guiados", copy: "Rotas de 7, 14 e 21 dias para fases especificas da jornada." }
  ],
  continueWatching: [
    {
      id: "continue-1",
      label: "Continue",
      title: "Modulo 2 - O rotulo que te prendeu",
      description: "Voce ja iniciou este modulo. Falta a aula de reforco e o exercicio de identidade.",
      tags: ["78% concluido", "video", "audio de reforco"],
      sections: [{ title: "Proximo item", description: "Aula curta - da vergonha a verdade." }],
      deliverables: [{ title: "Exercicio complementar", description: "Checklist de identidade e frases-raiz." }]
    },
    {
      id: "continue-2",
      label: "Continue",
      title: "Audio - Quando voce nao consegue orar",
      description: "Uma faixa para quando faltam palavras, mas ainda existe busca.",
      tags: ["9 min", "oracao", "modo madrugada"],
      sections: [{ title: "Escuta recomendada", description: "Use a faixa antes de dormir ou em crises leves." }],
      deliverables: [{ title: "Texto transcrito", description: "Versao escrita para leitura silenciosa." }]
    }
  ],
  emergency: [
    {
      id: "emergency-1",
      label: "Emergencia",
      title: "Ansiedade e falta de ar",
      description: "Respiracao guiada, versiculo ancora e oracao curta para estabilizar o presente.",
      tags: ["7 min", "respiracao", "rapido"],
      sections: [{ title: "Fluxo", description: "Respire, ouca, ancore, reduza." }],
      deliverables: [{ title: "Modo repeticao", description: "Escuta continua para momentos intensos." }]
    },
    {
      id: "emergency-2",
      label: "Emergencia",
      title: "Madrugada de culpa",
      description: "Uma trilha curta para quando a mente reabre feridas no silencio da noite.",
      tags: ["12 min", "noite", "acolhimento"],
      sections: [{ title: "Fluxo", description: "Acolher, lembrar, respirar, entregar." }],
      deliverables: [{ title: "Versiculos-chave", description: "Textos para culpa, medo e descanso." }]
    }
  ],
  modules: [
    {
      id: "module-1",
      label: "Modulo 1",
      title: "Quando tudo desmorona",
      description: "Daniel, Elias e Jonas ajudam o aluno a reconhecer crise, injustica, fuga e esgotamento sem mascarar a dor.",
      cover: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
      tags: ["video", "leitura", "checkpoint"],
      sections: [
        { title: "Aula principal", description: "O que acontece quando a mente entra em colapso." },
        { title: "Leitura guiada", description: "Crise emocional com linguagem biblica acessivel." },
        { title: "Exercicio", description: "Nomear a dor sem se confundir com ela." }
      ],
      deliverables: [
        { title: "PDF de processamento", description: "Espaco para escrever o que desmoronou e o que ainda permanece." }
      ]
    },
    {
      id: "module-2",
      label: "Modulo 2",
      title: "O rotulo que te prendeu",
      description: "Identidade, vergonha, diagnostico e medo vistos com profundidade e cuidado.",
      cover: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      tags: ["video", "audio", "versiculos"],
      sections: [
        { title: "Aula principal", description: "Diagnostico, rotulo e verdade nao sao a mesma coisa." },
        { title: "Audio de reforco", description: "Faixa para quebrar autoacusacao e reforcar identidade." },
        { title: "Biblioteca tematica", description: "Versiculos para vergonha, medo e culpa." }
      ],
      deliverables: [
        { title: "Checklist de identidade", description: "Ferramenta para reconhecer frases que ainda governam a mente." }
      ]
    },
    {
      id: "module-3",
      label: "Modulo 3",
      title: "Quem voce e depois da crise",
      description: "Reconstrucao, neuroplasticidade, restauracao e o nascimento de uma nova estrutura interna.",
      cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
      tags: ["video", "plano", "diario"],
      sections: [
        { title: "Aula principal", description: "Por que voltar ao que era nao e o objetivo." },
        { title: "Diario guiado", description: "Mapear mudancas, gatilhos e sinais de progresso." },
        { title: "Plano de 7 dias", description: "Consolidar a reconstrucao na pratica." }
      ],
      deliverables: [
        { title: "Planner de restauracao", description: "Mini sistema para acompanhar verdade, rotina e progresso." }
      ]
    },
    {
      id: "module-4",
      label: "Modulo 4",
      title: "O chamado que esperava pela sua dor",
      description: "Sentido, testemunho e missao como resposta final para a dor atravessada.",
      cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
      tags: ["video", "missao", "comunidade"],
      sections: [
        { title: "Aula principal", description: "Como dor atravessada se transforma em ponte para outros." },
        { title: "Mapa do chamado", description: "Onde sua historia encontra necessidade real." },
        { title: "Acao final", description: "Um primeiro gesto de missao, cuidado ou testemunho." }
      ],
      deliverables: [
        { title: "Roteiro de testemunho", description: "Estrutura para organizar sua historia com clareza e intencao." }
      ]
    }
  ],
  audio: [
    {
      id: "audio-1",
      label: "Audio noturno",
      title: "Quando a mente nao desacelera",
      description: "Escuta para madrugada, ansiedade e excesso de pensamentos.",
      cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      tags: ["12 min", "respiracao", "noite"],
      sections: [
        { title: "Abertura", description: "Acolhimento e aterrissagem do corpo." },
        { title: "Oracao guiada", description: "Palavra curta para reduzir culpa e medo." }
      ],
      deliverables: [{ title: "Audio offline", description: "Baixe e ouca em qualquer momento." }]
    },
    {
      id: "audio-2",
      label: "Playlist de emergencia",
      title: "Ansiedade e falta de ar",
      description: "Faixa curta para regular, respirar e voltar para o presente.",
      cover: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80",
      tags: ["7 min", "emergencia", "respiracao"],
      sections: [{ title: "Fluxo", description: "Respirar, ancorar, orar e desacelerar." }],
      deliverables: [{ title: "Modo repeticao", description: "Escuta ciclica para momentos intensos." }]
    },
    {
      id: "audio-3",
      label: "Oracao guiada",
      title: "Quando voce nao consegue orar",
      description: "Uma faixa para quando faltam palavras, mas ainda existe busca.",
      cover: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=900&q=80",
      tags: ["9 min", "oracao", "acolhimento"],
      sections: [{ title: "Corpo da oracao", description: "Intercessao, entrega e descanso guiados." }],
      deliverables: [{ title: "Texto transcrito", description: "Versao escrita para leitura silenciosa." }]
    }
  ],
  readings: [
    {
      id: "reading-1",
      label: "Leitura premium",
      title: "Biblioteca de versiculos por dor",
      description: "Medo, vergonha, exaustao, ansiedade, luto, chamado e identidade organizados por tema.",
      tags: ["busca por tema", "favoritos", "PDF"],
      sections: [{ title: "Categorias", description: "Versiculos organizados por estado emocional." }],
      deliverables: [{ title: "Modo salvar", description: "Monte sua colecao pessoal de textos-chave." }]
    },
    {
      id: "reading-2",
      label: "Devocional",
      title: "Reflexoes para a manha e para a noite",
      description: "Leituras curtas com direcao emocional e espiritual para comecar e encerrar o dia.",
      tags: ["manha", "noite", "checklist"],
      sections: [{ title: "Fluxo diario", description: "Alinhamento pela manha e fechamento pela noite." }],
      deliverables: [{ title: "Checklist", description: "Marque leituras concluidas ao longo da semana." }]
    }
  ],
  library: [
    {
      id: "library-1",
      label: "PDF premium",
      title: "Guia de leitura e aplicacao",
      description: "Material escrito para acompanhar cada modulo com perguntas, espacos de escrita e checkpoints.",
      tags: ["PDF", "exercicios", "aplicacao"],
      sections: [{ title: "Uso", description: "Acompanhe o modulo em paralelo e processe melhor cada etapa." }],
      deliverables: [{ title: "Versao imprimivel", description: "Formato para usar fora da tela." }]
    },
    {
      id: "library-2",
      label: "Biblioteca",
      title: "Versiculos por tema e fase da jornada",
      description: "Colecoes para crise, identidade, reconstrucao e chamado.",
      tags: ["temas", "favoritos", "colecoes"],
      sections: [{ title: "Filtro", description: "Acesse por dor, tema ou fase da trilha." }],
      deliverables: [{ title: "Modo favorito", description: "Salve textos para revisitar rapidamente." }]
    }
  ],
  plans: [
    {
      id: "plan-1",
      label: "Plano guiado",
      title: "7 dias para sair do colapso",
      description: "Uma rota curta para quem precisa de acolhimento, clareza e primeiros passos.",
      tags: ["7 dias", "video + audio", "inicio"],
      sections: [{ title: "Fluxo", description: "Nomear, acolher, reorganizar e estabilizar." }],
      deliverables: [{ title: "Checklist diario", description: "Pequenas praticas para manter continuidade." }]
    },
    {
      id: "plan-2",
      label: "Plano guiado",
      title: "14 dias de restauracao emocional",
      description: "Jornada para consolidar identidade, verdade e rotina base com profundidade.",
      tags: ["14 dias", "intermediario", "reconstrucao"],
      sections: [{ title: "Semanas", description: "Acolhimento e reordenacao na semana 1; direcao e movimento na semana 2." }],
      deliverables: [{ title: "Diario emocional", description: "Checkpoints para humor, gatilhos e progresso." }]
    }
  ],
  tools: [
    {
      id: "tool-1",
      label: "Ferramenta",
      title: "Diario emocional premium",
      description: "Checkpoints de humor, fe, gatilhos, verdade e progresso da semana.",
      tags: ["checkpoints", "humor", "fe"],
      sections: [{ title: "Check-in diario", description: "Humor, gatilho e verdade do dia." }],
      deliverables: [{ title: "Exportar PDF", description: "Leve seu historico para acompanhamento externo." }]
    },
    {
      id: "tool-2",
      label: "Ferramenta",
      title: "Rotina base de restauracao",
      description: "Mini sistema para manter agua, sono, leitura, oracao e pequenas vitorias visiveis.",
      tags: ["rotina", "tracking", "base"],
      sections: [{ title: "Base", description: "Proteger o minimo vital antes de exigir alta performance." }],
      deliverables: [{ title: "Lembretes suaves", description: "Convites e nao pressao." }]
    }
  ],
  extras: [
    {
      id: "extra-1",
      label: "Comunidade",
      title: "Testemunhos e acompanhamento",
      description: "Ambiente moderado para ouvir historias, compartilhar marcos e permanecer na jornada.",
      cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
      tags: ["comunidade", "moderado", "pertencimento"],
      sections: [{ title: "Espaco seguro", description: "Participacao guiada e foco em apoio real." }],
      deliverables: [{ title: "Topicos tematicos", description: "Crise, ansiedade, identidade, chamado e restauracao." }]
    },
    {
      id: "extra-2",
      label: "Biblioteca",
      title: "Playlists de emergencia",
      description: "Colecoes para madrugada, ansiedade, exaustao e retomada do foco.",
      cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
      tags: ["madrugada", "ansiedade", "repeticao"],
      sections: [{ title: "Escolha rapida", description: "Acesse por estado emocional e intensidade." }],
      deliverables: [{ title: "Atalho fixo", description: "Botao de acesso rapido para urgencias." }]
    },
    {
      id: "extra-3",
      label: "Ferramenta",
      title: "Mapa do chamado",
      description: "Uma superficie para transformar sua historia em direcao, servico e linguagem de cuidado.",
      cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
      tags: ["missao", "proposito", "acao"],
      sections: [{ title: "Mapa", description: "Onde sua historia encontra necessidade real." }],
      deliverables: [{ title: "Roteiro de resposta", description: "Um primeiro gesto de missao ou testemunho." }]
    }
  ]
};

const SESSION_KEY = "dcc_premium_session";
const GAME_STATE_KEY = "dcc_game_state";
const JOURNAL_STATE_KEY = "dcc_reader_journal";
const ONBOARDING_KEY = "dcc_onboarding_seen";
const missionsCatalog = [
  {
    id: "mission-reading",
    title: "Ler um estudo escrito ate o fim",
    description: "Escolha uma base biblica e atravesse o texto com pausa, anotacao e honestidade.",
    xp: 40,
    category: "Leitura profunda"
  },
  {
    id: "mission-audio",
    title: "Ouvir uma trilha de regulacao",
    description: "Use um audio guiado para respirar, desacelerar e reorganizar a mente no presente.",
    xp: 25,
    category: "Cuidado emocional"
  },
  {
    id: "mission-journal",
    title: "Registrar uma reflexao no diario",
    description: "Escreva o que o texto tocou, o que revelou e o que precisa virar resposta pratica.",
    xp: 35,
    category: "Processamento"
  },
  {
    id: "mission-return",
    title: "Voltar a plataforma a noite",
    description: "Retorne para consolidar o dia e nao deixar o impacto evaporar antes do descanso.",
    xp: 30,
    category: "Constancia"
  }
];
const badgeCatalog = [
  { id: "badge-first-step", title: "Primeiro passo", description: "Conclua sua primeira missao dentro da area premium.", threshold: 1, type: "missions" },
  { id: "badge-reader", title: "Leitor das profundezas", description: "Complete 3 missoes e mostre que sua jornada tem constancia.", threshold: 3, type: "missions" },
  { id: "badge-flame", title: "Chama acesa", description: "Alcance 120 XP e mantenha a jornada em movimento.", threshold: 120, type: "xp" },
  { id: "badge-builder", title: "Reconstrutor", description: "Alcance 220 XP e prove que esta construindo uma nova estrutura.", threshold: 220, type: "xp" }
];
const authGate = document.getElementById("authGate");
const memberApp = document.getElementById("memberApp");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const loginButton = document.getElementById("loginButton");
const fillAdminEmailButton = document.getElementById("fillAdminEmailButton");
const authMessage = document.getElementById("authMessage");
const accessState = document.getElementById("accessState");
const retryAccessButton = document.getElementById("retryAccessButton");
const switchEmailButton = document.getElementById("switchEmailButton");
const memberName = document.getElementById("memberName");
const memberPlan = document.getElementById("memberPlan");
const logoutButton = document.getElementById("logoutButton");
const featuredPill = document.getElementById("featuredPill");
const featuredTitle = document.getElementById("featuredTitle");
const featuredDescription = document.getElementById("featuredDescription");
const featuredMeta = document.getElementById("featuredMeta");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingDescription = document.getElementById("nowPlayingDescription");
const nextStepTitle = document.getElementById("nextStepTitle");
const nextStepDescription = document.getElementById("nextStepDescription");
const journeyPercent = document.getElementById("journeyPercent");
const journeyBar = document.getElementById("journeyBar");
const formatChips = document.getElementById("formatChips");
const continueList = document.getElementById("continueList");
const emergencyList = document.getElementById("emergencyList");
const modulesRail = document.getElementById("modulesRail");
const audioRail = document.getElementById("audioRail");
const readingList = document.getElementById("readingList");
const libraryList = document.getElementById("libraryList");
const plansList = document.getElementById("plansList");
const toolsList = document.getElementById("toolsList");
const extrasRail = document.getElementById("extrasRail");
const contentLibraryGrid = document.getElementById("contentLibraryGrid");
const adminMediaGrid = document.getElementById("adminMediaGrid");
const readerSpotlight = document.getElementById("readerSpotlight");
const phaseRail = document.getElementById("phaseRail");
const checkpointPanel = document.getElementById("checkpointPanel");
const levelValue = document.getElementById("levelValue");
const levelCopy = document.getElementById("levelCopy");
const streakValue = document.getElementById("streakValue");
const badgeValue = document.getElementById("badgeValue");
const xpValue = document.getElementById("xpValue");
const xpStatus = document.getElementById("xpStatus");
const xpBar = document.getElementById("xpBar");
const missionList = document.getElementById("missionList");
const badgeGrid = document.getElementById("badgeGrid");
const sidebarXp = document.getElementById("sidebarXp");
const sidebarMission = document.getElementById("sidebarMission");
const featuredPlayBtn = document.getElementById("featuredPlayBtn");
const featuredDetailBtn = document.getElementById("featuredDetailBtn");
const continueBtn = document.getElementById("continueBtn");
const searchInput = document.getElementById("searchInput");
const detailSheet = document.getElementById("detailSheet");
const sheetType = document.getElementById("sheetType");
const sheetTitle = document.getElementById("sheetTitle");
const sheetDescription = document.getElementById("sheetDescription");
const sheetTags = document.getElementById("sheetTags");
const sheetModules = document.getElementById("sheetModules");
const sheetDeliverables = document.getElementById("sheetDeliverables");
const downloadToggle = document.getElementById("downloadToggle");
const sheetPrimaryBtn = document.getElementById("sheetPrimaryBtn");
const focusReader = document.getElementById("focusReader");
const readerModule = document.getElementById("readerModule");
const readerTitle = document.getElementById("readerTitle");
const readerSummary = document.getElementById("readerSummary");
const readerTags = document.getElementById("readerTags");
const readerVerse = document.getElementById("readerVerse");
const readerIntro = document.getElementById("readerIntro");
const readerStudyBase = document.getElementById("readerStudyBase");
const readerConcept = document.getElementById("readerConcept");
const readerReflection = document.getElementById("readerReflection");
const readerApplication = document.getElementById("readerApplication");
const readerSelfReveal = document.getElementById("readerSelfReveal");
const readerGodReveal = document.getElementById("readerGodReveal");
const readerJournaling = document.getElementById("readerJournaling");
const readerPrayer = document.getElementById("readerPrayer");
const readerClosing = document.getElementById("readerClosing");
const readerJournal = document.getElementById("readerJournal");
const saveJournalButton = document.getElementById("saveJournalButton");
const completeReadingButton = document.getElementById("completeReadingButton");
const journalStatus = document.getElementById("journalStatus");
const onboardingModal = document.getElementById("onboardingModal");
const startJourneyButton = document.getElementById("startJourneyButton");
const exploreAppButton = document.getElementById("exploreAppButton");
const navButtons = Array.from(document.querySelectorAll("[data-nav]"));
const sections = Array.from(document.querySelectorAll(".app-section"));

let apiBase = "";
let observer = null;
let currentSession = readStoredSession();
let appBooted = false;
let contentCollections = [];
let adminContentItems = [];
let gameState = readGameState();
let journalState = readJournalState();
let currentReaderItem = null;

const phaseCatalog = [
  { id: "colapso", title: "Colapso", description: "Quando a alma ainda esta tentando sobreviver ao peso, ao medo e ao esgotamento.", matches: ["Modulo 1 - O colapso"] },
  { id: "rotulo", title: "Rotulo", description: "Quando a batalha principal acontece na identidade, na culpa e na forma como voce se enxerga.", matches: ["Modulo 2 - O rotulo"] },
  { id: "reconstrucao", title: "Reconstrucao", description: "Quando a cura vira processo e a mente precisa de verdade repetida com constancia.", matches: ["Modulo 3 - A reconstrucao"] },
  { id: "chamado", title: "Chamado", description: "Quando a historia comeca a ganhar direcao, linguagem de servico e maturidade para missao.", matches: ["Modulo 4 - O chamado"] }
];

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  currentSession = session;
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore local storage failure
  }
}

function defaultGameState() {
  return {
    xp: 0,
    missionsCompleted: [],
    completedCount: 0,
    streak: 0,
    lastCompletedOn: "",
    badgesUnlocked: []
  };
}

function readGameState() {
  try {
    const raw = window.localStorage.getItem(GAME_STATE_KEY);
    return raw ? { ...defaultGameState(), ...JSON.parse(raw) } : defaultGameState();
  } catch {
    return defaultGameState();
  }
}

function persistGameState() {
  try {
    window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch {
    // ignore local storage failure
  }
}

function readJournalState() {
  try {
    const raw = window.localStorage.getItem(JOURNAL_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistJournalState() {
  try {
    window.localStorage.setItem(JOURNAL_STATE_KEY, JSON.stringify(journalState));
  } catch {
    // ignore local storage failure
  }
}

async function loadApiBase() {
  const isLocalHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  try {
    const response = await fetch("./config.json", { cache: "no-store" });
    if (response.ok) {
      const config = await response.json();
      if (isLocalHost && config.localApiBase) return config.localApiBase;
      if (config.apiBase) return config.apiBase;
    }
  } catch {
    // fallback below
  }
  return isLocalHost ? "http://127.0.0.1:4000" : window.location.origin.replace(":3000", ":4000");
}

async function loadContentLibrary() {
  try {
    const response = await fetch("./content-library.json", { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.collections) ? data.collections : [];
  } catch {
    return [];
  }
}

async function loadManagedContentItems() {
  try {
    const data = await apiRequest("/api/v1/content-items");
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

function getEmailFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("email") || "";
}

function setAuthMessage(message, tone = "") {
  authMessage.textContent = message;
  authMessage.classList.remove("is-error", "is-success");
  if (tone) {
    authMessage.classList.add(tone);
  }
}

function setAccessStateVisible(isVisible) {
  accessState.classList.toggle("hidden", !isVisible);
}

function setLoginLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Validando seu acesso..." : "Entrar com meu e-mail";
}

function hasSeenOnboarding() {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

function markOnboardingSeen() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // ignore storage failure
  }
}

function formatDisplayName(user) {
  const source = user?.name || user?.email || "Membro premium";
  return source
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLevelFromXp(xp) {
  if (xp >= 220) return { label: "Nivel 4", copy: "Sua jornada ja respira maturidade, constancia e discernimento." };
  if (xp >= 120) return { label: "Nivel 3", copy: "Voce saiu do impacto inicial e entrou em construcao consciente." };
  if (xp >= 60) return { label: "Nivel 2", copy: "A sua constancia comecou a formar profundidade real." };
  return { label: "Nivel 1", copy: "Toda profundidade comeca com constancia." };
}

function syncBadges() {
  const unlocked = badgeCatalog
    .filter((badge) => {
      if (badge.type === "missions") return gameState.completedCount >= badge.threshold;
      return gameState.xp >= badge.threshold;
    })
    .map((badge) => badge.id);
  gameState.badgesUnlocked = unlocked;
}

function formatStreakLabel(days) {
  return `${days} ${days === 1 ? "dia" : "dias"}`;
}

function renderGamification() {
  syncBadges();
  const level = getLevelFromXp(gameState.xp);
  const nextThreshold = gameState.xp < 60 ? 60 : gameState.xp < 120 ? 120 : gameState.xp < 220 ? 220 : 300;
  const progressPercent = Math.min(100, Math.round((gameState.xp / nextThreshold) * 100));
  levelValue.textContent = level.label;
  levelCopy.textContent = level.copy;
  streakValue.textContent = formatStreakLabel(gameState.streak);
  badgeValue.textContent = `${gameState.badgesUnlocked.length} desbloqueados`;
  xpValue.textContent = `${gameState.xp} XP`;
  xpStatus.textContent =
    gameState.xp === 0
      ? "Sua consistencia ainda vai acender os primeiros marcos."
      : `Voce esta construindo presenca, profundidade e retorno. Proximo marco em ${nextThreshold} XP.`;
  xpBar.style.width = `${progressPercent}%`;
  sidebarXp.textContent = `${gameState.xp} XP`;
  sidebarMission.textContent =
    gameState.completedCount === 0
      ? "Comece sua primeira missao do dia e transforme constancia em profundidade."
      : `Voce ja concluiu ${gameState.completedCount} missoes nesta jornada. Continue firme.`;

  missionList.innerHTML = missionsCatalog
    .map((mission) => {
      const completed = gameState.missionsCompleted.includes(mission.id);
      return `
        <article class="mission-card ${completed ? "completed" : ""}">
          <span class="card-label">${mission.category}</span>
          <strong>${mission.title}</strong>
          <p>${mission.description}</p>
          <div class="mission-meta">
            <span>${mission.xp} XP</span>
            <span>${completed ? "Concluida" : "Disponivel agora"}</span>
          </div>
          <button class="primary-btn mission-action" type="button" data-mission-id="${mission.id}">
            ${completed ? "Concluida" : "Marcar como concluida"}
          </button>
        </article>
      `;
    })
    .join("");

  badgeGrid.innerHTML = badgeCatalog
    .map((badge) => {
      const unlocked = gameState.badgesUnlocked.includes(badge.id);
      return `
        <article class="badge-card ${unlocked ? "unlocked" : ""}">
          <span class="card-label">${unlocked ? "Liberado" : "Bloqueado"}</span>
          <strong>${badge.title}</strong>
          <p>${badge.description}</p>
          <div class="badge-meta">
            <span>${badge.type === "xp" ? `${badge.threshold} XP` : `${badge.threshold} missoes`}</span>
          </div>
          <span class="badge-lock">${unlocked ? "Badge conquistado." : "Continue a jornada para destravar este marco."}</span>
        </article>
      `;
    })
    .join("");
}

function completeMission(missionId) {
  if (gameState.missionsCompleted.includes(missionId)) return;
  const mission = missionsCatalog.find((item) => item.id === missionId);
  if (!mission) return;

  gameState.missionsCompleted.push(missionId);
  gameState.completedCount += 1;
  gameState.xp += mission.xp;
  const today = new Date().toISOString().slice(0, 10);
  if (gameState.lastCompletedOn !== today) {
    gameState.streak += 1;
    gameState.lastCompletedOn = today;
  }
  persistGameState();
  renderGamification();
  renderImmersiveExperience();
}

function spotlightItem() {
  return contentCollections[0] || null;
}

function renderReaderSpotlight() {
  const item = spotlightItem();
  if (!item) {
    readerSpotlight.innerHTML = "";
    return;
  }

  readerSpotlight.innerHTML = `
    <article class="reader-spotlight-card">
      <span class="card-label">${item.module}</span>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="phase-meta">
        <span>${item.verse}</span>
        <span>${item.category}</span>
        <span>${item.theme}</span>
      </div>
      <div class="reader-spotlight-actions">
        <button class="primary-btn" type="button" data-reader-open="${item.id}">Entrar no modo foco</button>
        <button class="ghost-btn" type="button" data-mission-id="mission-reading">Marcar como leitura profunda</button>
      </div>
    </article>
  `;
}

function renderPhaseRail() {
  phaseRail.innerHTML = phaseCatalog
    .map((phase) => {
      const count = contentCollections.filter((item) => phase.matches.includes(item.module)).length;
      return `
        <article class="phase-card" data-phase-id="${phase.id}">
          <span class="card-label">${count} estudos</span>
          <h3>${phase.title}</h3>
          <p>${phase.description}</p>
          <div class="phase-meta">
            <span>Entrada emocional</span>
            <span>Leitura imersiva</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCheckpointPanel() {
  const notesCount = Object.keys(journalState).length;
  const latestKey = Object.keys(journalState)[Object.keys(journalState).length - 1];
  const latestEntry = latestKey ? journalState[latestKey] : "";
  checkpointPanel.innerHTML = `
    <article class="checkpoint-card">
      <span class="card-label">Clareza registrada</span>
      <h3>${notesCount === 0 ? "Seu primeiro checkpoint ainda esta esperando por voce." : `${notesCount} checkpoints registrados`}</h3>
      <p>${notesCount === 0 ? "Quando a pessoa escreve dentro da experiencia, o app deixa de ser consumo e vira travessia." : latestEntry.slice(0, 220)}</p>
      <textarea id="quickCheckpoint" placeholder="O que Deus esta revelando hoje? O que precisa morrer? O que precisa nascer?"></textarea>
      <div class="checkpoint-actions">
        <button id="saveQuickCheckpoint" class="primary-btn" type="button">Salvar checkpoint</button>
      </div>
      <p class="journal-status">Cada checkpoint cria memoria da jornada e ajuda a pessoa a voltar com mais verdade.</p>
    </article>
  `;
}

function renderImmersiveExperience() {
  renderReaderSpotlight();
  renderPhaseRail();
  renderCheckpointPanel();
}

function renderRichText(target, value) {
  if (!target) return;
  const paragraphs = String(value || "")
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    target.innerHTML = "";
    return;
  }

  target.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
}

function buildSelfReveal(item) {
  return (
    item.selfReveal ||
    `Este estudo revela que sua alma talvez esteja carregando mais do que consegue nomear. Observe onde ${item.theme} deixou de ser apenas uma fase e passou a influenciar sua identidade, seu ritmo e sua forma de interpretar a vida.\n\nPergunte a si mesmo em quais momentos voce se diminui, se esconde, se acelera ou se endurece para nao encarar o que esta acontecendo por dentro.`
  );
}

function buildGodReveal(item) {
  return (
    item.godReveal ||
    `Este estudo revela um Deus que nao se afasta da fragilidade humana, mas entra nela com verdade, cuidado e direcao. Ele nao trata sua historia com desprezo nem com pressa; Ele trabalha seu interior com profundidade.\n\nPerceba como a presenca de Deus aparece aqui nao como peso adicional, mas como eixo de reorganizacao, memoria e restauração.`
  );
}

function buildJournaling(item) {
  return (
    item.journaling ||
    `1. O que neste estudo mais expôs meu estado atual?\n\n2. Onde percebo resistencia, medo ou vergonha em mim?\n\n3. O que preciso confessar, entregar, interromper ou iniciar a partir desta leitura?\n\n4. Qual frase quero carregar comigo nas proximas 24 horas como ancora?`
  );
}

function buildClosing(item) {
  return (
    item.closing ||
    `Feche esta leitura em silencio por alguns instantes. Respire devagar. Volte a frase central do estudo e deixe que ela desça da mente para o coração.\n\nNao saia daqui correndo. Permaneça o suficiente para que a Palavra nao apenas informe, mas reordene.`
  );
}

function showApp(profile) {
  authGate.classList.add("hidden");
  memberApp.classList.remove("app-shell-hidden");
  memberApp.setAttribute("aria-hidden", "false");
  document.body.classList.add("authenticated");
  memberName.textContent = formatDisplayName(profile?.user || currentSession?.user);
  memberPlan.textContent = profile?.subscription?.plan || "Premium";
  renderGamification();
  if (!hasSeenOnboarding()) {
    onboardingModal.classList.remove("hidden");
    onboardingModal.setAttribute("aria-hidden", "false");
  }

  if (!appBooted) {
    renderFeatured();
    renderCollections();
    bindAppEvents();
    initNavigationObserver();
    appBooted = true;
  }
}

function showGate() {
  authGate.classList.remove("hidden");
  memberApp.classList.add("app-shell-hidden");
  memberApp.setAttribute("aria-hidden", "true");
  document.body.classList.remove("authenticated");
}

function closeOnboarding() {
  onboardingModal.classList.add("hidden");
  onboardingModal.setAttribute("aria-hidden", "true");
  markOnboardingSeen();
}

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (currentSession?.token) {
    headers.set("Authorization", `Bearer ${currentSession.token}`);
  }

  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Erro ao processar sua solicitacao.");
    error.status = response.status;
    throw error;
  }

  return data;
}

async function validateSession() {
  if (!currentSession?.token) {
    return false;
  }

  try {
    const [authData, profile, managedItems] = await Promise.all([
      apiRequest("/api/v1/auth/me"),
      apiRequest("/api/v1/profile/me"),
      loadManagedContentItems()
    ]);
    persistSession({ ...currentSession, user: authData.user || currentSession.user });
    adminContentItems = managedItems;

    if (profile?.subscription?.status !== "active") {
      showGate();
      emailInput.value = authData.user?.email || currentSession.user?.email || "";
      setAccessStateVisible(true);
      setAuthMessage(
        "Encontramos seu cadastro, mas o acesso premium ainda nao foi liberado para este e-mail.",
        "is-error"
      );
      return false;
    }

    showApp(profile);
    return true;
  } catch (_error) {
    persistSession(null);
    showGate();
    setAccessStateVisible(false);
    setAuthMessage("Sua sessao expirou ou ainda nao foi validada. Entre novamente com o e-mail da compra.", "is-error");
    return false;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!email) {
    setAuthMessage("Digite o e-mail usado na compra para validar seu acesso.", "is-error");
    return;
  }

  setAccessStateVisible(false);
  setLoginLoading(true);
  setAuthMessage("Estamos validando seu acesso premium...", "is-success");

  try {
    const loginData = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    persistSession({ token: loginData.token, user: loginData.user });
    emailInput.value = email;

    const hasAccess = await validateSession();
    if (hasAccess) {
      setAuthMessage("Acesso liberado. Sua area premium esta pronta.", "is-success");
    }
  } catch (error) {
    setAccessStateVisible(false);
    const message =
      error instanceof Error && error.message === "Failed to fetch"
        ? "Nao foi possivel conectar ao servidor de acesso agora. Tente novamente em instantes."
        : error.message || "Nao foi possivel validar seu e-mail agora.";
    setAuthMessage(message, "is-error");
  } finally {
    setLoginLoading(false);
  }
}

function handleLogout() {
  persistSession(null);
  closeSheet();
  showGate();
  setAccessStateVisible(false);
  setAuthMessage("Sessao encerrada. Entre novamente com o e-mail usado na compra.", "");
  emailInput.focus();
}

function listCardTemplate(item) {
  return `
    <article class="list-card" data-open-item="${item.id}">
      <span class="card-label">${item.label}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="card-tags">${(item.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `;
}

function railCardTemplate(item, className) {
  return `
    <article class="${className}" data-open-item="${item.id}">
      <div class="${className}-cover">
        <div class="${className}-body">
          <span class="card-label">${item.label}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="card-tags">${(item.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
      </div>
    </article>
  `;
}

function formatChipTemplate(item) {
  return `
    <button class="format-chip" type="button" data-nav="${item.id}">
      <span class="card-label">${item.id}</span>
      <strong>${item.title}</strong>
      <p>${item.copy}</p>
    </button>
  `;
}

function editorialCardTemplate(item) {
  return `
    <article class="editorial-card" data-editorial-id="${item.id}">
      <span class="card-label">${item.module}</span>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <span class="editorial-verse">${item.verse}</span>
      <div class="card-tags">${(item.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `;
}

function managedMediaCardTemplate(item) {
  const badgeMap = {
    video: "Video premium",
    audio: "Audio premium",
    pdf: "PDF premium",
    infographic: "Infografico premium",
    study: "Estudo premium"
  };

  return `
    <article class="editorial-card" data-managed-id="${item.id}">
      <span class="card-label">${badgeMap[item.type] || "Conteudo premium"}</span>
      <strong>${item.title}</strong>
      <p>${item.summary || "Material publicado no painel administrativo e liberado na area premium."}</p>
      <span class="editorial-verse">${item.module || item.phase || item.duration || "Acervo administravel"}</span>
      <div class="card-tags">${[item.duration, item.verse, ...(item.tags || [])]
        .filter(Boolean)
        .map((tag) => `<span>${tag}</span>`)
        .join("")}</div>
    </article>
  `;
}

function renderFeatured() {
  featuredPill.textContent = appData.featured.label;
  featuredTitle.textContent = appData.featured.title;
  featuredDescription.textContent = appData.featured.description;
  featuredMeta.innerHTML = appData.featured.tags.map((tag) => `<span>${tag}</span>`).join("");
  nowPlayingTitle.textContent = appData.audio[0].title;
  nowPlayingDescription.textContent = appData.audio[0].description;
  nextStepTitle.textContent = appData.modules[1].title;
  nextStepDescription.textContent = "Seu proximo passo recomendado para hoje.";
  journeyPercent.textContent = `${appData.progress}%`;
  journeyBar.style.width = `${appData.progress}%`;
}

function renderCollections(query = "") {
  const q = query.trim().toLowerCase();
  const filterItems = (items) =>
    items.filter((item) =>
      q ? [item.title, item.description, ...(item.tags || [])].join(" ").toLowerCase().includes(q) : true
    );
  const filterWritten = contentCollections.filter((item) =>
    q
      ? [item.title, item.summary, item.theme, item.verse, item.module, ...(item.tags || [])].join(" ").toLowerCase().includes(q)
      : true
  );
  const filterManaged = adminContentItems.filter((item) =>
    q
      ? [
          item.title,
          item.summary,
          item.module,
          item.phase,
          item.verse,
          item.duration,
          ...(item.tags || [])
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true
  );

  formatChips.innerHTML = appData.formats.map((item) => formatChipTemplate(item)).join("");
  continueList.innerHTML = filterItems(appData.continueWatching).map((item) => listCardTemplate(item)).join("");
  emergencyList.innerHTML = filterItems(appData.emergency).map((item) => listCardTemplate(item)).join("");
  modulesRail.innerHTML = filterItems(appData.modules).map((item) => railCardTemplate(item, "media-card")).join("");
  audioRail.innerHTML = filterItems(appData.audio).map((item) => railCardTemplate(item, "audio-card")).join("");
  readingList.innerHTML = filterWritten
    .slice(0, 5)
    .map((item) =>
      listCardTemplate({
        id: item.id,
        label: item.module,
        title: item.title,
        description: item.summary,
        tags: [item.verse, item.theme]
      })
    )
    .join("");
  libraryList.innerHTML = filterWritten
    .slice(5, 10)
    .map((item) =>
      listCardTemplate({
        id: item.id,
        label: item.category,
        title: item.title,
        description: item.studyBase,
        tags: ["base de estudo", item.verse]
      })
    )
    .join("");
  plansList.innerHTML = filterItems(appData.plans).map((item) => listCardTemplate(item)).join("");
  toolsList.innerHTML = filterItems(appData.tools).map((item) => listCardTemplate(item)).join("");
  extrasRail.innerHTML = filterItems(appData.extras).map((item) => railCardTemplate(item, "extra-card")).join("");
  contentLibraryGrid.innerHTML = filterWritten.map((item) => editorialCardTemplate(item)).join("");
  adminMediaGrid.innerHTML = filterManaged.length
    ? filterManaged.map((item) => managedMediaCardTemplate(item)).join("")
    : `
      <article class="editorial-card">
        <span class="card-label">Painel de conteudo</span>
        <strong>Seu acervo administravel vai aparecer aqui</strong>
        <p>Assim que voce cadastrar videos, audios, PDFs, infograficos ou estudos no painel, eles entram nesta area premium.</p>
      </article>
    `;
}

function allItems() {
  return [
    appData.featured,
    ...appData.continueWatching,
    ...appData.emergency,
    ...appData.modules,
    ...appData.audio,
    ...appData.readings,
    ...appData.library,
    ...appData.plans,
    ...appData.tools,
    ...appData.extras
  ];
}

function findItemById(id) {
  return allItems().find((item) => item.id === id) || null;
}

function findEditorialById(id) {
  return contentCollections.find((item) => item.id === id) || null;
}

function findManagedContentById(id) {
  return adminContentItems.find((item) => item.id === id) || null;
}

function openEditorialSheet(item) {
  openFocusReader(item);
}

function openManagedContent(item) {
  if (!item) return;
  if (item.type === "study") {
    openFocusReader(item);
    return;
  }

  openSheet({
    id: item.id,
    label:
      item.type === "video"
        ? "Video premium"
        : item.type === "audio"
          ? "Audio premium"
          : item.type === "pdf"
            ? "PDF premium"
            : item.type === "infographic"
              ? "Infografico premium"
              : "Conteudo premium",
    title: item.title,
    description: item.summary || item.intro || "Conteudo publicado no painel do administrador.",
    tags: [item.module, item.phase, item.duration, item.verse, ...(item.tags || [])].filter(Boolean),
    sections: [
      item.module ? { title: "Modulo", description: item.module } : null,
      item.phase ? { title: "Fase da jornada", description: item.phase } : null,
      item.studyBase ? { title: "Base de estudo", description: item.studyBase } : null,
      item.concept ? { title: "Conceito central", description: item.concept } : null
    ].filter(Boolean),
    deliverables: [
      item.mediaUrl ? { title: "Abrir material", description: item.mediaUrl } : null,
      item.downloadUrl ? { title: "Link de apoio", description: item.downloadUrl } : null
    ].filter(Boolean),
    primaryUrl: item.mediaUrl || item.downloadUrl || "",
    primaryLabel:
      item.type === "video"
        ? "Assistir agora"
        : item.type === "audio"
          ? "Ouvir agora"
          : item.type === "pdf"
            ? "Abrir PDF"
            : item.type === "infographic"
              ? "Abrir infografico"
              : "Abrir conteudo"
  });
}

function openFocusReader(item) {
  currentReaderItem = item;
  readerModule.textContent = item.module;
  readerTitle.textContent = item.title;
  readerSummary.textContent = item.summary;
  readerTags.innerHTML = [item.category, item.theme, item.verse, ...(item.tags || [])]
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  readerVerse.textContent = item.verse;
  renderRichText(readerIntro, item.intro || item.summary);
  renderRichText(readerStudyBase, item.studyBase);
  renderRichText(readerConcept, item.concept);
  renderRichText(readerReflection, item.reflection);
  renderRichText(readerApplication, item.application);
  renderRichText(readerSelfReveal, buildSelfReveal(item));
  renderRichText(readerGodReveal, buildGodReveal(item));
  renderRichText(readerJournaling, buildJournaling(item));
  renderRichText(readerPrayer, item.prayer);
  renderRichText(readerClosing, buildClosing(item));
  readerJournal.value = journalState[item.id] || "";
  journalStatus.textContent = journalState[item.id]
    ? "Seu ultimo checkpoint foi recuperado. Continue de onde parou."
    : "Seu checkpoint fica salvo neste navegador para voce continuar depois.";
  focusReader.classList.remove("hidden");
  focusReader.setAttribute("aria-hidden", "false");
}

function closeFocusReader() {
  focusReader.classList.add("hidden");
  focusReader.setAttribute("aria-hidden", "true");
}

function saveReaderJournal() {
  if (!currentReaderItem) return;
  journalState[currentReaderItem.id] = readerJournal.value.trim();
  persistJournalState();
  journalStatus.textContent = "Checkpoint salvo. Sua leitura agora tem memoria e continuidade.";
  renderImmersiveExperience();
}

function saveQuickCheckpoint() {
  const quickCheckpoint = document.getElementById("quickCheckpoint");
  if (!(quickCheckpoint instanceof HTMLTextAreaElement)) return;
  const value = quickCheckpoint.value.trim();
  if (!value) return;
  journalState[`quick-${Date.now()}`] = value;
  persistJournalState();
  renderImmersiveExperience();
}

function openSheet(item) {
  sheetType.textContent = item.label || "Conteudo";
  sheetTitle.textContent = item.title;
  sheetDescription.textContent = item.description;
  sheetTags.innerHTML = (item.tags || []).map((tag) => `<span>${tag}</span>`).join("");
  sheetModules.innerHTML = (item.sections || [])
    .map(
      (section) => `
      <div class="sheet-list-item">
        <strong>${section.title}</strong>
        <span>${section.description}</span>
      </div>
    `
    )
    .join("");
  sheetDeliverables.innerHTML = (item.deliverables || [])
    .map(
      (entry) => `
      <div class="sheet-list-item">
        <strong>${entry.title}</strong>
        <span>${entry.description}</span>
      </div>
    `
    )
    .join("");
  sheetPrimaryBtn.dataset.href = item.primaryUrl || "";
  sheetPrimaryBtn.textContent = item.primaryLabel || "Fechar detalhes";
  detailSheet.classList.remove("hidden");
  detailSheet.setAttribute("aria-hidden", "false");
}

function closeSheet() {
  sheetPrimaryBtn.dataset.href = "";
  sheetPrimaryBtn.textContent = "Fechar detalhes";
  detailSheet.classList.add("hidden");
  detailSheet.setAttribute("aria-hidden", "true");
}

function setActiveNav(nav) {
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === nav);
  });
}

function scrollToSection(nav) {
  const target = document.getElementById(nav);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveNav(nav);
}

function initNavigationObserver() {
  if (observer) return;

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActiveNav(visible.target.id);
    },
    {
      threshold: [0.25, 0.55, 0.75]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function bindAppEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const openTrigger = target.closest("[data-open-item]");
    if (openTrigger instanceof HTMLElement) {
      const itemId = openTrigger.getAttribute("data-open-item") || "";
      const item = findItemById(itemId);
      if (item) {
        openSheet(item);
        return;
      }
      const editorialItem = findEditorialById(itemId);
      if (editorialItem) openEditorialSheet(editorialItem);
      return;
    }

    const editorialTrigger = target.closest("[data-editorial-id]");
    if (editorialTrigger instanceof HTMLElement) {
      const item = findEditorialById(editorialTrigger.getAttribute("data-editorial-id") || "");
      if (item) openEditorialSheet(item);
      return;
    }

    const managedTrigger = target.closest("[data-managed-id]");
    if (managedTrigger instanceof HTMLElement) {
      const item = findManagedContentById(managedTrigger.getAttribute("data-managed-id") || "");
      if (item) openManagedContent(item);
      return;
    }

    const readerTrigger = target.closest("[data-reader-open]");
    if (readerTrigger instanceof HTMLElement) {
      const item = findEditorialById(readerTrigger.getAttribute("data-reader-open") || "");
      if (item) openFocusReader(item);
      return;
    }

    const missionTrigger = target.closest("[data-mission-id]");
    if (missionTrigger instanceof HTMLElement) {
      completeMission(missionTrigger.getAttribute("data-mission-id") || "");
      return;
    }

    const closeTrigger = target.closest("[data-close-sheet]");
    if (closeTrigger) {
      closeSheet();
      return;
    }

    const closeReaderTrigger = target.closest("[data-close-reader]");
    if (closeReaderTrigger) {
      closeFocusReader();
      return;
    }

    const closeOnboardingTrigger = target.closest("[data-close-onboarding]");
    if (closeOnboardingTrigger) {
      closeOnboarding();
      return;
    }

    const navTrigger = target.closest("[data-nav]");
    if (navTrigger instanceof HTMLButtonElement) {
      scrollToSection(navTrigger.dataset.nav || "inicio");
    }
  });

  featuredPlayBtn.addEventListener("click", () => openSheet(appData.featured));
  featuredDetailBtn.addEventListener("click", () => openSheet(appData.featured));
  continueBtn.addEventListener("click", () => openSheet(appData.continueWatching[0]));
  searchInput.addEventListener("input", () => renderCollections(searchInput.value));
  sheetPrimaryBtn.addEventListener("click", () => {
    const href = sheetPrimaryBtn.dataset.href || "";
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    closeSheet();
  });
  downloadToggle.addEventListener("click", () => downloadToggle.classList.toggle("active"));
  logoutButton.addEventListener("click", handleLogout);
  saveJournalButton.addEventListener("click", saveReaderJournal);
  completeReadingButton.addEventListener("click", () => {
    completeMission("mission-reading");
    saveReaderJournal();
  });
  fillAdminEmailButton.addEventListener("click", () => {
    emailInput.value = "ribeiro.freire3@gmail.com";
    setAuthMessage("Seu e-mail de teste foi preenchido. Agora e so entrar.", "");
  });
  startJourneyButton.addEventListener("click", () => {
    closeOnboarding();
    scrollToSection("modulos");
  });
  exploreAppButton.addEventListener("click", closeOnboarding);
  checkpointPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === "saveQuickCheckpoint") saveQuickCheckpoint();
  });
}

async function init() {
  apiBase = await loadApiBase();
  contentCollections = await loadContentLibrary();
  renderGamification();
  renderImmersiveExperience();
  emailInput.value = currentSession?.user?.email || getEmailFromUrl();
  loginForm.addEventListener("submit", handleLogin);
  retryAccessButton.addEventListener("click", async () => {
    if (!currentSession?.token) return;
    setAuthMessage("Conferindo novamente se seu acesso ja foi liberado...", "is-success");
    await validateSession();
  });
  switchEmailButton.addEventListener("click", () => {
    persistSession(null);
    setAccessStateVisible(false);
    setAuthMessage("Troque o e-mail e tente novamente com o cadastro usado na compra.", "");
    emailInput.focus();
  });

  if (currentSession?.token) {
    await validateSession();
  } else {
    showGate();
  }
}

init();
