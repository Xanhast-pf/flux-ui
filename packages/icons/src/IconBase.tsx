import type { ReactNode, SVGProps } from "react";

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "children" | "height" | "width"
> {
  /** Icon width and height. Flux icons are designed on a 20 × 20 grid. */
  size?: number | string | undefined;
  /** Adds an accessible name through an SVG title. Decorative icons omit it. */
  title?: string | undefined;
}

interface IconBaseProps extends IconProps {
  children: ReactNode;
}

export function IconBase({
  children,
  size = 20,
  title,
  fill = "none",
  role,
  stroke = "currentColor",
  strokeLinecap = "round",
  strokeLinejoin = "round",
  strokeWidth = 1.5,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: IconBaseProps) {
  const explicitlyVisible = ariaHidden === false || ariaHidden === "false";
  const hasAccessibleName =
    title !== undefined ||
    ariaLabel !== undefined ||
    ariaLabelledBy !== undefined;
  const decorative = !hasAccessibleName && !explicitlyVisible;

  return (
    <svg
      {...props}
      aria-hidden={ariaHidden ?? (decorative ? true : undefined)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      fill={fill}
      focusable="false"
      height={size}
      role={role ?? (decorative ? undefined : "img")}
      stroke={stroke}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title === undefined ? null : <title>{title}</title>}
      {children}
    </svg>
  );
}
