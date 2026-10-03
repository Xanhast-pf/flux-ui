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

  it("enables platform autosizing with row constraints", () => {
    render(
      <Textarea
        aria-label="Autosizing notes"
        autoSize
        minRows={2}
        maxRows={6}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Autosizing notes" });
    expect(textarea).not.toHaveAttribute("rows");
    expect(textarea).toHaveAttribute("data-auto-size", "true");
    expect(textarea).toHaveAttribute("data-has-max-rows", "true");
    expect(
      textarea.style.getPropertyValue("--flux-textarea-min-row-size"),
    ).toBe("2lh");
    expect(
      textarea.style.getPropertyValue("--flux-textarea-max-row-size"),
    ).toBe("6lh");
  });

  it("keeps the native style escape hatch in autosize mode", () => {
    render(
      <Textarea
        aria-label="Custom autosize notes"
        autoSize
        minRows={2}
        style={{ minBlockSize: "6rem", maxBlockSize: "12rem" }}
      />,
    );
    const textarea = screen.getByRole("textbox", {
      name: "Custom autosize notes",
    });
    expect(textarea.style.minBlockSize).toBe("6rem");
    expect(textarea.style.maxBlockSize).toBe("12rem");
  });

  it("rejects contradictory or invalid autosize row contracts", () => {
    expect(() =>
      render(
        // @ts-expect-error Runtime guard covers untyped JavaScript consumers.
        <Textarea aria-label="Bad fixed rows" minRows={2} />,
      ),
    ).toThrow("Textarea minRows/maxRows require autoSize={true}.");

    expect(() =>
      render(
        // @ts-expect-error Runtime guard covers untyped JavaScript consumers.
        <Textarea aria-label="Bad autosize rows" autoSize rows={2} />,
      ),
    ).toThrow("Textarea rows cannot be used with autoSize={true}.");

    expect(() =>
      render(<Textarea aria-label="Bad minimum" autoSize minRows={0} />),
    ).toThrow("Textarea.minRows must be a positive integer.");

    expect(() =>
      render(
        <Textarea aria-label="Bad range" autoSize minRows={4} maxRows={3} />,
      ),
    ).toThrow("Textarea maxRows must be greater than or equal to minRows.");
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
