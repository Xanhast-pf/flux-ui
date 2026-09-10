import { createRef, StrictMode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Toolbar } from "./Toolbar.js";
function Actions() {
  return (
    <>
      <Toolbar.Button>Copy</Toolbar.Button>
      <Toolbar.Button disabled>Cut</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="#help">Help</Toolbar.Link>
      <Toolbar.Button>Reset</Toolbar.Button>
    </>
  );
}
describe("Toolbar", () => {
  it("has a name, one tab stop, and native links", async () => {
    const user = userEvent.setup();
    render(
      <Toolbar.Root aria-label="Editor">
        <Actions />
      </Toolbar.Root>,
    );
    expect(screen.getByRole("toolbar", { name: "Editor" })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("link", { name: "Help" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus();
    expect(
      screen.getAllByRole("button").filter((node) => node.tabIndex === 0),
    ).toHaveLength(1);
  });
  it("supports vertical navigation and leaves unrelated keys alone", () => {
    render(
      <Toolbar.Root
        aria-label="Editor"
        orientation="vertical"
        loopFocus={false}
      >
        <Actions />
      </Toolbar.Root>,
    );
    const copy = screen.getByRole("button", { name: "Copy" });
    copy.focus();
    fireEvent.keyDown(copy, { key: "ArrowLeft" });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(copy, { key: "ArrowUp" });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(copy, { key: "ArrowDown" });
    expect(screen.getByRole("link", { name: "Help" })).toHaveFocus();
  });
  it("respects key cancellation and native click handlers", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button
          onClick={click}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") event.preventDefault();
          }}
        >
          Copy
        </Toolbar.Button>
        <Toolbar.Button>Paste</Toolbar.Button>
        <Toolbar.Button>Reset</Toolbar.Button>
      </Toolbar.Root>,
    );
    const copy = screen.getByRole("button", { name: "Copy" });
    copy.focus();
    await user.keyboard("{ArrowRight}");
    expect(copy).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("forwards object refs and runs React 19 callback cleanup", () => {
    const ref = createRef<HTMLButtonElement>();
    const cleanup = vi.fn();
    const callback = vi.fn((_node: HTMLAnchorElement | null) => cleanup);
    const { unmount } = render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button ref={ref}>Copy</Toolbar.Button>
        <Toolbar.Link href="#help" ref={callback}>
          Help
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(callback).toHaveBeenCalledWith(screen.getByRole("link"));
    unmount();
    expect(ref.current).toBeNull();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalledWith(null);
  });
  it("keeps StrictMode registration balanced", () => {
    const { unmount } = render(
      <StrictMode>
        <Toolbar.Root aria-label="Editor">
          <Actions />
        </Toolbar.Root>
      </StrictMode>,
    );
    const controls = [
      ...screen.getAllByRole("button"),
      screen.getByRole("link"),
    ];
    expect(controls.filter((node) => node.tabIndex === 0)).toHaveLength(1);
    unmount();
  });
  it("keeps sibling collections separate and skips hidden controls", () => {
    render(
      <>
        <Toolbar.Root aria-label="A">
          <Toolbar.Button>A1</Toolbar.Button>
          <Toolbar.Button hidden>A2</Toolbar.Button>
          <Toolbar.Button>A3</Toolbar.Button>
        </Toolbar.Root>
        <Toolbar.Root aria-label="B">
          <Toolbar.Button>B1</Toolbar.Button>
          <Toolbar.Button>B2</Toolbar.Button>
          <Toolbar.Button>B3</Toolbar.Button>
        </Toolbar.Root>
      </>,
    );
    const first = screen.getByRole("button", { name: "A1" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "A3" })).toHaveFocus();
    expect(
      within(screen.getByRole("toolbar", { name: "B" })).getByRole("button", {
        name: "B1",
      }),
    ).toHaveAttribute("tabindex", "0");
  });
  it("repairs the tab stop and DOM-order navigation after removal or reordering", () => {
    const make = (items: readonly string[]) => (
      <Toolbar.Root aria-label="Editor">
        {items.map((label) => (
          <Toolbar.Button key={label}>{label}</Toolbar.Button>
        ))}
      </Toolbar.Root>
    );
    const { rerender } = render(make(["One", "Two", "Three"]));
    screen.getByRole("button", { name: "Two" }).focus();
    rerender(make(["Three", "One"]));
    const three = screen.getByRole("button", { name: "Three" });
    expect(three).toHaveAttribute("tabindex", "0");
    three.focus();
    fireEvent.keyDown(three, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "One" })).toHaveFocus();
  });
  it("does not activate or focus aria-disabled links and buttons", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Copy</Toolbar.Button>
        <Toolbar.Link href="#help" aria-disabled onClick={click}>
          Help
        </Toolbar.Link>
        <Toolbar.Button aria-disabled onClick={click}>
          Cut
        </Toolbar.Button>
        <Toolbar.Button>Reset</Toolbar.Button>
      </Toolbar.Root>,
    );
    const copy = screen.getByRole("button", { name: "Copy" });
    copy.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(fireEvent.click(link)).toBe(false);
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cut" })).toBeDisabled();
  });
  it("keeps a stop when a hidden group is revealed, without mounting hidden controls", () => {
    const view = (hidden: boolean) => (
      <div hidden={hidden}>
        <Toolbar.Root aria-label="Editor">
          <Actions />
        </Toolbar.Root>
      </div>
    );
    const { rerender } = render(view(true));
    rerender(view(false));
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });
  it("keeps nested root collections isolated", () => {
    render(
      <Toolbar.Root aria-label="Outer">
        <Toolbar.Button>Outer first</Toolbar.Button>
        <Toolbar.Root aria-label="Inner">
          <Toolbar.Button>Inner first</Toolbar.Button>
          <Toolbar.Button>Inner last</Toolbar.Button>
        </Toolbar.Root>
        <Toolbar.Button>Outer last</Toolbar.Button>
      </Toolbar.Root>,
    );
    const first = screen.getByRole("button", { name: "Outer first" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Outer last" })).toHaveFocus();
    const inner = screen.getByRole("button", { name: "Inner first" });
    inner.focus();
    fireEvent.keyDown(inner, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Inner last" })).toHaveFocus();
  });
  it("is server safe and does not leak focus options", () => {
    const markup = renderToString(
      <Toolbar.Root aria-label="Editor" loopFocus={false}>
        <Actions />
      </Toolbar.Root>,
    );
    expect(markup).toContain('role="toolbar"');
    expect(markup).not.toContain("loopFocus=");
  });
  it("preserves native button props, pressed state and consumer styling", () => {
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button
          type="submit"
          name="action"
          value="save"
          aria-pressed="true"
          className="consumer"
          style={{ margin: "0.25rem" }}
        >
          Save
        </Toolbar.Button>
      </Toolbar.Root>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("name", "action");
    expect(button).toHaveAttribute("value", "save");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("consumer");
    expect(button.style.margin).toBe("0.25rem");
    expect(button).not.toHaveAttribute("loading");
  });

  it("skips loading actions and restores them to keyboard navigation when ready", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const view = (loading: boolean) => (
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Copy</Toolbar.Button>
        <Toolbar.Button loading={loading} onClick={click}>
          Save
        </Toolbar.Button>
        <Toolbar.Button>Reset</Toolbar.Button>
      </Toolbar.Root>
    );
    const { rerender } = render(view(true));
    const copy = screen.getByRole("button", { name: "Copy" });
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeDisabled();
    expect(save).toHaveAttribute("aria-busy", "true");
    copy.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Reset" })).toHaveFocus();
    rerender(view(false));
    expect(save).toBeEnabled();
    expect(save).not.toHaveAttribute("aria-busy");
    copy.focus();
    await user.keyboard("{ArrowRight}");
    expect(save).toHaveFocus();
    await user.keyboard(" ");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("keeps the native decorative separator ref and perpendicular orientation", () => {
    const ref = createRef<HTMLHRElement>();
    const view = (orientation: "horizontal" | "vertical") => (
      <Toolbar.Root aria-label="Editor" orientation={orientation}>
        <Toolbar.Button>Copy</Toolbar.Button>
        <Toolbar.Separator ref={ref} className="consumer" data-test="divider" />
        <Toolbar.Button>Paste</Toolbar.Button>
      </Toolbar.Root>
    );
    const { rerender } = render(view("horizontal"));
    expect(ref.current?.tagName).toBe("HR");
    expect(ref.current).toHaveAttribute("role", "none");
    expect(ref.current).toHaveAttribute("data-orientation", "vertical");
    expect(ref.current).not.toHaveAttribute("aria-orientation");
    expect(ref.current).toHaveClass("consumer");
    expect(ref.current).toHaveAttribute("data-test", "divider");
    rerender(view("vertical"));
    expect(ref.current).toHaveAttribute("data-orientation", "horizontal");
  });
});
