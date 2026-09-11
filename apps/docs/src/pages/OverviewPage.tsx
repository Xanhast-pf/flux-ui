import { ArrowUpRightIcon, SparkIcon } from "@flux-ui/icons";
import { Badge, Card, Collapsible, Grid, Inline, Stack } from "@flux-ui/react";
import { components } from "../generated/components.js";
import { ReleaseRoom } from "../demos/ReleaseRoom.js";
export function OverviewPage() {
  return (
    <Stack gap="xl">
      <div className="hero-grid">
        <div className="hero-copy">
          <Badge tone="accent">Small pieces. Serious possibilities.</Badge>
          <h1>
            Less weight.
            <br />
            <span>More possibility.</span>
          </h1>
          <p className="lede">
            A native-first React toolkit for interfaces that feel good to
            use—and good to build. Play with the pieces. Make them yours.
          </p>
          <Inline gap="sm" wrap>
            <a className="primary-link" href="#components">
              Explore {components.length} components
              <ArrowUpRightIcon aria-hidden="true" size={16} />
            </a>
            <a className="secondary-link" href="#icons">
              <SparkIcon aria-hidden="true" size={16} />
              Browse Flux Icons
            </a>
          </Inline>
          <p className="hero-note">React 19 · Static CSS · Keyboard-first</p>
        </div>
        <ReleaseRoom />
      </div>
      <Grid minColumnWidth="14rem" gap="md">
        <Card>
          <Stack gap="sm">
            <span className="feature-number">01 / Composable</span>
            <h2>Bring your own ideas.</h2>
            <p>
              Small APIs, native props, and escape hatches. Pieces that work
              together without locking you in.
            </p>
          </Stack>
        </Card>
        <Card>
          <Stack gap="sm">
            <span className="feature-number">02 / Measured</span>
            <h2>Every byte has a job.</h2>
            <p>
              Per-component size budgets and native-relative runtime checks.
              Inspect the evidence, not a superlative.
            </p>
            <a href="#size">See committed measurements →</a>
          </Stack>
        </Card>
        <Card>
          <Stack gap="sm">
            <span className="feature-number">03 / Thoughtful</span>
            <h2>Good defaults matter.</h2>
            <p>
              Native semantics, visible focus, semantic tokens, and
              reduced-motion styles are part of the work.
            </p>
            <a href="#rules">Read the engineering contract →</a>
          </Stack>
        </Card>
      </Grid>
      <section className="explore-strip">
        <div>
          <p className="eyebrow">A little less boilerplate</p>
          <h2>Find your next building block.</h2>
        </div>
        <Inline gap="sm" wrap>
          {["button", "field", "switch", "dialog", "tabs", "table"].map(
            (slug) => (
              <a
                className="component-chip"
                key={slug}
                href={`#components/${slug}`}
              >
                {slug}
                <ArrowUpRightIcon aria-hidden="true" size={14} />
              </a>
            ),
          )}
        </Inline>
      </section>
      <section>
        <Stack gap="md">
          <h2>A few good questions.</h2>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Flux is alpha. APIs are still evolving. The docs show actual
                components and committed measurements, but a green example is
                not a blanket production-readiness guarantee.
              </p>
              <a href="#health">Review project health</a>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Do I need a styling runtime?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Flux component styles are emitted as CSS. Themes use CSS
                variables. There is no runtime CSS-in-JS engine in the public
                components.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Does this demo send my data anywhere?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                No. Playground interactions stay in memory. Only theme and
                accent preferences are saved in your browser. Reloading resets
                demo data.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </section>
    </Stack>
  );
}
