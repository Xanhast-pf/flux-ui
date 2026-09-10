import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Dialog } from "./Dialog.js";

describe("Dialog SSR", () => {
  bench("render 1,000 instances", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `dialog-${index}`).map(
          (id) => (
            <Dialog.Root key={id}>
              <Dialog.Trigger>Open</Dialog.Trigger>
              <Dialog.Popup>
                <Dialog.Title>{id}</Dialog.Title>
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Popup>
            </Dialog.Root>
          ),
        )}
      </div>,
    );
  });
});
