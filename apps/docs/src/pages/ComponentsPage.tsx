import {
  StatusBadge,
  Card,
  EmptyState,
  Grid,
  Heading,
  Inline,
  Input,
  Link,
  PageHeader,
  Stack,
  Tabs,
  Text,
} from "@varua/flux-ui";
import { useState } from "react";
import { useComponentSearch } from "../lib/componentSearch.js";
import { catalog } from "../lib/examples.js";
const categories = [
  "All",
  ...Array.from(new Set(catalog.map((item) => item.category))).sort(
    (left, right) => left.localeCompare(right),
  ),
];
export function ComponentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { ready, results } = useComponentSearch(query);
  const visible = results.filter(
    (item) => category === "All" || item.category === category,
  );
  return (
    <Stack gap="lg">
      <PageHeader title={<>Components</>} eyebrow={<>Component catalog</>}>
        <Text as="p" variant="lead" tone="muted">
          {catalog.length} components with previews, code, and API notes.
        </Text>
      </PageHeader>
      <Input
        aria-label="Filter components"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
        placeholder="Search components…"
      />
      <Tabs.Root value={category} onValueChange={setCategory}>
        <Tabs.List aria-label="Component categories" activateOnFocus>
          {categories.map((name) => (
            <Tabs.Tab key={name} value={name}>
              {name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {categories.map((name) => (
          <Tabs.Panel value={name} key={name}>
            {category === name ? (
              <>
                <Text role="status" as="p" variant="caption" tone="muted">
                  {ready
                    ? `${visible.length} ${visible.length === 1 ? "component" : "components"}`
                    : "Searching…"}
                </Text>
                <Grid minColumnWidth="14rem" gap="md">
                  {visible.map((item) => (
                    <Card key={item.slug}>
                      <Stack gap="md">
                        <Inline justify="between" wrap>
                          <StatusBadge>{item.category}</StatusBadge>
                          <Text tone="muted">{item.status}</Text>
                        </Inline>
                        <Heading level={2} size="lg">
                          <Link href={`#components/${item.slug}`}>
                            {item.name}
                            <Text aria-hidden="true"> ↗</Text>
                          </Link>
                        </Heading>
                        <Text as="p" variant="body" tone="muted">
                          {item.description}
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
                {ready && visible.length === 0 ? (
                  <Card>
                    <EmptyState
                      title="No components found."
                      headingLevel={2}
                      description="Try another search or category."
                    />
                  </Card>
                ) : null}
              </>
            ) : null}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </Stack>
  );
}
