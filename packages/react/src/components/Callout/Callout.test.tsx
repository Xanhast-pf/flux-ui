import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Callout } from "./Callout.js";
describe("Callout", () => {
  it("preserves content, classes, inline styles, data and refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Callout
        ref={ref}
        className="custom"
        style={{ margin: "0.25rem" }}
        data-project="flux"
      >
        Example
      </Callout>,
    );
    const element = screen.getByRole("note");
    expect(element).toHaveClass("custom");
    expect(element.style.margin).toBe("0.25rem");
    expect(element).toHaveAttribute("data-project", "flux");
    expect(ref.current).toBe(element);
  });
  it("only becomes a live region when requested", () => {
    render(
      <Callout role="status" tone="success">
        Saved
      </Callout>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });
  it("renders on the server", () => {
    expect(renderToString(<Callout>Server content</Callout>)).toContain(
      "Server content",
    );
  });
});
