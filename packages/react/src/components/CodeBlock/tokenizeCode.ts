import type { CodeToken, CodeTokenKind } from "./CodeBlock.types.js";

export const codeLanguages = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "css",
  "scss",
  "html",
  "xml",
  "yaml",
  "bash",
  "sql",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "markdown",
] as const;
const aliases: Readonly<Record<string, string>> = {
  js: "javascript",
  ts: "typescript",
  yml: "yaml",
  sh: "bash",
  shell: "bash",
  py: "python",
  rs: "rust",
  md: "markdown",
  "c++": "cpp",
};
const keywords = new Set(
  "abstract and as assert async await auto bool boolean break case catch char class const continue def default delete do double elif else enum except export extends false final finally float fn for from function go if implements import in instanceof int interface is lambda let match mut namespace new nil none not null of or package pass private protected pub public raise readonly return select self static string struct super switch this throw throws trait true try type typeof undefined union use var void volatile while with yield".split(
    " ",
  ),
);
const sqlKeywords = new Set(
  "select from where join inner left right full outer on as and or not null is in like between group by order asc desc having limit offset insert into values update set delete create table alter drop index primary key foreign references distinct union all case when then else end count sum avg min max true false".split(
    " ",
  ),
);
const plainLimit = 500_000;

/** Bounded lexical coloring, not a parser or validator. Unknown languages remain plain. */
export function tokenizeCode(
  code: string,
  language = "text",
): readonly CodeToken[] {
  const requested = language.toLowerCase();
  const lang = Object.hasOwn(aliases, requested)
    ? aliases[requested]
    : requested;
  if (
    code.length > plainLimit ||
    !codeLanguages.some((value) => value === lang)
  )
    return [];
  const patterns: [CodeTokenKind, RegExp][] = [];
  if (lang === "html" || lang === "xml" || lang === "markdown")
    patterns.push(["comment", /<!--[\s\S]*?(?:-->|$)/y]);
  if (["python", "bash", "yaml"].includes(lang ?? ""))
    patterns.push(["comment", /#[^\r\n]*/y]);
  else if (lang === "sql") patterns.push(["comment", /--[^\r\n]*/y]);
  else patterns.push(["comment", /\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/y]);
  patterns.push([
    "number",
    /\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/y,
  ]);
  if (lang === "html" || lang === "xml" || lang === "jsx" || lang === "tsx")
    patterns.push(["keyword", /<\/?[A-Za-z][\w:-]*|\/>/y]);
  if (lang === "markdown")
    patterns.push(["keyword", /#{1,6}(?=\s)|\*\*|__|\[[^[\]\r\n]*\](?=\()/y]);
  // Scan an identifier once. A greedy property lookahead over hyphens can
  // repeatedly rescan an entire suffix of adversarial input such as "a-a-a-".
  const word = ["css", "scss"].includes(lang ?? "")
    ? /[A-Za-z_$][\w$-]*/y
    : /[A-Za-z_$][\w$]*/y;
  const property = /\s*:/y;
  const space = /\s+/y;
  const punctuation = /[{}()[\];,.=:+*/!?<>|&%-]+/y;
  const result: CodeToken[] = [];
  let offset = 0;
  while (offset < code.length && result.length < 20_000) {
    const quote = code[offset];
    if (quote === '"' || quote === "'" || quote === "`") {
      // Consume unterminated literals, including a final backslash, once.
      // A failing greedy regex can rescan every escaped quote in the suffix.
      let end = offset + 1;
      while (end < code.length) {
        const character = code[end++];
        if (character === "\\") end += 1;
        else if (character === quote) break;
      }
      end = Math.min(end, code.length);
      result.push({ start: offset, end, kind: "string" });
      offset = end;
      continue;
    }
    let consumed = false;
    for (const [kind, pattern] of patterns) {
      pattern.lastIndex = offset;
      const match = pattern.exec(code);
      if (!match) continue;
      result.push({ start: offset, end: pattern.lastIndex, kind });
      offset = pattern.lastIndex;
      consumed = true;
      break;
    }
    if (consumed) continue;
    word.lastIndex = offset;
    const match = word.exec(code);
    if (match) {
      const value = match[0].toLowerCase();
      property.lastIndex = word.lastIndex;
      if (property.test(code))
        result.push({ start: offset, end: word.lastIndex, kind: "property" });
      else if ((lang === "sql" ? sqlKeywords : keywords).has(value))
        result.push({ start: offset, end: word.lastIndex, kind: "keyword" });
      offset = word.lastIndex;
      continue;
    }
    space.lastIndex = offset;
    if (space.exec(code)) {
      offset = space.lastIndex;
      continue;
    }
    punctuation.lastIndex = offset;
    if (punctuation.exec(code)) {
      result.push({
        start: offset,
        end: punctuation.lastIndex,
        kind: "punctuation",
      });
      offset = punctuation.lastIndex;
    } else offset += 1;
  }
  return result;
}
