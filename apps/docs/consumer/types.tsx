// Compile against emitted declarations, never packages/*/src aliases.
import { createRef } from "react";
import { Sidebar, Text, AspectRatio, Container } from "@flux-ui/react";
const panelRef = createRef<HTMLElement>();
const toggleRef = createRef<HTMLButtonElement>();
export const publicDeclarations = (
  <Sidebar.Root defaultOpen={undefined} onOpenChange={undefined}>
    <Sidebar.Toggle ref={toggleRef}>Navigation</Sidebar.Toggle>
    <Sidebar.Layout style={{ "--flux-sidebar-width": "20rem" }}>
      <Sidebar.Panel ref={panelRef} aria-label="Sections">
        <Text italic={undefined} decoration={undefined}>
          Navigation
        </Text>
      </Sidebar.Panel>
      <Sidebar.Content>
        <Container size="xs">
          <AspectRatio align="center">Preview</AspectRatio>
        </Container>
      </Sidebar.Content>
    </Sidebar.Layout>
  </Sidebar.Root>
);
// @ts-expect-error The navigation panel must have an accessible name.
export const unnamed = <Sidebar.Panel />;
// @ts-expect-error Controlled and uncontrolled state are mutually exclusive.
export const conflicting = <Sidebar.Root open defaultOpen />;
