import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Pagination } from "./Pagination.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Pagination SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <nav aria-label="Pagination">
              <button type="button" disabled>
                Previous
              </button>
              <button type="button" aria-current="page" aria-label="Page 1">
                1
              </button>
              <button type="button" aria-label="Page 2">
                2
              </button>
              <button type="button">Next</button>
            </nav>
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
            <Pagination.Root page={1} pageCount={2} onPageChange={() => {}}>
              <Pagination.Previous />
              <Pagination.Page page={1} />
              <Pagination.Page page={2} />
              <Pagination.Next />
            </Pagination.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
