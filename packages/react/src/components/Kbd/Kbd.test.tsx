import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Kbd } from "./Kbd.js";
describe("Kbd", () => {
  it("uses native keyboard-hint semantics without pretending to be a control", () => {
    render(<Kbd>Ctrl K</Kbd>);
    expect(screen.getByText("Ctrl K").tagName).toBe("KBD");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Ctrl K")).not.toHaveAttribute("tabindex");
  });
  it("preserves refs and styling and renders on the server", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd
        ref={ref}
        className="custom"
        style={{ margin: "0.25rem" }}
        title="Open search"
      >
        K
      </Kbd>,
    );
    expect(ref.current).toBe(screen.getByText("K"));
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveClass("custom");
    expect(renderToString(<Kbd>Escape</Kbd>)).toContain("Escape");
  });
});
