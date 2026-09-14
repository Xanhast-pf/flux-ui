import { useRef, useState } from "react";
import {
  AlertDialog,
  Button,
  Combobox,
  DropdownMenu,
  Field,
  Heading,
  Input,
  InputGroup,
  Popover,
  Stack,
  Tabs,
  Tag,
  Text,
  Toast,
  Tooltip,
  useToast,
} from "@flux-ui/react";
function WrappedHelp() {
  return <Field.Description>Wrapped helper is associated.</Field.Description>;
}
function Interactions() {
  const notifyButton = useRef<HTMLButtonElement>(null);
  const [showSelected, setShowSelected] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [tag, setTag] = useState(true);
  const [action, setAction] = useState("No menu action");
  const { notify } = useToast();
  return (
    <Stack as="section" gap="lg" aria-label="Interaction primitives">
      <Heading level={2}>Interaction primitives</Heading>
      <Field.Root>
        <Field.Label>Wrapped field</Field.Label>
        <Field.Control>
          <Input />
        </Field.Control>
        <WrappedHelp />
      </Field.Root>
      <Field.Root description="Root-owned server description.">
        <Field.Label>Root slot field</Field.Label>
        <InputGroup.Root>
          <InputGroup.Addon>@</InputGroup.Addon>
          <Field.Control>
            <InputGroup.Input />
          </Field.Control>
        </InputGroup.Root>
      </Field.Root>
      <Tabs.Root defaultValue="removed">
        <Tabs.List aria-label="Dynamic tabs">
          <Tabs.Tab value="one">Dynamic one</Tabs.Tab>
          {showSelected ? (
            <Tabs.Tab value="removed">Dynamic removed</Tabs.Tab>
          ) : null}
          <Tabs.Tab value="three">Dynamic three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First recovered panel</Tabs.Panel>
        {showSelected ? (
          <Tabs.Panel value="removed">Removable panel</Tabs.Panel>
        ) : null}
        <Tabs.Panel value="three">Third recovered panel</Tabs.Panel>
      </Tabs.Root>
      <Button onClick={() => setShowSelected(false)}>
        Remove selected consumer tab
      </Button>
      <Popover.Root>
        <Popover.Trigger>Consumer filters</Popover.Trigger>
        <Popover.Popup aria-label="Consumer filter panel">
          <Field.Root>
            <Field.Label>Consumer filter text</Field.Label>
            <Field.Control>
              <Input />
            </Field.Control>
          </Field.Root>
          <Popover.Close>Close filters</Popover.Close>
        </Popover.Popup>
      </Popover.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Consumer menu</DropdownMenu.Trigger>
        <DropdownMenu.Popup aria-label="Consumer actions">
          <DropdownMenu.Item onSelect={() => setAction("Export chosen")}>
            Export choice
          </DropdownMenu.Item>
          <DropdownMenu.Item disabled>Unavailable choice</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setAction("Rename chosen")}>
            Rename choice
          </DropdownMenu.Item>
        </DropdownMenu.Popup>
      </DropdownMenu.Root>
      <Text role="status">{action}</Text>
      <Field.Root>
        <Field.Label>Consumer assignee</Field.Label>
        <Field.Control>
          <Combobox
            value={selected}
            onValueChange={setSelected}
            options={[
              { value: "alex", label: "Alex Morgan" },
              { value: "sam", label: "Sam Rivera" },
              {
                value: "unavailable",
                label: "Disabled account",
                disabled: true,
              },
            ]}
          />
        </Field.Control>
      </Field.Root>
      <Tooltip content="Accessible consumer help">
        <Button>Consumer help</Button>
      </Tooltip>
      <AlertDialog.Root>
        <AlertDialog.Trigger>Consumer destructive action</AlertDialog.Trigger>
        <AlertDialog.Popup>
          <AlertDialog.Title>Remove the local draft?</AlertDialog.Title>
          <AlertDialog.Description>
            This only changes the fixture.
          </AlertDialog.Description>
          <AlertDialog.Close>Keep local draft</AlertDialog.Close>
          <AlertDialog.Close>Remove local draft</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Root>
      {tag ? (
        <Tag
          removeLabel="Remove consumer filter"
          onRemove={() => {
            notifyButton.current?.focus();
            setTag(false);
          }}
        >
          Consumer filter
        </Tag>
      ) : null}
      <Button
        ref={notifyButton}
        onClick={() => notify({ title: "Consumer saved", duration: 0 })}
      >
        Notify consumer save
      </Button>
      <Toast.Viewport placement="inline" />
    </Stack>
  );
}
export function ConsumerInteractions() {
  return (
    <Toast.Provider>
      <Interactions />
    </Toast.Provider>
  );
}
