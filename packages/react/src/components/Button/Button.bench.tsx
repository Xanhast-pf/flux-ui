import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Button } from "./Button.js";

describe("Button SSR", () => {
  bench("render 1,000 buttons", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <Button key={index}>Button {index}</Button>
        ))}
      </div>,
    );
  });
});
