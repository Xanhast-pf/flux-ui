import { useEffect, useMemo, useState } from "react";
import { components } from "../generated/components.js";

type Component = (typeof components)[number];
type SearchIndex = ReadonlyMap<string, string>;

let indexPromise: Promise<SearchIndex> | undefined;

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function queryTokens(value: string): string[] {
  return normalize(value).split(" ").filter(Boolean);
}

function basicText(component: Component): string {
  return normalize(
    [
      component.name,
      component.slug,
      component.category,
      component.status,
      component.description,
      component.sizeClass,
    ].join(" "),
  );
}

function loadIndex(): Promise<SearchIndex> {
  indexPromise ??= import("../generated/component-search.json")
    .then(
      ({ default: componentSearchIndex }) =>
        new Map(componentSearchIndex.map((entry) => [entry.slug, entry.text])),
    )
    .catch(() => new Map());
  return indexPromise;
}

function score(component: Component, corpus: string, tokens: string[]): number {
  const name = normalize(component.name);
  const slug = normalize(component.slug);
  const category = normalize(component.category);
  const description = normalize(component.description);
  let total = 0;

  for (const token of tokens) {
    if (name === token || slug === token) total += 100;
    else if (name.startsWith(token) || slug.startsWith(token)) total += 70;
    else if (name.includes(token) || slug.includes(token)) total += 50;
    else if (category.includes(token)) total += 30;
    else if (description.includes(token)) total += 20;
    else if (corpus.includes(token)) total += 10;
  }

  return total;
}

function filterComponents(
  query: string,
  index: SearchIndex | undefined,
): Component[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [...components];

  return components
    .map((component, order) => {
      const corpus = index?.get(component.slug) ?? basicText(component);
      return {
        component,
        order,
        matches: tokens.every((token) => corpus.includes(token)),
        score: score(component, corpus, tokens),
      };
    })
    .filter((entry) => entry.matches)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map((entry) => entry.component);
}

export function useComponentSearch(query: string): {
  ready: boolean;
  results: Component[];
} {
  const normalizedQuery = normalize(query);
  const [index, setIndex] = useState<SearchIndex>();

  useEffect(() => {
    if (normalizedQuery === "" || index !== undefined) return;
    let active = true;
    void loadIndex().then((value) => {
      if (active) setIndex(value);
    });
    return () => {
      active = false;
    };
  }, [index, normalizedQuery]);

  return useMemo(
    () => ({
      ready: normalizedQuery === "" || index !== undefined,
      results: filterComponents(normalizedQuery, index),
    }),
    [index, normalizedQuery],
  );
}
