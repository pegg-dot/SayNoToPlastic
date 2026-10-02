import { detectionSteps } from "../content/haddad-topics";
import { TrackedLink } from "./TrackedLink";
import type { SiteLocale } from "../lib/i18n";

const detectionStepsEs = [
  {
    number: "01",
    title: "Recoger una muestra",
    text: "Los investigadores comienzan con sangre, tejido, leche materna, tejido placentario, heces u otra muestra biológica definida.",
  },
  {
    number: "02",
    title: "Prepararla con cuidado",
    text: "Se eliminan grasas, proteínas y otros materiales biológicos mientras el equipo intenta conservar las partículas que puedan estar presentes.",
  },
  {
    number: "03",
    title: "Analizar el material restante",
    text: "Instrumentos especializados examinan el tamaño, la forma, la masa o las características espectrales de las partículas, según el método del estudio.",
  },
  {
    number: "04",
    title: "Identificar el polímero",
    text: "Los investigadores comparan la firma química con materiales conocidos como PE, PP, PET, PS y PVC.",
  },
] as const;

export function DetectionPrimer({ locale = "en" }: { locale?: SiteLocale }) {
  return (
    <section className="detection-primer" aria-labelledby="detection-primer-title">
      <div className="detection-primer-copy">
        <p className="eyebrow">{locale === "es" ? "Antes del resultado" : "Before the result"}</p>
        <h2 id="detection-primer-title">{locale === "es" ? "¿Cómo saben los científicos que el plástico está ahí?" : "How do scientists know plastic is there?"}</h2>
        <p>{locale === "es" ? "Cada hallazgo comienza con la recolección, el control de contaminación, la preparación de la muestra y un instrumento elegido para una medición específica. Métodos diferentes pueden producir tipos de evidencia diferentes." : "Every finding begins with collection, contamination control, sample preparation, and an instrument chosen for a specific measurement. Different methods can report different kinds of evidence."}</p>
        <TrackedLink className="text-link" href="/science/how-detection-works" eventName="cta_click" label={locale === "es" ? "science-es-detection-primer" : "science-detection-primer"}>{locale === "es" ? "Ver cómo funciona la detección (en inglés)" : "See how detection works"} <span>→</span></TrackedLink>
      </div>
      <ol>
        {(locale === "es" ? detectionStepsEs : detectionSteps).map((step) => (
          <li key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>
        ))}
      </ol>
    </section>
  );
}
