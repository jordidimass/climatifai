export type MarketingLocale = "es" | "en";

export type MarketingCopy = {
  header: {
    navWhy: string;
    navFeatures: string;
    navBusiness: string;
    flowAi: string;
    flowAnalyze: string;
    flowMap: string;
    langEs: string;
    langEn: string;
    mobileMenuTitle: string;
    openMenu: string;
    languageLabel: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    body: string;
    primaryCta: string;
    cardEyebrow: string;
    cardTitle: string;
    cardBody: string;
    cardOpen: string;
    sowingTitle: string;
    sowingSub: string;
    firesTitle: string;
    firesSub: string;
    seeFeatures: string;
    statsStrip: readonly [string, string, string, string];
  };
  features: {
    sectionEyebrow: string;
    sectionTitleBefore: string;
    sectionTitleItalic: string;
    f1eyebrow: string;
    f1title: string;
    f1body: string;
    f2eyebrow: string;
    f2title: string;
    f2body: string;
    f3eyebrow: string;
    f3title: string;
    f3body: string;
  };
  cta: {
    eyebrow: string;
    title1: string;
    title2Italic: string;
    body: string;
    primarySowing: string;
    secondaryContact: string;
  };
  footer: {
    blurb: string;
    dataSourcesEyebrow: string;
    dataSourcesBody: string;
    columnProduct: string;
    columnCompany: string;
    linkAnalyze: string;
    linkMap: string;
    linkAi: string;
    linkFeatures: string;
    linkAbout: string;
    linkContact: string;
    linkPrivacy: string;
    copyrightSuffix: string;
    versionStub: string;
  };
};

const es: MarketingCopy = {
  header: {
    navWhy: "Por qué",
    navFeatures: "Capacidades",
    navBusiness: "Empresas",
    flowAi: "Habla AI",
    flowAnalyze: "Analizar siembra",
    flowMap: "Mapa de incendios",
    langEs: "ES",
    langEn: "EN",
    mobileMenuTitle: "Menú",
    openMenu: "Abrir menú",
    languageLabel: "Idioma",
  },
  hero: {
    eyebrow: "Inteligencia climática agrícola · v0.1",
    line1: "El clima cambió.",
    line2: "Tu calendario de siembra no.",
    body:
      "Compara datos climáticos históricos, actuales y proyecciones CMIP6 para tomar mejores decisiones agrícolas en LATAM.",
    primaryCta: "Explorar mi región",
    cardEyebrow: "Habla AI",
    cardTitle: "Describe tu cosecha en lenguaje natural",
    cardBody:
      "Objetivos de siembra, riesgos y ventanas — conversación guiada por contexto agrícola.",
    cardOpen: "Abrir",
    sowingTitle: "Analiza tu siembra",
    sowingSub: "Lecturas por región, tipo de siembra y fecha",
    firesTitle: "Mapa de incendios",
    firesSub: "Beta · capas satelitales próximamente",
    seeFeatures: "Ver capacidades",
    statsStrip: [
      "15+ fuentes de datos",
      "14 cultivos",
      "8+ países LATAM",
      "Proyecciones a 2030",
    ] as const,
  },
  features: {
    sectionEyebrow: "Tu flujo",
    sectionTitleBefore: "Compara.",
    sectionTitleItalic: "Predice. Actúa.",
    f1eyebrow: "Compara",
    f1title: "Histórico vs actual vs CMIP6",
    f1body:
      "Por región, contrastá línea base, condiciones actuales y trayectorias proyectadas (CMIP6) para planificar temporada con contexto climático.",
    f2eyebrow: "Predice",
    f2title: "Score de riesgo 0–100",
    f2body:
      "Priorizá estrés cuando las desviaciones climáticas del modelo sugieren temporada más exigente — listo para conectar métricas en tiempo real.",
    f3eyebrow: "Actúa",
    f3title: "IA sobre tus datos cargados",
    f3body:
      "Hallazgos en español usando región + cultivo (y modo comparación): conversá con modelo asistido antes de llevar recomendaciones a campo.",
  },
  cta: {
    eyebrow: "Para cooperativas y empresas",
    title1: "Un modelo climático.",
    title2Italic: "Cada parcela.",
    body:
      "Lleva Climatifai a todo tu portafolio: regiones por lote, catálogos de cultivos a medida y una API que se integra con tus herramientas.",
    primarySowing: "Analiza tu siembra",
    secondaryContact: "Hablemos",
  },
  footer: {
    blurb:
      "Inteligencia climática para quienes alimentan al mundo. Hecho para productores, agrónomos y cooperativas de Latinoamérica.",
    dataSourcesEyebrow: "Fuentes y referencias",
    dataSourcesBody:
      "Ejemplos citados por el proyecto: Open-Meteo · NASA FIRMS · FAO GAEZ · SoilGrids ISRIC · CHIRPS · Claude AI. Integraciones reales y licencias pueden variar.",
    columnProduct: "Producto",
    columnCompany: "Compañía",
    linkAnalyze: "Analizar siembra",
    linkMap: "Mapa de incendios",
    linkAi: "Habla AI",
    linkFeatures: "Capacidades",
    linkAbout: "Acerca de",
    linkContact: "Contacto",
    linkPrivacy: "Privacidad",
    copyrightSuffix: "· Climatifai",
    versionStub: "v0.1 · base inicial",
  },
};

const en: MarketingCopy = {
  header: {
    navWhy: "Why this",
    navFeatures: "Capabilities",
    navBusiness: "Enterprise",
    flowAi: "Talk to AI",
    flowAnalyze: "Analyze sowing",
    flowMap: "Wildfire map",
    langEs: "ES",
    langEn: "EN",
    mobileMenuTitle: "Menu",
    openMenu: "Open menu",
    languageLabel: "Language",
  },
  hero: {
    eyebrow: "Agricultural climate intelligence · v0.1",
    line1: "The climate has changed.",
    line2: "Your planting calendar hasn't.",
    body:
      "Contrast historical and current climate data with CMIP6 projections to make sharper agronomic decisions across Latin America.",
    primaryCta: "Explore my region",
    cardEyebrow: "Talk to AI",
    cardTitle: "Describe goals in plain language",
    cardBody:
      "Sowing goals, risks and windows — conversational guidance grounded in farm context.",
    cardOpen: "Open",
    sowingTitle: "Analyze sowing",
    sowingSub: "Region presets, timelines and sowing assumptions",
    firesTitle: "Wildfire beta map",
    firesSub: "More satellite overlays soon",
    seeFeatures: "See capabilities",
    statsStrip: [
      "15+ data sources",
      "14 crops",
      "8+ LATAM markets",
      "Projections to 2030",
    ] as const,
  },
  features: {
    sectionEyebrow: "Your flow",
    sectionTitleBefore: "Compare.",
    sectionTitleItalic: "Predict. Act.",
    f1eyebrow: "Compare",
    f1title: "Historical vs now vs CMIP6",
    f1body:
      "Per region: baseline observational cues, today's envelope, and CMIP6-style projected pathways — one grid for growers and advisors.",
    f2eyebrow: "Predict",
    f2title: "0–100 risk score",
    f2body:
      "A composite stress cue when climatic deviations spike in this layer — engineered to swap in production-grade anomaly feeds.",
    f3eyebrow: "Act",
    f3title: "AI grounded in your selections",
    f3body:
      "Guided chats in Spanish/English respect the region & crop you picked (comparison mode optional) — still validate locally before acting.",
  },
  cta: {
    eyebrow: "For co‑ops & enterprises",
    title1: "One climate blueprint.",
    title2Italic: "Every field.",
    body:
      "Scale across geographies lot by lot with tailored crop catalogs plus API integrations when you're ready.",
    primarySowing: "Analyze sowing",
    secondaryContact: "Let's talk",
  },
  footer: {
    blurb:
      "Decision intelligence for growers, agronomists and co‑operative teams stewarding farmland across LATAM.",
    dataSourcesEyebrow: "Data & references",
    dataSourcesBody:
      "Examples flagged in-scope: Open-Meteo · NASA FIRMS · FAO GAEZ · SoilGrids ISRIC · CHIRPS · Claude AI. Final integrations/licensing may differ.",
    columnProduct: "Product",
    columnCompany: "Company",
    linkAnalyze: "Analyze sowing",
    linkMap: "Wildfire map",
    linkAi: "Talk to AI",
    linkFeatures: "Capabilities",
    linkAbout: "About",
    linkContact: "Contact",
    linkPrivacy: "Privacy",
    copyrightSuffix: "· Climatifai",
    versionStub: "v0.1 · early build",
  },
};

export function getMarketingMessages(locale: MarketingLocale): MarketingCopy {
  return locale === "en" ? en : es;
}
