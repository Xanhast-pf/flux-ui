import { FluxMarkIcon, SearchIcon } from "@flux-ui/icons";
import {
  iconCatalog,
  type IconCategory,
  type IconCatalogEntry,
} from "@flux-ui/icons/catalog";
import {
  Badge,
  Card,
  Grid,
  Inline,
  Input,
  Kbd,
  Select,
  Stack,
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
      <div className="icons-hero">
        <div>
          <p className="eyebrow">@flux-ui/icons</p>
          <h1>Icons that speak Flux.</h1>
          <p className="lede">
            {iconCatalog.length} original marks on one 20 × 20 grid. Search by
            name or intent, inspect them at real UI sizes, and copy the import
            you actually need.
          </p>
        </div>
        <div className="icons-hero-mark" aria-hidden="true">
          <FluxMarkIcon size={72} />
        </div>
      </div>

      <Card className="icon-browser-panel">
        <Stack gap="md">
          <div className="icon-browser-controls">
            <div className="icon-search-control">
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
            </div>
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
          </div>

          <Inline gap="md" justify="between" wrap>
            <p className="result-count" role="status">
              {visibleIcons.length}{" "}
              {visibleIcons.length === 1 ? "icon" : "icons"}
            </p>
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

      <div className="icon-browser-layout">
        <Grid
          minColumnWidth="8rem"
          gap="sm"
          className="icon-gallery"
          data-view={view}
        >
          {visibleIcons.map((entry) => (
            <button
              aria-pressed={selected === entry.name}
              className="icon-tile"
              key={entry.name}
              onClick={() => {
                setSelected(entry.name);
              }}
              type="button"
            >
              <span className="icon-tile-stage" aria-hidden="true">
                {createElement(entry.component, { size: Number(iconSize) })}
              </span>
              <span>{iconLabel(entry)}</span>
              <small>{entry.category}</small>
            </button>
          ))}
        </Grid>

        {selectedEntry === undefined ? null : (
          <aside className="icon-inspector" aria-label="Selected icon">
            <Card>
              <Stack gap="md">
                <div className="icon-inspector-stage">
                  {createElement(selectedEntry.component, {
                    size: 72,
                    title: `${iconLabel(selectedEntry)} icon`,
                  })}
                </div>
                <div>
                  <p className="eyebrow">Selected icon</p>
                  <h2>{iconLabel(selectedEntry)}</h2>
                  <p className="muted">{selectedEntry.category}</p>
                </div>
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
          </aside>
        )}
      </div>

      {visibleIcons.length === 0 ? (
        <Card>
          <Stack gap="sm">
            <h2>No icon by that name yet.</h2>
            <p>
              Search by intent too—terms such as <strong>delete</strong>,{" "}
              <strong>team</strong>, <strong>settings</strong>, and{" "}
              <strong>external</strong> are indexed.
            </p>
          </Stack>
        </Card>
      ) : null}
    </Stack>
  );
}
