import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, onTestFinished, vi } from "vitest";
import { ScrollArea } from "./ScrollArea.js";
describe("ScrollArea", () => {
  it("only inserts genuinely overflowing content into the default tab order", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea aria-label="Results" axis="horizontal" ref={ref}>
        Contents
      </ScrollArea>,
    );
    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toBe(ref.current);
    expect(region).toHaveAttribute("tabindex", "-1");
    Object.defineProperties(region, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "0");
    Object.defineProperty(region, "scrollWidth", {
      configurable: true,
      value: 100,
    });
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "-1");
  });
  it("ignores overflow on a disabled axis and preserves explicit tab order", () => {
    const { rerender } = render(
      <ScrollArea aria-label="Results" axis="vertical">
        Contents
      </ScrollArea>,
    );
    const region = screen.getByRole("region");
    Object.defineProperties(region, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "-1");
    rerender(
      <ScrollArea aria-label="Results" axis="horizontal" tabIndex={-1}>
        Contents
      </ScrollArea>,
    );
    expect(region).toHaveAttribute("tabindex", "-1");
  });
  it("runs React 19 callback-ref cleanup exactly once on unmount", () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <ScrollArea aria-label="Results" ref={ref}>
        Contents
      </ScrollArea>,
    );
    expect(ref).toHaveBeenCalledOnce();
    unmount();
    expect(cleanup).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    remove.mockRestore();
  });
});

describe("ScrollArea observation hardening", () => {
  it("does not install automatic observation for an explicit tabIndex", () => {
    const add = vi.spyOn(window, "addEventListener");
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const cleanup = vi.fn();
    const view = render(
      <ScrollArea aria-label="Explicit region" tabIndex={0} ref={() => cleanup}>
        Content
      </ScrollArea>,
    );
    expect(add.mock.calls.filter(([type]) => type === "resize")).toHaveLength(
      0,
    );
    expect(observe).not.toHaveBeenCalled();
    view.unmount();
    expect(cleanup).toHaveBeenCalledOnce();
    observe.mockRestore();
    add.mockRestore();
  });
  it("can transition between explicit and automatically measured tab order", () => {
    const view = render(
      <ScrollArea aria-label="Dynamic region" tabIndex={0}>
        Content
      </ScrollArea>,
    );
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("tabindex", "0");
    view.rerender(<ScrollArea aria-label="Dynamic region">Content</ScrollArea>);
    expect(region).toHaveAttribute("tabindex", "-1");
    view.rerender(
      <ScrollArea aria-label="Dynamic region" tabIndex={-1}>
        Content
      </ScrollArea>,
    );
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "-1");
  });
});

describe("ScrollArea incremental observation", () => {
  it("uses the owning realm and observes only changed direct element children", async () => {
    const frame = document.createElement("iframe");
    document.body.appendChild(frame);
    const documentInFrame = frame.contentDocument;
    const realm = documentInFrame?.defaultView;
    if (!documentInFrame || !realm) throw new Error("Missing frame realm");
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    Object.defineProperty(realm, "ResizeObserver", {
      configurable: true,
      value: class {
        observe = observe;
        unobserve = unobserve;
        disconnect = disconnect;
      },
    });
    const add = vi.spyOn(realm, "addEventListener");
    const remove = vi.spyOn(realm, "removeEventListener");
    const container = documentInFrame.createElement("div");
    documentInFrame.body.appendChild(container);
    const view = render(
      <ScrollArea aria-label="Frame results">
        <span>Original</span>
      </ScrollArea>,
      { container },
    );
    onTestFinished(() => {
      view.unmount();
      add.mockRestore();
      remove.mockRestore();
      frame.remove();
    });
    const region = within(container).getByRole("region");
    const original = within(region).getByText("Original");
    expect(observe.mock.calls).toEqual([[region], [original]]);
    expect(add).toHaveBeenCalledWith("resize", expect.any(Function));
    observe.mockClear();
    const added = documentInFrame.createElement("span");
    await act(async () => {
      original.remove();
      region.append(documentInFrame.createTextNode("Text"), added);
      await Promise.resolve();
    });
    expect(unobserve.mock.calls).toEqual([[original]]);
    expect(observe.mock.calls).toEqual([[added]]);
    observe.mockClear();
    unobserve.mockClear();
    const writeTabIndex = vi.spyOn(region, "tabIndex", "set");
    await act(async () => {
      added.append(documentInFrame.createElement("b"));
      added.textContent = "Nested text";
      await Promise.resolve();
    });
    expect(observe).not.toHaveBeenCalled();
    expect(unobserve).not.toHaveBeenCalled();
    expect(disconnect).not.toHaveBeenCalled();
    expect(writeTabIndex).not.toHaveBeenCalled();
    Object.defineProperties(region, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });
    // Both root and descendant attributes must trigger measurement, without
    // treating their empty added/removed node lists as child changes.
    for (const target of [region, added]) {
      for (const attribute of ["class", "style", "hidden", "inert", "open"]) {
        await act(async () => {
          target.setAttribute(attribute, "");
          await Promise.resolve();
        });
        expect(region).toHaveAttribute("tabindex", "0");
        Object.defineProperty(region, "scrollWidth", {
          configurable: true,
          value: 100,
        });
        await act(async () => {
          target.removeAttribute(attribute);
          await Promise.resolve();
        });
        expect(region).toHaveAttribute("tabindex", "-1");
        Object.defineProperty(region, "scrollWidth", {
          configurable: true,
          value: 200,
        });
      }
    }
    expect(observe).not.toHaveBeenCalled();
    expect(unobserve).not.toHaveBeenCalled();
    expect(disconnect).not.toHaveBeenCalled();
    expect(writeTabIndex).toHaveBeenCalledTimes(20);
    view.unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    writeTabIndex.mockRestore();
  });

  it("stops measuring once overflow is established, but still checks vertical overflow when needed", () => {
    render(<ScrollArea aria-label="Both axes">Content</ScrollArea>);
    const region = screen.getByRole("region");
    const height = vi.fn(() => 200);
    Object.defineProperties(region, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, get: height },
    });
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "0");
    expect(height).not.toHaveBeenCalled();
    Object.defineProperty(region, "scrollWidth", {
      configurable: true,
      value: 100,
    });
    fireEvent(window, new Event("resize"));
    expect(region).toHaveAttribute("tabindex", "0");
    expect(height).toHaveBeenCalledOnce();
  });
});
