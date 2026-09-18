import { globalStyle, style } from "@vanilla-extract/css";

/** Native hit testing and scrolling; scoped to Flux-owned surfaces only. */
export const scrollbar = style({
  "@supports": {
    "not selector(::-webkit-scrollbar)": {
      scrollbarWidth: "thin",
      scrollbarColor: "var(--flux-color-border) transparent",
    },
  },
  "@media": {
    "(forced-colors: active)": {
      scrollbarColor: "auto",
      scrollbarWidth: "auto",
    },
  },
});
// No author pseudo-element styling in forced colors: use platform scrollbars.
globalStyle(`${scrollbar}::-webkit-scrollbar`, {
  "@media": { "(forced-colors: none)": { width: "0.5rem", height: "0.5rem" } },
});
globalStyle(`${scrollbar}::-webkit-scrollbar-track`, {
  "@media": { "(forced-colors: none)": { background: "transparent" } },
});
globalStyle(`${scrollbar}::-webkit-scrollbar-thumb`, {
  "@media": {
    "(forced-colors: none)": {
      border: "0.125rem solid transparent",
      background: "var(--flux-color-border)",
      backgroundClip: "padding-box",
      borderRadius: "0.25rem",
    },
  },
});
globalStyle(`${scrollbar}::-webkit-scrollbar-thumb:hover`, {
  "@media": {
    "(forced-colors: none)": {
      backgroundColor: "var(--flux-color-border-strong)",
    },
  },
});
