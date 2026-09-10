import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Tabs } from "./Tabs.js";

describe("Tabs SSR", () => {
  bench("render 1,000 instances", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => `tabs-${index}`).map(
          (id) => (
            <Tabs.Root defaultValue="one" key={id}>
              <Tabs.List>
                <Tabs.Tab value="one">One</Tabs.Tab>
                <Tabs.Tab value="two">Two</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="one">{id}</Tabs.Panel>
              <Tabs.Panel value="two">Other</Tabs.Panel>
            </Tabs.Root>
          ),
        )}
      </div>,
    );
  });
});
