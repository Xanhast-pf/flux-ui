# @flux-ui/react

Pre-stable React components for Flux UI. The package targets React 19 and keeps
the common API small while preserving native props, composition, refs,
`className`, `style`, documented CSS variables, and stable public state
attributes where the component contract requires them.

## Install

Install the component package and the public token foundations directly in your
application:

```bash
pnpm add @flux-ui/react @flux-ui/tokens
```

React and React DOM are peer dependencies and must satisfy the package manifest
range.

Import the shared foundations once at the application entry. Palette presets are
optional:

```tsx
import "@flux-ui/tokens/reset.css";
import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/presets.css";

import { Button, Container, Stack, Text } from "@flux-ui/react";

export function App() {
  return (
    <Container
      as="main"
      size="sm"
      data-flux-theme="light"
      data-flux-palette="indigo"
    >
      <Stack gap="lg" padding="lg">
        <Text as="p">Flux uses public components for layout and content.</Text>
        <Button>Continue</Button>
      </Stack>
    </Container>
  );
}
```

Built component entry points include their component CSS. Applications still
own when the public reset/theme/preset foundations are imported.

## Component lifecycle

Flux UI is pre-stable. Individual families are marked `beta` or `stable` in
the generated component catalog, and Stable families publish the release where
their compatibility promise began. Check the live catalog before depending on a
Beta API as a long-term contract.

## Engineering contract

- native semantics first;
- keyboard and accessibility behavior are part of the API;
- static styling and CSS custom properties instead of a runtime styling engine;
- bundle-size and runtime-performance budgets are tested;
- public React props remain ergonomic under strict TypeScript;
- behavior-heavy components preserve controlled/uncontrolled naming
  conventions;
- advanced customization uses composition and documented escape hatches rather
  than app-specific forks.

Documentation and live examples: https://flux.varua.ca/

Repository: https://github.com/Xanhast-pf/flux-ui

License: MIT
