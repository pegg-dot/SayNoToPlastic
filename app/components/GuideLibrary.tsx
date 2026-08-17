"use client";

import { useMemo, useState } from "react";
import type { Guide } from "../content/guides";
import { TrackedLink } from "./TrackedLink";
import styles from "../resources/resources.module.css";

const categoryLabels: Record<string, string> = {
  Kitchen: "Food + kitchen",
  Home: "Air + dust",
  Textiles: "Clothing",
  "Personal care": "Skin + personal care",
};

function displayCategory(category: string) {
  return categoryLabels[category] || category;
}

export function GuideLibrary({ guides }: { guides: Guide[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(guides.map((guide) => guide.category)))];
  const visibleGuides = useMemo(() => {
    const terms = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const matchesCategory = category === "All" || guide.category === category;
      const searchable = `${guide.category} ${displayCategory(guide.category)} ${guide.title} ${guide.description} ${guide.audience || ""}`.toLowerCase();
      return matchesCategory && (!terms || searchable.includes(terms));
    });
  }, [category, guides, query]);

  return <>
    <div className={styles.libraryHeader}>
      <div><p className="eyebrow dark">The complete library</p><h2>{guides.length} practical guides</h2></div>
      <p>Pick the question that matters now. Each guide separates what the evidence supports, what remains uncertain, and what you can realistically do.</p>
    </div>

    <div className={styles.controls}>
      <label className={styles.searchLabel}>Search guides<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" aria-label="Search guides" placeholder="Water, dust, clothing, cosmetics…" /></label>
      <div className={styles.filters} role="group" aria-label="Filter guides by topic">
        {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{item === "All" ? "All guides" : displayCategory(item)}</button>)}
      </div>
    </div>

    <p className={styles.resultCount} role="status">Showing {visibleGuides.length} of {guides.length}</p>

    {visibleGuides.length ? <div className={styles.readingList}>
      {visibleGuides.map((guide) => {
        const guideNumber = String(guides.findIndex((item) => item.slug === guide.slug) + 1).padStart(2, "0");
        return <TrackedLink className={styles.readingRow} key={guide.slug} href={`/resources/${guide.slug}`} eventName="resource_open" label={`library-${guide.slug}`}>
          <span className={styles.rowNumber}>{guideNumber}</span>
          <div className={styles.rowTopic}><span>{displayCategory(guide.category)}</span><small>{guide.audience || "Deeper reading"}</small></div>
          <div className={styles.rowCopy}><h3>{guide.title}</h3><p>{guide.description}</p></div>
          <div className={styles.rowAction}><span>{guide.readingTime}</span><b>Read →</b></div>
        </TrackedLink>;
      })}
    </div> : <div className={styles.empty} role="status"><strong>No guide matches that search.</strong><p>Try a broader term or choose a different topic.</p></div>}
  </>;
}
