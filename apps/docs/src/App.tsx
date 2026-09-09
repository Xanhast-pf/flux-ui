import { Button } from "@flux-ui/react";
import { components } from "./generated/components.js";

export function App() {
  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">FLUX UI · ALPHA</p>
        <h1>
          Beautiful by default.
          <br />
          Fast by construction.
        </h1>
        <p className="lede">
          A high-confidence React design system where performance,
          accessibility, customization, and API quality are tested contracts.
        </p>
        <div className="actions">
          <Button>Explore components</Button>
          <Button variant="outline">Read the architecture</Button>
        </div>
      </header>

      <section className="metrics" aria-label="Project principles">
        <article>
          <strong>{components.length}</strong>
          <span>component scaffolded</span>
        </article>
        <article>
          <strong>0 B</strong>
          <span>runtime styling engine</span>
        </article>
        <article>
          <strong>AA+</strong>
          <span>accessibility target</span>
        </article>
        <article>
          <strong>CI</strong>
          <span>performance budgets</span>
        </article>
      </section>

      <section className="showcase">
        <div>
          <p className="eyebrow">BUTTON</p>
          <h2>Simple API. Real escape hatches.</h2>
          <p>
            Native semantics, static CSS, consumer class names and CSS
            variables, predictable states.
          </p>
        </div>
        <div className="component-stage">
          <Button>Save changes</Button>
          <Button intent="neutral">Cancel</Button>
          <Button intent="danger">Delete</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
    </main>
  );
}
