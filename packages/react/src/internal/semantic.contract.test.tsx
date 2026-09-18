import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Grid } from "../components/Grid/Grid.js";
import { Heading } from "../components/Heading/Heading.js";
import { Inline } from "../components/Inline/Inline.js";
import { Link } from "../components/Link/Link.js";
import { Meter } from "../components/Meter/Meter.js";
import { Slider } from "../components/Slider/Slider.js";
import { Stack } from "../components/Stack/Stack.js";
import { Switch } from "../components/Switch/Switch.js";
import { ThemeScope } from "../components/ThemeScope/ThemeScope.js";

describe("Public semantic type contracts", () => {
  it("accepts native props and keeps unsafe combinations as compile-time errors", () => {
    const maybeAlign: "center" | undefined = undefined;
    const maybeJustify: "between" | undefined = undefined;
    const maybeWrap: boolean | undefined = undefined;
    const valid = (
      <>
        <Stack
          as="form"
          ref={createRef<HTMLFormElement>()}
          action="/save"
          align={maybeAlign}
        />
        <Inline align={maybeAlign} justify={maybeJustify} wrap={maybeWrap} />
        <Link href="/docs" variant="navigation">
          Docs
        </Link>
        <Link href="/download" variant="solid" tone="neutral" size="sm">
          Download
        </Link>
        <Switch aria-label="Alerts" disabled />
        <Slider aria-label="Level" disabled />
      </>
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
    // @ts-expect-error ThemeScope owns only axis-level surface spacing.
    const themeEdge = <ThemeScope theme="paper" paddingBlockStart="sm" />;
    const linkTone = (
      // @ts-expect-error Text links do not expose action-only tone.
      <Link href="/danger" tone="danger">
        Danger
      </Link>
    );
    const linkSize = (
      // @ts-expect-error Navigation links do not expose action-only sizing.
      <Link href="/docs" variant="navigation" size="sm">
        Docs
      </Link>
    );
    // @ts-expect-error Native checkbox switches have no read-only interaction mode.
    const readonlySwitch = <Switch aria-label="Alerts" readOnly />;
    // @ts-expect-error Native range inputs have no read-only interaction mode.
    const readonlySlider = <Slider aria-label="Level" readOnly />;

    expect([
      interactive,
      wrongRef,
      ambiguous,
      hierarchy,
      unknown,
      themeEdge,
      linkTone,
      linkSize,
      readonlySwitch,
      readonlySlider,
    ]).toHaveLength(10);
  });
});
