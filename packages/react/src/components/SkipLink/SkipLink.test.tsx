import { render, screen } from "@testing-library/react";
import { createRef } from "react";
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
});
