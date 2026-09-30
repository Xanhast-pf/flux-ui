import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./Rating.js";
import type { RatingValue } from "./Rating.types.js";

const meta = {
  title: "Inputs/Rating",
  component: Rating,
  args: {
    "aria-label": "Quality rating",
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 3,
    name: "quality",
  },
};

export const Required: Story = {
  args: {
    name: "quality-required",
    required: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 4,
    name: "quality-readonly",
    readOnly: true,
  },
};

export function Controlled() {
  const [value, setValue] = useState<RatingValue>(3);
  return (
    <Rating
      aria-label="Controlled quality rating"
      name="quality-controlled"
      value={value}
      onValueChange={setValue}
    />
  );
}
