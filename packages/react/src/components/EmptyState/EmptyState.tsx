import { joinClassNames } from "../../internal/joinClassNames.js";
import { Heading } from "../Heading/Heading.js";
import { Stack } from "../Stack/Stack.js";
import { Text } from "../Text/Text.js";
import { emptyState } from "./EmptyState.css.js";
import type { EmptyStateProps } from "./EmptyState.types.js";
export function EmptyState({
  title,
  description,
  headingLevel = 3,
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Stack
      {...props}
      gap="sm"
      align="center"
      className={joinClassNames(emptyState, className)}
    >
      <Heading level={headingLevel} size="sm">
        {title}
      </Heading>
      {description === undefined ? null : (
        <Text as="p" tone="muted">
          {description}
        </Text>
      )}
      {children}
    </Stack>
  );
}
