import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  DataTable,
  Field,
  Heading,
  Inline,
  InputGroup,
  Knob,
  NumberField,
  Slider,
  Stack,
  Tabs,
  Text,
} from "@flux-ui/react";
interface Row {
  id: string;
  label: string;
}
const rows: Row[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];
const columns = [
  { id: "label", header: "Name", value: (row: Row) => row.label },
];
const getRowId = (row: Row) => row.id;
const tabs = [
  "Overview",
  "Transactions",
  "Team members",
  "Integrations",
  "Permissions",
  "Audit history",
];
export function ConsumerRefinements() {
  const [level, setLevel] = useState(70);
  const [requests, setRequests] = useState(0);
  const [amount, setAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState("");
  const [knob, setKnob] = useState(75);
  const [commits, setCommits] = useState(0);
  const [section, setSection] = useState("Overview");
  const [wide, setWide] = useState(false);
  const [automatic, setAutomatic] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [lastAvailable, setLastAvailable] = useState(true);
  return (
    <Stack as="section" gap="lg" aria-label="Refined public controls">
      <Heading level={2}>Refined public controls</Heading>
      <Slider
        aria-label="Resettable consumer range"
        value={level}
        onValueChange={setLevel}
        resetValue={25}
        min={0}
        max={100}
        step={5}
      />
      <Slider
        aria-label="Vertical consumer range"
        orientation="vertical"
        appearance="custom"
        defaultValue={30}
        min={0}
        max={100}
        step={10}
        style={{
          "--flux-slider-length": "12rem",
          "--flux-slider-thumb-inline-size": "2rem",
          "--flux-slider-thumb-radius": "0.25rem",
        }}
      />
      <Slider
        aria-label="Parent-owned range"
        value={75}
        resetValue={20}
        onValueChange={() => setRequests((value) => value + 1)}
      />
      <Text data-testid="reset-requests">{requests}</Text>
      <Inline align="center" gap="md" wrap>
        <Knob
          aria-label="Resettable consumer knob"
          size="sm"
          value={knob}
          onValueChange={setKnob}
          resetValue={40}
          step={5}
          onValueCommit={() => setCommits((value) => value + 1)}
        />
        <Knob aria-label="Medium consumer knob" size="md" />
        <Knob aria-label="Large consumer knob" size="lg" />
        <Knob
          aria-label="Custom consumer knob"
          style={{
            "--flux-knob-size": "6rem",
          }}
        />
      </Inline>
      <Text data-testid="knob-commits">{commits}</Text>
      <Stack
        as="form"
        aria-label="Grouped number form"
        gap="md"
        onSubmit={(event) => {
          event.preventDefault();
          const amountEntry = new FormData(event.currentTarget).get("amount");
          setSubmitted(typeof amountEntry === "string" ? amountEntry : "");
        }}
      >
        <Field.Root description="The amount is optional.">
          <Field.Label>Consumer amount</Field.Label>
          <InputGroup.Root data-testid="consumer-number-group">
            <InputGroup.Addon>$</InputGroup.Addon>
            <Field.Control>
              <NumberField
                name="amount"
                value={amount ?? ""}
                min={0}
                step={0.5}
                onValueChange={setAmount}
              />
            </Field.Control>
            <InputGroup.Addon>CAD</InputGroup.Addon>
          </InputGroup.Root>
        </Field.Root>
        <Button type="submit">Submit grouped amount</Button>
        <Text data-testid="submitted-amount">{submitted}</Text>
      </Stack>
      <Checkbox aria-label="Reference checkbox" defaultChecked />
      <DataTable
        label="Themed selection"
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        selectable
        height={160}
      />
      <Inline gap="sm" wrap>
        <Button onClick={() => setWide((value) => !value)}>
          Resize consumer tabs
        </Button>
        <Button onClick={() => setAutomatic((value) => !value)}>
          Toggle automatic tabs
        </Button>
        <Button onClick={() => setRtl((value) => !value)}>
          Toggle RTL tabs
        </Button>
        <Button onClick={() => setLastAvailable((value) => !value)}>
          Toggle final tab availability
        </Button>
      </Inline>
      <Box
        style={{ inlineSize: wide ? "100%" : "16rem", maxInlineSize: "100%" }}
        data-testid="consumer-tabs-width"
        dir={rtl ? "rtl" : "ltr"}
      >
        <Tabs.Root value={section} onValueChange={setSection}>
          <Tabs.List aria-label="Consumer tabs" activateOnFocus={automatic}>
            {tabs.map((label) => (
              <Tabs.Tab
                key={label}
                value={label}
                disabled={label === "Audit history" && !lastAvailable}
              >
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {tabs.map((label) => (
            <Tabs.Panel key={label} value={label}>
              {label} consumer panel
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </Box>
      <Button>After consumer tabs</Button>
    </Stack>
  );
}
