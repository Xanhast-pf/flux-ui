import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { SplitPane } from "./SplitPane.js";

describe("SplitPane SSR", () => {
  bench("render a representative public instance", () => {
    renderToString(
      <SplitPane
        {...({
          label: "Resize panes",
          first: <p>First pane</p>,
          second: <p>Second pane</p>,
          defaultValue: 40,
        } as const)}
      />,
    );
  });
});
