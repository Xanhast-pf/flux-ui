import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Badge } from "./Badge.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Badge SSR", () => {
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
            <Badge tone="success">Ready to ship</Badge>
          </Fragment>
        ))}
      </>,
    );
  });
});
