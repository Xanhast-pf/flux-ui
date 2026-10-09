import { CloseIcon } from "@varua/icons";
import {
  Box,
  Drawer,
  Sidebar,
  Heading,
  Input,
  Inline,
  Link,
  List,
  Stack,
  Text,
} from "@varua/flux-ui";
import { useState } from "react";
import { useComponentSearch } from "../lib/componentSearch.js";
import { navigationGroups } from "../lib/routing.js";
import { ThemeSwitch } from "./AppearanceControls.js";
function Navigation({
  route,
  onNavigate,
}: {
  route: string;
  onNavigate?: (() => void) | undefined;
}) {
  const [query, setQuery] = useState("");
  const { ready, results } = useComponentSearch(query);

  return (
    <Box aria-label="Documentation sections" as="nav">
      <Stack gap="md">
        {navigationGroups.map((group) => (
          <Stack key={group.label} gap="sm">
            <Text as="p" variant="eyebrow" tone="muted">
              {group.label}
            </Text>
            <List as="ul" variant="plain">
              {group.items.map(([id, label]) => (
                <List.Item key={id}>
                  <Link
                    href={`#${id}`}
                    onClick={(event) => {
                      if (
                        !event.defaultPrevented &&
                        event.button === 0 &&
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                      )
                        onNavigate?.();
                    }}
                    aria-current={route === id ? "page" : undefined}
                    variant="navigation"
                  >
                    {label}
                  </Link>
                </List.Item>
              ))}
            </List>
          </Stack>
        ))}
        <Stack gap="sm">
          <Text as="p" variant="eyebrow" tone="muted">
            Components
          </Text>
          <Input
            aria-label="Search components"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            placeholder="Search components and APIs…"
          />
          <Text role="status" as="p" variant="caption" tone="muted">
            {ready
              ? `${results.length} ${results.length === 1 ? "component" : "components"}`
              : "Searching…"}
          </Text>
          <List as="ul" variant="plain">
            {results.map((entry) => (
              <List.Item key={entry.slug}>
                <Link
                  href={`#components/${entry.slug}`}
                  onClick={(event) => {
                    if (
                      !event.defaultPrevented &&
                      event.button === 0 &&
                      !event.metaKey &&
                      !event.ctrlKey &&
                      !event.shiftKey &&
                      !event.altKey
                    )
                      onNavigate?.();
                  }}
                  aria-current={
                    route === `components/${entry.slug}` ? "page" : undefined
                  }
                  variant="navigation"
                >
                  {entry.name}
                </Link>
              </List.Item>
            ))}
          </List>
          {ready && results.length === 0 ? (
            <Text as="p" variant="caption" tone="muted">
              No matching components.
            </Text>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
export function DocumentationNavigation({
  route,
  mobile,
  onNavigate,
}: {
  route: string;
  mobile: boolean;
  onNavigate: () => void;
}) {
  return (
    <>
      {!mobile && (
        <Sidebar.Panel
          aria-label="Documentation sidebar"
          className="documentation-sidebar"
        >
          <Stack gap="lg">
            <Inline justify="between" gap="sm">
              <Heading level={2} size="sm">
                Documentation
              </Heading>
              <Sidebar.Close
                variant="ghost"
                size="sm"
                tone="neutral"
                aria-label="Close navigation"
                title="Close navigation"
              >
                <CloseIcon aria-hidden="true" size={16} />
              </Sidebar.Close>
            </Inline>
            <Navigation route={route} />
            <ThemeSwitch />
            <Link href="https://github.com/Xanhast-pf/flux-ui">
              Flux UI on GitHub
            </Link>
          </Stack>
        </Sidebar.Panel>
      )}
      <Drawer.Popup
        side="left"
        id="docs-mobile-navigation"
        data-docs-navigation=""
      >
        {mobile && (
          <Stack gap="lg">
            <Inline justify="between" gap="sm">
              <Drawer.Title>Documentation</Drawer.Title>
              <Drawer.Close
                aria-label="Close navigation"
                title="Close navigation"
              >
                <CloseIcon aria-hidden="true" size={16} />
              </Drawer.Close>
            </Inline>
            <Navigation route={route} onNavigate={onNavigate} />
            <ThemeSwitch />
            <Link href="https://github.com/Xanhast-pf/flux-ui">
              Flux UI on GitHub
            </Link>
          </Stack>
        )}
      </Drawer.Popup>
    </>
  );
}
