import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { TimePicker } from "./TimePicker.js";

describe("TimePicker SSR", () => {
  bench("render 1,000 native temporal controls", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <TimePicker
            key={index}
            aria-label="TimePicker"
            defaultValue="14:30"
          />
        ))}
      </div>,
    );
  });
});
