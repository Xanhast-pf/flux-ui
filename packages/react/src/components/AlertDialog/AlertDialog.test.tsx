import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
          <AlertDialog.Cancel>Keep draft</AlertDialog.Cancel>
          <button type="button">Confirm</button>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Discard" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    const dialog = screen.getByRole("alertdialog", { name: "Discard draft?" });
    expect(dialog).toHaveAttribute("data-state", "open");
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
    expect(dialog).toHaveAttribute("data-state", "closed");
    expect(trigger).toHaveAttribute("data-state", "closed");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("runs the action handler before closing", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete workspace</AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
          <AlertDialog.Action onClick={onAction}>Delete</AlertDialog.Action>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Delete workspace" }));
    const dialog = screen.getByRole("alertdialog", {
      name: "Delete workspace?",
    });
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(dialog).not.toHaveAttribute("open");
  });

  it("supports controlled destructive-confirmation state without forcing closure", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AlertDialog.Root open onOpenChange={onOpenChange}>
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete workspace?</AlertDialog.Title>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    const dialog = screen.getByRole("alertdialog", {
      name: "Delete workspace?",
    });
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog).toHaveAttribute("open");
  });

  it("always exposes alertdialog semantics instead of accepting a weaker role", () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Popup>
          <AlertDialog.Title>Confirm</AlertDialog.Title>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    expect(
      screen.getByRole("alertdialog", { name: "Confirm" }),
    ).toHaveAttribute("open");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
