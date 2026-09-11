import type { ComponentPropsWithRef, ReactNode } from "react";
export type EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  headingLevel?: 2 | 3 | 4 | undefined;
};
