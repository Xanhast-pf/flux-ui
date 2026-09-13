import {
  Card,
  Grid,
  Heading,
  Link,
  PageHeader,
  Stack,
  Stat,
  Text,
} from "@flux-ui/react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
import { MeasurementNotice } from "../ui/MeasurementNotice.js";
export function HealthPage() {
  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <PageHeader title={<>Repository health</>}>
          <Text as="p" variant="body">
            A snapshot of catalog coverage, package weight, and quality gates.
            Explore individual bundle and runtime measurements from the Inspect
            menu.
          </Text>
        </PageHeader>
        <MeasurementNotice />

        <Grid minColumnWidth="13rem" gap="md">
          <Card>
            <Stat
              label={<>Public component families</>}
              value={<>{components.length}</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Last measured runtime Brotli</>}
              value={<>{formatBytes(runtimeBrotli)}</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Last measured package Brotli</>}
              value={<>{formatBytes(publishedBrotli)}</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Size budget contract</>}
              value={<>v{health.size.budgetsVersion}</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Runtime performance policy</>}
              value={<>v{health.performance.policyVersion}</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Runtime styling engine</>}
              value={<>0 B</>}
              note={<>Static CSS and CSS variables</>}
            />
          </Card>
        </Grid>

        <Card>
          <Stack gap="md">
            <Heading level={2} size="lg">
              Read this snapshot
            </Heading>
            <Text as="p" tone="muted">
              Catalog coverage is generated from component metadata. Weight
              comes from committed, reviewed baselines; an unmeasured component
              remains pending. These numbers are not a live CI verdict.
            </Text>
            <Link href="#size">
              Inspect component-by-component bundle measurements
            </Link>
            <Link href="#performance">
              Inspect committed runtime measurements
            </Link>
            <Link href="#engineering">How the quality gates work</Link>
            <Link href="#trust">Build and security evidence</Link>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
