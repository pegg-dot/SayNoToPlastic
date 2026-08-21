"use client";

import { useEffect } from "react";
import type { AnatomySystemGroupId } from "../content/anatomy-system-models";
import { getAnatomySystemModel } from "../content/anatomy-system-models";
import { homepageJourney } from "../content/evidence";

const atlasConfig = getAnatomySystemModel("whole-body-atlas");
const evidenceBySlug = new Map(homepageJourney.map((chapter) => [chapter.slug, chapter]));

const groupByLabel: Record<string, AnatomySystemGroupId> = {
  "general anatomy": "all",
  exterior: "skin",
  brain: "brain",
  circulation: "circulation",
  heart: "heart",
  pelvis: "skeleton",
  endocrine: "endocrine",
  "kidneys + urinary": "urinary",
  digestive: "digestive",
};

const evidenceSlugByGroup: Partial<Record<AnatomySystemGroupId, string>> = {
  skin: "skin",
  brain: "brain",
  circulation: "blood",
  heart: "heart-arteries",
  endocrine: "endocrine-metabolic-system",
  urinary: "kidneys-urinary-system",
  digestive: "digestive-system",
};

const routeByEvidenceSlug: Record<string, string> = {
  skin: "/science/body/skin",
  brain: "/science#brain",
  blood: "/science#blood",
  "heart-arteries": "/science#heart-arteries",
  "endocrine-metabolic-system": "/science/body/endocrine-metabolic-system",
  "kidneys-urinary-system": "/science/body/kidneys-urinary-system",
  "digestive-system": "/science/body/digestive-system",
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

function copyForGroup(group: AnatomySystemGroupId): PanelCopy {
  if (group === "all") {
    return {
      key: "all",
      summary: atlasConfig.summary,
      findingHeading: "Finding",
      finding: atlasConfig.panelKnown,
      uncertaintyHeading: "Open question",
      uncertainty: atlasConfig.panelUncertain,
      sources: [],
      route: atlasConfig.route,
      routeLabel: "Explore the complete science library →",
    };
  }

  if (group === "skeleton") {
    return {
      key: "skeleton",
      summary: "Pelvic skeleton: anatomical orientation.",
      findingHeading: "Anatomy context",
      finding: "The pelvic skeleton is shown to orient nearby organs and body regions within the female reference model.",
      uncertaintyHeading: "Evidence boundary",
      uncertainty: "This site does not currently present a human microplastic study specific to the pelvic bones. Findings from blood, organs, or other tissues should not be generalized to bone.",
      sources: [],
      route: "/science",
      routeLabel: "Explore the evidence library →",
    };
  }

  const evidenceSlug = evidenceSlugByGroup[group];
  const evidence = evidenceSlug ? evidenceBySlug.get(evidenceSlug) : undefined;
  if (!evidence || !evidenceSlug) {
    return copyForGroup("all");
  }

  const showStat = groupsWithStudyStats.has(group);
  return {
    key: group,
    summary: evidence.title,
    findingHeading: "What the evidence says",
    finding: evidence.compactFinding ?? evidence.finding,
    uncertaintyHeading: "What it does not prove",
    uncertainty: evidence.compactMeaning ?? evidence.meaning,
    stat: showStat ? evidence.stat : undefined,
    statLabel: showStat ? evidence.statLabel : undefined,
    sources: evidence.sources,
    route: routeByEvidenceSlug[evidenceSlug] ?? "/science",
    routeLabel: evidenceSlug === "brain" || evidenceSlug === "blood" || evidenceSlug === "heart-arteries"
      ? "Read the study context →"
      : "Read the full evidence overview →",
  };
}

function replaceText(node: Element | null, text: string) {
  if (node && node.textContent !== text) node.textContent = text;
}

function syncAtlasPanel() {
  const dialog = document.querySelector<HTMLElement>(".anatomy-viewer-whole-body-atlas");
  if (!dialog) return;

  const activeButton = dialog.querySelector<HTMLButtonElement>(
    '.anatomy-viewer-system-filter button[aria-pressed="true"]',
  );
  const label = activeButton?.textContent?.trim().toLowerCase() ?? "general anatomy";
  const group = groupByLabel[label] ?? "all";
  const panel = dialog.querySelector<HTMLElement>(".anatomy-viewer-panel");
  if (!panel) return;

  const copy = copyForGroup(group);
  if (panel.dataset.evidenceGroup === copy.key) return;
  panel.dataset.evidenceGroup = copy.key;
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
    eyebrow.textContent = "Study snapshot";
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
    labelNode.textContent = "Sources";
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
