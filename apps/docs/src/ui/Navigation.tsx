import { CloseIcon, MenuIcon } from "@flux-ui/icons";
import { Collapsible, Drawer, Stack } from "@flux-ui/react";
import { useState } from "react";
import { ThemeSwitch } from "./AppearanceControls.js";
import { components } from "../generated/components.js";
import { sections } from "../lib/routing.js";
export function Navigation({
  route,
  onNavigate,
}: {
  route: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Documentation sections">
      <Stack gap="md">
        <div>
          <p className="nav-label">Explore Flux</p>
          <ul className="nav-links">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={route === id ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Collapsible.Root open className="nav-catalog">
          <Collapsible.Trigger>
            All components <span className="muted">{components.length}</span>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <ul className="nav-links">
              {components.map((entry) => (
                <li key={entry.slug}>
                  <a
                    href={`#components/${entry.slug}`}
                    aria-current={
                      route === `components/${entry.slug}` ? "page" : undefined
                    }
                    onClick={onNavigate}
                  >
                    {entry.name}
                  </a>
                </li>
              ))}
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </Stack>
    </nav>
  );
}
export function MobileNavigation({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger className="mobile-nav-trigger">
        <MenuIcon aria-hidden="true" size={16} />
        Browse sections
      </Drawer.Trigger>
      <Drawer.Popup side="left" className="mobile-nav-drawer">
        <Drawer.Title>Flux UI documentation</Drawer.Title>
        <Drawer.Description>
          Find a component, experiment, or inspect the project.
        </Drawer.Description>
        <ThemeSwitch />
        <Navigation
          route={route}
          onNavigate={() => {
            setOpen(false);
          }}
        />
        <Drawer.Close>
          <CloseIcon aria-hidden="true" size={16} />
          Close navigation
        </Drawer.Close>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
