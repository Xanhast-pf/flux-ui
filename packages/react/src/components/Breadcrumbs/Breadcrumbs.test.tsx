import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs.js";
describe("Breadcrumbs", () => {
  it("uses named navigation, an ordered list, native links and a current location", () => {
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#home">Home</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Here</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("list").tagName).toBe("OL");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "#home",
    );
    expect(screen.getByText("Here")).toHaveAttribute("aria-current", "page");
    for (const separator of screen.getAllByText("/"))
      expect(separator).toHaveAttribute("aria-hidden", "true");
  });
  it("forwards native refs and class names", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Breadcrumbs.Root aria-label="Account trail">
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link
              href="#account"
              ref={ref}
              className="custom"
              style={{ margin: "0.25rem" }}
            >
              Account
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );
    expect(ref.current).toBe(screen.getByRole("link"));
    expect(ref.current).toHaveClass("custom");
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(screen.getByRole("navigation")).toHaveAccessibleName(
      "Account trail",
    );
  });
  it("is server safe", () => {
    const markup = renderToString(
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Here</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );
    expect(markup).toContain("<nav");
    expect(markup).toContain("<ol");
  });
});
