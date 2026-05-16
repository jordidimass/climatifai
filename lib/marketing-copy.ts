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
    cardEyebrow: string;
    cardTitle: string;
    cardBody: string;
    cardOpen: string;
    sowingTitle: string;
    sowingSub: string;
    firesTitle: string;
    firesSub: string;
    seeFeatures: string;
    readout: {
      tempAnomaly: string;
      precipDelta: string;
      gdd: string;
      heatDays: string;
    };
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
    line1: "Lee el clima.",
    line2: "Siembra mejor.",
    body:
      "Compara cien años de clima con lo que viene para los cultivos y regiones que trabajas. Hecho para productores, agrónomos y cooperativas de Latinoamérica.",
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
    readout: {
      tempAnomaly: "Anomalía térmica",
      precipDelta: "Δ precip. vs. 1991–2020",
      gdd: "Grados-día",
      heatDays: "Días de calor",
    },
  },
  features: {
    sectionEyebrow: "Por qué Climatifai",
    sectionTitleBefore: "La señal,",
    sectionTitleItalic: "no el ruido.",
    f1eyebrow: "Patrones históricos",
    f1title: "Un siglo de contexto.",
    f1body:
      "Consulta datos de observación homogeneizados por región y mes. Entiende la línea base de la que el clima se está alejando.",
    f2eyebrow: "Escenarios proyectados",
    f2title: "El mañana, en varios caminos.",
    f2body:
      "Compara proyecciones entre escenarios SSP. Planifica riego, selección varietal y ventanas de cosecha frente a lo que viene.",
    f3eyebrow: "Lecturas por cultivo",
    f3title: "Agronomía, no solo clima.",
    f3body:
      "GDD, días de estrés térmico y riesgo de sequía calculados para tus cultivos reales, no para una curva genérica de temperatura.",
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
    line1: "Read the sky.",
    line2: "Sow smarter.",
    body:
      "Contrast a century of climate with what's ahead for the crops and regions you work — built for growers, agronomists and co‑ops across Latin America.",
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
    readout: {
      tempAnomaly: "Thermal anomaly",
      precipDelta: "Δ precip vs. 1991–2020 baseline",
      gdd: "Growing‑degree days",
      heatDays: "Hot days",
    },
  },
  features: {
    sectionEyebrow: "Why Climatifai",
    sectionTitleBefore: "Signal first,",
    sectionTitleItalic: "not noise.",
    f1eyebrow: "Historical patterns",
    f1title: "A century of context.",
    f1body:
      "Regionalized observation series help you anchor how far today's climate has drifted from the baseline you assumed.",
    f2eyebrow: "Projected pathways",
    f2title: "Several futures side by side.",
    f2body:
      "Layer SSP envelopes to rehearse irrigation, variety choice and harvest windows against hotter or drier decades.",
    f3eyebrow: "Crop-native signals",
    f3title: "Agronomy, not curves alone.",
    f3body:
      "Thermal stress days, cumulative heat and water cues follow real varieties — not anonymous temperature swings.",
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
    versionStub: "v0.1 · demo shell",
  },
};

export function getMarketingMessages(locale: MarketingLocale): MarketingCopy {
  return locale === "en" ? en : es;
}
