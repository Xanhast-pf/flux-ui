import type {
  LayoutGap,
  LayoutSpacing,
  ResponsiveScope,
  ResponsiveValue,
} from "../../internal/layout.js";
import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";

type GridSharedProps = LayoutSpacing & {
  responsiveTo?: ResponsiveScope | undefined;
  gap?: ResponsiveValue<LayoutGap> | undefined;
  rowGap?: ResponsiveValue<LayoutGap> | undefined;
  columnGap?: ResponsiveValue<LayoutGap> | undefined;
  templateRows?: ResponsiveValue<string> | undefined;
  autoRows?: "auto" | "min-content" | "max-content" | "1fr" | undefined;
  align?: "start" | "center" | "end" | "stretch" | undefined;
  justify?: "start" | "center" | "end" | "stretch" | undefined;
};

type GridCountMode = {
  columns?: ResponsiveValue<number> | undefined;
  minColumnWidth?: undefined;
  templateColumns?: undefined;
};

type GridAutoFitMode = {
  minColumnWidth: string;
  columns?: undefined;
  templateColumns?: undefined;
};

type GridTemplateMode = {
  templateColumns: ResponsiveValue<string>;
  columns?: undefined;
  minColumnWidth?: undefined;
};

export type GridProps = SemanticProps<
  LayoutElement,
  "div",
  GridSharedProps & (GridCountMode | GridAutoFitMode | GridTemplateMode)
>;

export type GridItemProps = SemanticProps<
  LayoutElement,
  "div",
  {
    responsiveTo?: ResponsiveScope | undefined;
    colSpan?: ResponsiveValue<number | "full"> | undefined;
    rowSpan?: ResponsiveValue<number> | undefined;
    alignSelf?: "auto" | "start" | "center" | "end" | "stretch" | undefined;
    justifySelf?: "auto" | "start" | "center" | "end" | "stretch" | undefined;
    subgrid?: "columns" | "rows" | "both" | undefined;
  }
>;
