import { createRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "./Rating.js";
import type { RatingValue } from "./Rating.types.js";

describe("Rating", () => {
  it("renders a named native radio group with five options by default", () => {
    render(
      <Rating aria-label="Quality rating" defaultValue={3} name="quality" />,
    );

    const group = screen.getByRole("group", { name: "Quality rating" });
    const radios = screen.getAllByRole<HTMLInputElement>("radio");

    expect(group.tagName).toBe("FIELDSET");
    expect(radios).toHaveLength(5);
    expect(radios.every((radio) => radio.name === "quality")).toBe(true);
    expect(screen.getByRole("radio", { name: "3 of 5 stars" })).toBeChecked();
  });

  it("supports half-step native radio values and form serialization", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Review">
        <Rating
          aria-label="Quality rating"
          defaultValue={3.5}
          name="quality"
          step={0.5}
        />
      </form>,
    );

    const form = screen.getByRole<HTMLFormElement>("form", { name: "Review" });
    const radios = screen.getAllByRole<HTMLInputElement>("radio");
    const half = screen.getByRole("radio", { name: "3.5 of 5 stars" });
    const nextHalf = screen.getByRole("radio", { name: "4.5 of 5 stars" });

    expect(radios).toHaveLength(10);
    expect(half).toBeChecked();
    expect(new FormData(form).get("quality")).toBe("3.5");

    await user.click(nextHalf);
    expect(nextHalf).toBeChecked();
    expect(new FormData(form).get("quality")).toBe("4.5");
  });

  it("preserves native form submission and reset in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Review">
        <Rating
          aria-label="Quality rating"
          defaultValue={2}
          name="quality"
          required
        />
        <button type="reset">Reset</button>
      </form>,
    );

    const form = screen.getByRole<HTMLFormElement>("form", { name: "Review" });
    const fourth = screen.getByRole("radio", { name: "4 of 5 stars" });

    expect(new FormData(form).get("quality")).toBe("2");
    await user.click(fourth);
    expect(fourth).toBeChecked();
    expect(new FormData(form).get("quality")).toBe("4");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("radio", { name: "2 of 5 stars" })).toBeChecked();
    expect(new FormData(form).get("quality")).toBe("2");
  });

  it("reports controlled changes without taking ownership from the consumer", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Rating
        aria-label="Quality rating"
        name="quality"
        value={2}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "4 of 5 stars" }));
    expect(onValueChange.mock.calls[0]?.[0]).toBe(4);
    expect(screen.getByRole("radio", { name: "2 of 5 stars" })).toBeChecked();

    rerender(
      <Rating
        aria-label="Quality rating"
        name="quality"
        value={4}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("radio", { name: "4 of 5 stars" })).toBeChecked();
  });

  it("supports the common controlled value/onValueChange pattern", async () => {
    const user = userEvent.setup();

    function ControlledRating() {
      const [value, setValue] = useState<RatingValue>(2);
      return (
        <Rating
          aria-label="Quality rating"
          name="quality"
          value={value}
          onValueChange={setValue}
        />
      );
    }

    render(<ControlledRating />);
    await user.click(screen.getByRole("radio", { name: "5 of 5 stars" }));
    expect(screen.getByRole("radio", { name: "5 of 5 stars" })).toBeChecked();
  });

  it("calls native onChange before onValueChange and respects preventDefault", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const onValueChange = vi.fn((_value: number) => {
      order.push("value");
    });

    render(
      <Rating
        aria-label="Quality rating"
        name="quality"
        onChange={(event) => {
          order.push("change");
          event.preventDefault();
        }}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "3 of 5 stars" }));
    expect(order).toEqual(["change"]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uses native required validation", () => {
    render(
      <form>
        <Rating aria-label="Quality rating" name="quality" required />
      </form>,
    );

    const first = screen.getByRole<HTMLInputElement>("radio", {
      name: "1 of 5 stars",
    });
    const third = screen.getByRole<HTMLInputElement>("radio", {
      name: "3 of 5 stars",
    });

    expect(first).toBeRequired();
    expect(first.checkValidity()).toBe(false);
    fireEvent.click(third);
    expect(first.checkValidity()).toBe(true);
  });

  it("supports disabled ratings without reporting changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Rating
        aria-label="Quality rating"
        disabled
        defaultValue={2}
        onValueChange={onValueChange}
      />,
    );

    const fourth = screen.getByRole("radio", { name: "4 of 5 stars" });
    expect(fourth).toBeDisabled();
    await user.click(fourth);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "2 of 5 stars" })).toBeChecked();
  });

  it("renders read-only half stars without interactive radios and preserves named form data", () => {
    render(
      <form aria-label="Review">
        <Rating
          aria-label="Quality rating"
          defaultValue={3.5}
          name="quality"
          readOnly
          step={0.5}
        />
      </form>,
    );

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "3.5 of 5 stars" }),
    ).toBeInTheDocument();
    expect(
      new FormData(screen.getByRole<HTMLFormElement>("form")).get("quality"),
    ).toBe("3.5");
  });

  it("supports custom max and option labels", () => {
    render(
      <Rating
        aria-label="Confidence"
        max={3}
        getItemLabel={(value, max) => `Confidence ${value} of ${max}`}
      />,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(
      screen.getByRole("radio", { name: "Confidence 3 of 3" }),
    ).toBeInTheDocument();
  });

  it("rejects invalid max and values", () => {
    expect(() => render(<Rating aria-label="Rating" max={0} />)).toThrow(
      /max must be an integer between 1 and 10/u,
    );
    expect(() =>
      render(<Rating aria-label="Rating" max={5} defaultValue={6} />),
    ).toThrow(
      /defaultValue must be null or a valid 1-step value between 1 and max/u,
    );
    expect(() =>
      render(
        <Rating
          aria-label="Rating"
          max={5}
          value={2.5}
          onValueChange={() => {}}
        />,
      ),
    ).toThrow(/value must be null or a valid 1-step value between 1 and max/u);
  });

  it("forwards fieldset escape hatches and refs", () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(
      <Rating
        ref={ref}
        aria-label="Quality rating"
        className="custom-rating"
        data-project="flux"
        style={{ margin: "0.25rem" }}
      />,
    );

    const group = screen.getByRole("group", { name: "Quality rating" });
    expect(group).toHaveClass("custom-rating");
    expect(group).toHaveAttribute("data-project", "flux");
    expect(group.style.margin).toBe("0.25rem");
    expect(ref.current).toBe(group);
  });

  it("associates every radio with an external form", () => {
    render(
      <>
        <form id="review-form" aria-label="Review" />
        <Rating
          aria-label="Quality rating"
          defaultValue={3}
          form="review-form"
          name="quality"
        />
      </>,
    );

    const form = screen.getByRole<HTMLFormElement>("form", { name: "Review" });
    expect(new FormData(form).get("quality")).toBe("3");
    expect(
      screen
        .getAllByRole<HTMLInputElement>("radio")
        .every((radio) => radio.form === form),
    ).toBe(true);
  });

  it("renders server markup without leaking Flux-only props", () => {
    const markup = renderToString(
      <Rating
        aria-label="Quality rating"
        defaultValue={3.5}
        max={5}
        name="quality"
        onValueChange={() => {}}
        step={0.5}
      />,
    );

    expect(markup).toContain("<fieldset");
    expect(markup).toContain('type="radio"');
    expect(markup).toContain('name="quality"');
    expect(markup).toContain('checked=""');
    expect(markup).not.toContain("defaultValue=");
    expect(markup).not.toContain("onValueChange");
    expect(markup).not.toMatch(/\smax=/u);
    expect(markup).not.toMatch(/\sstep=/u);
  });
});
