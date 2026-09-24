import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field.js";
import { Textarea } from "./Textarea.js";

describe("Textarea", () => {
  it("preserves native textarea behavior and attributes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Textarea
        aria-label="Project notes"
        maxLength={120}
        name="notes"
        onChange={onChange}
        rows={5}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Project notes" });
    await user.type(textarea, "Ship the smallest useful API.");

    expect(textarea).toHaveAttribute("name", "notes");
    expect(textarea).toHaveAttribute("maxlength", "120");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveValue("Ship the smallest useful API.");
    expect(onChange).toHaveBeenCalled();
  });

  it("supports platform content autosizing through the native style escape hatch", () => {
    render(
      <Textarea
        aria-label="Autosizing notes"
        rows={2}
        style={{ fieldSizing: "content", maxBlockSize: "12rem" }}
      />,
    );
    const textarea = screen.getByRole("textbox", { name: "Autosizing notes" });
    expect(textarea.style.getPropertyValue("field-sizing")).toBe("content");
    expect(textarea.style.maxBlockSize).toBe("12rem");
    expect(textarea).toHaveAttribute("rows", "2");
  });

  it("forwards refs to the native textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Notes" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Notes" }));
  });

  it("accepts consumer className and accessibility state escape hatches", () => {
    render(
      <Textarea
        aria-invalid="true"
        aria-label="Invalid notes"
        className="consumer-class"
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Invalid notes" });
    expect(textarea).toHaveClass("consumer-class");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("works as a Field control without Textarea-specific integration", () => {
    render(
      <Field.Root id="bio-field" invalid required>
        <Field.Label>Biography</Field.Label>
        <Field.Control>
          <Textarea />
        </Field.Control>
        <Field.Description>Tell us about your work.</Field.Description>
        <Field.Error>Biography is required.</Field.Error>
      </Field.Root>,
    );

    const textarea = screen.getByRole("textbox", { name: "Biography" });
    expect(textarea).toHaveAttribute("id", "bio-field-control");
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      "bio-field-description bio-field-error",
    );
  });
});
