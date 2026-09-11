import { EmptyState, Link } from "@flux-ui/react";
export default function Preview() {
  return (
    <EmptyState
      title="No matching projects"
      description="Try a broader name or return to the component catalog."
      headingLevel={2}
    >
      <Link href="#components" variant="outline" tone="neutral">
        Browse components
      </Link>
    </EmptyState>
  );
}
