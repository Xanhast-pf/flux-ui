import { SearchIcon } from "@flux-ui/icons";
import {
  Dialog,
  EmptyState,
  Input,
  IconButton,
  Link,
  List,
  ScrollArea,
  Stack,
  Text,
} from "@flux-ui/react";
import { useEffect, useState } from "react";
import { useComponentSearch } from "../lib/componentSearch.js";
import { sections } from "../lib/routing.js";

const sectionEntries = sections.map(([id, label]) => ({
  href: `#${id}`,
  title: label,
  detail: "Documentation",
}));
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { ready, results: componentResults } = useComponentSearch(query);
  const normalizedQuery = query.trim().toLowerCase();
  const sectionResults = sectionEntries.filter((entry) =>
    `${entry.title} ${entry.detail}`.toLowerCase().includes(normalizedQuery),
  );
  const results = [
    ...sectionResults,
    ...componentResults.map((entry) => ({
      href: `#components/${entry.slug}`,
      title: entry.name,
      detail: `${entry.category} · ${entry.description}`,
    })),
  ];
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey) ||
        event.altKey
      )
        return;
      if (!open && document.querySelector("dialog[open]") !== null) return;
      event.preventDefault();
      setOpen((value) => !value);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <IconButton
        variant="ghost"
        tone="neutral"
        aria-label="Search docs"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Search docs (Ctrl or Command K)"
        onClick={() => setOpen(true)}
      >
        <SearchIcon aria-hidden="true" size={20} />
      </IconButton>
      <Dialog.Popup>
        <Dialog.Title>Find your next building block.</Dialog.Title>
        <Dialog.Description>
          Search components and documentation. Use Tab to follow links and
          Escape to close.
        </Dialog.Description>
        <Stack gap="sm">
          <Input
            aria-label="Search documentation"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            }}
            placeholder="Try switch, icons, or performance…"
          />
          <Text role="status" as="p" variant="caption" tone="muted">
            {ready
              ? `${results.length} ${results.length === 1 ? "result" : "results"}`
              : "Searching component pages…"}
          </Text>
          <ScrollArea
            axis="vertical"
            aria-label="Search results"
            style={{ maxBlockSize: "24rem" }}
          >
            <List as="ul" variant="plain" gap="xs">
              {results.map((entry) => (
                <List.Item key={entry.href}>
                  <Link
                    variant="navigation"
                    href={entry.href}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Stack gap="xs">
                      <Text as="strong" weight="bold">
                        {entry.title}
                      </Text>
                      <Text variant="caption" tone="muted">
                        {entry.detail}
                      </Text>
                    </Stack>
                  </Link>
                </List.Item>
              ))}
            </List>
          </ScrollArea>
          {ready && results.length === 0 ? (
            <EmptyState
              title="No matches."
              description="Try a shorter search."
            />
          ) : null}
        </Stack>
        <Dialog.Close>Close search</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
