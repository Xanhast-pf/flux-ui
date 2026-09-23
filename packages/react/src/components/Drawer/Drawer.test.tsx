import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("measures the classic scrollbar before opening", async () => {
    const user = userEvent.setup();
    const clientWidth = vi
      .spyOn(document.documentElement, "clientWidth", "get")
      .mockReturnValue(1000);
    const innerWidth = vi
      .spyOn(window, "innerWidth", "get")
      .mockReturnValue(1024);
    const property = "--g";

    try {
      render(
        <Drawer.Root>
          <Drawer.Trigger>Open compensated drawer</Drawer.Trigger>
          <Drawer.Popup>
            <Drawer.Title>Compensated drawer</Drawer.Title>
          </Drawer.Popup>
        </Drawer.Root>,
      );

      await user.click(
        screen.getByRole("button", { name: "Open compensated drawer" }),
      );
      expect(document.documentElement.style.getPropertyValue(property)).toBe(
        "24px",
      );
    } finally {
      document.documentElement.style.removeProperty(property);
      clientWidth.mockRestore();
      innerWidth.mockRestore();
    }
  });
});

it("accepts forwarded undefined options without consumer conditional spreads", () => {
  render(
    <Drawer.Root
      open={undefined}
      defaultOpen={undefined}
      onOpenChange={undefined}
    >
      <Drawer.Trigger>Open optional drawer</Drawer.Trigger>
      <Drawer.Popup side={undefined} closeOnBackdrop={undefined}>
        <Drawer.Title>Optional drawer</Drawer.Title>
      </Drawer.Popup>
    </Drawer.Root>,
  );
  expect(
    screen.getByRole("button", { name: "Open optional drawer" }),
  ).toHaveAttribute("aria-expanded", "false");
});
