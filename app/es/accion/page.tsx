import type { Metadata } from "next";
import { Footer, Header } from "../../components/SiteChrome";
import { TrackedLink } from "../../components/TrackedLink";
import { ActionPlanner } from "../../components/ActionPlanner";
import { coreRulesEs } from "../../content/es/actions";
import { reduceExposureGroupsEs } from "../../content/es/haddad-topics";

export const dynamic = "force-dynamic";

const description = "Un punto de partida sencillo para usar menos plástico en el agua, los alimentos, el calor, el almacenamiento y los productos cotidianos.";

export const metadata: Metadata = {
  title: "Acción práctica | Say No to Plastic",
  description,
  alternates: {
    canonical: "/es/accion",
    languages: { "en-US": "/solutions", "es-US": "/es/accion" },
  },
  openGraph: {
    title: "Acción práctica | Say No to Plastic",
    description,
    url: "/es/accion",
    siteName: "Say No to Plastic",
    type: "website",
    images: [{ url: "/kitchen.webp", width: 1536, height: 1024, alt: "Opciones prácticas para usar menos plástico en la cocina" }],
  },
};

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

      <section className="solutions-direct ivory" aria-labelledby="solutions-direct-title">
        <div className="solutions-direct-inner">
          <div className="solutions-direct-lead">
            <figure className="solutions-kitchen-figure">
              <picture>
                <source media="(max-width: 767px)" srcSet="/kitchen-mobile.webp" />
                <img src="/kitchen-desktop.webp" width="1536" height="1024" loading="lazy" alt="Una cocina con menos plástico, con almacenamiento de vidrio, recipientes de acero, utensilios de madera y hierro fundido" />
              </picture>
              <figcaption>Empieza por los materiales que tocas todos los días: agua, almacenamiento, utensilios, vasos, platos y alimentos calientes.</figcaption>
            </figure>
            <div className="solutions-direct-copy">
              <p className="eyebrow dark">Empieza en la cocina</p>
              <h2 id="solutions-direct-title">Tres cambios directos, con los detalles separados en guías.</h2>
            </div>
          </div>

          <div className="solutions-direct-grid">
            <TrackedLink href="/resources/microplastics-drinking-water-filter-guide" eventName="cta_click" label="solutions-es-direct-water">
              <span>01 · Agua</span><h3>Evita el uso rutinario de botellas de plástico.</h3><p>Usa vidrio o acero inoxidable. Compara la ósmosis inversa y otros filtros con el agua local y las necesidades de mantenimiento.</p><b>Abrir guía del agua (en inglés) →</b>
            </TrackedLink>
            <TrackedLink href="/resources/plastic-kitchen-conversion" eventName="cta_click" label="solutions-es-direct-kitchen">
              <span>02 · Cocina</span><h3>Reemplaza el plástico usado alrededor del calor y los alimentos.</h3><p>Empieza por almacenamiento, recipientes para beber, utensilios, platos, vasos y los objetos que usas todos los días.</p><b>Abrir guía de cocina (en inglés) →</b>
            </TrackedLink>
            <TrackedLink href="/resources/single-use-plastic-foodware" eventName="cta_click" label="solutions-es-direct-single-use">
              <span>03 · Un solo uso</span><h3>Reduce los utensilios y recipientes desechables cuando sea práctico.</h3><p>Concéntrate en vasos, platos, cubiertos, recipientes para llevar y la comida o evento repetido que genera más residuos.</p><b>Abrir guía de un solo uso (en inglés) →</b>
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="solutions-exposure-framework" aria-labelledby="solutions-exposure-title">
        <header>
          <p className="eyebrow">Más allá de las tres primeras reglas</p>
          <h2 id="solutions-exposure-title">Usa menos plástico. Construye desde ahí.</h2>
          <p>Se trata de reducir, no de alcanzar la perfección. Aplica el mismo enfoque sencillo a alimentos, agua, aire interior, ropa, cuidado personal y las rutinas que se repiten durante años.</p>
          <TrackedLink className="button outline" href="/es/accion/reducir-exposicion" eventName="cta_click" label="solutions-es-full-reduce-exposure">Leer la guía completa para reducir la exposición <span>→</span></TrackedLink>
        </header>
        <div>
          {reduceExposureGroupsEs.slice(1).map((group) => (
            <article key={group.id}>
              <span>{group.number}</span>
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
              <ul>{group.actions.slice(0, 3).map((action) => <li key={action}>{action}</li>)}</ul>
              <TrackedLink href={`/es/accion/reducir-exposicion#${group.id}`} eventName="cta_click" label={`solutions-es-framework-${group.id}`}>Abrir esta prioridad <b>→</b></TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <div id="planner"><ActionPlanner locale="es" /></div>

      <section className="solutions-next">
        <div>
          <p className="eyebrow">Más detalle, cuando lo necesites</p>
          <h2>Empieza con un cambio. Profundiza cuando lo necesites.</h2>
          <p>Usa la guía de 12 pasos para una lista completa, la guía de reducción para organizar prioridades o el registro científico para ver la evidencia detrás de las recomendaciones.</p>
        </div>
        <div>
          <TrackedLink href="/es/accion/reducir-exposicion" eventName="cta_click" label="solutions-es-reduce-exposure-bottom">Leer la guía completa de reducción <span>→</span></TrackedLink>
          <TrackedLink href="/es/guia-12-pasos" eventName="cta_click" label="solutions-es-quick-card-bottom">Ver las 12 acciones <span>→</span></TrackedLink>
          <TrackedLink href="/resources" eventName="cta_click" label="solutions-es-guides">Abrir las guías (en inglés) <span>→</span></TrackedLink>
          <TrackedLink href="/es/ciencia" eventName="cta_click" label="solutions-es-science">Explorar la ciencia <span>→</span></TrackedLink>
        </div>
      </section>
    </main>
    <Footer locale="es" />
  </>;
}
