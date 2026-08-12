import { detectionSteps } from "../content/haddad-topics";
import { TrackedLink } from "./TrackedLink";

export function DetectionPrimer() {
  return (
    <section className="detection-primer" aria-labelledby="detection-primer-title">
      <div className="detection-primer-copy">
        <p className="eyebrow">Before the result</p>
        <h2 id="detection-primer-title">How do scientists know plastic is there?</h2>
        <p>Every finding begins with collection, contamination control, sample preparation, and an instrument chosen for a specific measurement. Different methods can report different kinds of evidence.</p>
        <TrackedLink className="text-link" href="/science/how-detection-works" eventName="cta_click" label="science-detection-primer">See how detection works <span>→</span></TrackedLink>
      </div>
      <ol>
        {detectionSteps.map((step) => (
          <li key={step.number}><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>
        ))}
      </ol>
    </section>
  );
}
