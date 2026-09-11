# Flux UI — webpage audit and product-world redesign

## Scope and evidence

Baseline: the supplied `flux-ui-0.1.15.zip` archive (source commit
`b95e320b9c8b878c904e2156a53d21ba42339b96`). This is a source and design audit,
not a claim that the deployed GitHub Pages site was tested. The redesign is
implemented in the supplied source tree.

The design reference was Radix's homepage and Themes playground: useful,
recognizable interfaces appear early, and visitors can explore appearance rather
than only read feature claims. Flux borrows that presentation principle, not
Radix's artwork, source, product names, or visual identity.

References:

- Radix homepage: <https://www.radix-ui.com/>
- Radix Themes playground: <https://www.radix-ui.com/themes/playground>
- React lazy-loading guidance: <https://react.dev/reference/react/lazy>
- WAI manual/automatic tab activation guidance:
  <https://www.w3.org/WAI/ARIA/apg/patterns/tabs/>

## Findings

| Priority | Finding in the supplied version                                                    | Effect                                                                                                     | Resolution                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | The overview uses the full documentation rail.                                     | First-time visitors must process a reference site's navigation before seeing the product's creative range. | A wider, quieter landing shell for Overview and Playground; the rail remains on reference pages.                                             |
| High     | The homepage and playground repeat the Release Room composition.                   | One engineering-oriented dashboard stands in for the entire design system.                                 | Six independently composed product worlds, each with a different task, hierarchy, and editorial identity.                                    |
| High     | Playground exploration is mostly component/property oriented.                      | Developers can inspect mechanics, but designers have few product-level possibilities to imagine.           | Real, local interactions in finance, marketing, social, music, video, and commerce. The original labs remain available below.                |
| Medium   | Cards, borders, and explanatory copy have similar visual weight.                   | The page feels like a collection of documentation panels rather than a deliberate opening story.           | Editorial typography, whitespace, a prominent live scene, quieter system principles, and a shorter evidence section.                         |
| Medium   | A globally saved appearance is not an ideal scratchpad for testing a product mood. | Exploring styles can change the visitor's preferred reading environment.                                   | Four palettes scoped to the active scene; changing mood does not change docs appearance or reset scene state.                                |
| Medium   | The system's future breadth could be mistaken for already-shipped APIs.            | A polished chart or editor can imply product capabilities that do not exist yet.                           | A per-scene composition inspector, typed public-component ingredients, source inspection, and explicit prototype limitations.                |
| Medium   | More elaborate demos can create startup and accessibility regressions.             | An attractive gallery could become expensive or difficult to operate.                                      | Lazy previews, one mounted scene, manual-activation tabs, bounded state, no autoplay, reduced-motion support, and added regression coverage. |

These are design judgments supported by source inspection, not findings from a
user study, conversion experiment, or independent accessibility certification.

## Page-by-page decisions

**Overview:** Leads with “One system. Different worlds.” Visitors choose a product
and mood before reaching engineering detail. The rest of the page connects the
examples to tokens, public components, engineering, evidence, and candid FAQs.
The component count and Button baseline continue to use generated repository data.

**Playground:** Reuses the same product gallery rather than maintaining a second,
slowly diverging implementation. The original Release Room, Button, Theme, and
Collection labs move into an explicitly opened, lazy-loaded Component workbench.
Closing that workbench unmounts it; its transient state is intentionally reset.

**Catalog and component pages:** Keep the familiar documentation rail, examples,
API descriptions, code, and existing links. They are reference tools, not landing
pages, and did not need their information density removed.

**Engineering, Trust, Stress Lab, accessibility, size, and performance pages:**
Remain intact. Their evidence, prototype disclosures, opt-in behavior, and
measurement scopes are more useful than decorative marketing metrics. New
homepage links introduce these pages after the product experience.

**Global navigation:** Adds clear high-level entry points without removing search,
theme controls, mobile navigation, GitHub, or existing hash routes. Query-only
scene/mood changes do not trigger the route-level focus and scroll reset.

## The six product worlds

| World       | Fictional product | Working local interactions                                                                                               | Deliberate limits                                                                                        |
| ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Finance     | folio             | Week/month cash-flow fixtures, freeze/unfreeze a card, record a one-time sample payout and update balance.               | No banking connection, money movement, or financial forecasting. The chart is a custom SVG composition.  |
| Marketing   | signal            | Rewrite the live campaign poster, change audience, validate an empty headline, launch/reset local campaign state.        | No campaign service, message delivery, analytics feed, or forecast.                                      |
| Social      | gather            | Like/unlike posts, follow/unfollow the fictional creator, write bounded text-only local posts.                           | No accounts or network publishing. At most four posts; user text is rendered as text, not injected HTML. |
| Music / DAW | afterhours        | Start/pause a visual playhead, change tempo, mute/solo tracks, change a visual master meter.                             | Silent visual prototype; no audio engine, microphone, media permissions, or audio processing.            |
| Video       | cutroom           | Select illustrated clips, change aspect ratio, toggle titles, scrub a represented position, export real JSON edit notes. | Illustrated storyboard, not decoded video; export does not render video.                                 |
| Commerce    | objects           | Switch speaker finishes, choose quantity, add per-finish bag items, calculate totals, clear a bounded bag.               | Fictional product and pricing; no stock, payment, checkout, or order service.                            |

The four moods are Paper, Studio, Bloom, and Terminal. They adjust semantic
surfaces, ink, controls, accents, artwork colors, and—in Terminal—the scene's
font stack. The surrounding docs theme remains independent. System fonts and
original CSS/SVG artwork avoid adding asset or font downloads.

## Interaction and architecture contract

Scene and mood are shareable in the hash query, for example
`#playground?scene=music&mood=studio`. Unknown values fall back to the first scene
and Paper. Browser history restores scene and mood, not abandoned demo state.
Switching worlds, resetting a scene, or reloading discards its transient edits.
Changing only the mood preserves edits. Copy failures retain a normal permalink.

Each world is a `name.scene.ts` metadata file paired with a
`name.preview.tsx` component. Vite discovers pairs, eagerly loads only metadata,
and lazily loads previews. There is no manually maintained import registry.
Public ingredient slugs are typed against the generated component catalog.
`pnpm docs:check` checks pairs; browser fixtures discover the same filenames.
Adding a new scene extends the shared viewport and mood/a11y test loops.

Only the selected preview is mounted. The composition inspector, raw source, and
legacy workbench load on request. Scene state has explicit bounds. No polling,
telemetry, automatic slideshow, or unsolicited media playback was added.

No public component package, dependency declaration, package size baseline,
benchmark threshold, security workflow, or release policy was changed. Existing
homepage-only CSS that no longer has callers was removed rather than kept as a
second competing design system.

## Validation record

Completed in the implementation environment:

- 78 dependency-free Node tests passed, with zero failures and zero skips. This
  includes 38 docs/showcase checks: pairing, URL round trips, invalid input,
  deterministic fixture calculations, and four palette contrast guards.
- Documentation coverage checks passed for all 36 public families and six paired
  product scenes.
- Source syntax/transpilation and an isolated strict check of the pure showcase
  model passed; these are not a substitute for the project's complete typecheck.
- A source-derived static layout probe exercised six scenes × four moods × five
  viewport widths (320, 390, 768, 1024, and 1440): 120 combinations. No root
  overflow or visible controls extending outside the viewport/scene was found.
  Decorative artwork intentionally clipped inside its own canvas is not counted
  as a misplaced control.
- Desktop and narrow-layout screenshots were visually reviewed. These probes
  rendered source-derived markup and styles with an internal static renderer;
  they did **not** execute React 19, Vite, application interactions, or axe.

Added for the actual project toolchain: 23 browser behavior/layout tests and 25
axe/forced-color tests. Existing tests now open the preserved workbench explicitly
and wait for real lazy content before auditing it. No existing assertion was
removed to excuse a regression.

Not completed here: pinned Prettier, repository ESLint, project-wide TypeScript,
Knip, Coding Bible, production build, React browser interactions, axe scans,
Lighthouse, production bundle measurements, or GitHub CI. The environment has
Node 22, no pnpm/project dependencies, and blocked package downloads. Component
registry generation was attempted but could not load the missing Prettier
package. Icon generation verification ran without reporting drift.

The apply helper formats changed files using the repository's installed
Prettier. Run the full project gate before merging; do not update performance or
size baselines simply to make this presentation change pass.

## Acceptance checklist for the real browser build

Use the project's Node 24+ and pinned pnpm. After application/formatting:

```bash
pnpm docs:check
pnpm docs:test
pnpm --filter @flux-ui/docs exec playwright test tests/showcase.spec.ts tests/showcase-a11y.spec.ts
pnpm check:full
```

Review all worlds in light and dark docs appearance, including 320px and 200%
zoom. Verify manual keyboard tab activation, mood focus retention, native ranges,
permalinks/history, blocked clipboard handling, local action feedback, JSON
export, reduced motion, forced colors, and open/closed workbench states. Inspect
network requests and built chunks to confirm lazy loading in the real build.
Run the existing Labs and evidence tests; source-side preservation is not the
same as a passing deployed workflow.

## Upgrade path as the public library grows

Keep product tasks stable while replacing the custom internals with supported
public components: chart primitives for Finance, richer editor tools for
Marketing, collection primitives for Social, timeline/meter primitives for Music
and Video, and product/media compositions for Commerce. Update the ingredient
list, prototype disclosure, and source together. A component appearing in a demo
is not a reason to publish an under-specified public API prematurely.
