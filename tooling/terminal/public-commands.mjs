import definitions from "./public-commands.json" with { type: "json" };
import { commands } from "./commands.mjs";

// Human metadata references the same tasks consumed by CI, hooks and verification.
export const publicCommands = definitions;
export const commandTree = { path: "", children: {} };
for (const definition of definitions) {
  if (definition.task && !Object.hasOwn(commands, definition.task))
    throw new Error(`Unknown task for ${definition.path}: ${definition.task}`);
  let node = commandTree;
  for (const name of definition.path.split(" ")) {
    node.children[name] ??= { children: {} };
    node = node.children[name];
  }
  Object.assign(node, definition);
}

export function help(node = commandTree) {
  const lines = [
    "Flux UI",
    "",
    `Usage: ${node.usage ?? "pnpm flux <command>"}`,
  ];
  if (node.summary) {
    lines.push(
      "",
      node.summary,
      node.when,
      `Audience: ${node.audience}. Writes: ${node.writes}.`,
    );
  }
  const children = Object.entries(node.children);
  if (children.length) {
    lines.push("", "Commands:");
    for (const [name, child] of children)
      lines.push(`  ${name.padEnd(12)} ${child.summary}`);
  }
  if (node.options?.length)
    lines.push("", `Options: ${node.options.join(", ")}`);
  if (node.examples)
    lines.push(
      "",
      "Examples:",
      ...node.examples.map((example) => `  ${example}`),
    );
  lines.push(
    "",
    `Run \`pnpm flux${node.path ? ` ${node.path}` : " <command>"} --help\` for details.`,
  );
  return lines.join("\n");
}

export function resolveCommand(argv) {
  const args = [...argv];
  const requestedHelp = args[0] === "help";
  if (requestedHelp) args.shift();
  let node = commandTree;
  while (args.length && Object.hasOwn(node.children, args[0]))
    node = node.children[args.shift()];
  if (!args.length && (requestedHelp || !node.task))
    return { help: help(node) };
  if ((args[0] === "--help" || args[0] === "-h") && args.length === 1)
    return { help: help(node) };
  const available = Object.keys(node.children);
  if (
    !node.task ||
    (available.length && args.length && !args[0].startsWith("-"))
  ) {
    throw new Error(
      `Unknown Flux command: ${JSON.stringify([...node.path.split(" ").filter(Boolean), args[0]].join(" "))}\n\nAvailable: ${available.join(", ")}\nRun \`pnpm flux${node.path ? ` ${node.path}` : ""} --help\` to list commands.`,
    );
  }
  if (requestedHelp) throw new Error(`Unknown help topic.\n${help(node)}`);
  if (!node.forwardArgs) {
    const positional = args.filter((arg) => !arg.startsWith("-"));
    const invalid = args.find(
      (arg) =>
        arg.startsWith("-") &&
        !node.options.some((option) =>
          option.endsWith("=") ? arg.startsWith(option) : arg === option,
        ),
    );
    if (
      invalid ||
      positional.length < node.minArgs ||
      positional.length > node.maxArgs
    )
      throw new Error(
        `${invalid ? `Unknown option: ${invalid}` : "Invalid arguments."}\nUsage: ${node.usage}\nRun \`pnpm flux ${node.path} --help\` for details.`,
      );
  }
  if (node.defaults) {
    const positional = args.filter((arg) => !arg.startsWith("-"));
    const options = args.filter((arg) => arg.startsWith("-"));
    return {
      task: node.task,
      args: [
        ...positional,
        ...node.defaults.slice(positional.length - node.minArgs),
        ...options,
      ],
    };
  }
  return { task: node.task, args };
}
