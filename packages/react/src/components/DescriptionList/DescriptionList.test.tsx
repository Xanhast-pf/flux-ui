import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

  it("preserves refs and native styling on every semantic part", () => {
    const rootRef = createRef<HTMLDListElement>();
    const termRef = createRef<HTMLElement>();
    const detailsRef = createRef<HTMLElement>();
    render(
      <DescriptionList
        ref={rootRef}
        className="consumer-list"
        style={{ margin: "1rem" }}
      >
        <DescriptionList.Term ref={termRef} className="consumer-term">
          Owner
        </DescriptionList.Term>
        <DescriptionList.Details ref={detailsRef} data-detail="owner">
          Jo
        </DescriptionList.Details>
      </DescriptionList>,
    );
    expect(rootRef.current?.tagName).toBe("DL");
    expect(rootRef.current).toHaveClass("consumer-list");
    expect(rootRef.current?.style.margin).toBe("1rem");
    expect(termRef.current).toBe(screen.getByText("Owner"));
    expect(detailsRef.current).toHaveAttribute("data-detail", "owner");
  });

  it("renders native server markup", () => {
    const markup = renderToString(
      <DescriptionList>
        <DescriptionList.Term>Owner</DescriptionList.Term>
        <DescriptionList.Details>Jo</DescriptionList.Details>
      </DescriptionList>,
    );
    expect(markup).toContain("<dl");
    expect(markup).toContain("<dt");
    expect(markup).toContain("<dd");
  });
});
