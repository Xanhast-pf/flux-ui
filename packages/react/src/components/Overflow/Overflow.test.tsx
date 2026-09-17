import { StrictMode, useContext, useState } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { OverflowCapabilityContext } from "../../internal/overflowCapability.js";
import { Tabs } from "../Tabs/Tabs.js";
import { Overflow } from "./Overflow.js";

let width = 250;
const observers: {
  callback: ResizeObserverCallback;
  instance: ResizeObserver;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];
beforeEach(() => {
  width = 250;
  observers.length = 0;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        observers.push({
          callback,
          disconnect: this.disconnect,
          instance: this,
        });
      }
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    () => width,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return DOMRect.fromRect({
        width: this.getAttribute("aria-label") === "More items" ? 40 : 100,
        height: 40,
      });
    },
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function resize(next: number) {
  width = next;
  await act(async () => {
    for (const observer of observers) observer.callback([], observer.instance);
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}
function Example({
  values = ["One", "Two", "Three", "Four"],
  controlled = false,
}: {
  values?: string[];
  controlled?: boolean;
}) {
  const [value, setValue] = useState("One");
  const selection = controlled
    ? { value, onValueChange: setValue }
    : { defaultValue: "One" };
  return (
    <Overflow>
      <Tabs.Root {...selection}>
        <Tabs.List aria-label="Projects">
          {values.map((item) => (
            <Tabs.Trigger key={item} value={item} disabled={item === "Four"}>
              {item}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {values.map((item) => (
          <Tabs.Content key={item} value={item}>
            {item} content
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Overflow>
  );
}
it("passes unsupported content through and preserves native wrapper props", () => {
  render(
    <Overflow className="consumer" aria-label="Example">
      <button>Ordinary</button>
    </Overflow>,
  );
  expect(screen.getByRole("button", { name: "Ordinary" })).toBeVisible();
  expect(screen.getByLabelText("Example")).toHaveClass("consumer");
  expect(observers).toHaveLength(0);
});
it("keeps fitting collections unchanged, narrows and restores them", async () => {
  width = 900;
  render(<Example />);
  expect(
    screen.queryByRole("combobox", { name: "More items" }),
  ).not.toBeInTheDocument();
  await resize(250);
  expect(screen.getByRole("combobox", { name: "More items" })).toBeVisible();
  expect(screen.getByRole("tab", { name: "One" })).not.toHaveAttribute("inert");
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("inert");
  await resize(900);
  expect(
    screen.queryByRole("combobox", { name: "More items" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
    "inert",
  );
  expect(observers).toHaveLength(1);
});
it.each([false, true])(
  "selects through native Tabs activation, controlled=%s",
  async (controlled) => {
    const user = userEvent.setup();
    render(<Example controlled={controlled} />);

    expect(screen.getByRole("option", { name: "Four" })).toBeDisabled();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "More items" }),
      screen.getByRole("option", { name: "Three" }),
    );
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Three content");
    expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
      "inert",
    );
  },
);
it("reconciles membership and disconnects observers in StrictMode", async () => {
  const view = render(
    <StrictMode>
      <Example />
    </StrictMode>,
  );
  view.rerender(
    <StrictMode>
      <Example values={["One", "Two", "New"]} />
    </StrictMode>,
  );
  await waitFor(() =>
    expect(screen.getByRole("tab", { name: "New" })).toHaveAttribute("inert"),
  );
  await userEvent.click(screen.getByRole("combobox", { name: "More items" }));
  expect(screen.getByRole("option", { name: "New" })).toBeVisible();
  expect(
    screen.queryByRole("option", { name: "Three" }),
  ).not.toBeInTheDocument();
  view.unmount();
  expect(
    observers.every((observer) => observer.disconnect.mock.calls.length === 1),
  ).toBe(true);
});
it("preserves Tabs navigation and native picker focus on selection", async () => {
  const user = userEvent.setup();
  render(<Example />);
  const first = screen.getByRole("tab", { name: "One" });
  first.focus();
  fireEvent.keyDown(first, { key: "End" });
  expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  fireEvent.keyDown(document.activeElement ?? first, { key: "Home" });
  expect(first).toHaveFocus();
  const trigger = screen.getByRole("combobox", { name: "More items" });
  trigger.focus();
  await user.selectOptions(
    trigger,
    screen.getByRole("option", { name: "Three" }),
  );
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(trigger).toHaveFocus();
});

const fakeItems = (scope: HTMLElement) =>
  Array.from(scope.querySelectorAll<HTMLElement>("button[data-action]"));
function FakeCollection() {
  const enhance = useContext(OverflowCapabilityContext);
  const element = (
    <div data-actions="">
      <button id="fake-keep" data-action="" aria-current="true">
        Keep
      </button>
      <button id="fake-extra" data-action="">
        Extra
      </button>
      <button id="fake-last" data-action="">
        Last
      </button>
    </div>
  );
  return (
    enhance?.(element, {
      items: fakeItems,
      selected: "[aria-current=true]",
      label: "More actions",
    }) ?? element
  );
}

it("enhances a test-only capability without Tabs or type introspection", async () => {
  render(
    <Overflow>
      <div>
        <FakeCollection />
      </div>
    </Overflow>,
  );
  await userEvent.click(screen.getByRole("combobox", { name: "More actions" }));
  expect(
    within(screen.getByRole("combobox", { name: "More actions" })).getByRole(
      "option",
      { name: "Last" },
    ),
  ).toBeVisible();
});
it("isolates nested Overflow providers", () => {
  render(
    <Overflow>
      <Example />
      <FakeCollection />
    </Overflow>,
  );
  expect(screen.getByRole("combobox", { name: "More items" })).toBeVisible();
  expect(screen.getByRole("combobox", { name: "More actions" })).toBeVisible();
});
it("rejects ambiguous sibling collections", () => {
  expect(() =>
    render(
      <Overflow>
        <FakeCollection />
        <FakeCollection />
      </Overflow>,
    ),
  ).toThrow("Overflow supports one collection");
});
it("hydrates deterministic usable server markup without remounting Tabs", async () => {
  const html = renderToString(<Example />);
  expect(html).toContain("More items");
  expect(html).not.toContain("data-flux-overflowed");
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = html;
  const list = container.querySelector('[role="tablist"]');
  const error = vi.fn();
  const root = hydrateRoot(container, <Example />, {
    onRecoverableError: error,
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(container.querySelector('[role="tablist"]')).toBe(list);
  expect(error).not.toHaveBeenCalled();
  act(() => root.unmount());
  container.remove();
});

it("does not override controlled rejection or cancelled tab clicks", async () => {
  const change = vi.fn();
  render(
    <Overflow>
      <Tabs.Root value="One" onValueChange={change}>
        <Tabs.List>
          <Tabs.Trigger value="One">One</Tabs.Trigger>
          <Tabs.Trigger value="Two">Two</Tabs.Trigger>
          <Tabs.Trigger
            value="Cancelled"
            onClick={(event) => event.preventDefault()}
          >
            Cancelled
          </Tabs.Trigger>
          <Tabs.Trigger value="Rejected">Rejected</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="One">Original panel</Tabs.Content>
      </Tabs.Root>
    </Overflow>,
  );
  const picker = screen.getByRole("combobox", { name: "More items" });
  await userEvent.selectOptions(
    picker,
    screen.getByRole("option", { name: "Cancelled" }),
  );
  expect(change).not.toHaveBeenCalled();
  await userEvent.selectOptions(
    picker,
    screen.getByRole("option", { name: "Rejected" }),
  );
  expect(change).toHaveBeenCalledWith("Rejected");
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Original panel");
});
it("recovers focus when resizing hides the focused tab and when the picker disappears", async () => {
  width = 900;
  render(<Example />);
  screen.getByRole("tab", { name: "Three" }).focus();
  await resize(250);
  expect(screen.getByRole("combobox", { name: "More items" })).toHaveFocus();
  await resize(900);
  expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
});
it("keeps consumer-hidden and inert items out of the picker", async () => {
  render(
    <Overflow>
      <Tabs.Root defaultValue="One">
        <Tabs.List>
          <Tabs.Trigger value="One">One</Tabs.Trigger>
          <Tabs.Trigger value="Two">Two</Tabs.Trigger>
          <Tabs.Trigger value="Three">Three</Tabs.Trigger>
          <Tabs.Trigger value="Hidden" hidden>
            Hidden
          </Tabs.Trigger>
          <Tabs.Trigger value="Inert" inert>
            Inert
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </Overflow>,
  );
  expect(
    screen.queryByRole("option", { name: "Hidden" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("option", { name: "Inert" }),
  ).not.toBeInTheDocument();
  await resize(900);
  expect(screen.getByText("Hidden")).toHaveAttribute("hidden");
  expect(screen.getByText("Inert")).toHaveAttribute("inert");
});
it("keeps Tabs usable when ResizeObserver is unavailable", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  render(<Example />);
  expect(screen.getAllByRole("tab")).toHaveLength(4);
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
it("reconciles label mutations and intrinsic size changes", async () => {
  const view = render(<Example />);
  const third = screen.getByRole("tab", { name: "Three" });
  third.textContent = "Renamed";
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "Renamed" })).toBeInTheDocument(),
  );
  vi.spyOn(third, "getBoundingClientRect").mockReturnValue(
    DOMRect.fromRect({ width: 10, height: 40 }),
  );
  await resize(250);
  expect(third).not.toHaveAttribute("inert");
  view.unmount();
});

it("preserves vertical navigation and reveals externally selected tabs", async () => {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(80);
  function Vertical({ value }: { value: string }) {
    return (
      <Overflow>
        <Tabs.Root value={value} orientation="vertical">
          <Tabs.List>
            {["One", "Two", "Three"].map((item) => (
              <Tabs.Trigger key={item} value={item}>
                {item}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Overflow>
    );
  }
  const view = render(<Vertical value="One" />);
  const first = screen.getByRole("tab", { name: "One" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowDown" });
  expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("inert");
  view.rerender(<Vertical value="Three" />);
  await waitFor(() =>
    expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
      "inert",
    ),
  );
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(observers).toHaveLength(1);
});
it("updates native option identity when a tab value changes", async () => {
  const view = render(<Example />);
  const third = screen.getByRole("tab", { name: "Three" });
  third.id = "renamed-id";
  await waitFor(() =>
    expect(screen.getByRole("option", { name: "Three" })).toHaveValue(
      "renamed-id",
    ),
  );
  view.unmount();
});
