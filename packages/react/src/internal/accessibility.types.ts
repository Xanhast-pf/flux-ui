/** Require a programmatic name on controls with no reliable visible label. */
export type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string | undefined }
  | { "aria-label"?: string | undefined; "aria-labelledby": string };

/** Require exposed measurements to be named; decorative duplicates must be explicitly hidden. */
export type AccessibleNameOrHidden =
  | (AccessibleName & {
      "aria-hidden"?: false | "false" | undefined;
    })
  | {
      "aria-hidden": true | "true";
      "aria-label"?: never;
      "aria-labelledby"?: never;
    };
