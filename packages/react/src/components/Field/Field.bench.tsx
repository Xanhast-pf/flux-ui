import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Field } from "./Field.js";

describe("Field SSR", () => {
  bench("render 1,000 fields", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `field-${index}`).map(
          (id) => (
            <Field.Root id={id} key={id}>
              <Field.Label>{id}</Field.Label>
              <Field.Control>
                <input />
              </Field.Control>
              <Field.Description>Description</Field.Description>
            </Field.Root>
          ),
        )}
      </div>,
    );
  });
});
