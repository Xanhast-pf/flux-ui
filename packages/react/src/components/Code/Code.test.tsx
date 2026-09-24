import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Code } from "./Code.js";

describe("Code", () => {
  it("renders escaped, selectable native code rather than injected markup", () => {
    const ref = createRef<HTMLElement>();
    render(<Code ref={ref}>{"<script>notExecutable()</script>"}</Code>);
    expect(ref.current?.tagName).toBe("CODE");
    expect(screen.getByText("<script>notExecutable()</script>")).toBe(
      ref.current,
    );
    expect(document.querySelector("script")).toBeNull();
  });

  it("preserves native code attributes, className and style", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Code
        ref={ref}
        className="consumer-code"
        style={{ fontSize: "0.875rem" }}
        data-language="ts"
      >
        const ready = true;
      </Code>,
    );
    expect(ref.current).toBe(screen.getByText("const ready = true;"));
    expect(ref.current).toHaveClass("consumer-code");
    expect(ref.current?.style.fontSize).toBe("0.875rem");
    expect(ref.current).toHaveAttribute("data-language", "ts");
  });

  it("renders literal code safely on the server", () => {
    const markup = renderToString(<Code>{"<b>literal</b>"}</Code>);
    expect(markup).toContain("&lt;b&gt;literal&lt;/b&gt;");
    expect(markup).not.toContain("<b>literal</b>");
  });
});
