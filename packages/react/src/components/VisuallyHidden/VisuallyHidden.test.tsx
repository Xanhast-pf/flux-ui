import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VisuallyHidden } from "./VisuallyHidden.js";
describe("VisuallyHidden", () => {
  it("keeps text in the accessibility tree to name a native control", () => {
    render(
      <button type="button">
        <span aria-hidden="true">+</span>
        <VisuallyHidden>Add note</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Add note");
    expect(screen.getByText("Add note")).not.toHaveAttribute("aria-hidden");
    expect(screen.getByText("Add note")).not.toHaveAttribute("hidden");
  });
  it("forwards refs and native attributes and is server safe", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <VisuallyHidden ref={ref} id="status" className="custom">
        Ready
      </VisuallyHidden>,
    );
    expect(ref.current).toBe(screen.getByText("Ready"));
    expect(ref.current).toHaveAttribute("id", "status");
    expect(ref.current).toHaveClass("custom");
    expect(renderToString(<VisuallyHidden>Ready</VisuallyHidden>)).toContain(
      "Ready",
    );
  });
});
