import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Input } from "./Input.js";

describe("Input SSR", () => {
  bench("render 1,000 inputs", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `input-${index}`).map(
          (id) => (
            <Input aria-label={id} key={id} name={id} />
          ),
        )}
      </div>,
    );
  });
});
