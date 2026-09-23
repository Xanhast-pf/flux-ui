import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { commands } from "./tooling/terminal/commands.mjs";

// CLI entrypoints moved from package scripts into the shared argv registry.
// Keep Knip discovery derived from executable tasks, while avoiding duplicate
// roots that Knip already discovers from GitHub workflow run commands.
const root = fileURLToPath(new URL("./", import.meta.url));
const workflows = join(root, ".github/workflows");

const workflowEntries = new Set(
  existsSync(workflows)
    ? readdirSync(workflows, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.ya?ml$/u.test(entry.name))
        .flatMap((entry) => {
          const source = readFileSync(join(workflows, entry.name), "utf8");
          return [...source.matchAll(/\bnode\s+([^\s"']+\.mjs)\b/gu)].map(
            (match) => match[1].replace(/^\.\//u, ""),
          );
        })
    : [],
);

const entry = [
  ...new Set(
    Object.values(commands)
      .flat()
      .flatMap((command) =>
        command[0] === "node"
          ? command
              .slice(1)
              .filter((arg) => arg.endsWith(".mjs") && !arg.startsWith("-"))
          : [],
      )
      .filter((path) => !workflowEntries.has(path)),
  ),
];

export default {
  workspaces: {
    ".": {
      entry: [...entry, "tooling/terminal/node-reporter.mjs"],
    },
    "apps/docs": {
      entry: [
        "scripts/browser-prerequisite.mjs",
        "consumer/main.tsx",
        "consumer/types.tsx",
        "consumer/*.config.ts",
        "consumer/*.spec.ts",
      ],
      project: [
        "src/**/*.{ts,tsx}",
        "tests/**/*.ts",
        "consumer/*.{ts,tsx}",
        "*.config.ts",
      ],
    },
  },
};
