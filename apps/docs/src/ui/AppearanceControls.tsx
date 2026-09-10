import { MoonIcon, SunIcon } from "@flux-ui/icons";
import { Field, Inline, RadioGroup, Stack, Switch } from "@flux-ui/react";
import { useId } from "react";
import {
  isAccent,
  setAccent,
  setTheme,
  useAccent,
  useTheme,
} from "../lib/appearance.js";
const accents = ["indigo", "teal", "rose"] as const;
export function ThemeSwitch() {
  const theme = useTheme();
  return (
    <Inline gap="sm">
      <SunIcon aria-hidden="true" size={16} />
      <span className="muted">Dark theme</span>
      <Switch
        aria-label="Dark theme"
        checked={theme === "dark"}
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
      <MoonIcon aria-hidden="true" size={16} />
    </Inline>
  );
}
export function AppearanceControls() {
  const accent = useAccent();
  const id = useId();
  return (
    <Stack gap="md">
      <ThemeSwitch />
      <RadioGroup.Root
        name={`${id}-accent`}
        value={accent}
        onValueChange={(value) => {
          if (isAccent(value)) setAccent(value);
        }}
      >
        <RadioGroup.Legend>Accent color</RadioGroup.Legend>
        <Inline gap="sm" wrap>
          {accents.map((value) => (
            <Field.Root key={value} controlId={`${id}-${value}`}>
              <Inline gap="sm">
                <Field.Control>
                  <RadioGroup.Item value={value} />
                </Field.Control>
                <Field.Label>
                  <span
                    className="accent-dot"
                    data-accent={value}
                    aria-hidden="true"
                  />
                  {value}
                </Field.Label>
              </Inline>
            </Field.Root>
          ))}
        </Inline>
      </RadioGroup.Root>
      <p className="demo-help">
        Saved locally. These docs presets change semantic CSS variables, not
        component APIs.
      </p>
    </Stack>
  );
}
