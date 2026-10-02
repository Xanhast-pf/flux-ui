import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { PieChart } from "./PieChart.js";

describe("PieChart SSR", () => {
  bench("render a 32-slice chart", () => {
    renderToString(
      <PieChart
        label="Distribution"
        data={Array.from({ length: 32 }, (_, index) => ({
          id: `slice-${index}`,
          label: `Slice ${index + 1}`,
          value: index + 1,
        }))}
      />,
    );
  });
});
