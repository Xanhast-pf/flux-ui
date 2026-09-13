import { ArrowUpRightIcon, LockIcon, UnlockIcon } from "@flux-ui/icons";
import {
  Avatar,
  Button,
  Card,
  Grid,
  Heading,
  Inline,
  ScrollArea,
  Stack,
  Table,
  Text,
  Toggle,
  ToggleGroup,
} from "@flux-ui/react";
import { useState } from "react";
import { Metric, SceneHeader, SceneStatus } from "../SceneParts.js";
import { formatMoney } from "../model.js";
import "./finance.css";
const periods = {
  week: {
    label: "This week",
    total: "$12,480",
    change: "+8.2%",
    points:
      "0,135 40,127 80,144 120,95 160,108 200,66 240,81 280,38 320,51 360,28 400,44 440,12",
    ticks: ["Mon", "Wed", "Fri", "Sun"],
  },
  month: {
    label: "This month",
    total: "$48,290",
    change: "+12.8%",
    points:
      "0,143 40,132 80,147 120,105 160,112 200,76 240,88 280,48 320,62 360,23 400,39 440,8",
    ticks: ["Sep 01", "Sep 10", "Sep 20", "Sep 30"],
  },
} as const;
const activity = [
  {
    name: "Studio North",
    initials: "SN",
    detail: "Invoice · 1042",
    amount: "+$4,800",
    date: "Sep 24",
  },
  {
    name: "Acme Creative",
    initials: "AC",
    detail: "Invoice · 1041",
    amount: "+$2,400",
    date: "Sep 23",
  },
  {
    name: "Workspace",
    initials: "W",
    detail: "Subscription",
    amount: "−$120",
    date: "Sep 22",
  },
];
export default function FinanceScene() {
  const [period, setPeriod] = useState<keyof typeof periods>("month");
  const [frozen, setFrozen] = useState(false);
  const [paid, setPaid] = useState(false);
  const data = periods[period];
  return (
    <Stack data-scene="finance" gap={5} padding={5}>
      <SceneHeader brand="folio" context="Your business, in balance">
        <Text variant="caption" tone="muted">
          Personal workspace
        </Text>
        <Avatar alt="Demo account: Alex" fallback="A" size="sm" />
      </SceneHeader>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1.75fr) minmax(0, 1fr)",
        }}
        responsiveTo="container"
        gap="md"
      >
        <Card
          aria-label="Cash flow overview"
          as="section"
          padding={6}
          radius="sm"
        >
          <Stack gap={3}>
            <Inline justify="between" wrap gap={3}>
              <Stack gap="md">
                <Text as="p" variant="caption" tone="muted">
                  The bigger picture
                </Text>
                <Heading level={3} size="md">
                  Money in motion.
                </Heading>
              </Stack>
              <ToggleGroup.Root
                type="single"
                value={period}
                onValueChange={(value) => {
                  if (value === "week" || value === "month") setPeriod(value);
                }}
                aria-label="Cash flow period"
                size="sm"
              >
                <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
                <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
              </ToggleGroup.Root>
            </Inline>
            <Inline gap={3} wrap>
              <Text
                as="strong"
                variant="display"
                numeric
                data-testid="finance-amount"
              >
                {data.total}
              </Text>
              <Inline as="span" gap="xs">
                <ArrowUpRightIcon size={14} /> {data.change}
              </Inline>
            </Inline>
            <Text as="p" variant="caption" tone="muted">
              Income · {data.label.toLowerCase()} · fictional USD
            </Text>
            <Stack
              className="cashflow-chart"
              as="figure"
              gap="sm"
              paddingBlock={5}
            >
              <svg
                viewBox="0 0 440 175"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${data.label} sample cash flow: ${data.total}, ${data.change} versus the previous period.`}
              >
                <path
                  d="M0 20H440 M0 70H440 M0 120H440 M0 170H440"
                  className="chart-grid"
                />
                <polygon
                  points={`0,175 ${data.points} 440,175`}
                  className="chart-area"
                />
                <polyline points={data.points} className="chart-line" />
              </svg>
              <Inline as="figcaption" justify="between" gap="sm">
                {data.ticks.map((tick) => (
                  <Text key={tick} variant="caption">
                    {tick}
                  </Text>
                ))}
              </Inline>
            </Stack>
            <Grid
              columns={{ base: 1, sm: 3 }}
              responsiveTo="container"
              gap={3}
              paddingBlock={5}
            >
              <Metric
                label="Money in"
                value={data.total}
                note="Sample income"
              />
              <Metric
                label="Money out"
                value={period === "month" ? "$18,420" : "$4,620"}
                note="Sample expenses"
              />
              <Metric
                label="Your runway"
                value="8.4 months"
                note="Illustrative estimate"
              />
            </Grid>
          </Stack>
        </Card>
        <Stack gap="md">
          <Stack
            aria-label="Demo payment card"
            className="folio-card"
            as="section"
            gap="lg"
            padding={6}
          >
            <Text variant="body" weight="medium">
              folio / business
            </Text>
            <div aria-hidden="true" className="card-orbit" />
            <span aria-hidden="true" className="card-chip" />
            <Text as="strong" weight="medium" variant="metric" numeric>
              •••• &nbsp; 4242
            </Text>
            <Inline justify="between" gap="sm" wrap>
              <Text variant="caption">Alex Morgan</Text>
              <Text variant="caption">{frozen ? "Frozen" : "Active"}</Text>
            </Inline>
          </Stack>
          <Card as="section" padding={6} radius="sm">
            <Stack gap={3}>
              <Text as="p" variant="caption" tone="muted">
                Available balance
              </Text>
              <Text
                as="strong"
                variant="metric"
                numeric
                data-testid="finance-balance"
              >
                {formatMoney(12458000 - (paid ? 220000 : 0))}
              </Text>
              <Text as="p" variant="caption" tone="muted">
                Sample account · USD
              </Text>
              <Inline wrap gap="sm">
                <Button
                  size="sm"
                  onClick={() => {
                    setPaid(true);
                  }}
                  disabled={paid}
                >
                  {paid ? "Payout recorded" : "Record demo payout"}
                </Button>
                <Toggle
                  pressed={frozen}
                  onPressedChange={setFrozen}
                  aria-label="Freeze demo card"
                  size="sm"
                >
                  {frozen ? <LockIcon size={14} /> : <UnlockIcon size={14} />}{" "}
                  {frozen ? "Frozen" : "Freeze"}
                </Toggle>
              </Inline>
              <SceneStatus>
                {paid
                  ? "Demo payout of $2,200 recorded locally. No money moved."
                  : "Try the controls. This is a fictional account."}
              </SceneStatus>
            </Stack>
          </Card>
        </Stack>
        <Grid.Item colSpan="full">
          <Card
            aria-label="Recent demo activity"
            as="section"
            padding={6}
            radius="sm"
          >
            <Stack gap={3}>
              <Inline justify="between" wrap gap={3}>
                <Heading level={3} size="md">
                  Recent activity
                </Heading>
                <Text variant="caption" tone="muted">
                  Sample transactions
                </Text>
              </Inline>
              <ScrollArea aria-label="Fictional transactions" axis="horizontal">
                <Table.Root
                  density="compact"
                  style={{ minInlineSize: "28rem" }}
                >
                  <Table.Caption visuallyHidden>
                    Recent fictional transactions in USD
                  </Table.Caption>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Transaction</Table.ColumnHeader>
                      <Table.ColumnHeader>Date</Table.ColumnHeader>
                      <Table.ColumnHeader>
                        <Text as="p" align="end">
                          Amount
                        </Text>
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {activity.map((row) => (
                      <Table.Row key={row.name}>
                        <Table.RowHeader>
                          <Inline as="span" gap={3}>
                            <Avatar
                              alt=""
                              fallback={row.initials}
                              size="sm"
                              shape="square"
                            />
                            <Stack as="span" gap="xs">
                              <Text
                                as="strong"
                                variant="caption"
                                weight="medium"
                              >
                                {row.name}
                              </Text>
                              <Text
                                variant="caption"
                                tone="muted"
                                weight="regular"
                              >
                                {row.detail}
                              </Text>
                            </Stack>
                          </Inline>
                        </Table.RowHeader>
                        <Table.Cell>{row.date}</Table.Cell>
                        <Table.Cell>
                          <Stack as="span" align="end" gap="none">
                            <Text as="strong" variant="caption" numeric>
                              {row.amount}
                            </Text>
                          </Stack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </ScrollArea>
            </Stack>
          </Card>
        </Grid.Item>
      </Grid>
    </Stack>
  );
}
