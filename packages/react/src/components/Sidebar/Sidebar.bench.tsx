import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Sidebar } from "./Sidebar.js";
describe("Sidebar SSR", () => {
  bench("render a persistent shell", () => {
    renderToString(
      <Sidebar.Root defaultOpen>
        <Sidebar.Toggle>Navigation</Sidebar.Toggle>
        <Sidebar.Layout>
          <Sidebar.Panel aria-label="Navigation">Links</Sidebar.Panel>
          <Sidebar.Content>Content</Sidebar.Content>
        </Sidebar.Layout>
      </Sidebar.Root>,
    );
  });
});
