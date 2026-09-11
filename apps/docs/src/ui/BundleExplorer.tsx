import {
  Box,
  Card,
  Field,
  Heading,
  Inline,
  Input,
  Link,
  Select,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
interface BundleEntry {
  name: string;
  slug: string;
  raw: number | null;
  gzip: number | null;
  brotli: number | null;
}
const recordedEntries: readonly BundleEntry[] = health.size.components;
type Compression = "raw" | "gzip" | "brotli";
export function BundleExplorer() {
  const [search, setSearch] = useState("");
  const [compression, setCompression] = useState<Compression>("brotli");
  const entries = recordedEntries
    .filter((entry) =>
      entry.name.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort(
      (left, right) => (right[compression] ?? 0) - (left[compression] ?? 0),
    );
  const maximum = Math.max(
    1,
    ...entries.map((entry) => entry[compression] ?? 0),
  );
  return (
    <Card aria-label="Bundle-size visualization" as="section" padding={6}>
      <Stack gap="lg">
        <Inline wrap justify="between" gap="lg">
          <Box>
            <Text as="p" variant="eyebrow" tone="muted">
              Anatomy of a lightweight system
            </Text>
            <Heading level={2} size="lg">
              Every component, in perspective.
            </Heading>
          </Box>
          <Inline wrap gap="md">
            <Field.Root>
              <Field.Label>Find a component</Field.Label>
              <Field.Control>
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
              </Field.Control>
            </Field.Root>
            <Field.Root>
              <Field.Label>Compression</Field.Label>
              <Field.Control>
                <Select
                  value={compression}
                  onChange={(event) => {
                    const value = event.target.value;
                    setCompression(
                      value === "raw" || value === "gzip" ? value : "brotli",
                    );
                  }}
                >
                  <option value="brotli">Brotli</option>
                  <option value="gzip">Gzip</option>
                  <option value="raw">Raw bytes</option>
                </Select>
              </Field.Control>
            </Field.Root>
          </Inline>
        </Inline>
        <Text as="p" variant="body" tone="muted">
          Committed emitted runtime graphs · largest first · shared modules can
          overlap. React and external packages are excluded. These values are
          not additive application bundle sizes.
        </Text>
        <Text role="status" as="p" variant="caption" tone="muted">
          {entries.length} matching components
        </Text>
        <Box className="bundle-bars">
          {entries.map((entry) => (
            <Box key={entry.slug} className="bundle-row">
              <Link href={`#components/${entry.slug}`}>{entry.name}</Link>
              <span aria-hidden="true" className="bar-track">
                <span
                  style={{
                    width: `${((entry[compression] ?? 0) / maximum) * 100}%`,
                  }}
                  className="bar-flux"
                />
              </span>
              <Text as="strong" weight="bold">
                {formatBytes(entry[compression])}
              </Text>
            </Box>
          ))}
        </Box>
      </Stack>
    </Card>
  );
}
