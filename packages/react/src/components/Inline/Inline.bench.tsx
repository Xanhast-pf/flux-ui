import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Inline } from "./Inline.js";

describe("Inline SSR", () => {
  bench("render 1,000 children", () => {
    renderToString(
      <Inline gap="sm" wrap>
        {Array.from({ length: 1_000 }, (_, index) => `item-${index}`).map(
          (id) => (
            <span key={id}>{id}</span>
          ),
        )}
      </Inline>,
    );
  });
});
