import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ThemeScope } from "./ThemeScope.js";
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
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
});
