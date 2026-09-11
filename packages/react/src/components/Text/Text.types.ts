import type {
  SemanticProps,
  TextElement,
} from "../../internal/semantic.types.js";
export type TextProps = SemanticProps<
  TextElement,
  "span",
  {
    variant?:
      | "body"
      | "caption"
      | "label"
      | "eyebrow"
      | "lead"
      | "metric"
      | "display"
      | undefined;
    tone?:
      | "default"
      | "muted"
      | "subtle"
      | "accent"
      | "success"
      | "warning"
      | "danger"
      | undefined;
    weight?: "regular" | "medium" | "bold" | undefined;
    align?: "start" | "center" | "end" | undefined;
    numeric?: boolean | undefined;
  }
>;
