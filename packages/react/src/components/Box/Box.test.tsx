import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Box } from "./Box.js";
describe("Box", () => {
  it("renders one native semantic element with its ref and attributes", () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Box
        as="section"
        ref={ref}
        aria-label="Profile"
        padding={3}
        surface="subtle"
        className="custom"
      >
        Profile
      </Box>,
    );
    expect(container.childElementCount).toBe(1);
    expect(ref.current).toBe(screen.getByRole("region", { name: "Profile" }));
    expect(ref.current?.tagName).toBe("SECTION");
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).not.toHaveAttribute("padding");
    expect(ref.current).not.toHaveAttribute("surface");
  });
  it("preserves native form submission and consumer styles", async () => {
    const user = userEvent.setup();
    const submitted = vi.fn();
    const ref = createRef<HTMLFormElement>();
    render(
      <Box
        as="form"
        ref={ref}
        style={{ padding: "2rem" }}
        onSubmit={(event) => {
          event.preventDefault();
          submitted();
        }}
      >
        <button type="submit">Save</button>
      </Box>,
    );
    await user.click(screen.getByRole("button"));
    expect(submitted).toHaveBeenCalledOnce();
    expect(ref.current?.style.padding).toBe("2rem");
  });
});
