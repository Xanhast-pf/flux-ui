import { createRef, StrictMode, useState, type ChangeEvent } from "react";
import { flushSync } from "react-dom";
import { renderToString } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field.js";
import { Inline } from "../Inline/Inline.js";
import { Checkbox } from "./Checkbox.js";

describe("Checkbox", () => {
  it("renders one native input with no wrapper or duplicate form control", () => {
    const { container } = render(<Checkbox aria-label="Updates" />);
    const input = screen.getByRole("checkbox", { name: "Updates" });
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(input);
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).not.toHaveAttribute("role");
    expect(input).not.toHaveAttribute("aria-checked");
  });

  it("toggles an uncontrolled value with its label and the Space key", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <label htmlFor="updates">Updates</label>
        <Checkbox id="updates" onChange={onChange} />
      </>,
    );
    const input = screen.getByRole("checkbox", { name: "Updates" });
    await user.click(screen.getByText("Updates"));
    expect(input).toBeChecked();
    expect(input).toHaveFocus();
    await user.keyboard(" ");
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("reports the native boolean after onChange, without hiding the event", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const onCheckedChange = vi.fn(
      (checked: boolean, event: ChangeEvent<HTMLInputElement>) => {
        order.push("checked");
        expect(event.currentTarget.checked).toBe(checked);
        expect(event.currentTarget.type).toBe("checkbox");
      },
    );
    render(
      <Checkbox
        aria-label="Updates"
        onChange={() => {
          order.push("native");
        }}
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(order).toEqual(["native", "checked"]);
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("does not call onCheckedChange when onChange prevents the default", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Updates"
        onChange={(event) => {
          event.preventDefault();
        }}
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("supports controlled checked state without internal state ownership", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox
        aria-label="Updates"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const input = screen.getByRole("checkbox");
    await user.click(input);
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
    expect(input).not.toBeChecked();
    rerender(
      <Checkbox
        aria-label="Updates"
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    expect(input).toBeChecked();
  });

  it("continues to support the native controlled onChange pattern", async () => {
    const user = userEvent.setup();
    function NativeControlled() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          aria-label="Updates"
          checked={checked}
          onChange={(event) => {
            setChecked(event.currentTarget.checked);
          }}
        />
      );
    }
    render(<NativeControlled />);
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("sets mixed state on the DOM property and keeps it separate from checked", () => {
    const { rerender } = render(
      <Checkbox aria-label="All channels" indeterminate />,
    );
    const input = screen.getByRole("checkbox");
    expect(input).toBePartiallyChecked();
    expect(input).not.toBeChecked();
    expect(input).not.toHaveAttribute("indeterminate");
    rerender(<Checkbox aria-label="All channels" indeterminate={false} />);
    expect(input).not.toBePartiallyChecked();
  });

  it("keeps a controlled mixed prop authoritative even without a parent render", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="All channels"
        indeterminate
        onCheckedChange={onCheckedChange}
      />,
    );
    const input = screen.getByRole("checkbox");
    await user.click(input);
    expect(input).toBePartiallyChecked();
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
    await user.click(input);
    expect(input).toBePartiallyChecked();
    expect(onCheckedChange.mock.calls[1]?.[0]).toBe(false);
  });

  it("lets a parent clear mixed presentation when selecting all", async () => {
    const user = userEvent.setup();
    function SelectAll() {
      const [checked, setChecked] = useState(false);
      const [mixed, setMixed] = useState(true);
      return (
        <Checkbox
          aria-label="All channels"
          checked={checked}
          indeterminate={mixed}
          onCheckedChange={(next) => {
            setChecked(next);
            setMixed(false);
          }}
        />
      );
    }
    render(<SelectAll />);
    const input = screen.getByRole("checkbox");
    expect(input).toBePartiallyChecked();
    await user.click(input);
    expect(input).toBeChecked();
    expect(input).not.toBePartiallyChecked();
  });

  it("does not overwrite a consumer's synchronous mixed-state update", async () => {
    const user = userEvent.setup();
    function SynchronousUpdate() {
      const [mixed, setMixed] = useState(true);
      return (
        <Checkbox
          aria-label="All channels"
          indeterminate={mixed}
          onChange={() => {
            flushSync(() => {
              setMixed(false);
            });
          }}
        />
      );
    }
    render(<SynchronousUpdate />);
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBePartiallyChecked();
  });

  it("forwards and clears native object refs", () => {
    const ref = createRef<HTMLInputElement>();
    const { unmount } = render(<Checkbox aria-label="Updates" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("checkbox"));
    unmount();
    expect(ref.current).toBeNull();
  });

  it("does not detach callback refs during unrelated renders", () => {
    const ref = vi.fn<(node: HTMLInputElement | null) => void>();
    const { rerender, unmount } = render(
      <Checkbox aria-label="Updates" ref={ref} />,
    );
    const input = screen.getByRole("checkbox");
    rerender(
      <Checkbox aria-label="Updated label" className="custom" ref={ref} />,
    );
    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenLastCalledWith(input);
    unmount();
    expect(ref).toHaveBeenLastCalledWith(null);
  });

  it("honors React 19 callback-ref cleanup when mixed state changes", () => {
    const cleanup = vi.fn();
    const ref = vi.fn((_node: HTMLInputElement | null) => cleanup);
    const { rerender, unmount } = render(
      <Checkbox aria-label="Updates" ref={ref} />,
    );
    rerender(<Checkbox aria-label="Updates" indeterminate ref={ref} />);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(ref).not.toHaveBeenCalledWith(null);
  });

  it("cleans the old ref when a consumer replaces it", () => {
    const first = createRef<HTMLInputElement>();
    const second = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox aria-label="Updates" ref={first} />);
    rerender(<Checkbox aria-label="Updates" ref={second} />);
    expect(first.current).toBeNull();
    expect(second.current).toBe(screen.getByRole("checkbox"));
  });

  it("balances callback-ref setup and cleanup under StrictMode", () => {
    const cleanup = vi.fn();
    const ref = vi.fn((_node: HTMLInputElement | null) => cleanup);
    const { unmount } = render(
      <StrictMode>
        <Checkbox aria-label="Updates" ref={ref} indeterminate />
      </StrictMode>,
    );
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(ref.mock.calls.length);
    expect(ref).not.toHaveBeenCalledWith(null);
  });

  it("preserves native submission rules, including checked mixed inputs", () => {
    render(
      <form aria-label="Preferences">
        <Checkbox
          aria-label="Selected"
          defaultChecked
          name="selected"
          value="yes"
        />
        <Checkbox aria-label="Unselected" name="unselected" />
        <Checkbox
          aria-label="Disabled"
          defaultChecked
          disabled
          name="disabled"
        />
        <Checkbox
          aria-label="Mixed unselected"
          indeterminate
          name="mixed-unselected"
        />
        <Checkbox
          aria-label="Mixed selected"
          defaultChecked
          indeterminate
          name="mixed-selected"
        />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    });
    expect([...new FormData(form).entries()]).toEqual([
      ["selected", "yes"],
      ["mixed-selected", "on"],
    ]);
  });

  it("preserves native external form association and reset", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <form aria-label="Preferences" id="preferences-form">
          <button type="reset">Reset</button>
        </form>
        <Checkbox
          aria-label="Updates"
          defaultChecked
          form="preferences-form"
          name="updates"
          value="yes"
          onCheckedChange={onCheckedChange}
        />
      </>,
    );
    const input = screen.getByRole("checkbox");
    const form = screen.getByRole<HTMLFormElement>("form");
    await user.click(input);
    expect(new FormData(form).has("updates")).toBe(false);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toBeChecked();
    expect(new FormData(form).get("updates")).toBe("yes");
    // Native form reset is not a user change event.
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it("does not manufacture updates when native form reset is canceled", async () => {
    const user = userEvent.setup();
    render(
      <form
        onReset={(event) => {
          event.preventDefault();
        }}
      >
        <Checkbox aria-label="Updates" defaultChecked />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole("checkbox");
    await user.click(input);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).not.toBeChecked();
  });

  it("does not activate when disabled, including an inherited fieldset state", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <fieldset disabled>
        <legend>Unavailable preferences</legend>
        <Checkbox aria-label="Updates" onCheckedChange={onCheckedChange} />
      </fieldset>,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("preserves native required constraint validation", () => {
    render(<Checkbox aria-label="Accept terms" required />);
    const input = screen.getByRole<HTMLInputElement>("checkbox");
    expect(input.checkValidity()).toBe(false);
    fireEvent.click(input);
    expect(input.checkValidity()).toBe(true);
  });

  it("composes with Field through a layout without Checkbox-specific glue", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <p id="external-help">Your choice is stored securely.</p>
        <Field.Root controlId="accept-terms" invalid required>
          <Inline>
            <Field.Control>
              <Checkbox ref={ref} aria-describedby="external-help" />
            </Field.Control>
            <Field.Label>Accept terms</Field.Label>
          </Inline>
          <Field.Description>Required to join.</Field.Description>
          <Field.Error>Please accept the terms.</Field.Error>
        </Field.Root>
      </>,
    );
    const input = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "accept-terms");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "external-help accept-terms-description accept-terms-error",
    );
    await user.click(screen.getByText("Accept terms"));
    expect(input).toBeChecked();
  });

  it("accepts consumer classes, inline styles, data and native attributes", () => {
    render(
      <Checkbox
        aria-label="Updates"
        className="custom"
        data-project="flux"
        name="updates"
        style={{ margin: "0.25rem" }}
        value="subscribed"
      />,
    );
    const input = screen.getByRole("checkbox");
    expect(input).toHaveClass("custom");
    expect(input.style.margin).toBe("0.25rem");
    expect(input).toHaveAttribute("data-project", "flux");
    expect(input).toHaveAttribute("name", "updates");
    expect(input).toHaveAttribute("value", "subscribed");
  });

  it("renders server markup without accessing the DOM or leaking custom props", () => {
    const markup = renderToString(
      <Checkbox aria-label="Updates" defaultChecked indeterminate />,
    );
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('checked=""');
    expect(markup).not.toContain("indeterminate=");
    expect(markup).not.toContain("onCheckedChange");
  });
});
