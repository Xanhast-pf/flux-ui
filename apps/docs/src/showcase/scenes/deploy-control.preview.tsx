import { CodeIcon, RefreshIcon } from "@varua/icons";
import {
  Button,
  Callout,
  Card,
  Chart,
  ChartLegend,
  ChartTooltip,
  Code,
  CodeBlock,
  DescriptionList,
  Dialog,
  DropdownMenu,
  Field,
  Grid,
  Heading,
  Inline,
  Kbd,
  Progress,
  Select,
  Separator,
  Sidebar,
  Slider,
  Sparkline,
  Spinner,
  Stack,
  StatusBadge,
  Switch,
  Table,
  Tabs,
  Text,
  Toggle,
  Tooltip,
} from "@varua/flux-ui";
import { useState } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";

const deploySeries = [
  {
    id: "duration",
    label: "Deploy duration",
    data: [122, 118, 130, 111, 108, 103, 96, 101, 93, 88].map((y, x) => ({
      x,
      y,
    })),
  },
  {
    id: "p95",
    label: "p95 request latency",
    tone: "warning" as const,
    data: [148, 142, 151, 139, 136, 132, 129, 131, 126, 124].map((y, x) => ({
      x,
      y,
    })),
  },
];

const buildLog =
  "17:40:01  build started\n" +
  "17:40:04  dependencies restored\n" +
  "17:40:12  typecheck passed\n" +
  "17:40:19  842 modules transformed\n" +
  "17:40:24  edge bundle uploaded\n" +
  "17:40:31  canary healthy\n" +
  "17:40:36  production ready";

export default function DeployControlScene() {
  const [service, setService] = useState("web");
  const [tab, setTab] = useState("overview");
  const [traffic, setTraffic] = useState(20);
  const [autoPromote, setAutoPromote] = useState(true);
  const [canary, setCanary] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState("Production is healthy.");

  function refresh(): void {
    setRefreshing(true);
    setStatus("Refreshing local deployment telemetry…");
    window.setTimeout(() => {
      setRefreshing(false);
      setStatus("Telemetry refreshed locally. Production is healthy.");
    }, 250);
  }

  return (
    <Sidebar.Root defaultOpen>
      <Stack data-scene="deploy-control" gap="lg" padding={5}>
        <SceneHeader brand="Launchpad" context="Deploy control">
          <Tooltip content="Refresh fictional deployment telemetry." arrow>
            <Button
              size="sm"
              variant="outline"
              startIcon={
                refreshing ? (
                  <Spinner aria-hidden="true" />
                ) : (
                  <RefreshIcon size={14} />
                )
              }
              onClick={refresh}
              disabled={refreshing}
            >
              Refresh
            </Button>
          </Tooltip>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger size="sm">
              Deploy actions
            </DropdownMenu.Trigger>
            <DropdownMenu.Popup aria-label="Deployment actions">
              <DropdownMenu.Label>Release</DropdownMenu.Label>
              <DropdownMenu.Item
                onSelect={() =>
                  setStatus("Rollback rehearsal started locally.")
                }
              >
                Rehearse rollback
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => setStatus("Deploy notes copied locally.")}
              >
                Copy deploy notes
              </DropdownMenu.Item>
            </DropdownMenu.Popup>
          </DropdownMenu.Root>
        </SceneHeader>

        <Sidebar.Layout style={{ alignItems: "stretch" }}>
          <Sidebar.Panel
            aria-label="Service navigation"
            style={{ maxBlockSize: "none", position: "static" }}
          >
            <Stack gap="md">
              <Text variant="eyebrow" tone="muted">
                Services
              </Text>
              {[
                ["web", "Web"],
                ["api", "API"],
                ["worker", "Worker"],
              ].map(([value, label]) => (
                <Button
                  key={value}
                  variant={service === value ? "soft" : "ghost"}
                  tone="neutral"
                  onClick={() => setService(value ?? "web")}
                >
                  {label}
                </Button>
              ))}
              <Separator />
              <Sidebar.Close variant="ghost" tone="neutral">
                Close service rail
              </Sidebar.Close>
            </Stack>
          </Sidebar.Panel>

          <Sidebar.Content>
            <Stack gap="lg" paddingInline={5}>
              <Inline justify="between" wrap gap="md">
                <Stack gap="xs">
                  <Inline wrap gap="sm">
                    <Heading level={3} size="lg">
                      {service + " / production"}
                    </Heading>
                    <StatusBadge tone="success">Healthy</StatusBadge>
                  </Inline>
                  <Text tone="muted">
                    Commit <Code>5e806d1</Code> · us-east + ca-east
                  </Text>
                </Stack>
                <Inline wrap gap="sm">
                  <Sidebar.Toggle size="sm" variant="outline">
                    Toggle services
                  </Sidebar.Toggle>
                  <Dialog.Root>
                    <Dialog.Trigger>Environment settings</Dialog.Trigger>
                    <Dialog.Popup>
                      <Dialog.Title>Production settings</Dialog.Title>
                      <Dialog.Description>
                        Changes stay in local demo state.
                      </Dialog.Description>
                      <Stack gap="md">
                        <Field.Root>
                          <Field.Label>Region</Field.Label>
                          <Field.Control>
                            <Select defaultValue="ca-east">
                              <option value="ca-east">Canada East</option>
                              <option value="us-east">US East</option>
                            </Select>
                          </Field.Control>
                        </Field.Root>
                        <Field.Root>
                          <Inline justify="between" gap="md">
                            <Field.Label>
                              Auto-promote healthy canaries
                            </Field.Label>
                            <Field.Control>
                              <Switch
                                checked={autoPromote}
                                onCheckedChange={setAutoPromote}
                              />
                            </Field.Control>
                          </Inline>
                        </Field.Root>
                        <Dialog.Close
                          onClick={() =>
                            setStatus(
                              "Environment preferences updated locally.",
                            )
                          }
                        >
                          Save settings
                        </Dialog.Close>
                      </Stack>
                    </Dialog.Popup>
                  </Dialog.Root>
                </Inline>
              </Inline>

              <Tabs.Root value={tab} onValueChange={setTab}>
                <Tabs.List wrap aria-label="Deployment sections">
                  <Tabs.Tab value="overview">Overview</Tabs.Tab>
                  <Tabs.Tab value="logs">Build log</Tabs.Tab>
                  <Tabs.Tab value="services">Services</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" padding="none">
                  <Stack gap="lg" paddingBlock={5}>
                    <Grid
                      columns={{ base: 1, sm: 3 }}
                      responsiveTo="container"
                      gap="md"
                    >
                      <Card padding={5}>
                        <Stack gap="sm">
                          <Text variant="caption" tone="muted">
                            Availability
                          </Text>
                          <Text variant="metric" weight="bold" numeric>
                            99.995%
                          </Text>
                          <Sparkline
                            label="Availability samples"
                            values={[
                              99.97, 99.98, 99.99, 99.99, 100, 99.99, 100,
                            ]}
                          />
                        </Stack>
                      </Card>
                      <Card padding={5}>
                        <Stack gap="sm">
                          <Text variant="caption" tone="muted">
                            Build duration
                          </Text>
                          <Text variant="metric" weight="bold" numeric>
                            1m 28s
                          </Text>
                          <StatusBadge tone="success">
                            −21s over 10 deploys
                          </StatusBadge>
                        </Stack>
                      </Card>
                      <Card padding={5}>
                        <Stack gap="sm">
                          <Text variant="caption" tone="muted">
                            Error budget
                          </Text>
                          <Text variant="metric" weight="bold" numeric>
                            92%
                          </Text>
                          <Progress
                            aria-label="Error budget remaining"
                            value={92}
                          />
                        </Stack>
                      </Card>
                    </Grid>

                    <Card padding={5}>
                      <Stack gap="md">
                        <Inline justify="between" wrap gap="sm">
                          <Heading level={4} size="md">
                            Deploy performance
                          </Heading>
                          <StatusBadge tone="success">Stable</StatusBadge>
                        </Inline>
                        <ChartLegend items={deploySeries} toggleVisibility>
                          <ChartTooltip>
                            <Chart
                              label="Deploy performance"
                              description="Fictional deployment and latency samples."
                              series={deploySeries}
                              type="line"
                              formatX={(x) => "Deploy " + (x + 1)}
                              formatY={(y) => y + " ms"}
                            />
                          </ChartTooltip>
                        </ChartLegend>
                      </Stack>
                    </Card>

                    <Grid
                      columns={{ base: 1, md: 2 }}
                      responsiveTo="container"
                      gap="md"
                    >
                      <Card padding={5}>
                        <Stack gap="md">
                          <Heading level={4} size="md">
                            Canary control
                          </Heading>
                          <Toggle pressed={canary} onPressedChange={setCanary}>
                            {canary ? "Canary enabled" : "Canary disabled"}
                          </Toggle>
                          <Field.Root disabled={!canary}>
                            <Field.Label>
                              {`Canary traffic: ${traffic}%`}
                            </Field.Label>
                            <Field.Control>
                              <Slider
                                min={0}
                                max={100}
                                step={5}
                                value={traffic}
                                onValueChange={setTraffic}
                                showValue
                                formatValue={(value) => `${value}%`}
                              />
                            </Field.Control>
                          </Field.Root>
                          <Text variant="caption" tone="muted">
                            Use <Kbd>←</Kbd> / <Kbd>→</Kbd> to adjust traffic.
                          </Text>
                        </Stack>
                      </Card>
                      <Callout
                        tone={canary && traffic > 50 ? "warning" : "info"}
                      >
                        {canary
                          ? traffic +
                            "% of fictional production traffic is routed to the canary."
                          : "Canary routing is disabled. All fictional traffic uses the current release."}
                      </Callout>
                    </Grid>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="logs" padding="none">
                  <Stack gap="md" paddingBlock={5}>
                    <Inline justify="between" wrap gap="sm">
                      <Heading level={4} size="md">
                        Build log
                      </Heading>
                      <Button
                        variant="outline"
                        size="sm"
                        startIcon={<CodeIcon size={14} />}
                        onClick={() => setStatus("Build log copied locally.")}
                      >
                        Copy log
                      </Button>
                    </Inline>
                    <CodeBlock
                      label="Production build log"
                      language="bash"
                      code={buildLog}
                    />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="services" padding="none">
                  <Card padding={5}>
                    <Stack gap="md">
                      <Heading level={4} size="md">
                        Service health
                      </Heading>
                      <Table.Root>
                        <Table.Caption>Fictional service health</Table.Caption>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Service</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                            <Table.ColumnHeader>p95</Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {[
                            ["Web", "Healthy", "124 ms"],
                            ["API", "Healthy", "98 ms"],
                            ["Worker", "Degraded", "410 ms"],
                          ].map(([name, health, latency]) => (
                            <Table.Row key={name}>
                              <Table.RowHeader>{name}</Table.RowHeader>
                              <Table.Cell>
                                <StatusBadge
                                  tone={
                                    health === "Healthy" ? "success" : "warning"
                                  }
                                >
                                  {health}
                                </StatusBadge>
                              </Table.Cell>
                              <Table.Cell>{latency}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                      <DescriptionList>
                        <DescriptionList.Term>Release</DescriptionList.Term>
                        <DescriptionList.Details>
                          2026.10.07.4
                        </DescriptionList.Details>
                        <DescriptionList.Term>Runtime</DescriptionList.Term>
                        <DescriptionList.Details>
                          Edge + regional workers
                        </DescriptionList.Details>
                      </DescriptionList>
                    </Stack>
                  </Card>
                </Tabs.Panel>
              </Tabs.Root>

              <SceneStatus>{status}</SceneStatus>
            </Stack>
          </Sidebar.Content>
        </Sidebar.Layout>
      </Stack>
    </Sidebar.Root>
  );
}
