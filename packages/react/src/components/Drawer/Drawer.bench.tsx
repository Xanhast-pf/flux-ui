import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Drawer } from "./Drawer.js";

describe("Drawer SSR", () => {
  bench("render 1,000 instances", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `drawer-${index}`).map(
          (id) => (
            <Drawer.Root key={id}>
              <Drawer.Trigger>Open</Drawer.Trigger>
              <Drawer.Popup>
                <Drawer.Title>{id}</Drawer.Title>
                <Drawer.Close>Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          ),
        )}
      </div>,
    );
  });
});
