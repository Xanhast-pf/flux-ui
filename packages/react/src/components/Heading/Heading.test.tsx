import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading.js";
describe("Heading", () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    "renders document level %s independently of visual size",
    (level) => {
      const ref = createRef<HTMLHeadingElement>();
      render(
        <Heading level={level} size="display" ref={ref}>
          Account
        </Heading>,
      );
      expect(ref.current).toBe(
        screen.getByRole("heading", { level, name: "Account" }),
      );
      expect(ref.current).not.toHaveAttribute("level");
      expect(ref.current).not.toHaveAttribute("size");
    },
  );
});
