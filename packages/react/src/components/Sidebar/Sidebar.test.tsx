import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar.js";

function Content() {
  return (
    <>
      <Sidebar.Toggle>Navigation</Sidebar.Toggle>
      <Sidebar.Layout>
        <Sidebar.Panel aria-label="Site navigation">
          <Sidebar.Close>Close navigation</Sidebar.Close>
          <input aria-label="Persistent search" />
        </Sidebar.Panel>
        <Sidebar.Content>
          <button>Page action</button>
        </Sidebar.Content>
      </Sidebar.Layout>
    </>
  );
}
describe("Sidebar", () => {
  it("stays mounted, non-modal and operable until explicitly closed", async () => {
    const user = userEvent.setup();
    render(
      <Sidebar.Root>
        <Content />
      </Sidebar.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Navigation" });
    const panel = screen.getByRole("complementary", { hidden: true });
    expect(panel).toHaveAttribute("hidden");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector("[inert]")).toBeNull();
    await user.type(
      screen.getByRole("textbox", { name: "Persistent search" }),
      "kept",
    );
    await user.keyboard("{Escape}");
    expect(panel).not.toHaveAttribute("hidden");
    await user.click(screen.getByRole("button", { name: "Page action" }));
    expect(panel).not.toHaveAttribute("hidden");
    await user.click(screen.getByRole("button", { name: "Close navigation" }));
    expect(panel).toHaveAttribute("hidden");
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(
      screen.getByRole("textbox", { name: "Persistent search" }),
    ).toHaveValue("kept");
  });
  it("honors controlled updates, cancellation and native refs", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
      <Sidebar.Root open={false} onOpenChange={change}>
        <Sidebar.Toggle>Toggle controlled</Sidebar.Toggle>
        <Sidebar.Panel ref={ref} aria-label="Controlled">
          Content
        </Sidebar.Panel>
      </Sidebar.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle controlled" }));
    expect(change).toHaveBeenCalledWith(true);
    expect(ref.current).toHaveAttribute("hidden");
    rerender(
      <Sidebar.Root open onOpenChange={change}>
        <Sidebar.Toggle onClick={(event) => event.preventDefault()}>
          Toggle controlled
        </Sidebar.Toggle>
        <Sidebar.Panel ref={ref} aria-label="Controlled">
          Content
        </Sidebar.Panel>
      </Sidebar.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle controlled" }));
    expect(change).toHaveBeenCalledTimes(1);
    expect(ref.current).not.toHaveAttribute("hidden");
  });
  it("returns focus on a controlled close but does not steal focus from the page", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Sidebar.Root open={open} onOpenChange={setOpen}>
          <Sidebar.Toggle>Site toggle</Sidebar.Toggle>
          <Sidebar.Panel aria-label="Controlled navigation">
            <button onClick={() => setOpen(false)}>Close internally</button>
          </Sidebar.Panel>
          <button onClick={() => setOpen(false)}>Close externally</button>
        </Sidebar.Root>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Close internally" }));
    expect(screen.getByRole("button", { name: "Site toggle" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Site toggle" }));
    const external = screen.getByRole("button", { name: "Close externally" });
    await user.click(external);
    expect(external).toHaveFocus();
  });
  it("isolates independent roots and preserves an external page state", async () => {
    const user = userEvent.setup();
    function Example() {
      const [route, setRoute] = useState("One");
      return (
        <>
          <Sidebar.Root defaultOpen>
            <Sidebar.Toggle>First toggle</Sidebar.Toggle>
            <Sidebar.Panel aria-label="First">
              <button onClick={() => setRoute("Two")}>Navigate</button>
            </Sidebar.Panel>
            <Sidebar.Content key={route}>{route}</Sidebar.Content>
          </Sidebar.Root>
          <Sidebar.Root>
            <Sidebar.Toggle>Second toggle</Sidebar.Toggle>
            <Sidebar.Panel aria-label="Second">Other content</Sidebar.Panel>
          </Sidebar.Root>
        </>
      );
    }
    render(<Example />);
    await user.click(
      within(screen.getByRole("complementary", { name: "First" })).getByRole(
        "button",
      ),
    );
    expect(screen.getByText("Two")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "First toggle" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Second toggle" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
