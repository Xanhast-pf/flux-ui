import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock.js";
import type { CodeToken } from "./CodeBlock.types.js";
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

describe("CodeBlock highlighting", () => {
  it("renders provider tokens as escaped text and preserves the original source", () => {
    const code = "<img src=x onerror=alert(1)> & literal";
    const view = render(
      <CodeBlock
        code={code}
        copyable={false}
        tokens={[{ start: 0, end: code.length, kind: "string" }]}
      />,
    );
    expect(view.container.querySelector("code")?.textContent).toBe(code);
    expect(view.container.querySelector("img, script")).toBeNull();
    expect(
      view.container.querySelector('[data-token="string"]'),
    ).not.toBeNull();
  });
  it("falls back to plain text for invalid token ranges", () => {
    const view = render(
      <CodeBlock
        code="plain"
        tokens={[{ start: 0, end: 100, kind: "keyword" }]}
      />,
    );
    expect(view.container.querySelector("code")?.textContent).toBe("plain");
    expect(view.container.querySelector("[data-token]")).toBeNull();
  });
  it("aborts the previous grammar request and ignores stale results", async () => {
    type Tokens = readonly CodeToken[];
    const requests: {
      source: string;
      signal: AbortSignal;
      resolve: (tokens: Tokens) => void;
    }[] = [];
    const highlight = (
      source: string,
      _language: string,
      signal: AbortSignal,
    ) =>
      new Promise<Tokens>((resolve) => {
        requests.push({ source, signal, resolve });
      });
    const view = render(
      <CodeBlock code="first" language="test" highlight={highlight} />,
    );
    await act(async () => {
      await Promise.resolve();
    });
    view.rerender(
      <CodeBlock code="second" language="test" highlight={highlight} />,
    );
    await act(async () => {
      await Promise.resolve();
    });
    const old = requests.find((request) => request.source === "first");
    const current = requests.find((request) => request.source === "second");
    if (!old || !current) throw new Error("Missing provider requests.");
    expect(old.signal.aborted).toBe(true);
    await act(async () => {
      current.resolve([{ start: 0, end: 6, kind: "string" }]);
      await Promise.resolve();
    });
    await act(async () => {
      old.resolve([{ start: 0, end: 5, kind: "keyword" }]);
      await Promise.resolve();
    });
    expect(view.container.querySelector("code")?.textContent).toBe("second");
    expect(view.container.querySelector('[data-token="keyword"]')).toBeNull();
    expect(
      view.container.querySelector('[data-token="string"]'),
    ).not.toBeNull();
    view.unmount();
    expect(current.signal.aborted).toBe(true);
  });
});

describe("CodeBlock asynchronous hardening", () => {
  it("keeps feedback from the newest copy when older requests settle late", async () => {
    const user = userEvent.setup();
    let completeOld = () => {};
    const old = new Promise<void>((resolve) => {
      completeOld = resolve;
    });
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockReturnValueOnce(old)
      .mockResolvedValueOnce(undefined);
    const view = render(<CodeBlock code="old request" />);
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    view.rerender(<CodeBlock code="latest request" />);
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    await act(async () => {
      completeOld();
      await old;
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Copied to clipboard.",
    );
    copy.mockRestore();
  });
  it.each([true, false])(
    "ignores an older clipboard rejection when the newest copy succeeds: %s",
    async (latestSucceeds) => {
      const user = userEvent.setup();
      let rejectOld = () => {};
      const old = new Promise<void>((_resolve, reject) => {
        rejectOld = () => reject(new Error("Old request failed"));
      });
      const copy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockReturnValueOnce(old);
      if (latestSucceeds) copy.mockResolvedValueOnce(undefined);
      else copy.mockRejectedValueOnce(new Error("Latest request failed"));
      render(<CodeBlock code="same source" />);
      await user.click(screen.getByRole("button", { name: "Copy code" }));
      await user.click(screen.getByRole("button", { name: "Copy code" }));
      await act(async () => {
        rejectOld();
        await old.catch(() => {});
      });
      expect(screen.getByRole("status")).toHaveTextContent(
        latestSucceeds ? "Copied to clipboard." : "Clipboard unavailable.",
      );
      copy.mockRestore();
    },
  );
  it("does not start a provider whose deferred request was already aborted", async () => {
    const highlight = vi.fn(() => []);
    const view = render(<CodeBlock code="cancelled" highlight={highlight} />);
    view.unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(highlight).not.toHaveBeenCalled();
  });
  it("does not revalidate stable token ranges when only copy feedback changes", async () => {
    const user = userEvent.setup();
    const readStart = vi.fn(() => 0);
    const token: CodeToken = {
      get start() {
        return readStart();
      },
      end: 5,
      kind: "keyword",
    };
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<CodeBlock code="const" tokens={[token]} />);
    readStart.mockClear();
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(readStart).not.toHaveBeenCalled();
    copy.mockRestore();
  });
});
