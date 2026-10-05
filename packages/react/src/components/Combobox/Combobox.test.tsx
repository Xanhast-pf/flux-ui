import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox.js";
const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "legacy", label: "Engineering legacy", disabled: true },
];
describe("Combobox", () => {
  it("rejects duplicate option values before they create ambiguous option IDs", () => {
    expect(() =>
      render(
        <Combobox
          aria-label="Team"
          options={[
            { value: "design", label: "Design" },
            { value: "design", label: "Design archive" },
          ]}
        />,
      ),
    ).toThrow(/unique/u);
  });

  it("accepts optional application values without conditional-spread workarounds", () => {
    const disabled: boolean | undefined = undefined;
    const listLabel: string | undefined = undefined;
    const emptyMessage: string | undefined = undefined;
    const invalidSelectionMessage: string | undefined = undefined;
    const defaultValue: string | null | undefined = undefined;
    const onValueChange: ((value: string | null) => void) | undefined =
      undefined;

    render(
      <Combobox
        aria-label="Team"
        options={[{ value: "design", label: "Design", disabled }]}
        value={undefined}
        defaultValue={defaultValue}
        query={undefined}
        listLabel={listLabel}
        emptyMessage={emptyMessage}
        invalidSelectionMessage={invalidSelectionMessage}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("combobox", { name: "Team" })).toHaveValue("");
  });

  it("renders semantic option groups without changing keyboard option order", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Destination"
        options={[
          { value: "design", label: "Design", group: "Creative" },
          { value: "research", label: "Research", group: "Creative" },
          { value: "api", label: "API", group: "Engineering" },
        ]}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(listbox.parentElement).toHaveAttribute("data-state", "open");
    const creative = screen.getByRole("group", { name: "Creative" });
    const engineering = screen.getByRole("group", { name: "Engineering" });
    expect(within(creative).getAllByRole("option")).toHaveLength(2);
    expect(within(engineering).getByRole("option")).toHaveTextContent("API");

    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    const input = screen.getByRole("combobox");
    const active = input.getAttribute("aria-activedescendant");
    expect(
      active === null ? null : document.getElementById(active),
    ).toHaveTextContent("API");
  });

  it("supports owner-controlled query text without taking committed-value ownership", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const view = render(
      <Combobox
        aria-label="Team"
        options={options}
        value={null}
        query="eng"
        onQueryChange={onQueryChange}
      />,
    );

    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("eng");
    await user.click(input);
    expect(
      screen.getByRole("option", { name: "Engineering" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Design" }),
    ).not.toBeInTheDocument();

    await user.type(input, "x");
    expect(onQueryChange).toHaveBeenLastCalledWith("engx");
    expect(input).toHaveValue("eng");

    view.rerender(
      <Combobox
        aria-label="Team"
        options={options}
        value="engineering"
        query={null}
        onQueryChange={onQueryChange}
      />,
    );
    expect(input).toHaveValue("Engineering");
  });

  it("announces loading without replacing the listbox or its current options", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Team"
        options={options}
        loading
        loadingMessage="Fetching teams."
      />,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Fetching teams.");
    expect(screen.getByRole("option", { name: "Design" })).toBeInTheDocument();
  });

  it("filters, keeps input focus and submits a committed key rather than its label", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Combobox aria-label="Team" options={options} name="team" />
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "Team" });
    await user.type(input, "eng");
    expect(
      screen.queryByRole("option", { name: "Design" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Engineering legacy" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(input).toHaveFocus();
    expect(input).toBeInvalid();
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Engineering");
    expect(input).toBeValid();
    expect(input).toHaveAttribute("aria-expanded", "false");
    const form = document.querySelector("form");
    if (form === null) throw new Error("Missing form fixture.");
    expect(new FormData(form).get("team")).toBe("engineering");
  });
  it("skips unavailable choices and Escape closes without submitting", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <Combobox aria-label="Team" options={options} onValueChange={changed} />,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    const input = screen.getByRole("combobox");
    const active = input.getAttribute("aria-activedescendant");
    expect(
      active === null ? null : document.getElementById(active),
    ).toHaveTextContent("Engineering");
    await user.keyboard("{Escape}");
    expect(changed).not.toHaveBeenCalled();
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(input).toHaveFocus();
  });
  it("honors a controlled owner that declines selection", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <Combobox
        aria-label="Team"
        options={options}
        value="design"
        onValueChange={changed}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Engineering" }));
    expect(changed).toHaveBeenCalledWith("engineering");
    expect(screen.getByRole("combobox")).toHaveValue("Design");
  });
  it("preserves a committed disabled option as display and form state", () => {
    render(
      <form aria-label="Team form">
        <Combobox
          aria-label="Team"
          options={options}
          value="legacy"
          name="team"
        />
      </form>,
    );

    expect(screen.getByRole("combobox", { name: "Team" })).toHaveValue(
      "Engineering legacy",
    );
    expect(
      new FormData(screen.getByRole<HTMLFormElement>("form")).get("team"),
    ).toBe("legacy");
  });

  it("resets an uncontrolled form and hides the active descendant when disabled", async () => {
    const user = userEvent.setup();
    const view = render(
      <form>
        <Combobox aria-label="Team" options={options} defaultValue="design" />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.clear(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "eng");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(screen.getByRole("combobox")).toHaveValue("Design"),
    );
    await user.click(screen.getByRole("combobox"));
    view.rerender(
      <form>
        <Combobox
          aria-label="Team"
          options={options}
          defaultValue="design"
          disabled
        />
        <button type="reset">Reset</button>
      </form>,
    );
    expect(screen.getByRole("combobox")).not.toHaveAttribute(
      "aria-activedescendant",
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
  it("closes on a non-focusable outside pointer target", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Combobox aria-label="Team" options={options} />
        <p data-testid="outside">Outside</p>
      </>,
    );
    await user.click(screen.getByRole("combobox"));
    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
