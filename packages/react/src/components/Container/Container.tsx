import { joinClassNames } from "../../internal/joinClassNames.js";
import { container, sizes } from "./Container.css.js";
import type { ContainerProps } from "./Container.types.js";

export function Container({
  className,
  size = "xl",
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={joinClassNames(container, sizes[size], className)}
    />
  );
}
