import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Tooltip } from "./Tooltip.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("Tooltip representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <button type="button" aria-describedby="native-tip">
          Save draft
        </button>
        <div hidden id="native-tip" role="tooltip">
          Save changes to this local draft.
        </div>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <Tooltip content="Save changes to this local draft.">
          <button type="button">Save draft</button>
        </Tooltip>
      </>,
    );
  });
});
