import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge.js";
describe("Badge", () => {
  it("preserves content, classes, inline styles, data and refs", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge
        ref={ref}
        className="custom"
        style={{ margin: "0.25rem" }}
        data-project="flux"
      >
        Example
      </Badge>,
    );
    const element = screen.getByText("Example");
    expect(element).toHaveClass("custom");
    expect(element.style.margin).toBe("0.25rem");
    expect(element).toHaveAttribute("data-project", "flux");
    expect(ref.current).toBe(element);
  });
  it("keeps tone as presentation, not an interactive role", () => {
    render(<Badge tone="success">Ready</Badge>);
    expect(screen.getByText("Ready")).toHaveAttribute("data-tone", "success");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("renders on the server", () => {
    expect(renderToString(<Badge>Server content</Badge>)).toContain(
      "Server content",
    );
  });
});
