import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./Toggle.js";
function Controlled() {
  const [pressed, setPressed] = useState(false);
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed}>
      Pin
    </Toggle>
  );
}
describe("Toggle", () => {
  it("toggles natively with Space and Enter while its name stays constant", async () => {
    const user = userEvent.setup();
    render(<Toggle>Pin</Toggle>);
    const button = screen.getByRole("button", { name: "Pin" });
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAccessibleName("Pin");
  });
  it("supports controlled updates and defaultPressed", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Controlled />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    unmount();
    render(<Toggle defaultPressed>Pin</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
  it("does not mutate a controlled value the consumer declined", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={change}>
        Pin
      </Toggle>,
    );
    await user.click(screen.getByRole("button"));
    expect(change).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
  it("runs the consumer click first and respects cancellation", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Toggle
        onClick={(event) => {
          event.preventDefault();
        }}
        onPressedChange={change}
      >
        Pin
      </Toggle>,
    );
    await user.click(screen.getByRole("button"));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
  it("does not toggle disabled controls", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Toggle disabled onPressedChange={change}>
        Pin
      </Toggle>,
    );
    await user.click(screen.getByRole("button"));
    expect(change).not.toHaveBeenCalled();
  });
  it("preserves refs and native attributes without leaking state props", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Toggle
        ref={ref}
        className="custom"
        style={{ margin: "0.25rem" }}
        data-project="flux"
      >
        Pin
      </Toggle>,
    );
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current).toHaveAttribute("type", "button");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveClass("custom");
    const markup = renderToString(<Toggle defaultPressed>Pin</Toggle>);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).not.toContain("defaultPressed=");
  });
});
