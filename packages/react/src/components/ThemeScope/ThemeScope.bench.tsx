import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ThemeScope } from "./ThemeScope.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `theme-scope-${index}`);
describe("ThemeScope SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <ThemeScope key={id} theme="dark">
            {id}
          </ThemeScope>
        ))}
      </>,
    );
  });
});
