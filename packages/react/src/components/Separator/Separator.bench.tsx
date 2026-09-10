import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Separator } from "./Separator.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Separator SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <hr />
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
            <Separator />
          </Fragment>
        ))}
      </>,
    );
  });
});
