import {
  CLIMATIFAI_API_DOCS_URL,
  CLIMATIFAI_API_REPO_URL,
} from "@/lib/site-urls";

export type MarketingLocale = "es" | "en";

export type StaticPageSlug = keyof MarketingCopy["pages"];

export type PageAnchorSection = {
  id: "api" | "docs" | "contribute";
  title: string;
  body: string;
  /** Enlace externo (p. ej. documentación pública de la API). */
  href?: string;
  linkLabel?: string;
};

export type StaticPageCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  /** Solo `/build`: destinos de `/build#api`, `#docs`, `#contribute`. */
  anchorSections?: readonly PageAnchorSection[];
};

export type ProductCopy = {
  advisorEntryMetaTitle: string;
  advisorPrepareEyebrow: string;
  advisorFlowTitle: string;
  advisorFlowSub: string;
  advisorResultsBreadcrumbHome: string;
  advisorResultsBreadcrumbAdvisor: string;
  advisorResultsBreadcrumbCurrent: string;
  advisorInsightsBanner: string;
  advisorInsightsBtn: string;
  advisorResultsMetaTitle: string;
  firesFlowMetaTitle: string;
  chatMetaTitle: string;
  chatEyebrow: string;
  chatTitleLine1: string;
  chatTitleItalic: string;
  chatBody: string;
  firesSelectMetaTitle: string;
  advisorFormCropEyebrow: string;
  advisorFormCropHint: string;
  advisorFormSowingLabel: string;
  advisorFormSubmit: string;
  cropGridAdvisor: string;
  cropGridCompare: string;
  cropGridAria: string;
  cropGridFetchError: string;
  cropGridFetchSuitabilityFailed: string;
  cropGridUnexpected: string;
  cropGridToastUnavailable: string;
  cropGridStatusConsulting: string;
  cropGridPanelReadyPrefix: string;
  cropGridCompareSelectAnother: string;
  cropGridDisabledNotRecommended: string;
  cropGridDisabledNoData: string;
  cropGridBadgeSuitable: string;
  cropGridBadgeModerate: string;
  cropGridBadgeRisky: string;
  cropGeoNoDataToast: string;
  locationNoResults: string;
  locationSearchFailed: string;
  sidebarSummary: string;
  sidebarFiresLink: string;
  sidebarFiresBeta: string;
  sidebarAria: string;
  sidebarScenariosEyebrow: string;
  sidebarScenariosBody: string;
  compareLinkLabel: string;
  compareLinkHint: string;
  topbarSearchPlaceholder: string;
  notificationsAria: string;
  hablaAiYou: string;
  hablaAiAssistant: string;
  hablaAiNoResponse: string;
  hablaAiErrorGeneric: string;
  hablaAiMessageLabel: string;
  hablaAiPlaceholder: string;
  hablaAiGenerating: string;
  hablaAiSubmit: string;
  harvestExtrasToastTitle: string;
  harvestExtrasToastBody: string;
  harvestExtrasButton: string;
  insightsEyebrow: string;
  insightsTitle: string;
  insightsIntro: string;
  cropPickLabel: string;
  cropPickPlaceholder: string;
  regionPickLabel: string;
  regionPickPlaceholder: string;
  compareCropLabel: string;
  compareCropPlaceholder: string;
  compareCropVs: string;
  cropTimelineAria: string;
  cropTimelineEyebrow: string;
  cropTimelineExampleLead: string;
  cropTimelineMonths: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  cropTimelineHowtoHeading: string;
  cropTimelineHowtoBulletMonths: string;
  cropTimelineHowtoBulletStagesIntro: string;
  cropTimelineHowtoBulletStress: string;
  cropTimelineHowtoFooter: string;
  cropTimelineStripeCompactHint: string;
  cropTimelineTemporalOrderHint: string;
  cropTimelineRowGroupAria: string;
  cropTimelineTooltipStressExtra: string;
  cropTimelineRiskySrPrefix: string;
  cropTimelineRiskyDotTitle: string;
  cropTimelineLegendEyebrow: string;
  cropTimelineOtherSignalsEyebrow: string;
  cropTimelineSignalRedStripe: string;
  cropTimelineSignalRedDot: string;
  cropTimelineSignalTodayLine: string;
  timelinePhasePlanting: string;
  timelinePhaseGrowing: string;
  timelinePhaseHarvest: string;
  timelinePhaseOff: string;
  riskSuitable: string;
  riskModerate: string;
  riskRisky: string;
  riskNotRecommended: string;
  riskUnknown: string;
  regionMapToastTile: string;
  regionMapToastMap: string;
  regionMapAriaError: string;
  regionMapDisabledEyebrow: string;
  fireSearchAria: string;
  fireSearchPlaceholder: string;
  climateRegexFrom: string;
  climateRegexTo: string;
  advisorResultsIndicatorsEyebrow: string;
  cropGridSuitabilityHttpError: string;
  cropGridStatusLoading: string;
  cropGridAdvisorReady: string;
  cropGridPickSecondOther: string;
  cropBadgeViable: string;
  cropBadgeModerate: string;
  cropBadgeRisk: string;
  cropGridCompareRun: string;
  cropGridCompareRunning: string;
  cropGridSourcePrefix: string;
  cropGridSourcePending: string;
  cropCardNotRecommended: string;
  cropCardNoData: string;
};

export type MarketingCopy = {
  header: {
    navWhy: string;
    navFeatures: string;
    navBusiness: string;
    navHome: string;
    backLabel: string;
    subResultado: string;
    subMapSelection: string;
    flowAdvisor: string;
    flowWildfires: string;
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
    bodyPrefix: string;
    apiLinkLabel: string;
    bodySuffix: string;
    sowingTitle: string;
    sowingSub: string;
    firesTitle: string;
    firesSub: string;
    seeFeatures: string;
  };
  buildSection: {
    eyebrow: string;
    title: string;
    body: string;
    ctaApi: string;
    ctaDocs: string;
    ctaContribute: string;
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
    columnSite: string;
    columnBuild: string;
    columnCompany: string;
    linkAdvisor: string;
    linkWildfires: string;
    linkFeatures: string;
    linkWhy: string;
    linkEnterprise: string;
    linkCapabilities: string;
    linkAbout: string;
    linkBuild: string;
    linkViewApi: string;
    linkDocs: string;
    linkContribute: string;
    linkContact: string;
    linkPrivacy: string;
    copyrightSuffix: string;
    versionStub: string;
  };
  product: ProductCopy;
  pages: {
    why: StaticPageCopy;
    about: StaticPageCopy;
    capabilities: StaticPageCopy;
    enterprise: StaticPageCopy;
    contact: StaticPageCopy;
    privacy: StaticPageCopy;
    build: StaticPageCopy;
  };
};

const esPages = {
  why: {
    metaTitle: "Por qué · Why",
    metaDescription:
      "Por qué construimos Climatifai: desigualdad de acceso, fragmentación de fuentes y una plataforma abierta para Latinoamérica.",
    eyebrow: "Historia",
    title: "El clima cambió. Los datos para decidir mejor existen — el acceso, no tanto.",
    paragraphs: [
      "Hay una desproporción real entre lo que ya se sabe del clima y lo que llega agrupado de forma gratuita y legible quien más lo necesita para la siembra. Millones de productores familiares en LATAM siguen usando calendarios heredados mientras cada temporada muestra rupturas térmicas, lluvias mal calendariadas y ciclos de fuego más impredecibles.",
      "Los datos públicos sí existen: satélites (NASA, INPE y otros), ERA5 y CHIRPS, bases de suelo como SoilGrids, proyecciones CMIP6, mapas de incendios. Lo que falta es integrarlos en un mismo lugar, con supuestos visibles y en español, sin paywall artificial entre quien investiga el campo y quien lo trabaja cada día.",
      "Climatifai no existe para sobreprometer certezas estadísticas donde el dato público es grueso. Existe para reunir, normalizar cuando se puede y explicar con honestidad cuánto permite saber cada capa frente al riesgo de campo. Una plataforma abierta LATAM-first: usala, mejorala, repetila en instituciones o en tu próximo proyecto encima.",
    ],
  },
  about: {
    metaTitle: "Esencia · About",
    metaDescription:
      "Esencia Climatifai: plataforma abierta de inteligencia climática agrícola para Latinoamérica — misión, visión y promesa doble.",
    eyebrow: "Esencia",
    title: "Una referencia abierta para el clima agrícola de Latinoamérica",
    paragraphs: [
      "Climatifai es una plataforma abierta de inteligencia climática agrícola para Latinoamérica: reúne fuentes climáticas, satelitales e hidrológicas relevantes y construye herramientas gratuitas sobre ellas.",
      "Misión: volver gratuitos, unificados y accionables los datos que la agricultura latinoamericana necesita para decidir bajo un clima que cambió.",
      "Visión: que, con el tiempo, Climatifai sea el lugar público donde se entiende qué pasa con la temporada, los incendios y la siembra.",
      "Promesa doble: a quien usa la herramienta — lecturas más informadas, sin licencia cerrada obligatoria. A quien contribuye — trabajo que llega a quien siembra, no se pierde en un gestor cerrado.",
    ],
  },
  capabilities: {
    metaTitle: "Capacidades · Capabilities",
    metaDescription:
      "Tres capas del proyecto: mapa de incendios, capa agroclímica y advisor — qué problema resuelven y cómo nombramos la incertidumbre.",
    eyebrow: "Capacidades",
    title: "Tres herramientas sobre la misma base de datos públicos",
    paragraphs: [
      "Mapa de incendios: detección de hotspots casi en tiempo real (NASA FIRMS donde el backend coopera), con contexto cercano cuando la infraestructura lo permite.",
      "Capa agroclímática («Compara. Predice. Actúa.»): series por región o coordenada — historia observable, estado actual público y proyecciones comparables sólo donde el upstream lo documenta bien; siempre aclaramos granularidad y huecos antes de extrapolar campo.",
      "Advisor agrícola: combinás cultivo y ubicación catalogada para ver aptitud, riesgos, ventana típica y rendimiento referencial cuando el método lo permite, con explicación de fuentes. Incluye comparación entre dos cultivos y un chat («Habla AI») opcional cuando habilitás la función — sin esconder qué viene del servidor y qué falta.",
    ],
  },
  enterprise: {
    metaTitle: "Instituciones · Enterprise",
    metaDescription:
      "Para cooperativas, empresas e instituciones: capa gratuita profunda y opciones con SLA donde el soporte económico sostiene lo abierto.",
    eyebrow: "Cooperativas, empresas, gobierno",
    title: "Acompañamos decisiones grandes con la misma transparencia",
    paragraphs: [
      "Construimos en abierto porque la infraestructura climática debe ser auditable: mismo vocabulario técnico y acceso que ve el equipo interno ante extensionistas, financiamiento público u ONGs.",
      "El uso público cotidiano y de bajo volumen sigue gratis; proyectos institucionales o comerciales con volumen alto, integraciones etiquetadas o acuerdos formales pueden apoyarse en planes con SLA — sin convertir tus parcelas ni tus datos locales en secreto corporativo oscuro.",
      "Preferimos linaje documentado antes de automatizar informes ejecutivos: si algo no tiene fuente reproducible desde nosotros, lo decimos y no prometemos tableros fantasía.",
    ],
  },
  contact: {
    metaTitle: "Contacto · Contact",
    metaDescription: "Cómo llegar al equipo — canales claros cuando estén disponibles públicamente.",
    eyebrow: "Contacto",
    title: "Escribimos cuándo y cómo responder",
    paragraphs: [
      "Climatifai es un proyecto con una promesa sobre la comunicación igual de sincera que los datos citados: no instalamos formularios con respuesta inmediata ficticia cuando el tamaño actual del equipo no la sostiene.",
      "Las vías efectivas estarán enlazadas en README y esta página apenas exista SLA mínimo de primera respuesta. Temas de código abierto pasan primero por el repositorio público cuando el core esté disponible.",
      "Si venís desde una institución, contanos país, escala (~ha o productores beneficiados), conjunto actual de herramientas y qué clase de soporte esperás — así evitamos reuniones donde hablamos de «integración mágica» sin contexto reproducible.",
    ],
  },
  privacy: {
    metaTitle: "Privacidad · Privacy",
    metaDescription:
      "Qué guardamos cuando usás los flujos, qué delegamos al proveedor de modelo y cómo tratamos registros rutinarios.",
    eyebrow: "Privacidad",
    title: "Sólo guardamos lo operativo necesario para la funcionalidad en pantalla",
    paragraphs: [
      "Flujo habitual: país/departamento/municipio o polígono catalogado cuando elegís «región»; cultivos de catálogo; fecha ejemplo de ciclo cuando el advisor lo necesita.",
      "Punto geocodificado exacto aparece sólo después de usar el buscador de mapas o incendios y enviar tus coordenadas explícitas — ahí igual recordamos límites: el polígono operativo oficial sigue ligado al catálogo salvo donde la API documente algo distinto.",
      "Las conversaciones con el asistente pasan por el proveedor configurado públicamente para esta instalación — lo mencionamos en documentación porque la marca apuesta por trazabilidad del flujo tecnológico.",
      "Eliminamos o acortamos registros típicamente en ventanas cortas salvo incidente documentado públicamente que afecte confianza comunidad campo. Coberturas en gris aparecen igual — preferible a disclaimers ilegibles largos.",
    ],
  },
  build: {
    metaTitle: "Construir · Build",
    metaDescription:
      "API abierta como base técnica, documentación reproducible y cómo contribuir — economía transparente tipo freemium.",
    eyebrow: "Para desarrolladoras y comunidad OSS",
    title: "Abajo hay una API honesta para que construyás encima",
    paragraphs: [
      "La referencia pública en docs.climatifai.com describe el esquema y los límites; los payloads apuntan a reflejar lo mismo que el UI muestra: mismas etiquetas donde aplique, mismas menciones cuando falla densidad estadística país.",
      "Documentamos con ejemplos `curl`, advertencias de país sin series públicas suficientes, y changelog honesto ante cambios porque la confianza es infraestructura.",
      "Traducciones, validación campo, mejoras hidrológicas o incorporación de nuevas fuentes upstream están invitadas.",
      "Sostenibilidad: freemium — investigación, extensionismo o volumen alto paga SLA real; público cotidiano y ONGs pueden seguir usando sin tarjeta.",
    ],
    anchorSections: [
      {
        id: "api",
        title: "Ver la API",
        body: "Esquema GraphQL, límites de tasa y advertencias de cobertura — alineados con lo que muestra el producto. La referencia pública está en docs.climatifai.com.",
        href: CLIMATIFAI_API_DOCS_URL,
        linkLabel: "Abrir documentación de la API",
      },
      {
        id: "docs",
        title: "Leer la documentación",
        body: "Guías reproducibles, ejemplos curl y changelog en el mismo sitio; si un snippet omite límites nacionales de datos, lo tratamos como error y lo corregimos visiblemente.",
        href: CLIMATIFAI_API_DOCS_URL,
        linkLabel: "Ir a docs.climatifai.com",
      },
      {
        id: "contribute",
        title: "Contribuir",
        body: "Issues y pull requests en el repositorio público de la API — código, datos, traducciones o tutoriales. Tu trabajo puede llegar a quien siembra.",
        href: CLIMATIFAI_API_REPO_URL,
        linkLabel: "github.com/jordidimass/climatifaiAPI",
      },
    ],
  },
} satisfies MarketingCopy["pages"];

const esProduct = {
  advisorEntryMetaTitle: "Asesor agrícola · Agricultural advisor",
  advisorPrepareEyebrow: "Prepará tu combinación",
  advisorFlowTitle: "Región, cultivo y fecha de referencia",
  advisorFlowSub:
    "Leemos series públicas y catálogos de cultivo con supuestos visibles. Donde el dato es grueso o falta cobertura, lo decimos antes de hablar de rendimiento en campo.",
  advisorResultsBreadcrumbHome: "Inicio",
  advisorResultsBreadcrumbAdvisor: "Asesor",
  advisorResultsBreadcrumbCurrent: "Resultados",
  advisorInsightsBanner:
    "¿Querés interpretación en texto? Abrimos Hallazgos con la misma selección; no está en el menú principal mientras afinamos el alcance.",
  advisorInsightsBtn: "Ir a Hallazgos",
  advisorResultsMetaTitle: "Resultados del asesor · Advisor results",
  firesFlowMetaTitle: "Mapa de incendios · Wildfire map",
  chatMetaTitle: "Habla AI · Talk to AI",
  chatEyebrow: "Habla AI",
  chatTitleLine1: "Preguntá con ",
  chatTitleItalic: "contexto honesto cargado",
  chatBody:
    "Explicamos supuestos, citamos sólo lo que devolvió el servidor y decimos claro cuando la incertidumbre es alta.",
  firesSelectMetaTitle: "Selector de mapa de incendios · Wildfire map picker",
  advisorFormCropEyebrow: "Cultivo",
  advisorFormCropHint:
    "Elegí un cultivo para el advisor o activá la comparación para dos cultivos en la misma región catalogada.",
  advisorFormSowingLabel: "Fecha de siembra (referencia)",
  advisorFormSubmit: "Analizar",
  cropGridAdvisor: "Asesor",
  cropGridCompare: "Comparar cultivos",
  cropGridAria: "Cultivos disponibles en el catálogo para esta región",
  cropGridFetchError: "No pudimos consultar disponibilidad",
  cropGridFetchSuitabilityFailed: "No se pudo consultar aptitud del catálogo",
  cropGridUnexpected: "Ocurrió un error",
  cropGridToastUnavailable: "Sin cobertura bastante para este punto del catálogo.",
  cropGridStatusConsulting: "Consultando series públicas disponibles…",
  cropGridPanelReadyPrefix: "Panel listo:",
  cropGridCompareSelectAnother: "Elegí otro cultivo del catálogo para comparar con {{crop}}.",
  cropGridDisabledNotRecommended: "No recomendado",
  cropGridDisabledNoData: "Sin datos",
  cropGridBadgeSuitable: "{{score}}/100 · apto",
  cropGridBadgeModerate: "{{score}}/100 · moderado",
  cropGridBadgeRisky: "{{score}}/100 · riesgo",
  cropGeoNoDataToast: "Sin datos suficientes para ese punto catalogado.",
  locationNoResults: "Sin coincidencias en Latinoamérica (Brasil está fuera de este buscador).",
  locationSearchFailed: "No pudimos buscar ahora. Probá otra vez en un momento.",
  sidebarSummary: "Resumen",
  sidebarFiresLink: "Incendios",
  sidebarFiresBeta: "Mapa · datos satelitales en vivo",
  sidebarAria: "Espacio de trabajo agrícola",
  sidebarScenariosEyebrow: "Selección actual",
  sidebarScenariosBody: "Elegís cultivo acá; región y reglas salen desde /advisor antes de estos paneles.",
  compareLinkLabel: "Comparación",
  compareLinkHint: "Dos cultivos · misma región catalogada",
  topbarSearchPlaceholder: "Buscar (próximo)",
  notificationsAria: "Notificaciones (próximo)",
  hablaAiYou: "Tu",
  hablaAiAssistant: "Climatifai",
  hablaAiNoResponse: "El modelo no devolvió texto.",
  hablaAiErrorGeneric: "Algo falló. Revisá la conexión y probá otra vez.",
  hablaAiMessageLabel: "Mensaje",
  hablaAiPlaceholder: "Ej.: ventanas térmicas para frijol con lluvias irregulares según serie pública disponible…",
  hablaAiGenerating: "Generando…",
  hablaAiSubmit: "Enviar",
  harvestExtrasToastTitle: "Función pendiente",
  harvestExtrasToastBody:
    "Acá mostraremos ocaso solar y fotoperíodo cuando el calendario local esté enlazado de forma confiable.",
  harvestExtrasButton: "Ocaso solar",
  insightsEyebrow: "Hallazgos IA",
  insightsTitle: "Lo que tus datos ya saben — sin ocultar incertidumbre",
  insightsIntro:
    "Usamos lo que ya definiste en el advisor: región del catálogo, cultivo, fecha de siembra y punto geocodificado si existe. La página está fuera del menú principal mientras mejoramos onboarding; desde resultados vas con un clic manteniendo el mismo contexto.",
  cropPickLabel: "Cultivo",
  cropPickPlaceholder: "Elegí un cultivo del catálogo",
  regionPickLabel: "Región",
  regionPickPlaceholder: "Elegí una región catalogada",
  compareCropLabel: "Segundo cultivo",
  compareCropPlaceholder: "Elegí un segundo cultivo",
  compareCropVs: "frente a",
  cropTimelineAria: "Calendario guía por mes para el cultivo y la ubicación elegidos",
  cropTimelineEyebrow: "Ciclo del cultivo",
  cropTimelineExampleLead: "Calendario ejemplo basado en",
  cropTimelineMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] as const,
  cropTimelineHowtoHeading: "Cómo leer esta barra",
  cropTimelineHowtoBulletMonths:
    "Cada columna es un mes; el orden corre de izquierda a derecha durante el año (enero a la izquierda).",
  cropTimelineHowtoBulletStagesIntro:
    "La altura y el color alto del bloque indican solo una etapa ilustrativa del modelo según tus coordenadas:",
  cropTimelineHowtoBulletStress:
    "Una banda roja muy abajo del bloque o el punto debajo del mes marcan donde la mezcla pública disponible muestra divergencias fuertes frente la línea base — sirve para focalizar chequeos; no equivale a pronóstico parcelario cerrado.",
  cropTimelineHowtoFooter: "Pasá el cursor sobre un mes para ver nombre corto, etapa y el detalle extra cuando hay alerta.",
  cropTimelineStripeCompactHint:
    "Banda roja bajo el bloque y punto rojo bajo el mes: mes ejemplo con lectura claramente atípica frente la línea base pública usada acá.",
  cropTimelineTemporalOrderHint: "Orden temporal: enero a la izquierda · diciembre a la derecha.",
  cropTimelineRowGroupAria: "Doce meses en barra horizontal",
  cropTimelineTooltipStressExtra:
    "Lectura ilustrativa: varias fuentes públicas combinadas se ven fuera de patrón respecto el histórico reciente expuesto en esta vista — conviene validar con datos locales.",
  cropTimelineRiskySrPrefix: "Mes marcado como ejemplo de fuerte desviación climática respecto la línea base pública:",
  cropTimelineRiskyDotTitle: "Mes ejemplo: desviación marcada frente línea base pública en esta compilación",
  cropTimelineLegendEyebrow: "Etapa del cultivo (color del bloque)",
  cropTimelineOtherSignalsEyebrow: "Otras señales en la misma vista",
  cropTimelineSignalRedStripe:
    "Franja roja sobre el borde inferior del bloque remarca un mes donde la agregación mensual pública se ve muy alejada del patrón habitual en esta lectura; es independiente del color de siembra, crecimiento o cosecha del bloque principal.",
  cropTimelineSignalRedDot:
    "Punto rojo bajo las tres letras del mes refuerza el mismo caso: alerta derivada de series públicas combinadas, no del color de etapa del rectángulo.",
  cropTimelineSignalTodayLine: "Línea punteada vertical: mes calendario actual en tu navegador.",
  timelinePhasePlanting: "Siembra",
  timelinePhaseGrowing: "Crecimiento",
  timelinePhaseHarvest: "Cosecha",
  timelinePhaseOff: "Fuera de ciclo guía",
  riskSuitable: "Apto",
  riskModerate: "Moderado",
  riskRisky: "Riesgo",
  riskNotRecommended: "No recomendado",
  riskUnknown: "Sin datos",
  regionMapToastTile: "Carta · tesela",
  regionMapToastMap: "Carta",
  regionMapAriaError: "Carta temporalmente inhabilitada",
  regionMapDisabledEyebrow: "Mapa suspendido temporalmente",
  fireSearchAria: "Buscar ciudad o región catalogada",
  fireSearchPlaceholder: "Ciudad o región…",
  climateRegexFrom: "Formato debe ser YYYY-MM (desde)",
  climateRegexTo: "Formato debe ser YYYY-MM (hasta)",
  advisorResultsIndicatorsEyebrow: "Indicadores",
  cropGridSuitabilityHttpError: "No se pudo consultar disponibilidad agronómica catalogada",
  cropGridStatusLoading: "Consultando series públicas disponibles…",
  cropGridAdvisorReady: "Panel listo para",
  cropGridPickSecondOther: "Elegí otro cultivo catalogado para contrastar con",
  cropBadgeViable: "viable catalogada",
  cropBadgeModerate: "moderada",
  cropBadgeRisk: "bajo estrés modelado",
  cropGridCompareRun: "Comparar lecturas",
  cropGridCompareRunning: "Comparando…",
  cropGridSourcePrefix: "Fuente",
  cropGridSourcePending: "consultando…",
  cropCardNotRecommended: "Muy adversa catalogada",
  cropCardNoData: "Sin señal clara",
} as const satisfies ProductCopy;

const es: MarketingCopy = {
  header: {
    navWhy: "Historia",
    navFeatures: "Capacidades",
    navBusiness: "Instituciones",
    navHome: "Inicio",
    backLabel: "Volver",
    subResultado: "Resultados",
    subMapSelection: "Selector cartográfico",
    flowAdvisor: "Asesor",
    flowWildfires: "Incendios",
    langEs: "ES",
    langEn: "EN",
    mobileMenuTitle: "Menú",
    openMenu: "Abrir menú",
    languageLabel: "Idioma",
  },
  hero: {
    eyebrow: "Inteligencia climática agrícola",
    line1: "El clima cambió.",
    line2: "Tu calendario de siembra no.",
    bodyPrefix:
      "Compara datos climáticos históricos, actuales y proyecciones CMIP6 para tomar mejores decisiones agrícolas en LATAM. ",
    apiLinkLabel: "La API pública",
    bodySuffix:
      " organiza estas mismas lecturas — documentación en docs.climatifai.com; construimos en abierto desde la base.",
    sowingTitle: "Analizar siembra",
    sowingSub:
      "Advisor agrícola por región catalogada — aptitud, riesgos y ventana típica con fuentes detrás.",
    firesTitle: "Ver mapa de incendios",
    firesSub: "Hotspots satelitales y contexto por país donde la infra disponible lo permite.",
    seeFeatures: "Ver capacidades",
  },
  buildSection: {
    eyebrow: "Para desarrolladoras y contribuidoras",
    title: "API abierta, documentación viva, comunidad al centro",
    body: "Invitamos sin condescender: schemas visibles, advertencias de cobertura país y caminos claros para aportar — el freemium honesto sostiene lo gratuito sin vender parcelas en silencio.",
    ctaApi: "Ver la API",
    ctaDocs: "Leer la documentación",
    ctaContribute: "Contribuir",
  },
  features: {
    sectionEyebrow: "Tres capas integradas",
    sectionTitleBefore: "Compara.",
    sectionTitleItalic: "Predice con límites. Actúa validando en campo.",
    f1eyebrow: "Capa agroclímática",
    f1title: "Histórico · hoy · proyecciones cuando el origen lo documenta",
    f1body:
      "Cada lectura indica fuente y resolución; si el país no publica densidad suficiente, no sustituimos eso con confianza inventada.",
    f2eyebrow: "Indicadores compactos",
    f2title: "Puntuaciones sólo cuando la varianza lo permite",
    f2body:
      "Usamos etiquetas como «alto / moderado / bajo» y scores 0–100 como heurística explícita — no como promesa de cosecha.",
    f3eyebrow: "Asistente anclado",
    f3title: "Texto sólo con lo que el backend entregó",
    f3body:
      "Si falta dato, lo nombramos. Nunca reemplazamos ausencia de mediciones con porcentajes de «éxito» que el modelo no calcula.",
  },
  cta: {
    eyebrow: "Para cooperativas, empresas e instituciones",
    title1: "Infraestructura climática ",
    title2Italic: "que podés auditar como campo.",
    body: "Integramos cuando el alcance y los supuestos son compartidos — nunca prometemos piloto automático donde el clima bifurca sin tu validación local.",
    primarySowing: "Analizar siembra",
    secondaryContact: "Ir a contacto",
  },
  footer: {
    blurb:
      "Plataforma abierta de inteligencia climática agrícola para Latinoamérica: datos públicos integrados, voz en español primero y espacio real para quien construye encima.",
    dataSourcesEyebrow: "Fuentes en esta compilación",
    dataSourcesBody:
      "Open-Meteo · NASA FIRMS · FAO GAEZ (donde aplica en abierto) · SoilGrids · CHIRPS · CMIP6 vía proveedores documentados · pasarela de modelo para el chat. La lista cambia cuando integramos o retiramos una fuente; lo anotamos en changelog y documentación.",
    columnProduct: "Producto",
    columnSite: "Sitio",
    columnBuild: "Para construir",
    columnCompany: "Compañía",
    linkAdvisor: "Asesor",
    linkWildfires: "Incendios",
    linkFeatures: "Capacidades",
    linkWhy: "Por qué",
    linkEnterprise: "Instituciones",
    linkCapabilities: "Capacidades",
    linkAbout: "Acerca de",
    linkBuild: "Construir",
    linkViewApi: "Ver la API",
    linkDocs: "Documentación",
    linkContribute: "Contribuir",
    linkContact: "Contacto",
    linkPrivacy: "Privacidad",
    copyrightSuffix: "· Climatifai",
    versionStub: "v0.2 · guía marca",
  },
  product: esProduct,
  pages: esPages,
};

const enPages = {
  why: {
    metaTitle: "Why · Por qué",
    metaDescription:
      "Why we build Climatifai: mismatched access to climate knowledge, fragmented sources, and an open platform rooted in Latin America.",
    eyebrow: "Why",
    title: "The climate shifted. Useful data existed long before equitable access.",
    paragraphs: [
      "Roughly sixty million family farmers across Latin America still plan planting windows with calendars the climate already broke — while satellites, CMIP ensembles, soils data, and fire feeds sit in dozens of disconnected portals.",
      "Climatifai exists to braid those public signals into readable Spanish-first tools with explicit uncertainties. We are not here to outperform ministries or universities overnight; we plug the daylight between what science already publishes and what a technician can cite before advising a coop.",
      "Integrity means naming limits: coarse rainfall grids, uneven station density, embargoed derivatives. Transparency is the product roadmap as much as the API contract.",
    ],
  },
  about: {
    metaTitle: "About · Esencia",
    metaDescription:
      "Essence of Climatifai — open agricultural climate intelligence platform for Latin America, mission, vision, double promise.",
    eyebrow: "Essence",
    title: "Open platform, LATAM-rooted voices, builders invited",
    paragraphs: [
      "Climatifai is an open agricultural climate intelligence platform for Latin America — it aggregates consultable climatic, satellite, hydrological and agronomic datasets and ships free tools atop them.",
      "Mission: make the data growers need gratis, unified, actionable under a shifting climate.",
      "Vision: become the dependable open reference for LATAM agronomic seasons, wildfires, and planting calendars.",
      "Double promise: field teams get barrier-free readings; contributors see their patches reach real hectares, not vanish behind a private roadmap.",
    ],
  },
  capabilities: {
    metaTitle: "Capabilities · Capacidades",
    metaDescription:
      "Three layered experiences — wildfires, agro-climate timelines, advisory — anchored on the same public-data spine.",
    eyebrow: "Capabilities",
    title: "Same spine, three ways to explore it",
    paragraphs: [
      "Wildfires: near-real-time hotspots (NASA FIRMS backends), burn context by country wherever infrastructure allows frank disclosure.",
      "Agroclimate: Compare. Forecast with humility. Act. Historical baselines plus present envelopes plus documented CMIP-era traces — each chart cites resolution and warns when gauges are sparse.",
      "Advisor: Suitability cues, climatic risk narration, indicative planting windows, and yield references only when methodologies allow — plus bilingual chat when enabled, citations limited to fetched passages.",
    ],
  },
  enterprise: {
    metaTitle: "Enterprise · Instituciones",
    metaDescription:
      "For cooperatives, companies, governments — deepen the free tier, optional SLAs, integrations without magical automation.",
    eyebrow: "Co-ops, companies, governments",
    title: "Institutional workloads with the same honest ledger",
    paragraphs: [
      "We collaborate when contracts and telemetry expectations are explicit — never smuggling parcels into undisclosed resale lanes.",
      "Freemium keeps everyday extension work free while serious volume, SLA naming rights, or custom catalogs fund sustainment ethically.",
      "Public programs get reproducible lineage first; flashy exec decks second.",
    ],
  },
  contact: {
    metaTitle: "Contact · Contacto",
    metaDescription: "How to reach the team once response SLAs exist.",
    eyebrow: "Contact",
    title: "We publish timelines when we mean them",
    paragraphs: [
      "No phantom contact forms implying instant desks when the rotating maintainer roster cannot answer that fast.",
      "Emails and ticketing surface alongside README pledges soon as we certify minimum acknowledgement windows.",
      "Institutional decks: send country footprint, hectares or farmers served, data systems already in play, expectation of integration depth.",
    ],
  },
  privacy: {
    metaTitle: "Privacy · Privacidad",
    metaDescription:
      "Lean retention posture — what persists for maps, chats, auditing, aligned with OSS transparency norms.",
    eyebrow: "Privacy",
    title: "Operational data only — no stealth profiling",
    paragraphs: [
      "Typical breadcrumbs: curated region id, canonical crop selections, illustrative planting timestamp when advisor needs it.",
      "Geocoder hits populate only after deliberate search widgets fire — still paired with disclaimers tying analytics back catalog polygons unless API notes say otherwise.",
      "Assistant traffic hops through whichever model gateway configured for this deployment; we disclose it because secrecy erodes field trust.",
      "Logs age out aggressively unless incidents demand public notices — grey coverage gets named instead of drowning you in unreachable legalese.",
    ],
  },
  build: {
    metaTitle: "Build · Construir",
    metaDescription:
      "Builders page — roadmap for public schema, reproducible docs, OSS contribution rituals, frank economics.",
    eyebrow: "For developers & contributors",
    title: "Ship on the same API spine the UI consumes",
    paragraphs: [
      "Public reference at docs.climatifai.com documents schema and limits; our API is the organising technical layer — map, advisor, assistant are reference apps, not the ceiling.",
      "Docs pair curl recipes with blunt country warnings when station density fails — forgetting to mention coarse grids is ours to fix openly.",
      "Issues welcome for locales, validations, integrations; we spotlight approachable tasks when backlog allows.",
      "Economics stays freemium: cardless entry for NGOs and growers, stabilized commercial SLAs underwriting common infrastructure.",
    ],
    anchorSections: [
      {
        id: "api",
        title: "View API",
        body: "GraphQL schema, rate limits, and coverage disclaimers — aligned with what the product surfaces. The public reference lives at docs.climatifai.com.",
        href: CLIMATIFAI_API_DOCS_URL,
        linkLabel: "Open API documentation",
      },
      {
        id: "docs",
        title: "Read documentation",
        body: "Reproducible guides, curl examples, and changelog share the same site — snippets that skip country coverage warnings count as regressions we fix openly.",
        href: CLIMATIFAI_API_DOCS_URL,
        linkLabel: "Go to docs.climatifai.com",
      },
      {
        id: "contribute",
        title: "Contribute",
        body: "Issues and pull requests on the public API repository — translations, QA, notebooks, infra. Contributions should reach growers, not sit in ornamental roadmaps.",
        href: CLIMATIFAI_API_REPO_URL,
        linkLabel: "github.com/jordidimass/climatifaiAPI",
      },
    ],
  },
} satisfies MarketingCopy["pages"];

const enProduct = {
  advisorEntryMetaTitle: "Agricultural advisor · Asesor agrícola",
  advisorPrepareEyebrow: "Prime your selections",
  advisorFlowTitle: "Region, crop, planting reference date",
  advisorFlowSub:
    "We read public series and curated crops with labeled assumptions — when grids are coarse or coverage is thin, we say so before implying field yield.",
  advisorResultsBreadcrumbHome: "Home",
  advisorResultsBreadcrumbAdvisor: "Advisor",
  advisorResultsBreadcrumbCurrent: "Results",
  advisorInsightsBanner:
    "Want narrative analysis? Insights reuses these selections — it stays out of primary navigation until we tighten scope.",
  advisorInsightsBtn: "Open Insights",
  advisorResultsMetaTitle: "Advisor results · Resultados del asesor",
  firesFlowMetaTitle: "Wildfire map · Mapa de incendios",
  chatMetaTitle: "Talk to AI · Habla AI",
  chatEyebrow: "Talk to AI",
  chatTitleLine1: "Ask with ",
  chatTitleItalic: "honestly loaded context",
  chatBody:
    "Explicit assumptions, citations only where the backend responded, ambiguity called out plainly.",
  firesSelectMetaTitle: "Wildfire map picker · Selector de incendios",
  advisorFormCropEyebrow: "Crop",
  advisorFormCropHint:
    "Pick a crop for advisor mode or enable comparison within the same curated footprint.",
  advisorFormSowingLabel: "Planting date (reference)",
  advisorFormSubmit: "Analyze",
  cropGridAdvisor: "Advisor",
  cropGridCompare: "Compare crops",
  cropGridAria: "Crops currently available for this curated region",
  cropGridFetchError: "Couldn't check availability",
  cropGridFetchSuitabilityFailed: "Couldn't query catalog suitability",
  cropGridUnexpected: "Something went wrong",
  cropGridToastUnavailable: "Not enough catalog coverage here.",
  cropGridStatusConsulting: "Fetching public signals we can access…",
  cropGridPanelReadyPrefix: "Ready:",
  cropGridCompareSelectAnother: "Choose another catalog crop to compare with {{crop}}.",
  cropGridDisabledNotRecommended: "Not recommended",
  cropGridDisabledNoData: "No data",
  cropGridBadgeSuitable: "{{score}}/100 · viable",
  cropGridBadgeModerate: "{{score}}/100 · moderate stress",
  cropGridBadgeRisky: "{{score}}/100 · high stress",
  cropGeoNoDataToast: "Not enough coverage at that curated point.",
  locationNoResults: "Nothing in Latin America (Brazil excluded here for now).",
  locationSearchFailed: "Lookup failed—try shortly.",
  sidebarSummary: "Overview",
  sidebarFiresLink: "Wildfires",
  sidebarFiresBeta: "Map · live satellite layers where available",
  sidebarAria: "Workspace",
  sidebarScenariosEyebrow: "Current selection",
  sidebarScenariosBody: "Crop lives here—region/rules flow from /advisor before dashboards render.",
  compareLinkLabel: "Compare mode",
  compareLinkHint: "Two crops · one curated footprint",
  topbarSearchPlaceholder: "Search (soon)",
  notificationsAria: "Notifications (soon)",
  hablaAiYou: "You",
  hablaAiAssistant: "Climatifai",
  hablaAiNoResponse: "The model returned empty text.",
  hablaAiErrorGeneric: "Request failed — check connectivity and retry.",
  hablaAiMessageLabel: "Message",
  hablaAiPlaceholder: "Example: soybean heat thresholds with uneven rainfall vs public gauges…",
  hablaAiGenerating: "Generating…",
  hablaAiSubmit: "Send",
  harvestExtrasToastTitle: "Coming soon",
  harvestExtrasToastBody:
    "Solar sunset and photoperiod land once local calendars integrate reliably.",
  harvestExtrasButton: "Solar cues",
  insightsEyebrow: "AI insights",
  insightsTitle: "Interpretation tethered to your selections",
  insightsIntro:
    "This view reuses Advisor selections — catalog footprint, planting date, canonical crop IDs, optional geocoder pin. Insights stays hidden from primary navigation until onboarding feels fair; contextual deep links remain from results.",
  cropPickLabel: "Crop",
  cropPickPlaceholder: "Choose a canonical crop",
  regionPickLabel: "Region",
  regionPickPlaceholder: "Choose a curated region",
  compareCropLabel: "Second crop",
  compareCropPlaceholder: "Pick a second canonical crop",
  compareCropVs: "vs.",
  cropTimelineAria: "Month-by-month illustrative calendar for the crop and point you selected",
  cropTimelineEyebrow: "Crop cycle",
  cropTimelineExampleLead: "Example calendar aligned with",
  cropTimelineMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const,
  cropTimelineHowtoHeading: "How to read this strip",
  cropTimelineHowtoBulletMonths:
    "Each column is one month, reading left to right across the year (January on the left).",
  cropTimelineHowtoBulletStagesIntro:
    "The tall block color encodes an illustrative growth stage for your coordinates:",
  cropTimelineHowtoBulletStress:
    "A red band along the bottom edge or a red dot under the month marks where the public blend we ship looks far from its baseline reading — exploratory only, not an automatic crop-loss forecast.",
  cropTimelineHowtoFooter:
    "Hover any month label to see the short name, stage, and the extra warning when flagged.",
  cropTimelineStripeCompactHint:
    "Bottom red band plus red dot: month where the fused public traces look unusually different from baseline in this compilation.",
  cropTimelineTemporalOrderHint: "Temporal order: January left · December right.",
  cropTimelineRowGroupAria: "Twelve calendar months arranged horizontally",
  cropTimelineTooltipStressExtra:
    "Illustrative: multiple public datasets disagree with the recent historical envelope shown here — validate locally.",
  cropTimelineRiskySrPrefix: "Month highlighted as materially off-pattern versus the public baseline in this UI:",
  cropTimelineRiskyDotTitle: "Sample month flagged as materially off-pattern versus baseline for this compilation",
  cropTimelineLegendEyebrow: "Crop stage encoded in block color",
  cropTimelineOtherSignalsEyebrow: "Other cues in this view",
  cropTimelineSignalRedStripe:
    "The red shave along the block base calls out months where fused monthly anomalies look unusually large in this prototype read—separate from the planting/growth/harvest shading above it.",
  cropTimelineSignalRedDot:
    "The dot under the abbreviated month repeats that message: public-series stress, different information than tall-block stage shading.",
  cropTimelineSignalTodayLine: "Dashed vertical line: calendar month pinned to today's date in your browser.",
  timelinePhasePlanting: "Planting",
  timelinePhaseGrowing: "Growth",
  timelinePhaseHarvest: "Harvest",
  timelinePhaseOff: "Off-cycle template",
  riskSuitable: "Suitable",
  riskModerate: "Moderate",
  riskRisky: "Risky",
  riskNotRecommended: "Very hostile",
  riskUnknown: "No strong signal",
  regionMapToastTile: "Basemap tile",
  regionMapToastMap: "Basemap",
  regionMapAriaError: "Temporary map outage",
  regionMapDisabledEyebrow: "Map paused",
  fireSearchAria: "Search LATAM locality",
  fireSearchPlaceholder: "City or region…",
  climateRegexFrom: "Expected YYYY-MM (start)",
  climateRegexTo: "Expected YYYY-MM (end)",
  advisorResultsIndicatorsEyebrow: "Indicators",
  cropGridSuitabilityHttpError: "Couldn't query catalog agronomic availability",
  cropGridStatusLoading: "Pulling public signals we can access…",
  cropGridAdvisorReady: "Panel ready for",
  cropGridPickSecondOther: "Pick another catalog crop to contrast with",
  cropBadgeViable: "catalog viability",
  cropBadgeModerate: "moderate band",
  cropBadgeRisk: "elevated stress cue",
  cropGridCompareRun: "Run comparison",
  cropGridCompareRunning: "Comparing…",
  cropGridSourcePrefix: "Source",
  cropGridSourcePending: "fetching…",
  cropCardNotRecommended: "Catalog adverse",
  cropCardNoData: "No clear signal",
} as const satisfies ProductCopy;

const en: MarketingCopy = {
  header: {
    navWhy: "Why",
    navFeatures: "Capabilities",
    navBusiness: "Enterprise",
    navHome: "Home",
    backLabel: "Back",
    subResultado: "Results",
    subMapSelection: "Map picker",
    flowAdvisor: "Advisor",
    flowWildfires: "Wildfires",
    langEs: "ES",
    langEn: "EN",
    mobileMenuTitle: "Menu",
    openMenu: "Open menu",
    languageLabel: "Language",
  },
  hero: {
    eyebrow: "Agricultural climate intelligence",
    line1: "The climate has changed.",
    line2: "Your planting calendar hasn't.",
    bodyPrefix:
      "Contrast historical and current climate data with CMIP6 projections to make sharper agronomic decisions across Latin America — ",
    apiLinkLabel: "the open API",
    bodySuffix:
      " organizes the same reads the flagship UI uses — see docs.climatifai.com; we're building in the open from day one.",
    sowingTitle: "Analyze sowing",
    sowingSub:
      "Regional advisor — suitability cues, climatic risk narration, indicative windows behind visible sources.",
    firesTitle: "See wildfire map",
    firesSub: "Near-real hotspots plus country context wherever cooperative backends expose it.",
    seeFeatures: "See capabilities",
  },
  buildSection: {
    eyebrow: "For builders & contributors",
    title: "Open API backbone, living docs, earnest economics",
    body: "Spanish-first narratives when they matter—but endpoints, disclaimers and contribution ladders stay explicit for auditors and OSS friends.",
    ctaApi: "View API",
    ctaDocs: "Read documentation",
    ctaContribute: "Contribute",
  },
  features: {
    sectionEyebrow: "Integrated trio",
    sectionTitleBefore: "Compare.",
    sectionTitleItalic: "Forecast humbly. Act after field-checking.",
    f1eyebrow: "Agroclimate stack",
    f1title: "History · now · ensembles when disclosures line up",
    f1body:
      "Grain size, instrumentation caveats and missing gauges surface before implying yield outcomes.",
    f2eyebrow: "Interpretable summaries",
    f2title: "Scores printed only where variance supports honesty",
    f2body:
      "Heuristic ordering — labels like HIGH/MODERATE/LOW—not numeric promises the sources never computed.",
    f3eyebrow: "Anchored narration",
    f3title: "Assistant echoes retrieved passages—or flags gaps",
    f3body:
      "Absent instruments get named plainly—no improvised success percentages divorced from retrieval.",
  },
  cta: {
    eyebrow: "For cooperatives, enterprises, governments",
    title1: "Climate scaffolding ",
    title2Italic: "you may audit like field notes.",
    body: "Partnerships hinge on mirrored assumptions—we never stealth-automate branching futures without locally validated safeguards.",
    primarySowing: "Analyze sowing",
    secondaryContact: "Go to contact",
  },
  footer: {
    blurb:
      "Open agricultural climate intelligence rooted in LATAM—with Spanish authored first, reproducible cites, builders invited.",
    dataSourcesEyebrow: "Sources in this compilation",
    dataSourcesBody:
      "Open-Meteo · NASA FIRMS · FAO GAEZ (public slices where applicable) · SoilGrids · CHIRPS · CMIP-derived windows via disclosed providers · model gateway powering chat integrations. Licensing shifts get logged visibly.",
    columnProduct: "Product",
    columnSite: "Site",
    columnBuild: "Build with us",
    columnCompany: "Company",
    linkAdvisor: "Advisor",
    linkWildfires: "Wildfires",
    linkFeatures: "Capabilities",
    linkWhy: "Why",
    linkEnterprise: "Enterprise",
    linkCapabilities: "Capabilities",
    linkAbout: "About",
    linkBuild: "Build",
    linkViewApi: "View API",
    linkDocs: "Docs",
    linkContribute: "Contribute",
    linkContact: "Contact",
    linkPrivacy: "Privacy",
    copyrightSuffix: "· Climatifai",
    versionStub: "v0.2 · brand guide",
  },
  product: enProduct,
  pages: enPages,
};

export function getMarketingMessages(locale: MarketingLocale): MarketingCopy {
  return locale === "en" ? en : es;
}

