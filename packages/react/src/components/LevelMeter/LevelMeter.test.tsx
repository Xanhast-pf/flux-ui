import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LevelMeter } from "./LevelMeter.js";
describe("LevelMeter", () => {
  it("exposes a clamped passive value and a non-color clip indicator", () => {
    render(
      <LevelMeter aria-label="Bus" value={3} min={-60} max={0} peak={4} />,
    );
    const meter = screen.getByRole("meter", { name: "Bus" });
    expect(meter).toHaveAttribute("aria-valuenow", "0");
    expect(meter).toHaveAttribute("data-orientation", "vertical");
    expect(screen.getByText("CLIP")).toBeInTheDocument();
    expect(screen.queryByRole("slider")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
  it("supports units and rejects invalid domains", () => {
    render(
      <LevelMeter
        aria-label="Bus"
        value={-12}
        aria-valuetext="minus 12 decibels"
        orientation="horizontal"
      />,
    );
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuetext", "minus 12 decibels");
    expect(meter).toHaveAttribute("data-orientation", "horizontal");
    expect(() =>
      render(<LevelMeter aria-label="Invalid" value={0} min={1} max={0} />),
    ).toThrow(RangeError);
  });
});
