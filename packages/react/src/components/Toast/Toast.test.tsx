import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast, useToast } from "./Toast.js";
import type { ToastOptions } from "./Toast.types.js";
afterEach(() => vi.useRealTimers());
function Producer() {
  const sequence = useRef(0);
  const { notify } = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        sequence.current += 1;
        notify({ title: `Notice ${sequence.current}` });
      }}
    >
      Notify
    </button>
  );
}
describe("Toast", () => {
  it("accepts optional application values without conditional spreads", () => {
    const description: string | undefined = undefined;
    const tone: "neutral" | "success" | "danger" | undefined = undefined;
    const duration: number | undefined = undefined;
    const action: ToastOptions["action"] = undefined;
    const maxVisible: number | undefined = undefined;
    const dismissLabel: string | undefined = undefined;
    const placement: "fixed" | "inline" | undefined = undefined;
    const options: ToastOptions = {
      title: "Optional notice",
      description,
      tone,
      duration,
      action,
    };

    render(
      <Toast.Provider
        duration={duration}
        maxVisible={maxVisible}
        dismissLabel={dismissLabel}
      >
        <Toast.Viewport placement={placement} />
      </Toast.Provider>,
    );

    expect(options.title).toBe("Optional notice");
  });

  it("starts queued timers only after the notice becomes visible", async () => {
    vi.useFakeTimers();
    render(
      <Toast.Provider duration={1000} maxVisible={1}>
        <Producer />
        <Toast.Viewport placement="inline" />
      </Toast.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("status")).toHaveTextContent("Notice 1");
    expect(screen.queryByText("Notice 2")).not.toBeInTheDocument();
    await act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole("status")).toHaveTextContent("Notice 2");
    await act(() => vi.advanceTimersByTime(999));
    expect(screen.getByRole("status")).toHaveTextContent("Notice 2");
    await act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("pauses while an action is focused, then uses the remaining duration", async () => {
    vi.useFakeTimers();
    render(
      <Toast.Provider duration={1000}>
        <Producer />
        <Toast.Viewport placement="inline" />
      </Toast.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    await act(() => vi.advanceTimersByTime(400));
    act(() => {
      screen.getByRole("button", { name: "Dismiss notification" }).focus();
    });
    await act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("status")).toBeVisible();
    act(() => {
      screen.getByRole("button", { name: "Notify" }).focus();
    });
    await act(() => vi.advanceTimersByTime(599));
    expect(screen.getByRole("status")).toBeVisible();
    await act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("keeps zero-duration notices until explicitly dismissed", async () => {
    vi.useFakeTimers();
    render(
      <Toast.Provider duration={0}>
        <Producer />
        <Toast.Viewport placement="inline" />
      </Toast.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    await act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("status")).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
