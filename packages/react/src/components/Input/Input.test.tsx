import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input.js";

describe("Input", () => {
  it("preserves native input behavior and attributes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Input
        aria-label="Email address"
        name="email"
        onChange={onChange}
        size={32}
        type="email"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email address" });
    await user.type(input, "jo@example.com");

    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("size", "32");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveValue("jo@example.com");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards refs to the native input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Name" }));
  });

  it("accepts consumer className and accessibility state escape hatches", () => {
    render(
      <Input
        aria-invalid="true"
        aria-label="Invalid value"
        className="consumer-class"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Invalid value" });
    expect(input).toHaveClass("consumer-class");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
