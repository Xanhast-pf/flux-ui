import { Box, CodeBlock, tokenizeCode } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  const code = Array.from(
    { length: count },
    (_, i) => `const value${i} = ${i + revision};`,
  ).join("\n");
  return (
    <Box data-perf-root>
      <CodeBlock
        code={code}
        tokens={tokenizeCode(code, "typescript")}
        language="typescript"
        copyable={false}
      />
    </Box>
  );
}
