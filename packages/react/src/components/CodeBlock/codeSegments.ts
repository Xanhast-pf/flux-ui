import type { CodeTokenKind } from "./CodeBlock.types.js";
const kinds: readonly CodeTokenKind[] = [
  "comment",
  "keyword",
  "string",
  "number",
  "property",
  "punctuation",
];
export interface CodeSegment {
  start: number;
  content: string;
  kind?: CodeTokenKind | undefined;
}
/** External providers cannot inject markup, discard source, or allocate unbounded spans. */
export function codeSegments(code: string, tokens: unknown): CodeSegment[] {
  const plain = [{ start: 0, content: code }];
  if (!Array.isArray(tokens) || tokens.length > 20_000 || code.length > 500_000)
    return plain;
  const items: readonly unknown[] = tokens;
  const result: CodeSegment[] = [];
  let end = 0;
  const dividesPair = (index: number) => {
    const previous = code.charCodeAt(index - 1),
      next = code.charCodeAt(index);
    return (
      previous >= 0xd800 &&
      previous <= 0xdbff &&
      next >= 0xdc00 &&
      next <= 0xdfff
    );
  };
  for (const token of items) {
    if (
      typeof token !== "object" ||
      token === null ||
      !("start" in token) ||
      !("end" in token) ||
      !("kind" in token)
    )
      return plain;
    const { start, end: next, kind } = token;
    if (
      typeof start !== "number" ||
      typeof next !== "number" ||
      !Number.isInteger(start) ||
      !Number.isInteger(next) ||
      start < end ||
      next <= start ||
      next > code.length ||
      dividesPair(start) ||
      dividesPair(next) ||
      typeof kind !== "string"
    )
      return plain;
    const acceptedKind = kinds.find((value) => value === kind);
    if (acceptedKind === undefined) return plain;
    if (start > end)
      result.push({ start: end, content: code.slice(end, start) });
    result.push({
      start,
      content: code.slice(start, next),
      kind: acceptedKind,
    });
    end = next;
  }
  if (end < code.length) result.push({ start: end, content: code.slice(end) });
  return result;
}
