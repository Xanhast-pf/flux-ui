import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  GaugeIcon,
  ShieldCheckIcon,
} from "@flux-ui/icons";
import { Collapsible } from "@flux-ui/react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
import { ProductShowcase } from "../showcase/ProductShowcase.js";
export function OverviewPage() {
  const button = health.size.components.find(
    (entry) => entry.slug === "button",
  );
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div>
          <p className="eyebrow">
            <span className="hero-signal" aria-hidden="true" />
            Flux UI / a React design system
          </p>
          <h1>
            One system.
            <br />
            <span>Different worlds.</span>
          </h1>
        </div>
        <div className="landing-intro">
          <p>For everything you haven’t built yet.</p>
          <p>
            From your next big launch to your next great track. Thoughtful
            components, with room for your point of view.
          </p>
          <div className="landing-hero-actions">
            <a className="primary-link" href="#install">
              Start building <ArrowUpRightIcon size={16} />
            </a>
            <a className="landing-text-link" href="#components">
              Meet the components <ArrowRightIcon size={16} />
            </a>
          </div>
          <span>Open source · React 19 · Static CSS · Alpha</span>
        </div>
      </section>
      <ProductShowcase page="overview" />
      <section className="system-story" aria-labelledby="system-story-title">
        <div className="system-story-heading">
          <p className="eyebrow">A point of view. Not a straitjacket.</p>
          <h2 id="system-story-title">
            Expressive on the surface.
            <br />
            <span>Considered underneath.</span>
          </h2>
          <p>
            The examples change. The foundations don’t. Build with the same
            primitives, then make the result unmistakably yours.
          </p>
        </div>
        <div className="system-principles">
          <a href="#tokens">
            <span className="principle-number">01 / Shape the feeling</span>
            <h3>A mood, not just a color.</h3>
            <p>
              Semantic surfaces, readable contrast, measured space. Change the
              atmosphere without changing the components.
            </p>
            <span className="principle-link">
              Explore the tokens <ArrowUpRightIcon size={16} />
            </span>
          </a>
          <a href="#components">
            <span className="principle-number">
              02 / Find your building blocks
            </span>
            <h3>Small pieces. Real possibilities.</h3>
            <p>
              {components.length} discoverable component families. Native props,
              composition, and escape hatches when your idea needs more.
            </p>
            <span className="principle-link">
              Open the catalog <ArrowUpRightIcon size={16} />
            </span>
          </a>
          <a href="#engineering">
            <span className="principle-number">03 / Keep your freedom</span>
            <h3>Yours, beyond the demo.</h3>
            <p>
              Static styling and simple APIs. No special showcase component
              library hiding behind these examples.
            </p>
            <span className="principle-link">
              Read the engineering <ArrowUpRightIcon size={16} />
            </span>
          </a>
        </div>
      </section>
      <section className="evidence-story" aria-label="Inspect the evidence">
        <div className="evidence-story-intro">
          <p className="eyebrow">Nothing up our sleeves</p>
          <h2>
            Looks good.
            <br />
            Show your work.
          </h2>
          <p>
            Nice interfaces deserve honest engineering. Inspect what’s measured,
            what’s tested, and what still needs work.
          </p>
        </div>
        <div className="evidence-story-links">
          <a href="#lab">
            <GaugeIcon size={24} />
            <span>
              <strong>Put it under pressure.</strong>
              <small>Run the opt-in, native-relative Stress Lab.</small>
            </span>
            <ArrowUpRightIcon size={16} />
          </a>
          <a href="#size">
            <CodeIcon size={24} />
            <span>
              <strong>
                {formatBytes(button?.brotli ?? null)} · Button runtime graph
              </strong>
              <small>Committed Brotli baseline. Not an app-bundle claim.</small>
            </span>
            <ArrowUpRightIcon size={16} />
          </a>
          <a href="#trust">
            <ShieldCheckIcon size={24} />
            <span>
              <strong>Follow the evidence.</strong>
              <small>
                Build receipts, security workflows, and their limits.
              </small>
            </span>
            <ArrowUpRightIcon size={16} />
          </a>
          <a href="#accessibility">
            <span className="evidence-axe-mark" aria-hidden="true">
              a11y
            </span>
            <span>
              <strong>Don’t just read about accessibility.</strong>
              <small>Introduce a defect. Run axe. Inspect the repair.</small>
            </span>
            <ArrowUpRightIcon size={16} />
          </a>
        </div>
      </section>
      <section className="landing-faq" aria-label="A few honest answers">
        <div>
          <p className="eyebrow">Still becoming</p>
          <h2>A few honest answers.</h2>
          <p>Open source. Open about the details.</p>
        </div>
        <div>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is everything in the showcase a Flux component?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                The controls use public Flux exports. Charts, artwork,
                timelines, and product layouts are custom demo compositions.
                Every scene’s inspector lists the ingredients and the gaps.
                These examples can evolve as the component library grows.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Flux is alpha. APIs are evolving. Passing checks and measured
                components are useful evidence, not a blanket
                production-readiness guarantee.
              </p>
              <a href="#trust">Review the actual trust evidence →</a>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Are the demos connected to real services?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                No. Products, people, and figures are fictional. Demo actions
                update in-memory state; music playback is visual and silent, and
                the video editor uses illustrated frames. Switching scenes or
                reloading resets the demo. Scene and mood are shareable in the
                URL. Appearance preferences remain local to your browser.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux the fastest or smallest design system?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                No universal claim is made. Component behavior, application
                context, and measurement method matter. The benchmarks publish
                native-relative timings and explicit size scopes.
              </p>
              <a href="#performance">Read the measurement methodology →</a>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </section>
      <section className="landing-outro">
        <p className="eyebrow">The next world is yours</p>
        <h2>What will you make of it?</h2>
        <a className="primary-link" href="#install">
          Find your starting point <ArrowUpRightIcon size={16} />
        </a>
      </section>
    </div>
  );
}
