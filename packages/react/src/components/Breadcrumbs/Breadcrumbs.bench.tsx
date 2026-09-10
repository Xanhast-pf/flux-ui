import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Breadcrumbs SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <nav aria-label="Breadcrumb">
              <ol>
                <li>
                  <a href="#home">Home</a>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <span aria-current="page">Here</span>
                </li>
              </ol>
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
            <Breadcrumbs.Root>
              <Breadcrumbs.List>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Link href="#home">Home</Breadcrumbs.Link>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Current>Here</Breadcrumbs.Current>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Breadcrumbs.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
