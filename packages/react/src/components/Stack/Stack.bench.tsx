import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Stack } from "./Stack.js";

describe("Stack SSR", () => {
  bench("render 1,000 children", () => {
    renderToString(
      <Stack gap="sm">
        {Array.from({ length: 1_000 }, (_, index) => `item-${index}`).map(
          (id) => (
            <div key={id}>{id}</div>
          ),
        )}
      </Stack>,
    );
  });
});
