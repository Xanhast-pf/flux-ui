# Release certification

This is a review checklist, not a certification claim or permission to publish. Complete it for the exact immutable candidate and record the commit, archive digests, toolchain, test reports, reviewer, and date. An unchecked item is unknown, not passed. Repository health and release readiness are separate decisions.

## Developer evidence

- [ ] The candidate is based on reviewed main with no unrelated changes.
- [ ] Drift, generated files, docs, formatting, lint, types, tests, builds, size, Storybook, browser and performance checks pass for the candidate.
- [ ] No size/performance baseline was silently accepted; any proposed change has explicit review.
- [ ] Dependency advisories and CodeQL results are reviewed, not merely configured.
- [ ] Approved package versions and Changesets describe the release; private root version is not substituted for package versions.
- [ ] Exact packed tarballs and transitive Flux resolution are verified by the existing packed-consumer harness.
- [ ] Previous released consumer code compiles against candidate declarations. Review removed exports, compound members, newly required props, narrowed unions, and ref-element changes; document intended incompatibilities. Current-source tests alone do not prove compatibility.

The broad docs Playwright suite and normal built-consumer suite remain Chromium-based. The required focused compatibility gate exercises the built consumer in Chromium, Firefox and WebKit, and the release packed-consumer harness repeats three-engine verification against the exact candidate tarballs. Do not describe the focused compatibility gate as equivalent to full docs-suite parity across all engines.

## Focused design and user review

Use representative surfaces rather than screenshot baselines for every component.

| Dimension  | Required cases                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Theme      | Light and dark, including validation/disabled/selected states                                      |
| Viewport   | 320px mobile and desktop; zoom/text enlargement where applicable                                   |
| Contrast   | Forced-colors/high-contrast for controls, selected states, focus and separators                    |
| Layout     | Long labels, dense data, overflow, clipping, empty/error states                                    |
| Motion     | Reduced motion with understandable state changes                                                   |
| Navigation | Search, keyboard entry/exit, mobile Drawer, persistent desktop Sidebar, Back/reload/deep links     |
| Workflows  | Interact with product scenes, complete forms, copy examples, download recipes, recover from errors |

Record screenshots and observations for Overview, Playground and representative Combobox, Dialog/AlertDialog, DropdownMenu, DataTable, Tabs, Sidebar, SplitPane, Toolbar and Select compositions. Do not sign off solely from a screenshot or a passing axe scan.

## Keyboard and assistive-technology review

| Primitive            | Interaction contract to certify                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Combobox             | Label, expanded state, typing/filtering, active option, selection, Escape and focus restoration                |
| Dialog / AlertDialog | Accessible name/description, initial focus, modal boundary, Escape policy, return focus, nested instances      |
| DropdownMenu         | Trigger state, arrows/Home/End/typeahead, disabled items, selection/cancellation and return focus              |
| Tabs                 | Tab/tabpanel relationships, one roving tab stop, orientation, activation policy, disabled items and overflow   |
| Sidebar              | Persistent desktop preference; non-modal content remains reachable; mobile navigation uses the Drawer contract |
| DataTable            | Table headers/caption, sort state, selection announcements, keyboard reachability and virtualized-row behavior |
| SplitPane            | Named focusable separator, orientation/value, arrow/Home/End/RTL behavior and pointer cancellation             |
| Toolbar              | One managed entry point, arrow navigation, disabled items and normal exit with Tab                             |
| Select               | Native keyboard/platform selection, label, required/invalid/disabled behavior and form submission/reset        |

Record an actual screen-reader/browser/OS combination and observed results. Include at least the supported desktop assistive-technology targets chosen by the maintainer; add mobile screen readers when those are part of the support promise. Automated browser keyboard checks do not exercise speech output, reading order in virtual buffers, or every assistive-technology interaction.

The W3C [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) provides interaction guidance. Its [assistive-technology support guidance](https://www.w3.org/WAI/ARIA/apg/about/at-support-tables/) explicitly calls for testing the actual application with assistive technologies; example support tables are not product certification.

## Candidate review record

```text
Candidate commit:
Public package versions and tarball digests:
Automated reports (with exact ref and environment):
Visual review (reviewer/date/themes/viewports/observations):
Keyboard review (components and observations):
Assistive-technology review (reviewer/date/OS/browser/AT/results):
Previous-release API comparison (reference release and result):
Known limitations or unresolved findings:
Decision and authorized maintainer:
```

Keep the record with release evidence. Do not mark manual or external service checks as passed when only local source inspection was performed. Nothing in this checklist changes release workflow permissions, publishes an archive, or approves a version bump.
