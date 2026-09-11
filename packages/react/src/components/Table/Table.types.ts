import type { ComponentPropsWithRef } from "react";
export type TableRootProps = ComponentPropsWithRef<"table"> & {
  density?: "comfortable" | "compact" | undefined;
};
export type TableCaptionProps = ComponentPropsWithRef<"caption"> & {
  visuallyHidden?: boolean | undefined;
};
export type TableHeaderProps = ComponentPropsWithRef<"thead">;
export type TableBodyProps = ComponentPropsWithRef<"tbody">;
export type TableFooterProps = ComponentPropsWithRef<"tfoot">;
export type TableRowProps = ComponentPropsWithRef<"tr">;
export type TableColumnHeaderProps = Omit<ComponentPropsWithRef<"th">, "scope">;
export type TableRowHeaderProps = Omit<ComponentPropsWithRef<"th">, "scope">;
export type TableCellProps = ComponentPropsWithRef<"td">;
