import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "../components/Checkbox/Checkbox.js";
import { Combobox } from "../components/Combobox/Combobox.js";
import { DatePicker } from "../components/DatePicker/DatePicker.js";
import { DateTimePicker } from "../components/DateTimePicker/DateTimePicker.js";
import { Field } from "../components/Field/Field.js";
import { Input } from "../components/Input/Input.js";
import { InputGroup } from "../components/InputGroup/InputGroup.js";
import { NumberField } from "../components/NumberField/NumberField.js";
import { RadioGroup } from "../components/RadioGroup/RadioGroup.js";
import { Select } from "../components/Select/Select.js";
import { Switch } from "../components/Switch/Switch.js";
import { Textarea } from "../components/Textarea/Textarea.js";
import { TimePicker } from "../components/TimePicker/TimePicker.js";

describe("Public form-state styling contracts", () => {
  it("mirrors semantic invalid state to data-invalid across native control surfaces", () => {
    render(
      <>
        <Input data-testid="input" aria-invalid="true" />
        <Input data-testid="grammar" aria-invalid="grammar" />
        <Checkbox
          data-testid="checkbox"
          aria-label="Checkbox"
          aria-invalid="true"
        />
        <Select data-testid="select" aria-label="Select" aria-invalid="true">
          <option>Option</option>
        </Select>
        <Switch data-testid="switch" aria-label="Switch" aria-invalid="true" />
        <Textarea
          data-testid="textarea"
          aria-label="Textarea"
          aria-invalid="true"
        />
        <NumberField
          data-testid="number-field"
          aria-label="Number"
          aria-invalid="true"
        />
        <DatePicker
          data-testid="date-picker"
          aria-label="Date"
          aria-invalid="true"
        />
        <DateTimePicker
          data-testid="date-time-picker"
          aria-label="Date and time"
          aria-invalid="true"
        />
        <TimePicker
          data-testid="time-picker"
          aria-label="Time"
          aria-invalid="true"
        />
        <Combobox
          data-testid="combobox"
          aria-label="Combobox"
          aria-invalid="true"
          options={[]}
        />
        <InputGroup.Root>
          <InputGroup.Input
            data-testid="input-group"
            aria-label="Grouped input"
            aria-invalid="true"
          />
        </InputGroup.Root>
      </>,
    );

    for (const testId of [
      "input",
      "checkbox",
      "select",
      "switch",
      "textarea",
      "number-field",
      "date-picker",
      "date-time-picker",
      "time-picker",
      "combobox",
      "input-group",
    ]) {
      const control = screen.getByTestId(testId);
      expect(control).toHaveAttribute("aria-invalid", "true");
      expect(control).toHaveAttribute("data-invalid", "true");
    }

    expect(screen.getByTestId("grammar")).toHaveAttribute(
      "aria-invalid",
      "grammar",
    );
    expect(screen.getByTestId("grammar")).toHaveAttribute(
      "data-invalid",
      "grammar",
    );
  });

  it("exposes Field root state and propagates semantic invalid state", () => {
    render(
      <Field.Root data-testid="field" disabled invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Input data-testid="field-control" />
        </Field.Control>
      </Field.Root>,
    );

    const field = screen.getByTestId("field");
    const control = screen.getByTestId("field-control");

    expect(field).toHaveAttribute("data-disabled", "true");
    expect(field).toHaveAttribute("data-invalid", "true");
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("data-invalid", "true");
  });

  it("keeps RadioGroup invalid semantics on the group while exposing item styling state", () => {
    render(
      <RadioGroup.Root data-testid="radio-group" invalid>
        <RadioGroup.Legend>Release channel</RadioGroup.Legend>
        <RadioGroup.Item
          data-testid="radio-item"
          aria-label="Stable"
          value="stable"
        />
      </RadioGroup.Root>,
    );

    const group = screen.getByTestId("radio-group");
    const item = screen.getByTestId("radio-item");

    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("data-invalid", "true");
    expect(item).not.toHaveAttribute("aria-invalid");
    expect(item).toHaveAttribute("data-invalid", "true");
  });
});
