import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AlertDialog } from "./AlertDialog.js";
describe("AlertDialog", () => {
  it("shares modal labeling, cancels safely and ignores backdrop pointer presses", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Discard</AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Discard draft?</AlertDialog.Title>
          <AlertDialog.Description>
            This only changes a local draft.
          </AlertDialog.Description>
          <AlertDialog.Close>Keep draft</AlertDialog.Close>
          <button type="button">Confirm</button>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Discard" });
    await user.click(trigger);
    const dialog = screen.getByRole("alertdialog", { name: "Discard draft?" });
    expect(dialog).toHaveAccessibleDescription(
      "This only changes a local draft.",
    );
    fireEvent.pointerDown(dialog, {
      button: 0,
      clientX: -100,
      clientY: -100,
      isPrimary: true,
    });
    expect(dialog).toHaveAttribute("open");
    await user.click(screen.getByRole("button", { name: "Keep draft" }));
    expect(dialog).not.toHaveAttribute("open");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
