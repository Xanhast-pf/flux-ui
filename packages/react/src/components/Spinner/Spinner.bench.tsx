import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Spinner } from "./Spinner.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Spinner SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <span role="status">
              <span>Loading</span>
            </span>
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
            <Spinner label="Loading" />
          </Fragment>
        ))}
      </>,
    );
  });
});
