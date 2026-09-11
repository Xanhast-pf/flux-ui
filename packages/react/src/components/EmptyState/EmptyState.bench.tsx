import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { EmptyState } from "./EmptyState.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `empty-state-${index}`);
describe("EmptyState SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <EmptyState key={id} title={id} description="Nothing to display." />
        ))}
      </>,
    );
  });
});
