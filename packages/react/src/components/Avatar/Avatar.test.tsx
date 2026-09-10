import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar.js";
describe("Avatar", () => {
  it("provides one accessible identity and a decorative image", () => {
    const { container } = render(
      <Avatar alt="Demo teammate" src="/avatar.svg" fallback="FL" />,
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img")).toHaveAccessibleName("Demo teammate");
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
  it("shows fallback when absent or failed and retries for a different source", () => {
    const { container, rerender } = render(
      <Avatar alt="Teammate" fallback="FL" src="/one.svg" />,
    );
    const original = container.querySelector("img");
    if (original === null) throw new Error("Expected image");
    fireEvent.error(original);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("FL")).toBeInTheDocument();
    rerender(<Avatar alt="Teammate" fallback="FL" src="/two.svg" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "/two.svg");
    fireEvent.error(original);
    expect(container.querySelector("img")).toHaveAttribute("src", "/two.svg");
    rerender(<Avatar alt="Teammate" fallback="FL" />);
    expect(container.querySelector("img")).toBeNull();
  });
  it("removes loading fallback after success and resets it for a new source", () => {
    const { container, rerender } = render(
      <Avatar alt="Team" fallback="FL" src="/one.svg" />,
    );
    const image = container.querySelector("img");
    if (image === null) throw new Error("Expected image");
    expect(screen.getByText("FL")).toBeInTheDocument();
    fireEvent.load(image);
    expect(screen.queryByText("FL")).toBeNull();
    rerender(<Avatar alt="Team" fallback="FL" src="/two.svg" />);
    expect(screen.getByText("FL")).toBeInTheDocument();
    fireEvent.load(image);
    expect(screen.getByText("FL")).toBeInTheDocument();
  });
  it("can be entirely decorative next to a visible identity", () => {
    const { container } = render(
      <>
        <Avatar alt="" fallback="FL" />
        <span>Flux team</span>
      </>,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
  it("forwards root styling and refs and renders server fallback", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Avatar
        alt="Team"
        ref={ref}
        fallback="FL"
        size="lg"
        className="custom"
        style={{ margin: "0.25rem" }}
        data-team="flux"
      />,
    );
    expect(ref.current).toBe(screen.getByRole("img"));
    expect(ref.current?.style.margin).toBe("0.25rem");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("data-team", "flux");
    expect(renderToString(<Avatar alt="Team" fallback="FL" />)).toContain("FL");
  });
});
