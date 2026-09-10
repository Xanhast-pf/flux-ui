import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Callout } from "./Callout.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Callout SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div role="note">
              This is a local demo. Nothing is sent to a server.
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
            <Callout tone="info">
              This is a local demo. Nothing is sent to a server.
            </Callout>
          </Fragment>
        ))}
      </>,
    );
  });
});
