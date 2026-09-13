import { style } from "@vanilla-extract/css";
export const splitPane = style({
  display: "grid",
  gridTemplateColumns:
    "minmax(0, var(--f-pane-first)) 1.5rem minmax(0, var(--f-pane-second))",
  minInlineSize: 0,
  minBlockSize: 0,
  selectors: {
    "&[data-orientation='vertical']": {
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateRows:
        "minmax(0, var(--f-pane-first)) 1.5rem minmax(0, var(--f-pane-second))",
    },
    "&[hidden]:not([hidden='until-found' i])": { display: "none !important" },
  },
});
export const content = style({
  minInlineSize: 0,
  minBlockSize: 0,
  overflow: "auto",
});
export const handle = style({
  position: "relative",
  cursor: "col-resize",
  touchAction: "none",
  outlineOffset: "0.125rem",
  selectors: {
    "&::after": {
      content: '""',
      position: "absolute",
      insetInlineStart: "50%",
      insetBlockStart: "25%",
      inlineSize: "2px",
      blockSize: "50%",
      background: "var(--flux-color-border-strong)",
    },
    "&:focus-visible": { outline: "0.125rem solid var(--flux-color-focus)" },
    [`${splitPane}[data-orientation='vertical'] > &`]: { cursor: "row-resize" },
    [`${splitPane}[data-orientation='vertical'] > &::after`]: {
      insetInlineStart: "25%",
      insetBlockStart: "50%",
      inlineSize: "50%",
      blockSize: "2px",
    },
  },
});
