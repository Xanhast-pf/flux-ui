import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ChartTooltip } from "./ChartTooltip.js";

describe("ChartTooltip SSR", () => {
  bench("render 1,000 wrappers", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <ChartTooltip key={index}>
            <span>Chart</span>
          </ChartTooltip>
        ))}
      </div>,
    );
  });
});
