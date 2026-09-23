import { act } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { Checkbox } from "../components/Checkbox/Checkbox.js";
import { Field } from "../components/Field/Field.js";
import { Input } from "../components/Input/Input.js";
import { ScrollArea } from "../components/ScrollArea/ScrollArea.js";
import { Tabs } from "../components/Tabs/Tabs.js";

function HydrationFixture() {
  return (
    <>
      <Field.Root>
        <Field.Label>Hydrated input</Field.Label>
        <Field.Control>
          <Input defaultValue="preserved" />
        </Field.Control>
        <Field.Description>Hydrated help</Field.Description>
      </Field.Root>
      <Checkbox aria-label="Hydrated checkbox" indeterminate />
      <ScrollArea aria-label="Hydrated region">Contents</ScrollArea>
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Hydrated tabs">
          <Tabs.Tab value="one">First</Tabs.Tab>
          <Tabs.Tab value="two">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>
    </>
  );
}

it("hydrates generated relationships without replacing server DOM", async () => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<HydrationFixture />);
  document.body.append(container);
  const input = container.querySelector("input");
  const describedBy = input?.getAttribute("aria-describedby");
  const onRecoverableError = vi.fn();
  let root: Root | undefined;
  try {
    await act(() => {
      root = hydrateRoot(container, <HydrationFixture />, {
        onRecoverableError,
      });
      return Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector("input")).toBe(input);
    expect(input).toHaveValue("preserved");
    expect(input).toHaveAccessibleDescription("Hydrated help");
    expect(input).toHaveAttribute("aria-describedby", describedBy);
    expect(
      container.querySelector<HTMLInputElement>('[type="checkbox"]')
        ?.indeterminate,
    ).toBe(true);
  } finally {
    await act(() => {
      root?.unmount();
      return Promise.resolve();
    });
    container.remove();
  }
});
