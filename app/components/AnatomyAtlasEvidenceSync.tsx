"use client";

import { useEffect } from "react";
import type { AnatomySystemGroupId } from "../content/anatomy-system-models";
import { getAnatomySystemModel } from "../content/anatomy-system-models";
import { homepageJourney } from "../content/evidence";
import { homepageJourneyEs } from "../content/es/evidence";

type SyncLocale = "en" | "es";

const atlasConfig = getAnatomySystemModel("whole-body-atlas");
const evidenceByLocale = {
  en: new Map(homepageJourney.map((chapter) => [chapter.slug, chapter])),
  es: new Map(homepageJourneyEs.map((chapter) => [chapter.slug, chapter])),
} as const;

const evidenceSlugByGroup: Partial<Record<AnatomySystemGroupId, string>> = {
  skin: "skin",
  brain: "brain",
  circulation: "blood",
  heart: "heart-arteries",
  endocrine: "endocrine-metabolic-system",
  urinary: "kidneys-urinary-system",
  digestive: "digestive-system",
};

const routeByLocale: Record<SyncLocale, Record<string, string>> = {
  en: {
    skin: "/science/body/skin",
    brain: "/science#brain",
    blood: "/science#blood",
    "heart-arteries": "/science#heart-arteries",
    "endocrine-metabolic-system": "/science/body/endocrine-metabolic-system",
    "kidneys-urinary-system": "/science/body/kidneys-urinary-system",
    "digestive-system": "/science/body/digestive-system",
  },
  es: {
    skin: "/es/ciencia/cuerpo/skin",
    brain: "/es/ciencia#brain",
    blood: "/es/ciencia#blood",
    "heart-arteries": "/es/ciencia#heart-arteries",
    "endocrine-metabolic-system": "/es/ciencia/cuerpo/endocrine-metabolic-system",
    "kidneys-urinary-system": "/es/ciencia/cuerpo/kidneys-urinary-system",
    "digestive-system": "/es/ciencia/cuerpo/digestive-system",
  },
};

const groupsWithStudyStats = new Set<AnatomySystemGroupId>(["brain", "circulation", "heart"]);

type PanelSource = { label: string; meta: string; href: string };
type PanelCopy = {
  key: string;
  summary: string;
  findingHeading: string;
  finding: string;
  uncertaintyHeading: string;
  uncertainty: string;
  stat?: string;
  statLabel?: string;
  sources: PanelSource[];
  route: string;
  routeLabel: string;
};

const generalCopy = {
  en: {
    summary: atlasConfig.summary,
    findingHeading: "Finding",
    finding: atlasConfig.panelKnown,
    uncertaintyHeading: "Open question",
    uncertainty: atlasConfig.panelUncertain,
    route: atlasConfig.route,
    routeLabel: "Explore the complete science library →",
  },
  es: {
    summary: "Rota un cuerpo femenino de referencia, cambia las capas anatómicas generales o enfoca un sistema disponible a la vez.",
    findingHeading: "Hallazgo",
    finding: "Este visor reúne superficies de referencia compatibles y con licencia en un mismo espacio de navegación para facilitar la orientación. No implica que todos los modelos del sitio pertenezcan a una misma persona o etapa de vida.",
    uncertaintyHeading: "Pregunta abierta",
    uncertainty: "La geometría de referencia varía según el modelo de origen y el contexto corporal. Es un conjunto educativo de referencia, no un atlas clínico completo ni una reconstrucción específica de un paciente.",
    route: "/es/ciencia",
    routeLabel: "Explorar la biblioteca completa de ciencia →",
  },
} as const;

const skeletonCopy = {
  en: {
    summary: "Pelvic skeleton: anatomical orientation.",
    findingHeading: "Anatomy context",
    finding: "The pelvic skeleton is shown to orient nearby organs and body regions within the female reference model.",
    uncertaintyHeading: "Evidence boundary",
    uncertainty: "This site does not currently present a human microplastic study specific to the pelvic bones. Findings from blood, organs, or other tissues should not be generalized to bone.",
    route: "/science",
    routeLabel: "Explore the evidence library →",
  },
  es: {
    summary: "Esqueleto pélvico: orientación anatómica.",
    findingHeading: "Contexto anatómico",
    finding: "El esqueleto pélvico se muestra para orientar los órganos y regiones corporales cercanos dentro del modelo femenino de referencia.",
    uncertaintyHeading: "Límite de la evidencia",
    uncertainty: "El sitio no presenta actualmente un estudio humano de microplásticos específico de los huesos pélvicos. Los hallazgos de sangre, órganos u otros tejidos no deben generalizarse al hueso.",
    route: "/es/ciencia",
    routeLabel: "Explorar la biblioteca de evidencia →",
  },
} as const;

const uiCopy = {
  en: {
    evidenceHeading: "What the evidence says",
    uncertaintyHeading: "What it does not prove",
    studySnapshot: "Study snapshot",
    sources: "Sources",
    studyRoute: "Read the study context →",
    overviewRoute: "Read the full evidence overview →",
  },
  es: {
    evidenceHeading: "Lo que dice la evidencia",
    uncertaintyHeading: "Lo que no demuestra",
    studySnapshot: "Resumen del estudio",
    sources: "Fuentes",
    studyRoute: "Leer el contexto del estudio →",
    overviewRoute: "Leer el resumen completo de evidencia →",
  },
} as const;

function copyForGroup(group: AnatomySystemGroupId, locale: SyncLocale): PanelCopy {
  if (group === "all") {
    return { key: "all", ...generalCopy[locale], sources: [] };
  }

  if (group === "skeleton") {
    return { key: "skeleton", ...skeletonCopy[locale], sources: [] };
  }

  const evidenceSlug = evidenceSlugByGroup[group];
  const evidence = evidenceSlug ? evidenceByLocale[locale].get(evidenceSlug) : undefined;
  if (!evidence || !evidenceSlug) return copyForGroup("all", locale);

  const showStat = groupsWithStudyStats.has(group);
  const ui = uiCopy[locale];
  return {
    key: group,
    summary: evidence.title,
    findingHeading: ui.evidenceHeading,
    finding: evidence.compactFinding ?? evidence.finding,
    uncertaintyHeading: ui.uncertaintyHeading,
    uncertainty: evidence.compactMeaning ?? evidence.meaning,
    stat: showStat ? evidence.stat : undefined,
    statLabel: showStat ? evidence.statLabel : undefined,
    sources: evidence.sources,
    route: routeByLocale[locale][evidenceSlug] ?? generalCopy[locale].route,
    routeLabel: evidenceSlug === "brain" || evidenceSlug === "blood" || evidenceSlug === "heart-arteries"
      ? ui.studyRoute
      : ui.overviewRoute,
  };
}

function replaceText(node: Element | null, text: string) {
  if (node && node.textContent !== text) node.textContent = text;
}

function syncAtlasPanel() {
  const dialog = document.querySelector<HTMLElement>(".anatomy-viewer-whole-body-atlas");
  if (!dialog) return;

  const locale: SyncLocale = dialog.dataset.locale === "es" ? "es" : "en";
  const activeButton = dialog.querySelector<HTMLButtonElement>(
    '.anatomy-viewer-system-filter button[aria-pressed="true"]',
  );
  const group = (activeButton?.dataset.anatomyGroup as AnatomySystemGroupId | undefined) ?? "all";
  const panel = dialog.querySelector<HTMLElement>(".anatomy-viewer-panel");
  if (!panel) return;

  const copy = copyForGroup(group, locale);
  const stateKey = `${locale}:${copy.key}`;
  if (panel.dataset.evidenceGroup === stateKey) return;
  panel.dataset.evidenceGroup = stateKey;
  panel.setAttribute("aria-live", "polite");

  replaceText(panel.querySelector("#anatomy-viewer-summary"), copy.summary);

  const quickRead = panel.querySelector(".anatomy-viewer-quick-read");
  const articles = quickRead?.querySelectorAll("article");
  if (articles?.[0]) {
    replaceText(articles[0].querySelector("h3"), copy.findingHeading);
    replaceText(articles[0].querySelector("p"), copy.finding);
  }
  if (articles?.[1]) {
    replaceText(articles[1].querySelector("h3"), copy.uncertaintyHeading);
    replaceText(articles[1].querySelector("p"), copy.uncertainty);
  }

  let stat = panel.querySelector<HTMLElement>(".anatomy-viewer-study-stat");
  if (!stat) {
    stat = document.createElement("div");
    stat.className = "anatomy-viewer-study-stat";
    quickRead?.before(stat);
  }
  stat.replaceChildren();
  if (copy.stat && copy.statLabel) {
    const eyebrow = document.createElement("span");
    eyebrow.textContent = uiCopy[locale].studySnapshot;
    const value = document.createElement("strong");
    value.textContent = copy.stat;
    const labelNode = document.createElement("small");
    labelNode.textContent = copy.statLabel;
    stat.append(eyebrow, value, labelNode);
    stat.hidden = false;
  } else {
    stat.hidden = true;
  }

  const articleLink = panel.querySelector<HTMLAnchorElement>(".anatomy-viewer-article");
  if (articleLink) {
    articleLink.href = copy.route;
    articleLink.textContent = copy.routeLabel;
  }

  let sources = panel.querySelector<HTMLElement>(".anatomy-viewer-panel-sources");
  if (!sources) {
    sources = document.createElement("div");
    sources.className = "anatomy-viewer-panel-sources";
    articleLink?.before(sources);
  }
  sources.replaceChildren();
  if (copy.sources.length) {
    const labelNode = document.createElement("span");
    labelNode.textContent = uiCopy[locale].sources;
    sources.append(labelNode);
    for (const source of copy.sources.slice(0, 2)) {
      const link = document.createElement("a");
      link.href = source.href;
      link.textContent = `${source.label} · ${source.meta}`;
      if (source.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      sources.append(link);
    }
    sources.hidden = false;
  } else {
    sources.hidden = true;
  }
}

export function AnatomyAtlasEvidenceSync() {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncAtlasPanel);
    };

    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => {
        if (mutation.type === "attributes") return mutation.attributeName === "aria-pressed";
        const target = mutation.target instanceof Element ? mutation.target : null;
        return !target?.closest(".anatomy-viewer-panel");
      });
      if (relevant) schedule();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-pressed"],
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(".anatomy-viewer-system-filter button")) schedule();
    };
    document.addEventListener("click", onClick, true);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
