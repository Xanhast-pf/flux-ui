import { render, screen, within } from "@testing-library/react";
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
