import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Textarea } from "./Textarea.js";

describe("Textarea SSR", () => {
  bench("render 1,000 textareas", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `textarea-${index}`).map(
          (id) => (
            <Textarea aria-label={id} key={id} name={id} rows={4} />
          ),
        )}
      </div>,
    );
  });
});
