import { SearchIcon } from "@flux-ui/icons";
import {
  Avatar,
  Badge,
  Button,
  Callout,
  Card,
  Chart,
  Combobox,
  DataTable,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  InputGroup,
  Popover,
  ScrollArea,
  Select,
  Skeleton,
  Stack,
  Stat,
  Table,
  Tag,
  Text,
  Textarea,
  useToast,
  type DataColumn,
} from "@flux-ui/react";
import { useMemo, useRef, useState } from "react";
import { downloadText } from "../../lib/download.js";
import { formatMoney } from "../model.js";
import {
  filterTransactions,
  invitationError,
  ledgerCsv,
  ledgerTotals,
  transactions,
  type Transaction,
  type Workspace,
} from "./finance.model.js";
const rowId = (row: Transaction) => row.id;
export function FinanceTransactions({ workspace }: { workspace: Workspace }) {
  const searchInput = useRef<HTMLInputElement>(null);
  const statusTrigger = useRef<HTMLButtonElement>(null);
  const [rows, setRows] = useState<readonly Transaction[]>(transactions);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [phase, setPhase] = useState<"ready" | "loading" | "error">("ready");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { notify } = useToast();
  const visible = useMemo(
    () => filterTransactions(rows, workspace, query, status),
    [rows, workspace, query, status],
  );
  const totals = ledgerTotals(visible);
  const selectedVisible = selected.filter((id) =>
    visible.some((row) => row.id === id),
  );
  const editing = rows.find((row) => row.id === editingId);
  const series = useMemo(
    () => [
      {
        id: "loaded",
        label: "Filtered transaction amounts",
        data: visible
          .slice()
          .reverse()
          .map((row, x) => ({ x, y: row.cents / 100 })),
      },
    ],
    [visible],
  );
  const columns: readonly DataColumn<Transaction>[] = [
    {
      id: "customer",
      header: "Customer / merchant",
      value: (row) => row.customer,
      renderCell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          tone="neutral"
          onClick={() => {
            setEditingId(row.id);
            setNote(row.note);
            setInvalid(false);
          }}
        >
          {row.customer}
        </Button>
      ),
    },
    { id: "reference", header: "Reference", value: (row) => row.id },
    { id: "date", header: "Date", value: (row) => row.date },
    {
      id: "amount",
      header: "Amount",
      value: (row) => row.cents,
      renderCell: (row) => <Text numeric>{formatMoney(row.cents)}</Text>,
    },
    {
      id: "status",
      header: "Status",
      value: (row) => row.status,
      renderCell: (row) => <Badge>{row.status}</Badge>,
    },
    {
      id: "reviewed",
      header: "Review",
      value: (row) => (row.reviewed ? "Reviewed" : "Needs review"),
    },
  ];
  function saveNote() {
    if (editing === undefined) return;
    const next = note.trim();
    if (next.length === 0 || next.length > 140) {
      setInvalid(true);
      return;
    }
    const previous = editing;
    setRows((current) =>
      current.map((row) =>
        row.id === previous.id ? { ...row, note: next } : row,
      ),
    );
    setEditingId(null);
    notify({
      title: "Transaction note saved",
      description: `${previous.id} was updated in this demo only.`,
      tone: "success",
      action: {
        label: "Undo note",
        onClick: () =>
          setRows((current) =>
            current.map((row) =>
              row.id === previous.id && row.note === next
                ? { ...row, note: previous.note }
                : row,
            ),
          ),
      },
    });
  }
  return (
    <Stack gap="lg">
      <Inline justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={3} size="md">
            Transactions
          </Heading>
          <Text tone="muted" variant="caption">
            Inspect a record, add a note, or export the filtered ledger.
          </Text>
        </Stack>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger size="sm" variant="outline" tone="neutral">
            Ledger actions
          </DropdownMenu.Trigger>
          <DropdownMenu.Popup aria-label="Ledger actions">
            <DropdownMenu.Item
              disabled={visible.length === 0}
              onSelect={() => {
                downloadText(
                  ledgerCsv(visible),
                  "folio-filtered-ledger.csv",
                  "text/csv;charset=utf-8",
                );
                notify({
                  title: "Ledger exported",
                  description: `${visible.length} fictional rows. No private data or network request.`,
                });
              }}
            >
              Export filtered CSV
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>Explore interface states</DropdownMenu.Label>
            <DropdownMenu.Item onSelect={() => setPhase("loading")}>
              Simulate loading
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => setPhase("error")}>
              Simulate connection error
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                setPhase("ready");
                setQuery("");
                setStatus("all");
              }}
            >
              Restore loaded data
            </DropdownMenu.Item>
          </DropdownMenu.Popup>
        </DropdownMenu.Root>
      </Inline>
      <Grid columns={{ base: 1, md: 3 }} responsiveTo="container" gap="md">
        <Card>
          <Stat
            label="Filtered money in"
            value={formatMoney(totals.incoming)}
            note="Fictional USD"
          />
        </Card>
        <Card>
          <Stat
            label="Filtered money out"
            value={formatMoney(totals.outgoing)}
            note="Fictional USD"
          />
        </Card>
        <Card>
          <Stat
            label="Filtered net"
            value={formatMoney(totals.net)}
            note={`${visible.length} loaded records`}
          />
        </Card>
      </Grid>
      <Card>
        <Stack gap="md">
          <Grid
            columns={{ base: 1, md: 2 }}
            responsiveTo="container"
            gap="md"
            align="end"
          >
            <Field.Root description="Search customers, references, categories, or saved notes.">
              <Field.Label>Search transactions</Field.Label>
              <InputGroup.Root>
                <InputGroup.Addon aria-hidden="true">
                  <SearchIcon size={16} />
                </InputGroup.Addon>
                <Field.Control>
                  <InputGroup.Input
                    ref={searchInput}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.currentTarget.value)}
                    placeholder="Find a transaction…"
                  />
                </Field.Control>
              </InputGroup.Root>
            </Field.Root>
            <Inline wrap gap="sm">
              <Popover.Root>
                <Popover.Trigger
                  ref={statusTrigger}
                  size="sm"
                  variant="outline"
                  tone="neutral"
                >
                  Filter status
                </Popover.Trigger>
                <Popover.Popup aria-label="Transaction status filter">
                  <Stack gap="md">
                    <Field.Root>
                      <Field.Label>Transaction status</Field.Label>
                      <Field.Control>
                        <Select
                          value={status}
                          onChange={(event) =>
                            setStatus(event.currentTarget.value)
                          }
                        >
                          <option value="all">All statuses</option>
                          <option value="Settled">Settled</option>
                          <option value="Pending">Pending</option>
                        </Select>
                      </Field.Control>
                    </Field.Root>
                    <Popover.Close size="sm">Apply filter</Popover.Close>
                  </Stack>
                </Popover.Popup>
              </Popover.Root>
              <Button
                size="sm"
                variant="outline"
                tone="neutral"
                disabled={selectedVisible.length === 0}
                onClick={() => {
                  setRows((current) =>
                    current.map((row) =>
                      selectedVisible.includes(row.id)
                        ? { ...row, reviewed: true }
                        : row,
                    ),
                  );
                  notify({
                    title: "Review complete",
                    description: `${selectedVisible.length} selected records marked reviewed.`,
                    tone: "success",
                  });
                  setSelected([]);
                }}
              >
                Mark selected as reviewed ({selectedVisible.length})
              </Button>
            </Inline>
          </Grid>
          <Inline wrap gap="sm">
            {query.length > 0 ? (
              <Tag
                onRemove={() => {
                  searchInput.current?.focus();
                  setQuery("");
                }}
                removeLabel="Clear transaction search"
              >
                Search: {query}
              </Tag>
            ) : null}
            {status !== "all" ? (
              <Tag
                onRemove={() => {
                  statusTrigger.current?.focus();
                  setStatus("all");
                }}
                removeLabel="Clear status filter"
              >
                {status}
              </Tag>
            ) : null}
          </Inline>
          {phase === "loading" ? (
            <Stack gap="md" aria-busy="true">
              <Text role="status">
                Simulated ledger loading. No request is being made.
              </Text>
              <Skeleton />
              <Skeleton />
              <Button onClick={() => setPhase("ready")}>
                Finish simulated load
              </Button>
            </Stack>
          ) : phase === "error" ? (
            <Callout tone="danger">
              <Stack gap="sm">
                <Text as="strong">Simulated connection error</Text>
                <Text>Your local edits are safe.</Text>
                <Button onClick={() => setPhase("ready")}>
                  Retry demo load
                </Button>
              </Stack>
            </Callout>
          ) : visible.length === 0 ? (
            <EmptyState
              title="No matching transactions"
              description="Try another customer or clear the current filters."
            >
              <Button
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Clear ledger filters
              </Button>
            </EmptyState>
          ) : (
            <DataTable
              label="Folio filtered ledger"
              rows={visible}
              columns={columns}
              getRowId={rowId}
              height={320}
              rowHeight={52}
              selectable
              selectedRowIds={selectedVisible}
              onSelectionChange={setSelected}
              defaultSorting={{ columnId: "date", direction: "descending" }}
            />
          )}
        </Stack>
      </Card>
      {phase === "ready" && visible.length > 0 ? (
        <Card>
          <Chart
            label="Filtered transaction distribution"
            description="The same filtered records as the ledger, in reverse fixture order. This is not a forecast."
            series={series}
            type="bar"
            formatX={(value) =>
              visible[visible.length - value - 1]?.id ?? "Record"
            }
            formatY={(value) => formatMoney(value * 100)}
          />
        </Card>
      ) : null}
      <Drawer.Root
        open={editing !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
      >
        <Drawer.Popup aria-label="Transaction details">
          <Drawer.Title>Transaction details</Drawer.Title>
          <Drawer.Description>
            Update a fictional transaction note. Amounts cannot be moved or paid
            here.
          </Drawer.Description>
          {editing !== undefined ? (
            <Stack
              as="form"
              noValidate
              gap="md"
              onSubmit={(event) => {
                event.preventDefault();
                saveNote();
              }}
            >
              <Heading level={4} size="sm">
                {editing.customer}
              </Heading>
              <Text numeric>
                {editing.id} · {formatMoney(editing.cents)} · {editing.status}
              </Text>
              <Field.Root
                invalid={invalid}
                required
                description="A short note, up to 140 characters."
                error="Enter between 1 and 140 non-blank characters."
              >
                <Field.Label>Transaction note</Field.Label>
                <Field.Control>
                  <Textarea
                    value={note}
                    maxLength={140}
                    onChange={(event) => {
                      setNote(event.currentTarget.value);
                      setInvalid(false);
                    }}
                  />
                </Field.Control>
              </Field.Root>
              <Inline wrap gap="sm">
                <Drawer.Close>Cancel editing</Drawer.Close>
                <Button type="submit">Save transaction note</Button>
              </Inline>
            </Stack>
          ) : null}
        </Drawer.Popup>
      </Drawer.Root>
    </Stack>
  );
}
interface Member {
  email: string;
  name: string;
  role: string;
  status: string;
}
const members: readonly Member[] = [
  {
    email: "alex@example.test",
    name: "Alex Morgan",
    role: "Owner",
    status: "Active",
  },
  {
    email: "sam@example.test",
    name: "Sam Rivera",
    role: "Admin",
    status: "Active",
  },
  {
    email: "jordan@example.test",
    name: "Jordan Lee",
    role: "Member",
    status: "Active",
  },
];
const roles = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Viewer", label: "Viewer" },
];
export function FinanceTeam() {
  const [people, setPeople] = useState(members);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>("Member");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  return (
    <Stack gap="lg">
      <Inline justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={3} size="md">
            Your team
          </Heading>
          <Text tone="muted">Small teams, clear permissions.</Text>
        </Stack>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>Invite teammate</Dialog.Trigger>
          <Dialog.Popup>
            <Dialog.Title>Invite a teammate</Dialog.Title>
            <Dialog.Description>
              This records a local demo invitation. No email is sent.
            </Dialog.Description>
            <Stack
              as="form"
              noValidate
              gap="md"
              onSubmit={(event) => {
                event.preventDefault();
                const message = invitationError(
                  email,
                  role,
                  people.map((person) => person.email),
                );
                setError(message);
                if (message !== null || role === null) return;
                const normalized = email.trim().toLocaleLowerCase();
                setPeople((current) => [
                  ...current,
                  {
                    email: normalized,
                    name: normalized,
                    role,
                    status: "Invited",
                  },
                ]);
                setOpen(false);
                setEmail("");
                notify({
                  title: "Demo invitation recorded",
                  description: `${normalized} · ${role}. No email was sent.`,
                  tone: "success",
                });
              }}
            >
              <Field.Root
                required
                invalid={error !== null}
                error={error}
                description="Use a fictional email; this example stays in your browser."
              >
                <Field.Label>Teammate email</Field.Label>
                <Field.Control>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                      setError(null);
                    }}
                    placeholder="name@example.test"
                  />
                </Field.Control>
              </Field.Root>
              <Field.Root
                required
                description="Type to search the available workspace roles."
              >
                <Field.Label>Workspace role</Field.Label>
                <Field.Control>
                  <Combobox
                    options={roles}
                    value={role}
                    onValueChange={setRole}
                    listLabel="Workspace roles"
                  />
                </Field.Control>
              </Field.Root>
              <Inline gap="sm" wrap>
                <Dialog.Close>Cancel invitation</Dialog.Close>
                <Button type="submit">Record invitation</Button>
              </Inline>
            </Stack>
          </Dialog.Popup>
        </Dialog.Root>
      </Inline>
      <Card>
        <ScrollArea aria-label="Workspace members" axis="horizontal">
          <Table.Root>
            <Table.Caption>Folio demo workspace members</Table.Caption>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Person</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {people.map((person) => (
                <Table.Row key={person.email}>
                  <Table.RowHeader>
                    <Inline gap="sm" wrap>
                      <Avatar
                        alt=""
                        fallback={person.name.slice(0, 1)}
                        size="sm"
                      />
                      <Text>{person.name}</Text>
                    </Inline>
                  </Table.RowHeader>
                  <Table.Cell>{person.role}</Table.Cell>
                  <Table.Cell>
                    <Badge>{person.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </Card>
    </Stack>
  );
}
