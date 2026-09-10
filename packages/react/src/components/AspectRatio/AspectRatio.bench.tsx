import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { AspectRatio } from "./AspectRatio.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("AspectRatio SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div style={{ aspectRatio: 16 / 9 }}>Media</div>
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
            <AspectRatio ratio={16 / 9}>Media</AspectRatio>
          </Fragment>
        ))}
      </>,
    );
  });
});
