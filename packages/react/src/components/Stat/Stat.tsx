import { joinClassNames } from "../../internal/joinClassNames.js";
import { Stack } from "../Stack/Stack.js";
import { Text } from "../Text/Text.js";
import { stat } from "./Stat.css.js";
import type { StatProps } from "./Stat.types.js";
export function Stat({ label, value, note, className, ...props }: StatProps) {
  return (
    <Stack
      as="dl"
      {...props}
      gap="xs"
      className={joinClassNames(stat, className)}
    >
      <Text as="dt" variant="caption" tone="muted">
        {label}
      </Text>
      <Stack as="dd" gap="xs" style={{ margin: 0 }}>
        <Text as="strong" variant="metric" numeric>
          {value}
        </Text>
        {note === undefined ? null : (
          <Text as="p" variant="caption" tone="muted">
            {note}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
