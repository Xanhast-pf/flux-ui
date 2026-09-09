import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Container } from "./Container.js";

describe("Container SSR", () => {
  bench("render 1,000 containers", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `container-${index}`).map(
          (id) => (
            <Container key={id}>{id}</Container>
          ),
        )}
      </div>,
    );
  });
});
