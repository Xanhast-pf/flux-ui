import { scrollbar } from "../../internal/scrollbar.css.js";
import { style } from "@vanilla-extract/css";
export const scrollArea = style([
  scrollbar,
  {
    minInlineSize: 0,
    maxInlineSize: "100%",
    overflow: "auto",
    overscrollBehavior: "contain",
    selectors: {
      "&[data-axis='horizontal']": { overflowY: "hidden" },
      "&[data-axis='vertical']": { overflowX: "hidden" },
      "&:focus-visible": {
        outline: "0.125rem solid var(--flux-color-focus)",
        outlineOffset: "-0.125rem",
      },
    },
  },
]);
