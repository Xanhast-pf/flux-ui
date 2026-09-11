import type { ComponentPropsWithRef } from "react";
export type CodeBlockProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  code: string;
  label?: string | undefined;
  copyable?: boolean | undefined;
};
