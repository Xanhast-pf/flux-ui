import { useEffect, useState } from "react";
import type { CodeHighlighter, CodeToken } from "./CodeBlock.types.js";
export function useCodeTokens(
  code: string,
  language: string,
  supplied: readonly CodeToken[] | undefined,
  highlight: CodeHighlighter | undefined,
) {
  const [result, setResult] = useState<{
    code: string;
    language: string;
    highlight: CodeHighlighter;
    tokens: readonly CodeToken[];
  } | null>(null);
  useEffect(() => {
    if (!highlight || supplied || code.length > 500_000) return;
    const controller = new AbortController();
    // Promise assimilation also handles synchronous providers and thrown errors.
    void Promise.resolve()
      .then(() =>
        controller.signal.aborted
          ? undefined
          : highlight(code, language, controller.signal),
      )
      .then(
        (tokens) => {
          if (tokens !== undefined && !controller.signal.aborted)
            setResult({ code, language, highlight, tokens });
        },
        () => {
          /* Plain source remains readable if a grammar fails to load. */
        },
      );
    return () => controller.abort();
  }, [code, language, supplied, highlight]);
  return (
    supplied ??
    (result?.code === code &&
    result.language === language &&
    result.highlight === highlight
      ? result.tokens
      : undefined)
  );
}
