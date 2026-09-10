import { render, screen } from "@testing-library/react";
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
});
