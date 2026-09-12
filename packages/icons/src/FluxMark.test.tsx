import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FluxMarkIcon } from "./icons/FluxMarkIcon.js";

describe("Flux ribbon mark", () => {
  it("keeps the decorative, filled, currentColor icon contract", () => {
    const markup = renderToStaticMarkup(<FluxMarkIcon size={24} />);
    expect(markup).toContain('fill="currentColor"');
    expect(markup).toContain('stroke="none"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('width="24"');
    expect(markup).toContain('viewBox="0 0 20 20"');
    expect(markup.match(/<path /gu)).toHaveLength(1);
    expect(markup).not.toContain("<image");
  });

  it("preserves labels, native overrides, and independent repeated instances", () => {
    const markup = renderToStaticMarkup(
      <>
        <FluxMarkIcon title="Flux UI" fill="rebeccapurple" />
        <FluxMarkIcon aria-label="Flux UI mark" />
      </>,
    );
    expect(markup).toContain('fill="rebeccapurple"');
    expect(markup).toContain("<title>Flux UI</title>");
    expect(markup).toContain('aria-label="Flux UI mark"');
    expect(markup.match(/role="img"/gu)).toHaveLength(2);
    expect(markup).not.toContain(" id=");
  });
});
