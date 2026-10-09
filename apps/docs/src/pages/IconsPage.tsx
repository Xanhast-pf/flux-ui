import { FluxMarkIcon, SearchIcon } from "@varua/icons";
import {
  iconCatalog,
  type IconCatalogEntry,
  type IconCategory,
} from "@varua/icons/catalog";
import {
  StatusBadge,
  Box,
  Card,
  EmptyState,
  Grid,
  Heading,
  Inline,
  Input,
  Kbd,
  PageHeader,
  Select,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
} from "@varua/flux-ui";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock } from "../ui/CodeBlock.js";
const iconSizes = [16, 20, 24, 32] as const;
const categories: readonly ("all" | IconCategory)[] = [
  "all",
  ...Array.from(new Set(iconCatalog.map((entry) => entry.category))).sort(
    (left, right) => left.localeCompare(right),
  ),
];
function iconLabel(entry: IconCatalogEntry): string {
  return entry.name.replace(/Icon$/u, "");
}
export function IconsPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | IconCategory>("all");
  const [iconSize, setIconSize] = useState("20");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState("FluxMarkIcon");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleIcons = useMemo(
    () =>
      iconCatalog.filter(
        (entry) =>
          (category === "all" || entry.category === category) &&
          `${entry.name} ${entry.category} ${entry.keywords.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery),
      ),
    [category, normalizedQuery],
  );
  const selectedEntry =
    iconCatalog.find((entry) => entry.name === selected) ?? iconCatalog[0];
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent): void {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);
  return (
    <Stack gap="xl">
      <Inline wrap justify="between" gap="lg">
        <PageHeader title={<>Icons</>} eyebrow={<>@varua/icons</>}>
          <Text as="p" variant="lead" tone="muted">
            {iconCatalog.length} icons on a 20 × 20 grid. Search and copy an
            import.
          </Text>
        </PageHeader>
        <Card aria-hidden="true" surface="subtle" padding="md">
          <FluxMarkIcon size={64} />
        </Card>
      </Inline>

      <Card>
        <Stack gap="md">
          <Inline wrap gap="md">
            <Inline className="icon-search-control" gap="sm">
              <SearchIcon aria-hidden="true" size={16} />
              <Input
                aria-label="Filter Flux icons"
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.currentTarget.value);
                }}
                placeholder="Search names or actions…"
              />
              <Kbd aria-hidden="true">/</Kbd>
            </Inline>
            <Select
              aria-label="Icon category"
              value={category}
              onChange={(event) => {
                setCategory(event.currentTarget.value as "all" | IconCategory);
              }}
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All categories" : value}
                </option>
              ))}
            </Select>
          </Inline>

          <Inline gap="md" justify="between" wrap>
            <Text role="status" as="p" variant="caption" tone="muted">
              {visibleIcons.length}{" "}
              {visibleIcons.length === 1 ? "icon" : "icons"}
            </Text>
            <Inline gap="sm" wrap>
              <ToggleGroup.Root
                aria-label="Icon preview size"
                type="single"
                value={iconSize}
                onValueChange={(value) => {
                  if (value !== null) setIconSize(value);
                }}
              >
                {iconSizes.map((size) => (
                  <ToggleGroup.Item key={size} value={String(size)}>
                    {size}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
              <ToggleGroup.Root
                aria-label="Icon gallery view"
                type="single"
                value={view}
                onValueChange={(value) => {
                  if (value !== null) setView(value);
                }}
              >
                <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
                <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              </ToggleGroup.Root>
            </Inline>
          </Inline>
        </Stack>
      </Card>

      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1fr) minmax(0, 20rem)",
        }}
        gap="lg"
      >
        <Grid
          {...(view === "list" ? { columns: 1 } : { minColumnWidth: "8rem" })}
          gap="sm"
          data-view={view}
          className="icon-gallery"
        >
          {visibleIcons.map((entry) => (
            <Toggle
              variant="tile"
              pressed={selected === entry.name}
              key={entry.name}
              onClick={() => {
                setSelected(entry.name);
              }}
              type="button"
            >
              <Stack aria-hidden="true" align="center" padding="md">
                {createElement(entry.component, { size: Number(iconSize) })}
              </Stack>
              <Text>{iconLabel(entry)}</Text>
              <Text as="small" variant="caption">
                {entry.category}
              </Text>
            </Toggle>
          ))}
        </Grid>

        {selectedEntry === undefined ? null : (
          <Box aria-label="Selected icon" className="icon-inspector" as="aside">
            <Card>
              <Stack gap="md">
                <Box surface="subtle" border="all" radius="sm" padding="xl">
                  <Stack align="center" gap="none">
                    {createElement(selectedEntry.component, {
                      size: 72,
                      title: `${iconLabel(selectedEntry)} icon`,
                    })}
                  </Stack>
                </Box>
                <Stack gap="sm">
                  <Text as="p" variant="eyebrow" tone="muted">
                    Selected icon
                  </Text>
                  <Heading level={2} size="lg">
                    {iconLabel(selectedEntry)}
                  </Heading>
                  <Text as="p" variant="body" tone="muted">
                    {selectedEntry.category}
                  </Text>
                </Stack>
                <Inline gap="xs" wrap>
                  {selectedEntry.keywords.map((keyword) => (
                    <StatusBadge key={keyword}>{keyword}</StatusBadge>
                  ))}
                </Inline>
                <CodeBlock
                  label={`${selectedEntry.name} import`}
                  code={`import { ${selectedEntry.name} } from "@varua/icons";\n\n<${selectedEntry.name} aria-hidden="true" />`}
                />
                <CodeBlock
                  label={`${selectedEntry.name} direct import`}
                  code={`import { ${selectedEntry.name} } from "@varua/icons/${selectedEntry.name}";`}
                />
              </Stack>
            </Card>
          </Box>
        )}
      </Grid>

      {visibleIcons.length === 0 ? (
        <Card>
          <EmptyState
            headingLevel={2}
            title="No icons found."
            description="Try delete, team, settings, or external."
          />
        </Card>
      ) : null}
    </Stack>
  );
}
