import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Heading } from "./Heading.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `heading-${index}`);
describe("Heading SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Heading key={id} level={3}>
            {id}
          </Heading>
        ))}
      </>,
    );
  });
});
