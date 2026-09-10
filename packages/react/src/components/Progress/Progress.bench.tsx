import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Progress } from "./Progress.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Progress SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <progress aria-label="Release checklist" max={100} value={50} />
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
            <Progress aria-label="Release checklist" value={50} />
          </Fragment>
        ))}
      </>,
    );
  });
});
