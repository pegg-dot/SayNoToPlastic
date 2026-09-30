import { bodySystems, getBodySystem, type BodySystemArticle } from "../content/body-systems";
import { getOwnerBodySystemOverrides, type OwnerBodySystemOverride } from "./admin-content";

function applyOverride(article: BodySystemArticle, override: OwnerBodySystemOverride | undefined): BodySystemArticle {
  if (!override) return article;
  return {
    ...article,
    title: override.title,
    subtitle: override.subtitle,
    kicker: override.kicker,
    summary: override.summary,
    heroFact: override.heroFact,
    heroFactLabel: override.heroFactLabel,
    sections: override.sections,
    keyTakeaways: override.keyTakeaways,
    known: override.known,
    uncertain: override.uncertain,
    primarySources: override.primarySources,
    reviewStatus: override.reviewStatus,
    reviewNote: override.reviewNote,
    updatedDate: override.updatedDate,
  };
}

export async function getEffectiveBodySystems() {
  const overrides = await getOwnerBodySystemOverrides();
  const bySlug = new Map(overrides.map((item) => [item.slug, item]));
  return bodySystems.map((article) => applyOverride(article, bySlug.get(article.slug as OwnerBodySystemOverride["slug"])));
}

export async function getEffectiveBodySystem(slug: string) {
  const article = getBodySystem(slug);
  if (!article) return undefined;
  const overrides = await getOwnerBodySystemOverrides();
  const override = overrides.find((item) => item.slug === slug);
  return applyOverride(article, override);
}
