import { Button, Inline } from "@flux-ui/react";
import { useState } from "react";
type CopyState = "idle" | "copied" | "failed";
export function CodeBlock({
  code,
  label = "Example code",
}: {
  code: string;
  label?: string;
}) {
  const [result, setResult] = useState<{
    code: string;
    state: CopyState;
  } | null>(null);
  const copyState =
    result !== null && result.code === code ? result.state : "idle";
  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      setResult({ code, state: "copied" });
    } catch {
      setResult({ code, state: "failed" });
    }
  }
  return (
    <div className="code-block">
      <Inline justify="between" wrap className="code-toolbar">
        <span>{label}</span>
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
      </Inline>
      <pre role="region" aria-label={label}>
        <code>{code}</code>
      </pre>
      <p className="copy-status" role="status">
        {copyState === "copied"
          ? "Copied to clipboard."
          : copyState === "failed"
            ? "Clipboard unavailable. Select the code and copy it manually."
            : ""}
      </p>
    </div>
  );
}
