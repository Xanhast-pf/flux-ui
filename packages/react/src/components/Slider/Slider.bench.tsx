import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Slider } from "./Slider.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Slider SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <input
              aria-label="Traffic"
              type="range"
              min={0}
              max={100}
              step={5}
              defaultValue={25}
            />
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
            <Slider
              aria-label="Traffic"
              min={0}
              max={100}
              step={5}
              defaultValue={25}
            />
          </Fragment>
        ))}
      </>,
    );
  });
});
