import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState.js";
describe("EmptyState", () => {
  it("uses the requested hierarchy and leaves real recovery actions to consumers", async () => {
    const user = userEvent.setup();
    const recover = vi.fn();
    render(
      <EmptyState
        title="No results"
        headingLevel={2}
        description="Try another query."
      >
        <button onClick={recover}>Clear</button>
      </EmptyState>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "No results",
    );
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(screen.getByRole("button"));
    expect(recover).toHaveBeenCalledOnce();
  });
});
