import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field.js";
import { Switch } from "./Switch.js";
function Controlled() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      aria-label="Alerts"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
describe("Switch", () => {
  it("is a native checkbox with a stable switch name and keyboard behavior", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Alerts" />);
    const control = screen.getByRole("switch", { name: "Alerts" });
    expect(control).toHaveAttribute("type", "checkbox");
    control.focus();
    await user.keyboard(" ");
    expect(control).toBeChecked();
    expect(control).not.toHaveAttribute("aria-checked");
  });
  it("supports controlled state", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toBeChecked();
  });
  it("preserves native form data and reset", () => {
    render(
      <form aria-label="Preferences">
        <Switch aria-label="Alerts" name="alerts" value="yes" defaultChecked />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(new FormData(form).get("alerts")).toBe("yes");
    fireEvent.click(screen.getByRole("switch"));
    expect(new FormData(form).has("alerts")).toBe(false);
    form.reset();
    expect(screen.getByRole("switch")).toBeChecked();
  });
  it("calls the native handler first and honors cancellation", async () => {
    const callback = vi.fn();
    const user = userEvent.setup();
    render(
      <Switch
        aria-label="Alerts"
        onChange={(event) => {
          event.preventDefault();
        }}
        onCheckedChange={callback}
      />,
    );
    await user.click(screen.getByRole("switch"));
    expect(callback).not.toHaveBeenCalled();
  });
  it("passes the next value and native event", async () => {
    const callback = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Alerts" onCheckedChange={callback} />);
    await user.click(screen.getByRole("switch"));
    expect(callback).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ type: "change" }),
    );
  });
  it("composes with Field labels, required, disabled and descriptions", () => {
    render(
      <Field.Root disabled required>
        <Field.Label>Alerts</Field.Label>
        <Field.Control>
          <Switch />
        </Field.Control>
        <Field.Description>Local notifications</Field.Description>
      </Field.Root>,
    );
    const control = screen.getByRole("switch", { name: /Alerts/ });
    expect(control).toBeDisabled();
    expect(control).toBeRequired();
    expect(control).toHaveAccessibleDescription("Local notifications");
  });
  it("preserves refs and consumer styling without a wrapper", () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Switch
        ref={ref}
        aria-label="Alerts"
        className="custom"
        style={{ margin: "0.25rem" }}
        data-project="flux"
      />,
    );
    expect(container.children).toHaveLength(1);
    expect(ref.current).toBe(screen.getByRole("switch"));
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("data-project", "flux");
  });
  it("renders checked server markup without leaking its callback prop", () => {
    const markup = renderToString(
      <Switch aria-label="Alerts" defaultChecked onCheckedChange={() => {}} />,
    );
    expect(markup).toContain('role="switch"');
    expect(markup).toContain('checked=""');
    expect(markup).not.toContain("onCheckedChange");
  });
});
