import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Footer } from "./Footer.js";

describe("Footer SSR", () => {
  bench("render 1,000 instances", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => "footer-" + index).map(
          (id) => (
            <Footer key={id}>{id}</Footer>
          ),
        )}
      </div>,
    );
  });
});
