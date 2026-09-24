import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
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
        <button type="button" onClick={recover}>
          Clear
        </button>
      </EmptyState>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "No results",
    );
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(screen.getByRole("button"));
    expect(recover).toHaveBeenCalledOnce();
  });

  it("preserves root refs and native escape hatches without inventing live semantics", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <EmptyState
        ref={ref}
        title="Nothing here"
        className="consumer-empty"
        style={{ minBlockSize: "10rem" }}
        data-state="empty"
      />,
    );
    const heading = screen.getByRole("heading", { name: "Nothing here" });
    const root = heading.parentElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("consumer-empty");
    expect(root?.style.minBlockSize).toBe("10rem");
    expect(root).toHaveAttribute("data-state", "empty");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders quiet server content without requiring a description", () => {
    const markup = renderToString(<EmptyState title="No activity" />);
    expect(markup).toContain("No activity");
    expect(markup).not.toContain('role="alert"');
    expect(markup).not.toContain('role="status"');
  });
});
