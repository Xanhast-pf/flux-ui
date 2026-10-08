import { DownloadIcon } from "@flux-ui/icons";
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  Chart,
  ChartLegend,
  ChartTooltip,
  DataTable,
  DatePicker,
  Dialog,
  DropdownMenu,
  Field,
  Grid,
  Heading,
  Inline,
  NumberField,
  PieChart,
  Progress,
  Select,
  Sparkline,
  Stack,
  Stat,
  StatusBadge,
  Text,
  ToggleGroup,
  type DataColumn,
} from "@flux-ui/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";

interface AccountRow {
  id: string;
  account: string;
  owner: string;
  arr: number;
  health: "Healthy" | "Watch";
}

const compactQuery = "(max-width: 30rem)";

function subscribeCompact(notify: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

function getCompactSnapshot() {
  return window.matchMedia(compactQuery).matches;
}

const accounts: readonly AccountRow[] = [
  {
    id: "acme",
    account: "Acme North",
    owner: "AM",
    arr: 248000,
    health: "Healthy",
  },
  {
    id: "lumen",
    account: "Lumen Labs",
    owner: "JL",
    arr: 186000,
    health: "Healthy",
  },
  {
    id: "atlas",
    account: "Atlas Works",
    owner: "KC",
    arr: 142000,
    health: "Watch",
  },
  {
    id: "orbit",
    account: "Orbit Studio",
    owner: "PN",
    arr: 118000,
    health: "Healthy",
  },
  {
    id: "field",
    account: "Field Systems",
    owner: "RS",
    arr: 96000,
    health: "Watch",
  },
];

const columns: readonly DataColumn<AccountRow>[] = [
  {
    id: "account",
    header: "Account",
    value: (row) => row.account,
    renderCell: (row) => (
      <Inline gap="sm">
        <Avatar alt="" fallback={row.owner} size="sm" />
        <Text weight="medium">{row.account}</Text>
      </Inline>
    ),
  },
  {
    id: "arr",
    header: "ARR",
    value: (row) => row.arr,
    renderCell: (row) => (
      <Text numeric>{"$" + Math.round(row.arr / 1000) + "k"}</Text>
    ),
  },
  {
    id: "health",
    header: "Health",
    value: (row) => row.health,
    renderCell: (row) => (
      <StatusBadge tone={row.health === "Healthy" ? "success" : "warning"}>
        {row.health}
      </StatusBadge>
    ),
  },
];

const compactColumns: readonly DataColumn<AccountRow>[] = [columns[0]!];

const revenueSeries = [
  {
    id: "recurring",
    label: "Recurring revenue",
    data: [412, 438, 461, 489, 520, 548, 579, 611, 642, 681, 718, 756].map(
      (y, x) => ({ x, y }),
    ),
  },
  {
    id: "expansion",
    label: "Expansion",
    tone: "success" as const,
    data: [42, 51, 48, 61, 67, 72, 81, 76, 92, 103, 111, 126].map((y, x) => ({
      x,
      y,
    })),
  },
];

const productMix = [
  { id: "platform", label: "Platform", value: 58 },
  { id: "automation", label: "Automation", value: 27, tone: "info" as const },
  { id: "services", label: "Services", value: 15, tone: "success" as const },
];

export default function RevenueCommandScene() {
  const [period, setPeriod] = useState("12m");
  const [selected, setSelected] = useState<readonly string[]>(["lumen"]);
  const [scenario, setScenario] = useState("base");
  const [growth, setGrowth] = useState<number | null>(18);
  const [status, setStatus] = useState(
    "Forecast model is local to this dashboard.",
  );
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    () => false,
  );
  const trend = useMemo(
    () =>
      period === "30d"
        ? [92, 94, 93, 97, 99, 101, 104]
        : [78, 82, 87, 91, 96, 101, 108],
    [period],
  );

  return (
    <Stack data-scene="revenue-command" gap="lg" padding={5}>
      <SceneHeader brand="Northstar" context="Revenue command">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger size="sm" variant="outline" tone="neutral">
            Export
          </DropdownMenu.Trigger>
          <DropdownMenu.Popup aria-label="Revenue export">
            <DropdownMenu.Label>Snapshot</DropdownMenu.Label>
            <DropdownMenu.Item
              onSelect={() => setStatus("CSV export queued locally.")}
            >
              Export CSV
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => setStatus("Board PDF export queued locally.")}
            >
              Board PDF
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
        <Button
          size="sm"
          startIcon={<DownloadIcon size={14} />}
          onClick={() => setStatus("Snapshot saved locally.")}
        >
          Save snapshot
        </Button>
      </SceneHeader>

      <Breadcrumbs.Root aria-label="Revenue location">
        <Breadcrumbs.List>
          <Breadcrumbs.Item separator="›">
            <Breadcrumbs.Link href="#playground?scene=revenue-command">
              Company
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item separator="›">
            <Breadcrumbs.Link href="#playground?scene=revenue-command">
              Executive
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Revenue</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>

      <Inline justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={3} size="lg">
            Revenue overview
          </Heading>
          <Text tone="muted">Fictional data · updated moments ago</Text>
        </Stack>
        <Inline wrap gap="sm">
          <Field.Root density="compact">
            <Field.Label>As of</Field.Label>
            <Field.Control>
              <DatePicker defaultValue="2026-10-07" />
            </Field.Control>
          </Field.Root>
          <ToggleGroup.Root
            aria-label="Revenue period"
            type="single"
            value={period}
            onValueChange={(value) => {
              if (value === "30d" || value === "12m") setPeriod(value);
            }}
            size="sm"
          >
            <ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
            <ToggleGroup.Item value="12m">12 months</ToggleGroup.Item>
          </ToggleGroup.Root>
        </Inline>
      </Inline>

      <Grid
        columns={{ base: 1, sm: 2, lg: 4 }}
        responsiveTo="container"
        gap="md"
      >
        <Card padding={5}>
          <Stack gap="sm">
            <Stat
              label="Annual recurring revenue"
              value="$8.42M"
              note="+18.4% YoY"
            />
            <Sparkline
              label="ARR trend rising across seven samples"
              values={trend}
            />
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="sm">
            <Stat label="Net revenue retention" value="118%" note="+3.2 pts" />
            <Sparkline
              label="NRR trend"
              values={[106, 109, 111, 112, 115, 117, 118]}
            />
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="sm">
            <Stat
              label="Pipeline coverage"
              value="3.8×"
              note="$2.1M weighted"
            />
            <Progress aria-label="Pipeline coverage to target" value={76} />
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="sm">
            <Stat label="Gross margin" value="82.6%" note="+1.8 pts" />
            <Sparkline
              label="Gross margin trend"
              values={[77, 78, 79, 80, 80, 82, 83]}
            />
          </Stack>
        </Card>
      </Grid>

      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1.7fr) minmax(16rem, 0.8fr)",
        }}
        responsiveTo="container"
        gap="md"
      >
        <Card as="section" padding={5}>
          <Stack gap="md">
            <Inline justify="between" wrap gap="sm">
              <Stack gap="xs">
                <Heading level={4} size="md">
                  Revenue momentum
                </Heading>
                <Text variant="caption" tone="muted">
                  Recurring + expansion · $k
                </Text>
              </Stack>
              <StatusBadge tone="success">On plan</StatusBadge>
            </Inline>
            <ChartLegend items={revenueSeries} toggleVisibility>
              <ChartTooltip>
                <Chart
                  label="Revenue momentum"
                  description="Twelve fictional monthly revenue samples."
                  series={revenueSeries}
                  type="area"
                  formatX={(value) => `Month ${value + 1}`}
                  formatY={(value) => `$${value}k`}
                />
              </ChartTooltip>
            </ChartLegend>
          </Stack>
        </Card>
        <Card as="section" padding={5}>
          <Stack gap="md">
            <Heading level={4} size="md">
              Product mix
            </Heading>
            <ChartLegend items={productMix} toggleVisibility>
              <ChartTooltip trigger="click">
                <PieChart
                  label="Revenue product mix"
                  description="Fictional revenue mix by product."
                  data={productMix}
                  formatValue={(value) => `${value}%`}
                />
              </ChartTooltip>
            </ChartLegend>
          </Stack>
        </Card>
      </Grid>

      <Card as="section" padding={5}>
        <Stack gap="md">
          <Inline justify="between" wrap gap="md">
            <Stack gap="xs">
              <Heading level={4} size="md">
                Top accounts
              </Heading>
              <Text variant="caption" tone="muted">
                {selected.length} selected
              </Text>
            </Stack>
            <Dialog.Root>
              <Dialog.Trigger>Build forecast</Dialog.Trigger>
              <Dialog.Popup>
                <Dialog.Title>Forecast next quarter</Dialog.Title>
                <Dialog.Description>
                  Adjust a local scenario. No forecast is stored or submitted.
                </Dialog.Description>
                <Stack gap="md">
                  <Field.Root>
                    <Field.Label>Scenario</Field.Label>
                    <Field.Control>
                      <Select
                        value={scenario}
                        onChange={(event) =>
                          setScenario(event.currentTarget.value)
                        }
                      >
                        <option value="base">Base case</option>
                        <option value="upside">Upside</option>
                        <option value="downside">Downside</option>
                      </Select>
                    </Field.Control>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Expected growth (%)</Field.Label>
                    <Field.Control>
                      <NumberField
                        min={-50}
                        max={100}
                        value={growth ?? ""}
                        onValueChange={setGrowth}
                      />
                    </Field.Control>
                  </Field.Root>
                  <Dialog.Close
                    onClick={() =>
                      setStatus(
                        `${scenario} forecast updated to ${growth ?? 0}% locally.`,
                      )
                    }
                  >
                    Apply scenario
                  </Dialog.Close>
                </Stack>
              </Dialog.Popup>
            </Dialog.Root>
          </Inline>
          {compact ? (
            <Text variant="caption" tone="muted">
              Compact view prioritizes account identity. Use a wider canvas for
              ARR and health columns.
            </Text>
          ) : null}
          <DataTable
            label="Top revenue accounts"
            rows={accounts}
            columns={compact ? compactColumns : columns}
            getRowId={(row) => row.id}
            height={290}
            selectable
            selectedRowIds={selected}
            onSelectedRowIdsChange={setSelected}
          />
        </Stack>
      </Card>

      <SceneStatus>{status}</SceneStatus>
    </Stack>
  );
}
