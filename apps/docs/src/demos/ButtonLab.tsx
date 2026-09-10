import {
  Button,
  Card,
  Field,
  Inline,
  Input,
  Select,
  Stack,
  Switch,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from "@flux-ui/react";
import { useState } from "react";
import { CodeBlock } from "../ui/CodeBlock.js";
const variants = ["solid", "soft", "outline", "ghost"] as const;
const tones = ["accent", "neutral", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;
export function ButtonLab() {
  const [variant, setVariant] = useState<ButtonVariant>("solid");
  const [tone, setTone] = useState<ButtonTone>("accent");
  const [size, setSize] = useState<ButtonSize>("md");
  const [label, setLabel] = useState("Make it happen");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);
  const code = `import { Button } from "@flux-ui/react";

<Button variant="${variant}" tone="${tone}" size="${size}"${disabled ? " disabled" : ""}${loading ? " loading" : ""}>
  {${JSON.stringify(label || "Button")}}
</Button>`;
  function reset(): void {
    setVariant("solid");
    setTone("accent");
    setSize("md");
    setLabel("Make it happen");
    setDisabled(false);
    setLoading(false);
    setClicks(0);
  }
  return (
    <div className="lab-grid">
      <Card>
        <Stack gap="md">
          <h2>Make a button your button.</h2>
          <Field.Root>
            <Field.Label>Button label</Field.Label>
            <Field.Control>
              <Input
                value={label}
                maxLength={40}
                onChange={(event) => {
                  setLabel(event.currentTarget.value);
                }}
              />
            </Field.Control>
          </Field.Root>
          <Field.Root>
            <Field.Label>Variant</Field.Label>
            <Field.Control>
              <Select
                value={variant}
                onChange={(event) => {
                  const choice = variants.find(
                    (item) => item === event.currentTarget.value,
                  );
                  if (choice !== undefined) setVariant(choice);
                }}
              >
                {variants.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field.Control>
          </Field.Root>
          <Field.Root>
            <Field.Label>Tone</Field.Label>
            <Field.Control>
              <Select
                value={tone}
                onChange={(event) => {
                  const choice = tones.find(
                    (item) => item === event.currentTarget.value,
                  );
                  if (choice !== undefined) setTone(choice);
                }}
              >
                {tones.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field.Control>
          </Field.Root>
          <Field.Root>
            <Field.Label>Size</Field.Label>
            <Field.Control>
              <Select
                value={size}
                onChange={(event) => {
                  const choice = sizes.find(
                    (item) => item === event.currentTarget.value,
                  );
                  if (choice !== undefined) setSize(choice);
                }}
              >
                {sizes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field.Control>
          </Field.Root>
          <Field.Root>
            <Inline justify="between">
              <Field.Label>Disabled</Field.Label>
              <Field.Control>
                <Switch checked={disabled} onCheckedChange={setDisabled} />
              </Field.Control>
            </Inline>
          </Field.Root>
          <Field.Root>
            <Inline justify="between">
              <Field.Label>Loading</Field.Label>
              <Field.Control>
                <Switch checked={loading} onCheckedChange={setLoading} />
              </Field.Control>
            </Inline>
          </Field.Root>
          <Button variant="outline" onClick={reset}>
            Reset button
          </Button>
        </Stack>
      </Card>
      <Stack gap="md">
        <div className="button-stage">
          <Button
            variant={variant}
            tone={tone}
            size={size}
            disabled={disabled}
            loading={loading}
            onClick={() => {
              setClicks((value) => value + 1);
            }}
          >
            {label || "Button"}
          </Button>
          <p className="demo-help" role="status">
            {clicks === 0
              ? "Go on. Give it a click."
              : `${clicks} clicks. Still satisfying.`}
          </p>
        </div>
        <CodeBlock key={code} code={code} label="Your button" />
      </Stack>
    </div>
  );
}
