import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Select } from "./Select.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Select SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <select aria-label="Environment" defaultValue="preview">
              <option value="preview">Preview</option>
              <option value="production">Production</option>
            </select>
          </Fragment>
        ))}
      </>,
    );
  });
  bench("Flux 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <Select aria-label="Environment" defaultValue="preview">
              <option value="preview">Preview</option>
              <option value="production">Production</option>
            </Select>
          </Fragment>
        ))}
      </>,
    );
  });
});
