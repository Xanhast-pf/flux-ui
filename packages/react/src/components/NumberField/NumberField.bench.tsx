import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { NumberField } from "./NumberField.js";

describe("NumberField SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <NumberField
        {...({
          "aria-label": "Tempo",
          min: 40,
          max: 240,
          defaultValue: 120,
        } as const)}
      />,
    );
  });
});
