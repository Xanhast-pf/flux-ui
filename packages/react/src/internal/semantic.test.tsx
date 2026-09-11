import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Card } from "../components/Card/Card.js";
import { Container } from "../components/Container/Container.js";
import { Grid } from "../components/Grid/Grid.js";
import { Inline } from "../components/Inline/Inline.js";
import { Stack } from "../components/Stack/Stack.js";
import { Table } from "../components/Table/Table.js";
describe("Semantic composition", () => {
  it("does not require extra wrappers to recover semantic elements", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Container as="main" ref={ref} query>
        <Stack as="article" gap={3}>
          <Inline as="header" gap={5}>
            Header
          </Inline>
          <Card as="section" aria-label="Details" padding={6}>
            Content
          </Card>
          <Grid as="ul" columns={{ base: 1, md: 2 }} responsiveTo="container">
            <Grid.Item as="li">Item</Grid.Item>
          </Grid>
        </Stack>
      </Container>,
    );
    expect(screen.getByRole("main")).toBe(ref.current);
    expect(screen.getByRole("article").children).toHaveLength(3);
    expect(screen.getByRole("region", { name: "Details" }).tagName).toBe(
      "SECTION",
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-r", "container");
    expect(screen.getByRole("listitem").tagName).toBe("LI");
  });
  it("retains a native table caption in compact, visually-hidden composition", () => {
    render(
      <Table.Root density="compact">
        <Table.Caption visuallyHidden>Transactions</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>$42</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const table = screen.getByRole("table", { name: "Transactions" });
    expect(table.firstElementChild?.tagName).toBe("CAPTION");
    expect(screen.getByRole("columnheader")).toHaveAttribute("scope", "col");
  });
});
