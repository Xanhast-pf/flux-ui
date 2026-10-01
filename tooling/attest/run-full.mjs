import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { recordLocalFullCheckReceipt } from "./full-check.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const result = spawnSync(
  process.execPath,
  ["tooling/terminal/tasks.mjs", "check:full"],
  {
    cwd: root,
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const recorded = recordLocalFullCheckReceipt(root);
  if (recorded.recorded) {
    console.log(
      `Full-check receipt recorded for ${recorded.receipt.commit.slice(0, 12)}.`,
    );
  } else {
    console.warn(
      "Full check passed, but no reusable receipt was recorded because the working tree is dirty. Commit the intended changes before pushing; pre-push will run the full gate again.",
    );
  }
}
