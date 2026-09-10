import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  root,
  list,
  item,
  separator,
  link,
  current,
} from "./Breadcrumbs.css.js";
import type {
  BreadcrumbsRootProps,
  BreadcrumbsListProps,
  BreadcrumbsItemProps,
  BreadcrumbsLinkProps,
  BreadcrumbsCurrentProps,
} from "./Breadcrumbs.types.js";
function BreadcrumbsRoot({
  className,
  "aria-label": label = "Breadcrumb",
  ...props
}: BreadcrumbsRootProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={joinClassNames(root, className)}
    />
  );
}
function BreadcrumbsList({ className, ...props }: BreadcrumbsListProps) {
  return <ol {...props} className={joinClassNames(list, className)} />;
}
function BreadcrumbsItem({
  children,
  className,
  ...props
}: BreadcrumbsItemProps) {
  return (
    <li {...props} className={joinClassNames(item, className)}>
      {children}
      <span aria-hidden="true" className={separator}>
        /
      </span>
    </li>
  );
}
function BreadcrumbsLink({
  children,
  className,
  ...props
}: BreadcrumbsLinkProps) {
  return (
    <a {...props} className={joinClassNames(link, className)}>
      {children}
    </a>
  );
}
function BreadcrumbsCurrent({ className, ...props }: BreadcrumbsCurrentProps) {
  return (
    <span
      {...props}
      className={joinClassNames(current, className)}
      aria-current="page"
    />
  );
}
export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Current: BreadcrumbsCurrent,
} as const;
