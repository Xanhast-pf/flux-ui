import { joinClassNames } from "../../internal/joinClassNames.js";
import { Heading } from "../Heading/Heading.js";
import { Stack } from "../Stack/Stack.js";
import { Text } from "../Text/Text.js";
import { pageHeader } from "./PageHeader.css.js";
import type { PageHeaderProps } from "./PageHeader.types.js";
export function PageHeader({
  title,
  eyebrow,
  level = 1,
  actions,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <Stack
      as="header"
      {...props}
      gap="md"
      className={joinClassNames(pageHeader, className)}
    >
      {eyebrow === undefined ? null : (
        <Text as="p" variant="eyebrow" tone="muted">
          {eyebrow}
        </Text>
      )}
      <Heading level={level} size={level === 1 ? "xl" : "lg"}>
        {title}
      </Heading>
      {children}
      {actions}
    </Stack>
  );
}
