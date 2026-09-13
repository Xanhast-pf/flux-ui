import {
  CodeBlock as FluxCodeBlock,
  tokenizeCode,
  type CodeBlockProps,
} from "@flux-ui/react";
import { useMemo } from "react";
type DocsCodeProps = Pick<
  CodeBlockProps,
  "code" | "label" | "copyable" | "language"
>;
/** The docs explicitly opt into lexical color; no private styling or hidden grammar dependency. */
export function CodeBlock({
  code,
  label,
  copyable,
  language = "tsx",
}: DocsCodeProps) {
  const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
  return (
    <FluxCodeBlock
      code={code}
      label={label}
      copyable={copyable}
      language={language}
      tokens={tokens}
    />
  );
}
