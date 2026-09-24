import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer.js";

describe("Footer", () => {
  it("renders a native page footer", () => {
    render(<Footer>Example</Footer>);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Example");
  });

  it("preserves native props, refs, className, and style", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Footer
        ref={ref}
        className="consumer-footer"
        style={{ paddingInline: "1rem" }}
        aria-label="Product"
      >
        Example
      </Footer>,
    );

    const footer = screen.getByRole("contentinfo", { name: "Product" });
    expect(ref.current).toBe(footer);
    expect(footer).toHaveClass("consumer-footer");
    expect(footer).toHaveStyle({ paddingInline: "1rem" });
  });

  it("renders native server markup without fixed-position behavior", () => {
    const markup = renderToString(
      <Footer data-testid="footer">Example</Footer>,
    );
    expect(markup).toContain("<footer");
    expect(markup).toContain("Example");
    expect(markup).not.toContain("position");
  });
});
