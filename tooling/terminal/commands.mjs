import commands from "./commands.json" with { type: "json" };
export { commands };
// The internal registry is independent of package.json and never parses shell text.
export function taskCommand(name) {
  if (!Object.hasOwn(commands, name)) throw new Error(`Unknown task: ${name}`);
  return ["node", "tooling/terminal/tasks.mjs", name];
}

export function taskName(command) {
  return command[0] === "node" && command[1] === "tooling/terminal/tasks.mjs"
    ? command[2]
    : undefined;
}

const labels = {
  "generate:check": "Generated files",
  "drift:check": "Repository drift",
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
  return (
    labels[taskName(command) ?? command[1]] ||
    taskName(command) ||
    command.slice(1).join(" ")
  );
}

export function commandProgress(name, command, current, total) {
  return {
    current,
    total,
    unit: name === "build:packages" ? "packages" : "steps",
    item: commandLabel(command),
  };
}

export function commandArguments(name, index, extra) {
  const steps = commands[name];
  const measuresSize = steps.some(
    (command) => command[1] === "tooling/size/check.mjs",
  );
  const forward = measuresSize
    ? steps[index][1] === "tooling/size/check.mjs"
    : index === steps.length - 1;
  return [...steps[index], ...(forward ? extra : [])];
}
