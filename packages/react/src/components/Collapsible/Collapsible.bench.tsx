import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Collapsible } from "./Collapsible.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Collapsible SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <details>
              <summary>How does this work?</summary>
              <div>The browser handles disclosure.</div>
            </details>
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
            <Collapsible.Root>
              <Collapsible.Trigger>How does this work?</Collapsible.Trigger>
              <Collapsible.Content>
                The browser handles disclosure.
              </Collapsible.Content>
            </Collapsible.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
