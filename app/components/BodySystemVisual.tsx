import type { BodySystemArticle } from "../content/body-systems";

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

export function BodySystemVisual({ article }: { article: BodySystemArticle }) {
  const plate = plates[article.slug] ?? plates["cardiovascular-system"];
  return (
    <figure className={`body-system-visual body-system-plate plate-${article.slug}`}>
      <div className="body-system-plate-frame" aria-hidden="true">
        <img src={plate.src} alt="" width="920" height="700" loading="eager" />
        <div className="body-system-plate-vignette" />
        <span className="body-system-plate-index">Anatomical reference</span>
        <div className="body-system-plate-focus"><i /><span>{plate.label}</span></div>
      </div>
      <figcaption><strong>{plate.note}</strong><span>Educational illustration; not a patient scan or diagnostic image.</span></figcaption>
    </figure>
  );
}
