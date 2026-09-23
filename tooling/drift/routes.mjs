import ts from "typescript";

export function parseSource(path, source) {
  const file = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  if (file.parseDiagnostics.length)
    throw new Error(`Cannot analyze invalid syntax: ${path}`);
  return file;
}

function literal(node) {
  if (!node) throw new Error("Missing static route metadata.");
  if (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  )
    return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties.map((property) => {
        if (!ts.isPropertyAssignment(property))
          throw new Error("Routes must use static property assignments.");
        return [property.name.text, literal(property.initializer)];
      }),
    );
  throw new Error(
    "Routes must use literal metadata, not executable configuration.",
  );
}

export function readVariable(file, name) {
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations)
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name)
        return literal(declaration.initializer);
  }
  throw new Error(`Missing route metadata ${name} in ${file.fileName}`);
}

function text(node) {
  if (
    node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
  )
    return node.text;
  if (node && ts.isJsxExpression(node)) return text(node.expression);
  return null;
}

/** Parse real JSX/objects, not strings containing example source or comments. */
export function staticLinks(file) {
  const links = [];
  const ids = new Set();
  function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.text === "id") {
      const value = text(node.initializer);
      if (value) ids.add(value);
    }
    if (
      (ts.isJsxAttribute(node) || ts.isPropertyAssignment(node)) &&
      node.name.text === "href"
    ) {
      const href = text(node.initializer);
      if (href !== null) links.push({ href, offset: node.getStart(file) });
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return { links, ids };
}

export function routeExists(target, routes, aliases, slugs) {
  const rawPath = target.split("?", 1)[0];
  let path = rawPath || "overview";
  const visited = new Set();
  while (Object.hasOwn(aliases, path)) {
    if (visited.has(path)) return false;
    visited.add(path);
    path = aliases[path];
  }
  return (
    routes.has(path) ||
    (path.startsWith("components/") && slugs.has(path.slice(11)))
  );
}

export function checkRoutes(ctx, components, policy) {
  const routingPath = "apps/docs/src/lib/routing.ts";
  const routing = parseSource(routingPath, ctx.read(routingPath));
  const groups = readVariable(routing, "navigationGroups");
  const aliases = readVariable(routing, "routeAliases");
  const routeNames = groups.flatMap((group) =>
    group.items.map(([name]) => name),
  );
  const routes = new Set(routeNames);
  const slugs = new Set(components.map((meta) => meta.slug));
  if (routes.size !== routeNames.length)
    ctx.add(
      "ROUTE_DUPLICATE",
      routingPath,
      "Navigation route names must be unique.",
    );
  for (const alias of Object.keys(aliases))
    if (!routeExists(alias, routes, aliases, slugs))
      ctx.add(
        "ROUTE_ALIAS",
        routingPath,
        `Invalid or cyclic route alias: ${alias}`,
      );

  const appPath = "apps/docs/src/App.tsx";
  const app = parseSource(appPath, ctx.read(appPath));
  const routeView = app.statements.find(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === "RouteView",
  );
  const routeSwitch = routeView?.body?.statements.find(
    (statement) =>
      ts.isSwitchStatement(statement) &&
      ts.isIdentifier(statement.expression) &&
      statement.expression.text === "route",
  );
  if (!routeSwitch)
    throw new Error("RouteView must contain a direct static switch(route).");
  const caseNames = routeSwitch.caseBlock.clauses
    .filter(
      (clause) =>
        ts.isCaseClause(clause) && ts.isStringLiteral(clause.expression),
    )
    .map((clause) => clause.expression.text);
  const cases = new Set(caseNames);
  if (cases.size !== caseNames.length)
    ctx.add("ROUTE_DUPLICATE", appPath, "RouteView case names must be unique.");
  for (const route of routes)
    if (!cases.has(route))
      ctx.add("ROUTE_VIEW", appPath, `Navigation has no route view: ${route}`);
  for (const route of cases)
    if (!routes.has(route))
      ctx.add(
        "ROUTE_VIEW",
        appPath,
        `RouteView exposes an unregistered static route: ${route}`,
      );

  let checked = 0;
  for (const [path, source] of ctx.files) {
    if (
      typeof source !== "string" ||
      !path.startsWith("apps/docs/src/") ||
      !/\.[jt]sx?$/u.test(path)
    )
      continue;
    const file = parseSource(path, source);
    const { links, ids } = staticLinks(file);
    for (const { href, offset } of links) {
      const target = href.startsWith("#")
        ? href.slice(1)
        : href.startsWith(`${policy.siteUrl}#`)
          ? href.slice(policy.siteUrl.length + 1)
          : null;
      if (target === null) continue;
      checked++;
      // Same-file DOM anchors, including the intercepted SkipLink, are not routes.
      if (ids.has(target)) continue;
      if (!routeExists(target, routes, aliases, slugs))
        ctx.add(
          "ROUTE_TARGET",
          path,
          `Unknown docs destination: ${href}`,
          offset,
        );
    }
  }
  return { routes: routes.size, checkedLinks: checked };
}
