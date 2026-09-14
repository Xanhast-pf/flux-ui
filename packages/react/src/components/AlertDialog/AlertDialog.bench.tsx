import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { AlertDialog } from "./AlertDialog.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("AlertDialog representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <button type="button">Discard draft</button>
        <dialog role="alertdialog" aria-label="Discard this draft?">
          <p>This example does not delete remote data.</p>
          <button type="button">Keep draft</button>
        </dialog>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <AlertDialog.Root>
          <AlertDialog.Trigger>Discard draft</AlertDialog.Trigger>
          <AlertDialog.Popup>
            <AlertDialog.Title>Discard this draft?</AlertDialog.Title>
            <AlertDialog.Description>
              This example does not delete remote data.
            </AlertDialog.Description>
            <AlertDialog.Close>Keep draft</AlertDialog.Close>
          </AlertDialog.Popup>
        </AlertDialog.Root>
      </>,
    );
  });
});
