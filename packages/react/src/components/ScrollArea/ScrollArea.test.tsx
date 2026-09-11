import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
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
