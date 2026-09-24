import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { StatusBadge } from "./StatusBadge.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("StatusBadge SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <span>Ready to ship</span>
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
            <StatusBadge tone="success">Ready to ship</StatusBadge>
          </Fragment>
        ))}
      </>,
    );
  });
});
