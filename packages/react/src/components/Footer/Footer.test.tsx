import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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
});
