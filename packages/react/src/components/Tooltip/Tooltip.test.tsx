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
