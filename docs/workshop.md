# The Flux workshop

The public docs are a consumer of Flux's public APIs. Their default examples must
work without hidden docs-only styles. The site also hosts isolated illustrations
and native performance references; those have explicit, narrow ownership rules.

## Navigation and page responsibilities

`Sidebar.Root` lives in the stable shell, outside route content and Suspense.
The app-bar toggle opens a named, non-modal navigation panel. It occupies a column
beside the page at layout widths of 48rem and above, and stacks above the page below that
breakpoint. Links, browser Back/Forward, and Escape do not close it. Explicit close
returns focus to an outside toggle when focus would otherwise be hidden. The
panel remains mounted, retaining its scroll position and local state. A reload
starts closed; route persistence does not require localStorage.

Search is a separate modal `Dialog`. Its button and Ctrl/Cmd+K shortcut open it;
Escape closes it and restores focus. `Drawer` remains available for temporary
modal tasks, not persistent documentation navigation.

| Route                | Responsibility                                              |
| -------------------- | ----------------------------------------------------------- |
| `#overview`          | Product introduction and the six-world showcase             |
| `#playground`        | Showcase exploration and composed component workbenches     |
| `#components`        | Searchable catalog; does not mount every example            |
| `#components/{slug}` | Lazy live preview, its actual source, API and usage notes   |
| `#icons`             | Searchable public icon catalog                              |
| `#identity`          | Logo downloads and Flux Display vector design source        |
| `#tokens`            | Semantic tokens and resolved theme values                   |
| `#install`           | Source checkout and development commands                    |
| `#documentation`     | Task-oriented guides and FAQ                                |
| `#engineering`       | Architecture and review principles                          |
| `#rules`             | Preserved legacy entry to Engineering                       |
| `#health`            | Committed catalog and measurement snapshot                  |
| `#size`              | Committed production bundle measurements                    |
| `#performance`       | Committed runtime benchmark measurements                    |
| `#lab`               | Current local stress experiments, not historical benchmarks |
| `#trust`             | Commit-bound CI/security evidence and explicit limitations  |
| `#accessibility`     | Local accessibility demonstration                           |

Each route sets a descriptive browser title. Navigation moves focus to the main
landmark without remounting the sidebar. Unknown routes show a recovery link.
Hash navigation works on GitHub Pages without server rewrites. Hosted skip-link
examples prevent default fragment navigation and focus their target explicitly,
so using the example does not replace the application route.

## One source for the live example and displayed code

A component's `{slug}.example.tsx` imports its preview and that same TSX file via
Vite's `?raw`. Discovery is convention-based; no separate source-code string or
central example registry should be maintained. The catalog uses lightweight
metadata and loads individual examples only when requested.

Ordinary controls use the centered preview layout. Layout examples opt into
`previewLayout: "fill"` to fill the bounded canvas. Compact mode narrows that
canvas without remounting the example. Reset remounts only the example; theme and
accent preferences are independent and persist locally.

Default examples use `Stack`, `Inline`, `Grid`, `Card`, `Heading`, `Text`, and the
other public families. There is no blanket teaching-fixture exception or hidden
`.demo-boundary` stylesheet. Heading/code/list rhythm belongs to a parent `Stack`,
not global margins on headings or ad-hoc page CSS.

## Source mode and built-package proof

Source aliases keep `pnpm dev` fast. They are not sufficient proof that the
emitted public package works. `pnpm consumer:check` rebuilds packages, checks
consumer types, and exercises a separate production fixture with no docs CSS or
private source aliases. Its module-graph guard rejects private package source and
docs implementation imports. Public theme/reset CSS is deliberately allowed.

The required CI Browser job runs the docs suite, this built consumer, and runtime
benchmarks. Trust evidence includes the consumer receipt and its actual test
report. Presence of a workflow file is not proof of a successful run.

## Ownership and validation

`pnpm dogfood:check` checks ordinary JSX, imported UI, runtime element factories,
inline styling, and every application stylesheet. Exact selector/property
contracts constrain illustration/data geometry and page positioning; declaration
budgets remain an additional ceiling. Tests cover known bypasses, not a claim
that static analysis can prove arbitrary JavaScript safe.

Run the pinned workflow in [development.md](development.md). Preserve native
hidden and until-found behavior, isolate nested compound components, and run the
browser checks before accepting size-baseline growth. New components stay
**Pending baseline** until a real build is measured. Local demo actions never
pretend to deploy, send messages, charge a card, or certify a release.
