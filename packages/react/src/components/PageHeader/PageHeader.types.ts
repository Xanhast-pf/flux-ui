import type { ComponentPropsWithRef, ReactNode } from "react";
export type PageHeaderProps = Omit<ComponentPropsWithRef<"header">, "title"> & {
  title: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  level?: 1 | 2 | 3 | undefined;
};
