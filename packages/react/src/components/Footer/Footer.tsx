import { joinClassNames } from "../../internal/joinClassNames.js";
import { footer } from "./Footer.css.js";
import type { FooterProps } from "./Footer.types.js";

export function Footer({ className, ...props }: FooterProps) {
  return <footer {...props} className={joinClassNames(footer, className)} />;
}
