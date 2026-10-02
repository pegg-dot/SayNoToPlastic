import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { coreRulesEs } from "../../content/es/actions";

export const dynamic = "force-dynamic";

const description = "Un punto de partida sencillo para usar menos plástico en el agua, los alimentos, el calor, el almacenamiento y los productos cotidianos.";

export const metadata: Metadata = {
  title: "Acción práctica | Say No to Plastic",
  description,
  alternates: {
    canonical: "/es/accion",
    languages: { "en-US": "/solutions", "es-US": "/es/accion" },
  },
};

const framework = [
  {
    number: "01",
    title: "Empieza por el calor.",
    body: "Evita calentar alimentos en plástico. Pasa las rutinas repetidas de microondas y comida caliente a vidrio, cerámica o acero inoxidable.",
  },
  {
    number: "02",
    title: "Cambia el almacenamiento repetido.",
    body: "No necesitas rehacer toda la cocina. Empieza por los alimentos que guardas con más frecuencia y cambia esos recipientes primero.",
  },
  {
    number: "03",
    title: "Revisa lo que bebes cada día.",
    body: "Una botella o un vaso que usas a diario es una oportunidad clara para elegir vidrio o acero inoxidable y reducir el uso rutinario de plástico.",
  },
  {
    number: "04",
    title: "Reduce lo desechable.",
    body: "Comida para llevar, cubiertos, vasos y recipientes de un solo uso son lugares directos donde se puede usar menos plástico.",
  },
  {
    number: "05",
    title: "Piensa en lo que se repite.",
    body: "La reducción de exposición funciona mejor cuando cambia una rutina frecuente. Prioriza hábitos diarios antes que cambios raros o difíciles de mantener.",
  },
  {
    number: "06",
    title: "Busca reducción, no perfección.",
    body: "El objetivo no es vivir sin plástico de un día para otro. Es disminuir de forma práctica y constante las exposiciones que puedes controlar.",
  },
];

export default function SolutionsSpanishPage() {
  return <>
    <Header locale="es" skipToContent />
    <main id="main-content" tabIndex={-1} className="solutions-v2">
      <section className="solutions-hero">
        <div>
          <p className="eyebrow">Acción práctica</p>
          <h1>Primero: usa menos plástico.</h1>
          <p>No compliques demasiado el primer paso. Elige menos plástico cuando exista una alternativa práctica, especialmente alrededor de alimentos calientes, bebidas, almacenamiento y los productos que usas todos los días.</p>
          <div className="solutions-hero-actions">
            <a className="button gold" href="#first-three">Ver por dónde empezar <span>↓</span></a>
            <TrackedLink className="text-link" href="/es/guia-12-pasos" eventName="cta_click" label="solutions-es-quick-card-hero">Abrir la guía de 12 pasos <span>→</span></TrackedLink>
          </div>
        </div>
        <aside>
          <span>El enfoque del Dr. Haddad</span>
          <strong>Mantenlo sencillo.</strong>
          <p>Usa menos plástico donde puedas, empieza por lo que se repite y haz un cambio práctico a la vez.</p>
        </aside>
      </section>

      <section id="first-three" className="solutions-core">
        <header>
          <p className="eyebrow">Las tres reglas principales</p>
          <h2>Haz que la primera acción sea inconfundible.</h2>
          <p>No calientes plástico. No guardes alimentos en plástico. No bebas de recipientes de plástico.</p>
        </header>
        <ol>{coreRulesEs.map((rule) => <li key={rule.number}><span>{rule.number}</span><h3>{rule.title}</h3><p>{rule.detail}</p></li>)}</ol>
      </section>

      <section className="solutions-exposure" aria-labelledby="solutions-exposure-title">
        <header>
          <p className="eyebrow">Un marco para reducir la exposición</p>
          <h2 id="solutions-exposure-title">Usa menos plástico. Construye desde ahí.</h2>
          <p>Se trata de reducir, no de alcanzar la perfección. Aplica el mismo enfoque sencillo al agua, los alimentos, el aire interior, la ropa, el cuidado personal y las rutinas que se repiten durante años.</p>
        </header>
        <div className="solutions-exposure-grid">
          {framework.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
        </div>
      </section>

      <section className="page-cta">
        <p className="eyebrow">Un paso concreto</p>
        <h2>Empieza con una rutina que repites cada día.</h2>
        <p>La guía rápida reúne doce acciones y mantiene visibles las notas donde la evidencia todavía tiene límites.</p>
        <TrackedLink href="/es/guia-12-pasos" className="button gold" eventName="cta_click" label="solutions-es-final-guide">Abrir la guía de 12 pasos <span>→</span></TrackedLink>
      </section>
    </main>
    <Footer locale="es" />
  </>;
}
