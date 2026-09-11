import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { SkipLink } from "./SkipLink.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `skip-link-${index}`);
describe("SkipLink SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <SkipLink key={id} href="#content">
            {id}
          </SkipLink>
        ))}
      </>,
    );
  });
});
