import { style, styleVariants } from "@vanilla-extract/css";

export const headingBase = style({
  margin: 0,
  color: "var(--flux-color-text)",
  fontFamily: "inherit",
  fontWeight: "var(--flux-font-bold)",
  lineHeight: "var(--flux-font-tight)",
  letterSpacing: "-0.035em",
  textWrap: "balance",
  overflowWrap: "anywhere",
});

export const headingSize = styleVariants({
  sm: { fontSize: "var(--flux-font-heading-sm)" },
  md: { fontSize: "var(--flux-font-heading-md)" },
  lg: { fontSize: "var(--flux-font-heading-lg)" },
  xl: { fontSize: "var(--flux-font-heading-xl)" },
  display: {
    fontSize:
      "clamp(var(--flux-font-heading-xl), 6cqi, var(--flux-font-display))",
  },
});

export const headingAlign = styleVariants({
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
});
