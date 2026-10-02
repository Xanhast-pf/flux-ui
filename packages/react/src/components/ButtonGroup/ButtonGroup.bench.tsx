import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Button } from "../Button/Button.js";
import { ButtonGroup } from "./ButtonGroup.js";

describe("ButtonGroup SSR", () => {
  bench("render 1,000 three-button groups", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <ButtonGroup key={index} aria-label="Actions">
            <Button>Save</Button>
            <Button>Export</Button>
            <Button>Share</Button>
          </ButtonGroup>
        ))}
      </div>,
    );
  });
});
