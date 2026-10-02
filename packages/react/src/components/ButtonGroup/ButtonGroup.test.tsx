import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button.js";
import { ButtonGroup } from "./ButtonGroup.js";

describe("ButtonGroup", () => {
  it("provides named group semantics without owning button state", async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup aria-label="Document actions">
        <Button variant="outline">Save</Button>
        <Button variant="outline" disabled>
          Delete
        </Button>
        <Button variant="outline">Share</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group", { name: "Document actions" });
    expect(group).toHaveAttribute("data-orientation", "horizontal");

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
  });

  it("supports vertical geometry and native wrapper escape hatches", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ButtonGroup
        ref={ref}
        aria-label="View actions"
        orientation="vertical"
        className="custom-group"
        data-density="compact"
        style={{ marginBlock: "0.25rem" }}
      >
        <Button>List</Button>
        <Button>Grid</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group).toHaveClass("custom-group");
    expect(group).toHaveAttribute("data-density", "compact");
    expect(group.style.marginBlock).toBe("0.25rem");
    expect(ref.current).toBe(group);
  });

  it("is server safe and carries no selection contract", () => {
    const markup = renderToString(
      <ButtonGroup aria-label="Actions">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(markup).toContain('role="group"');
    expect(markup).not.toContain("aria-pressed");
  });
});
