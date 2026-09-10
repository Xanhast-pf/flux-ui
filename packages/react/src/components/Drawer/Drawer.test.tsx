import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Drawer } from "./Drawer.js";

describe("Drawer", () => {
  it("opens an edge-aligned labeled panel and closes it", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Open navigation</Drawer.Trigger>
        <Drawer.Popup side="left">
          <Drawer.Title>Navigation</Drawer.Title>
          <Drawer.Description>
            Browse documentation sections.
          </Drawer.Description>
          <Drawer.Close>Close navigation</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = screen.getByRole("dialog", { name: "Navigation" });
    expect(drawer).toHaveAttribute("data-side", "left");
    expect(drawer).toHaveAttribute("open");

    await user.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(drawer).not.toHaveAttribute("open");
  });
});
