import { joinClassNames } from "../../internal/joinClassNames.js";
import { descriptionList, details, term } from "./DescriptionList.css.js";
import type {
  DescriptionListDetailsProps,
  DescriptionListProps,
  DescriptionListTermProps,
} from "./DescriptionList.types.js";
export function DescriptionList({ className, ...props }: DescriptionListProps) {
  return (
    <dl {...props} className={joinClassNames(descriptionList, className)} />
  );
}
function Term({ className, ...props }: DescriptionListTermProps) {
  return <dt {...props} className={joinClassNames(term, className)} />;
}
function Details({ className, ...props }: DescriptionListDetailsProps) {
  return <dd {...props} className={joinClassNames(details, className)} />;
}
DescriptionList.Term = Term;
DescriptionList.Details = Details;
