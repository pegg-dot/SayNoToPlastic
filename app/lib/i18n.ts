export type SiteLocale = "en" | "es";

const spanishRouteMap: Record<string, string> = {
  "/": "/es",
  "/science": "/es/ciencia",
  "/solutions": "/es/accion",
  "/quick-action-card": "/es/guia-12-pasos",
  "/podcast": "/es/podcast",
  "/tedx": "/es/tedx",
  "/about-dr-elie-haddad": "/es/sobre-dr-elie-haddad",
  "/homo-plasticus": "/es/homo-plasticus",
  "/media": "/es/medios",
  "/newsletters": "/es/boletines",
  "/contact": "/es/contacto",
};

const englishRouteMap = Object.fromEntries(
  Object.entries(spanishRouteMap).map(([english, spanish]) => [spanish, english]),
) as Record<string, string>;

export function localizedPath(pathname: string, locale: SiteLocale) {
  if (locale === "es") {
    if (spanishRouteMap[pathname]) return spanishRouteMap[pathname];
    if (pathname.startsWith("/science/body/")) return pathname.replace("/science/body/", "/es/ciencia/cuerpo/");
    if (pathname.startsWith("/resources/")) return pathname.replace("/resources/", "/es/guias/");
    return pathname.startsWith("/es") ? pathname : `/es${pathname === "/" ? "" : pathname}`;
  }

  if (englishRouteMap[pathname]) return englishRouteMap[pathname];
  if (pathname.startsWith("/es/ciencia/cuerpo/")) return pathname.replace("/es/ciencia/cuerpo/", "/science/body/");
  if (pathname.startsWith("/es/guias/")) return pathname.replace("/es/guias/", "/resources/");
  return pathname.startsWith("/es/") ? pathname.slice(3) || "/" : pathname;
}

export const chromeCopy = {
  en: {
    skip: "Skip to main content",
    home: "Home",
    science: "The Science",
    action: "Take Action",
    guides: "Guides",
    podcast: "Podcast",
    tedx: "TEDx Talk",
    about: "About",
    book: "Get the book",
    ebook: "Get the ebook",
    more: "More",
    guideLibrary: "Guide library",
    theBook: "The book",
    media: "Events & Media",
    community: "Community",
    footerTagline: "Science, clarity, and practical action for a world living with plastic.",
    explore: "Explore",
    evidence: "The evidence",
    detection: "How detection works",
    exposome: "The exposome",
    practical: "Practical action",
    twelveStep: "12-step guide",
    bookAccess: "Book access",
    reviewStandard: "Product review standard",
    project: "Project",
    drHaddad: "Dr. Haddad",
    talkMedia: "Talk and media",
    fieldNotes: "Field Notes",
    contact: "Contact",
    editorial: "Editorial standard",
    newsletterTitle: "Field Notes / Newsletter",
    newsletterBody: "Research summaries and practical exposure-reduction guidance, sent by email.",
    join: "Join the movement",
    successTitle: "You're in.",
    successText: "You're subscribed. No confirmation email is required.",
    privacy: "Privacy",
    privacyChoices: "Privacy choices",
    terms: "Terms",
    refunds: "Refunds",
    affiliate: "Affiliate disclosure",
    disclaimer: "Medical disclaimer",
    accessibility: "Accessibility",
    mediaInquiries: "Media inquiries",
    inheritance: "The greatest inheritance we can leave our children isn't wealth.",
    health: "It's health.",
  },
  es: {
    skip: "Saltar al contenido principal",
    home: "Inicio",
    science: "La ciencia",
    action: "Actúa",
    guides: "Guías",
    podcast: "Podcast",
    tedx: "Charla TEDx",
    about: "Acerca de",
    book: "Obtener el libro",
    ebook: "Obtener el ebook",
    more: "Más",
    guideLibrary: "Biblioteca de guías",
    theBook: "El libro",
    media: "Eventos y medios",
    community: "Comunidad",
    footerTagline: "Ciencia, claridad y acción práctica para un mundo que vive con plástico.",
    explore: "Explorar",
    evidence: "La evidencia",
    detection: "Cómo funciona la detección",
    exposome: "El exposoma",
    practical: "Acción práctica",
    twelveStep: "Guía de 12 pasos",
    bookAccess: "Acceso al libro",
    reviewStandard: "Estándar de revisión de productos",
    project: "Proyecto",
    drHaddad: "Dr. Haddad",
    talkMedia: "Charlas y medios",
    fieldNotes: "Field Notes",
    contact: "Contacto",
    editorial: "Estándar editorial",
    newsletterTitle: "Field Notes / Boletín",
    newsletterBody: "Resúmenes de investigación y orientación práctica para reducir la exposición, enviados por correo electrónico.",
    join: "Únete al movimiento",
    successTitle: "Ya estás dentro.",
    successText: "Tu suscripción está activa. No necesitas confirmar por correo electrónico.",
    privacy: "Privacidad",
    privacyChoices: "Opciones de privacidad",
    terms: "Términos",
    refunds: "Reembolsos",
    affiliate: "Divulgación de afiliados",
    disclaimer: "Aviso médico",
    accessibility: "Accesibilidad",
    mediaInquiries: "Consultas de medios",
    inheritance: "La mayor herencia que podemos dejar a nuestros hijos no es la riqueza.",
    health: "Es la salud.",
  },
} as const;
