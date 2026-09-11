import { CloseIcon, MenuIcon } from "@flux-ui/icons";
import {
  Box,
  Collapsible,
  Drawer,
  Link,
  List,
  ScrollArea,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
import { components } from "../generated/components.js";
import { sections } from "../lib/routing.js";
import { ThemeSwitch } from "./AppearanceControls.js";
function Navigation({
  route,
  onNavigate,
}: {
  route: string;
  onNavigate?: () => void;
}) {
  return (
    <Box aria-label="Documentation sections" as="nav">
      <Stack gap="md">
        <Box>
          <Text as="p" variant="eyebrow" tone="muted">
            Explore Flux
          </Text>
          <List as="ul" variant="plain">
            {sections.map(([id, label]) => (
              <List.Item key={id}>
                <Link
                  href={`#${id}`}
                  aria-current={route === id ? "page" : undefined}
                  onClick={onNavigate}
                  variant="navigation"
                >
                  {label}
                </Link>
              </List.Item>
            ))}
          </List>
        </Box>
        <Collapsible.Root open appearance="plain" density="compact">
          <Collapsible.Trigger>
            All components <Text tone="muted">{components.length}</Text>
          </Collapsible.Trigger>
          <Collapsible.Content padding="none">
            <List as="ul" variant="plain">
              {components.map((entry) => (
                <List.Item key={entry.slug}>
                  <Link
                    href={`#components/${entry.slug}`}
                    aria-current={
                      route === `components/${entry.slug}` ? "page" : undefined
                    }
                    onClick={onNavigate}
                    variant="navigation"
                  >
                    {entry.name}
                  </Link>
                </List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible.Root>
      </Stack>
    </Box>
  );
}
export function DocumentationNavigation({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger className="mobile-nav-trigger">
        <MenuIcon aria-hidden="true" size={16} />
        Browse sections
      </Drawer.Trigger>
      <Drawer.Popup side="left" className="mobile-nav-drawer">
        <Drawer.Title>Flux UI documentation</Drawer.Title>
        <Drawer.Close aria-label="Close navigation" title="Close navigation">
          <CloseIcon aria-hidden="true" size={16} />
        </Drawer.Close>
        <Drawer.Description style={{ gridColumn: "1 / -1", margin: 0 }}>
          Find a component, experiment, or inspect the project.
        </Drawer.Description>
        <Box style={{ gridColumn: "1 / -1" }}>
          <ThemeSwitch />
        </Box>
        <ScrollArea
          aria-label="Documentation navigation"
          className="navigation-scroll"
        >
          <Navigation
            route={route}
            onNavigate={() => {
              setOpen(false);
            }}
          />
        </ScrollArea>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
