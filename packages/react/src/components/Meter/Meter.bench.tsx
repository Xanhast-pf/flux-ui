import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Meter } from "./Meter.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `meter-${index}`);
describe("Meter SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Meter key={id} aria-label={id} value={0.5} />
        ))}
      </>,
    );
  });
});
