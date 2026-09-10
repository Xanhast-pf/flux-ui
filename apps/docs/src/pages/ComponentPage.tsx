import {
  Badge,
  Breadcrumbs,
  IconButton,
  Toggle,
  Callout,
  Inline,
  Stack,
  Table,
  Tabs,
} from "@flux-ui/react";
import { lazy, Suspense, useState, type ReactElement } from "react";
import { catalog, type ComponentExample } from "../lib/examples.js";
import { ExampleLoading } from "../ui/ExampleLoading.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
import { formatBytes, REPOSITORY_URL } from "../lib/format.js";
import { health } from "../generated/health.js";
import { CodeBlock } from "../ui/CodeBlock.js";
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
        <h1>Component not found</h1>
        <p>This URL does not match the current catalog.</p>
        <a href="#components">Browse components</a>
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
  const { Preview, code, props, notes } = example;
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
      <div>
        <Inline gap="sm" wrap>
          <Badge>{entry.category}</Badge>
          <Badge tone="accent">{entry.status}</Badge>
        </Inline>
        <h1>{entry.name}</h1>
        <p className="lede">{entry.description}</p>
        <p className="measurement-line">
          Brotli: <strong>{formatBytes(measurement?.brotli ?? null)}</strong> ·{" "}
          {entry.sizeClass} budget:{" "}
          {formatBytes(measurement?.budgetBrotli ?? null)}
        </p>
      </div>
      <Tabs.Root defaultValue="preview">
        <Tabs.List aria-label={`${entry.name} example views`}>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>
          <Tabs.Tab value="code">Code</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="preview">
          <div className="preview-frame">
            <Inline justify="between" wrap className="preview-toolbar">
              <span>Live {entry.name}</span>
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
                  <span aria-hidden="true">↺</span>
                </IconButton>
              </Inline>
            </Inline>
            <div className="preview-stage">
              <div
                className="preview-content"
                data-compact={compact || undefined}
              >
                <Preview key={version} />
              </div>
            </div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="code">
          <CodeBlock code={code} label={`${entry.name} example`} />
        </Tabs.Panel>
      </Tabs.Root>
      <Callout tone="info">
        This preview uses the same public Flux exports as your app. Reset
        remounts only this example; it does not change your theme.
      </Callout>
      <section>
        <Stack gap="md">
          <h2>API at a glance</h2>
          <div
            className="table-scroll"
            role="region"
            aria-label={`${entry.name} props`}
          >
            <Table.Root>
              <Table.Caption>
                Common props and composition points; native element props remain
                available.
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
                      <code>{name}</code>
                    </Table.RowHeader>
                    <Table.Cell>
                      <code>{type}</code>
                    </Table.Cell>
                    <Table.Cell>{description}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
          <a
            href={`${REPOSITORY_URL}/blob/main/packages/react/src/components/${entry.name}/${entry.name}.types.ts`}
          >
            Read the full TypeScript API ↗
          </a>
        </Stack>
      </section>
      <section>
        <h2>Usage & accessibility</h2>
        <ul className="usage-notes">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
      <Inline gap="md" wrap>
        <a href="#components">← All components</a>
        <a href="#playground">Try components together →</a>
      </Inline>
    </Stack>
  );
}
