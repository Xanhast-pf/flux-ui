import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Chart } from "./Chart.js";

describe("Chart SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <Chart
        {...({
          label: "Weekly activity",
          series: [
            {
              id: "one",
              label: "Visits",
              data: [
                { x: 0, y: 4 },
                { x: 1, y: 9 },
                { x: 2, y: null },
                { x: 3, y: 7 },
              ],
            },
          ],
        } as const)}
      />,
    );
  });
});
