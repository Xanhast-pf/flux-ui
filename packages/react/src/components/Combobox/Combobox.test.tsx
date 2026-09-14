import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox.js";
const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "legacy", label: "Engineering legacy", disabled: true },
];
describe("Combobox", () => {
  it("filters, keeps input focus and submits a committed key rather than its label", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Combobox aria-label="Team" options={options} name="team" />
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "Team" });
    await user.type(input, "eng");
    expect(
      screen.queryByRole("option", { name: "Design" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Engineering legacy" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(input).toHaveFocus();
    expect(input).toBeInvalid();
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Engineering");
    expect(input).toBeValid();
    expect(input).toHaveAttribute("aria-expanded", "false");
    const form = document.querySelector("form");
    if (form === null) throw new Error("Missing form fixture.");
    expect(new FormData(form).get("team")).toBe("engineering");
  });
  it("skips unavailable choices and Escape closes without submitting", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <Combobox aria-label="Team" options={options} onValueChange={changed} />,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const input = screen.getByRole("combobox");
    const active = input.getAttribute("aria-activedescendant");
    expect(
      active === null ? null : document.getElementById(active),
    ).toHaveTextContent("Engineering");
    await user.keyboard("{Escape}");
    expect(changed).not.toHaveBeenCalled();
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(input).toHaveFocus();
  });
  it("honors a controlled owner that declines selection", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <Combobox
        aria-label="Team"
        options={options}
        value="design"
        onValueChange={changed}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Engineering" }));
    expect(changed).toHaveBeenCalledWith("engineering");
    expect(screen.getByRole("combobox")).toHaveValue("Design");
  });
  it("resets an uncontrolled form and hides the active descendant when disabled", async () => {
    const user = userEvent.setup();
    const view = render(
      <form>
        <Combobox aria-label="Team" options={options} defaultValue="design" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "eng");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByRole("combobox")).toHaveValue("Design"),
    );
    await user.click(screen.getByRole("combobox"));
    view.rerender(
      <form>
        <Combobox
          aria-label="Team"
          options={options}
          defaultValue="design"
          disabled
        />
        <button type="reset">Reset</button>
      </form>,
    );
    expect(screen.getByRole("combobox")).not.toHaveAttribute(
      "aria-activedescendant",
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
  it("closes on a non-focusable outside pointer target", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Combobox aria-label="Team" options={options} />
        <p data-testid="outside">Outside</p>
      </>,
    );
    await user.click(screen.getByRole("combobox"));
    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
