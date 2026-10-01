import { cssVars } from "@flux-ui/tokens";
import { globalStyle, style } from "@vanilla-extract/css";

export const root = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  minInlineSize: 0,
  margin: 0,
  padding: 0,
  border: 0,
  touchAction: "pan-y",
  selectors: {
    "&:disabled": {
      opacity: 0.62,
    },
  },
});

export const item = style({
  position: "relative",
  display: "inline-grid",
  placeItems: "center",
  color: `var(${cssVars.color.textMuted})`,
  cursor: "pointer",
});

export const target = style({
  position: "absolute",
  insetBlock: 0,
  insetInlineStart: 0,
  width: "100%",
});

export const star = style({
  display: "block",
  gridArea: "1 / 1",
  width: "1.5rem",
  height: "1.5rem",
  pointerEvents: "none",
});

export const readOnlyValue = style({
  display: "inline-flex",
  gap: "0.25rem",
  color: `var(${cssVars.color.textMuted})`,
});

globalStyle(`${item} ${star}[data-fill]`, {
  color: `var(${cssVars.color.accent})`,
  opacity: 0,
});

globalStyle(`${readOnlyValue} ${star}[data-fill]`, {
  color: `var(${cssVars.color.accent})`,
});

globalStyle(
  `${item}[data-half]:has(${target}:first-of-type input:checked) ${star}[data-fill='half']`,
  {
    opacity: 1,
  },
);

globalStyle(
  `${item}:not([data-half]):has(input:checked) ${star}[data-fill='full'], ${item}[data-half]:has(${target}:last-of-type input:checked) ${star}[data-fill='full'], ${item}:has(~ ${item} input:checked) ${star}[data-fill='full']`,
  {
    opacity: 1,
  },
);

globalStyle(`${target}:has(+ ${target}), ${target} + ${target}`, {
  width: "50%",
});

globalStyle(`${target} + ${target}`, {
  insetInlineStart: "50%",
});

globalStyle(`${item}:has(input:focus-visible)`, {
  outline: `0.125rem solid var(${cssVars.color.focus})`,
  outlineOffset: "0.25rem",
  borderRadius: "0.25rem",
  "@media": {
    "(forced-colors: active)": {
      outlineColor: "Highlight",
    },
  },
});

globalStyle(`${item}:hover ${star}`, {
  color: `var(${cssVars.color.accent})`,
});

globalStyle(`${root}:disabled ${item}`, {
  cursor: "not-allowed",
});

globalStyle(
  `${root}[aria-invalid='true'] ${star}, ${root}[data-invalid='true'] ${star}, ${item}:has(input:user-invalid) ${star}`,
  {
    color: `var(${cssVars.color.danger})`,
  },
);

globalStyle(`${root} ${star}`, {
  forcedColorAdjust: "auto",
});
