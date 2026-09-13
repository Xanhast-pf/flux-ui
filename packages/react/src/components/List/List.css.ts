import { style } from "@vanilla-extract/css";
export const list = style({
  display: "grid",
  gap: "var(--flux-list-gap)",
  padding: 0,
  margin: 0,
  listStyle: "none",
  minInlineSize: 0,
  selectors: {
    "&[data-variant='marker']": {
      listStyle: "revert",
      paddingInlineStart: "var(--flux-space-6)",
    },
  },
});
export const item = style({ minInlineSize: 0 });
