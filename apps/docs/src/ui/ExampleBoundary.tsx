import { Button, Callout, Heading, Link, Stack, Text } from "@flux-ui/react";
import * as React from "react";
/** A stale deployment chunk must not take down the whole documentation shell. */
export class ExampleBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  {
    failed: boolean;
  }
> {
  override state = { failed: false };
  static getDerivedStateFromError(): {
    failed: boolean;
  } {
    return { failed: true };
  }
  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Callout tone="warning">
        <Stack gap="md">
          <Heading level={1} size="xl">
            This example could not load.
          </Heading>
          <Text as="p" variant="body">
            The connection may have dropped, or a newer docs build may have been
            deployed. Reload to get the current files.
          </Text>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload documentation
          </Button>
          <Link href="#components">Back to components</Link>
        </Stack>
      </Callout>
    );
  }
}
