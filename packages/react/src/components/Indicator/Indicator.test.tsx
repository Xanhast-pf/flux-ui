import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Indicator } from "./Indicator.js";

describe("Indicator", () => {
  it("keeps count overlays decorative while preserving the owning control", () => {
    render(
      <Indicator content={4}>
        <button type="button" aria-label="Inbox, 4 unread messages">
          Inbox
        </button>
      </Indicator>,
    );

    expect(
      screen.getByRole("button", { name: "Inbox, 4 unread messages" }),
    ).toBeInTheDocument();
    const marker = screen.getByText("4");
    expect(marker).toHaveAttribute("aria-hidden", "true");
  });

  it("caps numeric counts and supports dot indicators", () => {
    const { rerender } = render(
      <Indicator content={120} max={99}>
        <span>Notifications</span>
      </Indicator>,
    );
    expect(screen.getByText("99+")).toHaveAttribute("aria-hidden", "true");

    rerender(
      <Indicator>
        <span>Presence</span>
      </Indicator>,
    );
    const root = screen.getByText("Presence").parentElement;
    expect(root?.querySelector("[data-dot]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("forwards wrapper escape hatches and validates count policy", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Indicator
        ref={ref}
        content="New"
        tone="info"
        placement="bottom-start"
        className="custom-indicator"
        data-state="new"
        style={{ marginInline: "0.25rem" }}
      >
        <span>Messages</span>
      </Indicator>,
    );

    const root = screen.getByText("Messages").parentElement;
    expect(root).toHaveClass("custom-indicator");
    expect(root).toHaveAttribute("data-placement", "bottom-start");
    expect(root).toHaveAttribute("data-state", "new");
    expect(root?.style.marginInline).toBe("0.25rem");
    expect(ref.current).toBe(root);

    expect(() =>
      render(
        <Indicator content={-1}>
          <span>Bad</span>
        </Indicator>,
      ),
    ).toThrow(/non-negative/u);
  });

  it("is server safe", () => {
    const markup = renderToString(
      <Indicator content={4}>
        <span>Inbox</span>
      </Indicator>,
    );
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain(">4<");
  });
});
