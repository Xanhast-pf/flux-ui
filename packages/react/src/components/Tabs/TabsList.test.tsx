import { createRef, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs.js";
afterEach(() => vi.restoreAllMocks());
const values = ["One", "Two", "Three", "Four", "Five"];
function Parts() {
  return (
    <>
      {values.map((value) => (
        <Tabs.Tab key={value} value={value}>
          {value}
        </Tabs.Tab>
      ))}
    </>
  );
}
function tab(list: HTMLElement, value: string): HTMLButtonElement {
  const node = list.querySelector<HTMLButtonElement>(
    `[data-flux-tab-value="${value}"]`,
  );
  if (node === null) throw new Error(`Missing tab ${value}`);
  return node;
}
it("keeps an available visible keyboard entry when a controlled selected tab is disabled", async () => {
  const change = vi.fn();
  render(
    <Tabs.Root value="Five" onValueChange={change}>
      <Tabs.List aria-label="Unavailable selection">
        <Tabs.Tab value="One">One</Tabs.Tab>
        <Tabs.Tab value="Two">Two</Tabs.Tab>
        <Tabs.Tab value="Five" disabled>
          Five
        </Tabs.Tab>
      </Tabs.List>
    </Tabs.Root>,
  );
  const list = screen.getByRole("tablist", { name: "Unavailable selection" });
  await waitFor(() =>
    expect(tab(list, "One")).toHaveAttribute("tabindex", "0"),
  );
  expect(tab(list, "Five")).toHaveAttribute("aria-selected", "true");
  expect(change).not.toHaveBeenCalled();
});

it("keeps original list attributes, events and cleanup refs in StrictMode", async () => {
  const cleanup = vi.fn();
  const ref = vi.fn((_node: HTMLDivElement | null) => cleanup);
  const key = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  const view = render(
    <StrictMode>
      <Tabs.Root defaultValue="One">
        <Tabs.List
          aria-label="Stable API"
          className="custom-tabs"
          style={{ direction: "rtl" }}
          ref={ref}
          onKeyDown={key}
        >
          <Parts />
        </Tabs.List>
      </Tabs.Root>
    </StrictMode>,
  );
  const list = screen.getByRole("tablist", { name: "Stable API" });
  expect(list).toHaveClass("custom-tabs");
  expect(list).toHaveStyle({ direction: "rtl" });
  expect(ref).toHaveBeenLastCalledWith(list);
  await act(() => {
    tab(list, "One").focus();
    return Promise.resolve();
  });
  fireEvent.keyDown(tab(list, "One"), { key: "End" });
  expect(key).toHaveBeenCalledOnce();
  expect(tab(list, "One")).toHaveFocus();
  view.unmount();
  expect(cleanup).toHaveBeenCalledTimes(ref.mock.calls.length);
});

it("hydrates server IDs, switches panels and cleans up the consumer ref", async () => {
  const ref = createRef<HTMLDivElement>();
  const recoverable = vi.fn();
  const content = (
    <Tabs.Root defaultValue="One">
      <Tabs.List aria-label="Hydrated tabs" ref={ref}>
        <Parts />
      </Tabs.List>
      <Tabs.Panel value="Five">Hydrated panel</Tabs.Panel>
    </Tabs.Root>
  );
  const host = document.createElement("div");
  host.innerHTML = renderToString(content);
  document.body.append(host);
  const ids = Array.from(host.querySelectorAll("[id]"), (node) => node.id);
  const root = hydrateRoot(host, content, { onRecoverableError: recoverable });
  try {
    await act(async () => {});
    expect(
      Array.from(host.querySelectorAll("[id]"), (node) => node.id),
    ).toEqual(ids);
    expect(ref.current).toBe(within(host).getByRole("tablist"));
    const user = userEvent.setup();
    await user.click(within(host).getByRole("tab", { name: "Five" }));
    expect(within(host).getByRole("tabpanel", { name: "Five" })).toBeVisible();
    expect(recoverable).not.toHaveBeenCalled();
  } finally {
    act(() => root.unmount());
    host.remove();
  }
  expect(ref.current).toBeNull();
});

it("uses one fresh collection when a keyboard handler changes tab availability", () => {
  render(
    <Tabs.Root defaultValue="One">
      <Tabs.List
        aria-label="Pending availability"
        onKeyDown={(event) => {
          tab(event.currentTarget, "Five").hidden = true;
          tab(event.currentTarget, "Four").setAttribute("inert", "");
        }}
      >
        <Parts />
      </Tabs.List>
    </Tabs.Root>,
  );
  const list = screen.getByRole("tablist");
  act(() => tab(list, "One").focus());
  const scan = vi.spyOn(list, "querySelectorAll");
  fireEvent.keyDown(tab(list, "One"), { key: "End" });
  expect(tab(list, "Three")).toHaveFocus();
  expect(tab(list, "One")).toHaveAttribute("aria-selected", "true");
  expect(
    scan.mock.calls.filter(([selector]) => selector === '[role="tab"]'),
  ).toHaveLength(1);
});

it("preserves controlled ownership and consumer click cancellation through Tab/Panel", async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  render(
    <Tabs.Root value="one" onValueChange={change}>
      <Tabs.List aria-label="Controlled tabs">
        <Tabs.Tab value="one">First</Tabs.Tab>
        <Tabs.Tab value="two">Second</Tabs.Tab>
        <Tabs.Tab value="cancel" onClick={(event) => event.preventDefault()}>
          Cancelled
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">First panel</Tabs.Panel>
      <Tabs.Panel value="two">Second panel</Tabs.Panel>
    </Tabs.Root>,
  );
  await user.click(screen.getByRole("tab", { name: "Cancelled" }));
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("tab", { name: "Second" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("two");
  expect(screen.getByRole("tabpanel", { name: "First" })).toBeVisible();
  expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
