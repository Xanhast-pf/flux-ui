import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Meter } from "./Meter.js";
describe("Meter", () => {
  it("keeps a known zero, bounds, accessible name and native meter ref", () => {
    const ref = createRef<HTMLMeterElement>();
    render(
      <Meter
        ref={ref}
        aria-label="Bundle budget"
        value={0}
        min={0}
        max={100}
        low={20}
        high={80}
        optimum={10}
      />,
    );
    expect(screen.getByRole("meter", { name: "Bundle budget" })).toBe(
      ref.current,
    );
    expect(ref.current).toHaveAttribute("value", "0");
    expect(ref.current).toHaveAttribute("max", "100");
    expect(ref.current).toHaveAttribute("optimum", "10");
  });
  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects unknown or non-finite value %s",
    (value) => {
      expect(() => renderToStaticMarkup(<Meter value={value} />)).toThrow(
        RangeError,
      );
    },
  );
  it("rejects reversed or zero-width bounds", () => {
    expect(() =>
      renderToStaticMarkup(<Meter value={1} min={3} max={2} />),
    ).toThrow(RangeError);
    expect(() =>
      renderToStaticMarkup(<Meter value={1} min={1} max={1} />),
    ).toThrow(RangeError);
  });
});
