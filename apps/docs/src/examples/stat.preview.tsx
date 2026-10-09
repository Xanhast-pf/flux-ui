import { Stat } from "@varua/flux-ui";

export default function Preview() {
  return (
    <Stat
      label="Published components"
      value={42}
      note="Illustrative sample, not a live repository count."
    />
  );
}
