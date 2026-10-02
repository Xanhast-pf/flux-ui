import { style, globalStyle } from "@vanilla-extract/css";

export const root = style({
  display: "inline-flex",
  alignItems: "stretch",
  selectors: {
    "&[hidden]:not([hidden='until-found' i])": {
      display: "none !important",
    },
    "&[data-orientation='vertical']": {
      flexDirection: "column",
    },
  },
});

globalStyle(
  `${root}[data-orientation='horizontal'] > button:not(:first-child)`,
  {
    marginInlineStart: "-0.0625rem",
    borderStartStartRadius: 0,
    borderEndStartRadius: 0,
  },
);

globalStyle(
  `${root}[data-orientation='horizontal'] > button:not(:last-child)`,
  {
    borderStartEndRadius: 0,
    borderEndEndRadius: 0,
  },
);

globalStyle(`${root}[data-orientation='vertical'] > button:not(:first-child)`, {
  marginBlockStart: "-0.0625rem",
  borderStartStartRadius: 0,
  borderStartEndRadius: 0,
});

globalStyle(`${root}[data-orientation='vertical'] > button:not(:last-child)`, {
  borderEndStartRadius: 0,
  borderEndEndRadius: 0,
});
