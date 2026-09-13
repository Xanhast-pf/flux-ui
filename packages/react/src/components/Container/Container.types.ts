import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";
export type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type ContainerProps = SemanticProps<
  LayoutElement,
  "div",
  {
    size?: ContainerSize | undefined;
    /** Establishes the named container used by responsiveTo="container" children. */
    query?: boolean | undefined;
  }
>;
