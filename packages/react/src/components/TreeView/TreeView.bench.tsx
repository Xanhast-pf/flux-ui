import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { TreeView } from "./TreeView.js";

describe("TreeView SSR", () => {
  bench("render 250 expanded three-level trees", () => {
    renderToString(
      <div>
        {Array.from({ length: 250 }, (_, index) => (
          <TreeView.Root
            key={index}
            aria-label={`Files ${index + 1}`}
            defaultValue={["src", "components"]}
          >
            <TreeView.Item value="src" label="src">
              <TreeView.Item value="components" label="components">
                <TreeView.Item value="button" label="Button.tsx" />
                <TreeView.Item value="input" label="Input.tsx" />
              </TreeView.Item>
              <TreeView.Item value="index" label="index.ts" />
            </TreeView.Item>
          </TreeView.Root>
        ))}
      </div>,
    );
  });
});
