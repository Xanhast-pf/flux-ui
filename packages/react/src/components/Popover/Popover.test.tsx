import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Popover } from "./Popover.js";
describe("Popover", () => {
  it("opens by pointer, focuses an available control and restores the trigger on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Settings</Popover.Trigger>
        <Popover.Popup aria-label="Settings">
          <input type="hidden" />
          <button type="button" disabled>
            Unavailable
          </button>
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("dismisses outside in the popover owner document", () => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    if (ownerDocument === null) throw new Error("Missing iframe document.");
    const container = ownerDocument.createElement("div");
    ownerDocument.body.append(container);
    const rendered = render(
      <>
        <Popover.Root>
          <Popover.Trigger>Open realm popover</Popover.Trigger>
          <Popover.Popup aria-label="Realm popover">
            <Popover.Close>Done</Popover.Close>
          </Popover.Popup>
        </Popover.Root>
        <button type="button">Outside realm popover</button>
      </>,
      { container },
    );

    try {
      const trigger = container.querySelector<HTMLButtonElement>(
        'button[aria-haspopup="dialog"]',
      );
      const outside = [
        ...container.querySelectorAll<HTMLButtonElement>("button"),
      ].find((button) => button.textContent === "Outside realm popover");
      if (trigger === null || outside === undefined)
        throw new Error("Missing popover realm targets.");
      fireEvent.click(trigger);
      expect(container.querySelector('[role="dialog"]')).not.toHaveAttribute(
        "hidden",
      );
      fireEvent.pointerDown(outside);
      expect(container.querySelector('[role="dialog"]')).toHaveAttribute(
        "hidden",
      );
    } finally {
      rendered.unmount();
      iframe.remove();
    }
  });

  it("dismisses outside without stealing focus from the chosen control", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover.Root>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Popup aria-label="Example">
            <Popover.Close>Done</Popover.Close>
          </Popover.Popup>
        </Popover.Root>
        <button type="button">Outside</button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toHaveFocus();
  });
  it("leaves controlled ownership authoritative", async () => {
    const request = vi.fn();
    const user = userEvent.setup();
    render(
      <Popover.Root open onOpenChange={request}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Popup aria-label="Owned">
          <Popover.Close>Done</Popover.Close>
        </Popover.Popup>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(request).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog", { name: "Owned" })).toBeVisible();
  });
  it("exposes collision-resolved placement state for styling", async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Placement</Popover.Trigger>
        <Popover.Popup aria-label="Placement popup" side="right" align="end" />
      </Popover.Root>,
    );
    const popup = screen.getByRole("dialog", { name: "Placement popup" });
    await waitFor(() => {
      expect(popup).toHaveAttribute("data-state", "open");
      expect(popup).toHaveAttribute("data-side", "right");
      expect(popup).toHaveAttribute("data-align", "end");
    });
  });

  it("preserves trigger preventDefault and popup customization", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger onClick={(event) => event.preventDefault()}>
          Stay closed
        </Popover.Trigger>
        <Popover.Popup
          aria-label="Never opened"
          className="consumer-popup"
          data-testid="popup"
        />
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Stay closed" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("popup")).toHaveClass("consumer-popup");
  });

  it("accepts forwarded undefined open-state options", () => {
    render(
      <Popover.Root
        open={undefined}
        defaultOpen={undefined}
        onOpenChange={undefined}
      >
        <Popover.Trigger>Optional popover</Popover.Trigger>
        <Popover.Popup
          aria-label="Optional popup"
          side={undefined}
          align={undefined}
          offset={undefined}
          initialFocus={undefined}
        />
      </Popover.Root>,
    );
    expect(
      screen.getByRole("button", { name: "Optional popover" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
