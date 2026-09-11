import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { PageHeader } from "./PageHeader.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `page-header-${index}`);
describe("PageHeader SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <PageHeader key={id} title={id} level={2} />
        ))}
      </>,
    );
  });
});
