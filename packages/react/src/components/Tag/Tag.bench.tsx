import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Tag } from "./Tag.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("Tag representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <span>Design</span>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <Tag>Design</Tag>
      </>,
    );
  });
});
