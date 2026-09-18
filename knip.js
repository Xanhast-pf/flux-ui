import { commands } from "./tooling/terminal/commands.mjs";

// CLI entrypoints moved from package scripts into the shared argv registry.
// Keep Knip discovery derived from the executable tasks, not a duplicate allowlist.
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
      ),
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
