export type Workspace = "north" | "fieldwork";
export type TransactionStatus = "Settled" | "Pending";
export interface Transaction {
  id: string;
  workspace: Workspace;
  customer: string;
  date: string;
  cents: number;
  category: string;
  status: TransactionStatus;
  note: string;
  reviewed: boolean;
}
export const transactions: readonly Transaction[] = [
  {
    id: "F-1042",
    workspace: "north",
    customer: "Studio North",
    date: "2026-09-12",
    cents: 480000,
    category: "Client payment",
    status: "Settled",
    note: "Brand system, final milestone",
    reviewed: false,
  },
  {
    id: "F-1041",
    workspace: "north",
    customer: "Acme Creative",
    date: "2026-09-11",
    cents: 240000,
    category: "Client payment",
    status: "Settled",
    note: "September retainer",
    reviewed: true,
  },
  {
    id: "F-1040",
    workspace: "north",
    customer: "Workspace",
    date: "2026-09-10",
    cents: -12000,
    category: "Software",
    status: "Settled",
    note: "Team subscription",
    reviewed: false,
  },
  {
    id: "F-1039",
    workspace: "north",
    customer: "Objects Studio",
    date: "2026-09-09",
    cents: 165000,
    category: "Client payment",
    status: "Pending",
    note: "Packaging exploration",
    reviewed: false,
  },
  {
    id: "F-1038",
    workspace: "north",
    customer: "Rail Collective",
    date: "2026-09-08",
    cents: -8600,
    category: "Travel",
    status: "Settled",
    note: "Client workshop",
    reviewed: false,
  },
  {
    id: "F-1037",
    workspace: "north",
    customer: "Cloud Notes",
    date: "2026-09-07",
    cents: -2400,
    category: "Software",
    status: "Pending",
    note: "Shared research library",
    reviewed: false,
  },
  {
    id: "F-1036",
    workspace: "north",
    customer: "Gather",
    date: "2026-09-06",
    cents: 320000,
    category: "Client payment",
    status: "Settled",
    note: "Community product sprint",
    reviewed: true,
  },
  {
    id: "W-208",
    workspace: "fieldwork",
    customer: "Fieldwork Films",
    date: "2026-09-12",
    cents: 720000,
    category: "Client payment",
    status: "Settled",
    note: "Documentary edit",
    reviewed: false,
  },
  {
    id: "W-207",
    workspace: "fieldwork",
    customer: "Sound Library",
    date: "2026-09-11",
    cents: -8900,
    category: "Software",
    status: "Settled",
    note: "Licensed production assets",
    reviewed: false,
  },
  {
    id: "W-206",
    workspace: "fieldwork",
    customer: "The Long Way",
    date: "2026-09-10",
    cents: 260000,
    category: "Client payment",
    status: "Pending",
    note: "Location project deposit",
    reviewed: false,
  },
];
export function filterTransactions(
  rows: readonly Transaction[],
  workspace: Workspace,
  query: string,
  status: string,
) {
  const needle = query.trim().toLocaleLowerCase();
  return rows.filter(
    (row) =>
      row.workspace === workspace &&
      (status === "all" || row.status === status) &&
      `${row.id} ${row.customer} ${row.category} ${row.note}`
        .toLocaleLowerCase()
        .includes(needle),
  );
}
export function ledgerTotals(rows: readonly Transaction[]) {
  return rows.reduce(
    (sum, row) => ({
      incoming: sum.incoming + Math.max(0, row.cents),
      outgoing: sum.outgoing + Math.max(0, -row.cents),
      net: sum.net + row.cents,
    }),
    { incoming: 0, outgoing: 0, net: 0 },
  );
}
function csvText(value: string): string {
  // A note/name is user-editable. Keep spreadsheet apps from interpreting it as a formula.
  const safe = /^(?:[\t\r\n]|\s*[=+\-@])/u.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function ledgerCsv(rows: readonly Transaction[]): string {
  return (
    [
      "Reference,Customer,Date,Amount USD,Status,Note",
      ...rows.map((row) =>
        [
          csvText(row.id),
          csvText(row.customer),
          csvText(row.date),
          (row.cents / 100).toFixed(2),
          csvText(row.status),
          csvText(row.note),
        ].join(","),
      ),
    ].join("\r\n") + "\r\n"
  );
}
export function invitationError(
  email: string,
  role: string | null,
  existing: readonly string[],
): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim()))
    return "Enter a valid work email address.";
  if (role !== "Admin" && role !== "Member" && role !== "Viewer")
    return "Choose a workspace role.";
  if (
    existing.some(
      (value) => value.toLocaleLowerCase() === email.trim().toLocaleLowerCase(),
    )
  )
    return "This person is already in the workspace.";
  return null;
}
