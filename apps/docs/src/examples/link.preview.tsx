import { Inline, Link } from "@flux-ui/react";

export default function Preview() {
  return (
    <Inline gap="md" wrap>
      <Link href="#components">Browse components</Link>
      <Link href="#install" variant="solid" size="sm">
        Start building
      </Link>
      <Link href="#engineering" variant="outline" size="sm" tone="neutral">
        Engineering notes
      </Link>
    </Inline>
  );
}
