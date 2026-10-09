import {
  AlertDialog,
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  ColorSwatch,
  DataGrid,
  Drawer,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  InputGroup,
  NumberField,
  Pagination,
  Rating,
  Select,
  Stack,
  StatusBadge,
  Switch,
  Text,
  type RatingValue,
} from "@varua/flux-ui";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";

interface InventoryRow {
  id: string;
  product: string;
  sku: string;
  stock: number;
  status: string;
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

const initialRows: InventoryRow[] = [
  {
    id: "canvas",
    product: "Canvas Weekender",
    sku: "CW-204",
    stock: 42,
    status: "Healthy",
  },
  {
    id: "lamp",
    product: "Halo Desk Lamp",
    sku: "HL-031",
    stock: 8,
    status: "Low",
  },
  {
    id: "speaker",
    product: "Field Speaker",
    sku: "FS-110",
    stock: 17,
    status: "Healthy",
  },
  {
    id: "tray",
    product: "Stone Catchall",
    sku: "SC-044",
    stock: 3,
    status: "Critical",
  },
  {
    id: "stand",
    product: "Arc Laptop Stand",
    sku: "AL-091",
    stock: 25,
    status: "Healthy",
  },
];

export default function CommerceOpsScene() {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<readonly string[]>(["lamp"]);
  const [page, setPage] = useState(1);
  const [warehouse, setWarehouse] = useState("east");
  const [threshold, setThreshold] = useState<number | null>(10);
  const [autoRestock, setAutoRestock] = useState(true);
  const [rating, setRating] = useState<RatingValue>(4.5);
  const [status, setStatus] = useState(
    "Inventory changes stay in this browser tab.",
  );
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    () => false,
  );
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        (row.product + " " + row.sku)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query, rows],
  );

  return (
    <Stack data-scene="commerce-ops" gap="lg" padding={5}>
      <SceneHeader brand="Mercantile" context="Commerce operations">
        <ButtonGroup aria-label="Commerce actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("Pick list generated locally.")}
          >
            Pick list
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("Inventory snapshot exported locally.")}
          >
            Export
          </Button>
        </ButtonGroup>
      </SceneHeader>

      <Inline justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={3} size="lg">
            Operations cockpit
          </Heading>
          <Text tone="muted">East + West warehouses · fictional inventory</Text>
        </Stack>
        <Inline wrap gap="sm">
          <StatusBadge tone="success">98.4% on-time</StatusBadge>
          <StatusBadge tone="warning">2 low-stock SKUs</StatusBadge>
        </Inline>
      </Inline>

      <Grid columns={{ base: 1, md: 3 }} responsiveTo="container" gap="md">
        <Card padding={5}>
          <Stack gap="sm">
            <Text tone="muted" variant="caption">
              Orders today
            </Text>
            <Text variant="metric" weight="bold" numeric>
              1,248
            </Text>
            <StatusBadge tone="success">+12.7% vs last Tuesday</StatusBadge>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="sm">
            <Text tone="muted" variant="caption">
              Ready to fulfill
            </Text>
            <Text variant="metric" weight="bold" numeric>
              186
            </Text>
            <Text tone="muted">Median pick time 8m 42s</Text>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="sm">
            <Text tone="muted" variant="caption">
              Customer quality
            </Text>
            <Rating
              aria-label="Customer quality"
              readOnly
              value={rating}
              step={0.5}
            />
            <Text tone="muted">{rating + " from verified demo reviews"}</Text>
          </Stack>
        </Card>
      </Grid>

      <Card as="section" padding={5}>
        <Stack gap="md">
          <Grid columns={{ base: 1, md: 3 }} responsiveTo="container" gap="md">
            <Field.Root>
              <Field.Label>Search inventory</Field.Label>
              <InputGroup.Root>
                <InputGroup.Addon aria-hidden="true">SKU</InputGroup.Addon>
                <Field.Control>
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    placeholder="Product or SKU"
                  />
                </Field.Control>
              </InputGroup.Root>
            </Field.Root>
            <Field.Root>
              <Field.Label>Warehouse</Field.Label>
              <Field.Control>
                <Select
                  value={warehouse}
                  onChange={(event) => setWarehouse(event.currentTarget.value)}
                >
                  <option value="east">East warehouse</option>
                  <option value="west">West warehouse</option>
                </Select>
              </Field.Control>
            </Field.Root>
            <Field.Root>
              <Field.Label>Restock threshold</Field.Label>
              <Field.Control>
                <NumberField
                  min={0}
                  max={100}
                  value={threshold ?? ""}
                  onValueChange={setThreshold}
                />
              </Field.Control>
            </Field.Root>
          </Grid>

          <DataGrid
            label="Inventory operations"
            rows={filtered}
            columns={[
              { id: "product", header: "Product", value: (row) => row.product },
              { id: "sku", header: "SKU", value: (row) => row.sku },
              {
                id: "stock",
                header: "Stock",
                value: (row) => row.stock,
                editable: true,
                validateEdit: (value) =>
                  typeof value === "number" && value >= 0
                    ? null
                    : "Stock must be zero or greater.",
              },
              {
                id: "status",
                header: "Status",
                value: (row) => row.status,
                sortable: false,
              },
            ]}
            getRowId={(row) => row.id}
            visibleColumnIds={compact ? ["product"] : undefined}
            selectable
            selectedRowIds={selected}
            onSelectedRowIdsChange={setSelected}
            onCellEditCommit={({ rowId, columnId, value }) => {
              if (columnId !== "stock" || typeof value !== "number") return;
              setRows((current) =>
                current.map((row) =>
                  row.id === rowId ? { ...row, stock: value } : row,
                ),
              );
              setStatus("Inventory quantity updated locally.");
            }}
          />

          {compact ? (
            <Text variant="caption" tone="muted">
              Compact view prioritizes product names. Use a wider canvas for
              stock editing and inventory status columns.
            </Text>
          ) : null}

          <Inline justify="between" wrap gap="md">
            <Inline wrap gap="md">
              <Field.Root>
                <Inline gap="sm">
                  <Field.Control>
                    <Checkbox
                      checked={selected.length > 0}
                      onCheckedChange={(checked) =>
                        setSelected(
                          checked ? filtered.map((row) => row.id) : [],
                        )
                      }
                    />
                  </Field.Control>
                  <Field.Label>Select visible inventory</Field.Label>
                </Inline>
              </Field.Root>
              <Field.Root>
                <Inline gap="sm">
                  <Field.Label>Auto-restock</Field.Label>
                  <Field.Control>
                    <Switch
                      checked={autoRestock}
                      onCheckedChange={setAutoRestock}
                    />
                  </Field.Control>
                </Inline>
              </Field.Root>
            </Inline>
            <Pagination.Root
              page={page}
              pageCount={6}
              onPageChange={setPage}
              aria-label="Order queue pages"
            >
              <Pagination.Previous />
              <Pagination.Range />
              <Pagination.Next />
            </Pagination.Root>
          </Inline>
        </Stack>
      </Card>

      <Grid columns={{ base: 1, md: 2 }} responsiveTo="container" gap="md">
        <Card padding={5}>
          <Stack gap="md">
            <Heading level={4} size="md">
              Order #8421
            </Heading>
            <Inline gap="sm">
              <Avatar alt="" fallback="MC" size="sm" />
              <Stack gap="xs">
                <Text weight="medium">Maya Chen</Text>
                <Text tone="muted" variant="caption">
                  Priority customer · Montreal
                </Text>
              </Stack>
            </Inline>
            <Inline wrap gap="sm">
              <StatusBadge tone="success">Paid</StatusBadge>
              <StatusBadge tone="info">Priority</StatusBadge>
              <ColorSwatch color="#6366f1" />
              <Text variant="caption">Indigo / Large</Text>
            </Inline>
            <Drawer.Root>
              <Drawer.Trigger>Open order details</Drawer.Trigger>
              <Drawer.Popup side="right">
                <Drawer.Title>Order #8421</Drawer.Title>
                <Drawer.Description>
                  Fictional fulfillment detail.
                </Drawer.Description>
                <Stack gap="md">
                  <Text>3 items · $284 · Express shipping</Text>
                  <StatusBadge tone="success">Ready to pick</StatusBadge>
                  <Drawer.Close>Close details</Drawer.Close>
                </Stack>
              </Drawer.Popup>
            </Drawer.Root>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap="md">
            <Heading level={4} size="md">
              Fulfillment policy
            </Heading>
            <Text tone="muted">
              {(warehouse === "east" ? "East" : "West") +
                " warehouse · restock below " +
                (threshold ?? 0) +
                " units"}
            </Text>
            <Rating
              aria-label="Demo customer-quality target"
              value={rating}
              step={0.5}
              onValueChange={setRating}
            />
            <AlertDialog.Root>
              <AlertDialog.Trigger>Cancel demo shipment</AlertDialog.Trigger>
              <AlertDialog.Popup>
                <AlertDialog.Title>
                  Cancel this fictional shipment?
                </AlertDialog.Title>
                <AlertDialog.Description>
                  This only changes local demo state.
                </AlertDialog.Description>
                <Inline wrap gap="sm">
                  <AlertDialog.Cancel>Keep shipment</AlertDialog.Cancel>
                  <AlertDialog.Action
                    onClick={() =>
                      setStatus("Demo shipment cancelled locally.")
                    }
                  >
                    Cancel shipment
                  </AlertDialog.Action>
                </Inline>
              </AlertDialog.Popup>
            </AlertDialog.Root>
          </Stack>
        </Card>
      </Grid>

      <SceneStatus>
        {`${status} Page ${page} · ${selected.length} selected.`}
      </SceneStatus>
    </Stack>
  );
}
