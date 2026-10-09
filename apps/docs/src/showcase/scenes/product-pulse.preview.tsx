import { SaveIcon } from "@varua/icons";
import {
  Accordion,
  Button,
  Callout,
  Card,
  Chart,
  ChartLegend,
  ChartTooltip,
  Combobox,
  Field,
  Grid,
  Heading,
  IconButton,
  Inline,
  Meter,
  PieChart,
  Popover,
  Rating,
  ScatterChart,
  Select,
  Slider,
  Stack,
  Stat,
  StatusBadge,
  Switch,
  Tabs,
  Tag,
  Text,
  ToggleGroup,
  Tooltip,
  type RatingValue,
} from "@varua/flux-ui";
import { useState } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";

const teams = [
  { value: "all", label: "All product teams", group: "Scope" },
  { value: "activation", label: "Activation", group: "Product" },
  { value: "collaboration", label: "Collaboration", group: "Product" },
  { value: "platform", label: "Platform", group: "Infrastructure" },
];

const adoptionSeries = [
  {
    id: "weekly",
    label: "Weekly active teams",
    data: [21, 24, 28, 31, 35, 41, 44, 49, 55, 61].map((y, x) => ({ x, y })),
  },
  {
    id: "power",
    label: "Power users",
    tone: "success" as const,
    data: [7, 8, 9, 11, 13, 15, 17, 18, 21, 24].map((y, x) => ({ x, y })),
  },
];

const cohortData = [
  { id: "new", label: "New", value: 44 },
  { id: "returning", label: "Returning", value: 38, tone: "success" as const },
  { id: "resurrected", label: "Resurrected", value: 18, tone: "info" as const },
];

const performanceSeries = [
  {
    id: "desktop",
    label: "Desktop",
    data: [
      { x: 18, y: 220 },
      { x: 31, y: 260 },
      { x: 48, y: 312 },
      { x: 70, y: 370 },
      { x: 94, y: 450 },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    tone: "warning" as const,
    data: [
      { x: 14, y: 280 },
      { x: 30, y: 330 },
      { x: 52, y: 410 },
      { x: 74, y: 505 },
      { x: 96, y: 620 },
    ],
  },
];

export default function ProductPulseScene() {
  const [team, setTeam] = useState<string | null>("all");
  const [metric, setMetric] = useState("adoption");
  const [confidence, setConfidence] = useState(82);
  const [rating, setRating] = useState<RatingValue>(4);
  const [status, setStatus] = useState(
    "Experiment board is local to this page.",
  );

  return (
    <Stack data-scene="product-pulse" gap="lg" padding={5}>
      <SceneHeader brand="Beacon" context="Product intelligence">
        <Tooltip content="Save this fictional dashboard view locally." arrow>
          <IconButton
            aria-label="Save product view"
            variant="outline"
            onClick={() => setStatus("Product view saved locally.")}
          >
            <SaveIcon size={16} />
          </IconButton>
        </Tooltip>
        <Popover.Root>
          <Popover.Trigger size="sm" variant="outline">
            Guardrails
          </Popover.Trigger>
          <Popover.Popup aria-label="Experiment guardrails">
            <Stack gap="md">
              <Field.Root description="This is a local demo preference.">
                <Inline justify="between" gap="md">
                  <Field.Label>Stop on error spike</Field.Label>
                  <Field.Control>
                    <Switch defaultChecked />
                  </Field.Control>
                </Inline>
              </Field.Root>
              <Field.Root description="This is a local demo preference.">
                <Inline justify="between" gap="md">
                  <Field.Label>Require significance</Field.Label>
                  <Field.Control>
                    <Switch defaultChecked />
                  </Field.Control>
                </Inline>
              </Field.Root>
              <Popover.Close>Done</Popover.Close>
            </Stack>
          </Popover.Popup>
        </Popover.Root>
      </SceneHeader>

      <Stack gap="xs">
        <Heading level={3} size="lg">
          Product pulse
        </Heading>
        <Text tone="muted">
          Adoption, experiments, cohorts, and quality in one product view.
        </Text>
      </Stack>

      <Tabs.Root defaultValue="overview">
        <Tabs.List wrap aria-label="Product intelligence sections">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="experiments">Experiments</Tabs.Tab>
          <Tabs.Tab value="quality">Quality</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" padding="none">
          <Stack gap="lg" paddingBlock={5}>
            <Grid
              columns={{ base: 1, md: 3 }}
              responsiveTo="container"
              gap="md"
            >
              <Field.Root>
                <Field.Label>Team</Field.Label>
                <Field.Control>
                  <Combobox
                    options={teams}
                    value={team}
                    onValueChange={setTeam}
                    listLabel="Product teams"
                  />
                </Field.Control>
              </Field.Root>
              <Field.Root>
                <Field.Label>Segment</Field.Label>
                <Field.Control>
                  <Select defaultValue="paid">
                    <option value="paid">Paid workspaces</option>
                    <option value="trial">Trials</option>
                    <option value="enterprise">Enterprise</option>
                  </Select>
                </Field.Control>
              </Field.Root>
              <Field.Root>
                <Field.Label>Signal</Field.Label>
                <Field.Control>
                  <ToggleGroup.Root
                    type="single"
                    value={metric}
                    onValueChange={(value) => {
                      if (value) setMetric(value);
                    }}
                    aria-label="Product signal"
                  >
                    <ToggleGroup.Item value="adoption">
                      Adoption
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="retention">
                      Retention
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="quality">Quality</ToggleGroup.Item>
                  </ToggleGroup.Root>
                </Field.Control>
              </Field.Root>
            </Grid>

            <Grid
              columns={{ base: 1, sm: 2, lg: 4 }}
              responsiveTo="container"
              gap="md"
            >
              <Card padding={5}>
                <Stat
                  label="Weekly active teams"
                  value="12,842"
                  note="+14.2%"
                />
              </Card>
              <Card padding={5}>
                <Stat label="Activation" value="68.4%" note="+4.8 pts" />
              </Card>
              <Card padding={5}>
                <Stat label="7-day retention" value="54.1%" note="+2.1 pts" />
              </Card>
              <Card padding={5}>
                <Stack gap="sm">
                  <Stat label="Quality budget" value="84%" note="Healthy" />
                  <Meter
                    aria-label="Quality budget used"
                    min={0}
                    max={100}
                    value={84}
                  >
                    84%
                  </Meter>
                </Stack>
              </Card>
            </Grid>

            <Grid
              templateColumns={{
                base: "minmax(0, 1fr)",
                lg: "minmax(0, 1.5fr) minmax(16rem, 0.7fr)",
              }}
              responsiveTo="container"
              gap="md"
            >
              <Card padding={5}>
                <Stack gap="md">
                  <Heading level={4} size="md">
                    {metric === "retention"
                      ? "Retention momentum"
                      : "Adoption momentum"}
                  </Heading>
                  <ChartLegend items={adoptionSeries} toggleVisibility>
                    <ChartTooltip>
                      <Chart
                        label="Product adoption"
                        description="Fictional product usage trend."
                        series={adoptionSeries}
                        type="line"
                        formatX={(x) => "Week " + (x + 1)}
                        formatY={(y) => y + "k"}
                      />
                    </ChartTooltip>
                  </ChartLegend>
                </Stack>
              </Card>
              <Card padding={5}>
                <Stack gap="md">
                  <Heading level={4} size="md">
                    User mix
                  </Heading>
                  <ChartLegend items={cohortData} toggleVisibility>
                    <ChartTooltip>
                      <PieChart
                        label="User mix"
                        description="Fictional cohort mix."
                        data={cohortData}
                        formatValue={(value) => `${value}%`}
                      />
                    </ChartTooltip>
                  </ChartLegend>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="experiments" padding="none">
          <Grid
            columns={{ base: 1, lg: 2 }}
            responsiveTo="container"
            gap="md"
            paddingBlock={5}
          >
            <Card padding={5}>
              <Stack gap="md">
                <Inline justify="between" wrap gap="sm">
                  <Stack gap="xs">
                    <Heading level={4} size="md">
                      Onboarding checklist
                    </Heading>
                    <Inline gap="sm" wrap>
                      <StatusBadge tone="success">Winning</StatusBadge>
                      <Tag tone="accent">Activation</Tag>
                    </Inline>
                  </Stack>
                  <Text numeric weight="bold">
                    +8.7%
                  </Text>
                </Inline>
                <Field.Root>
                  <Field.Label>Decision confidence: {confidence}%</Field.Label>
                  <Field.Control>
                    <Slider
                      min={50}
                      max={99}
                      value={confidence}
                      onValueChange={setConfidence}
                      showValue
                      formatValue={(value) => `${value}%`}
                    />
                  </Field.Control>
                </Field.Root>
                <Callout tone="info">
                  Variant B is ahead, but mobile latency remains above the team
                  guardrail.
                </Callout>
                <Button
                  onClick={() =>
                    setStatus(
                      `Experiment marked ready at ${confidence}% confidence.`,
                    )
                  }
                >
                  Mark ready for review
                </Button>
              </Stack>
            </Card>
            <Card padding={5}>
              <Stack gap="md">
                <Heading level={4} size="md">
                  Research confidence
                </Heading>
                <Rating
                  aria-label="Research confidence"
                  step={0.5}
                  value={rating}
                  onValueChange={setRating}
                />
                <Text tone="muted">
                  {`${rating ?? 0} of 5 from the local research review.`}
                </Text>
                <Accordion.Root type="multiple">
                  <Accordion.Item open>
                    <Accordion.Trigger>What changed?</Accordion.Trigger>
                    <Accordion.Content>
                      Shorter setup, clearer next action, stronger first-session
                      completion.
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Trigger>What could regress?</Accordion.Trigger>
                    <Accordion.Content>
                      Mobile completion and notification opt-in are the main
                      guardrails.
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </Stack>
            </Card>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="quality" padding="none">
          <Card padding={5}>
            <Stack gap="md">
              <Heading level={4} size="md">
                Latency vs session depth
              </Heading>
              <Text tone="muted">
                Hover or keyboard-inspect the fictional samples.
              </Text>
              <ChartLegend
                items={performanceSeries}
                placement="end"
                toggleVisibility
              >
                <ChartTooltip>
                  <ScatterChart
                    label="Latency vs session depth"
                    description="Fictional quality samples."
                    series={performanceSeries}
                    formatX={(value) => value + " actions"}
                    formatY={(value) => value + " ms"}
                  />
                </ChartTooltip>
              </ChartLegend>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs.Root>

      <SceneStatus>{status}</SceneStatus>
    </Stack>
  );
}
