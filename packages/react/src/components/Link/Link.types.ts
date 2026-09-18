import type { ComponentPropsWithRef } from "react";

type LinkTextProps = {
  variant?: "text" | "navigation" | undefined;
  tone?: undefined;
  size?: undefined;
};

type LinkActionProps = {
  variant: "solid" | "soft" | "outline" | "ghost";
  tone?: "accent" | "neutral" | "danger" | undefined;
  size?: "sm" | "md" | "lg" | undefined;
};

export type LinkProps = ComponentPropsWithRef<"a"> &
  (LinkTextProps | LinkActionProps);
