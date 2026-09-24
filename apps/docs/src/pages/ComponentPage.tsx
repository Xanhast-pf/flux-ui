import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from "@flux-ui/icons";
import {
  StatusBadge,
  Box,
  Breadcrumbs,
  Callout,
  Container,
  Code,
  Heading,
  IconButton,
  Inline,
  Link,
  List,
  PageHeader,
  ScrollArea,
  Stack,
  Table,
  Tabs,
  Text,
  Toggle,
} from "@flux-ui/react";
import { lazy, Suspense, useState, type ReactElement } from "react";
import { publicContracts } from "../generated/contracts.js";
import { health } from "../generated/health.js";
import { catalog, type ComponentExample } from "../lib/examples.js";
import { formatBytes, REPOSITORY_URL } from "../lib/format.js";
import { CodeBlock } from "../ui/CodeBlock.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
import { ExampleLoading } from "../ui/ExampleLoading.js";
// Declare lazy views once, not during render, so state survives parent updates.
const examplePages = new Map<string, ReactElement>(
  catalog.map((entry) => {
    const Example = lazy(async () => {
      const module = await entry.loadExample();
      return {
        default: function LoadedExample() {
          return <ComponentDetail entry={entry} example={module.default} />;
        },
      };
    });
    return [entry.slug, <Example />] as const;
  }),
);
export function ComponentPage({ slug }: { slug: string }) {
  const examplePage = examplePages.get(slug);
  if (examplePage === undefined)
    return (
      <Stack gap="md">
        <Heading level={1} size="xl">
          Component not found
        </Heading>
        <Text as="p" variant="body">
          This URL does not match the current catalog.
        </Text>
        <Link href="#components">Browse components</Link>
      </Stack>
    );
  return (
    <ExampleBoundary key={slug}>
      <Suspense fallback={<ExampleLoading />}>{examplePage}</Suspense>
    </ExampleBoundary>
  );
}
function ComponentDetail({
  entry,
  example,
}: {
  entry: (typeof catalog)[number];
  example: ComponentExample;
}) {
  const [version, setVersion] = useState(0);
  const [compact, setCompact] = useState(false);
  const slug = entry.slug;
  const measurement = health.size.components.find((item) => item.slug === slug);
  const publicContract = publicContracts.find((item) => item.slug === slug);
  if (publicContract === undefined)
    throw new Error(`Missing generated public contract for ${slug}.`);
  const { Preview, code, props, notes, previewLayout = "center" } = example;
  return (
    <Stack gap="lg">
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#components">Components</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>{entry.name}</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
      <PageHeader title={<>{entry.name}</>}>
        <Inline gap="sm" wrap>
          <StatusBadge>{entry.category}</StatusBadge>
          <StatusBadge tone="accent">{entry.status}</StatusBadge>
        </Inline>
        <Text as="p" variant="lead" tone="muted">
          {entry.description}
        </Text>
        <Text as="p" variant="caption" tone="muted">
          Brotli:{" "}
          <Text as="strong" weight="bold">
            {formatBytes(measurement?.brotli ?? null)}
          </Text>{" "}
          · {entry.sizeClass} budget:{" "}
          {formatBytes(measurement?.budgetBrotli ?? null)}
        </Text>
      </PageHeader>
      <Tabs.Root defaultValue="preview">
        <Tabs.List aria-label={`${entry.name} example views`}>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
          <Tabs.Tab value="code">Code</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="preview">
          <Box border="all" radius="lg" className="preview-frame">
            <Box
              surface="default"
              border="bottom"
              paddingInline={4}
              paddingBlock={3}
            >
              <Inline justify="between" wrap>
                <Text>Live {entry.name}</Text>
                <Inline gap="sm" wrap>
                  <Toggle pressed={compact} onPressedChange={setCompact}>
                    Compact preview
                  </Toggle>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    aria-label="Reset example"
                    title="Reset example"
                    onClick={() => {
                      setVersion((value) => value + 1);
                    }}
                  >
                    <RefreshIcon aria-hidden="true" size={16} />
                  </IconButton>
                </Inline>
              </Inline>
            </Box>
            <Box
              surface="subtle"
              paddingBlock="xl"
              paddingInline="md"
              className="preview-stage"
            >
              <Container
                size={
                  compact
                    ? "xs"
                    : example.previewWidth === "wide"
                      ? "full"
                      : "sm"
                }
              >
                <Stack
                  align={previewLayout === "fill" ? "stretch" : "center"}
                  data-compact={compact || undefined}
                  className="preview-content"
                >
                  <Preview key={version} />
                </Stack>
              </Container>
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="code">
          <CodeBlock code={code} label={`${entry.name} example`} />
        </Tabs.Panel>
      </Tabs.Root>
      <Callout tone="info">
        This preview uses the same public Flux exports as your app. Reset
        remounts only this example; it does not change your theme.
      </Callout>
      <Stack as="section" gap="lg">
        <Stack gap="md">
          <Heading level={2} size="lg">
            Public contract
          </Heading>
          <Text as="p" variant="body" tone="muted">
            Generated from the published TypeScript component surface.
            DOM-backed parts keep the listed escape hatches; controller parts
            intentionally render no customizable DOM node.
          </Text>
          <ScrollArea
            aria-label={`${entry.name} public contract`}
            axis="horizontal"
          >
            <Table.Root>
              <Table.Caption>
                Public component parts and customization escape hatches derived
                from TypeScript.
              </Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Part</Table.ColumnHeader>
                  <Table.ColumnHeader>Customization</Table.ColumnHeader>
                  <Table.ColumnHeader>State model</Table.ColumnHeader>
                  <Table.ColumnHeader>CSS variables</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {publicContract.parts.map((part) => (
                  <Table.Row key={part.path}>
                    <Table.RowHeader>
                      <Code>{part.path}</Code>
                    </Table.RowHeader>
                    <Table.Cell>
                      {part.kind === "controller"
                        ? "State/composition only"
                        : part.escapeHatches.join(" · ")}
                    </Table.Cell>
                    <Table.Cell>
                      {"stateModels" in part
                        ? part.stateModels.join(" · ")
                        : "—"}
                    </Table.Cell>
                    <Table.Cell>
                      {part.cssVariables.length === 0 ? (
                        "—"
                      ) : (
                        <Code>{part.cssVariables.join(", ")}</Code>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
          <Heading level={2} size="lg">
            API highlights
          </Heading>
          <ScrollArea aria-label={`${entry.name} props`} axis="horizontal">
            <Table.Root>
              <Table.Caption>
                Curated common props and composition points. The generated
                public contract above and linked TypeScript source are
                authoritative.
              </Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Prop / part</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Purpose</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {props.map(([name, type, description]) => (
                  <Table.Row key={name}>
                    <Table.RowHeader>
                      <Code>{name}</Code>
                    </Table.RowHeader>
                    <Table.Cell>
                      <Code>{type}</Code>
                    </Table.Cell>
                    <Table.Cell>{description}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
          <Link
            href={`${REPOSITORY_URL}/blob/main/packages/react/src/components/${entry.name}/${entry.name}.types.ts`}
          >
            Read the full TypeScript API ↗
          </Link>
        </Stack>
      </Stack>
      <Stack as="section" gap="lg">
        <Heading level={2} size="lg">
          Usage & accessibility
        </Heading>
        <List variant="marker" gap={3}>
          {notes.map((note) => (
            <List.Item key={note}>{note}</List.Item>
          ))}
        </List>
      </Stack>
      <Inline gap="md" wrap>
        <Link href="#components" variant="ghost" tone="neutral" size="sm">
          <ArrowLeftIcon aria-hidden="true" size={14} />
          All components
        </Link>
        <Link href="#playground" variant="ghost" tone="neutral" size="sm">
          Try components together
          <ArrowRightIcon aria-hidden="true" size={14} />
        </Link>
      </Inline>
    </Stack>
  );
}
