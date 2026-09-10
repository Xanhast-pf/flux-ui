import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner.js";
describe("Spinner", () => {
  it("announces the operation once through a status", () => {
    render(<Spinner label="Loading projects" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading projects");
    expect(screen.getAllByText("Loading projects")).toHaveLength(1);
  });
  it("supports a decorative indicator without a duplicate live region", () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });
  it("preserves refs, sizes and native styles", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Spinner
        ref={ref}
        size="lg"
        className="custom"
        style={{ margin: "0.25rem" }}
      />,
    );
    expect(ref.current).toBe(screen.getByRole("status"));
    expect(ref.current).toHaveAttribute("data-size", "lg");
    expect(ref.current?.style.margin).toBe("0.25rem");
  });
  it("renders an accessible server default", () => {
    const markup = renderToString(<Spinner />);
    expect(markup).toContain("Loading");
    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('label="');
  });
});
