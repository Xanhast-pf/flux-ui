import { useState } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { ScrollArea } from "../ScrollArea/ScrollArea.js";
import { Button } from "../Button/Button.js";
import { codeBlock, header, pre, status, token } from "./CodeBlock.css.js";
import { codeSegments } from "./codeSegments.js";
import { useCodeTokens } from "./useCodeTokens.js";
import type { CodeBlockProps } from "./CodeBlock.types.js";
export function CodeBlock({
  code,
  label = "Example code",
  copyable = true,
  language = "text",
  tokens,
  highlight,
  className,
  ...props
}: CodeBlockProps) {
  const resolvedTokens = useCodeTokens(code, language, tokens, highlight);
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
    <div {...props} className={joinClassNames(codeBlock, className)}>
      <div className={header}>
        <span>{label}</span>
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
      </div>
      <ScrollArea aria-label={label} axis="horizontal">
        <pre className={pre}>
          <code data-language={language}>
            {codeSegments(code, resolvedTokens).map((segment) =>
              segment.kind ? (
                <span
                  className={token}
                  data-token={segment.kind}
                  key={segment.start}
                >
                  {segment.content}
                </span>
              ) : (
                segment.content
              ),
            )}
          </code>
        </pre>
      </ScrollArea>
      {copyable ? (
        <p className={status} role="status">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
