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
              label={<>Eligible for beta review</>}
              value={
                <>
                  {readiness.summary.eligibleForBetaReview} /{" "}
                  {readiness.summary.total}
                </>
              }
              note={
                <>
                  Automated prerequisites; promotion stays a maintainer decision
                </>
              }
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
              Read this snapshot
            </Heading>
            <Text as="p" tone="muted">
              Catalog coverage and lifecycle readiness are generated from the
              current public contract, docs, tests, browser/a11y catalog
              coverage, and reviewed size baselines. Eligibility means the
              automated prerequisites are present; it is not an automatic
              promotion or a blanket production-readiness claim.
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
