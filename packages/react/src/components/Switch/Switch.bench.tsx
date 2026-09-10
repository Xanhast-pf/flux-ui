import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Switch } from "./Switch.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Switch SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <input
              aria-label="Release notifications"
              type="checkbox"
              role="switch"
              defaultChecked
            />
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
            <Switch aria-label="Release notifications" defaultChecked />
          </Fragment>
        ))}
      </>,
    );
  });
});
