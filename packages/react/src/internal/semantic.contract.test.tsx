import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Grid } from "../components/Grid/Grid.js";
import { Heading } from "../components/Heading/Heading.js";
import { Meter } from "../components/Meter/Meter.js";
import { Stack } from "../components/Stack/Stack.js";

describe("Public semantic type contracts", () => {
  it("accepts native props and keeps unsafe combinations as compile-time errors", () => {
    const valid = (
      <Stack as="form" ref={createRef<HTMLFormElement>()} action="/save" />
    );
    expect(valid).toBeDefined();
    // @ts-expect-error Layouts do not become native interactive controls.
    const interactive = <Stack as="button" />;
    // @ts-expect-error A native form ref is not an anchor ref.
    const wrongRef = <Stack as="form" ref={createRef<HTMLAnchorElement>()} />;
    // @ts-expect-error Grid column modes are deliberately exclusive.
    const ambiguous = <Grid columns={2} minColumnWidth="12rem" />;
    // @ts-expect-error Heading hierarchy must be specified explicitly.
    const hierarchy = <Heading>Missing level</Heading>;
    // @ts-expect-error Unknown measurements are not silently represented as zero.
    const unknown = <Meter value={null} />;
    expect([interactive, wrongRef, ambiguous, hierarchy, unknown]).toHaveLength(
      5,
    );
  });
});
