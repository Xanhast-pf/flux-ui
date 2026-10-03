import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ChartLegend } from "./ChartLegend.js";

const items = [
  { id: "a", label: "A" },
  { id: "b", label: "B", tone: "success" as const },
];

describe("ChartLegend SSR", () => {
  bench("render 1,000 legends", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <ChartLegend items={items} key={index}>
            <span>Chart</span>
          </ChartLegend>
        ))}
      </div>,
    );
  });
});
