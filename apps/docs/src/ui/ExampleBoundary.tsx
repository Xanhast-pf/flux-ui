import * as React from "react";
import { Button, Callout, Stack } from "@flux-ui/react";

/** A stale deployment chunk must not take down the whole documentation shell. */
export class ExampleBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Callout tone="warning">
        <Stack gap="md">
          <h1>This example could not load.</h1>
          <p>
            The connection may have dropped, or a newer docs build may have been
            deployed. Reload to get the current files.
          </p>
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload documentation
          </Button>
          <a href="#components">Back to components</a>
        </Stack>
      </Callout>
    );
  }
}
