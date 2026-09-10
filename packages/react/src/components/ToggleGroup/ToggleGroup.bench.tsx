import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ToggleGroup } from "./ToggleGroup.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("ToggleGroup SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div role="group" aria-label="View">
              <button type="button" aria-pressed="true">
                Grid
              </button>
              <button type="button" aria-pressed="false">
                List
              </button>
            </div>
          </Fragment>
        ))}
      </>,
    );
  });
  bench("Flux 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <ToggleGroup.Root
              type="single"
              defaultValue="grid"
              aria-label="View"
            >
              <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
              <ToggleGroup.Item value="list">List</ToggleGroup.Item>
            </ToggleGroup.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
