import { EmptyState, Link } from "@varua/flux-ui";
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
