import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Accordion } from "./Accordion.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Accordion SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div>
              <details name={id}>
                <summary>Details</summary>
                <div>Answer</div>
              </details>
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
            <Accordion.Root name={id}>
              <Accordion.Item>
                <Accordion.Trigger>Details</Accordion.Trigger>
                <Accordion.Content>Answer</Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
