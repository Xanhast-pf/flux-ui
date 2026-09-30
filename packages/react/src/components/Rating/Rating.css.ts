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

export const star = style({
  display: "block",
  fontSize: "1.5rem",
  lineHeight: 1,
  userSelect: "none",
});

export const readOnlyValue = style({
  display: "inline-flex",
  gap: "0.25rem",
  color: `var(${cssVars.color.textMuted})`,
});

globalStyle(
  `${item}:has(input:checked), ${item}:has(~ ${item} input:checked)`,
  {
    color: `var(${cssVars.color.accent})`,
  },
);

globalStyle(`${item} > input:focus-visible + ${star}`, {
  outline: `0.125rem solid var(${cssVars.color.focus})`,
  outlineOffset: "0.25rem",
  borderRadius: "0.25rem",
});

globalStyle(`${item}:hover ${star}`, {
  color: `var(${cssVars.color.accent})`,
});

globalStyle(`${root}:disabled ${item}`, {
  cursor: "not-allowed",
});

globalStyle(`${readOnlyValue} ${star}[data-filled]`, {
  color: `var(${cssVars.color.accent})`,
});

globalStyle(
  `${root}[aria-invalid='true'] ${star}, ${root}[data-invalid='true'] ${star}`,
  {
    color: `var(${cssVars.color.danger})`,
  },
);

globalStyle(`${item} > input:user-invalid + ${star}`, {
  color: `var(${cssVars.color.danger})`,
});

globalStyle(`${item} > input:disabled + ${star}`, {
  cursor: "not-allowed",
});

globalStyle(`${root} ${star}`, {
  forcedColorAdjust: "auto",
});

globalStyle(`${item} > input:focus-visible + ${star}`, {
  "@media": {
    "(forced-colors: active)": {
      outlineColor: "Highlight",
    },
  },
});
