import { useState } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Box } from "../Box/Box.js";
import { Button } from "../Button/Button.js";
import { Code } from "../Code/Code.js";
import { Inline } from "../Inline/Inline.js";
import { ScrollArea } from "../ScrollArea/ScrollArea.js";
import { Text } from "../Text/Text.js";
import { codeBlock, pre } from "./CodeBlock.css.js";
import type { CodeBlockProps } from "./CodeBlock.types.js";
export function CodeBlock({
  code,
  label = "Example code",
  copyable = true,
  className,
  ...props
}: CodeBlockProps) {
  const [result, setResult] = useState<{
    code: string;
    success: boolean;
  } | null>(null);
  const feedback =
    result?.code === code
      ? result.success
        ? "Copied to clipboard."
        : "Clipboard unavailable. Select the code and copy it manually."
      : "";
  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      setResult({ code, success: true });
    } catch {
      setResult({ code, success: false });
    }
  }
  return (
    <Box
      {...props}
      surface="subtle"
      border="all"
      radius="lg"
      className={joinClassNames(codeBlock, className)}
    >
      <Box paddingInline="md" paddingBlock="sm" border="bottom">
        <Inline justify="between" gap="sm" wrap>
          <Text variant="caption" weight="medium">
            {label}
          </Text>
          {copyable ? (
            <Button
              size="sm"
              variant="ghost"
              tone="neutral"
              onClick={() => {
                void copy();
              }}
            >
              Copy code
            </Button>
          ) : null}
        </Inline>
      </Box>
      <ScrollArea axis="horizontal" aria-label={label}>
        <pre className={pre}>
          <Code>{code}</Code>
        </pre>
      </ScrollArea>
      {copyable ? (
        <Box paddingInline="md" paddingBlock="xs">
          <Text as="p" role="status" variant="caption" tone="muted">
            {feedback}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
