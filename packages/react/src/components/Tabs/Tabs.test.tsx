import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "./Tabs.js";

describe("Tabs", () => {
  it("switches panels while maintaining tab semantics", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List aria-label="Project views">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="activity">Activity content</Tabs.Panel>
      </Tabs.Root>,
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Overview content")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Activity content")).toBeVisible();
    expect(screen.getByText("Overview content")).not.toBeVisible();
  });

  it("moves focus with arrow keys and can activate on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Examples" activateOnFocus>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
          <Tabs.Tab value="three">Three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">One panel</Tabs.Panel>
        <Tabs.Panel value="two">Two panel</Tabs.Panel>
        <Tabs.Panel value="three">Three panel</Tabs.Panel>
      </Tabs.Root>,
    );

    const first = screen.getByRole("tab", { name: "One" });
    first.focus();
    await user.keyboard("{ArrowRight}");

    const second = screen.getByRole("tab", { name: "Two" });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Two panel")).toBeVisible();
  });
  it("keeps nested orientation, size, appearance and keyboard state local", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root
        defaultValue="outer"
        orientation="vertical"
        size="sm"
        appearance="pill"
      >
        <Tabs.List aria-label="Outer tabs" activateOnFocus>
          <Tabs.Tab value="outer">Outer</Tabs.Tab>
          <Tabs.Tab value="other">Other</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="outer">
          <Tabs.Root defaultValue="first">
            <Tabs.List aria-label="Inner tabs" activateOnFocus>
              <Tabs.Tab value="first">First</Tabs.Tab>
              <Tabs.Tab value="second">Second</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="first">First content</Tabs.Panel>
            <Tabs.Panel value="second">Second content</Tabs.Panel>
          </Tabs.Root>
        </Tabs.Panel>
        <Tabs.Panel value="other">Other content</Tabs.Panel>
      </Tabs.Root>,
    );
    const inner = screen.getByRole("tablist", { name: "Inner tabs" });
    expect(inner).toHaveAttribute("aria-orientation", "horizontal");
    const first = within(inner).getByRole("tab", { name: "First" });
    expect(first).not.toHaveAttribute("data-s", "sm");
    expect(first).not.toHaveAttribute("data-a", "pill");
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(first).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(within(inner).getByRole("tab", { name: "Second" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Outer" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Second content")).toBeVisible();
  });
});

describe("Tabs hardening", () => {
  it.each([
    ["horizontal", "ltr", "ArrowRight", "ArrowLeft", "ArrowDown"],
    ["horizontal", "rtl", "ArrowLeft", "ArrowRight", "ArrowUp"],
    ["vertical", "ltr", "ArrowDown", "ArrowUp", "ArrowRight"],
    ["vertical", "rtl", "ArrowDown", "ArrowUp", "ArrowLeft"],
  ] as const)(
    "preserves %s %s navigation with and without looping",
    (orientation, direction, nextKey, previousKey, wrongAxis) => {
      for (const loopFocus of [true, false]) {
        const view = render(
          <Tabs.Root defaultValue="one" orientation={orientation}>
            <Tabs.List style={{ direction }} loopFocus={loopFocus}>
              <Tabs.Tab value="one">First</Tabs.Tab>
              <Tabs.Tab value="two">Second</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>,
        );
        const [first, second] = view.getAllByRole("tab");
        if (!first || !second) throw new Error("Expected two tabs");
        first.focus();
        for (const key of [wrongAxis, "Tab", "Enter", "Escape", "a"]) {
          expect(fireEvent.keyDown(first, { key })).toBe(true);
          expect(first).toHaveFocus();
        }
        expect(fireEvent.keyDown(first, { key: nextKey })).toBe(false);
        expect(second).toHaveFocus();
        fireEvent.keyDown(second, { key: nextKey });
        expect(loopFocus ? first : second).toHaveFocus();
        fireEvent.keyDown(
          view.getByRole("tab", { name: loopFocus ? "First" : "Second" }),
          { key: "Home" },
        );
        expect(first).toHaveFocus();
        fireEvent.keyDown(first, { key: previousKey });
        expect(loopFocus ? second : first).toHaveFocus();
        fireEvent.keyDown(
          view.getByRole("tab", { name: loopFocus ? "Second" : "First" }),
          { key: "End" },
        );
        expect(second).toHaveFocus();
        expect(first).toHaveAttribute("aria-selected", "true");
        view.unmount();
      }
    },
  );

  it("leaves keys from a nested tablist outside the outer collection", () => {
    render(
      <Tabs.Root defaultValue="outer" orientation="vertical">
        <Tabs.List aria-label="Outer collection" activateOnFocus>
          <Tabs.Tab value="outer">Outer tab</Tabs.Tab>
          <Tabs.Root defaultValue="inner">
            <Tabs.List aria-label="Inner collection">
              <Tabs.Tab value="inner">Inner tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
          <Tabs.Tab value="other">Other outer tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    const inner = screen.getByRole("tab", { name: "Inner tab" });
    inner.focus();
    expect(fireEvent.keyDown(inner, { key: "ArrowDown" })).toBe(true);
    expect(inner).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Outer tab" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("skips hidden, inert, aria-disabled and nested tab collections", () => {
    render(
      <Tabs.Root defaultValue="first">
        <Tabs.List aria-label="Hardened tabs" activateOnFocus>
          <Tabs.Tab value="first">First available</Tabs.Tab>
          <Tabs.Tab value="hidden" hidden>
            Hidden tab
          </Tabs.Tab>
          <div inert>
            <Tabs.Tab value="inert">Inert tab</Tabs.Tab>
          </div>
          <Tabs.Tab value="disabled" aria-disabled>
            Unavailable tab
          </Tabs.Tab>
          <Tabs.Tab value="last">Last available</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">First panel</Tabs.Panel>
        <Tabs.Panel value="last">Last panel</Tabs.Panel>
      </Tabs.Root>,
    );
    const first = screen.getByRole("tab", { name: "First available" });
    const last = screen.getByRole("tab", { name: "Last available" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(last).toHaveFocus();
    expect(last).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Unavailable tab" }));
    expect(last).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(last, { key: "Home" });
    expect(first).toHaveFocus();
  });
  it("does not hijack modified shortcuts or a consumer-cancelled key", () => {
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List
          aria-label="Shortcuts"
          onKeyDown={(event) => {
            if (event.key === "End") event.preventDefault();
          }}
        >
          <Tabs.Tab value="one">One shortcut</Tabs.Tab>
          <Tabs.Tab value="two">Two shortcut</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    const first = screen.getByRole("tab", { name: "One shortcut" });
    first.focus();
    for (const modifier of ["ctrlKey", "altKey", "metaKey"])
      fireEvent.keyDown(first, { key: "ArrowRight", [modifier]: true });
    fireEvent.keyDown(first, { key: "End" });
    expect(first).toHaveFocus();
  });
});
