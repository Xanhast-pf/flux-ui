import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { IconButton } from "./IconButton.js";
describe("IconButton", () => {
  it("has a meaningful name and never submits by default", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: Event) => {
      event.preventDefault();
    });
    const { container } = render(
      <form>
        <IconButton aria-label="Add note">
          <span aria-hidden="true">+</span>
        </IconButton>
      </form>,
    );
    container.querySelector("form")?.addEventListener("submit", submit);
    const button = screen.getByRole("button", { name: "Add note" });
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(submit).not.toHaveBeenCalled();
  });
  it("accepts an external label and forwards the native ref and styling", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <>
        <span id="rename-label">Rename</span>
        <IconButton
          aria-labelledby="rename-label"
          ref={ref}
          className="custom"
          style={{ margin: "0.25rem" }}
          data-example="yes"
        >
          ✎
        </IconButton>
      </>,
    );
    expect(ref.current).toBe(screen.getByRole("button", { name: "Rename" }));
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveAttribute("data-example", "yes");
  });
  it("keeps Button loading and native keyboard behavior", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { rerender } = render(
      <IconButton aria-label="Save" onClick={click}>
        ✓
      </IconButton>,
    );
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(click).toHaveBeenCalledTimes(1);
    rerender(
      <IconButton aria-label="Save" loading onClick={click}>
        ✓
      </IconButton>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    await user.click(screen.getByRole("button"));
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("retains explicit submit and renders server-safe markup", () => {
    const markup = renderToString(
      <IconButton aria-label="Submit" type="submit">
        ✓
      </IconButton>,
    );
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('aria-label="Submit"');
    expect(markup).not.toContain("startIcon=");
  });
  it.each(["sm", "md", "lg"] as const)(
    "maps %s styling to data attributes without leaking props",
    (size) => {
      render(
        <IconButton
          aria-label="Archive"
          size={size}
          tone="danger"
          variant="outline"
          name="action"
          value="archive"
        >
          ×
        </IconButton>,
      );
      const button = screen.getByRole("button", { name: "Archive" });
      expect(button).toHaveAttribute("data-size", size);
      expect(button).toHaveAttribute("data-tone", "danger");
      expect(button).toHaveAttribute("data-variant", "outline");
      expect(button).toHaveAttribute("name", "action");
      expect(button).toHaveAttribute("value", "archive");
      for (const prop of ["loading", "size", "tone", "variant"]) {
        expect(button).not.toHaveAttribute(prop);
      }
    },
  );

  it("restores activation after loading without replacing the accessible name", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { rerender } = render(
      <IconButton aria-label="Save" loading onClick={click}>
        ✓
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-loading", "true");
    rerender(
      <IconButton aria-label="Save" onClick={click}>
        ✓
      </IconButton>,
    );
    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).not.toHaveAttribute("data-loading");
    button.focus();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledTimes(1);
  });
});
