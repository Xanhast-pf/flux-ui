import { style, styleVariants } from "@vanilla-extract/css";

export const textBase = style({
  selectors: {
    "&[data-italic]": { fontStyle: "italic" },
    "&[data-decoration='none']": { textDecoration: "none" },
    "&[data-decoration='underline']": { textDecoration: "underline" },
    "&[data-decoration='line-through']": { textDecoration: "line-through" },
  },
  margin: 0,
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  overflowWrap: "anywhere",
});

export const textVariant = styleVariants({
  body: {
    fontSize: "var(--flux-font-body-size)",
    lineHeight: "var(--flux-font-leading)",
  },
  caption: {
    fontSize: "var(--flux-font-caption)",
    lineHeight: "var(--flux-font-leading)",
  },
  label: {
    fontSize: "var(--flux-font-caption)",
    fontWeight: "var(--flux-font-medium)",
  },
  eyebrow: {
    fontSize: "var(--flux-font-caption)",
    fontWeight: "var(--flux-font-medium)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  lead: { fontSize: "var(--flux-font-lead)" },
  display: {
    fontSize: "var(--flux-font-heading-xl)",
    fontWeight: "var(--flux-font-medium)",
    lineHeight: "var(--flux-font-tight)",
    letterSpacing: "-0.04em",
  },
  metric: {
    fontSize: "var(--flux-font-metric)",
    lineHeight: "var(--flux-font-tight)",
    fontWeight: "var(--flux-font-bold)",
    letterSpacing: "-0.04em",
  },
});

export const textTone = styleVariants({
  default: { color: "var(--flux-color-text)" },
  muted: { color: "var(--flux-color-text-muted)" },
  subtle: { color: "var(--flux-color-text-subtle)" },
  accent: { color: "var(--flux-color-accent)" },
  success: { color: "var(--flux-color-success)" },
  warning: { color: "var(--flux-color-warning)" },
  danger: { color: "var(--flux-color-danger)" },
});

export const textWeight = styleVariants({
  regular: { fontWeight: "var(--flux-font-regular)" },
  medium: { fontWeight: "var(--flux-font-medium)" },
  bold: { fontWeight: "var(--flux-font-bold)" },
});

export const textAlign = styleVariants({
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
});

export const textNumeric = style({ fontVariantNumeric: "tabular-nums" });
