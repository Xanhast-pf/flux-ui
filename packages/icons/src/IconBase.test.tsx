import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SearchIcon } from "./icons/SearchIcon.js";

describe("Flux icons", () => {
  it("is decorative by default", () => {
    const markup = renderToStaticMarkup(<SearchIcon />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain('role="img"');
  });

  it("becomes an accessible image when labelled", () => {
    const markup = renderToStaticMarkup(<SearchIcon aria-label="Search" />);
    expect(markup).toContain('aria-label="Search"');
    expect(markup).toContain('role="img"');
    expect(markup).not.toContain('aria-hidden="true"');
  });

  it("supports title, size, currentColor and native SVG attributes", () => {
    const markup = renderToStaticMarkup(
      <SearchIcon
        className="custom"
        data-project="flux"
        size={24}
        strokeWidth={2}
        title="Search"
      />,
    );
    expect(markup).toContain('width="24"');
    expect(markup).toContain('height="24"');
    expect(markup).toContain('stroke="currentColor"');
    expect(markup).toContain('stroke-width="2"');
    expect(markup).toContain("<title>Search</title>");
    expect(markup).toContain('class="custom"');
    expect(markup).toContain('data-project="flux"');
  });
  it("does not synthesize an image role from aria-hidden=false alone", () => {
    const markup = renderToStaticMarkup(<SearchIcon aria-hidden={false} />);
    expect(markup).toContain('aria-hidden="false"');
    expect(markup).not.toContain('role="img"');
  });

  it("lets explicit hidden state win even when a title is present", () => {
    const markup = renderToStaticMarkup(
      <SearchIcon aria-hidden="true" title="Search" />,
    );
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain('role="img"');
  });

  it("does not treat a blank title as an accessible name", () => {
    const markup = renderToStaticMarkup(<SearchIcon title="   " />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain("<title>");
  });
});
