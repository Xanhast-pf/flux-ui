import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader.js";
describe("PageHeader", () => {
  it("renders one meaningful heading, intro and native header ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <PageHeader
        title="Components"
        eyebrow="Reference"
        level={2}
        ref={ref}
        actions={<a href="#install">Install</a>}
      >
        <p>Everything you can compose.</p>
      </PageHeader>,
    );
    expect(ref.current?.tagName).toBe("HEADER");
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Components",
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "#install");
    expect(screen.getByText("Everything you can compose.")).toBeInTheDocument();
  });
});
