import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { List } from "./List.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `list-${index}`);
describe("List SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <List key={id}>
            <List.Item>{id}</List.Item>
          </List>
        ))}
      </>,
    );
  });
});
