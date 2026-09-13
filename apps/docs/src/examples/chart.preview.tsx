import { useState } from "react";
import { Chart, Field, Select, Stack } from "@flux-ui/react";
const series = [
  {
    id: "in",
    label: "Illustrative inflow",
    data: [12, 18, 14, 26, null, 22, 30].map((y, x) => ({ x, y })),
  },
  {
    id: "out",
    label: "Illustrative outflow",
    tone: "warning" as const,
    data: [8, 11, 7, 12, 10, 17, 15].map((y, x) => ({ x, y })),
  },
];
export default function Preview() {
  const [type, setType] = useState<"line" | "area" | "bar">("line");
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Chart type</Field.Label>
        <Field.Control>
          <Select
            value={type}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (next === "line" || next === "area" || next === "bar")
                setType(next);
            }}
          >
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="bar">Bar</option>
          </Select>
        </Field.Control>
      </Field.Root>
      <Chart
        label="Cash flow · illustrative data"
        series={series}
        type={type}
        formatX={(x) => `Day ${x + 1}`}
        formatY={(y) => `$${y}k`}
      />
    </Stack>
  );
}
