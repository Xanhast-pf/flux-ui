import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton.js";
describe("Skeleton", () => {
  it("stays decorative and never introduces repeated loading statuses", () => {
    const { container } = render(
      <>
        <Skeleton />
        <Skeleton shape="block" />
        <Skeleton shape="circle" />
      </>,
    );
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.children).toHaveLength(3);
    for (const child of container.children) {
      expect(child).toHaveAttribute("aria-hidden", "true");
      expect(child).toBeEmptyDOMElement();
    }
  });
  it("preserves native span refs and custom dimensions", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Skeleton
        ref={ref}
        shape="circle"
        className="custom"
        style={{ width: "4rem" }}
        data-project="flux"
      />,
    );
    expect(ref.current?.style.width).toBe("4rem");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("data-shape", "circle");
  });
  it("is server safe without a loader state", () => {
    const markup = renderToString(<Skeleton />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain(" shape=");
  });
});
