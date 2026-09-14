import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./DropdownMenu.js";
describe("DropdownMenu", () => {
  it("opens from the keyboard, skips disabled items and supports typeahead", async () => {
    const user = userEvent.setup();
    const selected = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Popup aria-label="Actions">
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={selected}>Export</DropdownMenu.Item>
        </DropdownMenu.Popup>
      </DropdownMenu.Root>,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Export" })).toHaveFocus();
    await user.keyboard("{Home}e");
    expect(screen.getByRole("menuitem", { name: "Export" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveFocus();
  });
  it("can open at the last item and lets consumer handlers cancel selection", async () => {
    const user = userEvent.setup();
    const selected = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
        <DropdownMenu.Popup aria-label="Actions">
          <DropdownMenu.Item>First</DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={(event) => event.preventDefault()}
            onSelect={selected}
          >
            Keep open
          </DropdownMenu.Item>
        </DropdownMenu.Popup>
      </DropdownMenu.Root>,
    );
    await user.tab();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Keep open" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(selected).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeVisible();
  });
});
