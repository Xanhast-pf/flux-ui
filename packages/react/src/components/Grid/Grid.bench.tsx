import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Grid } from "./Grid.js";

describe("Grid SSR", () => {
  bench("render 1,000 grid items", () => {
    renderToString(
      <Grid columns={4} gap="md">
        {Array.from({ length: 1_000 }, (_, index) => `item-${index}`).map(
          (id) => (
            <div key={id}>{id}</div>
          ),
        )}
      </Grid>,
    );
  });
});
