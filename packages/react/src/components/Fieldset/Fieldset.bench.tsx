import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Fieldset } from "./Fieldset.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `fieldset-${index}`);
describe("Fieldset SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fieldset key={id}>
            <Fieldset.Legend>{id}</Fieldset.Legend>
          </Fieldset>
        ))}
      </>,
    );
  });
});
