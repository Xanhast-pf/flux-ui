import { joinClassNames } from "../../internal/joinClassNames.js";
import { card } from "./Card.css.js";
import type { CardProps } from "./Card.types.js";
/** A surface, not an implicit button or landmark. Compose semantic content inside. */
export function Card({ className, ...props }: CardProps) {
  return <div {...props} className={joinClassNames(card, className)} />;
}
