import type { ComponentPropsWithRef, ReactNode } from "react";
export type EmptyStateProps = Omit<
  ComponentPropsWithRef<"div">,
  "title" | "dangerouslySetInnerHTML"
> & {
  title: ReactNode;
  description?: ReactNode | undefined;
  headingLevel?: 2 | 3 | 4 | undefined;
};
