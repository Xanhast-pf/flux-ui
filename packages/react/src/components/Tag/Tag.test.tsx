import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./Tag.js";
describe("Tag", () => {
  it("accepts explicit optional absence without conditional spreads", () => {
    const tone: "neutral" | "accent" | undefined = undefined;
    const onRemove: undefined = undefined;
    const removeLabel: undefined = undefined;
    render(
      <Tag tone={tone} onRemove={onRemove} removeLabel={removeLabel}>
        Design
      </Tag>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("provides a specifically named removal action without swallowing the label", async () => {
    const user = userEvent.setup();
    const remove = vi.fn();
    render(
      <Tag
        className="consumer"
        onRemove={remove}
        removeLabel="Remove Design filter"
      >
        Design
      </Tag>,
    );
    expect(screen.getByText("Design")).toHaveClass("consumer");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(remove).toHaveBeenCalledOnce();
  });
  it("does not make passive labels interactive", () => {
    render(<Tag>Design</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
