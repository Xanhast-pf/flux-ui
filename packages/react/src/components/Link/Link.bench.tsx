import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Link } from "./Link.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `link-${index}`);
describe("Link SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Link key={id} href="#example">
            {id}
          </Link>
        ))}
      </>,
    );
  });
});
