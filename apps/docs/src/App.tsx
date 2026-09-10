import {
  Button,
  Container,
  Dialog,
  Drawer,
  Field,
  Grid,
  Inline,
  Input,
  Stack,
  Tabs,
  Textarea,
} from "@flux-ui/react";
import { useState, type ReactNode } from "react";
import { CheckboxDemo } from "./demos/CheckboxDemo.js";
import { components } from "./generated/components.js";
import { health } from "./generated/health.js";

type Theme = "light" | "dark";

type ShowcaseCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const THEME_STORAGE_KEY = "flux-ui-theme";
const BYTES_PER_KIBIBYTE = 1024;
const MAX_PERF_RATIO_METER = 3;
const REPOSITORY_URL = "https://github.com/Xanhast-pf/flux-ui";
const ACTIONS_URL = `${REPOSITORY_URL}/actions`;

const sectionLinks = [
  ["health", "Health"],
  ["size", "Bundle size"],
  ["performance", "Runtime performance"],
  ["components", "Components"],
  ["rules", "Main rules"],
  ["install", "Install & onboarding"],
  ["tokens", "Design tokens"],
  ["documentation", "Documentation"],
] as const;

function SectionNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation sections">
      <ul className="section-nav-list">
        {sectionLinks.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} onClick={onNavigate}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

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

function budgetUsage(
  brotli: number | null,
  budgetBrotli: number,
): number | null {
  return brotli === null ? null : brotli / budgetBrotli;
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

function ShowcaseCard({ title, description, children }: ShowcaseCardProps) {
  return (
    <article className="showcase-card">
      <Stack gap="md">
        <div>
          <h3>{title}</h3>
          <p className="muted">{description}</p>
        </div>
        <div className="component-demo">{children}</div>
      </Stack>
    </article>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function toggleTheme(): void {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.fluxTheme = nextTheme;
    setStoredTheme(nextTheme);
    setTheme(nextTheme);
  }

  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;

  return (
    <Drawer.Root open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <main>
        <Container size="lg" className="page-shell">
          <Stack gap="xl">
            <header className="page-header">
              <Stack gap="md">
                <p className="eyebrow">
                  <strong>Flux UI · alpha</strong>
                </p>

                <aside aria-label="Site status" className="status-banner">
                  🚧 <strong>Under construction.</strong> The content and health
                  data are real; the visual design is intentionally temporary.
                </aside>

                <div>
                  <h1>Flux UI project health & documentation</h1>
                  <p className="lede">
                    A living view of the design system: repository health,
                    bundle budgets, runtime benchmarks, components, engineering
                    rules, onboarding, and design tokens.
                  </p>
                </div>

                <Inline gap="sm" wrap>
                  <Drawer.Trigger className="mobile-nav-trigger">
                    Browse sections
                  </Drawer.Trigger>
                  <Button
                    type="button"
                    aria-pressed={theme === "dark"}
                    onClick={toggleTheme}
                    variant="outline"
                  >
                    Use {theme === "light" ? "dark" : "light"} theme
                  </Button>
                  <a className="action-link" href={REPOSITORY_URL}>
                    GitHub repository
                  </a>
                  <a className="action-link" href={ACTIONS_URL}>
                    Actions
                  </a>
                </Inline>

                <a
                  className="ci-badge"
                  href={`${REPOSITORY_URL}/actions/workflows/ci.yml`}
                >
                  <img
                    src={`${REPOSITORY_URL}/actions/workflows/ci.yml/badge.svg`}
                    alt="Current Flux UI CI workflow status"
                  />
                </a>
              </Stack>
            </header>

            <div className="docs-layout">
              <aside className="desktop-sidebar">
                <div className="sidebar-sticky">
                  <SectionNavigation />
                </div>
              </aside>

              <div className="docs-content">
                <Stack gap="xl">
                  <section className="content-section" id="health">
                    <Stack gap="md">
                      <div>
                        <h2>Repository health</h2>
                        <p>
                          This page reads committed size and performance
                          baselines generated from the repository. For the live
                          CI result, use the Actions badge above.
                        </p>
                      </div>

                      <Grid minColumnWidth="13rem" gap="md">
                        <div className="metric-card">
                          <span>Public component families</span>
                          <strong>{components.length}</strong>
                        </div>
                        <div className="metric-card">
                          <span>Runtime Brotli</span>
                          <strong>{formatBytes(runtimeBrotli)}</strong>
                        </div>
                        <div className="metric-card">
                          <span>Published package Brotli</span>
                          <strong>{formatBytes(publishedBrotli)}</strong>
                        </div>
                        <div className="metric-card">
                          <span>Size budget contract</span>
                          <strong>v{health.size.budgetsVersion}</strong>
                        </div>
                        <div className="metric-card">
                          <span>Runtime performance policy</span>
                          <strong>v{health.performance.policyVersion}</strong>
                        </div>
                        <div className="metric-card">
                          <span>Runtime styling engine</span>
                          <strong>0 B</strong>
                          <small>Static CSS and CSS variables</small>
                        </div>
                      </Grid>

                      <div>
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
                          <li>
                            Native-relative runtime performance regression
                            checks
                          </li>
                        </ul>
                      </div>
                    </Stack>
                  </section>

                  <section className="content-section" id="size">
                    <Stack gap="md">
                      <div>
                        <h2>Bundle-size health</h2>
                        <p>
                          Every public component has an absolute
                          complexity-class budget and a historical regression
                          baseline. The meters below show Brotli size against
                          each component&apos;s absolute budget.
                        </p>
                      </div>

                      <div className="table-scroll">
                        <table>
                          <caption>
                            Current committed component size baselines
                          </caption>
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
                              const usage = budgetUsage(
                                component.brotli,
                                component.budgetBrotli,
                              );

                              return (
                                <tr key={component.slug}>
                                  <th scope="row">{component.name}</th>
                                  <td>{component.sizeClass}</td>
                                  <td>{formatBytes(component.raw)}</td>
                                  <td>{formatBytes(component.gzip)}</td>
                                  <td>{formatBytes(component.brotli)}</td>
                                  <td>
                                    <meter
                                      min={0}
                                      max={1}
                                      value={usage ?? 0}
                                      aria-label={`${component.name} Brotli budget usage`}
                                    />{" "}
                                    {usage === null
                                      ? "Pending baseline"
                                      : `${(usage * 100).toFixed(1)}%`}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <p>
                        Aggregate runtime:{" "}
                        <strong>{formatBytes(runtimeBrotli)}</strong>. Published
                        package: <strong>{formatBytes(publishedBrotli)}</strong>
                        .
                      </p>
                    </Stack>
                  </section>

                  <section className="content-section" id="performance">
                    <Stack gap="lg">
                      <div>
                        <h2>Runtime benchmark health</h2>
                        <p>
                          Playwright runs Chromium benchmarks against equivalent
                          native React implementations. CI gates synchronous
                          mount, update, and unmount ratios; next-frame
                          measurements remain diagnostics.
                        </p>
                      </div>

                      {health.performance.scenarios.map((scenario) => {
                        const reference = scenario.medians[scenario.reference];
                        const flux = scenario.medians.flux;

                        return (
                          <article
                            key={scenario.name}
                            className="benchmark-card"
                          >
                            <Stack gap="md">
                              <div>
                                <h3>
                                  {scenario.name} × {scenario.count}
                                </h3>
                                <p>
                                  Reference:{" "}
                                  <strong>{scenario.reference}</strong>
                                </p>
                              </div>

                              <div className="table-scroll">
                                <table>
                                  <caption>
                                    {scenario.name} runtime medians
                                  </caption>
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
                                      <td>
                                        {formatRatio(scenario.ratios.mount)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th scope="row">Update</th>
                                      <td>{formatMs(reference.update)}</td>
                                      <td>{formatMs(flux.update)}</td>
                                      <td>
                                        {formatRatio(scenario.ratios.update)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th scope="row">Unmount</th>
                                      <td>{formatMs(reference.unmount)}</td>
                                      <td>{formatMs(flux.unmount)}</td>
                                      <td>
                                        {formatRatio(scenario.ratios.unmount)}
                                      </td>
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
                                  <dd>
                                    {formatRatio(scenario.ratios.mountToFrame)}
                                  </dd>
                                  <dt>Reference update → frame</dt>
                                  <dd>{formatMs(reference.updateToFrame)}</dd>
                                  <dt>Flux update → frame</dt>
                                  <dd>{formatMs(flux.updateToFrame)}</dd>
                                  <dt>Update → frame ratio</dt>
                                  <dd>
                                    {formatRatio(scenario.ratios.updateToFrame)}
                                  </dd>
                                </dl>
                              </details>
                            </Stack>
                          </article>
                        );
                      })}
                    </Stack>
                  </section>

                  <section className="content-section" id="components">
                    <Stack gap="lg">
                      <div>
                        <h2>Components</h2>
                        <p>
                          Flux documents Flux with Flux. The catalog is grouped
                          by purpose so the page can scale without becoming one
                          endless wall of cards.
                        </p>
                      </div>

                      <Tabs.Root defaultValue="foundations">
                        <Tabs.List aria-label="Component categories">
                          <Tabs.Tab value="foundations">Foundations</Tabs.Tab>
                          <Tabs.Tab value="forms">Forms</Tabs.Tab>
                          <Tabs.Tab value="interaction">Interaction</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="foundations">
                          <Grid minColumnWidth="20rem" gap="md">
                            <ShowcaseCard
                              title="Button"
                              description="Native button semantics with Flux variants, tones, sizes, and states."
                            >
                              <Stack gap="md">
                                <Inline gap="sm" wrap>
                                  <Button>Primary action</Button>
                                  <Button variant="soft">Soft action</Button>
                                  <Button variant="outline">
                                    Outline action
                                  </Button>
                                  <Button variant="ghost">Ghost action</Button>
                                </Inline>
                                <Inline gap="sm" wrap>
                                  <Button tone="neutral">Neutral</Button>
                                  <Button tone="danger">Danger</Button>
                                  <Button disabled>Disabled</Button>
                                  <Button loading>Loading</Button>
                                </Inline>
                              </Stack>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Stack"
                              description="Vertical composition with token-driven responsive gaps."
                            >
                              <Stack gap="sm" className="demo-boundary">
                                <div className="demo-block">First</div>
                                <div className="demo-block">Second</div>
                                <div className="demo-block">Third</div>
                              </Stack>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Inline"
                              description="Horizontal groups that align, distribute, and wrap content."
                            >
                              <Inline
                                gap="sm"
                                justify="between"
                                wrap
                                className="demo-boundary"
                              >
                                <strong>Actions</strong>
                                <Inline gap="sm" wrap>
                                  <Button size="sm" variant="outline">
                                    Export
                                  </Button>
                                  <Button size="sm">Create</Button>
                                </Inline>
                              </Inline>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Grid"
                              description="Native CSS Grid with responsive tracks and auto-fit sizing."
                            >
                              <Grid
                                minColumnWidth="7rem"
                                gap="sm"
                                className="demo-boundary"
                              >
                                <div className="demo-block">One</div>
                                <div className="demo-block">Two</div>
                                <div className="demo-block">Three</div>
                                <div className="demo-block">Four</div>
                              </Grid>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Container"
                              description="Centered content width with Flux spacing and named size constraints."
                            >
                              <div className="container-demo-stage">
                                <Container size="sm" className="demo-boundary">
                                  <div className="demo-block">
                                    Small container
                                  </div>
                                </Container>
                              </div>
                            </ShowcaseCard>
                          </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="forms">
                          <Grid minColumnWidth="20rem" gap="md">
                            <ShowcaseCard
                              title="Checkbox"
                              description="Native checked and mixed states, keyboard behavior, and form submission."
                            >
                              <CheckboxDemo />
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Input"
                              description="Native text-entry semantics with Flux styling and escape hatches."
                            >
                              <Stack gap="md">
                                <Input
                                  aria-label="Email address"
                                  type="email"
                                  placeholder="jo@example.com"
                                />
                                <Input
                                  aria-label="Read-only value"
                                  defaultValue="Read-only value"
                                  readOnly
                                />
                                <Input
                                  aria-label="Disabled input"
                                  defaultValue="Unavailable"
                                  disabled
                                />
                              </Stack>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Field"
                              description="Accessible labels, descriptions, errors, and shared form-control state."
                            >
                              <Stack gap="lg">
                                <Field.Root id="field-demo-email" required>
                                  <Field.Label>Work email</Field.Label>
                                  <Field.Control>
                                    <Input
                                      type="email"
                                      placeholder="jo@example.com"
                                    />
                                  </Field.Control>
                                  <Field.Description>
                                    Used for account and project notifications.
                                  </Field.Description>
                                </Field.Root>
                                <Field.Root id="field-demo-invalid" invalid>
                                  <Field.Label>Invalid email</Field.Label>
                                  <Field.Control>
                                    <Input
                                      defaultValue="not-an-email"
                                      type="email"
                                    />
                                  </Field.Control>
                                  <Field.Error>
                                    Enter a valid email address.
                                  </Field.Error>
                                </Field.Root>
                              </Stack>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Textarea"
                              description="Native multi-line text entry with Flux styling and Field composition."
                            >
                              <Field.Root id="textarea-demo-notes">
                                <Field.Label>Project notes</Field.Label>
                                <Field.Control>
                                  <Textarea
                                    placeholder="Add context for the team..."
                                    rows={4}
                                  />
                                </Field.Control>
                                <Field.Description>
                                  Native rows, values, events, and resizing stay
                                  available.
                                </Field.Description>
                              </Field.Root>
                            </ShowcaseCard>
                          </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="interaction">
                          <Grid minColumnWidth="20rem" gap="md">
                            <ShowcaseCard
                              title="Tabs"
                              description="Keyboard-accessible switching between related panels."
                            >
                              <Tabs.Root defaultValue="overview">
                                <Tabs.List
                                  aria-label="Example project sections"
                                  activateOnFocus
                                >
                                  <Tabs.Tab value="overview">Overview</Tabs.Tab>
                                  <Tabs.Tab value="activity">Activity</Tabs.Tab>
                                  <Tabs.Tab value="settings">Settings</Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel value="overview">
                                  Overview panel
                                </Tabs.Panel>
                                <Tabs.Panel value="activity">
                                  Activity panel
                                </Tabs.Panel>
                                <Tabs.Panel value="settings">
                                  Settings panel
                                </Tabs.Panel>
                              </Tabs.Root>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Dialog"
                              description="Native top-layer modal behavior with automatic title and description wiring."
                            >
                              <Dialog.Root>
                                <Dialog.Trigger>Open dialog</Dialog.Trigger>
                                <Dialog.Popup>
                                  <Dialog.Title>Project settings</Dialog.Title>
                                  <Dialog.Description>
                                    Native dialog semantics handle the modal top
                                    layer and focus boundary.
                                  </Dialog.Description>
                                  <Dialog.Close>Close dialog</Dialog.Close>
                                </Dialog.Popup>
                              </Dialog.Root>
                            </ShowcaseCard>

                            <ShowcaseCard
                              title="Drawer"
                              description="Edge-aligned modal panel for navigation and secondary workflows."
                            >
                              <Drawer.Root>
                                <Drawer.Trigger>Open drawer</Drawer.Trigger>
                                <Drawer.Popup side="right">
                                  <Drawer.Title>
                                    Project navigation
                                  </Drawer.Title>
                                  <Drawer.Description>
                                    Drawers reuse the same native modal behavior
                                    while changing spatial presentation.
                                  </Drawer.Description>
                                  <Drawer.Close>Close drawer</Drawer.Close>
                                </Drawer.Popup>
                              </Drawer.Root>
                            </ShowcaseCard>
                          </Grid>
                        </Tabs.Panel>
                      </Tabs.Root>

                      <div className="table-scroll">
                        <table>
                          <caption>
                            Current public Flux UI component families
                          </caption>
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
                      </div>
                    </Stack>
                  </section>

                  <section className="content-section" id="rules">
                    <Stack gap="md">
                      <h2>Main engineering rules</h2>
                      <ol>
                        <li>
                          <strong>Easy to use first.</strong> Public APIs absorb
                          complexity instead of forcing casts, workarounds, or
                          framework trivia on consumers.
                        </li>
                        <li>
                          <strong>Native semantics first.</strong> Extend the
                          platform instead of replacing it.
                        </li>
                        <li>
                          <strong>Static styling.</strong> No runtime CSS-in-JS
                          styling engine.
                        </li>
                        <li>
                          <strong>Quarter-rem spatial rhythm.</strong> Reusable
                          spacing, radii, controls, and breakpoints use explicit
                          rem values on a 0.25rem grid.
                        </li>
                        <li>
                          <strong>Standard spacing is 1rem.</strong> Default
                          radius is 0.25rem.
                        </li>
                        <li>
                          <strong>Performance is a contract.</strong> Size and
                          runtime regressions fail CI.
                        </li>
                        <li>
                          <strong>Accessibility is not optional.</strong>{" "}
                          Components and the docs app are tested with semantic,
                          keyboard, and automated accessibility checks.
                        </li>
                        <li>
                          <strong>
                            Generated infrastructure stays deterministic.
                          </strong>{" "}
                          New components are scaffolded and registered by
                          convention.
                        </li>
                      </ol>
                    </Stack>
                  </section>

                  <section className="content-section" id="install">
                    <Stack gap="md">
                      <div>
                        <h2>Install & onboarding</h2>
                        <p>
                          Flux UI is still alpha and not yet presented as a
                          stable public package. To work on the repository:
                        </p>
                      </div>

                      <pre>
                        <code>{`git clone https://github.com/Xanhast-pf/flux-ui.git
cd flux-ui
nvm use
corepack enable
pnpm install
pnpm check`}</code>
                      </pre>

                      <div>
                        <h3>Daily development</h3>
                        <pre>
                          <code>{`pnpm dev
pnpm storybook

# Before pushing
pnpm check

# Browser, a11y, Storybook and perf
pnpm check:full`}</code>
                        </pre>
                      </div>

                      <div>
                        <h3>Add a component</h3>
                        <pre>
                          <code>{`pnpm component:new SegmentedControl Inputs interactive
pnpm component:doctor SegmentedControl
pnpm size:update`}</code>
                        </pre>
                      </div>
                    </Stack>
                  </section>

                  <section className="content-section" id="tokens">
                    <Stack gap="md">
                      <div>
                        <h2>Design tokens</h2>
                        <p>
                          Active theme: <strong>{theme}</strong>. Toggle the
                          theme at the top of the page to inspect both semantic
                          palettes.
                        </p>
                      </div>

                      <div>
                        <h3>Spatial rhythm</h3>
                        <div className="table-scroll">
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
                        </div>
                      </div>

                      <div>
                        <h3>Semantic color palette</h3>
                        <ul className="palette">
                          {colorTokens.map(([label, variable]) => (
                            <li key={variable}>
                              <span
                                className="swatch"
                                style={{ backgroundColor: `var(${variable})` }}
                                aria-hidden="true"
                              />{" "}
                              <strong>{label}</strong> — <code>{variable}</code>{" "}
                              — <code>{currentColorValue(variable)}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Stack>
                  </section>

                  <section className="content-section" id="documentation">
                    <Stack gap="md">
                      <h2>Documentation</h2>
                      <ul>
                        <li>
                          <a href={`${REPOSITORY_URL}/blob/main/README.md`}>
                            Project README
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/docs/development.md`}
                          >
                            Development workflow
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/docs/architecture.md`}
                          >
                            Architecture
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/docs/component-api.md`}
                          >
                            Component API rules
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/docs/design-tokens.md`}
                          >
                            Design tokens
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/docs/performance.md`}
                          >
                            Performance philosophy
                          </a>
                        </li>
                        <li>
                          <a
                            href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
                          >
                            Contributing
                          </a>
                        </li>
                        <li>
                          <a href={`${REPOSITORY_URL}/blob/main/AGENTS.md`}>
                            Engineering contract
                          </a>
                        </li>
                      </ul>
                    </Stack>
                  </section>

                  <footer className="page-footer">
                    <p>
                      Flux UI is under construction. This page intentionally
                      prioritizes truthful project data and documentation
                      structure over visual polish.
                    </p>
                  </footer>
                </Stack>
              </div>
            </div>
          </Stack>
        </Container>
      </main>

      <Drawer.Popup className="mobile-nav-drawer" side="left">
        <Drawer.Title>Flux UI documentation</Drawer.Title>
        <Drawer.Description>
          Browse the project health and component documentation.
        </Drawer.Description>
        <SectionNavigation onNavigate={() => setMobileNavOpen(false)} />
        <Drawer.Close className="mobile-nav-close">
          Close navigation
        </Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
