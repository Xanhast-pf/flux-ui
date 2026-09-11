import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Text } from "./Text.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `text-${index}`);
describe("Text SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Text key={id} variant="caption">
            {id}
          </Text>
        ))}
      </>,
    );
  });
});
