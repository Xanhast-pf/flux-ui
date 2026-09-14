import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { InputGroup } from "./InputGroup.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("InputGroup representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <div>
          <span aria-hidden="true">USD</span>
          <input
            aria-label="Amount in US dollars"
            type="number"
            defaultValue="120"
          />
        </div>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <InputGroup.Root>
          <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
          <InputGroup.Input
            aria-label="Amount in US dollars"
            type="number"
            defaultValue="120"
          />
        </InputGroup.Root>
      </>,
    );
  });
});
