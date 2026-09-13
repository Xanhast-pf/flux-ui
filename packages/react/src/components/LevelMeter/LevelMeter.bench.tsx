import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { LevelMeter } from "./LevelMeter.js";

describe("LevelMeter SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <LevelMeter
        {...({ "aria-label": "Output level", value: -18, peak: -3 } as const)}
      />,
    );
  });
});
