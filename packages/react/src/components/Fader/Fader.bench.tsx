import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Fader } from "./Fader.js";

describe("Fader SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <Fader
        {...({
          "aria-label": "Gain",
          min: -60,
          max: 0,
          defaultValue: -12,
        } as const)}
      />,
    );
  });
});
