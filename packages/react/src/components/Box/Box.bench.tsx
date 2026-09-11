import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Box } from "./Box.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `box-${index}`);
describe("Box SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Box key={id} as="section" padding={3}>
            {id}
          </Box>
        ))}
      </>,
    );
  });
});
