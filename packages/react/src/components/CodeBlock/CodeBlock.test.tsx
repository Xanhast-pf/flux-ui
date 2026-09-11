import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock.js";
describe("CodeBlock", () => {
  it("copies exactly the source and exposes feedback without parsing HTML", async () => {
    const user = userEvent.setup();
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<CodeBlock code="<button>literal</button>" label="Snippet" />);
    expect(
      screen.getByRole("region", { name: "Snippet" }).querySelector("code")
        ?.textContent,
    ).toBe("<button>literal</button>");
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(copy).toHaveBeenCalledWith("<button>literal</button>");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Copied to clipboard.",
    );
    copy.mockRestore();
  });
  it("offers manual selection when the clipboard rejects", async () => {
    const user = userEvent.setup();
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockRejectedValue(new Error("Permission denied"));
    render(<CodeBlock code="const answer = 42;" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Clipboard unavailable",
    );
    copy.mockRestore();
  });
  it("does not announce a stale in-flight copy after the source changes", async () => {
    const user = userEvent.setup();
    let resolveCopy = () => {};
    const pending = new Promise<void>((resolve) => {
      resolveCopy = resolve;
    });
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockReturnValue(pending);
    const { rerender } = render(<CodeBlock code="old" />);
    await user.click(screen.getByRole("button"));
    rerender(<CodeBlock code="new" />);
    await act(async () => {
      resolveCopy();
      await pending;
    });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    copy.mockRestore();
  });
  it("can be read-only without an unused copy action", () => {
    render(<CodeBlock code="readOnly" copyable={false} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
