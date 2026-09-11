import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { ScrollArea } from "./ScrollArea.js";
const ids = Array.from({ length: 1_000 }, (_, index) => `scroll-area-${index}`);
describe("ScrollArea SSR", () => {
  bench("render 1,000 valid instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <ScrollArea key={id} aria-label={id}>
            {id}
          </ScrollArea>
        ))}
      </>,
    );
  });
});
