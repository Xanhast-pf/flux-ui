import { useState } from "react";
import { components } from "./generated/components.js";
import { health } from "./generated/health.js";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "flux-ui-theme";
const BYTES_PER_KIBIBYTE = 1024;
const MAX_PERF_RATIO_METER = 3;
const REPOSITORY_URL = "https://github.com/Xanhast-pf/flux-ui";
const ACTIONS_URL = `${REPOSITORY_URL}/actions`;

const colorTokens = [
  ["Canvas", "--flux-color-canvas"],
  ["Surface", "--flux-color-surface"],
  ["Surface subtle", "--flux-color-surface-subtle"],
  ["Surface elevated", "--flux-color-surface-elevated"],
  ["Text", "--flux-color-text"],
  ["Text muted", "--flux-color-text-muted"],
  ["Text subtle", "--flux-color-text-subtle"],
  ["Border", "--flux-color-border"],
  ["Border strong", "--flux-color-border-strong"],
  ["Accent", "--flux-color-accent"],
  ["Accent soft", "--flux-color-accent-soft"],
  ["Success", "--flux-color-success"],
  ["Success soft", "--flux-color-success-soft"],
  ["Warning", "--flux-color-warning"],
  ["Warning soft", "--flux-color-warning-soft"],
  ["Danger", "--flux-color-danger"],
  ["Danger soft", "--flux-color-danger-soft"],
  ["Info", "--flux-color-info"],
  ["Info soft", "--flux-color-info-soft"],
  ["Focus", "--flux-color-focus"],
] as const;

function initialTheme(): Theme {
  return document.documentElement.dataset.fluxTheme === "dark"
    ? "dark"
    : "light";
}

function setStoredTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme switching should still work when storage is unavailable.
  }
}

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "Pending baseline";
  if (bytes < BYTES_PER_KIBIBYTE) return `${bytes} B`;
  return `${(bytes / BYTES_PER_KIBIBYTE).toFixed(2)} KiB`;
}

function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`;
}

function formatRatio(value: number): string {
  const percent = (value - 1) * 100;
  const prefix = percent > 0 ? "+" : "";
  return `${value.toFixed(2)}× (${prefix}${percent.toFixed(1)}%)`;
}

function currentColorValue(variable: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function toggleTheme(): void {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.fluxTheme = nextTheme;
    setStoredTheme(nextTheme);
    setTheme(nextTheme);
  }

  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;

  return (
    <main>
      <header>
        <p>
          <strong>Flux UI · alpha</strong>
        </p>
        <aside aria-label="Site status">
          🚧 <strong>Under construction.</strong> The content and health data
          are real; the visual design is intentionally temporary.
        </aside>

        <h1>Flux UI project health & documentation</h1>
        <p>
          A living view of the design system: repository health, bundle budgets,
          runtime benchmarks, components, engineering rules, onboarding, and
          design tokens.
        </p>

        <p>
          <button
            type="button"
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            Use {theme === "light" ? "dark" : "light"} theme
          </button>{" "}
          <a href={REPOSITORY_URL}>GitHub repository</a>{" "}
          <a href={ACTIONS_URL}>Actions</a>
        </p>

        <a href={`${REPOSITORY_URL}/actions/workflows/ci.yml`}>
          <img
            src={`${REPOSITORY_URL}/actions/workflows/ci.yml/badge.svg`}
            alt="Current Flux UI CI workflow status"
          />
        </a>
      </header>

      <nav aria-label="Page sections">
        <ul>
          <li>
            <a href="#health">Health</a>
          </li>
          <li>
            <a href="#size">Bundle size</a>
          </li>
          <li>
            <a href="#performance">Runtime performance</a>
          </li>
          <li>
            <a href="#components">Components</a>
          </li>
          <li>
            <a href="#rules">Main rules</a>
          </li>
          <li>
            <a href="#install">Install & onboarding</a>
          </li>
          <li>
            <a href="#tokens">Design tokens</a>
          </li>
          <li>
            <a href="#documentation">Documentation</a>
          </li>
        </ul>
      </nav>

      <section id="health">
        <h2>Repository health</h2>
        <p>
          This page reads committed size and performance baselines generated
          from the repository. For the live CI result, use the Actions badge
          above.
        </p>

        <dl>
          <dt>Public component families</dt>
          <dd>{components.length}</dd>

          <dt>Runtime Brotli</dt>
          <dd>{formatBytes(runtimeBrotli)}</dd>

          <dt>Published package Brotli</dt>
          <dd>{formatBytes(publishedBrotli)}</dd>

          <dt>Size budget contract</dt>
          <dd>Version {health.size.budgetsVersion}</dd>

          <dt>Runtime performance policy</dt>
          <dd>Version {health.performance.policyVersion}</dd>

          <dt>Runtime styling engine</dt>
          <dd>0 B — static CSS and CSS variables</dd>
        </dl>

        <h3>Required quality gates</h3>
        <ul>
          <li>Generated registry is deterministic</li>
          <li>Prettier formatting</li>
          <li>ESLint</li>
          <li>Strict TypeScript</li>
          <li>Knip dependency/file analysis</li>
          <li>Vitest component and token tests</li>
          <li>Production package and docs builds</li>
          <li>Per-component bundle-size contracts</li>
          <li>Coding Bible automated rules</li>
          <li>Storybook production build</li>
          <li>Playwright accessibility and browser tests</li>
          <li>Native-relative runtime performance regression checks</li>
        </ul>
      </section>

      <section id="size">
        <h2>Bundle-size health</h2>
        <p>
          Every public component has an absolute complexity-class budget and a
          historical regression baseline. The meters below show Brotli size
          against each component&apos;s absolute budget.
        </p>

        <div className="table-scroll">
          <table>
            <caption>Current committed component size baselines</caption>
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Class</th>
                <th scope="col">Raw</th>
                <th scope="col">Gzip</th>
                <th scope="col">Brotli</th>
                <th scope="col">Budget usage</th>
              </tr>
            </thead>
            <tbody>
              {health.size.components.map((component) => {
                const usage = component.brotli / component.budgetBrotli;

                return (
                  <tr key={component.slug}>
                    <th scope="row">{component.name}</th>
                    <td>{component.sizeClass}</td>
                    <td>{formatBytes(component.raw)}</td>
                    <td>{formatBytes(component.gzip)}</td>
                    <td>{formatBytes(component.brotli)}</td>
                    <td>
                      <>
                        <meter
                          min={0}
                          max={1}
                          value={usage}
                          aria-label={`${component.name} Brotli budget usage`}
                        />{" "}
                        {(usage * 100).toFixed(1)}%
                      </>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p>
          Aggregate runtime: <strong>{formatBytes(runtimeBrotli)}</strong>.
          Published package: <strong>{formatBytes(publishedBrotli)}</strong>.
        </p>
      </section>

      <section id="performance">
        <h2>Runtime benchmark health</h2>
        <p>
          Playwright runs Chromium benchmarks against equivalent native React
          implementations. CI gates synchronous mount, update, and unmount
          ratios; next-frame measurements remain diagnostics.
        </p>

        {health.performance.scenarios.map((scenario) => {
          const reference = scenario.medians[scenario.reference];
          const flux = scenario.medians.flux;

          return (
            <article key={scenario.name}>
              <h3>
                {scenario.name} × {scenario.count}
              </h3>
              <p>
                Reference: <strong>{scenario.reference}</strong>
              </p>

              <div className="table-scroll">
                <table>
                  <caption>{scenario.name} runtime medians</caption>
                  <thead>
                    <tr>
                      <th scope="col">Metric</th>
                      <th scope="col">Reference</th>
                      <th scope="col">Flux</th>
                      <th scope="col">Flux/reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Mount</th>
                      <td>{formatMs(reference.mount)}</td>
                      <td>{formatMs(flux.mount)}</td>
                      <td>{formatRatio(scenario.ratios.mount)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Update</th>
                      <td>{formatMs(reference.update)}</td>
                      <td>{formatMs(flux.update)}</td>
                      <td>{formatRatio(scenario.ratios.update)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Unmount</th>
                      <td>{formatMs(reference.unmount)}</td>
                      <td>{formatMs(flux.unmount)}</td>
                      <td>{formatRatio(scenario.ratios.unmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <label>
                  Mount overhead ratio{" "}
                  <meter
                    min={0}
                    max={MAX_PERF_RATIO_METER}
                    value={Math.min(
                      scenario.ratios.mount,
                      MAX_PERF_RATIO_METER,
                    )}
                  >
                    {scenario.ratios.mount}
                  </meter>
                </label>
              </p>

              <details>
                <summary>Next-frame diagnostics</summary>
                <dl>
                  <dt>Reference mount → frame</dt>
                  <dd>{formatMs(reference.mountToFrame)}</dd>
                  <dt>Flux mount → frame</dt>
                  <dd>{formatMs(flux.mountToFrame)}</dd>
                  <dt>Mount → frame ratio</dt>
                  <dd>{formatRatio(scenario.ratios.mountToFrame)}</dd>
                  <dt>Reference update → frame</dt>
                  <dd>{formatMs(reference.updateToFrame)}</dd>
                  <dt>Flux update → frame</dt>
                  <dd>{formatMs(flux.updateToFrame)}</dd>
                  <dt>Update → frame ratio</dt>
                  <dd>{formatRatio(scenario.ratios.updateToFrame)}</dd>
                </dl>
              </details>
            </article>
          );
        })}
      </section>

      <section id="components">
        <h2>Component inventory</h2>
        <table>
          <caption>Current public Flux UI component families</caption>
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Category</th>
              <th scope="col">Status</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.slug}>
                <th scope="row">{component.name}</th>
                <td>{component.category}</td>
                <td>{component.status}</td>
                <td>{component.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="rules">
        <h2>Main engineering rules</h2>
        <ol>
          <li>
            <strong>Easy to use first.</strong> Public APIs absorb complexity
            instead of forcing casts, workarounds, or framework trivia on
            consumers.
          </li>
          <li>
            <strong>Native semantics first.</strong> Extend the platform instead
            of replacing it.
          </li>
          <li>
            <strong>Static styling.</strong> No runtime CSS-in-JS styling
            engine.
          </li>
          <li>
            <strong>Quarter-rem spatial rhythm.</strong> Reusable spacing,
            radii, controls, and breakpoints use explicit rem values on a
            0.25rem grid.
          </li>
          <li>
            <strong>Standard spacing is 1rem.</strong> Default radius is
            0.25rem.
          </li>
          <li>
            <strong>Performance is a contract.</strong> Size and runtime
            regressions fail CI.
          </li>
          <li>
            <strong>Accessibility is not optional.</strong> Components and the
            docs app are tested with semantic, keyboard, and automated
            accessibility checks.
          </li>
          <li>
            <strong>Generated infrastructure stays deterministic.</strong> New
            components are scaffolded and registered by convention.
          </li>
        </ol>
      </section>

      <section id="install">
        <h2>Install & onboarding</h2>
        <p>
          Flux UI is still alpha and not yet presented as a stable public
          package. To work on the repository:
        </p>

        <pre>
          <code>{`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install
pnpm check`}</code>
        </pre>

        <h3>Daily development</h3>
        <pre>
          <code>{`pnpm dev
pnpm storybook

# Before pushing
pnpm check

# Browser, a11y, Storybook and perf
pnpm check:full`}</code>
        </pre>

        <h3>Add a component</h3>
        <pre>
          <code>{`pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
pnpm size:update`}</code>
        </pre>
      </section>

      <section id="tokens">
        <h2>Design tokens</h2>
        <p>
          Active theme: <strong>{theme}</strong>. Toggle the theme at the top of
          the page to inspect both semantic palettes.
        </p>

        <h3>Spatial rhythm</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Base grid</th>
              <td>0.25rem</td>
            </tr>
            <tr>
              <th scope="row">Standard spacing</th>
              <td>1rem</td>
            </tr>
            <tr>
              <th scope="row">Standard radius</th>
              <td>0.25rem</td>
            </tr>
            <tr>
              <th scope="row">Large radius</th>
              <td>0.5rem</td>
            </tr>
          </tbody>
        </table>

        <h3>Semantic color palette</h3>
        <ul className="palette">
          {colorTokens.map(([label, variable]) => (
            <li key={variable}>
              <span
                className="swatch"
                style={{ backgroundColor: `var(${variable})` }}
                aria-hidden="true"
              />{" "}
              <strong>{label}</strong> — <code>{variable}</code> —{" "}
              <code>{currentColorValue(variable)}</code>
            </li>
          ))}
        </ul>
      </section>

      <section id="documentation">
        <h2>Documentation</h2>
        <ul>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/README.md`}>Project README</a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/development.md`}>
              Development workflow
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/architecture.md`}>
              Architecture
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/component-api.md`}>
              Component API rules
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/design-tokens.md`}>
              Design tokens
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/docs/performance.md`}>
              Performance philosophy
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}>
              Contributing
            </a>
          </li>
          <li>
            <a href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
              Engineering contract
            </a>
          </li>
        </ul>
      </section>

      <footer>
        <p>
          Flux UI is under construction. This page intentionally prioritizes
          truthful project data and documentation structure over visual polish.
        </p>
      </footer>
    </main>
  );
}
