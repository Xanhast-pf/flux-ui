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

  const combobox = contracts.find((contract) => contract.name === "Combobox");
  assert.deepEqual(combobox?.parts[0]?.stateModels, ["query", "value"]);

  const dataGrid = contracts.find((contract) => contract.name === "DataGrid");
  assert.deepEqual(dataGrid?.parts[0]?.stateModels, [
    "selectedRowIds",
    "sorting",
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
    ["Textarea", "Textarea", ["data-invalid"]],
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
    ["ButtonGroup", "ButtonGroup", ["data-orientation"]],
    ["LevelMeter", "LevelMeter", ["data-orientation"]],
    ["Separator", "Separator", ["data-orientation"]],
    ["Slider", "Slider", ["data-orientation"]],
    ["SplitPane", "SplitPane", ["data-orientation"]],
    ["Stepper", "Stepper.Root", ["data-orientation"]],
    ["Toolbar", "Toolbar.Root", ["data-orientation"]],
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
