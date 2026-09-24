import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline.js";

describe("Sparkline", () => {
  it("renders a named path and keeps gaps disconnected", () => {
    render(
      <Sparkline label="Trend with missing data" values={[1, 2, null, 3, 4]} />,
    );
    const graph = screen.getByRole("img", { name: "Trend with missing data" });
    expect(
      graph.querySelector("path")?.getAttribute("d")?.match(/M/g),
    ).toHaveLength(2);
  });

  it("keeps a flat source finite and forwards SVG attributes", () => {
    render(
      <Sparkline
        label="Steady"
        values={[4, 4, 4]}
        data-testid="trend"
        width={100}
      />,
    );
    expect(screen.getByTestId("trend")).toHaveAttribute("width", "100");
    expect(screen.getByTestId("trend").innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it("supports an explicitly decorative sparkline without an accessible image", () => {
    const { container } = render(
      <Sparkline aria-hidden="true" values={[1, 2, 3]} />,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("rejects non-finite samples and unbounded input sizes", () => {
    expect(() =>
      renderToString(<Sparkline label="Bad" values={[1, Number.NaN]} />),
    ).toThrow(RangeError);
    expect(() =>
      renderToString(
        <Sparkline
          label="Too dense"
          values={Array.from({ length: 2049 }, () => 1)}
        />,
      ),
    ).toThrow(RangeError);
  });

  it("renders finite server SVG output", () => {
    const markup = renderToString(
      <Sparkline label="Server trend" values={[1, null, 2]} />,
    );
    expect(markup).toContain("<svg");
    expect(markup).not.toMatch(/NaN|Infinity/);
  });
});
