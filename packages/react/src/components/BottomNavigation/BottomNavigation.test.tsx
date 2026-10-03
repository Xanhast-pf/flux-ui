import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BottomNavigation } from "./BottomNavigation.js";

describe("BottomNavigation", () => {
  it("renders a named navigation landmark with real destination links", () => {
    render(
      <BottomNavigation aria-label="Primary destinations">
        <BottomNavigation.Item
          href="#home"
          current
          icon={<span>decorative</span>}
        >
          Home
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#search">Search</BottomNavigation.Item>
      </BottomNavigation>,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Primary destinations",
    });
    const home = within(navigation).getByRole("link", { name: "Home" });
    const search = within(navigation).getByRole("link", { name: "Search" });

    expect(home).toHaveAttribute("href", "#home");
    expect(home).toHaveAttribute("aria-current", "page");
    expect(search).not.toHaveAttribute("aria-current");
    expect(within(home).getByText("decorative").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps normal link tab order instead of introducing roving focus", async () => {
    const user = userEvent.setup();
    render(
      <BottomNavigation aria-label="Application">
        <BottomNavigation.Item href="#home">Home</BottomNavigation.Item>
        <BottomNavigation.Item href="#search">Search</BottomNavigation.Item>
        <BottomNavigation.Item href="#profile">Profile</BottomNavigation.Item>
      </BottomNavigation>,
    );

    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Search" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Profile" })).toHaveFocus();
  });

  it("preserves native refs, className and style escape hatches", () => {
    const rootRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLAnchorElement>();

    render(
      <BottomNavigation
        ref={rootRef}
        aria-label="Workspace"
        className="custom-root"
        style={{ maxInlineSize: "24rem" }}
      >
        <BottomNavigation.Item
          ref={itemRef}
          href="#files"
          className="custom-item"
          style={{ letterSpacing: "0.01em" }}
        >
          Files
        </BottomNavigation.Item>
      </BottomNavigation>,
    );

    expect(rootRef.current).toHaveClass("custom-root");
    expect(rootRef.current?.style.maxInlineSize).toBe("24rem");
    expect(itemRef.current).toHaveClass("custom-item");
    expect(itemRef.current?.style.letterSpacing).toBe("0.01em");
  });

  it("is server safe and deterministic", () => {
    const markup = renderToString(
      <BottomNavigation aria-label="Primary">
        <BottomNavigation.Item href="/home" current>
          Home
        </BottomNavigation.Item>
      </BottomNavigation>,
    );

    expect(markup).toContain("<nav");
    expect(markup).toContain('aria-label="Primary"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('href="/home"');
  });
});
