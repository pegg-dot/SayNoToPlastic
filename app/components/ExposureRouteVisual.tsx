export type ExposureRouteVisualKind = "air" | "water" | "food" | "heat" | "textiles" | "personal-care";

export function ExposureRouteVisual({ kind }: { kind: ExposureRouteVisualKind }) {
  const common = { viewBox: "0 0 160 120", role: "img", "aria-hidden": true as const };
  if (kind === "air") return <svg {...common}><path d="M58 26c-14 4-22 17-21 33 1 14 8 22 18 27v16h33V83c9-4 14-13 14-24 0-18-13-33-31-34-5 0-9 0-13 1Z"/><path d="M92 47c12 0 18 6 18 15M112 42c14 0 23 8 23 20M115 75c11 0 18 4 23 11" className="route-line"/></svg>;
  if (kind === "water") return <svg {...common}><path d="M58 22h27l5 11v61H53V33l5-11Z"/><path d="M58 22h27M53 55h37M105 78c12-14 17-21 17-31 9 13 15 20 15 31 0 9-7 16-16 16s-16-7-16-16Z" className="route-accent"/><path d="M106 102c10-5 20-5 30 0M101 109c14-6 27-6 41 0" className="route-line"/></svg>;
  if (kind === "food") return <svg {...common}><path d="M28 40h104l-9 58H37l-9-58Z"/><path d="M40 29h80l12 11H28l12-11Z" className="route-accent"/><circle cx="61" cy="67" r="12"/><path d="M83 58h27M83 68h24M83 78h19" className="route-line"/></svg>;
  if (kind === "heat") return <svg {...common}><path d="M34 62h83l-8 34H43l-9-34Z"/><path d="M26 62h99M117 69h24" className="route-line"/><path d="M55 51c-10-12 7-17-2-29M78 51c-10-12 7-17-2-29M101 51c-10-12 7-17-2-29" className="route-accent"/></svg>;
  if (kind === "textiles") return <svg {...common}><path d="M50 29 70 19h20l20 10 20 20-17 17-11-11v49H58V55L47 66 30 49l20-20Z"/><path d="M69 20c2 9 8 14 11 14s9-5 11-14" className="route-line"/><path d="M39 89c18-10 34-8 48 5M86 87c13-7 25-5 36 3" className="route-accent"/></svg>;
  return <svg {...common}><path d="M49 38h43v65H49V38Z"/><path d="M57 22h27v16H57V22Zm27 5h25v8H84" className="route-line"/><path d="M98 52h23l10 14-10 37H98V52Z"/><circle cx="70" cy="65" r="9" className="route-accent"/><path d="M63 84h15" className="route-line"/></svg>;
}
