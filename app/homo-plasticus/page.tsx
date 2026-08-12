import type { Metadata } from "next";
import { Footer, Header } from "../components/SiteChrome";
import { CheckoutButton } from "../components/CheckoutButton";
import { BOOK } from "../config";

const description = `${BOOK.subtitle}. By ${BOOK.author}, with collaboration by ${BOOK.collaborator}.`;
export const metadata: Metadata = { title: `${BOOK.title}, the Book | ${BOOK.author}`, description, alternates: { canonical: "/homo-plasticus" }, openGraph: { title: `${BOOK.title} | ${BOOK.author}`, description, url: "/homo-plasticus", siteName: "Say No to Plastic", type: "book", images: [{ url: "/book-official.webp", width: 1122, height: 1402, alt: `${BOOK.title} by ${BOOK.author}` }] }, twitter: { card: "summary", title: `${BOOK.title} | ${BOOK.author}`, description, images: ["/book-official.webp"] } };

const faq=[
  {q:"What format is the current edition?",a:"The current edition is a digital ebook delivered after checkout."},
  {q:"Is the book written for scientists?",a:"The book is intended for general readers who want the science, historical context, and practical response explained clearly."},
  {q:"Does the book provide medical advice?",a:"No. It provides public education and does not diagnose, treat, or replace guidance from a qualified healthcare professional."},
  {q:"What happens after purchase?",a:"After payment is confirmed, the purchase page provides secure access and an access email is sent to the address used at checkout. A fresh link can be requested later without repurchasing."},
  {q:"What if I lose the download email or link?",a:"Use the book-access recovery page with the purchase email. Genuine technical access problems can also be sent to support without buying the book again."},
  {q:"What is the refund policy?",a:"Digital purchases are generally final after access is delivered, except where applicable law requires otherwise or a genuine technical delivery problem cannot be resolved."},
];

const bookTerritories = [
  { label:"Origins", title:"The plastic age", body:"How a material built for durability became embedded in modern convenience and everyday systems." },
  { label:"Breakdown", title:"From objects to particles", body:"How larger plastics weather and fragment into microplastics and nanoplastics that move through ordinary life." },
  { label:"Exposure", title:"How plastic reaches us", body:"The repeated routes that bring plastic into contact with what we breathe, drink, eat, store, heat and handle." },
  { label:"Human evidence", title:"What researchers are finding", body:"What human studies report in blood and tissue, alongside the limits of what those findings can currently establish." },
  { label:"Daily life", title:"What can change now", body:"Practical ways to reduce repeated exposure without turning prevention into an impossible standard." },
  { label:"The larger response", title:"What comes next", body:"How individual decisions, public choices and policy can shape the plastic story from here." },
];

export default function BookPage(){
  const schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faq.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))};
  return <>
    <Header/>
    <main id="main-content" tabIndex={-1} className="inner-page book-detail-page">
      <section className="book-page-hero">
        <div className="book-page-visual"><img src="/book-official.webp" width="1100" height="1375" alt={`${BOOK.title} book cover`}/></div>
        <div>
          <p className="eyebrow">The book</p>
          <h1 aria-label={BOOK.title}>Homo<br/>Plasticus</h1>
          <p className="book-subtitle">{BOOK.subtitle}</p>
          <p className="book-byline">{BOOK.author}<br/><span>With collaboration by {BOOK.collaborator}</span></p>
          <div className="book-purchase-line"><strong>${BOOK.price}</strong><span>{BOOK.format}<br/>Instant digital access</span></div>
          <CheckoutButton className="button gold" label="book-page-hero">Get the ebook <span>↗</span></CheckoutButton>
          <small>Secure payment through the configured checkout. Access is delivered after confirmed payment. Digital sales are final. <a href="/refunds-and-returns">Read the policy.</a></small>
          <div className="book-access-help"><a href="/purchase/recover">Recover ebook access →</a><a href="/contact">Get technical support →</a></div>
        </div>
      </section>

      <section className="book-premise ivory">
        <div className="section-number">01</div>
        <div>
          <p className="eyebrow dark">Why this book</p>
          <h2>We built a world around plastic. Then plastic entered us.</h2>
          <p><em>{BOOK.title}</em> follows a material once celebrated for convenience as it fragmented into water, food, air, and the central questions of human biology. It brings historical context, emerging human evidence and practical response into one investigation for general readers.</p>
        </div>
        <blockquote>“The question is no longer only whether plastic is inside us. The question is what we choose to do with that knowledge.”</blockquote>
      </section>

      <section className="book-journey book-territory-section">
        <div className="book-territory-intro">
          <p className="eyebrow">A wider inquiry</p>
          <h2>The book reaches well beyond a four-part summary.</h2>
          <p>This is a reading map—not the book&apos;s table of contents. It shows the territory without pretending the investigation stops at four labels.</p>
        </div>
        <div className="book-territory-grid">
          {bookTerritories.map((item)=><article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
        </div>
      </section>

      <section className="book-science-bridge ivory">
        <div><p className="eyebrow dark">Go deeper after the book</p><h2>Explore the evidence directly.</h2><p>The book provides the wider narrative. The Science section keeps the detailed studies, body-system context, and laboratory methods in one place when you want them.</p></div>
        <nav aria-label="Science links from the book"><a href="/science"><span>01</span><strong>Human studies</strong><b>→</b></a><a href="/science#body-system-overviews"><span>02</span><strong>Body systems</strong><b>→</b></a><a href="/science/how-detection-works"><span>03</span><strong>How detection works</strong><b>→</b></a></nav>
      </section>

      <section className="book-faq">
        <p className="eyebrow">Before you buy</p>
        <h2>Questions about the digital edition</h2>
        {faq.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </section>

      <section className="page-cta book-final-cta">
        <p className="eyebrow">Begin the full inquiry</p><h2>{BOOK.title}</h2><p>{BOOK.subtitle}</p><strong>${BOOK.price}</strong><CheckoutButton className="button gold" label="book-page-final">Get instant access <span>↗</span></CheckoutButton>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </main>
    <Footer/>
  </>;
}
