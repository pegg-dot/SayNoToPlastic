"use client";

import { useMemo, useState } from "react";
import type { Guide } from "../content/guides";
import { TrackedLink } from "./TrackedLink";

export function GuideLibrary({ guides }: { guides: Guide[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(guides.map((guide) => guide.category)))];
  const visibleGuides = useMemo(() => {
    const terms = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const matchesCategory = category === "All" || guide.category === category;
      const searchable = `${guide.category} ${guide.title} ${guide.description} ${guide.audience || ""}`.toLowerCase();
      return matchesCategory && (!terms || searchable.includes(terms));
    });
  }, [category, guides, query]);

  return <>
    <div className="resource-library-controls">
      <div className="resource-filter-note"><span>{guides.length} practical guides</span><p>Choose a topic or search for the question you actually have.</p></div>
      <label className="guide-search">Search guides<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" aria-label="Search field guides" aria-describedby="guide-search-example" /><small id="guide-search-example">Try water, children, laundry, heat, or food.</small></label>
      <div className="guide-filter-list" role="group" aria-label="Filter field guides by topic">
        {categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>
    </div>
    <p className="guide-result-count" role="status">{visibleGuides.length} {visibleGuides.length === 1 ? "guide" : "guides"}</p>
    {visibleGuides.length ? <div className="resource-grid">{visibleGuides.map((guide) => <TrackedLink key={guide.slug} href={`/resources/${guide.slug}`} eventName="resource_open" label={`library-${guide.slug}`}><span>{guide.category}{guide.audience ? ` · ${guide.audience}` : ""}</span><h2>{guide.title}</h2><p>{guide.description}</p><div><b>{guide.readingTime}</b><b>Open guide →</b></div></TrackedLink>)}</div> : <div className="guide-empty" role="status"><strong>No guide matches that search.</strong><p>Try a broader term or choose a different topic.</p></div>}
  </>;
}
