import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Collapsible } from "./Collapsible.js";
describe("Collapsible", () => {
  it("composes native details, direct summary and content", () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <Collapsible.Root ref={ref} name="faq" className="custom">
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(ref.current?.tagName).toBe("DETAILS");
    expect(ref.current?.firstElementChild?.tagName).toBe("SUMMARY");
    expect(ref.current).toHaveAttribute("name", "faq");
    expect(ref.current).toHaveClass("custom");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
  it("passes native open and toggle", () => {
    const ref = createRef<HTMLDetailsElement>();
    const onToggle = vi.fn();
    render(
      <Collapsible.Root ref={ref} open onToggle={onToggle}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(ref.current?.open).toBe(true);
    if (ref.current === null) throw new Error("Missing details element");
    fireEvent(ref.current, new Event("toggle"));
    expect(onToggle).toHaveBeenCalled();
  });
  it("is server-renderable without a provider", () => {
    const markup = renderToString(
      <Collapsible.Root>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(markup).toContain("<summary");
    expect(markup).not.toContain('role="button"');
  });
});
