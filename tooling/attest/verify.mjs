import { fileURLToPath } from "node:url";
import { verifyFullCheckNote } from "./full-check.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const commit = process.argv[2] ?? "HEAD";
const allowTreeMatch = process.argv.includes("--allow-tree-match");

try {
  const result = verifyFullCheckNote(root, commit, undefined, {
    allowTreeMatch,
  });
  if (!result.valid) {
    throw new Error(
      `Missing or invalid local full-check attestation for ${result.identity.commit}.`,
    );
  }
  console.log(
    `Verified local full-check attestation for ${result.identity.commit} by ${result.match} match (${result.receipt.finishedAt}).`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
