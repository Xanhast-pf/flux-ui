import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link.js";
describe("Link", () => {
  it("keeps action-looking links as real links, including download and ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link
        href="/sample.txt"
        download="sample.txt"
        ref={ref}
        variant="solid"
        size="sm"
      >
        Download
      </Link>,
    );
    expect(ref.current).toBe(screen.getByRole("link", { name: "Download" }));
    expect(ref.current).toHaveAttribute("download", "sample.txt");
    expect(ref.current).not.toHaveAttribute("type");
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("does not invent activation or tab order for an anchor without href", () => {
    render(<Link>Unavailable</Link>);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Unavailable")).not.toHaveAttribute("tabindex");
  });
  it("passes aria-current to native navigation links", () => {
    render(
      <Link variant="navigation" href="#tokens" aria-current="page">
        Tokens
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });
});
