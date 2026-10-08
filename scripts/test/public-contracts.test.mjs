import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createPublicContracts } from "../lib/public-contracts.mjs";

test("public component contracts derive from the TypeScript export surface", () => {
  const root = process.cwd();
  const componentRoot = path.resolve(root, "packages/react/src/components");
  const familyNames = readdirSync(componentRoot)
    .filter((name) =>
      existsSync(path.join(componentRoot, name, "component.meta.json")),
    )
    .sort();
  const declaredControllers = familyNames.flatMap((name) => {
    const meta = JSON.parse(
      readFileSync(
        path.join(componentRoot, name, "component.meta.json"),
        "utf8",
      ),
    );
    return meta.nonDomParts ?? [];
  });
  const { contracts, errors } = createPublicContracts(root);
  assert.deepEqual(errors, []);
  assert.equal(contracts.length, familyNames.length);

  const controllerPaths = contracts.flatMap((contract) =>
    contract.parts
      .filter((part) => part.kind === "controller")
      .map((part) => part.path),
  );
  assert.deepEqual(controllerPaths, declaredControllers.sort());

  const domParts = contracts.flatMap((contract) =>
    contract.parts.filter((part) => part.kind === "dom"),
  );
  assert.ok(domParts.length > 0);
  assert.equal(
    domParts.every((part) => part.escapeHatches.includes("ref")),
    true,
  );

  for (const contract of contracts) {
    const meta = JSON.parse(
      readFileSync(
        path.join(componentRoot, contract.name, "component.meta.json"),
        "utf8",
      ),
    );
    assert.equal(contract.lifecycle, meta.status);
  }

  const codeBlock = contracts.find((contract) => contract.name === "CodeBlock");
  assert.deepEqual(codeBlock?.utilities, ["codeLanguages", "tokenizeCode"]);
  assert.deepEqual(codeBlock?.types, [
    "CodeBlockProps",
    "CodeHighlighter",
    "CodeToken",
    "CodeTokenKind",
  ]);

  const toast = contracts.find((contract) => contract.name === "Toast");
  assert.deepEqual(toast?.utilities, ["useToast"]);
  assert.ok(toast?.types.includes("ToastProviderProps"));
  assert.ok(toast?.types.includes("ToastViewportProps"));

  const slider = contracts.find((contract) => contract.name === "Slider");
  assert.ok(slider);
  assert.deepEqual(slider.parts[0].cssVariables, [
    "--flux-slider-length",
    "--flux-slider-thumb-block-size",
    "--flux-slider-thumb-inline-size",
    "--flux-slider-thumb-radius",
    "--flux-slider-thumb-size",
    "--flux-slider-track-size",
  ]);

  const avatar = contracts.find((contract) => contract.name === "Avatar");
  assert.ok(avatar);
  assert.ok(avatar.parts.some((part) => part.path === "AvatarGroup"));

  const tabs = contracts.find((contract) => contract.name === "Tabs");
  assert.ok(tabs);
  assert.deepEqual(
    tabs.parts.map((part) => part.path),
    ["Tabs.List", "Tabs.Panel", "Tabs.Root", "Tabs.Tab"],
  );
  assert.deepEqual(
    tabs.parts.find((part) => part.path === "Tabs.Root")?.stateModels,
    ["value"],
  );

  const dialog = contracts.find((contract) => contract.name === "Dialog");
  assert.deepEqual(
    dialog?.parts.find((part) => part.path === "Dialog.Root")?.stateModels,
    ["open"],
  );
  assert.deepEqual(
    dialog?.parts.find((part) => part.path === "Dialog.Trigger")
      ?.dataAttributes,
    ["data-state"],
  );
  assert.deepEqual(
    dialog?.parts.find((part) => part.path === "Dialog.Popup")?.dataAttributes,
    ["data-state"],
  );

  const checkbox = contracts.find((contract) => contract.name === "Checkbox");
  assert.deepEqual(checkbox?.parts[0]?.stateModels, ["checked"]);

  const toggle = contracts.find((contract) => contract.name === "Toggle");
  assert.deepEqual(toggle?.parts[0]?.stateModels, ["pressed"]);

  const treeView = contracts.find((contract) => contract.name === "TreeView");
  assert.deepEqual(
    treeView?.parts.find((part) => part.path === "TreeView.Root")?.stateModels,
    ["expandedItems"],
  );
  assert.deepEqual(
    treeView?.parts.find((part) => part.path === "TreeView.Item")
      ?.dataAttributes,
    ["data-expandable", "data-expanded"],
  );

  const chartLegend = contracts.find(
    (contract) => contract.name === "ChartLegend",
  );
  assert.deepEqual(chartLegend?.parts[0]?.stateModels, ["hiddenIds"]);
  assert.deepEqual(chartLegend?.descendantStates, [
    {
      name: "hiddenItem",
      selector: "[data-hidden]",
      dataAttributes: ["data-hidden"],
    },
  ]);

  const chartTooltip = contracts.find(
    (contract) => contract.name === "ChartTooltip",
  );
  assert.deepEqual(chartTooltip?.descendantStates, [
    {
      name: "popup",
      selector: "[data-align]",
      dataAttributes: ["data-align", "data-side"],
    },
  ]);

  const chart = contracts.find((contract) => contract.name === "Chart");
  assert.deepEqual(chart?.descendantStates, [
    {
      name: "series",
      selector: "[data-muted]",
      dataAttributes: ["data-muted"],
    },
  ]);

  const scatterChart = contracts.find(
    (contract) => contract.name === "ScatterChart",
  );
  assert.deepEqual(scatterChart?.descendantStates, [
    {
      name: "series",
      selector: "[data-muted]",
      dataAttributes: ["data-muted"],
    },
  ]);

  const pieChart = contracts.find((contract) => contract.name === "PieChart");
  assert.deepEqual(pieChart?.descendantStates, [
    {
      name: "slice",
      selector: "[data-active]",
      dataAttributes: ["data-active"],
    },
  ]);

  const combobox = contracts.find((contract) => contract.name === "Combobox");
  assert.deepEqual(combobox?.parts[0]?.stateModels, ["query", "value"]);
  assert.deepEqual(combobox?.descendantStates, [
    {
      name: "popup",
      selector: "[data-state]",
      dataAttributes: ["data-state"],
    },
  ]);

  const dataGrid = contracts.find((contract) => contract.name === "DataGrid");
  assert.deepEqual(dataGrid?.parts[0]?.stateModels, [
    "selectedRowIds",
    "sorting",
  ]);
  assert.deepEqual(dataGrid?.descendantStates, [
    {
      name: "cell",
      selector: '[role="gridcell"]',
      dataAttributes: ["data-editable", "data-editing"],
    },
    {
      name: "row",
      selector: '[role="row"]',
      dataAttributes: ["data-selected"],
    },
  ]);

  const dataTable = contracts.find((contract) => contract.name === "DataTable");
  assert.deepEqual(dataTable?.parts[0]?.stateModels, [
    "selectedRowIds",
    "sorting",
  ]);

  const pagination = contracts.find(
    (contract) => contract.name === "Pagination",
  );
  assert.deepEqual(
    pagination?.parts.find((part) => part.path === "Pagination.Root")
      ?.stateModels,
    ["page"],
  );

  const button = contracts.find((contract) => contract.name === "Button");
  assert.deepEqual(button?.parts[0]?.dataAttributes, ["data-loading"]);

  const alertDialog = contracts.find(
    (contract) => contract.name === "AlertDialog",
  );
  assert.deepEqual(
    alertDialog?.parts.find((part) => part.path === "AlertDialog.Trigger")
      ?.dataAttributes,
    ["data-state"],
  );
  assert.deepEqual(
    alertDialog?.parts.find((part) => part.path === "AlertDialog.Popup")
      ?.dataAttributes,
    ["data-state"],
  );

  const drawer = contracts.find((contract) => contract.name === "Drawer");
  assert.deepEqual(
    drawer?.parts.find((part) => part.path === "Drawer.Trigger")
      ?.dataAttributes,
    ["data-state"],
  );
  assert.deepEqual(
    drawer?.parts.find((part) => part.path === "Drawer.Popup")?.dataAttributes,
    ["data-side", "data-state"],
  );

  const popover = contracts.find((contract) => contract.name === "Popover");
  assert.deepEqual(
    popover?.parts.find((part) => part.path === "Popover.Popup")
      ?.dataAttributes,
    ["data-align", "data-side", "data-state"],
  );

  const dropdownMenu = contracts.find(
    (contract) => contract.name === "DropdownMenu",
  );
  assert.deepEqual(
    dropdownMenu?.parts.find((part) => part.path === "DropdownMenu.Popup")
      ?.dataAttributes,
    ["data-align", "data-side", "data-state"],
  );

  const tooltip = contracts.find((contract) => contract.name === "Tooltip");
  assert.deepEqual(tooltip?.parts[0]?.dataAttributes, [
    "data-align",
    "data-side",
    "data-state",
  ]);

  for (const [componentName, partPath, attributes] of [
    ["Input", "Input", ["data-invalid"]],
    ["Checkbox", "Checkbox", ["data-invalid"]],
    ["Select", "Select", ["data-invalid"]],
    ["Switch", "Switch", ["data-invalid"]],
    ["Textarea", "Textarea", ["data-auto-size", "data-invalid"]],
    ["NumberField", "NumberField", ["data-invalid"]],
    ["DatePicker", "DatePicker", ["data-invalid"]],
    ["DateTimePicker", "DateTimePicker", ["data-invalid"]],
    ["TimePicker", "TimePicker", ["data-invalid"]],
    ["Rating", "Rating", ["data-readonly"]],
    ["RadioGroup", "RadioGroup.Root", ["data-invalid"]],
    ["RadioGroup", "RadioGroup.Item", ["data-invalid"]],
    ["Field", "Field.Root", ["data-disabled", "data-invalid"]],
    ["Combobox", "Combobox", ["data-invalid"]],
    ["InputGroup", "InputGroup.Input", ["data-invalid"]],
    ["Accordion", "Accordion.Root", ["data-type"]],
    ["ButtonGroup", "ButtonGroup", ["data-orientation"]],
    ["Container", "Container", ["data-query"]],
    ["LevelMeter", "LevelMeter", ["data-orientation"]],
    ["Separator", "Separator", ["data-orientation"]],
    ["ScrollArea", "ScrollArea", ["data-axis"]],
    ["Slider", "Slider", ["data-appearance", "data-orientation"]],
    ["SplitPane", "SplitPane", ["data-orientation"]],
    ["Stepper", "Stepper.Root", ["data-orientation"]],
    ["Toolbar", "Toolbar.Root", ["data-orientation"]],
    ["ThemeScope", "ThemeScope", ["data-query"]],
    ["Toolbar", "Toolbar.Separator", ["data-orientation"]],
  ]) {
    const contract = contracts.find(
      (candidate) => candidate.name === componentName,
    );
    assert.deepEqual(
      contract?.parts.find((part) => part.path === partPath)?.dataAttributes,
      attributes,
    );
  }
});
