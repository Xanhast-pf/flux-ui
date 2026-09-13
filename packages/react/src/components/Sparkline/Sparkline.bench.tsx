import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Sparkline } from "./Sparkline.js";

describe("Sparkline SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <Sparkline
        {...({ label: "Activity: 3, 7, 5, 9", values: [3, 7, 5, 9] } as const)}
      />,
    );
  });
});
