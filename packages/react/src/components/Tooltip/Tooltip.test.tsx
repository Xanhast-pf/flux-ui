import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip.js";
afterEach(() => vi.useRealTimers());
describe("Tooltip", () => {
  it("preserves refs and descriptions without adding a tab stop", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    render(
      <>
        <p id="existing">Existing help.</p>
        <Tooltip content="Additional help.">
          <button ref={ref} type="button" aria-describedby="existing">
            Save
          </button>
        </Tooltip>
        <button type="button">Next</button>
      </>,
    );
    await user.tab();
    const button = screen.getByRole("button", { name: "Save" });
    expect(ref.current).toBe(button);
    expect(button).toHaveAccessibleDescription(
      "Existing help. Additional help.",
    );
    expect(screen.getByRole("tooltip")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
  });
  it("supports controlled visibility without mutating owner state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const renderTooltip = (open: boolean) => (
      <Tooltip
        content="Controlled help."
        open={open}
        onOpenChange={onOpenChange}
      >
        <button type="button">Controlled</button>
      </Tooltip>
    );
    const { rerender } = render(renderTooltip(false));

    await user.tab();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    rerender(renderTooltip(true));
    expect(screen.getByRole("tooltip")).toBeVisible();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("tooltip")).toBeVisible();

    rerender(renderTooltip(false));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("can start open while keeping trigger-owned state", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Initially visible." defaultOpen>
        <button type="button">Help</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toBeVisible();
    await user.tab();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("delays pointer opening and remains hoverable until both targets are left", async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hover help." delay={300}>
        <button type="button">Help</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole("button"), {
      pointerType: "mouse",
    });
    await act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(() => vi.advanceTimersByTime(1));
    const tooltip = screen.getByRole("tooltip");
    fireEvent.pointerLeave(screen.getByRole("button"));
    fireEvent.pointerEnter(tooltip);
    await act(() => vi.advanceTimersByTime(500));
    expect(tooltip).toBeVisible();
    fireEvent.pointerLeave(tooltip);
    await act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
