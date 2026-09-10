import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Field } from "../Field/Field.js";
import { Select } from "./Select.js";
const options = (
  <>
    <option value="preview">Preview</option>
    <option value="production">Production</option>
  </>
);
function Controlled() {
  const [value, setValue] = useState("preview");
  return (
    <Select
      aria-label="Environment"
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value);
      }}
    >
      {options}
    </Select>
  );
}
describe("Select", () => {
  it("supports uncontrolled selection and native form data", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Release">
        <Select
          aria-label="Environment"
          name="environment"
          defaultValue="preview"
        >
          {options}
        </Select>
      </form>,
    );
    await user.selectOptions(screen.getByRole("combobox"), "production");
    const form = screen.getByRole<HTMLFormElement>("form");
    expect(new FormData(form).get("environment")).toBe("production");
    form.reset();
    expect(screen.getByRole("combobox")).toHaveValue("preview");
  });
  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.selectOptions(screen.getByRole("combobox"), "production");
    expect(screen.getByRole("combobox")).toHaveValue("production");
  });
  it("preserves multiple and optgroup semantics", async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Environments" multiple size={3}>
        <optgroup label="Targets">{options}</optgroup>
      </Select>,
    );
    const select = screen.getByRole("listbox");
    await user.selectOptions(select, ["preview", "production"]);
    expect(select).toHaveValue(["preview", "production"]);
    expect(select).toHaveAttribute("size", "3");
  });
  it("works with Field and forwards consumer attributes and refs", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Field.Root required disabled invalid>
        <Field.Label>Environment</Field.Label>
        <Field.Control>
          <Select ref={ref} className="custom" style={{ margin: "0.25rem" }}>
            {options}
          </Select>
        </Field.Control>
        <Field.Error>Choose a target</Field.Error>
      </Field.Root>,
    );
    const select = screen.getByRole("combobox");
    expect(ref.current).toBe(select);
    expect(select).toBeRequired();
    expect(select).toBeDisabled();
    expect(select).toHaveAccessibleDescription("Choose a target");
    expect(select).toHaveClass("custom");
    expect(select.style.margin).toBe("0.25rem");
  });
  it("renders the default selection on the server", () => {
    expect(
      renderToString(<Select defaultValue="production">{options}</Select>),
    ).toContain('selected=""');
  });
});
