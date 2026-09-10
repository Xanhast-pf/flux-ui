import { mkdir, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

const rawName = process.argv[2];
if (!rawName) {
  console.error(
    "Usage: pnpm component:new ComponentName [category] [sizeClass]",
  );
  process.exit(1);
}
if (!/^[A-Z][A-Za-z0-9]*$/.test(rawName)) {
  throw new Error("Component name must be PascalCase, e.g. SegmentedControl.");
}
const category = process.argv[3] ?? "Uncategorized";
const sizeClass = process.argv[4] ?? "primitive";
const validSizeClasses = [
  "primitive",
  "interactive",
  "overlay",
  "composite",
  "data-heavy",
];
if (!validSizeClasses.includes(sizeClass)) {
  throw new Error(`sizeClass must be one of: ${validSizeClasses.join(", ")}.`);
}
const root = process.cwd();
const dir = resolve(root, "packages/react/src/components", rawName);
let componentExists = true;
try {
  await access(dir);
} catch (error) {
  if (!isMissingPathError(error)) throw error;
  componentExists = false;
}
if (componentExists) throw new Error(`${rawName} already exists.`);

await mkdir(dir, { recursive: true });

const slug = rawName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const lower = rawName[0].toLowerCase() + rawName.slice(1);
const files = {
  [`${rawName}.types.ts`]: `import type { ComponentPropsWithRef } from "react";\n\nexport interface ${rawName}Props extends ComponentPropsWithRef<"div"> {}\n`,
  [`${rawName}.tsx`]: `import { ${lower} } from "./${rawName}.css.js";\nimport type { ${rawName}Props } from "./${rawName}.types.js";\n\nexport function ${rawName}({ className, ...props }: ${rawName}Props) {\n  const classes = className ? \`${"${" + lower + "}"} ${"${className}"}\` : ${lower};\n  return <div className={classes} {...props} />;\n}\n`,
  [`${rawName}.css.ts`]: `import { style } from "@vanilla-extract/css";\n\nexport const ${lower} = style({});\n`,
  [`${rawName}.test.tsx`]: `import { render, screen } from "@testing-library/react";\nimport { describe, expect, it } from "vitest";\nimport { ${rawName} } from "./${rawName}.js";\n\ndescribe("${rawName}", () => {\n  it("renders its content", () => {\n    render(<${rawName}>Example</${rawName}>);\n    expect(screen.getByText("Example")).toBeInTheDocument();\n  });\n});\n`,
  [`${rawName}.stories.tsx`]: `import type { Meta, StoryObj } from "@storybook/react-vite";\nimport { ${rawName} } from "./${rawName}.js";\n\nconst meta = {\n  title: "${category}/${rawName}",\n  component: ${rawName},\n} satisfies Meta<typeof ${rawName}>;\n\nexport default meta;\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {\n  args: { children: "${rawName}" },\n};\n`,
  [`${rawName}.bench.tsx`]: `import { renderToString } from "react-dom/server";\nimport { bench, describe } from "vitest";\nimport { ${rawName} } from "./${rawName}.js";\n\ndescribe("${rawName} SSR", () => {\n  bench("render 1,000 instances", () => {\n    renderToString(\n      <div>\n        {Array.from({ length: 1_000 }, (_, index) => "${slug}-" + index).map((id) => (\n          <${rawName} key={id}>{id}</${rawName}>\n        ))}\n      </div>,\n    );\n  });\n});\n`,
  ["component.meta.json"]:
    JSON.stringify(
      {
        name: rawName,
        slug,
        category,
        status: "alpha",
        description: `${rawName} component.`,
        sizeClass,
      },
      null,
      2,
    ) + "\n",
  ["index.ts"]: `export { ${rawName} } from "./${rawName}.js";\nexport type { ${rawName}Props } from "./${rawName}.types.js";\n`,
};

for (const [name, content] of Object.entries(files)) {
  await writeFile(resolve(dir, name), content, "utf8");
}

// A demo is discovered by filename, not registered in an unrelated app module.
const exampleDir = resolve(root, "apps/docs/src/examples");
await mkdir(exampleDir, { recursive: true });
const previewCode = `import { ${rawName} } from "@flux-ui/react";\n\nexport default function Preview() {\n  return <${rawName}>Example</${rawName}>;\n}\n`;
await writeFile(
  resolve(exampleDir, `${slug}.preview.tsx`),
  previewCode,
  "utf8",
);
await writeFile(
  resolve(exampleDir, `${slug}.example.tsx`),
  [
    `import Preview from "./${slug}.preview.js";`,
    `import code from "./${slug}.preview.tsx?raw";`,
    'import type { ComponentExample } from "../lib/examples.js";',
    'export default { Preview, code, notes: ["Document semantics and keyboard behavior before promoting this component."], props: [["Native props", "Element attributes", "Customize this API summary alongside the component."]] } satisfies ComponentExample;',
    "",
  ].join("\n"),
  "utf8",
);

const generated = spawnSync(
  process.execPath,
  [resolve(root, "scripts/generate-components.mjs")],
  {
    cwd: root,
    stdio: "inherit",
  },
);
if (generated.status !== 0) process.exit(generated.status ?? 1);
console.log(`Created ${rawName}. Next: pnpm component:doctor ${rawName}`);
