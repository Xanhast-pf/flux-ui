import { describe, expect, it } from "vitest";
import { Button } from "../components/Button/Button.js";
import type { ButtonProps } from "../components/Button/Button.types.js";
import { IconButton } from "../components/IconButton/IconButton.js";
import type { IconButtonProps } from "../components/IconButton/IconButton.types.js";
import { ToggleGroup } from "../components/ToggleGroup/ToggleGroup.js";
import { Toolbar } from "../components/Toolbar/Toolbar.js";
import type {
  ToolbarButtonProps,
  ToolbarSeparatorProps,
} from "../components/Toolbar/Toolbar.types.js";

describe("Action public type contracts", () => {
  it("keeps state ownership and runtime-owned semantics explicit", () => {
    const valid = (
      <>
        <Button loading>Save</Button>
        <IconButton aria-label="Save">✓</IconButton>
        <ToggleGroup.Root type="single" defaultValue="grid" aria-label="View" />
        <ToggleGroup.Root
          type="single"
          value="grid"
          onValueChange={() => {}}
          aria-label="View"
        />
        <ToggleGroup.Root
          type="multiple"
          value={["grid"]}
          onValueChange={() => {}}
          aria-label="Modes"
        />
        <Toolbar.Root aria-label="Editor">
          <Toolbar.Button loading>Save</Toolbar.Button>
          <Toolbar.Separator />
        </Toolbar.Root>
      </>
    );
    expect(valid).toBeDefined();

    const ownerlessSingle = (
      // @ts-expect-error Controlled single groups require an owner callback.
      <ToggleGroup.Root type="single" value="grid" aria-label="View" />
    );
    const ownerlessMultiple = (
      // @ts-expect-error Controlled multiple groups require an owner callback.
      <ToggleGroup.Root type="multiple" value={["grid"]} aria-label="Modes" />
    );
    const busyButton: ButtonProps = {
      children: "Save",
      // @ts-expect-error Loading owns Button busy semantics.
      "aria-busy": true,
    };
    const busyIconButton: IconButtonProps = {
      children: "✓",
      "aria-label": "Save",
      // @ts-expect-error IconButton inherits loading-owned busy semantics.
      "aria-busy": true,
    };
    const busyToolbarButton: ToolbarButtonProps = {
      children: "Save",
      // @ts-expect-error Toolbar.Button loading owns busy semantics.
      "aria-busy": true,
    };
    const separatorRole: ToolbarSeparatorProps = {
      // @ts-expect-error Toolbar.Separator is always decorative.
      role: "separator",
    };
    const separatorOrientation: ToolbarSeparatorProps = {
      // @ts-expect-error Decorative Toolbar separators expose no ARIA orientation.
      "aria-orientation": "vertical",
    };

    expect([
      ownerlessSingle,
      ownerlessMultiple,
      busyButton,
      busyIconButton,
      busyToolbarButton,
      separatorRole,
      separatorOrientation,
    ]).toHaveLength(7);
  });
});
