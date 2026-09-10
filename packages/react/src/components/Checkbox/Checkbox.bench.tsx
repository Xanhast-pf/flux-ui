import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Checkbox } from "./Checkbox.js";

const ids = Array.from({ length: 1_000 }, (_, index) => `checkbox-${index}`);

describe("Checkbox SSR", () => {
  bench("render 1,000 native checkboxes", () => {
    renderToString(
      <div>
        {ids.map((id) => (
          <input
            aria-label={id}
            defaultChecked
            key={id}
            name={id}
            type="checkbox"
          />
        ))}
      </div>,
    );
  });

  bench("render 1,000 Flux checkboxes", () => {
    renderToString(
      <div>
        {ids.map((id) => (
          <Checkbox aria-label={id} defaultChecked key={id} name={id} />
        ))}
      </div>,
    );
  });
});
