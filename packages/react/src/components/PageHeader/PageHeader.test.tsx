import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

  it("preserves native header attributes and omits optional content cleanly", () => {
    const ref = createRef<HTMLElement>();
    render(
      <PageHeader
        ref={ref}
        title="Settings"
        className="consumer-header"
        style={{ paddingBlock: "1rem" }}
        data-page="settings"
      />,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Settings" });
    expect(ref.current).toBe(heading.closest("header"));
    expect(ref.current).toHaveClass("consumer-header");
    expect(ref.current?.style.paddingBlock).toBe("1rem");
    expect(ref.current).toHaveAttribute("data-page", "settings");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders semantic server markup", () => {
    const markup = renderToString(<PageHeader title="Release" level={3} />);
    expect(markup).toContain("<header");
    expect(markup).toContain("<h3");
    expect(markup).toContain("Release");
  });
});
