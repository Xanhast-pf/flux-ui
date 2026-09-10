/** Require a programmatic name on controls with no reliable visible label. */
export type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string | undefined }
  | { "aria-label"?: string | undefined; "aria-labelledby": string };
