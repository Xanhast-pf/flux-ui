import { useState } from "react";
import { ArrowUpRightIcon, LockIcon, UnlockIcon } from "@flux-ui/icons";
import { Button, Table, Toggle, ToggleGroup } from "@flux-ui/react";
import { Metric, SceneHeader, SceneStatus } from "../SceneParts.js";
import { formatMoney } from "../model.js";
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
    <div className="product-scene finance-scene" data-scene="finance">
      <SceneHeader brand="folio" context="Your business, in balance">
        <span className="scene-session">Personal workspace</span>
        <span
          className="scene-avatar"
          role="img"
          aria-label="Demo account: Alex"
        >
          A
        </span>
      </SceneHeader>
      <div className="finance-layout">
        <section
          className="scene-panel finance-cashflow"
          aria-label="Cash flow overview"
        >
          <div className="scene-heading-row">
            <div>
              <p className="scene-kicker">The bigger picture</p>
              <h3>Money in motion.</h3>
            </div>
            <ToggleGroup.Root
              type="single"
              value={period}
              onValueChange={(value) => {
                if (value === "week" || value === "month") setPeriod(value);
              }}
              aria-label="Cash flow period"
            >
              <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
              <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          <div className="finance-amount">
            <strong>{data.total}</strong>
            <span className="scene-positive">
              <ArrowUpRightIcon size={14} /> {data.change}
            </span>
          </div>
          <p className="scene-muted">
            Income · {data.label.toLowerCase()} · fictional USD
          </p>
          <figure className="cashflow-chart">
            <svg
              viewBox="0 0 440 175"
              preserveAspectRatio="none"
              role="img"
              aria-label={`${data.label} sample cash flow: ${data.total}, ${data.change} versus the previous period.`}
            >
              <path
                className="chart-grid"
                d="M0 20H440 M0 70H440 M0 120H440 M0 170H440"
              />
              <polygon
                points={`0,175 ${data.points} 440,175`}
                className="chart-area"
              />
              <polyline points={data.points} className="chart-line" />
            </svg>
            <figcaption>
              {data.ticks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </figcaption>
          </figure>
          <div className="finance-metrics">
            <Metric label="Money in" value={data.total} note="Sample income" />
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
          </div>
        </section>
        <div className="finance-side">
          <section className="folio-card" aria-label="Demo payment card">
            <span>folio / business</span>
            <div className="card-orbit" aria-hidden="true" />
            <span className="card-chip" aria-hidden="true" />
            <strong>•••• &nbsp; 4242</strong>
            <div>
              <span>Alex Morgan</span>
              <span>{frozen ? "Frozen" : "Active"}</span>
            </div>
          </section>
          <section className="scene-panel finance-balance">
            <p className="scene-kicker">Available balance</p>
            <strong>{formatMoney(12458000 - (paid ? 220000 : 0))}</strong>
            <p className="scene-muted">Sample account · USD</p>
            <div className="scene-button-row">
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
              >
                {frozen ? <LockIcon size={14} /> : <UnlockIcon size={14} />}{" "}
                {frozen ? "Frozen" : "Freeze"}
              </Toggle>
            </div>
            <SceneStatus>
              {paid
                ? "Demo payout of $2,200 recorded locally. No money moved."
                : "Try the controls. This is a fictional account."}
            </SceneStatus>
          </section>
        </div>
        <section
          className="scene-panel finance-activity"
          aria-label="Recent demo activity"
        >
          <div className="scene-heading-row">
            <h3>Recent activity</h3>
            <span className="scene-muted">Sample transactions</span>
          </div>
          <div
            className="scene-table-scroll"
            role="region"
            aria-label="Fictional transactions"
          >
            <Table.Root>
              <Table.Caption className="showcase-sr-only">
                Recent fictional transactions in USD
              </Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Transaction</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Amount</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {activity.map((row) => (
                  <Table.Row key={row.name}>
                    <Table.RowHeader>
                      <span className="transaction-name">
                        <span className="transaction-avatar" aria-hidden="true">
                          {row.initials}
                        </span>
                        <span>
                          {row.name}
                          <small>{row.detail}</small>
                        </span>
                      </span>
                    </Table.RowHeader>
                    <Table.Cell>{row.date}</Table.Cell>
                    <Table.Cell className="transaction-amount">
                      {row.amount}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        </section>
      </div>
    </div>
  );
}
