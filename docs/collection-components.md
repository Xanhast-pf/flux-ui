# Collection and interaction primitives

This expansion adds thirteen public families to the docs-workshop baseline. It
adds no runtime dependency, modifies no existing public component implementation,
and changes neither size policy nor performance thresholds.

## Composition

| Family         | Public parts / main API                            | Used by the docs                     |
| -------------- | -------------------------------------------------- | ------------------------------------ |
| IconButton     | Button API; required aria-label or aria-labelledby | Example reset actions                |
| Toggle         | pressed / defaultPressed / onPressedChange         | Compact preview and saved items      |
| ToggleGroup    | Root, Item; single or multiple value mode          | Collection layout and formatting     |
| Toolbar        | Root, Button, Link, Separator                      | Collection filters and formatting    |
| Accordion      | Root, Item, Trigger, Content                       | FAQs and collection explanations     |
| Breadcrumbs    | Root, List, Item, Link, Current                    | Individual component routes          |
| Pagination     | Root, Previous, Page, Next, Ellipsis               | Visible collection slice             |
| Avatar         | alt, src, fallback, size                           | Sample team identities               |
| AspectRatio    | ratio + native div styling                         | Collection art and media examples    |
| Skeleton       | shape + native span styling                        | Deferred example and loading layouts |
| Spinner        | label, size; null label is decorative              | One status per loading operation     |
| Kbd            | Native kbd content                                 | Search and interaction hints         |
| VisuallyHidden | Text-only native span                              | Accessible loading descriptions      |

## Independent action entry points

IconButton retains the Button visual prop contract while rendering a native
button directly through build-time-only shared styles. Toolbar.Button is
intentionally narrower: it exposes native button props plus `loading`, while the
toolbar owns one compact ghost-style action treatment. A toolbar action does not
carry Button's full size, tone, variant, or icon-slot matrix. Consumers can put
icons directly in `children` when needed.

This keeps Toolbar focused on its actual job: grouping related actions with one
keyboard focus collection. Loading disables native interaction and sets
`aria-busy`; the action remains visibly present without adding spinner DOM or
animation. Toolbar's decorative separator renders a native `hr` with local
styling, without importing Separator's runtime. Button itself and all
size/performance policies remain unchanged. Source-boundary tests supplement the
production graph measurements; they do not certify an entry's compressed size.

## Keyboard contracts

Toggle labels remain stable; pressed state is communicated with aria-pressed.
ToggleGroup is a group of toggle buttons, not a form radio group or a tab list.
In single mode pressing the selected item clears the selection to null; multiple
mode emits a new readonly array. Consumers may decline a controlled update.

Toolbar and ToggleGroup share a small internal focus collection. After hydration,
one enabled item is in the tab sequence; arrows move focus, not selection.
Horizontal direction follows computed CSS direction, so RTL reverses left/right.
Home/End jump to the ends; loopFocus=false clamps movement. Native Enter/Space
behavior remains with the button, and links retain native link activation.
Consumer key handlers run first and may preventDefault. Aria-disabled actions are
excluded from the collection; buttons are natively disabled and links cancel activation.

Each provider owns only its registered nodes. Registration uses callback-ref
cleanup, including consumer React 19 cleanup functions. Disabled/hidden changes
and DOM reordering reconcile the tab stop after React commits. The collection
does not install document listeners or observers. Arbitrary visibility changes
made outside React are not an observer-backed feature; native hidden/inert
containers still suppress browser focus while hidden.

Before hydration, server-rendered native controls remain keyboard-reachable.
Commit-time registration reduces the collection to one stop; it does not require
walking or cloning an arbitrary React children tree on the server.

Do not nest interactive controls inside buttons, put another roving widget inside
an item, or insert a textbox into this v1 toolbar. Use at least three related
controls for toolbar semantics. A simple header row still belongs in Inline.

## Native and intentionally bounded behavior

Accordion uses details/summary rather than claiming to implement an ARIA
accordion's optional arrow keys. Single mode assigns the same name to its items;
multiple mode omits it. Keep summary first and directly inside details. Native
open/onToggle semantics remain native, not a custom controlled state engine.
On older browsers lacking named-details exclusivity, disclosures remain usable
independently. Initially open at most one item in a single group.

Pagination controls local results with native buttons and a controlled one-based
page. Root validates the range, disables Previous/Next boundaries, and avoids
re-emitting the current page. The caller chooses which page buttons to render.
No routing, fetching, page-count inference, or hidden item rendering is included.
Use real links for navigation to separate documents, and override children and
aria-label values for localized page controls.

Avatar exposes one accessible identity on its root. Its image/fallback are
decorative children. An empty alt makes the whole avatar decorative next to
existing identity text. Failed images reveal the fallback; a keyed image resets
failure for a changed src. Successfully loaded images remove the fallback so
transparent artwork does not show initials underneath; cached hydration is checked
through the image ref. The ref targets the root span. Fallback content must
not contain focusable elements. No network avatar service is built in.

AspectRatio delegates preferred sizing to CSS; it does not measure children or
promise to override their intrinsic minimum size. Constrain media in the frame
with native styling when exact cropping is desired.

Skeleton is static and aria-hidden. Spinner adds one status with screen-reader
text; label=null removes that status for decorative uses. Reduced motion stops
the ring animation without hiding the indicator. VisuallyHidden is for text,
not hidden interactive controls. Kbd only displays a shortcut hint; application
code owns keyboard listeners.

## Size and validation

Toolbar and ToggleGroup start in the existing interactive class (3 KiB Brotli)
because they include focus coordination. The other eleven start in the primitive
class (1.5 KiB Brotli). Measurements remain pending until a real production build;
no new cost is presented as zero and no existing baseline is accepted silently.

Every family includes unit tests, static styles, Storybook states, a native/Flux
SSR fixture, metadata and a discovered docs example. Browser coverage exercises
collection filtering, removal focus, paging, loading, toolbar RTL/orientation,
multiple toggle selection, native disclosure exclusivity, avatar error recovery,
reduced motion, forced colors, responsive layouts and light/dark accessibility.
Inclusion of these tests is not a passing result: run the pinned pipeline.

```bash
pnpm generate
pnpm size:update
pnpm check:fix
pnpm check:full
pnpm perf
```

Review baseline changes. Do not run perf:update merely to accept a failure.

## Primary references

- WAI-ARIA button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- WAI-ARIA toolbar pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- WAI-ARIA breadcrumb pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- Native details behavior and compatibility: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- React DOM callback refs and cleanup: https://react.dev/reference/react-dom/components/common#ref-callback

These references explain the underlying contracts; they are not a certification
or a substitute for testing this implementation in the supported browsers.
