import type { StyleRule } from "@vanilla-extract/css";

/** Build-time only. Scoped rules cannot leak viewport breakpoints into canvases. */
export function responsiveStyle(rule: StyleRule): StyleRule {
  const { "@media": queries, ...base } = rule;
  // Each instance owns its variables. Sparse values cascade locally, never from a parent.
  const suffixes = ["b", "s", "m", "l", "x", "2"];
  const names = new Set(
    [...JSON.stringify(rule).matchAll(/--f-[a-z0-9-]+/g)].map(([name]) => name),
  );
  const variables = [...names].map((name) => {
    const separator = name.lastIndexOf("-");
    const position = suffixes.indexOf(name.slice(separator + 1));
    const prefix = name.slice(0, separator + 1);
    const previous =
      position < 0
        ? undefined
        : suffixes
            .slice(0, position)
            .reverse()
            .find((suffix) => names.has(`${prefix}${suffix}`));
    return [
      name,
      previous === undefined ? "initial" : `var(${prefix}${previous})`,
    ] as const;
  });
  const reset = {
    ...base,
    vars: { ...Object.fromEntries(variables), ...base.vars },
  };
  if (queries === undefined) return reset;
  const media: NonNullable<StyleRule["@media"]> = {};
  const container: NonNullable<StyleRule["@container"]> = {};
  for (const [query, declarations] of Object.entries(queries)) {
    media[query] = {
      selectors: { "&:not([data-r='container'])": declarations },
    };
    container[`flux-layout ${query}`] = {
      selectors: { "&[data-r='container']": declarations },
    };
  }
  return { ...reset, "@media": media, "@container": container };
}
