import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from "@varua/icons";
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
} from "@varua/flux-ui";
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
          Check the component name or browse the catalog.
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

function PreviewExample({
  Preview,
  title,
  description,
  previewLayout,
  previewWidth,
  compact,
  resetKey,
  framed,
}: {
  Preview: ComponentExample["Preview"];
  title: string;
  description: string | undefined;
  previewLayout: "center" | "fill";
  previewWidth: "standard" | "wide";
  compact: boolean;
  resetKey: string;
  framed: boolean;
}) {
  const content = (
    <Container size={compact ? "xs" : previewWidth === "wide" ? "full" : "sm"}>
      <Stack
        align={previewLayout === "fill" ? "stretch" : "center"}
        data-compact={compact || undefined}
        className="preview-content"
      >
        <Preview key={resetKey} />
      </Stack>
    </Container>
  );

  if (!framed) return content;

  return (
    <Stack gap="sm">
      <Stack gap={1}>
        <Text as="strong" weight="medium">
          {title}
        </Text>
        {description === undefined ? null : (
          <Text as="p" variant="caption" tone="muted">
            {description}
          </Text>
        )}
      </Stack>
      <Box
        surface="default"
        border="all"
        radius="md"
        paddingBlock="lg"
        paddingInline="md"
      >
        {content}
      </Box>
    </Stack>
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
  const {
    Preview,
    code,
    props,
    notes,
    previewLayout = "center",
    previewWidth = "standard",
    previewTitle = "Default",
    previewDescription,
    variations = [],
  } = example;
  const hasVariations = variations.length > 0;
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
                <Text>
                  {hasVariations
                    ? entry.name + " examples"
                    : "Live " + entry.name}
                </Text>
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
              {hasVariations ? (
                <Stack gap="xl">
                  <PreviewExample
                    Preview={Preview}
                    title={previewTitle}
                    description={previewDescription}
                    previewLayout={previewLayout}
                    previewWidth={previewWidth}
                    compact={compact}
                    resetKey={String(version) + "-primary"}
                    framed
                  />
                  {variations.map((variation, index) => (
                    <PreviewExample
                      key={variation.title}
                      Preview={variation.Preview}
                      title={variation.title}
                      description={variation.description}
                      previewLayout={variation.previewLayout ?? previewLayout}
                      previewWidth={variation.previewWidth ?? previewWidth}
                      compact={compact}
                      resetKey={String(version) + "-" + String(index)}
                      framed
                    />
                  ))}
                </Stack>
              ) : (
                <PreviewExample
                  Preview={Preview}
                  title={previewTitle}
                  description={previewDescription}
                  previewLayout={previewLayout}
                  previewWidth={previewWidth}
                  compact={compact}
                  resetKey={String(version)}
                  framed={false}
                />
              )}
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="code">
          <CodeBlock code={code} label={`${entry.name} example`} />
        </Tabs.Panel>
      </Tabs.Root>
      <Callout tone="info">
        Uses public Flux components. Reset affects only this preview.
      </Callout>
      <Stack as="section" gap="lg">
        <Stack gap="md">
          <Heading level={2} size="lg">
            Public contract
          </Heading>
          <Text as="p" variant="body" tone="muted">
            Generated from public TypeScript APIs. Controller parts render no
            DOM.
          </Text>
          <Callout tone="info">
            Lifecycle: <Code>{publicContract.lifecycle}</Code>. This generated
            inventory lists the public API. Beta APIs may change; stable APIs
            are the published contract.
          </Callout>
          <Text as="p" variant="body" tone="muted">
            Public TypeScript exports:{" "}
            <Code>{publicContract.types.join(", ")}</Code>
            {publicContract.utilities.length === 0 ? null : (
              <>
                {" "}
                · Runtime utilities:{" "}
                <Code>{publicContract.utilities.join(", ")}</Code>
              </>
            )}
          </Text>
          <ScrollArea
            aria-label={`${entry.name} public contract`}
            axis="horizontal"
          >
            <Table.Root>
              <Table.Caption>
                Public parts and customization options.
              </Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Part</Table.ColumnHeader>
                  <Table.ColumnHeader>Customization</Table.ColumnHeader>
                  <Table.ColumnHeader>State model</Table.ColumnHeader>
                  <Table.ColumnHeader>CSS variables</Table.ColumnHeader>
                  <Table.ColumnHeader>Data attributes</Table.ColumnHeader>
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
                        : "None"}
                    </Table.Cell>
                    <Table.Cell>
                      {part.cssVariables.length === 0 ? (
                        "None"
                      ) : (
                        <Code>{part.cssVariables.join(", ")}</Code>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {"dataAttributes" in part ? (
                        <Code>{part.dataAttributes.join(", ")}</Code>
                      ) : (
                        "None"
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
          {"descendantStates" in publicContract ? (
            <>
              <Heading level={3} size="md">
                Descendant state hooks
              </Heading>
              <Text as="p" variant="body" tone="muted">
                These selectors are styling hooks, not public React parts.
              </Text>
              <ScrollArea
                aria-label={`${entry.name} descendant state hooks`}
                axis="horizontal"
              >
                <Table.Root>
                  <Table.Caption>
                    Stable descendant state selectors.
                  </Table.Caption>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Surface</Table.ColumnHeader>
                      <Table.ColumnHeader>Stable selector</Table.ColumnHeader>
                      <Table.ColumnHeader>Data attributes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {publicContract.descendantStates.map((surface) => (
                      <Table.Row key={surface.name}>
                        <Table.RowHeader>
                          <Code>{surface.name}</Code>
                        </Table.RowHeader>
                        <Table.Cell>
                          <Code>{surface.selector}</Code>
                        </Table.Cell>
                        <Table.Cell>
                          <Code>{surface.dataAttributes.join(", ")}</Code>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </ScrollArea>
            </>
          ) : null}
          <Heading level={2} size="lg">
            API highlights
          </Heading>
          <ScrollArea aria-label={`${entry.name} props`} axis="horizontal">
            <Table.Root>
              <Table.Caption>
                Common props. See the public contract for full details.
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
            View TypeScript API ↗
          </Link>
        </Stack>
      </Stack>
      <Stack as="section" gap="lg">
        <Heading level={2} size="lg">
          Usage and accessibility
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
