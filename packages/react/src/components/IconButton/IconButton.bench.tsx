import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { IconButton } from "./IconButton.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("IconButton SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <button type="button" aria-label="Add a spark">
              +
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
            <IconButton aria-label="Add a spark">+</IconButton>
          </Fragment>
        ))}
      </>,
    );
  });
});
