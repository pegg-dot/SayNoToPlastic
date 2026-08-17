export type ExposureRouteVisualKind = "air" | "water" | "food" | "heat" | "textiles" | "personal-care";

type ExposurePhoto = {
  src: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

// Editorial photography replaces the old line-art exposure icons. These are free-to-use
// Unsplash photographs selected to read as real-world exposure contexts rather than symbols.
// Sources: Hanna Lazar (air), Brian Yurasits (water), Trojan friendly (food), Lisa Anna
// (heat), Long Chung (textiles), and Maria Lupan (personal care).
const exposurePhotos: Record<ExposureRouteVisualKind, ExposurePhoto> = {
  air: {
    src: "https://images.unsplash.com/photo-1764773965304-504b94b24602?auto=format&fit=crop&w=1400&q=82",
    alt: "Person breathing cold outdoor air in a winter forest",
    label: "Breathing · air",
    objectPosition: "center 54%",
  },
  water: {
    src: "https://images.unsplash.com/photo-1562027224-de24a4d4acf4?auto=format&fit=crop&w=1400&q=82",
    alt: "Discarded plastic water bottle where ocean water meets the shore",
    label: "Bottled water · ocean",
    objectPosition: "center 58%",
  },
  food: {
    src: "https://images.unsplash.com/photo-1725698870128-895208b3a855?auto=format&fit=crop&w=1400&q=82",
    alt: "Prepared food held in a clear plastic storage container",
    label: "Packaging · storage",
    objectPosition: "center 52%",
  },
  heat: {
    src: "https://images.unsplash.com/photo-1723259461381-59ab9fa18f5d?auto=format&fit=crop&w=1400&q=82",
    alt: "Microwave and oven in a home kitchen",
    label: "Heat · kitchen contact",
    objectPosition: "center 48%",
  },
  textiles: {
    src: "https://images.unsplash.com/photo-1777356363419-1f38e0f05700?auto=format&fit=crop&w=1400&q=82",
    alt: "Real clothing hanging on racks inside a fashion store",
    label: "Clothing · synthetic fibers",
    objectPosition: "center 58%",
  },
  "personal-care": {
    src: "https://images.unsplash.com/photo-1741896135705-9dfb73461085?auto=format&fit=crop&w=1400&q=82",
    alt: "Skincare bottles and cosmetic packaging arranged for display",
    label: "Skincare · packaging",
    objectPosition: "center 50%",
  },
};

export function ExposureRouteVisual({ kind }: { kind: ExposureRouteVisualKind }) {
  const photo = exposurePhotos[kind];

  return (
    <figure
      className={`exposure-route-photo exposure-route-photo-${kind}`}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(188px, 17vw, 242px)",
        margin: "0 0 34px",
        overflow: "hidden",
        background: "#04090d",
        border: "1px solid rgba(214, 154, 73, 0.2)",
        boxShadow: "inset 0 1px 0 rgba(214, 154, 73, 0.32)",
      }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: photo.objectPosition ?? "center",
          filter: "saturate(.68) contrast(1.08) brightness(.72)",
          transform: "scale(1.012)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(3,8,12,.02) 24%, rgba(3,8,12,.22) 62%, rgba(3,8,12,.88) 100%), linear-gradient(90deg, rgba(5,11,16,.12), transparent 48%, rgba(5,11,16,.18))",
          pointerEvents: "none",
        }}
      />
      <figcaption
        style={{
          position: "absolute",
          left: 18,
          bottom: 15,
          margin: 0,
          paddingTop: 10,
          borderTop: "1px solid rgba(214,154,73,.68)",
          color: "rgba(255,255,255,.82)",
          fontFamily: "var(--sntp-sans)",
          fontSize: 9,
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: ".17em",
          textTransform: "uppercase",
        }}
      >
        {photo.label}
      </figcaption>
    </figure>
  );
}
