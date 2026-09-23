import { useSyncExternalStore } from "react";
import {
  Card,
  CodeBlock,
  Heading,
  SplitPane,
  Stack,
  Text,
} from "@flux-ui/react";

const narrowQuery = "(max-width: 48rem)";

function subscribeNarrow(notify: () => void) {
  const media = window.matchMedia(narrowQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

function getNarrowSnapshot() {
  return window.matchMedia(narrowQuery).matches;
}

export default function Preview() {
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    getNarrowSnapshot,
    () => false,
  );
  return (
    <SplitPane
      label="Resize explanation and source"
      orientation={narrow ? "vertical" : "horizontal"}
      defaultValue={45}
      min={20}
      max={75}
      style={narrow ? { minBlockSize: "32rem" } : {}}
      first={
        <Card>
          <Stack gap="md">
            <Heading level={2} size="md">
              A resizable workbench
            </Heading>
            <Text>
              Drag the separator or focus it and use arrow keys. Shift makes
              one-percent adjustments; Home/End use the configured limits.
            </Text>
          </Stack>
        </Card>
      }
      second={
        <CodeBlock
          code={
            "<SplitPane\n  defaultValue={45}\n  first={<Preview />}\n  second={<Source />}\n/>"
          }
          label="SplitPane composition"
        />
      }
    />
  );
}
