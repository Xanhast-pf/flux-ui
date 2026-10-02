import { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Stepper } from "./Stepper.js";

describe("Stepper", () => {
  it("renders an ordered progress list with current and completed semantics", () => {
    render(
      <Stepper.Root>
        <Stepper.Item status="complete">
          <Stepper.Link href="#account">Account</Stepper.Link>
        </Stepper.Item>
        <Stepper.Item status="current">Shipping</Stepper.Item>
        <Stepper.Item>Payment</Stepper.Item>
      </Stepper.Root>,
    );

    const list = screen.getByRole("list", { name: "Progress" });
    expect(list.tagName).toBe("OL");
    expect(list).toHaveAttribute("data-orientation", "horizontal");

    const items = within(list).getAllByRole("listitem");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[0]).toHaveAttribute("data-status", "complete");
    expect(items[0]).toHaveTextContent("Completed: Account");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveAttribute("data-status", "current");
    expect(items[2]).toHaveAttribute("data-status", "pending");

    for (const marker of list.querySelectorAll("[aria-hidden='true']"))
      expect(marker).toBeEmptyDOMElement();
  });

  it("keeps optional navigation native and keyboard reachable", async () => {
    const user = userEvent.setup();
    render(
      <Stepper.Root aria-label="Setup progress">
        <Stepper.Item status="complete">
          <Stepper.Link href="#profile">Profile</Stepper.Link>
        </Stepper.Item>
        <Stepper.Item status="current">
          <Stepper.Button>Permissions</Stepper.Button>
        </Stepper.Item>
        <Stepper.Item>
          <Stepper.Button disabled>Review</Stepper.Button>
        </Stepper.Item>
      </Stepper.Root>,
    );

    const link = screen.getByRole("link", { name: "Profile" });
    const current = screen.getByRole("button", { name: "Permissions" });
    const disabled = screen.getByRole("button", { name: "Review" });

    expect(link).toHaveAttribute("href", "#profile");
    expect(current).toHaveAttribute("type", "button");
    expect(disabled).toBeDisabled();

    await user.tab();
    expect(link).toHaveFocus();
    await user.tab();
    expect(current).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("supports vertical layout, localized statuses and native escape hatches", () => {
    const itemRef = createRef<HTMLLIElement>();
    const linkRef = createRef<HTMLAnchorElement>();

    render(
      <Stepper.Root orientation="vertical" aria-label="Déploiement">
        <Stepper.Item
          ref={itemRef}
          status="complete"
          statusLabel="Terminé"
          className="custom-item"
          style={{ marginBlockEnd: "0.25rem" }}
        >
          <Stepper.Link
            href="#build"
            ref={linkRef}
            className="custom-link"
            style={{ letterSpacing: "0.01em" }}
          >
            Build
          </Stepper.Link>
        </Stepper.Item>
        <Stepper.Item status="error" statusLabel="Erreur">
          Deploy
        </Stepper.Item>
      </Stepper.Root>,
    );

    const list = screen.getByRole("list", { name: "Déploiement" });
    expect(list).toHaveAttribute("data-orientation", "vertical");
    expect(itemRef.current).toHaveClass("custom-item");
    expect(itemRef.current?.style.marginBlockEnd).toBe("0.25rem");
    expect(linkRef.current).toHaveClass("custom-link");
    expect(linkRef.current?.style.letterSpacing).toBe("0.01em");
    expect(itemRef.current).toHaveTextContent("Terminé: Build");
    expect(screen.getByText("Deploy").closest("li")).toHaveTextContent(
      "Erreur: Deploy",
    );
  });

  it("is server safe without client state", () => {
    const markup = renderToString(
      <Stepper.Root aria-label="Checkout">
        <Stepper.Item status="current">Shipping</Stepper.Item>
      </Stepper.Root>,
    );

    expect(markup).toContain("<ol");
    expect(markup).toContain('aria-current="step"');
    expect(markup).toContain("Shipping");
  });
});
