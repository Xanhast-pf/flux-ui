import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Toolbar } from "./Toolbar.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Toolbar SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <div role="toolbar" aria-label="Tools">
              <button type="button">Copy</button>
              <button type="button">Paste</button>
              <button type="button">Reset</button>
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
            <Toolbar.Root aria-label="Tools">
              <Toolbar.Button>Copy</Toolbar.Button>
              <Toolbar.Button>Paste</Toolbar.Button>
              <Toolbar.Button>Reset</Toolbar.Button>
            </Toolbar.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
