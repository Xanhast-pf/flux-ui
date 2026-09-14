import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { StrictMode } from "react";
import { Input } from "../Input/Input.js";
import { Field } from "./Field.js";

describe("Field", () => {
  it("wires label, description, error, and required state to its control", () => {
    render(
      <Field.Root id="email-field" invalid required>
        <Field.Label>Email address</Field.Label>
        <Field.Control>
          <Input type="email" />
        </Field.Control>
        <Field.Description>Used for account notifications.</Field.Description>
        <Field.Error>Enter a valid email address.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAttribute("id", "email-field-control");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "email-field-description email-field-error",
    );
    expect(screen.getByText("Used for account notifications.")).toHaveAttribute(
      "id",
      "email-field-description",
    );
    expect(screen.getByText("Enter a valid email address.")).toHaveAttribute(
      "id",
      "email-field-error",
    );
  });

  it("keeps errors out of the accessibility tree until the field is invalid", () => {
    render(
      <Field.Root id="name-field">
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Field.Description>Your public display name.</Field.Description>
        <Field.Error>Name is required.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("aria-describedby", "name-field-description");
    expect(screen.queryByText("Name is required.")).not.toBeInTheDocument();
  });

  it("propagates disabled state while preserving consumer aria descriptions", () => {
    render(
      <>
        <p id="external-help">External help</p>
        <Field.Root controlId="search-control" disabled>
          <Field.Label>Search</Field.Label>
          <Field.Control>
            <Input aria-describedby="external-help" />
          </Field.Control>
          <Field.Description>Search all projects.</Field.Description>
        </Field.Root>
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("id", "search-control");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toContain("external-help");
    expect(describedBy).toContain("search-control-description");
  });
  it("does not claim descriptions or disabled state from a nested field", () => {
    render(
      <Field.Root id="outer" disabled>
        <Field.Label>Outer</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Field.Root id="inner">
          <Field.Label>Inner</Field.Label>
          <Field.Control>
            <Input />
          </Field.Control>
          <Field.Description>Inner only</Field.Description>
          <Field.Error>Inactive error</Field.Error>
        </Field.Root>
      </Field.Root>,
    );
    const outer = screen.getByRole("textbox", { name: "Outer" });
    const inner = screen.getByRole("textbox", { name: "Inner" });
    expect(outer).toBeDisabled();
    expect(outer).not.toHaveAttribute("aria-describedby");
    expect(inner).not.toBeDisabled();
    expect(inner).toHaveAttribute("aria-describedby", "inner-description");
    expect(document.getElementById("outer-description")).toBeNull();
  });
});

describe("Field composition and initial markup", () => {
  function Help({ visible = true }: { visible?: boolean }) {
    return visible ? (
      <Field.Description>Wrapped help.</Field.Description>
    ) : null;
  }
  function ErrorPart() {
    return <Field.Error>Wrapped error.</Field.Error>;
  }
  it("discovers opaque components and removes relationships when their output disappears", () => {
    const view = render(
      <Field.Root id="wrapped" invalid>
        <Field.Label>Value</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Help />
        <ErrorPart />
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "wrapped-description wrapped-error",
    );
    view.rerender(
      <Field.Root id="wrapped">
        <Field.Label>Value</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <Help visible={false} />
        <ErrorPart />
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
  });
  it("keeps root-owned slots in initial server HTML even when the slot content is opaque", () => {
    function Content() {
      return <>Server-visible help.</>;
    }
    const html = renderToString(
      <Field.Root
        id="server"
        invalid
        description={<Content />}
        error="Server-visible error."
      >
        <Field.Label>Value</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
      </Field.Root>,
    );
    expect(html).toContain(
      'aria-describedby="server-description server-error"',
    );
    expect(html).toContain('id="server-description"');
    expect(html).toContain('id="server-error"');
    expect(html).toContain("Server-visible help.");
  });
  it("preserves callback-ref cleanup and strict-mode registration without duplicate IDs", () => {
    const cleanup = vi.fn();
    function HelpWithRef() {
      return <Field.Description ref={() => cleanup}>Help.</Field.Description>;
    }
    const view = render(
      <StrictMode>
        <Field.Root id="strict">
          <Field.Label>Value</Field.Label>
          <Field.Control>
            <Input />
          </Field.Control>
          <HelpWithRef />
        </Field.Root>
      </StrictMode>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "strict-description",
    );
    expect(document.querySelectorAll("#strict-description")).toHaveLength(1);
    const before = cleanup.mock.calls.length;
    view.unmount();
    expect(cleanup.mock.calls.length).toBeGreaterThan(before);
  });
});
