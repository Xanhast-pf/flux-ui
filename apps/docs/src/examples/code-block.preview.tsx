import {
  CodeBlock,
  Field,
  Select,
  Stack,
  codeLanguages,
  tokenizeCode,
} from "@flux-ui/react";
import { useMemo, useState } from "react";
const samples: Record<string, string> = {
  typescript:
    "type Greeting = { name: string };\nexport const greet = ({ name }: Greeting) => `Hello ${name}`;",
  python: '# Safe literal text\ndef greet(name):\n    return "Hello " + name',
  sql: "SELECT name, COUNT(*) AS total\nFROM events\nWHERE active = true\nGROUP BY name;",
  json: '{ "name": "Flux UI", "version": 1, "ready": true }',
  css: ".card {\n  color: var(--flux-color-text);\n  padding: 1rem;\n}",
  bash: "# Run the complete gate\npnpm verify:all",
};
export default function Preview() {
  const [language, setLanguage] = useState("typescript");
  const code =
    samples[language] ??
    '<section title="Literal, never executed">Flux UI</section>';
  const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Source language</Field.Label>
        <Field.Control>
          <Select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {codeLanguages.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field.Control>
      </Field.Root>
      <CodeBlock
        label="Highlighted source"
        code={code}
        language={language}
        tokens={tokens}
      />
    </Stack>
  );
}
