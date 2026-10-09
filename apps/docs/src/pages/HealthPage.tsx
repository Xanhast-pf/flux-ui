import {
  Card,
  Grid,
  Heading,
  Link,
  PageHeader,
  Stack,
  Stat,
  Text,
} from "@varua/flux-ui";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { readiness } from "../generated/readiness.js";
import { formatBytes } from "../lib/format.js";
import { MeasurementNotice } from "../ui/MeasurementNotice.js";
export function HealthPage() {
  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;
  const lifecycle = readiness.summary.status;
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <Stack gap="md">
        <PageHeader title={<>Repository health</>}>
          <Text as="p" variant="body">
            Component status, package size, and quality checks.
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
              label={<>Eligible for beta review</>}
              value={
                <>
                  {readiness.summary.eligibleForBetaReview} /{" "}
                  {readiness.summary.total}
                </>
              }
              note={<>Automated checks only. Promotion is manual.</>}
            />
          </Card>
          <Card>
            <Stat
              label={<>Lifecycle labels</>}
              value={<>{lifecycle.alpha} alpha</>}
              note={
                <>
                  {lifecycle.beta} beta · {lifecycle.stable} stable
                </>
              }
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
              About these numbers
            </Heading>
            <Text as="p" tone="muted">
              Status comes from code, docs, tests, and baselines. Passing checks
              does not mean a component is production-ready.
            </Text>
            <Link href="#size">Component sizes</Link>
            <Link href="#performance">Runtime performance</Link>
            <Link href="#engineering">Quality checks</Link>
            <Link href="#trust">Build and security</Link>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}
