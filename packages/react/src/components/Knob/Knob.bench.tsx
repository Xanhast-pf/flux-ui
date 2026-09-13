import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Knob } from "./Knob.js";

describe("Knob SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <Knob
        {...({
          "aria-label": "Filter cutoff",
          min: 20,
          max: 20000,
          step: 10,
          defaultValue: 1000,
          scale: "log",
        } as const)}
      />,
    );
  });
});
