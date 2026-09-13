import {
  Field,
  Inline,
  Select,
  Stack,
  Switch,
  Text,
  Toolbar,
} from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [loopFocus, setLoopFocus] = useState(true);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  return (
    <Stack gap="md">
      <Inline gap="md" wrap>
        <Field.Root>
          <Field.Label>Toolbar orientation</Field.Label>
          <Field.Control>
            <Select
              value={orientation}
              onChange={(event) => {
                const next = event.currentTarget.value;
                if (next === "horizontal" || next === "vertical")
                  setOrientation(next);
              }}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </Select>
          </Field.Control>
        </Field.Root>
        <Field.Root>
          <Inline gap="sm">
            <Field.Control>
              <Switch checked={loopFocus} onCheckedChange={setLoopFocus} />
            </Field.Control>
            <Field.Label>Loop toolbar focus</Field.Label>
          </Inline>
        </Field.Root>
      </Inline>
      <Toolbar.Root
        aria-label="Preview formatting"
        orientation={orientation}
        loopFocus={loopFocus}
      >
        <Toolbar.Button
          aria-pressed={bold}
          onClick={() => {
            setBold((value) => !value);
          }}
        >
          Bold
        </Toolbar.Button>
        <Toolbar.Button
          aria-pressed={italic}
          onClick={() => {
            setItalic((value) => !value);
          }}
        >
          Italic
        </Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button
          onClick={() => {
            setBold(false);
            setItalic(false);
          }}
        >
          Reset formatting
        </Toolbar.Button>
        <Toolbar.Link href="#components/toggle">Toggle docs</Toolbar.Link>
      </Toolbar.Root>
      <Text
        as="p"
        variant="body"
        weight={bold ? "bold" : "regular"}
        italic={italic}
      >
        Small controls. Big possibilities.
      </Text>
    </Stack>
  );
}
