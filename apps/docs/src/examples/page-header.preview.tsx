import { Button, PageHeader, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <PageHeader
      level={2}
      eyebrow="Workspace"
      title="Project settings"
      actions={<Button size="sm">Save settings</Button>}
    >
      <Text as="p" tone="muted">
        A reusable introduction, built from public type and layout primitives.
      </Text>
    </PageHeader>
  );
}
