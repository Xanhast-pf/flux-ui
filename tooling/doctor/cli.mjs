import { diagnose } from "./doctor.mjs";
const result = diagnose();
for (const { status, message, remedy } of result.checks) {
  console.log(`${{ pass: "✓", warning: "⚠", fail: "✖" }[status]} ${message}`);
  if (status !== "pass") console.log(`  ${remedy}`);
}
process.exitCode = result.exitCode;
