import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./SkipLink.js";

describe("SkipLink", () => {
  it("preserves a native fragment link and ref without hijacking navigation", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <>
        <SkipLink ref={ref} href="#content">
          Skip to content
        </SkipLink>
        <main id="content" tabIndex={-1}>
          Content
        </main>
      </>,
    );
    expect(screen.getByRole("link", { name: "Skip to content" })).toBe(
      ref.current,
    );
    expect(ref.current).toHaveAttribute("href", "#content");
    expect(ref.current).not.toHaveAttribute("tabindex");
  });

  it("provides a useful default label while preserving native link escape hatches", () => {
    render(
      <SkipLink
        href="#main"
        className="consumer"
        style={{ insetInlineStart: "1rem" }}
        data-project="flux"
      />,
    );
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveAttribute("href", "#main");
    expect(link).toHaveClass("consumer");
    expect(link.style.insetInlineStart).toBe("1rem");
    expect(link).toHaveAttribute("data-project", "flux");
  });

  it("renders a normal server-side anchor", () => {
    expect(renderToString(<SkipLink href="#main" />)).toContain('href="#main"');
  });
});
