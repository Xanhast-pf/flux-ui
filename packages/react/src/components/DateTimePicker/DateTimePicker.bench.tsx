import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DateTimePicker } from "./DateTimePicker.js";

describe("DateTimePicker SSR", () => {
  bench("render 1,000 native temporal controls", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <DateTimePicker
            key={index}
            aria-label="DateTimePicker"
            defaultValue="2026-10-01T14:30"
          />
        ))}
      </div>,
    );
  });
});
