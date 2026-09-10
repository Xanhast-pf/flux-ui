import { Badge, Card, Grid, Inline, Input, Stack, Tabs } from "@flux-ui/react";
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
      <div>
        <p className="eyebrow">The building blocks</p>
        <h1>Components</h1>
        <p className="lede">
          {catalog.length} families. A preview, example, API notes, and size
          contract for every one.
        </p>
      </div>
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
        <div className="component-category-scroll">
          <Tabs.List
            aria-label="Component categories"
            activateOnFocus
            className="component-category-tabs"
          >
            {categories.map((name) => (
              <Tabs.Tab key={name} value={name}>
                {name}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
        {categories.map((name) => (
          <Tabs.Panel value={name} key={name}>
            {category === name ? (
              <>
                <p className="result-count" role="status">
                  {visible.length}{" "}
                  {visible.length === 1 ? "component" : "components"}
                </p>
                <Grid minColumnWidth="14rem" gap="md">
                  {visible.map((item) => (
                    <Card key={item.slug} className="catalog-card">
                      <Inline justify="between" wrap>
                        <Badge>{item.category}</Badge>
                        <span className="muted">{item.status}</span>
                      </Inline>
                      <h2>
                        <a href={`#components/${item.slug}`}>
                          {item.name}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      </h2>
                      <p>{item.description}</p>
                    </Card>
                  ))}
                </Grid>
                {visible.length === 0 ? (
                  <Card>
                    <h2>No matching components.</h2>
                    <p>Try a different name or select All categories.</p>
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
