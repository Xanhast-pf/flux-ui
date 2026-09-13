import { FluxMarkIcon } from "@flux-ui/icons";
import { Inline, Stat, Text } from "@flux-ui/react";
import type { ReactNode } from "react";
export function SceneHeader({
  brand,
  context,
  children,
}: {
  brand: string;
  context: string;
  children?: ReactNode;
}) {
  return (
    <Inline as="header" justify="between" wrap gap="md">
      <Inline wrap gap={3}>
        <FluxMarkIcon size={20} />
        <Text as="strong" variant="lead" weight="bold">
          {brand}
        </Text>
        <Text variant="caption" tone="muted">
          {context}
        </Text>
      </Inline>
      <Inline gap="md" wrap>
        {children}
      </Inline>
    </Inline>
  );
}
export function SceneStatus({ children }: { children: ReactNode }) {
  return (
    <Text as="p" variant="caption" tone="muted" role="status">
      {children}
    </Text>
  );
}
export const Metric = Stat;
