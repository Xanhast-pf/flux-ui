import { Inline, Spinner, Text } from "@varua/flux-ui";

export default function NamedSpinner() {
  return (
    <Inline gap="md">
      <Spinner label="Loading preview" />
      <Text>Preparing your preview</Text>
    </Inline>
  );
}

export function SpinnerSizes() {
  return (
    <Inline gap="md" wrap>
      <Spinner size="sm" label={null} />
      <Spinner size="md" label={null} />
      <Spinner size="lg" label={null} />
      <Text>Decorative sizes can share a status owned by their parent.</Text>
    </Inline>
  );
}
