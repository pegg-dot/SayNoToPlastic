import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { PrintButton } from "../../components/PrintButton";
import { authoredCardRememberEs, authoredQuickActionCardEs, coreRulesEs } from "../../content/es/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tarjeta de acción rápida | Say No to Plastic",
  description: "Doce pasos inmediatos y tres reglas principales de Homo Plasticus, presentados en español como texto accesible.",
  alternates: {
    canonical: "/es/guia-12-pasos",
    languages: { "en-US": "/quick-action-card", "es-US": "/es/guia-12-pasos" },
  },
};

export default async function QuickActionCardSpanishPage() {
  return <><Header locale="es" skipToContent /><main id="main-content" tabIndex={-1} className="quick-card-page">
    <section className="quick-card-intro">
      <p className="eyebrow">De Homo Plasticus · página 121</p>
      <h1>Tarjeta de acción rápida</h1>
      <p>Empieza con las tres reglas principales. La tarjeta de 12 pasos conserva la estructura del texto del Dr. Haddad y presenta una traducción al español, en lugar de sustituirla por una lista diferente.</p>
      <div>
        <PrintButton>Imprimir o guardar como PDF <span>↗</span></PrintButton>
        <TrackedLink href="/es/accion" eventName="cta_click" label="quick-card-es-back-to-solutions" className="text-link">Elige un cambio para empezar <span>→</span></TrackedLink>
        <TrackedLink href="/solutions/reduce-exposure" eventName="cta_click" label="quick-card-es-full-exposure-guide" className="text-link">Leer la guía completa de exposición <span>→</span></TrackedLink>
      </div>
    </section>

    <article className="quick-card-sheet" aria-labelledby="quick-card-sheet-title">
      <header>
        <p>Tarjeta de acción rápida</p>
        <h2 id="quick-card-sheet-title">12 pasos inmediatos para reducir tu exposición a microplásticos</h2>
        <span>Traducción del texto del autor de <em>Homo Plasticus</em>, página 121.</span>
      </header>

      <ol className="quick-card-authored-list">
        {authoredQuickActionCardEs.map((action) => <li key={action.number}>
          <span>{action.number}</span>
          <div>
            <strong>{action.text}</strong>
            {"reviewNote" in action && action.reviewNote ? <small>{action.reviewNote}</small> : null}
          </div>
        </li>)}
      </ol>

      <section className="quick-card-core-rules" aria-labelledby="core-rules-title">
        <p id="core-rules-title">Las 3 reglas principales</p>
        <ul>{coreRulesEs.map((rule) => <li key={rule.number}><strong>{rule.title}</strong></li>)}</ul>
      </section>

      <footer className="quick-card-remember">
        <strong>Recuerda</strong>
        {authoredCardRememberEs.map((line) => <p key={line}>{line}</p>)}
      </footer>
    </article>
  </main><Footer locale="es" /></>;
}
