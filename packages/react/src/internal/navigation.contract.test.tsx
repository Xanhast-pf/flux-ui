import { describe, expect, it } from "vitest";
import { Accordion } from "../components/Accordion/Accordion.js";
import { Pagination } from "../components/Pagination/Pagination.js";
import type {
  PaginationNextProps,
  PaginationPreviousProps,
} from "../components/Pagination/Pagination.types.js";
import { Tabs } from "../components/Tabs/Tabs.js";
import type {
  TabsListProps,
  TabsPanelProps,
  TabsTabProps,
} from "../components/Tabs/Tabs.types.js";

describe("Navigation public type contracts", () => {
  it("accepts valid ownership modes and rejects fixed semantic overrides", () => {
    const valid = (
      <>
        <Tabs.Root defaultValue="one" />
        <Tabs.Root value="one" onValueChange={() => {}} />
        <Accordion.Root name="faq" />
        <Accordion.Root type="multiple" />
        <Pagination.Previous />
        <Pagination.Next />
      </>
    );
    expect(valid).toBeDefined();

    // @ts-expect-error Controlled Tabs require an owner callback.
    const ownerlessTabs = <Tabs.Root value="one" />;
    // @ts-expect-error Tablist role is owned by Tabs.
    const listRole = <Tabs.List role="listbox" />;
    const listOrientation: TabsListProps = {
      // @ts-expect-error Tablist orientation is derived from Root.
      "aria-orientation": "vertical",
    };
    // @ts-expect-error Tab role is fixed by Tabs.
    const tabRole = <Tabs.Tab value="one" role="button" />;
    // @ts-expect-error Tab roving focus owns tabIndex.
    const tabIndex = <Tabs.Tab value="one" tabIndex={0} />;
    // @ts-expect-error Tab IDs are generated from the Root/value pair.
    const tabId = <Tabs.Tab value="one" id="custom" />;
    // JSX permits some hyphenated attributes generically, so verify these
    // exclusions against the exported prop object types directly.
    const tabControls: TabsTabProps = {
      value: "one",
      // @ts-expect-error Tab/panel wiring owns aria-controls.
      "aria-controls": "custom",
    };
    // @ts-expect-error Selection state owns aria-selected.
    const tabSelected: TabsTabProps = { value: "one", "aria-selected": true };
    // @ts-expect-error Panel role is fixed by Tabs.
    const panelRole = <Tabs.Panel value="one" role="region" />;
    // @ts-expect-error Panel IDs are generated from the Root/value pair.
    const panelId = <Tabs.Panel value="one" id="custom" />;
    // @ts-expect-error Panel visibility follows the selected value.
    const panelHidden = <Tabs.Panel value="one" hidden />;
    const panelLabelledBy: TabsPanelProps = {
      value: "one",
      // @ts-expect-error Tab/panel wiring owns aria-labelledby.
      "aria-labelledby": "custom",
    };
    // @ts-expect-error Multiple accordions intentionally have no native group name.
    const multipleName = <Accordion.Root type="multiple" name="faq" />;
    // @ts-expect-error Previous never represents the current page.
    const previousCurrent: PaginationPreviousProps = { "aria-current": "page" };
    // @ts-expect-error Next never represents the current page.
    const nextCurrent: PaginationNextProps = { "aria-current": "page" };

    expect([
      ownerlessTabs,
      listRole,
      listOrientation,
      tabRole,
      tabIndex,
      tabId,
      tabControls,
      tabSelected,
      panelRole,
      panelId,
      panelHidden,
      panelLabelledBy,
      multipleName,
      previousCurrent,
      nextCurrent,
    ]).toHaveLength(15);
  });
});
