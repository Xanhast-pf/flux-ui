import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { CodeBlock } from "./CodeBlock.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `code-block-${index}`);
describe("CodeBlock SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <CodeBlock key={id} label={id} code="pnpm check" copyable={false} />
        ))}
      </>,
    );
  });
});
