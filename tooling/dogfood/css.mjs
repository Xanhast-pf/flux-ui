/** Bounded CSS ownership scanner. The build still owns full CSS validation.
 * Rules retain their conditions and property names so a declaration count cannot
 * accidentally permit a second control/typography system under local classes.
 */
export function inspectCss(source) {
  const clean = source.replace(/\/\*[\s\S]*?\*\//gu, "");
  const selectors = [];
  const rules = [];
  let declarations = 0;
  let index = 0;
  const normalize = (value) => value.trim().replace(/\s+/gu, " ");
  function block(conditions = [], selector = "", inKeyframes = false) {
    let start = index;
    let quote = "";
    let parentheses = 0;
    const properties = [];
    const record = () => {
      if (properties.length)
        rules.push({ selector, conditions, properties: [...properties] });
      properties.length = 0;
    };
    while (index < clean.length) {
      const char = clean[index];
      if (quote) {
        if (char === "\\") index += 1;
        else if (char === quote) quote = "";
      } else if (char === '"' || char === "'") quote = char;
      else if (char === "(") parentheses += 1;
      else if (char === ")") parentheses -= 1;
      else if (parentheses === 0 && char === "{") {
        const header = normalize(clean.slice(start, index));
        const atRule = header.startsWith("@");
        const keyframes =
          inKeyframes || /^@(?:-webkit-)?keyframes\b/u.test(header);
        if (!atRule && !keyframes) selectors.push(header);
        index += 1;
        block(
          atRule ? [...conditions, header] : conditions,
          atRule ? selector : header,
          keyframes,
        );
        start = index;
        continue;
      } else if (parentheses === 0 && (char === ";" || char === "}")) {
        const property = /^\s*((?:--)?[a-zA-Z][a-zA-Z\d-]*)\s*:/u.exec(
          clean.slice(start, index),
        );
        if (property) {
          declarations += 1;
          properties.push(property[1]);
        }
        index += 1;
        start = index;
        if (char === "}") {
          record();
          return;
        }
        continue;
      }
      index += 1;
    }
    record();
  }
  block();
  return { selectors, declarations, rules, bytes: Buffer.byteLength(source) };
}
export function cssRuleKey(rule) {
  return [...rule.conditions, rule.selector].join(" / ");
}
export function auditCss(source, file, owner) {
  const { selectors, declarations, rules } = inspectCss(source);
  const issues = [];
  if (!owner?.reason?.trim())
    return [`${file}: CSS needs a named owner and declaration budget.`];
  if (declarations > owner.maxDeclarations)
    issues.push(
      `${file}: ${declarations} declarations exceed the ${owner.maxDeclarations} ownership budget; prefer public Flux APIs.`,
    );
  if (/@(?:import|font-face)\b/u.test(source.replace(/\/\*[\s\S]*?\*\//gu, "")))
    issues.push(
      `${file}: external CSS and font injection are not docs-owned UI.`,
    );
  for (const selector of selectors) {
    if (
      /(?:^|[\s>+~,(])(?:button|input|select|textarea|label|fieldset|legend|meter|progress|summary|details|a|th|td|h[1-6]|p|code|pre|kbd)(?=$|[\s>+~.#:[,)])/u.test(
        selector,
      ) ||
      /\[(?:aria-(?:selected|pressed|checked)|data-(?:pressed|selected))\b/u.test(
        selector,
      )
    )
      issues.push(
        `${file}: public control/typography styling belongs in the component: ${selector}`,
      );
  }
  if (!owner.rules)
    issues.push(
      `${file}: CSS needs exact, reviewed selector/property contracts, not only a count.`,
    );
  else
    for (const rule of rules) {
      const allowed = owner.rules[cssRuleKey(rule)];
      if (!allowed)
        issues.push(`${file}: unowned CSS rule: ${cssRuleKey(rule)}`);
      else
        for (const property of rule.properties)
          if (!allowed.includes(property))
            issues.push(
              `${file}: ${property} is not approved illustration/integration geometry in ${cssRuleKey(rule)}.`,
            );
    }
  return issues;
}
