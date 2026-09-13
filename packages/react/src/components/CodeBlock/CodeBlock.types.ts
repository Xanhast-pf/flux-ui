import type { ComponentPropsWithRef } from "react";
export type CodeTokenKind =
  "comment" | "keyword" | "string" | "number" | "property" | "punctuation";
/** UTF-16 offsets into the original, unmodified source. Tokens must not overlap. */
export interface CodeToken {
  start: number;
  end: number;
  kind: CodeTokenKind;
}
export type CodeHighlighter = (
  code: string,
  language: string,
  signal: AbortSignal,
) => readonly CodeToken[] | Promise<readonly CodeToken[]>;
export type CodeBlockProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  code: string;
  label?: string | undefined;
  copyable?: boolean | undefined;
  language?: string | undefined;
  /** Precomputed tokens are suitable for static docs and server rendering. */
  tokens?: readonly CodeToken[] | undefined;
  /** Optional grammar adapter. Plain CodeBlock does not load a highlighter. */
  highlight?: CodeHighlighter | undefined;
};
