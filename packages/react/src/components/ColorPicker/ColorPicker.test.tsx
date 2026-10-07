import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "./ColorPicker.js";

describe("ColorPicker", () => {
  it("keeps native and hex inputs synchronized in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ColorPicker
        aria-label="Brand color"
        defaultValue="#ABC"
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("group", { name: "Brand color" })).toBeVisible();
    const hex = screen.getByRole("textbox", { name: "Hex color" });
    const native = screen.getByLabelText("Choose color");
    expect(hex).toHaveValue("#aabbcc");
    expect(native).toHaveValue("#aabbcc");

    fireEvent.change(native, { target: { value: "#123456" } });
    expect(hex).toHaveValue("#123456");
    expect(onValueChange).toHaveBeenLastCalledWith("#123456");

    await user.clear(hex);
    await user.type(hex, "#abcdef");
    expect(native).toHaveValue("#abcdef");
    expect(onValueChange).toHaveBeenLastCalledWith("#abcdef");
  });

  it("marks incomplete edits invalid and restores the committed value on blur", async () => {
    const user = userEvent.setup();
    render(<ColorPicker aria-label="Accent" defaultValue="#112233" />);
    const hex = screen.getByRole("textbox", { name: "Hex color" });

    await user.clear(hex);
    await user.type(hex, "#12");
    expect(hex).toHaveAttribute("aria-invalid", "true");
    await user.tab();
    expect(hex).toHaveValue("#112233");
    expect(hex).not.toHaveAttribute("aria-invalid");

    await user.clear(hex);
    await user.type(hex, "#fff");
    await user.tab();
    expect(hex).toHaveValue("#ffffff");
  });

  it("restores its uncontrolled default on native form reset", async () => {
    const user = userEvent.setup();
    render(
      <>
        <form id="theme-form" aria-label="Theme form">
          <button type="reset">Reset theme</button>
        </form>
        <ColorPicker
          aria-label="Accent"
          defaultValue="#123456"
          form="theme-form"
          name="accent"
        />
      </>,
    );

    const hex = screen.getByRole("textbox", { name: "Hex color" });
    const native = screen.getByLabelText("Choose color");
    fireEvent.change(native, { target: { value: "#abcdef" } });
    expect(hex).toHaveValue("#abcdef");

    await user.clear(hex);
    await user.type(hex, "#12");
    expect(hex).toHaveAttribute("aria-invalid", "true");

    await user.click(screen.getByRole("button", { name: "Reset theme" }));
    await waitFor(() => expect(hex).toHaveValue("#123456"));
    expect(native).toHaveValue("#123456");
    expect(hex).not.toHaveAttribute("aria-invalid");
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Theme form" }),
      ).get("accent"),
    ).toBe("#123456");
  });

  it("keeps controlled ownership authoritative", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState("#336699");
      return (
        <>
          <ColorPicker
            aria-label="Controlled color"
            value={value}
            onValueChange={setValue}
          />
          <button type="button" onClick={() => setValue("#ff0000")}>
            Set red
          </button>
        </>
      );
    }

    render(<Example />);
    const hex = screen.getByRole("textbox", { name: "Hex color" });
    expect(hex).toHaveValue("#336699");
    await user.click(screen.getByRole("button", { name: "Set red" }));
    expect(hex).toHaveValue("#ff0000");
    expect(screen.getByLabelText("Choose color")).toHaveValue("#ff0000");
  });

  it("supports disabled form participation without creating a second named field", () => {
    render(
      <form data-testid="form">
        <ColorPicker
          aria-label="Form color"
          defaultValue="#123456"
          disabled
          form="theme-form"
          name="accent"
        />
      </form>,
    );
    expect(screen.getByLabelText("Choose color")).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Hex color" })).toBeDisabled();
    expect(screen.getByLabelText("Choose color")).toHaveAttribute(
      "name",
      "accent",
    );
    expect(
      screen.getByRole("textbox", { name: "Hex color" }),
    ).not.toHaveAttribute("name");
  });
});
