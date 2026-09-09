import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { breakpoints, primitiveTokens } from "./index.js";

const SPATIAL_UNIT_REM = 0.25;
const MIN_TEXT_CONTRAST = 4.5;
const MIN_FOCUS_CONTRAST = 3;

const themeCss = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

function remValue(value: string): number {
  const match = /^(\d+(?:\.\d+)?)rem$/.exec(value);
  if (match === null) {
    throw new Error(`Expected an explicit rem value, received "${value}".`);
  }

  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric)) {
    throw new Error(`Invalid rem value "${value}".`);
  }

  return numeric;
}

function expectQuarterRem(value: string): void {
  const numeric = remValue(value);
  const units = numeric / SPATIAL_UNIT_REM;
  expect(Number.isInteger(units), `${value} is not on the 0.25rem grid`).toBe(
    true,
  );
}

function themeBlock(theme: "light" | "dark"): string {
  const selector =
    theme === "light"
      ? String.raw`:root,\s*\[data-flux-theme="light"\]`
      : String.raw`\[data-flux-theme="dark"\]`;
  const match = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`).exec(themeCss);

  if (match?.[1] === undefined) {
    throw new Error(`Could not find ${theme} theme block.`);
  }

  return match[1];
}

function cssVariable(block: string, variable: string): string {
  const match = new RegExp(`${variable}:\\s*([^;]+);`).exec(block);

  if (match?.[1] === undefined) {
    throw new Error(`Missing ${variable}.`);
  }

  return match[1].trim();
}

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (match?.[1] === undefined) {
    throw new Error(`Expected a six-digit hex color, received "${hex}".`);
  }

  const raw = match[1];
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);

  return (
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  );
}

function contrast(foreground: string, background: string): number {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function expectContrast(
  block: string,
  foregroundVariable: string,
  backgroundVariable: string,
  minimum: number,
): void {
  const foreground = cssVariable(block, foregroundVariable);
  const background = cssVariable(block, backgroundVariable);
  expect(
    contrast(foreground, background),
    `${foregroundVariable} on ${backgroundVariable}`,
  ).toBeGreaterThanOrEqual(minimum);
}

describe("Flux spatial token contract", () => {
  it("keeps reusable spatial tokens on the explicit 0.25rem grid", () => {
    const values = [
      ...Object.values(primitiveTokens.space),
      ...Object.values(primitiveTokens.radius),
      ...Object.values(primitiveTokens.control),
      ...Object.values(breakpoints),
    ];

    for (const value of values) {
      expectQuarterRem(value);
    }
  });

  it("keeps 1rem as the standard spacing and 0.25rem as the standard radius", () => {
    expect(primitiveTokens.space[4]).toBe("1rem");
    expect(primitiveTokens.radius.md).toBe("0.25rem");
  });

  it("keeps TypeScript and CSS spatial tokens in sync", () => {
    const lightBlock = themeBlock("light");

    for (const [key, value] of Object.entries(primitiveTokens.space)) {
      expect(cssVariable(lightBlock, `--flux-space-${key}`)).toBe(value);
    }

    for (const [key, value] of Object.entries(primitiveTokens.radius)) {
      expect(cssVariable(lightBlock, `--flux-radius-${key}`)).toBe(value);
    }

    for (const [key, value] of Object.entries(primitiveTokens.control)) {
      expect(cssVariable(lightBlock, `--flux-control-${key}`)).toBe(value);
    }
  });

  it("keeps CSS spatial defaults explicit and on-grid", () => {
    const spatialDeclarations = [
      ...themeCss.matchAll(
        /--flux-(?:space|radius|control)-[a-z0-9-]+:\s*([^;]+);/g,
      ),
    ];

    expect(spatialDeclarations.length).toBeGreaterThan(0);

    for (const declaration of spatialDeclarations) {
      const value = declaration[1];
      if (value === undefined) {
        throw new Error("Spatial token declaration is missing a value.");
      }

      expect(value).not.toMatch(/\b(?:calc|clamp|min|max)\(/);
      expectQuarterRem(value.trim());
    }
  });
});

describe.each(["light", "dark"] as const)(
  "Flux %s palette contrast",
  (theme) => {
    const block = themeBlock(theme);

    it("keeps primary and secondary text readable", () => {
      expectContrast(
        block,
        "--flux-color-text",
        "--flux-color-canvas",
        MIN_TEXT_CONTRAST,
      );
      expectContrast(
        block,
        "--flux-color-text-muted",
        "--flux-color-canvas",
        MIN_TEXT_CONTRAST,
      );
      expectContrast(
        block,
        "--flux-color-text-subtle",
        "--flux-color-surface",
        MIN_TEXT_CONTRAST,
      );
    });

    it.each(["accent", "success", "warning", "danger", "info"] as const)(
      "keeps %s solid foreground readable",
      (tone) => {
        expectContrast(
          block,
          `--flux-color-${tone}`,
          `--flux-color-${tone}-foreground`,
          MIN_TEXT_CONTRAST,
        );
      },
    );

    it.each(["accent", "success", "warning", "danger", "info"] as const)(
      "keeps %s hover foreground readable",
      (tone) => {
        expectContrast(
          block,
          `--flux-color-${tone}-hover`,
          `--flux-color-${tone}-foreground`,
          MIN_TEXT_CONTRAST,
        );
      },
    );

    it.each(["accent", "success", "warning", "danger", "info"] as const)(
      "keeps %s readable on its soft surface",
      (tone) => {
        expectContrast(
          block,
          `--flux-color-${tone}`,
          `--flux-color-${tone}-soft`,
          MIN_TEXT_CONTRAST,
        );
      },
    );

    it("keeps strong boundaries visible on the normal surface", () => {
      expectContrast(
        block,
        "--flux-color-border-strong",
        "--flux-color-surface",
        MIN_FOCUS_CONTRAST,
      );
    });

    it("keeps the focus indicator visible on the main surfaces", () => {
      expectContrast(
        block,
        "--flux-color-focus",
        "--flux-color-canvas",
        MIN_FOCUS_CONTRAST,
      );
      expectContrast(
        block,
        "--flux-color-focus",
        "--flux-color-surface",
        MIN_FOCUS_CONTRAST,
      );
    });
  },
);
