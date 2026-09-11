import { Stat } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stat
      label="Published components"
      value={42}
      note="Illustrative sample, not a live repository count."
    />
  );
}
