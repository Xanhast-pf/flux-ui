import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Toggle } from "./Toggle.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Toggle SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <button type="button" aria-pressed="true">
              Pin
            </button>
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
            <Toggle defaultPressed>Pin</Toggle>
          </Fragment>
        ))}
      </>,
    );
  });
});
