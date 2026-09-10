import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
