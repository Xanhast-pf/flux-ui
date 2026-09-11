/** Small CSS block scanner, not a CSS validator. Ignores strings, comments and declaration values. */
export function inspectCss(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//gu, "");
  const selectors = [];
  let declarations = 0;
  let index = 0;
  function block(inKeyframes = false) {
    let start = index;
    let quote = "";
    let parentheses = 0;
    while (index < clean.length) {
      const char = clean[index];
      if (quote) {
        if (char === "\\") index += 1;
        else if (char === quote) quote = "";
      } else if (char === '"' || char === "'") quote = char;
      else if (char === "(") parentheses += 1;
      else if (char === ")") parentheses -= 1;
      else if (parentheses === 0 && char === "{") {
        const header = clean.slice(start, index).trim();
        const keyframes =
          inKeyframes || /^@(?:-webkit-)?keyframes\b/u.test(header);
        if (!header.startsWith("@") && !keyframes) selectors.push(header);
        index += 1;
        block(keyframes);
        start = index;
        continue;
      } else if (parentheses === 0 && (char === ";" || char === "}")) {
        if (/^\s*(?:--)?[a-zA-Z-]+\s*:/u.test(clean.slice(start, index)))
          declarations += 1;
        index += 1;
        start = index;
        if (char === "}") return;
        continue;
      }
      index += 1;
    }
  }
  block();
  return { selectors, declarations, bytes: Buffer.byteLength(source) };
}
export function auditCss(source, file, owner) {
  const { selectors, declarations } = inspectCss(source);
  const issues = [];
  if (!owner || !owner.reason?.trim())
    return [`${file}: CSS needs a named owner and declaration budget.`];
  if (declarations > owner.maxDeclarations)
    issues.push(
      `${file}: ${declarations} declarations exceed the ${owner.maxDeclarations} ownership budget; prefer public Flux APIs.`,
    );
  for (const selector of selectors) {
    if (
      /(?:^|[\s>+~,(])(?:button|input|select|textarea|label|fieldset|legend|meter|summary|details)(?=$|[\s>+~.#:[,)])/u.test(
        selector,
      ) ||
      /\[(?:aria-(?:selected|pressed|checked)|data-(?:pressed|selected))\b/u.test(
        selector,
      )
    ) {
      issues.push(
        `${file}: public control styling belongs in the component: ${selector}`,
      );
    }
    if (
      /^(?:h[1-6]|p|a|code|pre|kbd|label|button|input|select|textarea)(?=$|[\s,.:[])/u.test(
        selector,
      )
    )
      issues.push(`${file}: global typography/control override: ${selector}`);
  }
  return issues;
}
