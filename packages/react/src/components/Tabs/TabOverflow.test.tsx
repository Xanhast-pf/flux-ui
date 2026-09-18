import { StrictMode, useState } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs.js";

let width = 300;
const observers: {
  callback: ResizeObserverCallback;
  instance: ResizeObserver;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];
beforeEach(() => {
  width = 300;
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
          instance: this,
          disconnect: this.disconnect,
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
        width: this.getAttribute("aria-label") === "More tabs" ? 40 : 100,
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
  wrap = false,
  vertical = false,
}: {
  values?: string[];
  controlled?: boolean;
  wrap?: boolean;
  vertical?: boolean;
}) {
  const [value, setValue] = useState("One");
  const selection = controlled
    ? { value, onValueChange: setValue }
    : { defaultValue: "One" };
  return (
    <Tabs.Root
      {...selection}
      orientation={vertical ? "vertical" : "horizontal"}
    >
      <Tabs.List aria-label="Projects" wrap={wrap}>
        {values.map((item) => (
          <Tabs.Tab key={item} value={item} disabled={item === "Four"}>
            {item}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {values.map((item) => (
        <Tabs.Panel key={item} value={item}>
          {item} content
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
it("fits, narrows and restores using one observer and an external trigger", async () => {
  width = 900;
  render(<Example />);
  expect(
    screen.queryByRole("button", { name: "More tabs" }),
  ).not.toBeInTheDocument();
  await resize(300);
  const list = screen.getByRole("tablist");
  const trigger = screen.getByRole("button", { name: "More tabs" });
  expect(list).not.toContainElement(trigger);
  expect(list).toHaveAttribute("data-flux-tabs-managed");
  expect(screen.getByRole("tab", { name: "One" })).not.toHaveAttribute("inert");
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("inert");
  await resize(900);
  expect(trigger).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
    "inert",
  );
  expect(observers).toHaveLength(1);
});
it.each([false, true])(
  "activates originals and focuses the selected visible tab, controlled=%s",
  async (controlled) => {
    render(<Example controlled={controlled} />);
    await userEvent.click(screen.getByRole("button", { name: "More tabs" }));
    expect(screen.getByRole("menuitem", { name: "Four" })).toBeDisabled();
    await userEvent.click(screen.getByRole("menuitem", { name: "Three" }));
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: "Three" })).toHaveFocus(),
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Three content");
    expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
      "inert",
    );
  },
);
it("preserves cancellation and controlled rejection", async () => {
  const change = vi.fn();
  const click = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  render(
    <Tabs.Root value="One" onValueChange={change}>
      <Tabs.List>
        <Tabs.Tab value="One">One</Tabs.Tab>
        <Tabs.Tab value="Two">Two</Tabs.Tab>
        <Tabs.Tab value="Cancel" onClick={click}>
          Cancel
        </Tabs.Tab>
        <Tabs.Tab value="Reject">Reject</Tabs.Tab>
      </Tabs.List>
    </Tabs.Root>,
  );
  await userEvent.click(screen.getByRole("button", { name: "More tabs" }));
  await userEvent.click(screen.getByRole("menuitem", { name: "Cancel" }));
  expect(click).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "More tabs" }));
  await userEvent.click(screen.getByRole("menuitem", { name: "Reject" }));
  expect(change).toHaveBeenCalledExactlyOnceWith("Reject");
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await waitFor(() =>
    expect(screen.getByRole("tab", { name: "Reject" })).toHaveAttribute(
      "inert",
    ),
  );
});
it("preserves visible roving navigation and recovers resize focus", async () => {
  width = 900;
  render(<Example />);
  screen.getByRole("tab", { name: "Three" }).focus();
  await resize(300);
  expect(screen.getByRole("button", { name: "More tabs" })).toHaveFocus();
  await resize(900);
  expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  await resize(300);
  fireEvent.keyDown(screen.getByRole("tab", { name: "One" }), { key: "End" });
  expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
});
it("reconciles membership, labels and intrinsic sizes and cleans up StrictMode observers", async () => {
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
  await userEvent.click(screen.getByRole("button", { name: "More tabs" }));
  await waitFor(() =>
    expect(screen.getByRole("menuitem", { name: "New" })).toBeInTheDocument(),
  );
  const third = screen.getByRole("tab", { name: "New" });
  third.setAttribute("aria-label", "Renamed");
  await waitFor(() =>
    expect(
      screen.getByRole("menuitem", { name: "Renamed" }),
    ).toBeInTheDocument(),
  );
  vi.spyOn(third, "getBoundingClientRect").mockReturnValue(
    DOMRect.fromRect({ width: 10, height: 40 }),
  );
  await resize(300);
  expect(third).not.toHaveAttribute("inert");
  view.unmount();
  expect(
    observers.every((observer) => observer.disconnect.mock.calls.length === 1),
  ).toBe(true);
});
it("preserves consumer hidden/inert/marker ownership and accessible-label precedence", async () => {
  render(
    <>
      <span id="external-name">External label</span>
      <Tabs.Root defaultValue="One">
        <Tabs.List>
          <Tabs.Tab value="One">One</Tabs.Tab>
          <Tabs.Tab value="Two">Two</Tabs.Tab>
          <Tabs.Tab
            value="Three"
            aria-labelledby="external-name"
            aria-label="Ignored"
          >
            Three
          </Tabs.Tab>
          <div hidden>
            <Tabs.Tab value="Hidden">Hidden</Tabs.Tab>
          </div>
          <div inert>
            <Tabs.Tab value="Inert">Inert</Tabs.Tab>
          </div>
          <Tabs.Tab value="Owned" inert data-flux-tab-overflowed="consumer">
            Owned
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </>,
  );
  await userEvent.click(screen.getByRole("button", { name: "More tabs" }));
  expect(screen.getAllByRole("menuitem")).toHaveLength(1);
  expect(
    screen.getByRole("menuitem", { name: "External label" }),
  ).toBeVisible();
  await resize(900);
  expect(screen.getByText("Owned")).toHaveAttribute(
    "data-flux-tab-overflowed",
    "consumer",
  );
  expect(screen.getByText("Owned")).toHaveAttribute("inert");
  expect(screen.getByText("Hidden").parentElement).toHaveAttribute("hidden");
  expect(screen.getByText("Inert").parentElement).toHaveAttribute("inert");
});
it.each([{ wrap: true }, { vertical: true }])(
  "does not enhance explicit layout %j",
  (props) => {
    render(<Example {...props} />);
    expect(observers).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "More tabs" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
  },
);
it("leaves all tabs available without ResizeObserver", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  render(<Example />);
  expect(screen.getAllByRole("tab")).toHaveLength(4);
  expect(screen.getByRole("tablist")).not.toHaveAttribute(
    "data-flux-tabs-managed",
  );
  expect(
    screen.queryByRole("button", { name: "More tabs" }),
  ).not.toBeInTheDocument();
});
it("hydrates ordinary tabs without replacement or recoverable errors", async () => {
  const html = renderToString(<Example />);
  expect(html).not.toContain("data-flux-tab-overflowed");
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  const list = container.querySelector('[role="tablist"]');
  const error = vi.fn();
  const root = hydrateRoot(container, <Example />, {
    onRecoverableError: error,
  });
  await act(async () => {});
  expect(container.querySelector('[role="tablist"]')).toBe(list);
  expect(error).not.toHaveBeenCalled();
  act(() => root.unmount());
  container.remove();
});

it("reveals externally selected hidden tabs without another observer", () => {
  function Controlled({ value }: { value: string }) {
    return (
      <Tabs.Root value={value}>
        <Tabs.List>
          {["One", "Two", "Three"].map((item) => (
            <Tabs.Tab key={item} value={item}>
              {item}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.Root>
    );
  }
  const view = render(<Controlled value="One" />);
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("inert");
  view.rerender(<Controlled value="Three" />);
  expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
    "inert",
  );
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute(
    "tabindex",
    "0",
  );
  expect(observers).toHaveLength(1);
});

it("accounts for actual gaps and preserves the selected tab at tiny widths", async () => {
  render(
    <Tabs.Root defaultValue="Three">
      <Tabs.List style={{ columnGap: "20px", padding: 0, border: 0 }}>
        {["One", "Two", "Three", "Four"].map((item) => (
          <Tabs.Tab key={item} value={item}>
            {item}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.Root>,
  );
  await resize(250);
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("inert");
  expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
    "inert",
  );
  await resize(60);
  expect(screen.getByRole("tab", { name: "Three" })).not.toHaveAttribute(
    "inert",
  );
  expect(screen.getByRole("button", { name: "More tabs" })).toBeInTheDocument();
});

it("waits for usable geometry and avoids repeated ownership writes", async () => {
  width = 0;
  render(<Example />);
  expect(screen.getByRole("tablist")).not.toHaveAttribute(
    "data-flux-tabs-managed",
  );
  await resize(300);
  const third = screen.getByRole("tab", { name: "Three" });
  const set = vi.spyOn(third, "setAttribute");
  const remove = vi.spyOn(third, "removeAttribute");
  await resize(300);
  expect(
    set.mock.calls.filter(
      ([name]) => name === "inert" || name === "data-flux-tab-overflowed",
    ),
  ).toHaveLength(0);
  expect(remove).not.toHaveBeenCalled();
});
