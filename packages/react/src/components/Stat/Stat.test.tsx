import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat } from "./Stat.js";
describe("Stat", () => {
  it("keeps a real zero associated with its label and optional note", () => {
    const { container } = render(
      <Stat label="Errors" value={0} note="Current run" />,
    );
    expect(container.firstElementChild?.tagName).toBe("DL");
    expect(screen.getByText("Errors").tagName).toBe("DT");
    expect(screen.getByText("0").closest("dd")).not.toBeNull();
    expect(screen.getByText("Current run").closest("dd")).not.toBeNull();
  });
  it("accepts an honest pending value without fabricating a number", () => {
    render(<Stat label="Bundle size" value="Not measured" />);
    expect(screen.getByText("Not measured")).toBeInTheDocument();
    expect(screen.queryByText("0")).toBeNull();
  });
});
