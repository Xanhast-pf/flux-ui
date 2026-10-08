import { TreeView } from "@flux-ui/react";

export default function Preview() {
  return (
    <TreeView.Root aria-label="Project files" defaultExpandedItems={["src"]}>
      <TreeView.Item value="src" label="src">
        <TreeView.Item value="src/components" label="components">
          <TreeView.Item value="src/components/button" label="Button.tsx" />
          <TreeView.Item value="src/components/input" label="Input.tsx" />
        </TreeView.Item>
        <TreeView.Item value="src/index" label="index.ts" />
      </TreeView.Item>
      <TreeView.Item value="package" label="package.json" />
      <TreeView.Item value="readme" label="README.md" />
    </TreeView.Root>
  );
}
