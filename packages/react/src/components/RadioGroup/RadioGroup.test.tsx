import { createRef, useState, type ChangeEvent } from "react";
import { renderToString } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field.js";
import { Inline } from "../Inline/Inline.js";
import { RadioGroup } from "./RadioGroup.js";
import type { RadioGroupValue } from "./RadioGroup.types.js";

function BasicGroup({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string | undefined;
  onValueChange?:
    ((value: string, event: ChangeEvent<HTMLInputElement>) => void) | undefined;
}) {
  return (
    <RadioGroup.Root
      defaultValue={defaultValue}
      name="channel"
      onValueChange={onValueChange}
    >
      <RadioGroup.Legend>Release channel</RadioGroup.Legend>
      <label htmlFor="channel-stable">
        <RadioGroup.Item id="channel-stable" value="stable" /> Stable
      </label>
      <label htmlFor="channel-beta">
        <RadioGroup.Item id="channel-beta" value="beta" /> Beta
      </label>
      <label htmlFor="channel-canary">
        <RadioGroup.Item id="channel-canary" value="canary" /> Canary
      </label>
    </RadioGroup.Root>
  );
}

describe("RadioGroup", () => {
  it("renders a native fieldset, legend, and same-name radio inputs", () => {
    render(<BasicGroup defaultValue="stable" />);
    const group = screen.getByRole("group", { name: "Release channel" });
    const radios = screen.getAllByRole<HTMLInputElement>("radio");

    expect(group.tagName).toBe("FIELDSET");
    expect(group.querySelector("legend")?.textContent).toBe("Release channel");
    expect(radios).toHaveLength(3);
    expect(radios.every((radio) => radio.type === "radio")).toBe(true);
    expect(new Set(radios.map((radio) => radio.name))).toEqual(
      new Set(["channel"]),
    );
    expect(screen.getByRole("radio", { name: "Stable" })).toBeChecked();
  });

  it("preserves native uncontrolled selection and label activation", async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="stable" />);
    const stable = screen.getByRole("radio", { name: "Stable" });
    const beta = screen.getByRole("radio", { name: "Beta" });

    await user.click(screen.getByText("Beta"));
    expect(beta).toBeChecked();
    expect(stable).not.toBeChecked();
    expect(beta).toHaveFocus();
  });

  it("reports the selected value after the item's native onChange", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const onValueChange = vi.fn(
      (value: string, event: ChangeEvent<HTMLInputElement>) => {
        order.push("group");
        expect(value).toBe("beta");
        expect(event.currentTarget.checked).toBe(true);
      },
    );
    render(
      <RadioGroup.Root name="channel" onValueChange={onValueChange}>
        <RadioGroup.Legend>Channel</RadioGroup.Legend>
        <RadioGroup.Item aria-label="Stable" value="stable" />
        <RadioGroup.Item
          aria-label="Beta"
          onChange={() => {
            order.push("item");
          }}
          value="beta"
        />
      </RadioGroup.Root>,
    );

    await user.click(screen.getByRole("radio", { name: "Beta" }));
    expect(order).toEqual(["item", "group"]);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("does not report a value when the item's onChange prevents default", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup.Root name="channel" onValueChange={onValueChange}>
        <RadioGroup.Legend>Channel</RadioGroup.Legend>
        <RadioGroup.Item
          aria-label="Stable"
          onChange={(event) => {
            event.preventDefault();
          }}
          value="stable"
        />
      </RadioGroup.Root>,
    );

    await user.click(screen.getByRole("radio"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports controlled selection without owning application state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <RadioGroup.Root
        name="channel"
        onValueChange={onValueChange}
        value="stable"
      >
        <RadioGroup.Legend>Channel</RadioGroup.Legend>
        <RadioGroup.Item aria-label="Stable" value="stable" />
        <RadioGroup.Item aria-label="Beta" value="beta" />
      </RadioGroup.Root>,
    );
    const stable = screen.getByRole("radio", { name: "Stable" });
    const beta = screen.getByRole("radio", { name: "Beta" });

    await user.click(beta);
    expect(onValueChange.mock.calls[0]?.[0]).toBe("beta");
    expect(stable).toBeChecked();
    expect(beta).not.toBeChecked();

    rerender(
      <RadioGroup.Root
        name="channel"
        onValueChange={onValueChange}
        value="beta"
      >
        <RadioGroup.Legend>Channel</RadioGroup.Legend>
        <RadioGroup.Item aria-label="Stable" value="stable" />
        <RadioGroup.Item aria-label="Beta" value="beta" />
      </RadioGroup.Root>,
    );
    expect(stable).not.toBeChecked();
    expect(beta).toBeChecked();
  });

  it("supports a controlled group with no selection", () => {
    render(
      <RadioGroup.Root name="channel" onValueChange={() => {}} value={null}>
        <RadioGroup.Legend>Channel</RadioGroup.Legend>
        <RadioGroup.Item aria-label="Stable" value="stable" />
        <RadioGroup.Item aria-label="Beta" value="beta" />
      </RadioGroup.Root>,
    );
    expect(screen.getByRole("radio", { name: "Stable" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Beta" })).not.toBeChecked();
  });

  it("supports the common controlled value/onValueChange pattern", async () => {
    const user = userEvent.setup();
    function ControlledGroup() {
      const [value, setValue] = useState<RadioGroupValue>("stable");
      return (
        <RadioGroup.Root name="channel" value={value} onValueChange={setValue}>
          <RadioGroup.Legend>Channel</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Stable" value="stable" />
          <RadioGroup.Item aria-label="Beta" value="beta" />
        </RadioGroup.Root>
      );
    }

    render(<ControlledGroup />);
    await user.click(screen.getByRole("radio", { name: "Beta" }));
    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
  });

  it("generates a stable group name when the consumer omits one", () => {
    render(
      <>
        <RadioGroup.Root>
          <RadioGroup.Legend>First</RadioGroup.Legend>
          <RadioGroup.Item aria-label="First A" value="a" />
          <RadioGroup.Item aria-label="First B" value="b" />
        </RadioGroup.Root>
        <RadioGroup.Root>
          <RadioGroup.Legend>Second</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Second A" value="a" />
          <RadioGroup.Item aria-label="Second B" value="b" />
        </RadioGroup.Root>
      </>,
    );
    const firstName = screen.getByRole<HTMLInputElement>("radio", {
      name: "First A",
    }).name;
    const secondName = screen.getByRole<HTMLInputElement>("radio", {
      name: "Second A",
    }).name;

    expect(firstName).not.toBe("");
    expect(
      screen.getByRole<HTMLInputElement>("radio", { name: "First B" }).name,
    ).toBe(firstName);
    expect(secondName).not.toBe(firstName);
  });

  it("preserves native required group validation", () => {
    render(
      <form>
        <RadioGroup.Root name="channel" required>
          <RadioGroup.Legend>Channel</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Stable" value="stable" />
          <RadioGroup.Item aria-label="Beta" value="beta" />
        </RadioGroup.Root>
      </form>,
    );
    const stable = screen.getByRole<HTMLInputElement>("radio", {
      name: "Stable",
    });
    const beta = screen.getByRole<HTMLInputElement>("radio", { name: "Beta" });

    expect(stable).toBeRequired();
    expect(beta).toBeRequired();
    expect(stable.checkValidity()).toBe(false);
    fireEvent.click(beta);
    expect(stable.checkValidity()).toBe(true);
  });

  it("propagates disabled and invalid group state while allowing item disabled state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <RadioGroup.Root disabled name="disabled" onValueChange={onValueChange}>
          <RadioGroup.Legend>Disabled group</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Disabled option" value="a" />
        </RadioGroup.Root>
        <RadioGroup.Root invalid name="invalid">
          <RadioGroup.Legend>Invalid group</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Invalid option" value="a" />
          <RadioGroup.Item aria-label="Unavailable option" disabled value="b" />
        </RadioGroup.Root>
      </>,
    );

    const disabled = screen.getByRole("radio", { name: "Disabled option" });
    await user.click(disabled);
    expect(disabled).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("group", { name: "Invalid group" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByRole("radio", { name: "Invalid option" }),
    ).toHaveAttribute("data-invalid", "true");
    expect(
      screen.getByRole("radio", { name: "Invalid option" }),
    ).not.toHaveAttribute("aria-invalid");
    expect(
      screen.getByRole("radio", { name: "Unavailable option" }),
    ).toBeDisabled();
  });

  it("preserves native form submission and reset for uncontrolled groups", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Release form">
        <RadioGroup.Root defaultValue="stable" name="channel">
          <RadioGroup.Legend>Channel</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Stable" value="stable" />
          <RadioGroup.Item aria-label="Beta" value="beta" />
        </RadioGroup.Root>
        <button type="reset">Reset</button>
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>("form");
    const beta = screen.getByRole("radio", { name: "Beta" });

    expect(new FormData(form).get("channel")).toBe("stable");
    await user.click(beta);
    expect(new FormData(form).get("channel")).toBe("beta");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(new FormData(form).get("channel")).toBe("stable");
  });

  it("propagates external form association from the root to each option", () => {
    render(
      <>
        <form aria-label="Release form" id="release-form" />
        <RadioGroup.Root defaultValue="beta" form="release-form" name="channel">
          <RadioGroup.Legend>Channel</RadioGroup.Legend>
          <RadioGroup.Item aria-label="Stable" value="stable" />
          <RadioGroup.Item aria-label="Beta" value="beta" />
        </RadioGroup.Root>
      </>,
    );
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(new FormData(form).get("channel")).toBe("beta");
    expect(screen.getByRole("radio", { name: "Stable" })).toHaveAttribute(
      "form",
      "release-form",
    );
  });

  it("composes options with Field without RadioGroup-specific Field glue", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <RadioGroup.Root defaultValue="stable" name="channel" required>
        <RadioGroup.Legend>Release channel</RadioGroup.Legend>
        <Field.Root controlId="radio-beta">
          <Inline gap="sm">
            <Field.Control>
              <RadioGroup.Item ref={ref} value="beta" />
            </Field.Control>
            <Field.Label>Beta channel</Field.Label>
          </Inline>
          <Field.Description>Receives preview releases.</Field.Description>
        </Field.Root>
      </RadioGroup.Root>,
    );
    const beta = screen.getByRole("radio", { name: "Beta channel" });

    expect(ref.current).toBe(beta);
    expect(beta).toHaveAttribute("id", "radio-beta");
    expect(beta).toHaveAttribute("aria-describedby", "radio-beta-description");
    expect(beta).toBeRequired();
    await user.click(screen.getByText("Beta channel"));
    expect(beta).toBeChecked();
  });

  it("accepts consumer classes, styles, data, and native item attributes", () => {
    render(
      <RadioGroup.Root
        className="custom-group"
        data-project="flux"
        name="channel"
      >
        <RadioGroup.Legend className="custom-legend">Channel</RadioGroup.Legend>
        <RadioGroup.Item
          aria-label="Stable"
          className="custom-radio"
          data-channel="stable"
          style={{ margin: "0.25rem" }}
          value="stable"
        />
      </RadioGroup.Root>,
    );
    const group = screen.getByRole("group", { name: "Channel" });
    const radio = screen.getByRole<HTMLInputElement>("radio");

    expect(group).toHaveClass("custom-group");
    expect(group).toHaveAttribute("data-project", "flux");
    expect(group.querySelector("legend")).toHaveClass("custom-legend");
    expect(radio).toHaveClass("custom-radio");
    expect(radio.style.margin).toBe("0.25rem");
    expect(radio).toHaveAttribute("data-channel", "stable");
    expect(radio).toHaveAttribute("value", "stable");
  });

  it("requires compound parts to live inside the root", () => {
    expect(() => render(<RadioGroup.Item value="stable" />)).toThrow(
      "RadioGroup.Item must be rendered inside RadioGroup.Root.",
    );
    expect(() =>
      render(<RadioGroup.Legend>Channel</RadioGroup.Legend>),
    ).toThrow("RadioGroup.Legend must be rendered inside RadioGroup.Root.");
  });

  it("renders server markup without leaking Flux-only props", () => {
    const markup = renderToString(
      <RadioGroup.Root
        defaultValue="stable"
        invalid
        name="channel"
        onValueChange={() => {}}
        required
      >
        <RadioGroup.Legend>Release channel</RadioGroup.Legend>
        <RadioGroup.Item value="stable" />
        <RadioGroup.Item value="beta" />
      </RadioGroup.Root>,
    );

    expect(markup).toContain("<fieldset");
    expect(markup).toContain("<legend");
    expect(markup).toContain('type="radio"');
    expect(markup).toContain('name="channel"');
    expect(markup).toContain('checked=""');
    expect(markup).not.toContain("defaultValue=");
    expect(markup).not.toContain("onValueChange");
    expect(markup).not.toMatch(/\sinvalid=/);
  });
});
