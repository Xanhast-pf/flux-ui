import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Tabs } from "../Tabs/Tabs.js";
import { Overflow } from "./Overflow.js";
const values = ["Overview", "Activity", "Members", "Settings", "History"];
describe("Overflow + Tabs SSR", () => {
  bench("render 100 five-tab collections", () => {
    renderToString(
      <div>
        {Array.from({ length: 100 }, (_, index) => `overflow-${index}`).map(
          (id) => (
            <Overflow key={id}>
              <Tabs.Root defaultValue="Overview">
                <Tabs.List aria-label={id}>
                  {values.map((value) => (
                    <Tabs.Trigger key={value} value={value}>
                      {value}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                {values.map((value) => (
                  <Tabs.Content key={value} value={value}>
                    {value}
                  </Tabs.Content>
                ))}
              </Tabs.Root>
            </Overflow>
          ),
        )}
      </div>,
    );
  });
});
