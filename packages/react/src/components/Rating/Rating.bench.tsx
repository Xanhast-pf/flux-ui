import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Rating } from "./Rating.js";

describe("Rating SSR", () => {
  bench("render 1,000 five-star ratings", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <Rating
            key={index}
            aria-label={`Rating ${index + 1}`}
            defaultValue={3}
          />
        ))}
      </div>,
    );
  });
});
