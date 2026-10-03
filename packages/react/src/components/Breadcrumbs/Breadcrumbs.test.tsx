import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs.js";

function LongTrail() {
  return (
    <Breadcrumbs.Root>
      <Breadcrumbs.List maxItems={4} itemsAfterCollapse={2}>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#home">Home</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#workspace">Workspace</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#library">Library</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#patterns">Patterns</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#navigation">Navigation</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

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

  it("collapses long trails and expands them without moving disclosure focus", async () => {
    const user = userEvent.setup();
    render(<LongTrail />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(
      screen.queryByRole("link", { name: "Workspace" }),
    ).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", {
      name: "Show full breadcrumb path",
    });
    await user.click(toggle);

    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "Workspace" })).toBeInTheDocument();
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Collapse breadcrumb path");

    await user.click(toggle);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("allows localized disclosure labels and an initially expanded trail", () => {
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.List
          maxItems={3}
          defaultExpanded
          expandLabel="Afficher le chemin"
          collapseLabel="Réduire le chemin"
        >
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#one">One</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#two">Two</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#three">Three</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Four</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );

    expect(
      screen.getByRole("button", { name: "Réduire le chemin" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Two" })).toBeInTheDocument();
  });

  it("rejects invalid collapse contracts", () => {
    for (const maxItems of [0, 2, 3.5, Infinity, NaN])
      expect(() =>
        renderToString(
          <Breadcrumbs.Root>
            <Breadcrumbs.List maxItems={maxItems}>
              <Breadcrumbs.Item>One</Breadcrumbs.Item>
              <Breadcrumbs.Item>Two</Breadcrumbs.Item>
              <Breadcrumbs.Item>Three</Breadcrumbs.Item>
              <Breadcrumbs.Item>Four</Breadcrumbs.Item>
            </Breadcrumbs.List>
          </Breadcrumbs.Root>,
        ),
      ).toThrow(RangeError);

    expect(() =>
      renderToString(
        <Breadcrumbs.Root>
          <Breadcrumbs.List
            maxItems={4}
            itemsBeforeCollapse={2}
            itemsAfterCollapse={2}
          >
            <Breadcrumbs.Item>One</Breadcrumbs.Item>
            <Breadcrumbs.Item>Two</Breadcrumbs.Item>
            <Breadcrumbs.Item>Three</Breadcrumbs.Item>
            <Breadcrumbs.Item>Four</Breadcrumbs.Item>
            <Breadcrumbs.Item>Five</Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>,
      ),
    ).toThrow(RangeError);
  });

  it("allows decorative separators to match product language or be omitted", () => {
    const { container } = render(
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item separator="›">
            <Breadcrumbs.Link href="#one">One</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item separator={null}>
            <Breadcrumbs.Current>Two</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );
    const separators = container.querySelectorAll("[aria-hidden='true']");
    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveTextContent("›");
    expect(separators[1]).toBeEmptyDOMElement();
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
        <Breadcrumbs.List maxItems={3}>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#one">One</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#two">Two</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#three">Three</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Here</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );
    expect(markup).toContain("<nav");
    expect(markup).toContain("<ol");
    expect(markup).toContain("Show full breadcrumb path");
    expect(markup).not.toContain(">Two<");
  });
});
