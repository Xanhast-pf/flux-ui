import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ColorSwatch } from "./ColorSwatch.js";
const ids = Array.from(
  { length: 1_000 },
  (_, index) => `color-swatch-${index}`,
);
describe("ColorSwatch SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <ColorSwatch key={id} color="var(--flux-color-accent)" />
        ))}
      </>,
    );
  });
});
