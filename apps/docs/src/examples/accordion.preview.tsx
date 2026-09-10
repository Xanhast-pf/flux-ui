import { Accordion } from "@flux-ui/react";
export default function Example() {
  return (
    <Accordion.Root>
      <Accordion.Item open>
        <Accordion.Trigger>
          Does this need JavaScript to expand?
        </Accordion.Trigger>
        <Accordion.Content>
          No. The details and summary elements handle disclosure.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>Can several answers stay open?</Accordion.Trigger>
        <Accordion.Content>
          Yes. Set Root type="multiple" to remove the exclusive group name.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>What happens with a keyboard?</Accordion.Trigger>
        <Accordion.Content>
          Tab moves to each summary. Space or Enter toggles it.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
