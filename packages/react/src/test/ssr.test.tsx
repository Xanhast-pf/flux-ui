// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Box,
  Button,
  CodeBlock,
  DataTable,
  Dialog,
  Field,
  Grid,
  Input,
  Knob,
  ScrollArea,
  Tabs,
} from "../index.js";

// Importing the public source root also loads every component module. This
// exercises SSR, not an RSC boundary or the published/bundled package.
describe("server rendering without browser globals", () => {
  it("renders static and interactive exports without a document", () => {
    expect(typeof document).toBe("undefined");
    const markup = renderToString(
      <Box as="main" padding="md">
        <Grid columns={2}>
          <Button>Server button</Button>
          <Knob aria-label="Server gain" defaultValue={30} />
        </Grid>
        <ScrollArea aria-label="Server overflow">Contents</ScrollArea>
        <CodeBlock code={'const literal = "<script>";'} copyable={false} />
        <Dialog.Root>
          <Dialog.Popup>
            <Dialog.Title>Server dialog</Dialog.Title>
          </Dialog.Popup>
        </Dialog.Root>
      </Box>,
    );
    expect(markup).toContain('role="slider"');
    expect(markup).toContain('aria-valuenow="30"');
    expect(markup).toContain("&lt;script&gt;");
    expect(markup).not.toContain("<script>");
  });

  it("keeps direct compound field and tab relationships in server HTML", () => {
    const markup = renderToString(
      <>
        <Field.Root controlId="server-input">
          <Field.Label>Server label</Field.Label>
          <Field.Control>
            <Input />
          </Field.Control>
          <Field.Description>Server help</Field.Description>
        </Field.Root>
        <Tabs.Root defaultValue="one">
          <Tabs.List aria-label="Server tabs">
            <Tabs.Tab value="one">First</Tabs.Tab>
            <Tabs.Tab value="two">Second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="one">First content</Tabs.Panel>
          <Tabs.Panel value="two">Second content</Tabs.Panel>
        </Tabs.Root>
      </>,
    );
    expect(markup).toContain('for="server-input"');
    expect(markup).toContain('aria-describedby="server-input-description"');
    expect(markup).toContain('aria-selected="true"');
    expect(markup).toContain('aria-selected="false"');
    expect(markup).toContain('hidden=""');
  });

  it("keeps a large server-rendered table bounded", () => {
    const rows = Array.from({ length: 10_000 }, (_, index) => ({
      id: String(index),
      value: index,
    }));
    const markup = renderToString(
      <DataTable
        label="Server rows"
        rows={rows}
        getRowId={(row) => row.id}
        columns={[{ id: "value", header: "Value", value: (row) => row.value }]}
      />,
    );
    expect(markup).toContain("10,000");
    expect(markup).toContain('aria-rowcount="10001"');
    expect(markup.match(/data-row-id=/g)?.length).toBeLessThan(30);
  });
});
