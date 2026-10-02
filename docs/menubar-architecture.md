# Menubar architecture evidence

Menubar remains a conditional desktop-application roadmap item. This batch
implemented and tested two alpha prototypes, then deliberately removed the
public component because neither implementation fit Flux's absolute
`interactive` bundle ceiling.

## Product use case

Desktop-style web applications may need a persistent horizontal menu strip
whose top-level menus behave as one keyboard system instead of several
unrelated dropdowns.

That use case is still valid, but there is no current product requirement
strong enough to justify weakening Flux's size contract.

## Interaction model proven by the prototype

The tested prototype covered:

- `role="menubar"` with a required accessible name;
- one roving top-level trigger in the Tab order;
- ArrowLeft / ArrowRight across top-level menus;
- Home / End across top-level menus;
- ArrowDown / ArrowUp opening at first / last available item;
- ArrowUp / ArrowDown, Home / End and typeahead inside menus;
- horizontal switching while a menu is open;
- nested submenus opened with ArrowRight;
- ArrowLeft restoring focus from a submenu to its trigger;
- Escape restoring the corresponding top-level trigger;
- disabled-item skipping;
- selection closing the complete menu chain;
- normal Tab escape rather than a focus trap;
- Chromium, Firefox and WebKit behavior with axe-clean semantics.

## Prototype size evidence

### Prototype 1 — compose Popover + DropdownMenu

Bundled entry:

- raw: 18,945 B
- gzip: 6,380 B
- Brotli: 5,651 B

### Prototype 2 — reduced generic composition

Bundled entry:

- raw: 17,944 B
- gzip: 5,908 B
- Brotli: 5,229 B

### Prototype 3 — bespoke local popup architecture

Bundled entry:

- raw: 11,711 B
- gzip: 3,952 B
- Brotli: 3,478 B

The bespoke version passed raw and gzip ceilings but still exceeded Flux's
3,072 B Brotli ceiling for an interactive component by 406 B.

No baseline or budget was changed.

## Decision

Do not publish Menubar in this batch.

The architecture evidence is retained so a future product-backed iteration
does not need to rediscover the keyboard/focus model. A future implementation
should begin from the bespoke local-popup direction and find a materially
smaller state/focus architecture before public API work resumes.

Do not reclassify Menubar as data-heavy merely to gain a larger budget.

## Deferred public composition

The proven shape remains a useful design target:

```tsx
<Menubar.Root aria-label="Application">
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Popup>
      <Menubar.Item>New</Menubar.Item>
      <Menubar.Submenu>
        <Menubar.SubmenuTrigger>Recent</Menubar.SubmenuTrigger>
        <Menubar.SubmenuPopup>
          <Menubar.Item>Project A</Menubar.Item>
        </Menubar.SubmenuPopup>
      </Menubar.Submenu>
    </Menubar.Popup>
  </Menubar.Menu>
</Menubar.Root>
```

This is architecture evidence, not a committed public API.
