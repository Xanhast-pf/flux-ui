import { Fragment } from "react";
import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Table } from "./Table.js";
const ids = Array.from({ length: 1000 }, (_, index) => `sample-${index}`);
describe("Table SSR", () => {
  bench("native 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <table>
              <caption>Release checks</caption>
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Accessibility</th>
                  <td>Ready</td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        ))}
      </>,
    );
  });
  bench("Flux 1,000 instances", () => {
    renderToString(
      <>
        {ids.map((id) => (
          <Fragment key={id}>
            <Table.Root>
              <Table.Caption>Release checks</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Check</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.RowHeader>Accessibility</Table.RowHeader>
                  <Table.Cell>Ready</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Fragment>
        ))}
      </>,
    );
  });
});
