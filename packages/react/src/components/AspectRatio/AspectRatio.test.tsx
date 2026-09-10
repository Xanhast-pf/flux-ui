import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./AspectRatio.js";
describe("AspectRatio", () => {
  it("sets a native preferred ratio and lets the consumer override it", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <AspectRatio ref={ref} ratio={16 / 9}>
        Media
      </AspectRatio>,
    );
    expect(Number.parseFloat(ref.current?.style.aspectRatio ?? "")).toBeCloseTo(
      16 / 9,
      4,
    );
    rerender(
      <AspectRatio
        ref={ref}
        ratio={16 / 9}
        style={{ aspectRatio: "1 / 1", margin: "0.25rem" }}
        className="custom"
        data-project="flux"
      >
        Media
      </AspectRatio>,
    );
    expect(ref.current?.style.aspectRatio).toContain("1");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toBe(screen.getByText("Media"));
  });
  it("rejects non-positive or non-finite ratios", () => {
    for (const ratio of [0, -1, Infinity, NaN])
      expect(() => renderToString(<AspectRatio ratio={ratio} />)).toThrow(
        RangeError,
      );
  });
  it("defaults to a square and does not leak ratio as a DOM attribute", () => {
    const markup = renderToString(<AspectRatio>Media</AspectRatio>);
    expect(markup).toContain("aspect-ratio:1");
    expect(markup).not.toContain(" ratio=");
  });
});
