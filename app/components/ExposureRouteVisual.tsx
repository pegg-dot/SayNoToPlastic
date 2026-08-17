export type ExposureRouteVisualKind = "air" | "water" | "food" | "heat" | "textiles" | "personal-care";

type ExposurePhoto = {
  src: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

// Free photographs used under the Unsplash License. Keeping the source URLs here makes
// the visual provenance explicit while avoiding another set of cartoon-like icon assets.
const exposurePhotos: Record<ExposureRouteVisualKind, ExposurePhoto> = {
  air: {
    src: "https://images.unsplash.com/photo-1706823936017-625b0d113812?auto=format&fit=crop&w=1400&q=82",
    alt: "Profile portrait of a person outdoors with their face lifted into the air",
    label: "Breathing · indoor air",
    objectPosition: "center 34%",
  },
  water: {
    src: "https://images.unsplash.com/photo-1562027224-de24a4d4acf4?auto=format&fit=crop&w=1400&q=82",
    alt: "Discarded plastic water bottle at the edge of the ocean",
    label: "Bottled water · ocean",
    objectPosition: "center 58%",
  },
  food: {
    src: "https://images.unsplash.com/photo-1674516583712-e6d4f91d9c21?auto=format&fit=crop&w=1400&q=82",
    alt: "Prepared food served in a clear plastic takeaway container",
    label: "Packaging · storage",
    objectPosition: "center 52%",
  },
  heat: {
    src: "https://images.unsplash.com/photo-1556910591-c01184bb213a?auto=format&fit=crop&w=1400&q=82",
    alt: "Kitchen with an oven and cooking equipment used for heating food",
    label: "Heat · kitchen contact",
    objectPosition: "35% 54%",
  },
  textiles: {
    src: "https://images.unsplash.com/photo-1778856920032-328a86d21a22?auto=format&fit=crop&w=1400&q=82",
    alt: "Rows of real clothing hanging together in a fashion store",
    label: "Clothing · synthetic fibers",
    objectPosition: "center 46%",
  },
  "personal-care": {
    src: "https://images.unsplash.com/photo-1629380107944-e72da9ec91f5?auto=format&fit=crop&w=1400&q=82",
    alt: "Skincare and cosmetic bottles arranged on a bathroom surface",
    label: "Skincare · packaging",
    objectPosition: "center 48%",
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
