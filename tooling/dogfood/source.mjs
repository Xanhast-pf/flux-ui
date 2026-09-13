import ts from "typescript";
import { posix } from "node:path";

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
  "progress",
  "form",
  "output",
]);
const svgTags = new Set([
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "title",
  "desc",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "mask",
  "pattern",
  "use",
]);
const permittedModules =
  /^(?:react(?:-dom(?:\/client)?|\/jsx-(?:dev-)?runtime)?|axe-core|@flux-ui\/(?:react|identity|tokens|icons(?:\/catalog|\/[A-Za-z]+Icon)?|tokens\/(?:theme|presets|reset)\.css))$/u;
const privateModule =
  /(?:@flux-ui\/react\/|@flux-ui\/[^/]+\/src(?:\/|$)|(?:^|\/)packages\/[^/]+\/src(?:\/|$))/u;

function unwrap(node) {
  while (
    node &&
    (ts.isAsExpression(node) ||
      ts.isTypeAssertionExpression(node) ||
      ts.isParenthesizedExpression(node) ||
      ts.isSatisfiesExpression(node))
  )
    node = node.expression;
  return node;
}
function opening(node) {
  return ts.isJsxElement(node)
    ? node.openingElement
    : ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)
      ? node
      : undefined;
}
function literalAttribute(node, name) {
  const item = node.attributes.properties.find(
    (entry) => ts.isJsxAttribute(entry) && entry.name.getText() === name,
  );
  const initializer = item?.initializer;
  const value =
    initializer && ts.isJsxExpression(initializer)
      ? unwrap(initializer.expression)
      : initializer;
  if (
    value &&
    (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
  )
    return value.text;
  if (value?.kind === ts.SyntaxKind.TrueKeyword) return "true";
  return undefined;
}
function artworkOwner(node, file, policy) {
  for (let current = node; current; current = current.parent) {
    const element = opening(current);
    if (!element) continue;
    const classes = literalAttribute(element, "className")?.split(/\s+/u) ?? [];
    const owner = (policy.artwork ?? []).find(
      (entry) =>
        entry.file === file &&
        entry.reason?.trim() &&
        classes.includes(entry.className),
    );
    if (owner) return element;
  }
  return undefined;
}
function insideSvg(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (opening(current)?.tagName.getText() === "svg") return true;
  }
  return false;
}

/** Bounded static ownership analysis, not a general proof of arbitrary JavaScript.
 * Source files, imports, factories, inline props and separate CSS contracts are checked together.
 * Unknown style expressions and new external runtime packages require explicit review.
 */
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
  for (const diagnostic of parsed.parseDiagnostics)
    report(
      parsed,
      ts.flattenDiagnosticMessageText(diagnostic.messageText, " "),
    );
  const excluded = (policy.sourceExceptions ?? []).some(
    (entry) => entry.file === file && entry.reason?.trim(),
  );
  const bindings = new Map();
  function collect(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      // Ambiguous/shadowed aliases do not get a trusted inferred initializer.
      bindings.set(
        node.name.text,
        bindings.has(node.name.text) ? undefined : node.initializer,
      );
    }
    ts.forEachChild(node, collect);
  }
  collect(parsed);
  const imports = new Map();
  for (const statement of parsed.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    )
      continue;
    const clause = statement.importClause;
    if (clause?.name)
      imports.set(clause.name.text, {
        module: statement.moduleSpecifier.text,
        member: "default",
      });
    if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings))
      imports.set(clause.namedBindings.name.text, {
        module: statement.moduleSpecifier.text,
        member: "*",
      });
    else if (clause?.namedBindings)
      for (const item of clause.namedBindings.elements)
        imports.set(item.name.text, {
          module: statement.moduleSpecifier.text,
          member: (item.propertyName ?? item.name).text,
        });
  }
  function resolveValue(node, seen = new Set()) {
    node = unwrap(node);
    if (
      node &&
      ts.isIdentifier(node) &&
      bindings.has(node.text) &&
      !seen.has(node.text)
    ) {
      seen.add(node.text);
      return resolveValue(bindings.get(node.text), seen);
    }
    return node;
  }
  function qualified(node) {
    node = resolveValue(node);
    if (!node) return "";
    if (ts.isIdentifier(node)) {
      const item = imports.get(node.text);
      if (item?.module === "react" && ["*", "default"].includes(item.member))
        return "React";
      if (item?.module === "react") return `React.${item.member}`;
      if (item?.module.startsWith("react/jsx-")) return `React.${item.member}`;
      return node.text;
    }
    if (ts.isPropertyAccessExpression(node))
      return `${qualified(node.expression)}.${node.name.text}`;
    if (
      ts.isElementAccessExpression(node) &&
      ts.isStringLiteral(node.argumentExpression)
    )
      return `${qualified(node.expression)}.${node.argumentExpression.text}`;
    return node.getText(parsed);
  }
  function auditModule(node, specifier) {
    if (privateModule.test(specifier))
      report(node, "Import the public package API, not a private source path.");
    else if (specifier.startsWith(".")) {
      const target = posix.normalize(
        posix.join(posix.dirname(file), specifier.split("?", 1)[0]),
      );
      if (!target.startsWith("apps/docs/src/"))
        report(
          node,
          "Docs imports must stay within audited source or use public package exports.",
        );
      if (/\.css\.[cm]?[jt]sx?$/u.test(target))
        report(
          node,
          "Docs must not create a parallel CSS-in-TypeScript styling layer.",
        );
    } else if (!permittedModules.test(specifier))
      report(
        node,
        `Unreviewed docs dependency: ${specifier}. Reusable UI must come from public Flux exports.`,
      );
  }
  function auditNative(node, tag) {
    if (excluded) return;
    if (controls.has(tag)) {
      report(node, `Use the public Flux control for <${tag}>.`);
      return;
    }
    if (tag === "br" || tag === "option" || tag === "optgroup") return;
    if (tag === "svg" || (svgTags.has(tag) && insideSvg(node))) return;
    const element = opening(node);
    if (
      tag === "img" &&
      element &&
      (policy.assets ?? []).some(
        (entry) => entry.file === file && entry.reason?.trim(),
      ) &&
      element.attributes.properties.some(
        (entry) => ts.isJsxAttribute(entry) && entry.name.getText() === "alt",
      )
    )
      return;
    const art = artworkOwner(node, file, policy);
    if (
      ["div", "span"].includes(tag) &&
      art &&
      (literalAttribute(art, "aria-hidden") === "true" ||
        literalAttribute(art, "role") === "img")
    ) {
      if (
        element?.attributes.properties.some(
          (entry) =>
            ts.isJsxAttribute(entry) &&
            /^(?:on[A-Z]|tabIndex)$/u.test(entry.name.getText()),
        )
      )
        report(node, "Artwork is not an interactive UI exception.");
      if (
        element &&
        ts.isJsxOpeningElement(element) &&
        element.parent.children.some(
          (child) => ts.isJsxText(child) && child.text.trim(),
        )
      )
        report(
          node,
          "Artwork cannot own ordinary HTML text; use Flux typography.",
        );
      return;
    }
    report(
      node,
      `Use a public Flux layout/text primitive for <${tag}>; artwork needs a named ownership exception.`,
    );
  }
  function objectProperties(expression, seen = new Set()) {
    const node = resolveValue(expression, seen);
    if (!node) return undefined;
    if (ts.isConditionalExpression(node)) {
      const left = objectProperties(node.whenTrue, new Set(seen));
      const right = objectProperties(node.whenFalse, new Set(seen));
      return left && right ? [...left, ...right] : undefined;
    }
    if (!ts.isObjectLiteralExpression(node)) return undefined;
    const properties = [];
    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        const spread = objectProperties(property.expression, new Set(seen));
        if (!spread) return undefined;
        properties.push(...spread);
      } else if (
        ts.isPropertyAssignment(property) ||
        ts.isShorthandPropertyAssignment(property)
      ) {
        const name = property.name;
        if (!ts.isIdentifier(name) && !ts.isStringLiteral(name))
          return undefined;
        properties.push([
          name.text,
          ts.isPropertyAssignment(property) ? property.initializer : name,
        ]);
      } else return undefined;
    }
    return properties;
  }
  function auditStyle(node, expression, component) {
    const properties = objectProperties(expression);
    const owners = (policy.inlineGeometry ?? []).filter(
      (entry) =>
        entry.file === file &&
        entry.components.includes(component) &&
        entry.reason?.trim(),
    );
    if (!properties) {
      report(
        node,
        "Unresolved inline style: use public Flux props or a reviewable geometry-only object.",
      );
      return;
    }
    for (const [property] of properties) {
      if (!owners.some((entry) => entry.properties.includes(property)))
        report(
          node,
          `Inline ${property} is not owned geometry for ${component}; use public Flux styling/composition.`,
        );
    }
  }
  function auditProps(node, props, component) {
    for (const [name, expression] of props) {
      if (name === "style") auditStyle(node, expression, component);
      else if (["css", "sx", "dangerouslySetInnerHTML"].includes(name))
        report(node, `${name} bypasses the public Flux composition contract.`);
    }
  }
  function inspect(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      auditModule(node, node.moduleSpecifier.text);
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        qualified(node.expression) === "require")
    ) {
      const specifier = node.arguments[0];
      if (specifier && ts.isStringLiteral(specifier))
        auditModule(node, specifier.text);
      else
        report(
          node,
          "Dynamic module specifiers are not reviewable docs dependencies.",
        );
    }
    if (
      !excluded &&
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
    ) {
      if (
        node.attributes.properties.some(
          (entry) =>
            ts.isJsxAttribute(entry) &&
            entry.name.getText() === "data-artwork-ink",
        )
      ) {
        const owner = (policy.tokenAdapters ?? []).find(
          (entry) =>
            entry.file === file &&
            entry.classes.some((name) =>
              (literalAttribute(node, "className") ?? "")
                .split(/\s+/u)
                .includes(name),
            ),
        );
        if (!owner?.reason?.trim())
          report(
            node,
            "Artwork ink token adapters are restricted to named illustration canvases.",
          );
      }
      const resolved = resolveValue(node.tagName);
      const tag =
        resolved && ts.isStringLiteral(resolved)
          ? resolved.text
          : node.tagName.getText(parsed);
      if (/^[a-z][a-z0-9-]*$/u.test(tag)) auditNative(node, tag);
      for (const property of node.attributes.properties) {
        if (ts.isJsxSpreadAttribute(property)) {
          const values = objectProperties(property.expression);
          if (values) auditProps(property, values, tag);
          else
            report(
              property,
              "Unresolved JSX prop spread can hide docs-owned styling. Pass public props explicitly.",
            );
        } else if (ts.isJsxAttribute(property)) {
          const value =
            property.initializer && ts.isJsxExpression(property.initializer)
              ? property.initializer.expression
              : property.initializer;
          auditProps(property, [[property.name.getText(), value]], tag);
        }
      }
    }
    if (!excluded && ts.isCallExpression(node)) {
      const factory = qualified(node.expression);
      if (
        [
          "createElement",
          "React.createElement",
          "React.jsx",
          "React.jsxs",
          "React.jsxDEV",
        ].includes(factory)
      ) {
        const type = resolveValue(node.arguments[0]);
        if (type && ts.isStringLiteral(type)) auditNative(node, type.text);
        else if (
          type &&
          !ts.isIdentifier(type) &&
          !(policy.factories ?? []).some(
            (entry) =>
              entry.file === file &&
              entry.expressions.includes(type.getText(parsed)) &&
              entry.reason?.trim(),
          )
        )
          report(
            node,
            "Dynamic component factory needs a named public-catalog contract.",
          );
        if (
          node.arguments[1] &&
          node.arguments[1].kind !== ts.SyntaxKind.NullKeyword
        ) {
          const props = objectProperties(node.arguments[1]);
          if (props)
            auditProps(node, props, type?.getText(parsed) ?? "factory");
          else
            report(
              node,
              "Unresolved factory props can hide docs-owned styling.",
            );
        }
      }
      if (/^document\.createElement(?:NS)?$/u.test(factory)) {
        const type = resolveValue(
          node.arguments[factory.endsWith("NS") ? 1 : 0],
        );
        if (
          !type ||
          !ts.isStringLiteral(type) ||
          !(policy.domAdapters ?? []).some(
            (entry) =>
              entry.file === file &&
              entry.tags.includes(type.text) &&
              entry.reason?.trim(),
          )
        )
          report(
            node,
            "Imperative DOM creation needs a narrowly named non-UI adapter.",
          );
      }
    }
    if (!excluded && ts.isCallExpression(node)) {
      const name = qualified(node.expression);
      if (
        /\.style\.(?:setProperty|removeProperty)$/u.test(name) ||
        /\.(?:insertRule|replaceSync|insertAdjacentHTML)$/u.test(name)
      )
        report(
          node,
          "Imperative HTML/CSS injection bypasses the public UI contract.",
        );
      if (
        /\.setAttribute$/u.test(name) &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0]) &&
        node.arguments[0].text === "style"
      )
        report(node, "Inline CSS assignment bypasses the public UI contract.");
    }
    if (
      !excluded &&
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      /\.(?:innerHTML|outerHTML|srcdoc|style(?:\.|\[))/u.test(
        node.left.getText(parsed),
      )
    )
      report(
        node,
        "Imperative HTML/CSS assignment bypasses the public UI contract.",
      );
    ts.forEachChild(node, inspect);
  }
  inspect(parsed);
  return issues;
}
