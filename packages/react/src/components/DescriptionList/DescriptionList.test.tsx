import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DescriptionList } from "./DescriptionList.js";
describe("DescriptionList", () => {
  it("renders native term/description relationships without extra wrappers", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionList.Term>Owner</DescriptionList.Term>
        <DescriptionList.Details>Jo</DescriptionList.Details>
      </DescriptionList>,
    );
    expect(container.firstElementChild?.tagName).toBe("DL");
    expect(screen.getByText("Owner").tagName).toBe("DT");
    expect(screen.getByText("Jo").tagName).toBe("DD");
    expect(container.querySelector("dl")?.children).toHaveLength(2);
  });
});
