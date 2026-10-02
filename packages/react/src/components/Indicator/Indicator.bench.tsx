import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Indicator } from "./Indicator.js";

describe("Indicator SSR", () => {
  bench("render 1,000 count indicators", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <Indicator key={index} content={index}>
            <span>Inbox</span>
          </Indicator>
        ))}
      </div>,
    );
  });
});
