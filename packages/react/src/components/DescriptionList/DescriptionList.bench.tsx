import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { DescriptionList } from "./DescriptionList.js";
const ids = Array.from(
  { length: 1_000 },
  (_, index) => `description-list-${index}`,
);
describe("DescriptionList SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <DescriptionList key={id}>
            <DescriptionList.Term>ID</DescriptionList.Term>
            <DescriptionList.Details>{id}</DescriptionList.Details>
          </DescriptionList>
        ))}
      </>,
    );
  });
});
