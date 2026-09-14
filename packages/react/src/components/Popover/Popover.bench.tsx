import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Popover } from "./Popover.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("Popover representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <button type="button" aria-expanded="false">
          Workspace settings
        </button>
        <div hidden role="dialog" aria-label="Workspace settings">
          <button type="button">Done</button>
        </div>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <Popover.Root>
          <Popover.Trigger>Workspace settings</Popover.Trigger>
          <Popover.Popup aria-label="Workspace settings">
            <Popover.Close>Done</Popover.Close>
          </Popover.Popup>
        </Popover.Root>
      </>,
    );
  });
});
