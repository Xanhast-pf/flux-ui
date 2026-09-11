import { Callout, Card, Grid, Stack } from "@flux-ui/react";
import { CodeBlock } from "../ui/CodeBlock.js";
import { REPOSITORY_URL } from "../lib/format.js";
const contracts = [
  {
    title: "Native first",
    body: "HTML semantics, native props and browser behavior before custom abstractions. Accessibility belongs in the structure—not in a last-minute ARIA layer.",
  },
  {
    title: "Static by design",
    body: "Component styles are emitted as CSS. Semantic custom properties carry themes and accents. No runtime CSS-in-JS engine is added to consumer components.",
  },
  {
    title: "Convention over registration",
    body: "A component owns its behavior, styles, tests, stories, benchmark and metadata. Generators discover public surfaces; catalog growth does not require project-wide wiring.",
  },
  {
    title: "Small API, real escape hatches",
    body: "Sensible defaults for ordinary work. Native props, className, style, documented variables and compound composition for the uncommon case.",
  },
];
export function EngineeringPage() {
  return (
    <section className="reference-page">
      <Stack gap="lg">
        <header className="page-intro">
          <p className="eyebrow">Built to be inspected</p>
          <h1>A system beneath the surface.</h1>
          <p className="lede">
            Performance and accessibility are engineering contracts, not the
            last line of a launch page.
          </p>
        </header>
        <div
          className="system-flow"
          role="group"
          aria-label="Architecture: tokens feed React components, which feed documentation"
        >
          <div>
            <span>01</span>
            <h2>Tokens</h2>
            <p>
              Semantic variables
              <br />
              Light · dark · reduced motion
            </p>
          </div>
          <div>
            <span>02</span>
            <h2>Components</h2>
            <p>
              Native React composition
              <br />
              Static component CSS
            </p>
          </div>
          <div>
            <span>03</span>
            <h2>Real interfaces</h2>
            <p>
              Docs consume Flux
              <br />
              Same source in every demo
            </p>
          </div>
        </div>
        <Grid minColumnWidth="17rem" gap="md">
          {contracts.map((entry) => (
            <Card key={entry.title}>
              <Stack gap="sm">
                <h2>{entry.title}</h2>
                <p>{entry.body}</p>
              </Stack>
            </Card>
          ))}
        </Grid>
        <section>
          <h2>The measurement contract</h2>
          <p>
            Per-component emitted runtime graphs have raw, gzip and Brotli
            budgets, plus historical regression checks. Shared graphs overlap:
            adding every component’s compressed size is not an application
            bundle estimate. React and external packages are outside these graph
            measurements.
          </p>
          <p>
            Runtime checks compare synchronous mount, update and unmount against
            equivalent native React implementations. Paired medians reduce order
            bias; absolute cost accompanies ratios. Next-frame diagnostics are
            not paint or input-latency measurements. The live lab is an
            experiment, not a claim to be the fastest library.
          </p>
          <p>
            <a href="#size">Explore bundle budgets</a> ·{" "}
            <a href="#lab">Run the lab</a>
          </p>
        </section>
        <CodeBlock
          label="Contributor workflow"
          code={
            "pnpm component:new MyComponent Utilities\npnpm component:doctor MyComponent\npnpm generate\npnpm check:full"
          }
        />
        <section>
          <h2>What blocks a merge?</h2>
          <p>
            The Required CI job depends on both Quality and Browser. Quality
            checks generation drift, docs coverage, formatting, lint,
            TypeScript, unused code, tests, builds, size budgets and Coding
            Bible. Browser runs Chromium behavior, axe and native-relative
            performance checks. Pages is built only after those jobs pass.
            Repository rules must require that check; a YAML file cannot enable
            branch protection.
          </p>
          <p>
            <a href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Read the full engineering contract →
            </a>
          </p>
        </section>
        <Callout>
          Current limits: alpha APIs, two runtime benchmark scenarios, and
          Chromium-focused browser automation. Manual assistive-technology
          testing and broader browser coverage remain explicit review work. See
          the Trust Center before adopting Flux for a production-critical
          interface.
        </Callout>
        <a className="primary-link" href="#trust">
          Open the Trust Center →
        </a>
      </Stack>
    </section>
  );
}
