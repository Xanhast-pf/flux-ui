import { Inline, Link } from "@varua/flux-ui";

export default function LinkTextTreatments() {
  return (
    <Inline gap="md" wrap>
      <Link href="#components">Text link</Link>
      <Link href="#components" variant="navigation">
        Navigation link
      </Link>
    </Inline>
  );
}

export function LinkActionTreatments() {
  return (
    <Inline gap="sm" wrap>
      <Link href="#install" variant="solid" size="sm">
        Solid
      </Link>
      <Link href="#install" variant="soft" size="sm">
        Soft
      </Link>
      <Link href="#engineering" variant="outline" size="sm" tone="neutral">
        Outline
      </Link>
      <Link href="#engineering" variant="ghost" size="sm" tone="neutral">
        Ghost
      </Link>
    </Inline>
  );
}
