import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Stat } from "./Stat.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `stat-${index}`);
describe("Stat SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Stat key={id} label="ID" value={id} />
        ))}
      </>,
    );
  });
});
