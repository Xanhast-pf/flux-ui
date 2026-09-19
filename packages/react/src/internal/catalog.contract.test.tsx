import { describe, expect, it } from "vitest";
import { Avatar } from "../components/Avatar/Avatar.js";
import type { AvatarProps } from "../components/Avatar/Avatar.types.js";
import type { CodeBlockProps } from "../components/CodeBlock/CodeBlock.types.js";
import { ColorSwatch } from "../components/ColorSwatch/ColorSwatch.js";
import type { ColorSwatchProps } from "../components/ColorSwatch/ColorSwatch.types.js";
import type { PageHeaderProps } from "../components/PageHeader/PageHeader.types.js";
import { ScrollArea } from "../components/ScrollArea/ScrollArea.js";
import type { ScrollAreaProps } from "../components/ScrollArea/ScrollArea.types.js";
import { Sidebar } from "../components/Sidebar/Sidebar.js";
import type {
  SidebarRootProps,
  SidebarToggleProps,
} from "../components/Sidebar/Sidebar.types.js";
import { SplitPane } from "../components/SplitPane/SplitPane.js";
import type { SplitPaneProps } from "../components/SplitPane/SplitPane.types.js";

const paneBase = {
  label: "Resize workspace",
  first: "First",
  second: "Second",
} as const;

describe("Final catalog public type contracts", () => {
  it("keeps ownership, decorative semantics and composed content explicit", () => {
    const valid = (
      <>
        <Sidebar.Root defaultOpen />
        <Sidebar.Root open onOpenChange={() => {}} />
        <SplitPane {...paneBase} defaultValue={50} />
        <SplitPane {...paneBase} value={50} onValueChange={() => {}} />
        <Avatar alt="Team" />
        <Avatar alt="" />
        <ColorSwatch color="#123456" />
        <ScrollArea aria-label="Results">Content</ScrollArea>
      </>
    );
    expect(valid).toBeDefined();

    // @ts-expect-error Controlled Sidebar state requires an owner callback.
    const ownerlessSidebar: SidebarRootProps = { open: true };
    // @ts-expect-error Controlled Sidebar state cannot also declare a default.
    const ambiguousSidebar: SidebarRootProps = {
      open: true,
      defaultOpen: true,
      onOpenChange: () => {},
    };
    // @ts-expect-error Controlled SplitPane state requires an owner callback.
    const ownerlessSplitPane: SplitPaneProps = { ...paneBase, value: 50 };
    // @ts-expect-error Controlled SplitPane state cannot also declare a default.
    const ambiguousSplitPane: SplitPaneProps = {
      ...paneBase,
      value: 50,
      defaultValue: 40,
      onValueChange: () => {},
    };
    const toggleControls: SidebarToggleProps = {
      children: "Navigation",
      // @ts-expect-error Sidebar owns its panel wiring.
      "aria-controls": "custom",
    };
    const toggleExpanded: SidebarToggleProps = {
      children: "Navigation",
      // @ts-expect-error Sidebar owns expanded state.
      "aria-expanded": true,
    };

    const avatarHidden: AvatarProps = {
      alt: "Team",
      // @ts-expect-error Avatar owns exposed-vs-decorative visibility.
      "aria-hidden": true,
    };
    const avatarHtml: AvatarProps = {
      alt: "Team",
      // @ts-expect-error Avatar owns its fallback/image child composition.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };

    const swatchRole: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error ColorSwatch is always decorative.
      role: "img",
    };
    const swatchTabIndex: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error Decorative swatches never enter the tab order.
      tabIndex: 0,
    };
    const swatchHidden: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error ColorSwatch owns aria-hidden.
      "aria-hidden": false,
    };
    const swatchLabel: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error Accessible naming belongs to the enclosing control.
      "aria-label": "Blue",
    };
    const swatchLabelledBy: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error Accessible naming belongs to the enclosing control.
      "aria-labelledby": "blue-label",
    };
    const swatchHtml: ColorSwatchProps = {
      color: "#123456",
      // @ts-expect-error ColorSwatch owns its decorative child content.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };

    const codeHtml: CodeBlockProps = {
      code: "const answer = 42;",
      // @ts-expect-error CodeBlock owns its literal/code/status child tree.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const headerHtml: PageHeaderProps = {
      title: "Components",
      // @ts-expect-error PageHeader owns its heading/content composition.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const splitHtml: SplitPaneProps = {
      ...paneBase,
      // @ts-expect-error SplitPane owns both panes and separator content.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const hiddenScrollArea: ScrollAreaProps = {
      "aria-label": "Results",
      // @ts-expect-error Named scroll regions may become focusable and cannot be aria-hidden.
      "aria-hidden": true,
    };

    expect([
      ownerlessSidebar,
      ambiguousSidebar,
      ownerlessSplitPane,
      ambiguousSplitPane,
      toggleControls,
      toggleExpanded,
      avatarHidden,
      avatarHtml,
      swatchRole,
      swatchTabIndex,
      swatchHidden,
      swatchLabel,
      swatchLabelledBy,
      swatchHtml,
      codeHtml,
      headerHtml,
      splitHtml,
      hiddenScrollArea,
    ]).toHaveLength(18);
  });
});
