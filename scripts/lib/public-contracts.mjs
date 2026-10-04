import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

function symbolLocation(symbol) {
  return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

function resolveSymbol(checker, symbol) {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
}

function callableProps(checker, type) {
  const signature = checker.getSignaturesOfType(
    checker.getApparentType(type),
    ts.SignatureKind.Call,
  )[0];
  if (signature === undefined) return null;
  const parameter = signature.getParameters()[0];
  if (parameter === undefined) return null;
  const location = symbolLocation(parameter);
  if (location === undefined) return null;
  return checker.getTypeOfSymbolAtLocation(parameter, location);
}

function hasProperty(checker, type, name) {
  return (
    checker.getPropertyOfType(checker.getApparentType(type), name) !== undefined
  );
}

function validPublicDataAttributes(attributes) {
  return (
    Array.isArray(attributes) &&
    attributes.length > 0 &&
    attributes.every(
      (attribute) =>
        typeof attribute === "string" &&
        /^data-[a-z][a-z0-9-]*$/u.test(attribute) &&
        !/^data-[a-z]$/u.test(attribute) &&
        !attribute.startsWith("data-flux-"),
    ) &&
    new Set(attributes).size === attributes.length
  );
}

function stateModels(checker, propsType, familyName, pathName, errors) {
  const apparent = checker.getApparentType(propsType);
  const models = [];

  for (const property of checker.getPropertiesOfType(apparent)) {
    const match = /^on([A-Z][A-Za-z0-9]*)Change$/u.exec(property.name);
    if (match === null) continue;
    const declaredByFlux = (property.getDeclarations() ?? []).some(
      (declaration) =>
        declaration
          .getSourceFile()
          .fileName.includes(
            `${path.sep}packages${path.sep}react${path.sep}src${path.sep}`,
          ),
    );
    if (!declaredByFlux) continue;

    const stem = match[1];
    const stateName = stem[0].toLowerCase() + stem.slice(1);
    if (!hasProperty(checker, propsType, stateName)) {
      errors.push(
        `${familyName}: ${pathName} exposes ${property.name} but is missing canonical ${stateName} state prop.`,
      );
      continue;
    }

    models.push(stateName);
  }

  return models.sort((left, right) => left.localeCompare(right));
}

function customProperties(checker, propsType) {
  const styleSymbol = checker.getPropertyOfType(
    checker.getApparentType(propsType),
    "style",
  );
  if (styleSymbol === undefined) return [];
  const location = symbolLocation(styleSymbol);
  if (location === undefined) return [];
  const result = new Set();
  const seen = new Set();

  function collect(type) {
    const current = checker.getNonNullableType(type);
    if (seen.has(current)) return;
    seen.add(current);
    if (current.isUnionOrIntersection()) {
      for (const member of current.types) collect(member);
    }
    for (const property of checker.getPropertiesOfType(current)) {
      if (property.name.startsWith("--flux-")) result.add(property.name);
    }
  }

  collect(checker.getTypeOfSymbolAtLocation(styleSymbol, location));
  return [...result].sort();
}

function componentParts(checker, moduleSymbol, familyName, errors) {
  const moduleExports = checker.getExportsOfModule(moduleSymbol);
  const typeExports = new Set(moduleExports.map((symbol) => symbol.name));
  const parts = [];

  function addCallable(exportName, pathName, symbol, expectedPropsName) {
    const resolved = resolveSymbol(checker, symbol);
    if (!(resolved.flags & ts.SymbolFlags.Value)) return;
    const location = symbolLocation(resolved);
    if (location === undefined) return;
    const type = checker.getTypeOfSymbolAtLocation(resolved, location);
    const propsType = callableProps(checker, type);
    if (propsType !== null) {
      parts.push({
        path: pathName,
        className: hasProperty(checker, propsType, "className"),
        style: hasProperty(checker, propsType, "style"),
        ref: hasProperty(checker, propsType, "ref"),
        cssVariables: customProperties(checker, propsType),
        stateModels: stateModels(
          checker,
          propsType,
          familyName,
          pathName,
          errors,
        ),
        expectedPropsName,
        hasPropsExport: typeExports.has(expectedPropsName),
      });
    }

    if (exportName !== familyName) return;
    for (const propertySymbol of checker.getPropertiesOfType(
      checker.getApparentType(type),
    )) {
      if (!/^[A-Z]/u.test(propertySymbol.name)) continue;
      const property = resolveSymbol(checker, propertySymbol);
      const propertyLocation = symbolLocation(property);
      if (propertyLocation === undefined) continue;
      const propertyType = checker.getTypeOfSymbolAtLocation(
        property,
        propertyLocation,
      );
      if (callableProps(checker, propertyType) === null) continue;
      addCallable(
        propertySymbol.name,
        `${exportName}.${propertySymbol.name}`,
        propertySymbol,
        `${familyName}${propertySymbol.name}Props`,
      );
    }
  }

  for (const exportedSymbol of moduleExports) {
    if (!/^[A-Z]/u.test(exportedSymbol.name)) continue;
    const resolved = resolveSymbol(checker, exportedSymbol);
    if (!(resolved.flags & ts.SymbolFlags.Value)) continue;
    addCallable(
      exportedSymbol.name,
      exportedSymbol.name,
      exportedSymbol,
      `${exportedSymbol.name}Props`,
    );
  }

  return parts.sort((left, right) => left.path.localeCompare(right.path));
}

export function createPublicContracts(root) {
  const componentRoot = path.resolve(root, "packages/react/src/components");
  const configPath = path.resolve(root, "packages/react/tsconfig.build.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error !== undefined) {
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
    );
  }
  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(configPath),
  );
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const errors = [];
  const contracts = [];

  const familyNames = readdirSync(componentRoot)
    .filter((name) =>
      existsSync(path.join(componentRoot, name, "component.meta.json")),
    )
    .sort((left, right) => left.localeCompare(right));

  for (const familyName of familyNames) {
    const meta = JSON.parse(
      readFileSync(
        path.join(componentRoot, familyName, "component.meta.json"),
        "utf8",
      ),
    );
    const sourceFile = program.getSourceFile(
      path.join(componentRoot, familyName, "index.ts"),
    );
    if (sourceFile === undefined) {
      errors.push(`${familyName}: public index.ts is missing from TypeScript.`);
      continue;
    }
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    if (moduleSymbol === undefined) {
      errors.push(`${familyName}: public index.ts has no module symbol.`);
      continue;
    }

    const declaredNonDom = Array.isArray(meta.nonDomParts)
      ? meta.nonDomParts
      : [];
    if (
      declaredNonDom.some((value) => typeof value !== "string") ||
      new Set(declaredNonDom).size !== declaredNonDom.length
    ) {
      errors.push(
        `${familyName}: component.meta.json nonDomParts must be unique strings.`,
      );
      continue;
    }

    const declaredDataAttributes =
      meta.publicDataAttributes !== null &&
      typeof meta.publicDataAttributes === "object" &&
      !Array.isArray(meta.publicDataAttributes)
        ? meta.publicDataAttributes
        : {};
    for (const [pathName, attributes] of Object.entries(
      declaredDataAttributes,
    )) {
      if (!validPublicDataAttributes(attributes)) {
        errors.push(
          `${familyName}: publicDataAttributes[${JSON.stringify(pathName)}] must contain unique descriptive data-* attribute names; compact and data-flux-* markers stay internal.`,
        );
      }
    }

    const declaredDescendantDataAttributes =
      meta.publicDescendantDataAttributes !== null &&
      typeof meta.publicDescendantDataAttributes === "object" &&
      !Array.isArray(meta.publicDescendantDataAttributes)
        ? meta.publicDescendantDataAttributes
        : {};
    const descendantStates = [];
    for (const [name, declaration] of Object.entries(
      declaredDescendantDataAttributes,
    )) {
      if (!/^[a-z][A-Za-z0-9]*$/u.test(name)) {
        errors.push(
          `${familyName}: publicDescendantDataAttributes keys must be lower-camel identifiers.`,
        );
        continue;
      }
      if (
        declaration === null ||
        typeof declaration !== "object" ||
        Array.isArray(declaration)
      ) {
        errors.push(
          `${familyName}: publicDescendantDataAttributes[${JSON.stringify(name)}] must be an object.`,
        );
        continue;
      }
      const selector = declaration.selector;
      const attributes = declaration.dataAttributes;
      if (
        typeof selector !== "string" ||
        !/^(?:\[[^\]]+\])+$/u.test(selector) ||
        selector.includes("data-flux-")
      ) {
        errors.push(
          `${familyName}: publicDescendantDataAttributes[${JSON.stringify(name)}].selector must be a simple stable attribute selector without private data-flux-* markers.`,
        );
        continue;
      }
      if (!validPublicDataAttributes(attributes)) {
        errors.push(
          `${familyName}: publicDescendantDataAttributes[${JSON.stringify(name)}].dataAttributes must contain unique descriptive data-* attribute names.`,
        );
        continue;
      }
      const selectorDataAttributes = [
        ...selector.matchAll(/data-[a-z][a-z0-9-]*/gu),
      ].map((match) => match[0]);
      if (
        selectorDataAttributes.some(
          (attribute) => !attributes.includes(attribute),
        )
      ) {
        errors.push(
          `${familyName}: publicDescendantDataAttributes[${JSON.stringify(name)}].selector references a data-* attribute that is not listed in dataAttributes.`,
        );
        continue;
      }
      descendantStates.push({
        name,
        selector,
        dataAttributes: [...attributes].sort(),
      });
    }
    descendantStates.sort((left, right) => left.name.localeCompare(right.name));

    const parts = componentParts(checker, moduleSymbol, familyName, errors);
    if (parts.length === 0) {
      errors.push(`${familyName}: no public callable component surface found.`);
      continue;
    }
    const knownPaths = new Set(parts.map((part) => part.path));
    for (const pathName of Object.keys(declaredDataAttributes)) {
      if (!knownPaths.has(pathName))
        errors.push(
          `${familyName}: publicDataAttributes contains unknown public part ${JSON.stringify(pathName)}.`,
        );
    }
    for (const pathName of declaredNonDom) {
      if (!knownPaths.has(pathName))
        errors.push(
          `${familyName}: nonDomParts contains unknown public part ${JSON.stringify(pathName)}.`,
        );
    }

    let domPartCount = 0;
    const contractParts = parts.map((part) => {
      if (!part.hasPropsExport) {
        errors.push(
          `${familyName}: ${part.path} requires exported type ${part.expectedPropsName}.`,
        );
      }
      const hasDomEscapeHatches = part.className && part.style;
      const partialDomEscapeHatches = part.className !== part.style;
      const declaredController = declaredNonDom.includes(part.path);
      if (partialDomEscapeHatches) {
        errors.push(
          `${familyName}: ${part.path} must expose className and style together.`,
        );
      } else if (hasDomEscapeHatches) {
        domPartCount += 1;
        if (!part.ref)
          errors.push(
            `${familyName}: ${part.path} is DOM-backed and must expose ref.`,
          );
        if (declaredController)
          errors.push(
            `${familyName}: ${part.path} is DOM-backed and must not be listed in nonDomParts.`,
          );
      } else if (!declaredController) {
        errors.push(
          `${familyName}: ${part.path} has no DOM escape hatches; declare it in component.meta.json nonDomParts if it intentionally renders no customizable DOM node.`,
        );
      }

      return {
        path: part.path,
        kind: hasDomEscapeHatches ? "dom" : "controller",
        escapeHatches: [
          ...(part.className ? ["className"] : []),
          ...(part.style ? ["style"] : []),
          ...(part.ref ? ["ref"] : []),
        ],
        cssVariables: part.cssVariables,
        ...(declaredDataAttributes[part.path]?.length
          ? { dataAttributes: [...declaredDataAttributes[part.path]].sort() }
          : {}),
        ...(part.stateModels.length === 0
          ? {}
          : { stateModels: part.stateModels }),
      };
    });

    if (domPartCount === 0)
      errors.push(
        `${familyName}: every public family needs at least one customizable DOM-backed surface.`,
      );

    contracts.push({
      name: meta.name,
      slug: meta.slug,
      parts: contractParts,
      ...(descendantStates.length === 0 ? {} : { descendantStates }),
    });
  }

  return { contracts, errors };
}
