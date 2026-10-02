import { getBodySystem } from "../content/body-systems";
import { getBodySystemEs } from "../content/es/body-systems";
import { getEffectiveBodySystem } from "./body-system-overrides";

function ownerEditableSnapshot(article: NonNullable<ReturnType<typeof getBodySystem>>) {
  return {
    title: article.title,
    subtitle: article.subtitle,
    kicker: article.kicker,
    summary: article.summary,
    heroFact: article.heroFact,
    heroFactLabel: article.heroFactLabel,
    sections: article.sections,
    keyTakeaways: article.keyTakeaways,
    known: article.known,
    uncertain: article.uncertain,
    primarySources: article.primarySources,
    reviewStatus: article.reviewStatus,
    reviewNote: article.reviewNote,
    updatedDate: article.updatedDate,
  };
}

export async function getSpanishBodySystemState(slug: string) {
  const translation = getBodySystemEs(slug);
  const baseline = getBodySystem(slug);
  if (!translation || !baseline) return undefined;

  const effectiveEnglish = await getEffectiveBodySystem(slug);
  const translationIsStale = effectiveEnglish
    ? JSON.stringify(ownerEditableSnapshot(effectiveEnglish)) !== JSON.stringify(ownerEditableSnapshot(baseline))
    : false;

  return {
    article: translation,
    effectiveEnglish,
    translationIsStale,
  };
}
