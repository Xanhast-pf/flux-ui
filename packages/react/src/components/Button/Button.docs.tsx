import { Button } from "./Button.js";

export function ButtonDocs() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <Button>Primary</Button>
      <Button intent="neutral">Neutral</Button>
      <Button intent="danger">Delete</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button loading>Loading</Button>
    </div>
  );
}
