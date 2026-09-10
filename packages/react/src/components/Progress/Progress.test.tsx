import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress.js";
describe("Progress", () => {
  it("uses native progress with a real zero value", () => {
    render(<Progress aria-label="Release checks" value={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", "0");
    expect(screen.getByRole("progressbar")).toHaveAttribute("max", "100");
  });
  it("omits value for indeterminate progress", () => {
    render(<Progress aria-label="Loading preview" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("value");
  });
  it("preserves custom maximum, refs and styling", () => {
    const ref = createRef<HTMLProgressElement>();
    render(
      <Progress
        ref={ref}
        aria-label="Checks"
        value={2}
        max={3}
        className="custom"
        style={{ margin: "0.25rem" }}
      />,
    );
    expect(ref.current).toBe(screen.getByRole("progressbar"));
    expect(ref.current?.max).toBe(3);
    expect(ref.current?.value).toBe(2);
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("0.25rem");
  });
  it("renders on the server", () => {
    expect(renderToString(<Progress value={50} />)).toContain('value="50"');
  });
});
