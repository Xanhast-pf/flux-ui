import { ArrowUpRightIcon } from "@flux-ui/icons";
import { Badge, Card, Collapsible, Grid, Inline, Stack } from "@flux-ui/react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { ReleaseRoom } from "../demos/ReleaseRoom.js";
import { formatBytes } from "../lib/format.js";

export function OverviewPage() {
  const button = health.size.components.find(
    (entry) => entry.slug === "button",
  );
  return (
    <Stack gap="xl">
      <section className="launch-hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <Badge tone="accent">A design system with nothing to hide.</Badge>
            <h1>
              Build beautifully.
              <br />
              <span>Prove the details.</span>
            </h1>
            <p className="lede">
              Native-first React components. A considered visual language.
              Engineering you can actually inspect.
            </p>
            <Inline gap="sm" wrap>
              <a className="primary-link" href="#components">
                Explore the components{" "}
                <ArrowUpRightIcon aria-hidden="true" size={16} />
              </a>
              <a className="secondary-link" href="#lab">
                Run the live lab →
              </a>
            </Inline>
            <p className="hero-note">
              React 19 · Static CSS · MIT · Alpha, openly
            </p>
          </div>
          <div className="hero-demo-frame">
            <div className="demo-frame-heading">
              <span className="eyebrow">Made of Flux</span>
              <span>Live components, not a screenshot</span>
            </div>
            <ReleaseRoom />
          </div>
        </div>
        <div className="evidence-ribbon">
          <div>
            <strong>{components.length}</strong>
            <span>discoverable components</span>
            <a href="#components">Explore the catalog</a>
          </div>
          <div>
            <strong>{formatBytes(button?.brotli ?? null)}</strong>
            <span>Button runtime graph · Brotli</span>
            <a href="#size">Committed baseline, not app bundle</a>
          </div>
          <div>
            <strong>Native first</strong>
            <span>equivalent React references</span>
            <a href="#performance">Read the measurement method</a>
          </div>
        </div>
      </section>
      <section className="launch-section">
        <div className="section-heading">
          <p className="eyebrow">Good design. Accountable engineering.</p>
          <h2>
            Feel the polish.
            <br />
            Inspect the foundations.
          </h2>
          <p className="lede">
            The same system serves the people shaping the interface and the
            people shipping it.
          </p>
        </div>
        <Grid minColumnWidth="17rem" gap="md">
          <Card>
            <Stack gap="md">
              <p className="eyebrow">For designers</p>
              <h3>A coherent language, not a pile of widgets.</h3>
              <p>
                Semantic tokens, deliberate states, flexible composition and a
                visual identity that stays yours. Explore real interactions in
                light and dark themes.
              </p>
              <Inline gap="md" wrap>
                <a href="#tokens">Design tokens →</a>
                <a href="#playground">Interactive playground →</a>
              </Inline>
            </Stack>
          </Card>
          <Card>
            <Stack gap="md">
              <p className="eyebrow">For developers</p>
              <h3>Easy until you need power.</h3>
              <p>
                Small APIs, native props, static styling and escape hatches.
                Every example runs the source you see. Every public component
                has a measurable budget.
              </p>
              <Inline gap="md" wrap>
                <a href="#engineering">Engineering →</a>
                <a href="#install">Getting started →</a>
              </Inline>
            </Stack>
          </Card>
        </Grid>
      </section>
      <section className="proof-grid" aria-label="Inspect the evidence">
        <a href="#lab" className="proof-card">
          <span className="feature-number">01 / Experiment</span>
          <h2>Put Flux under pressure.</h2>
          <p>
            Run paired native-versus-Flux tests on your own device. Inspect raw
            samples, overhead and scaling.
          </p>
          <span className="proof-link">Open the Stress Lab →</span>
        </a>
        <a href="#size" className="proof-card">
          <span className="feature-number">02 / Understand</span>
          <h2>Know what you ship.</h2>
          <p>
            Explore the actual component graph measurements and the budgets that
            keep growth intentional.
          </p>
          <span className="proof-link">Explore the bundle map →</span>
        </a>
        <a href="#trust" className="proof-card">
          <span className="feature-number">03 / Verify</span>
          <h2>Follow the evidence.</h2>
          <p>
            Inspect CI receipts, security workflows and release verification.
            Unknown means unknown—not green.
          </p>
          <span className="proof-link">Visit the Trust Center →</span>
        </a>
      </section>
      <section className="explore-strip">
        <div>
          <p className="eyebrow">Structural, not decorative</p>
          <h2>Accessibility should be testable.</h2>
          <p>
            Run axe locally, introduce a deliberate defect, and inspect a real
            finding.
          </p>
        </div>
        <a className="primary-link" href="#accessibility">
          Try the live axe demo →
        </a>
      </section>
      <section>
        <Stack gap="md">
          <h2>Open about where we are.</h2>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Flux is alpha. APIs are evolving. Measured components and
                passing checks are useful evidence, not a blanket
                production-readiness guarantee. Review the actual scope and
                remaining work before adopting.
              </p>
              <a href="#trust">Review the Trust Center</a>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux the fastest or smallest design system?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                No such universal claim is made. Results depend on the
                component, behavior, application and measurement method. We
                publish native-relative timings, raw samples and explicit size
                scopes rather than a cherry-picked leaderboard.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Does this demo send my data anywhere?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Playground state, benchmark samples and axe results stay in your
                browser unless you export them yourself. Appearance preferences
                use local storage. The Trust Center fetches static evidence from
                this site. Following external verification links takes you to
                their providers.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </section>
    </Stack>
  );
}
