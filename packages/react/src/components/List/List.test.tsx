import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { List } from "./List.js";
describe("List", () => {
  it("retains ordered list numbering, native items and refs", () => {
    const ref = createRef<HTMLOListElement>();
    render(
      <List as="ol" start={3} ref={ref}>
        <List.Item>Three</List.Item>
        <List.Item>Four</List.Item>
      </List>,
    );
    expect(screen.getByRole("list")).toBe(ref.current);
    expect(ref.current?.tagName).toBe("OL");
    expect(ref.current).toHaveAttribute("start", "3");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
  it("retains list semantics when markers are visually removed", () => {
    render(
      <List variant="plain">
        <List.Item>One</List.Item>
      </List>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
  });
});
