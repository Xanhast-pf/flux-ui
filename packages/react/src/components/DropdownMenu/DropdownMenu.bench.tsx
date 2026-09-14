import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DropdownMenu } from "./DropdownMenu.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("DropdownMenu representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <button type="button" aria-haspopup="menu" aria-expanded="false">
          Project actions
        </button>
        <div hidden role="menu" aria-label="Project actions">
          <button type="button" role="menuitem" tabIndex={-1}>
            Duplicate
          </button>
          <button type="button" role="menuitem" tabIndex={-1} disabled>
            Archive
          </button>
        </div>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Project actions</DropdownMenu.Trigger>
          <DropdownMenu.Popup aria-label="Project actions">
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Archive</DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
      </>,
    );
  });
});
