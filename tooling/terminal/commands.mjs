import commands from "./commands.json" with { type: "json" };
export { commands };
export function scriptSource(scripts, name) {
  return scripts[name] === `node tooling/terminal/cli.mjs ${name}`
    ? commands[name]
    : scripts[name];
}

const labels = {
  "generate:check": "Generated files",
  "docs:check": "Docs coverage",
  "dogfood:check": "Dogfood",
  "format:check": "Format",
  "build:packages": "Package builds",
  lint: "ESLint",
  typecheck: "TypeScript",
  knip: "Knip",
  test: "Tests",
  build: "Build",
  size: "Size",
  "bible:check": "Coding Bible",
  "storybook:build": "Storybook",
  "test:e2e": "Browser tests",
  "perf:smoke": "Performance smoke",
  "consumer:check": "Consumer verification",
};
export function commandLabel(command) {
  return labels[command[1]] || command.slice(1).join(" ");
}

export function commandProgress(name, command, current, total) {
  return {
    current,
    total,
    unit: name === "build:packages" ? "packages" : "steps",
    item: commandLabel(command),
  };
}
