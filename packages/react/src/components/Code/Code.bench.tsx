import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Code } from "./Code.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `code-${index}`);
describe("Code SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Code key={id}>{id}</Code>
        ))}
      </>,
    );
  });
});
