import {
  Box,
  Card,
  Grid,
  Heading,
  List,
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

        <Box>
          <Heading level={2} size="lg">
            Required quality gates
          </Heading>
          <List as="ul" variant="marker">
            <List.Item>Generated registry is deterministic</List.Item>
            <List.Item>Prettier formatting</List.Item>
            <List.Item>ESLint</List.Item>
            <List.Item>Strict TypeScript</List.Item>
            <List.Item>Knip dependency/file analysis</List.Item>
            <List.Item>Vitest component and token tests</List.Item>
            <List.Item>Production package and docs builds</List.Item>
            <List.Item>Per-component bundle-size contracts</List.Item>
            <List.Item>Coding Bible automated rules</List.Item>
            <List.Item>Storybook production build</List.Item>
            <List.Item>Playwright accessibility and browser tests</List.Item>
            <List.Item>
              Native-relative runtime performance regression checks
            </List.Item>
          </List>
        </Box>
      </Stack>
    </Stack>
  );
}
