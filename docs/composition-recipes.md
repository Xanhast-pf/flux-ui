# Flux UI composition recipes

These recipes cover recurring product patterns that do not currently justify a
new public component family. They intentionally compose existing Flux primitives
with native semantics so applications can ship the pattern without waiting for a
new runtime abstraction.

A recipe should become a component only when multiple products converge on the
same reusable behavior and the component can own that behavior more safely than
the application.

## Application header / AppBar

Use a semantic `header`, Flux layout primitives, and `Toolbar` when the
actions form a keyboard-navigable command group.

```tsx
import { Box, Heading, Inline, Toolbar } from "@varua/flux-ui";

export function ApplicationHeader() {
  return (
    <Box as="header" surface="default" border="bottom" padding={3}>
      <Inline align="center" justify="between" gap="md" wrap>
        <Heading level={1} size="sm">
          Acme Console
        </Heading>

        <Toolbar.Root aria-label="Application actions">
          <Toolbar.Link href="/search">Search</Toolbar.Link>
          <Toolbar.Link href="/settings">Settings</Toolbar.Link>
          <Toolbar.Button
            onClick={() => {
              /* sign out */
            }}
          >
            Sign out
          </Toolbar.Button>
        </Toolbar.Root>
      </Inline>
    </Box>
  );
}
```

Keep sticky positioning, scroll reactions, elevation changes, and route-specific
content in the application shell. A public AppBar becomes worthwhile only if
several products require the same stateful sticky/scroll contract.

## Image list / media gallery

Use `Grid` for layout, `AspectRatio` for stable geometry, and native
`figure`, `img`, and `figcaption` semantics.

```tsx
import { AspectRatio, Box, Grid, Stack, Text } from "@varua/flux-ui";

const images = [
  { id: "one", src: "/one.jpg", alt: "Mountain lake", caption: "North shore" },
  { id: "two", src: "/two.jpg", alt: "Pine trail", caption: "Forest path" },
];

export function ImageGallery() {
  return (
    <Grid minColumnWidth="12rem" gap="md">
      {images.map((image) => (
        <Box as="figure" key={image.id} style={{ margin: 0 }}>
          <Stack gap="sm">
            <AspectRatio ratio={4 / 3}>
              <img src={image.src} alt={image.alt} />
            </AspectRatio>
            <Text as="figcaption" variant="caption" tone="muted">
              {image.caption}
            </Text>
          </Stack>
        </Box>
      ))}
    </Grid>
  );
}
```

Applications own loading, responsive image sources, zoom/lightbox behavior, and
domain-specific selection. Promote ImageList only if repeated products need the
same span/caption/selection contract rather than merely the same grid.

## Transfer list

Treat transfer as application-owned selection plus explicit move actions. Keep
both collections named and make every move reversible.

```tsx
import {
  Button,
  Checkbox,
  Field,
  Fieldset,
  Inline,
  Stack,
  Text,
} from "@varua/flux-ui";

export function TransferList({
  available,
  chosen,
  selectedAvailable,
  selectedChosen,
  onAvailableChange,
  onChosenChange,
  onAdd,
  onRemove,
}: {
  available: readonly string[];
  chosen: readonly string[];
  selectedAvailable: ReadonlySet<string>;
  selectedChosen: ReadonlySet<string>;
  onAvailableChange: (id: string, checked: boolean) => void;
  onChosenChange: (id: string, checked: boolean) => void;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <Inline align="center" gap="md" wrap>
      <Fieldset>
        <Fieldset.Legend>Available members</Fieldset.Legend>
        <Stack gap="sm">
          {available.map((id) => (
            <Field.Root key={id}>
              <Inline gap="sm">
                <Field.Control>
                  <Checkbox
                    checked={selectedAvailable.has(id)}
                    onCheckedChange={(checked) =>
                      onAvailableChange(id, checked)
                    }
                  />
                </Field.Control>
                <Field.Label>{id}</Field.Label>
              </Inline>
            </Field.Root>
          ))}
        </Stack>
      </Fieldset>

      <Stack gap="sm">
        <Button
          type="button"
          disabled={selectedAvailable.size === 0}
          onClick={onAdd}
        >
          Add selected
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={selectedChosen.size === 0}
          onClick={onRemove}
        >
          Remove selected
        </Button>
      </Stack>

      <Fieldset>
        <Fieldset.Legend>Selected members</Fieldset.Legend>
        <Stack gap="sm">
          {chosen.map((id) => (
            <Field.Root key={id}>
              <Inline gap="sm">
                <Field.Control>
                  <Checkbox
                    checked={selectedChosen.has(id)}
                    onCheckedChange={(checked) => onChosenChange(id, checked)}
                  />
                </Field.Control>
                <Field.Label>{id}</Field.Label>
              </Inline>
            </Field.Root>
          ))}
        </Stack>
      </Fieldset>

      <Text role="status" aria-live="polite" variant="caption">
        {chosen.length} members selected.
      </Text>
    </Inline>
  );
}
```

Do not introduce implicit drag/drop as the only transfer mechanism. A public
TransferList would need a written keyboard, focus, selection, large-list, and
announcement model before implementation.

## Timeline

Prefer an ordered list. Use native `time` values for machine-readable dates;
visual connectors are decoration, not semantics.

```tsx
import { List, Stack, Text } from "@varua/flux-ui";

const events = [
  { id: "created", at: "2026-10-01T09:00:00-04:00", label: "Order created" },
  { id: "paid", at: "2026-10-01T09:05:00-04:00", label: "Payment received" },
];

export function Timeline() {
  return (
    <List as="ol" gap={4}>
      {events.map((event) => (
        <List.Item key={event.id}>
          <Stack gap="xs">
            <Text weight="bold">{event.label}</Text>
            <Text as="time" dateTime={event.at} variant="caption" tone="muted">
              {new Date(event.at).toLocaleString()}
            </Text>
          </Stack>
        </List.Item>
      ))}
    </List>
  );
}
```

Applications own domain-specific icons, relative-date formatting, expandable
details, and live updates. Promote Timeline only if repeated products converge
on the same event anatomy and connector geometry.

## Floating primary action

Use `Button` or `IconButton`; positioning belongs to the application shell.
Do not make fixed positioning part of a reusable button contract.

```tsx
import { PlusIcon } from "@varua/icons";
import { Box, IconButton } from "@varua/flux-ui";

export function FloatingCreateAction() {
  return (
    <Box
      style={{
        position: "fixed",
        insetBlockEnd: "1rem",
        insetInlineEnd: "1rem",
        zIndex: 10,
      }}
    >
      <IconButton aria-label="Create item" size="lg">
        <PlusIcon />
      </IconButton>
    </Box>
  );
}
```

The application must account for safe areas, virtual keyboards, overlapping
content, mobile navigation, and reduced viewport sizes. Flux should add a
first-class FAB only if it adopts a distinct floating-primary-action visual and
layout contract.

## Loading overlay / backdrop

Prefer local busy state first. Mark the affected region `aria-busy`, keep its
content present when useful, and pair a single status message with `Spinner`.

```tsx
import { Box, Inline, Spinner, Text } from "@varua/flux-ui";
import type { ReactNode } from "react";

export function LoadingRegion({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <Box aria-busy={loading || undefined} style={{ position: "relative" }}>
      {children}

      {loading ? (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box surface="elevated" padding={4}>
            <Inline role="status" align="center" gap="sm">
              <Spinner label={null} />
              <Text>Updating results</Text>
            </Inline>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
```

Do not use a generic click-to-dismiss backdrop as a substitute for Dialog,
Drawer, Popover, or other components that already own modal/dismissal behavior.
If loading must block interaction, the application is responsible for making
that state explicit and for preserving understandable focus behavior.

## Promotion checklist

Before replacing one of these recipes with a public component, document:

- at least two concrete product uses with the same behavioral contract;
- which state the component would own instead of the application;
- native/platform alternatives and why they are insufficient;
- keyboard, focus, screen-reader, reduced-motion, and high-contrast behavior;
- SSR and hydration expectations;
- performance and bundle-size class;
- what remains application-owned;
- a migration path from the recipe that does not force unrelated API growth.
