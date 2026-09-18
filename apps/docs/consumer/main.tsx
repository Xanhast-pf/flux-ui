// Intentionally no docs aliases, docs CSS, source-relative Flux imports, or VE plugin.
import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/reset.css";
import { FluxMarkIcon } from "@flux-ui/icons";
import {
  Avatar,
  AspectRatio,
  Badge,
  CodeBlock,
  Chart,
  DataTable,
  Dialog,
  Drawer,
  IconButton,
  Kbd,
  Knob,
  LevelMeter,
  Link,
  NumberField,
  Skeleton,
  Sparkline,
  SplitPane,
  Toggle,
  tokenizeCode,
  Box,
  Button,
  Card,
  Container,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  Sidebar,
  Slider,
  Stack,
  Tabs,
  Text,
} from "@flux-ui/react";
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ConsumerInteractions } from "./interactions.js";
import { ConsumerTabs } from "./tabs.js";
import { ConsumerRefinements } from "./refinements.js";
interface ConsumerRow {
  id: string;
  value: number;
}
const columns = [
  { id: "value", header: "Value", value: (row: ConsumerRow) => row.value },
];
const rowId = (row: ConsumerRow) => row.id;
function ConsumerExtensions() {
  const rows = useMemo(
    () =>
      Array.from({ length: 10_000 }, (_, index) => ({
        id: `item-${index}`,
        value: index,
      })),
    [],
  );
  const [gain, setGain] = useState(50);
  const [roomy, setRoomy] = useState(false);
  const [split, setSplit] = useState(50);
  const code = 'const literal = "<img src=x onerror=alert(1)>";';
  return (
    <Stack as="section" gap="lg" aria-label="Advanced public components">
      <Heading level={2}>Advanced public components</Heading>
      <Box
        data-testid="edge-padding"
        padding={roomy ? "lg" : "md"}
        paddingInlineEnd="sm"
      >
        Logical padding precedence
      </Box>
      <Box
        data-testid="style-padding"
        padding="md"
        paddingInlineEnd="sm"
        style={{ padding: "3rem" }}
      >
        Consumer padding precedence
      </Box>
      <Button onClick={() => setRoomy((value) => !value)}>
        Change padding fixture
      </Button>
      <CodeBlock
        code={code}
        tokens={tokenizeCode(code, "typescript")}
        language="typescript"
        label="Safe highlighted source"
      />
      <Chart
        label="Consumer chart"
        series={[
          {
            id: "one",
            label: "Sample series",
            data: [
              { x: 0, y: 10 },
              { x: 1, y: null },
              { x: 2, y: 30 },
            ],
          },
        ]}
      />
      <Sparkline label="Consumer trend" values={[0, 1, null, 3, 2]} />
      <Inline gap="lg" align="center">
        <Knob aria-label="Consumer gain" value={gain} onValueChange={setGain} />
        <Slider
          aria-label="Consumer vertical slider"
          orientation="vertical"
          value={gain}
          onChange={(event) => setGain(event.currentTarget.valueAsNumber)}
        />
        <NumberField
          aria-label="Consumer exact gain"
          min={0}
          max={100}
          value={gain}
          onValueChange={(value) => {
            if (value !== null) setGain(Math.max(0, Math.min(100, value)));
          }}
        />
        <LevelMeter
          aria-label="Consumer level"
          min={0}
          max={100}
          value={gain}
          peak={80}
        />
      </Inline>
      <SplitPane
        label="Consumer pane sizes"
        value={split}
        onValueChange={setSplit}
        first={<Text>First pane</Text>}
        second={<Text>Second pane</Text>}
      />
      <DataTable
        label="Consumer dataset"
        rows={rows}
        columns={columns}
        getRowId={rowId}
        selectable
      />
      <Dialog.Root>
        <Dialog.Trigger>Open wrapped dialog</Dialog.Trigger>
        <Dialog.Popup>
          <Stack gap="md">
            <Dialog.Title>Wrapped public dialog</Dialog.Title>
            <Box>
              <Dialog.Description>
                Its description survives Flux wrappers.
              </Dialog.Description>
            </Box>
            <Dialog.Close>Close wrapped dialog</Dialog.Close>
          </Stack>
        </Dialog.Popup>
      </Dialog.Root>
      <Drawer.Root>
        <Drawer.Trigger>Open wrapped drawer</Drawer.Trigger>
        <Drawer.Popup>
          <Stack gap="md">
            <Drawer.Title>Wrapped public drawer</Drawer.Title>
            <Box>
              <Drawer.Description>
                Its description survives Flux wrappers.
              </Drawer.Description>
            </Box>
            <Drawer.Close>Close wrapped drawer</Drawer.Close>
          </Stack>
        </Drawer.Popup>
      </Drawer.Root>
      <Box dir="rtl">
        <Tabs.Root defaultValue="rtl-one">
          <Tabs.List aria-label="RTL tabs" activateOnFocus>
            <Tabs.Tab value="rtl-one">RTL one</Tabs.Tab>
            <Tabs.Tab value="rtl-two">RTL two</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="rtl-one">RTL first</Tabs.Panel>
          <Tabs.Panel value="rtl-two">RTL second</Tabs.Panel>
        </Tabs.Root>
      </Box>
    </Stack>
  );
}
function Consumer() {
  const [page, setPage] = useState("Overview");
  const [count, setCount] = useState(0);
  return (
    <Sidebar.Root>
      <Box as="header" padding="md">
        <Inline justify="between">
          <Sidebar.Toggle>Toggle sidebar</Sidebar.Toggle>
          <FluxMarkIcon title="Flux mark" />
        </Inline>
      </Box>
      <Sidebar.Layout>
        <Sidebar.Panel aria-label="Consumer navigation">
          <Stack gap="md">
            <Sidebar.Close>Close sidebar</Sidebar.Close>
            <Input aria-label="Remembered filter" />
            <Button onClick={() => setPage("Components")}>Change page</Button>
          </Stack>
        </Sidebar.Panel>
        <Sidebar.Content data-testid="consumer-content">
          <Container>
            <Stack as="main" gap="lg" paddingBlock="lg">
              <Heading level={1}>{page}</Heading>
              <Card data-testid="surface">
                <Stack gap="md">
                  <Heading level={2}>Public exports, real CSS</Heading>
                  <Button onClick={() => setCount((value) => value + 1)}>
                    Page action {count}
                  </Button>
                  <Text data-testid="emphasis" italic decoration="underline">
                    Semantic text styling
                  </Text>
                </Stack>
              </Card>
              <Tabs.Root
                defaultValue="outer"
                orientation="vertical"
                appearance="pill"
                size="sm"
              >
                <Tabs.List aria-label="Outer tabs">
                  <Tabs.Tab value="outer">Outer</Tabs.Tab>
                  <Tabs.Tab value="other">Other</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="outer">
                  <Tabs.Root defaultValue="inner-one">
                    <Tabs.List aria-label="Inner tabs" activateOnFocus>
                      <Tabs.Tab value="inner-one">Inner one</Tabs.Tab>
                      <Tabs.Tab value="inner-two">Inner two</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="inner-one">Inner first panel</Tabs.Panel>
                    <Tabs.Panel value="inner-two">
                      Inner second panel
                    </Tabs.Panel>
                  </Tabs.Root>
                </Tabs.Panel>
                <Tabs.Panel value="other">Other panel</Tabs.Panel>
              </Tabs.Root>
              <Field.Root disabled id="outer-field">
                <Field.Label>Disabled outer</Field.Label>
                <Field.Control>
                  <Input />
                </Field.Control>
                <Field.Root id="inner-field">
                  <Field.Label>Enabled inner</Field.Label>
                  <Field.Control>
                    <Input />
                  </Field.Control>
                  <Field.Description>Inner description</Field.Description>
                </Field.Root>
              </Field.Root>
              <Field.Root id="reference-field">
                <Field.Label>Enabled reference</Field.Label>
                <Field.Control>
                  <Input />
                </Field.Control>
              </Field.Root>
              <Stack
                hidden
                data-testid="hidden-stack"
                style={{ display: "flex" }}
              >
                <Button>Hidden stack action</Button>
              </Stack>
              <Inline hidden data-testid="hidden-inline">
                <Button>Hidden inline action</Button>
              </Inline>
              <Grid hidden data-testid="hidden-grid">
                <Button>Hidden grid action</Button>
              </Grid>
              <Field.Root hidden data-testid="hidden-field">
                <Button>Hidden field action</Button>
              </Field.Root>
              <Avatar
                hidden
                data-testid="hidden-avatar"
                alt=""
                fallback={<Button>Hidden avatar action</Button>}
              />
              <Box hidden data-testid="hidden-box">
                <Button>Hidden box action</Button>
              </Box>
              <Button hidden data-hidden-contract="button">
                Hidden direct button
              </Button>
              <IconButton
                hidden
                data-hidden-contract="icon-button"
                aria-label="Hidden icon action"
              >
                <FluxMarkIcon />
              </IconButton>
              <Link
                hidden
                href="#unused"
                variant="navigation"
                data-hidden-contract="link"
              >
                Hidden navigation
              </Link>
              <Toggle hidden data-hidden-contract="toggle">
                Hidden toggle
              </Toggle>
              <Badge hidden data-hidden-contract="badge">
                <Button>Hidden badge child</Button>
              </Badge>
              <Kbd hidden data-hidden-contract="kbd">
                <Button>Hidden keyboard child</Button>
              </Kbd>
              <AspectRatio hidden align="center" data-hidden-contract="aspect">
                <Button>Hidden frame child</Button>
              </AspectRatio>
              <Skeleton hidden data-hidden-contract="skeleton" />
              <Knob
                hidden
                aria-label="Hidden knob"
                data-hidden-contract="knob"
              />
              <Slider
                hidden
                orientation="vertical"
                aria-label="Hidden vertical slider"
                data-hidden-contract="slider"
              />
              <LevelMeter
                hidden
                value={-20}
                aria-label="Hidden level"
                data-hidden-contract="level"
              />
              <SplitPane
                hidden
                label="Hidden panes"
                first="First"
                second="Second"
                data-hidden-contract="split"
              />
              <Stack id="findable">
                <Text>Findable hidden content</Text>
              </Stack>
              <ConsumerExtensions />
              <ConsumerInteractions />
              <ConsumerRefinements />
              <ConsumerTabs />
            </Stack>
          </Container>
        </Sidebar.Content>
      </Sidebar.Layout>
    </Sidebar.Root>
  );
}
const root = document.getElementById("root");
if (root === null) throw new Error("Consumer fixture root is missing.");
createRoot(root).render(<Consumer />);
