import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeScope } from "./ThemeScope.js";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </button>
  );
}

describe("ThemeScope", () => {
  it("changes only its own theme without remounting descendants", async () => {
    const rootTheme = document.documentElement.dataset.fluxTheme;
    const user = userEvent.setup();
    const { rerender } = render(
      <ThemeScope theme="paper" data-testid="scope" query>
        <Counter />
      </ThemeScope>,
    );
    await user.click(screen.getByRole("button"));
    rerender(
      <ThemeScope theme="studio" data-testid="scope" query>
        <Counter />
      </ThemeScope>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("1");
    expect(screen.getByTestId("scope")).toHaveAttribute(
      "data-flux-theme",
      "studio",
    );
    expect(screen.getByTestId("scope")).toHaveAttribute("data-query", "true");
    expect(document.documentElement.dataset.fluxTheme).toBe(rootTheme);
  });

  it("preserves semantic elements, refs, surface options and consumer styles", () => {
    const ref = createRef<HTMLElement>();
    render(
      <ThemeScope
        as="section"
        ref={ref}
        theme="paper"
        surface="subtle"
        border="all"
        radius="md"
        padding="md"
        aria-label="Preview theme"
        className="consumer"
        style={{ margin: "1rem" }}
      />,
    );
    const scope = screen.getByRole("region", { name: "Preview theme" });
    expect(ref.current).toBe(scope);
    expect(scope).toHaveAttribute("data-flux-theme", "paper");
    expect(scope).toHaveAttribute("data-fs", "subtle");
    expect(scope).toHaveClass("consumer");
    expect(scope.style.margin).toBe("1rem");
  });

  it("renders scoped theme state on the server without touching the root document", () => {
    const markup = renderToString(
      <ThemeScope as="section" theme="paper" query>
        Preview
      </ThemeScope>,
    );
    expect(markup).toContain('data-flux-theme="paper"');
    expect(markup).toContain('data-query="true"');
  });
});
