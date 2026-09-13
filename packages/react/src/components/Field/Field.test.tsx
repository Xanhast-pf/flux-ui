import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../Input/Input.js";
import { Field } from "./Field.js";

describe("Field", () => {
  it("wires label, description, error, and required state to its control", () => {
    render(
      <Field.Root id="email-field" invalid required>
        <Field.Label>Email address</Field.Label>
        <Field.Control>
          <Input type="email" />
        </Field.Control>
        <Field.Description>Used for account notifications.</Field.Description>
        <Field.Error>Enter a valid email address.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAttribute("id", "email-field-control");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "email-field-description email-field-error",
    );
    expect(screen.getByText("Used for account notifications.")).toHaveAttribute(
      "id",
      "email-field-description",
    );
    expect(screen.getByText("Enter a valid email address.")).toHaveAttribute(
      "id",
      "email-field-error",
    );
  });

  it("keeps errors out of the accessibility tree until the field is invalid", () => {
    render(
      <Field.Root id="name-field">
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Field.Description>Your public display name.</Field.Description>
        <Field.Error>Name is required.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("aria-describedby", "name-field-description");
    expect(screen.queryByText("Name is required.")).not.toBeInTheDocument();
  });

  it("propagates disabled state while preserving consumer aria descriptions", () => {
    render(
      <>
        <p id="external-help">External help</p>
        <Field.Root controlId="search-control" disabled>
          <Field.Label>Search</Field.Label>
          <Field.Control>
            <Input aria-describedby="external-help" />
          </Field.Control>
          <Field.Description>Search all projects.</Field.Description>
        </Field.Root>
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("id", "search-control");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("external-help");
    expect(describedBy).toContain("search-control-description");
  });
  it("does not claim descriptions or disabled state from a nested field", () => {
    render(
      <Field.Root id="outer" disabled>
        <Field.Label>Outer</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Field.Root id="inner">
          <Field.Label>Inner</Field.Label>
          <Field.Control>
            <Input />
          </Field.Control>
          <Field.Description>Inner only</Field.Description>
          <Field.Error>Inactive error</Field.Error>
        </Field.Root>
      </Field.Root>,
    );
    const outer = screen.getByRole("textbox", { name: "Outer" });
    const inner = screen.getByRole("textbox", { name: "Inner" });
    expect(outer).toBeDisabled();
    expect(outer).not.toHaveAttribute("aria-describedby");
    expect(inner).not.toBeDisabled();
    expect(inner).toHaveAttribute("aria-describedby", "inner-description");
    expect(document.getElementById("outer-description")).toBeNull();
  });
});
