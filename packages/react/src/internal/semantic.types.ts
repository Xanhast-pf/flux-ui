import type { ComponentPropsWithRef } from "react";

export type LayoutElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "form"
  | "fieldset"
  | "figure"
  | "figcaption"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "dt"
  | "dd"
  | "span";
export type TextElement =
  | "span"
  | "p"
  | "strong"
  | "em"
  | "small"
  | "time"
  | "legend"
  | "dt"
  | "dd"
  | "figcaption"
  | "blockquote";

type NativeElement = LayoutElement | TextElement;
export type SemanticProps<
  Elements extends NativeElement,
  Default extends Elements,
  Own = object,
> = Own &
  {
    [Element in Elements]: Omit<
      ComponentPropsWithRef<Element>,
      keyof Own | "as"
    > &
      (Element extends Default
        ? { as?: Element | undefined }
        : { as: Element });
  }[Elements];
