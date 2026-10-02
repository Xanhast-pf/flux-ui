import { PieChart } from "@flux-ui/react";

export default function Example() {
  return (
    <PieChart
      label="Revenue by product"
      description="Keyboard and pointer inspection expose the same slice values."
      data={[
        { id: "core", label: "Core", value: 52 },
        { id: "pro", label: "Pro", value: 31, tone: "info" },
        { id: "services", label: "Services", value: 17, tone: "success" },
      ]}
    />
  );
}
