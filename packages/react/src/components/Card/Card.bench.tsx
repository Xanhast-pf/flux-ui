import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Card } from "./Card.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Card SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div>
              <h3>Ship something good.</h3>
              <p>Your next idea starts here.</p>
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
            <Card>
              <h3>Ship something good.</h3>
              <p>Your next idea starts here.</p>
            </Card>
          </Fragment>
        ))}
      </>,
    );
  });
});
