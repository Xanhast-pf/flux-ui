import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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
});
