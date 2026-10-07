import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ColorPicker } from "./ColorPicker.js";

describe("ColorPicker SSR", () => {
  bench("render 1,000 instances", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <ColorPicker
            key={index}
            aria-label={`Color ${index + 1}`}
            defaultValue="#6366f1"
          />
        ))}
      </div>,
    );
  });
});
