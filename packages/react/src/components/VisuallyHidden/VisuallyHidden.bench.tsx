import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { VisuallyHidden } from "./VisuallyHidden.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("VisuallyHidden SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <span>Loading</span>
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
            <VisuallyHidden>Loading</VisuallyHidden>
          </Fragment>
        ))}
      </>,
    );
  });
});
