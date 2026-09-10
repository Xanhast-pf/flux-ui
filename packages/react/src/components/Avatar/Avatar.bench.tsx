import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Avatar } from "./Avatar.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Avatar SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <span role="img" aria-label="Demo team">
              <span aria-hidden="true">FL</span>
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
            <Avatar alt="Demo team" fallback="FL" />
          </Fragment>
        ))}
      </>,
    );
  });
});
