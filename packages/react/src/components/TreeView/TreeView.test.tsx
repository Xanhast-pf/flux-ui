import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeView } from "./TreeView.js";

function ExampleTree({
  value,
  onValueChange,
}: {
  value?: readonly string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;
}) {
  return (
    <TreeView.Root
      aria-label="Project files"
      {...(value === undefined
        ? { defaultValue: ["src"] }
        : { value, onValueChange: onValueChange ?? (() => {}) })}
    >
      <TreeView.Item value="src" label="src">
        <TreeView.Item value="src/components" label="components">
          <TreeView.Item value="src/components/button" label="Button.tsx" />
        </TreeView.Item>
        <TreeView.Item value="src/index" label="index.ts" />
      </TreeView.Item>
      <TreeView.Item value="package" label="package.json" />
    </TreeView.Root>
  );
}

describe("TreeView", () => {
  it("renders named tree, treeitem, and group semantics from nested items", () => {
    render(<ExampleTree />);

    const tree = screen.getByRole("tree", { name: "Project files" });
    const src = screen.getByRole("treeitem", { name: "src" });
    const components = screen.getByRole("treeitem", { name: "components" });

    expect(tree.tagName).toBe("UL");
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(components).toHaveAttribute("aria-expanded", "false");
    expect(within(src).getByRole("group")).toBeVisible();
    expect(
      within(components).getByRole("group", { hidden: true }),
    ).not.toBeVisible();
    expect(
      screen.getByRole("treeitem", { name: "package.json" }),
    ).not.toHaveAttribute("aria-expanded");
  });

  it("owns uncontrolled expansion through value/defaultValue semantics", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeView.Root
        aria-label="Files"
        defaultValue={[]}
        onValueChange={onValueChange}
      >
        <TreeView.Item value="src" label="src">
          <TreeView.Item value="index" label="index.ts" />
        </TreeView.Item>
      </TreeView.Root>,
    );

    const src = screen.getByRole("treeitem", { name: "src" });
    expect(src).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByText("src"));
    expect(src).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["src"]);

    await user.click(screen.getByText("src"));
    expect(src).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("reports controlled expansion without taking state ownership", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ExampleTree value={[]} onValueChange={onValueChange} />,
    );

    const src = screen.getByRole("treeitem", { name: "src" });
    await user.click(screen.getByText("src"));

    expect(onValueChange).toHaveBeenCalledWith(["src"]);
    expect(src).toHaveAttribute("aria-expanded", "false");

    rerender(<ExampleTree value={["src"]} onValueChange={onValueChange} />);
    expect(src).toHaveAttribute("aria-expanded", "true");
  });

  it("implements core tree keyboard navigation and expansion", async () => {
    const user = userEvent.setup();
    render(
      <TreeView.Root aria-label="Files">
        <TreeView.Item value="src" label="src">
          <TreeView.Item value="components" label="components">
            <TreeView.Item value="button" label="Button.tsx" />
          </TreeView.Item>
          <TreeView.Item value="index" label="index.ts" />
        </TreeView.Item>
        <TreeView.Item value="package" label="package.json" />
      </TreeView.Root>,
    );

    const src = screen.getByRole("treeitem", { name: "src" });
    src.focus();
    expect(src).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(src).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowRight}");
    const components = screen.getByRole("treeitem", { name: "components" });
    expect(components).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(components).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowRight}");
    const button = screen.getByRole("treeitem", { name: "Button.tsx" });
    expect(button).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(components).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(components).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: "index.ts" })).toHaveFocus();

    await user.keyboard("{End}");
    expect(
      screen.getByRole("treeitem", { name: "package.json" }),
    ).toHaveFocus();

    await user.keyboard("{Home}");
    expect(src).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(src).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Enter}");
    expect(src).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus back to a visible ancestor after controlled collapse", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ExampleTree
        value={["src", "src/components"]}
        onValueChange={onValueChange}
      />,
    );

    const button = screen.getByRole("treeitem", { name: "Button.tsx" });
    button.focus();
    expect(button).toHaveFocus();

    rerender(<ExampleTree value={[]} onValueChange={onValueChange} />);
    expect(screen.getByRole("treeitem", { name: "src" })).toHaveFocus();
  });

  it("skips aria-disabled items in the roving focus order", async () => {
    const user = userEvent.setup();
    render(
      <TreeView.Root aria-label="Files">
        <TreeView.Item value="a" label="Alpha" />
        <TreeView.Item value="b" label="Beta" aria-disabled="true" />
        <TreeView.Item value="c" label="Gamma" />
      </TreeView.Root>,
    );

    const alpha = screen.getByRole("treeitem", { name: "Alpha" });
    alpha.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: "Gamma" })).toHaveFocus();
  });

  it("forwards root/item escape hatches and refs", () => {
    const rootRef = createRef<HTMLUListElement>();
    const itemRef = createRef<HTMLLIElement>();

    render(
      <TreeView.Root
        ref={rootRef}
        aria-label="Files"
        className="custom-tree"
        data-project="flux"
        style={{ margin: "0.25rem" }}
      >
        <TreeView.Item
          ref={itemRef}
          value="src"
          label="src"
          className="custom-item"
          data-node="source"
          style={{ paddingInlineEnd: "1rem" }}
        />
      </TreeView.Root>,
    );

    const tree = screen.getByRole("tree", { name: "Files" });
    const item = screen.getByRole("treeitem", { name: "src" });

    expect(tree).toHaveClass("custom-tree");
    expect(tree).toHaveAttribute("data-project", "flux");
    expect(tree.style.margin).toBe("0.25rem");
    expect(item).toHaveClass("custom-item");
    expect(item).toHaveAttribute("data-node", "source");
    expect(item.style.paddingInlineEnd).toBe("1rem");
    expect(rootRef.current).toBe(tree);
    expect(itemRef.current).toBe(item);
  });

  it("rejects duplicate controlled expansion values", () => {
    expect(() =>
      render(
        <TreeView.Root
          aria-label="Files"
          value={["src", "src"]}
          onValueChange={() => {}}
        />,
      ),
    ).toThrow(/value must contain unique item values/u);
  });

  it("does not leak Flux-only state props into server markup", () => {
    const markup = renderToString(
      <TreeView.Root aria-label="Files" defaultValue={["src"]}>
        <TreeView.Item value="src" label="src">
          <TreeView.Item value="index" label="index.ts" />
        </TreeView.Item>
      </TreeView.Root>,
    );

    expect(markup).toContain('role="tree"');
    expect(markup).toContain('role="treeitem"');
    expect(markup).toContain('aria-expanded="true"');
    expect(markup).not.toContain("defaultValue=");
    expect(markup).not.toContain("onValueChange");
    expect(markup).not.toMatch(/\svalue=/u);
    expect(markup).not.toMatch(/\slabel=/u);
  });
});
