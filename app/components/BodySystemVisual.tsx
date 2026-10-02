import type { BodySystemArticle } from "../content/body-systems";
import type { SiteLocale } from "../lib/i18n";

const plates: Record<string, { src: string; label: string; note: string }> = {
  "cardiovascular-system": {
    src: "/images/science/heart.webp",
    label: "Heart + arteries",
    note: "Heart and vascular reference",
  },
  "female-reproductive-health": {
    src: "/images/science/ovary.webp",
    label: "Ovary + follicular environment",
    note: "Reproductive reference",
  },
  "endocrine-metabolic-system": {
    src: "/images/science/science-body-overview.webp",
    label: "Hormone-producing tissues",
    note: "Whole-body system context",
  },
  "kidneys-urinary-system": {
    src: "/images/science/science-body-overview.webp",
    label: "Kidneys + urinary pathway",
    note: "Filtration system context",
  },
  skin: {
    src: "/images/anatomy/body.png",
    label: "Exterior surface",
    note: "Whole-body skin reference",
  },
  "digestive-system": {
    src: "/images/science/science-body-overview.webp",
    label: "Digestive tract",
    note: "Ingestion pathway context",
  },
  "pregnancy-early-life": {
    src: "/images/science/placenta.webp",
    label: "Placenta + early life",
    note: "Maternal-fetal reference",
  },
};

const plateCopyEs: Record<string, { label: string; note: string }> = {
  "cardiovascular-system": { label: "Corazón + arterias", note: "Referencia cardíaca y vascular" },
  "female-reproductive-health": { label: "Ovario + entorno folicular", note: "Referencia reproductiva" },
  "endocrine-metabolic-system": { label: "Tejidos productores de hormonas", note: "Contexto del sistema en todo el cuerpo" },
  "kidneys-urinary-system": { label: "Riñones + vía urinaria", note: "Contexto del sistema de filtración" },
  skin: { label: "Superficie exterior", note: "Referencia de la piel de todo el cuerpo" },
  "digestive-system": { label: "Tracto digestivo", note: "Contexto de la vía de ingestión" },
  "pregnancy-early-life": { label: "Placenta + primeras etapas de la vida", note: "Referencia materno-fetal" },
};

export function BodySystemVisual({ article, locale = "en" }: { article: BodySystemArticle; locale?: SiteLocale }) {
  const plate = plates[article.slug] ?? plates["cardiovascular-system"];
  const localized = locale === "es" ? (plateCopyEs[article.slug] ?? plateCopyEs["cardiovascular-system"]) : plate;
  return (
    <figure className={`body-system-visual body-system-plate plate-${article.slug}`}>
      <div className="body-system-plate-frame" aria-hidden="true">
        <img src={plate.src} alt="" width="920" height="700" loading="eager" />
        <div className="body-system-plate-vignette" />
        <span className="body-system-plate-index">{locale === "es" ? "Referencia anatómica" : "Anatomical reference"}</span>
        <div className="body-system-plate-focus"><i /><span>{localized.label}</span></div>
      </div>
      <figcaption>
        <strong>{localized.note}</strong>
        <span>{locale === "es" ? "Ilustración educativa; no es una imagen de un paciente ni una imagen diagnóstica." : "Educational illustration; not a patient scan or diagnostic image."}</span>
      </figcaption>
    </figure>
  );
}
