import type { ComponentPropsWithRef, ReactNode } from "react";
export type StatProps = Omit<ComponentPropsWithRef<"dl">, "children"> & {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
};
