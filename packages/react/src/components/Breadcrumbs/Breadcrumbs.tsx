import { Children, useState } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  root,
  list,
  item,
  separator,
  link,
  current,
  collapseButton,
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

function BreadcrumbsList({
  children,
  className,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  defaultExpanded = false,
  expandLabel = "Show full breadcrumb path",
  collapseLabel = "Collapse breadcrumb path",
  ...props
}: BreadcrumbsListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const items = Children.toArray(children);

  if (
    maxItems !== undefined &&
    (!Number.isSafeInteger(maxItems) ||
      maxItems < 3 ||
      !Number.isSafeInteger(itemsBeforeCollapse) ||
      itemsBeforeCollapse < 1 ||
      !Number.isSafeInteger(itemsAfterCollapse) ||
      itemsAfterCollapse < 1 ||
      itemsBeforeCollapse + itemsAfterCollapse >= maxItems)
  )
    throw new RangeError(
      "Breadcrumbs.List requires maxItems >= 3 with positive before/after counts that leave room for the collapse control.",
    );

  if (maxItems === undefined || items.length <= maxItems)
    return (
      <ol {...props} className={joinClassNames(list, className)}>
        {children}
      </ol>
    );

  const before = items.slice(0, itemsBeforeCollapse);
  const middle = items.slice(itemsBeforeCollapse, -itemsAfterCollapse);
  const after = items.slice(-itemsAfterCollapse);

  return (
    <ol {...props} className={joinClassNames(list, className)}>
      {before}
      <BreadcrumbsItem key="breadcrumb-collapse">
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? collapseLabel : expandLabel}
          className={collapseButton}
          onClick={() => {
            setExpanded((value) => !value);
          }}
        >
          …
        </button>
      </BreadcrumbsItem>
      {expanded ? middle : null}
      {after}
    </ol>
  );
}

function BreadcrumbsItem({
  children,
  separator: separatorContent = "/",
  className,
  ...props
}: BreadcrumbsItemProps) {
  return (
    <li {...props} className={joinClassNames(item, className)}>
      {children}
      <span aria-hidden="true" className={separator}>
        {separatorContent}
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
