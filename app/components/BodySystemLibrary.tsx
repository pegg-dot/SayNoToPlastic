import { bodySystems, type BodySystemArticle } from "../content/body-systems";
import { TrackedLink } from "./TrackedLink";
import { localizedPath, type SiteLocale } from "../lib/i18n";

function conciseSummary(text: string) {
  const first = text.split(/(?<=[.!?])\s+/)[0]?.trim();
  return first || text;
}

export function BodySystemLibrary({
  items = bodySystems,
  compact = false,
  heading = "Explore the body-system library",
  intro = "Use the verified study record for individual human studies, then open a system overview when you want the wider biological context.",
  locale = "en",
}: {
  items?: BodySystemArticle[];
  compact?: boolean;
  heading?: string;
  intro?: string;
  locale?: SiteLocale;
}) {
  return (
    <section className={`body-system-library${compact ? " is-compact" : ""}`} aria-labelledby="body-system-library-title">
      <header>
        <p className="eyebrow dark">{locale === "es" ? "Sistemas del cuerpo y etapas de la vida" : "Body systems and life stages"}</p>
        <h2 id="body-system-library-title">{heading}</h2>
        <p>{intro}</p>
      </header>
      <div className="body-system-library-grid">
        {items.map((item, index) => (
          <TrackedLink
            key={item.slug}
            href={localizedPath(`/science/body/${item.slug}`, locale)}
            eventName="science_topic_open"
            label={`${locale === "es" ? "body-system-es" : "body-system"}-${item.slug}`}
            className={`body-system-card accent-${item.accent}`}
          >
            <span>{String(index + 1).padStart(2, "0")} · {item.kicker}</span>
            <h3>{item.navLabel}</h3>
            <p>{conciseSummary(item.summary)}</p>
            <div><b>{locale === "es" ? "Abrir resumen" : "Open overview"} <i aria-hidden="true">→</i></b></div>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
