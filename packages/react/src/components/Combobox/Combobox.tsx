import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
} from "react";
import { attachRef } from "../../internal/attachRef.js";
import { useFloatingSurface } from "../../internal/useFloatingSurface.js";
import { Input } from "../Input/Input.js";
import {
  empty,
  group,
  groupLabel,
  option,
  popup,
  root,
} from "./Combobox.css.js";
import type { ComboboxOption, ComboboxProps } from "./Combobox.types.js";

type OptionSection = {
  label: string | null;
  items: ComboboxOption[];
};

function groupOptions(options: readonly ComboboxOption[]): OptionSection[] {
  const sections: OptionSection[] = [];
  for (const item of options) {
    const label = item.group ?? null;
    const previous = sections.at(-1);
    if (previous?.label === label) previous.items.push(item);
    else sections.push({ label, items: [item] });
  }
  return sections;
}

export function Combobox({
  options,
  value: controlled,
  defaultValue = null,
  onValueChange,
  query: controlledQuery,
  defaultQuery = null,
  onQueryChange,
  listLabel = "Suggestions",
  emptyMessage = "No matches found.",
  loading = false,
  loadingMessage = "Loading suggestions.",
  invalidSelectionMessage = "Choose an option from the list.",
  ref,
  name,
  id,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  disabled,
  readOnly,
  ...props
}: ComboboxProps) {
  const generated = useId();
  const listId = `${generated}-list`;
  const [local, setLocal] = useState<string | null>(defaultValue);
  const value = controlled !== undefined ? controlled : local;
  const [localQuery, setLocalQuery] = useState<string | null>(defaultQuery);
  const query = controlledQuery !== undefined ? controlledQuery : localQuery;
  const [previousValue, setPreviousValue] = useState(value);
  // An explicit owner selection replaces an unfinished local query. Clearing a
  // value during typing must not erase the text the user just entered.
  if (previousValue !== value) {
    setPreviousValue(value);
    if (value !== null && controlledQuery === undefined) setLocalQuery(null);
  }
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);
  const selected = options.find(
    (item) => item.value === value && !item.disabled,
  );
  const text = query ?? selected?.label ?? "";
  const filtered =
    query === null
      ? options
      : options.filter((item) =>
          item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        );
  const sections = groupOptions(filtered);
  const available = filtered.filter((item) => !item.disabled);
  const highlighted =
    available.find((item) => item.value === active) ?? available[0];
  const expanded = open && !disabled && !readOnly;
  const activeId =
    expanded && highlighted !== undefined
      ? `${listId}-${encodeURIComponent(highlighted.value)}`
      : undefined;
  const unmatched = query !== null && query.length > 0;
  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      setInput(node);
      if (node === null) return;
      const cleanup = attachRef(ref, node);
      return () => {
        cleanup?.();
        setInput(null);
      };
    },
    [ref],
  );
  useFloatingSurface(input, surface, expanded);
  useEffect(() => {
    if (!expanded || input === null) return;
    function outside(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Node &&
        !input?.contains(target) &&
        !surface?.contains(target)
      )
        setOpen(false);
    }
    const doc = input.ownerDocument;
    doc.addEventListener("pointerdown", outside);
    return () => doc.removeEventListener("pointerdown", outside);
  }, [expanded, input, surface]);
  useLayoutEffect(() => {
    input?.setCustomValidity(unmatched ? invalidSelectionMessage : "");
  }, [input, unmatched, invalidSelectionMessage]);
  useLayoutEffect(() => {
    if (activeId === undefined || input === null) return;
    const element = input.ownerDocument.getElementById(activeId);
    if (typeof element?.scrollIntoView === "function")
      element.scrollIntoView({ block: "nearest" });
  }, [activeId, input]);
  useEffect(() => {
    const form = input?.form;
    if (form === null || form === undefined) return;
    function reset(event: Event) {
      queueMicrotask(() => {
        if (event.defaultPrevented || !input?.isConnected) return;
        setOpen(false);
        if (controlledQuery === undefined) setLocalQuery(defaultQuery);
        setActive(null);
        if (controlled === undefined) setLocal(defaultValue);
      });
    }
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [input, controlled, defaultValue, controlledQuery, defaultQuery]);

  if (new Set(options.map((item) => item.value)).size !== options.length)
    throw new RangeError("Combobox option values must be unique.");

  function changeQuery(next: string | null) {
    if (controlledQuery === undefined) setLocalQuery(next);
    if (query !== next) onQueryChange?.(next);
  }
  function changeValue(next: string | null) {
    if (controlled === undefined) setLocal(next);
    if (value !== next) onValueChange?.(next);
  }
  function choose(item: ComboboxOption) {
    if (item.disabled || disabled || readOnly) return;
    changeValue(item.value);
    changeQuery(null);
    setOpen(false);
    setActive(item.value);
    input?.focus();
  }
  return (
    <div className={root}>
      <Input
        {...props}
        id={id ?? generated}
        type="text"
        ref={setRef}
        disabled={disabled}
        readOnly={readOnly}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-invalid={unmatched || props["aria-invalid"]}
        autoComplete={props.autoComplete ?? "off"}
        value={text}
        onChange={(event) => {
          onChange?.(event);
          if (event.defaultPrevented || disabled || readOnly) return;
          changeQuery(event.currentTarget.value);
          setActive(null);
          setOpen(true);
          changeValue(null);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented && !disabled && !readOnly) setOpen(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!surface?.contains(event.relatedTarget)) setOpen(false);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (
            event.defaultPrevented ||
            event.nativeEvent.isComposing ||
            disabled ||
            readOnly ||
            event.ctrlKey ||
            event.metaKey
          )
            return;
          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            return;
          }
          if (event.key === "Enter" && open && highlighted !== undefined) {
            event.preventDefault();
            choose(highlighted);
            return;
          }
          if (
            (event.key === "ArrowDown" || event.key === "ArrowUp") &&
            !event.altKey
          ) {
            event.preventDefault();
            setOpen(true);
            const index = available.findIndex(
              (item) => item.value === highlighted?.value,
            );
            const next = !open
              ? event.key === "ArrowUp"
                ? available.at(-1)
                : available[0]
              : available[
                  Math.max(
                    0,
                    Math.min(
                      available.length - 1,
                      index + (event.key === "ArrowDown" ? 1 : -1),
                    ),
                  )
                ];
            setActive(next?.value ?? null);
          }
        }}
      />
      {name !== undefined ? (
        <input
          type="hidden"
          name={name}
          value={query === null ? (selected?.value ?? "") : ""}
          disabled={disabled}
          form={props.form}
        />
      ) : null}
      <div
        ref={setSurface}
        popover="manual"
        hidden={!expanded}
        data-state={expanded ? "open" : "closed"}
        className={popup}
      >
        <div
          role="listbox"
          id={listId}
          aria-label={listLabel}
          aria-busy={loading || undefined}
        >
          {sections.map((section) => {
            const buttons = section.items.map((item) => (
              <button
                type="button"
                disabled={item.disabled}
                key={item.value}
                id={`${listId}-${encodeURIComponent(item.value)}`}
                role="option"
                aria-selected={item.value === highlighted?.value}
                aria-disabled={item.disabled || undefined}
                tabIndex={-1}
                className={option}
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => {
                  if (!item.disabled) setActive(item.value);
                }}
                onClick={() => choose(item)}
              >
                {item.label}
              </button>
            ));
            return section.label === null ? (
              buttons
            ) : (
              <div
                key={section.items[0]?.value}
                role="group"
                aria-label={section.label}
                className={group}
              >
                <div aria-hidden="true" className={groupLabel}>
                  {section.label}
                </div>
                {buttons}
              </div>
            );
          })}
        </div>
        {loading ? (
          <div className={empty} role="status">
            {loadingMessage}
          </div>
        ) : filtered.length === 0 ? (
          <div className={empty} role="status">
            {emptyMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}
