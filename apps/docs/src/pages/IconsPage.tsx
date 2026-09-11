import { FluxMarkIcon, SearchIcon } from "@flux-ui/icons";
import {
  iconCatalog,
  type IconCatalogEntry,
  type IconCategory,
} from "@flux-ui/icons/catalog";
import {
  Badge,
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
} from "@flux-ui/react";
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
        <PageHeader
          title={<>Icons that speak Flux.</>}
          eyebrow={<>@flux-ui/icons</>}
        >
          <Text as="p" variant="lead" tone="muted">
            {iconCatalog.length} original marks on one 20 × 20 grid. Search by
            name or intent, inspect them at real UI sizes, and copy the import
            you actually need.
          </Text>
        </PageHeader>
        <Box aria-hidden="true" className="icons-hero-mark">
          <FluxMarkIcon size={72} />
        </Box>
      </Inline>

      <Card className="icon-browser-panel">
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
                placeholder="Try delete, settings, team, external…"
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
              appearance="tile"
              pressed={selected === entry.name}
              key={entry.name}
              onClick={() => {
                setSelected(entry.name);
              }}
              type="button"
            >
              <Text aria-hidden="true" className="icon-tile-stage">
                {createElement(entry.component, { size: Number(iconSize) })}
              </Text>
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
                <Box className="icon-inspector-stage">
                  {createElement(selectedEntry.component, {
                    size: 72,
                    title: `${iconLabel(selectedEntry)} icon`,
                  })}
                </Box>
                <Box>
                  <Text as="p" variant="eyebrow" tone="muted">
                    Selected icon
                  </Text>
                  <Heading level={2} size="lg">
                    {iconLabel(selectedEntry)}
                  </Heading>
                  <Text as="p" variant="body" tone="muted">
                    {selectedEntry.category}
                  </Text>
                </Box>
                <Inline gap="xs" wrap>
                  {selectedEntry.keywords.map((keyword) => (
                    <Badge key={keyword}>{keyword}</Badge>
                  ))}
                </Inline>
                <CodeBlock
                  label={`${selectedEntry.name} import`}
                  code={`import { ${selectedEntry.name} } from "@flux-ui/icons";\n\n<${selectedEntry.name} aria-hidden="true" />`}
                />
                <CodeBlock
                  label={`${selectedEntry.name} direct import`}
                  code={`import { ${selectedEntry.name} } from "@flux-ui/icons/${selectedEntry.name}";`}
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
            title="No icon by that name yet."
            description={
              <>
                Search by intent too—terms such as{" "}
                <Text as="strong" weight="bold">
                  delete
                </Text>
                ,{" "}
                <Text as="strong" weight="bold">
                  team
                </Text>
                ,{" "}
                <Text as="strong" weight="bold">
                  settings
                </Text>
                , and{" "}
                <Text as="strong" weight="bold">
                  external
                </Text>{" "}
                are indexed.
              </>
            }
          />
        </Card>
      ) : null}
    </Stack>
  );
}
