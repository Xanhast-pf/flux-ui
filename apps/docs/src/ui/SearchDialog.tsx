import { SearchIcon } from "@flux-ui/icons";
import { Dialog, Input, Kbd, Stack } from "@flux-ui/react";
import { useEffect, useState } from "react";
import { components } from "../generated/components.js";
import { sections } from "../lib/routing.js";
const entries = [
  ...sections.map(([id, label]) => ({
    href: `#${id}`,
    title: label,
    detail: "Documentation",
  })),
  ...components.map((entry) => ({
    href: `#components/${entry.slug}`,
    title: entry.name,
    detail: `${entry.category} · ${entry.description}`,
  })),
];
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = entries.filter((entry) =>
    `${entry.title} ${entry.detail}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
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
      <Dialog.Trigger className="search-trigger">
        <SearchIcon aria-hidden="true" size={16} />
        Search docs <Kbd aria-hidden="true">⌘ / Ctrl K</Kbd>
      </Dialog.Trigger>
      <Dialog.Popup className="search-popup">
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
          <p className="result-count" role="status">
            {results.length} results
          </p>
          <ul className="search-results">
            {results.map((entry) => (
              <li key={entry.href}>
                <a
                  href={entry.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <strong>{entry.title}</strong>
                  <span>{entry.detail}</span>
                </a>
              </li>
            ))}
          </ul>
          {results.length === 0 ? (
            <p>No matches. Try a shorter search.</p>
          ) : null}
        </Stack>
        <Dialog.Close>Close search</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
