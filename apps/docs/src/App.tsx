import { Button, Container, Grid, Inline, Stack } from "@flux-ui/react";
import { components } from "./generated/components.js";

export function App() {
  return (
    <main>
      <Container className="docs-shell" size="xl">
        <Stack gap="xl">
          <header className="hero">
            <p className="eyebrow">FLUX UI · ALPHA</p>
            <h1>
              Beautiful by default.
              <br />
              Fast by construction.
            </h1>
            <p className="lede">
              A high-confidence React design system where performance,
              accessibility, customization, and API quality are tested
              contracts.
            </p>
            <Inline gap="sm" wrap>
              <Button>Explore components</Button>
              <Button variant="outline">Read the architecture</Button>
            </Inline>
          </header>

          <Grid
            className="metrics"
            minColumnWidth="12rem"
            gap="none"
            aria-label="Project principles"
            role="region"
          >
            <article>
              <strong>{components.length}</strong>
              <span>component families</span>
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
          </Grid>

          <Grid
            className="showcase"
            columns={{ base: 1, lg: 2 }}
            gap="xl"
            align="center"
          >
            <div>
              <p className="eyebrow">BUTTON</p>
              <h2>Simple API. Real escape hatches.</h2>
              <p>
                Native semantics, static CSS, consumer class names and CSS
                variables, predictable states.
              </p>
            </div>
            <Grid className="component-stage" minColumnWidth="9rem" gap="sm">
              <Button>Save changes</Button>
              <Button tone="neutral">Cancel</Button>
              <Button tone="danger">Delete</Button>
              <Button variant="ghost">Ghost</Button>
            </Grid>
          </Grid>

          <section>
            <Inline justify="between" align="end" gap="md" wrap>
              <div>
                <p className="eyebrow">LAYOUT</p>
                <h2>Describe the layout, not the arithmetic.</h2>
              </div>
              <span className="muted">Grid · Stack · Inline · Container</span>
            </Inline>
            <Grid className="layout-demo" minColumnWidth="13rem" gap="md">
              {Array.from(
                { length: 6 },
                (_, index) => `Auto-fit card ${index + 1}`,
              ).map((label) => (
                <article key={label}>{label}</article>
              ))}
            </Grid>
          </section>
        </Stack>
      </Container>
    </main>
  );
}
