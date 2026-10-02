import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DatePicker } from "./DatePicker.js";

describe("DatePicker SSR", () => {
  bench("render 1,000 native temporal controls", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <DatePicker
            key={index}
            aria-label="DatePicker"
            defaultValue="2026-10-01"
          />
        ))}
      </div>,
    );
  });
});
