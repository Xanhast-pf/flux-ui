import ts from "typescript";

const controls = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "fieldset",
  "legend",
  "details",
  "summary",
  "meter",
]);
const ordinary = new Set([
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "strong",
  "em",
  "small",
  "code",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "nav",
  "main",
]);

function opening(node) {
  return ts.isJsxElement(node)
    ? node.openingElement
    : ts.isJsxSelfClosingElement(node)
      ? node
      : undefined;
}
function literalAttribute(node, name) {
  const attribute = node.attributes.properties.find(
    (item) => ts.isJsxAttribute(item) && item.name.getText() === name,
  );
  if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer)
    return undefined;
  if (ts.isStringLiteral(attribute.initializer))
    return attribute.initializer.text;
  const value = ts.isJsxExpression(attribute.initializer)
    ? attribute.initializer.expression
    : undefined;
  return value &&
    (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
    ? value.text
    : undefined;
}
function ownsArtwork(node, file, exceptions) {
  for (let current = node; current; current = current.parent) {
    const element = opening(current);
    if (!element) continue;
    if (element.tagName.getText() === "svg") return true;
    const classes = literalAttribute(element, "className")?.split(/\s+/u) ?? [];
    if (
      exceptions.some(
        (entry) =>
          entry.file === file &&
          classes.includes(entry.className) &&
          entry.reason.trim().length > 0,
      )
    )
      return true;
  }
  return false;
}
/** Syntax-aware ownership checks; code strings and comments are not rendered JSX. */
export function auditSource(source, file, policy) {
  const parsed = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const issues = [];
  const report = (node, message) => {
    const { line, character } = parsed.getLineAndCharacterOfPosition(
      node.getStart(parsed),
    );
    issues.push({ file, line: line + 1, column: character + 1, message });
  };
  for (const diagnostic of parsed.parseDiagnostics) {
    issues.push({
      file,
      line: 1,
      column: 1,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
    });
  }
  const excluded = policy.sourceExceptions.some(
    (entry) => file.startsWith(entry.prefix) && entry.reason.trim().length > 0,
  );
  const teachingFixture = (policy.teachingFixtures ?? []).some(
    (entry) => file.startsWith(entry.prefix) && entry.reason.trim().length > 0,
  );
  const inspect = (node) => {
    const specifier =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : undefined;
    if (
      specifier &&
      ts.isStringLiteral(specifier) &&
      /(?:@flux-ui\/react\/|@flux-ui\/[^/]+\/src(?:\/|$)|(?:^|\/)packages\/[^/]+\/src(?:\/|$))/u.test(
        specifier.text,
      )
    ) {
      report(node, "Import the public package API, not a private source path.");
    }
    if (
      !excluded &&
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
    ) {
      const tag = node.tagName.getText(parsed);
      // Controls never become an allowed exception just by being placed in artwork.
      if (controls.has(tag))
        report(node, `Use the public Flux control for <${tag}>.`);
      else if (
        !teachingFixture &&
        ordinary.has(tag) &&
        !ownsArtwork(
          ts.isJsxOpeningElement(node) ? node.parent : node,
          file,
          policy.artwork,
        )
      ) {
        report(
          node,
          `Use a public Flux layout/text primitive for <${tag}>; artwork needs a named ownership exception.`,
        );
      }
    }
    if (
      !excluded &&
      ts.isCallExpression(node) &&
      node.arguments.length > 0 &&
      (node.expression.getText(parsed) === "createElement" ||
        node.expression.getText(parsed) === "React.createElement")
    ) {
      const first = node.arguments[0];
      if (ts.isStringLiteral(first) && controls.has(first.text))
        report(
          node,
          `Use the public Flux control instead of createElement("${first.text}").`,
        );
    }
    ts.forEachChild(node, inspect);
  };
  inspect(parsed);
  return issues;
}
