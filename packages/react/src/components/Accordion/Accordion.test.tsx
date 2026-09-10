import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "./Accordion.js";
function Items() {
  return (
    <>
      <Accordion.Item>
        <Accordion.Trigger>One</Accordion.Trigger>
        <Accordion.Content>First answer</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>Two</Accordion.Trigger>
        <Accordion.Content>Second answer</Accordion.Content>
      </Accordion.Item>
    </>
  );
}
describe("Accordion", () => {
  it("keeps summaries first and assigns a shared native group name", () => {
    const { container } = render(
      <Accordion.Root>
        <Items />
      </Accordion.Root>,
    );
    const items = Array.from(container.querySelectorAll("details"));
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("name")).toBeTruthy();
    expect(items[0]?.getAttribute("name")).toBe(items[1]?.getAttribute("name"));
    for (const item of items)
      expect(item.firstElementChild?.tagName).toBe("SUMMARY");
  });
  it("isolates sibling groups and omits grouping in multiple mode", () => {
    const { container } = render(
      <>
        <Accordion.Root>
          <Items />
        </Accordion.Root>
        <Accordion.Root>
          <Items />
        </Accordion.Root>
        <Accordion.Root type="multiple">
          <Items />
        </Accordion.Root>
      </>,
    );
    const items = Array.from(container.querySelectorAll("details"));
    expect(items[0]?.getAttribute("name")).not.toBe(
      items[2]?.getAttribute("name"),
    );
    expect(items[4]).not.toHaveAttribute("name");
  });
  it("preserves native open, toggle, refs and consumer styling", () => {
    const ref = createRef<HTMLDetailsElement>();
    const toggle = vi.fn();
    render(
      <Accordion.Root name="faq">
        <Accordion.Item
          ref={ref}
          open
          onToggle={toggle}
          className="custom"
          style={{ margin: "0.25rem" }}
        >
          <Accordion.Trigger>Open answer</Accordion.Trigger>
          <Accordion.Content>Answer</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(ref.current?.open).toBe(true);
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(screen.getByText("Answer")).toBeVisible();
    if (ref.current === null) throw new Error("Missing details element");
    fireEvent(ref.current, new Event("toggle"));
    expect(toggle).toHaveBeenCalled();
  });
  it("renders the native relationship without extra ARIA roles on the server", () => {
    const markup = renderToString(
      <Accordion.Root name="faq">
        <Items />
      </Accordion.Root>,
    );
    expect(markup).toContain('name="faq"');
    expect(markup).toContain("<summary");
    expect(markup).not.toContain('role="button"');
  });
});
