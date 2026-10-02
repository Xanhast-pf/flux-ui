import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ScatterChart } from "./ScatterChart.js";

const data = Array.from({ length: 10_000 }, (_, index) => ({
  x: index,
  y: Math.sin(index / 100) * 100,
}));

describe("ScatterChart SSR", () => {
  bench("render 10,000 source points through a 512 point budget", () => {
    renderToString(
      <ScatterChart
        label="Dense scatter"
        series={[{ id: "series", label: "Series", data }]}
      />,
    );
  });
});
