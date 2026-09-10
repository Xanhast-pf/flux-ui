import { Card, Grid, Stack } from "@flux-ui/react";
import { health } from "../generated/health.js";
import { components } from "../generated/components.js";
import { formatBytes } from "../lib/format.js";
import { MeasurementNotice } from "../ui/MeasurementNotice.js";
export function HealthPage() {
  const runtimeBrotli = health.size.aggregate.runtime.brotli;
  const publishedBrotli = health.size.aggregate.published.brotli;
  return (
    <section className="reference-page">
      <Stack gap="md">
        <MeasurementNotice />
        <div>
          <h1>Repository health</h1>
          <p>
            This page reads committed size and performance baselines generated
            from the repository. For the live CI result, use the CI link in the
            header.
          </p>
        </div>

        <Grid minColumnWidth="13rem" gap="md">
          <Card className="metric-card">
            <span>Public component families</span>
            <strong>{components.length}</strong>
          </Card>
          <Card className="metric-card">
            <span>Last measured runtime Brotli</span>
            <strong>{formatBytes(runtimeBrotli)}</strong>
          </Card>
          <Card className="metric-card">
            <span>Last measured package Brotli</span>
            <strong>{formatBytes(publishedBrotli)}</strong>
          </Card>
          <Card className="metric-card">
            <span>Size budget contract</span>
            <strong>v{health.size.budgetsVersion}</strong>
          </Card>
          <Card className="metric-card">
            <span>Runtime performance policy</span>
            <strong>v{health.performance.policyVersion}</strong>
          </Card>
          <Card className="metric-card">
            <span>Runtime styling engine</span>
            <strong>0 B</strong>
            <small>Static CSS and CSS variables</small>
          </Card>
        </Grid>

        <div>
          <h2>Required quality gates</h2>
          <ul>
            <li>Generated registry is deterministic</li>
            <li>Prettier formatting</li>
            <li>ESLint</li>
            <li>Strict TypeScript</li>
            <li>Knip dependency/file analysis</li>
            <li>Vitest component and token tests</li>
            <li>Production package and docs builds</li>
            <li>Per-component bundle-size contracts</li>
            <li>Coding Bible automated rules</li>
            <li>Storybook production build</li>
            <li>Playwright accessibility and browser tests</li>
            <li>Native-relative runtime performance regression checks</li>
          </ul>
        </div>
      </Stack>
    </section>
  );
}
