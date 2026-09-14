import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Toast } from "./Toast.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("Toast representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <ol aria-label="Notifications" />
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <Toast.Provider>
          <Toast.Viewport placement="inline" />
        </Toast.Provider>
      </>,
    );
  });
});
