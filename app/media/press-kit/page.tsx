import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { MEDIA_KIT } from "../../content/media-content";
import { SUPPORT_EMAIL } from "../../config";
import { pressBriefs } from "../../content/press-briefs";
import { getAdminContentValues } from "../../lib/admin-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press Kit | Say No to Plastic",
  description: "Current web biography, interview topics, project facts, and available media assets for Dr. Elie R. Haddad and Homo Plasticus.",
  alternates: { canonical: "/media/press-kit" },
};

export default async function PressKitPage(){
  const ownerCopy = await getAdminContentValues(["press.short_bio", "press.long_bio", "press.contact_email"]);
  const shortBio = ownerCopy["press.short_bio"] || MEDIA_KIT.shortBio;
  const longBio = ownerCopy["press.long_bio"] || MEDIA_KIT.longBio;
  const contactEmail = ownerCopy["press.contact_email"] || SUPPORT_EMAIL;

  return <><Header/><main id="main-content" tabIndex={-1} className="inner-page press-kit-page">
  <section className="press-kit-hero"><div><p className="eyebrow">Press kit</p><h1>Context before the conversation.</h1><p>Use the current web biography, project facts, interview topics, and available assets below. High-resolution press files remain pending owner approval.</p></div><aside><span>Media contact</span><strong>{contactEmail}</strong><p>Include the outlet, audience, format, deadline, publication date, and central question.</p><a href="/contact">Submit an inquiry →</a></aside></section>
  <section className="press-kit-bios ivory"><div><p className="eyebrow dark">Current biography</p><h2>Short and extended versions.</h2></div><div><article><span>Short bio</span><p>{shortBio}</p></article><article><span>Extended bio</span><p>{longBio}</p></article></div></section>
  <section className="press-kit-facts"><div><p className="eyebrow">At a glance</p><h2>Project facts and conversation areas.</h2><dl>{MEDIA_KIT.facts.map(([term,description])=><div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl></div><div><p className="eyebrow">Interview topics</p><ol>{MEDIA_KIT.topics.map((topic,index)=><li key={topic}><span>{String(index+1).padStart(2,"0")}</span><p>{topic}</p></li>)}</ol></div></section>
  <section className="press-kit-briefings ivory"><div><p className="eyebrow dark">Downloadable evidence briefings</p><h2>One-page topic sheets.</h2><p>Each PDF summarizes the current material, its limits, and the Science page that carries the fuller references.</p></div><div>{pressBriefs.map((item)=><article key={item.slug}><span>{item.number}</span><div><strong>{item.title}</strong></div><a href={item.pageHref}>Open topic →</a><a href={item.pdfHref} download>Download PDF ↓</a></article>)}</div></section>
  <section className="press-kit-assets ivory"><div><p className="eyebrow dark">Current web assets</p><h2>Available now, with limits made visible.</h2><p>These are the assets currently stored in the project. Confirm usage, cropping, credit, and resolution before publication.</p></div><div>{MEDIA_KIT.assets.map((asset)=><article key={asset.href}><strong>{asset.label}</strong><p>{asset.note}</p><a href={asset.href} download>Download current file ↓</a></article>)}</div></section>
  <section className="press-kit-boundary"><div><p className="eyebrow">Editorial boundary</p><h2>Emerging science deserves precise language.</h2></div><div><p>Homo Plasticus distinguishes detection from demonstrated causation, names study limitations, and avoids presenting public education as medical diagnosis or treatment.</p><a href="/editorial-policy">Read the editorial standard →</a><a href="/medical-disclaimer">Read the medical boundary →</a></div></section>
</main><Footer/></>}
