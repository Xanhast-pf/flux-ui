import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Skeleton } from "./Skeleton.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Skeleton SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <span aria-hidden="true" />
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
            <Skeleton />
          </Fragment>
        ))}
      </>,
    );
  });
});
