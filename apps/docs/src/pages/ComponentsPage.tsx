import {
  Badge,
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
} from "@flux-ui/react";
import { useState } from "react";
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
  const search = query.trim().toLowerCase();
  const visible = catalog.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(search),
  );
  return (
    <Stack gap="lg">
      <PageHeader title={<>Components</>} eyebrow={<>The building blocks</>}>
        <Text as="p" variant="lead" tone="muted">
          {catalog.length} families. A preview, example, API notes, and size
          contract for every one.
        </Text>
      </PageHeader>
      <Input
        aria-label="Filter components"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
        placeholder="Find a component, a behavior, a possibility…"
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
                  {visible.length}{" "}
                  {visible.length === 1 ? "component" : "components"}
                </Text>
                <Grid minColumnWidth="14rem" gap="md">
                  {visible.map((item) => (
                    <Card key={item.slug}>
                      <Stack gap="md">
                        <Inline justify="between" wrap>
                          <Badge>{item.category}</Badge>
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
                {visible.length === 0 ? (
                  <Card>
                    <EmptyState
                      title="No matching components."
                      headingLevel={2}
                      description="Try a different name or select All categories."
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
