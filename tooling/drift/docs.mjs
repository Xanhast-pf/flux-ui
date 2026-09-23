import { posix } from "node:path";

/** Preserve offsets while excluding fenced examples and inline code. */
export function prose(source) {
  let fence = null;
  return source
    .split("\n")
    .map((line) => {
      const marker = /^\s{0,3}(`{3,}|~{3,})/u.exec(line)?.[1];
      if (
        marker &&
        (!fence || (marker[0] === fence[0] && marker.length >= fence.length))
      ) {
        fence = fence ? null : marker;
        return " ".repeat(line.length);
      }
      return fence
        ? " ".repeat(line.length)
        : line.replace(/(`+)[^\n]*?\1/gu, (value) => " ".repeat(value.length));
    })
    .join("\n");
}

export function historical(source) {
  return /(?:<!--\s*flux-doc:\s*historical\s*-->|>\s*\*\*Historical\b)/iu.test(
    source.slice(0, 1200),
  );
}

function referenceKey(value) {
  return value.trim().replace(/\s+/gu, " ").toLowerCase();
}

export function markdownLinks(source) {
  const body = prose(source);
  const links = [];
  const references = new Map();
  const target = String.raw`(?:<([^>\n]+)>|([^\s)]+))`;
  for (const match of body.matchAll(
    new RegExp(String.raw`^ {0,3}\[([^\]]+)\]:\s*${target}`, "gmu"),
  )) {
    references.set(referenceKey(match[1]), match[2] ?? match[3]);
    links.push({ href: match[2] ?? match[3], offset: match.index });
  }
  for (const match of body.matchAll(
    new RegExp(
      String.raw`!?\[[^\]\n]*\]\(\s*${target}(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\)`,
      "gu",
    ),
  ))
    links.push({ href: match[1] ?? match[2], offset: match.index });
  for (const match of body.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/gu)) {
    const name = referenceKey(match[2] || match[1]);
    links.push({
      href: references.get(name) ?? null,
      reference: name,
      offset: match.index,
    });
  }
  return links;
}

function isHtmlNameStart(character) {
  return character !== undefined && /[A-Za-z]/u.test(character);
}

function isHtmlNameCharacter(character) {
  return character !== undefined && /[A-Za-z0-9:-]/u.test(character);
}

function inlineHtmlEnd(value, start) {
  if (value[start] !== "<") return -1;

  if (value.startsWith("<!--", start)) {
    const end = value.indexOf("-->", start + 4);
    return end < 0 ? -1 : end + 2;
  }

  let cursor = start + 1;
  if (value[cursor] === "/") cursor += 1;

  if (value[cursor] === "!" || value[cursor] === "?") {
    // Declarations/processing instructions are markup only when terminated.
  } else {
    if (!isHtmlNameStart(value[cursor])) return -1;
    cursor += 1;
    while (isHtmlNameCharacter(value[cursor])) cursor += 1;
    const boundary = value[cursor];
    if (
      boundary !== ">" &&
      boundary !== "/" &&
      boundary !== " " &&
      boundary !== "\t" &&
      boundary !== "\r" &&
      boundary !== "\n"
    )
      return -1;
  }

  let quote = null;
  for (; cursor < value.length; cursor += 1) {
    const character = value[cursor];
    if (quote !== null) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === ">") return cursor;
  }
  return -1;
}

/**
 * Return visible heading text without treating inline HTML tags as content.
 * This is Markdown anchor normalization, not HTML sanitization: the result is
 * reduced to an allowlisted slug alphabet and is never emitted as HTML.
 */
function headingText(value) {
  let result = "";
  let codeRun = 0;

  for (let cursor = 0; cursor < value.length;) {
    if (value[cursor] === "`") {
      let end = cursor + 1;
      while (value[end] === "`") end += 1;
      const run = end - cursor;
      if (codeRun === 0) codeRun = run;
      else if (run === codeRun) codeRun = 0;
      result += value.slice(cursor, end);
      cursor = end;
      continue;
    }

    if (codeRun === 0 && value[cursor] === "<") {
      const end = inlineHtmlEnd(value, cursor);
      if (end >= cursor) {
        cursor = end + 1;
        continue;
      }
    }

    result += value[cursor];
    cursor += 1;
  }

  return result;
}

export function headingIds(source) {
  const ids = new Set();
  const duplicates = new Map();
  // Inline code in a heading contributes visible text to its anchor.
  let fenced = false;
  for (const line of source.split("\n")) {
    if (/^\s{0,3}(?:`{3,}|~{3,})/u.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const heading = /^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/u.exec(line)?.[1];
    if (!heading) continue;
    const slug = headingText(heading)
      .toLowerCase()
      .replace(/&amp;/gu, "&")
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s/gu, "-");
    const count = duplicates.get(slug) ?? 0;
    duplicates.set(slug, count + 1);
    ids.add(count ? `${slug}-${count}` : slug);
  }
  for (const match of source.matchAll(/\b(?:id|name)=["']([^"']+)["']/gu))
    ids.add(match[1]);
  return ids;
}

export function checkDocumentation(ctx, policy) {
  const incoming = new Map();
  let linkCount = 0;
  for (const [path, source] of ctx.files) {
    if (typeof source !== "string" || !path.endsWith(".md")) continue;
    for (const { href, reference, offset } of markdownLinks(source)) {
      if (href === null) {
        ctx.add(
          "DOC_REFERENCE",
          path,
          `Undefined Markdown reference: ${reference}`,
          offset,
        );
        continue;
      }
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/iu.test(href)) continue;
      linkCount++;
      let decoded;
      try {
        decoded = decodeURI(href);
      } catch {
        ctx.add("DOC_LINK", path, `Malformed URL encoding: ${href}`, offset);
        continue;
      }
      const [filePart, anchor] = decoded.split("#", 2);
      const target = filePart
        ? posix.normalize(
            posix.join(posix.dirname(path), filePart.split("?", 1)[0]),
          )
        : path;
      const directory = [...ctx.files.keys()].some((file) =>
        file.startsWith(`${target.replace(/\/$/u, "")}/`),
      );
      if (
        target === ".." ||
        target.startsWith("../") ||
        (!ctx.files.has(target) && !directory)
      ) {
        ctx.add(
          "DOC_LINK",
          path,
          `Missing repository link target: ${href}`,
          offset,
        );
        continue;
      }
      if (target !== path) {
        const sources = incoming.get(target) ?? new Set();
        sources.add(path);
        incoming.set(target, sources);
      }
      const targetText = ctx.files.get(target);
      if (
        anchor &&
        target.endsWith(".md") &&
        typeof targetText === "string" &&
        !headingIds(targetText).has(anchor)
      )
        ctx.add(
          "DOC_ANCHOR",
          path,
          `Missing Markdown heading/anchor: ${href}`,
          offset,
        );
    }
    if (
      path.startsWith("docs/") &&
      path.endsWith(".md") &&
      path !== "docs/README.md" &&
      !historical(source)
    ) {
      // Checked after the complete graph is assembled below.
      incoming.set(path, incoming.get(path) ?? new Set());
    }
    if (
      !historical(source) &&
      (path === "README.md" ||
        path === "SECURITY.md" ||
        path.startsWith("docs/"))
    ) {
      const visible = prose(source);
      for (const match of visible.matchAll(
        /\bFlux(?: UI)? is (?:an? )?alpha\b|alpha-stage React|These alpha families/giu,
      ))
        ctx.add(
          "DOC_LIFECYCLE",
          path,
          "Use pre-stable language and per-component lifecycle status.",
          match.index,
        );
      if (visible.includes("xanhast-pf.github.io/flux-ui"))
        ctx.add("PROJECT_SITE", path, `Use canonical site ${policy.siteUrl}`);
    }
  }
  const reachable = new Set([
    "README.md",
    "docs/README.md",
    "CONTRIBUTING.md",
    "AGENTS.md",
  ]);
  let advanced = true;
  while (advanced) {
    advanced = false;
    for (const [target, sources] of incoming) {
      if (
        !reachable.has(target) &&
        [...sources].some((source) => reachable.has(source))
      ) {
        reachable.add(target);
        advanced = true;
      }
    }
  }
  for (const [path] of incoming) {
    if (
      path.startsWith("docs/") &&
      path.endsWith(".md") &&
      path !== "docs/README.md" &&
      !historical(ctx.read(path)) &&
      !reachable.has(path)
    )
      ctx.add(
        "DOC_ORPHAN",
        path,
        "Link this evergreen document from the docs index, or explicitly classify a historical report.",
      );
  }
  return { markdownLinks: linkCount };
}
