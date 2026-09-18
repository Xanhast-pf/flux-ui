import assert from "node:assert/strict";
import test from "node:test";
import { createPublicContracts } from "../lib/public-contracts.mjs";

test("public component contracts derive from the TypeScript export surface", () => {
  const { contracts, errors } = createPublicContracts(process.cwd());
  assert.deepEqual(errors, []);
  assert.equal(contracts.length, 69);

  const controllerPaths = contracts.flatMap((contract) =>
    contract.parts
      .filter((part) => part.kind === "controller")
      .map((part) => part.path),
  );
  assert.deepEqual(controllerPaths, [
    "AlertDialog.Root",
    "Dialog.Root",
    "Drawer.Root",
    "DropdownMenu.Root",
    "Field.Control",
    "Popover.Root",
    "Sidebar.Root",
    "Toast.Provider",
  ]);

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
});
