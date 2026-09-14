import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog.js";

describe("Dialog", () => {
  it("opens, labels itself, and closes from its close action", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open settings</Dialog.Trigger>
        <Dialog.Popup>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Update workspace preferences.</Dialog.Description>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription("Update workspace preferences.");

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root open onOpenChange={() => undefined}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Popup>
          <Dialog.Title>Controlled dialog</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Root>,
    );

    const dialog = screen.getByRole("dialog", { name: "Controlled dialog" });
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(dialog).toHaveAttribute("open");
  });
});

describe("Dialog native event isolation", () => {
  it("ignores a stale close event after the dialog has reopened", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Reopened dialog</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    const dialog = screen.getByRole("dialog", { name: "Reopened dialog" });
    fireEvent(dialog, new Event("close", { bubbles: true }));
    expect(dialog).toHaveAttribute("open");
  });
  it("does not close its ancestor when a nested native modal closes", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Outer modal</Dialog.Title>
          <Dialog.Root defaultOpen>
            <Dialog.Popup>
              <Dialog.Title>Inner modal</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Root>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    const outer = screen.getByRole("dialog", { name: "Outer modal" });
    const inner = screen.getByRole("dialog", { name: "Inner modal" });
    inner.removeAttribute("open");
    fireEvent(inner, new Event("close", { bubbles: true }));
    expect(outer).toHaveAttribute("open");
  });
});

describe("Dialog controlled native close reconciliation", () => {
  it("reopens when the owner declines a native close request", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog.Root open onOpenChange={onOpenChange}>
        <Dialog.Popup>
          <Dialog.Title>Controlled native close</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    const dialog = screen.getByRole("dialog", {
      name: "Controlled native close",
    });
    dialog.removeAttribute("open");
    fireEvent(dialog, new Event("close"));
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(dialog).toHaveAttribute("open");
  });
});
