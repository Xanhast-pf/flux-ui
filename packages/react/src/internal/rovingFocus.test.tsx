import { describe, expect, it } from "vitest";
import { nextRovingIndex } from "./rovingFocus.js";
const base = {
  orientation: "horizontal",
  direction: "ltr",
  loopFocus: true,
} as const;
describe("roving focus key policy", () => {
  it("moves horizontally and wraps at both edges", () => {
    expect(nextRovingIndex("ArrowRight", 0, 3, base)).toBe(1);
    expect(nextRovingIndex("ArrowRight", 2, 3, base)).toBe(0);
    expect(nextRovingIndex("ArrowLeft", 0, 3, base)).toBe(2);
  });
  it("reverses only the horizontal axis in RTL", () => {
    expect(
      nextRovingIndex("ArrowRight", 1, 3, { ...base, direction: "rtl" }),
    ).toBe(0);
    expect(
      nextRovingIndex("ArrowLeft", 1, 3, { ...base, direction: "rtl" }),
    ).toBe(2);
    expect(
      nextRovingIndex("ArrowDown", 1, 3, {
        ...base,
        orientation: "vertical",
        direction: "rtl",
      }),
    ).toBe(2);
  });
  it("supports Home/End and clamps non-looping collections", () => {
    expect(nextRovingIndex("Home", 2, 3, base)).toBe(0);
    expect(nextRovingIndex("End", 0, 3, base)).toBe(2);
    expect(
      nextRovingIndex("ArrowRight", 2, 3, { ...base, loopFocus: false }),
    ).toBe(2);
    expect(
      nextRovingIndex("ArrowLeft", 0, 3, { ...base, loopFocus: false }),
    ).toBe(0);
  });
  it("ignores unrelated keys, wrong axes, and invalid collections", () => {
    for (const key of ["Tab", "Enter", "Escape", "ArrowUp", "ArrowDown"])
      expect(nextRovingIndex(key, 0, 3, base)).toBeNull();
    expect(nextRovingIndex("Home", 0, 0, base)).toBeNull();
    expect(nextRovingIndex("ArrowRight", -1, 3, base)).toBeNull();
    expect(nextRovingIndex("End", 3, 3, base)).toBeNull();
  });
});
