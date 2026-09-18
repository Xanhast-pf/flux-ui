import {
  CodeBlock,
  Field,
  Select,
  Stack,
  codeLanguages,
  tokenizeCode,
} from "@flux-ui/react";
import { useMemo, useState } from "react";
type Language = (typeof codeLanguages)[number];
const samples: Record<Language, string> = {
  javascript:
    'export const greet = (name) => `Hello ${name}`;\nconsole.log(greet("Flux UI"));',
  typescript:
    "type Greeting = { name: string };\nexport const greet = ({ name }: Greeting) => `Hello ${name}`;",
  jsx: "export function Greeting({ name }) {\n  return <h1>Hello {name}</h1>;\n}",
  tsx: "type GreetingProps = { name: string };\nexport function Greeting({ name }: GreetingProps) {\n  return <h1>Hello {name}</h1>;\n}",
  json: '{ "name": "Flux UI", "version": 1, "ready": true }',
  css: ".card {\n  color: var(--flux-color-text);\n  padding: 1rem;\n}",
  scss: "$space: 1rem;\n.card {\n  padding: $space;\n  &:focus-visible { outline: 2px solid currentColor; }\n}",
  html: '<section aria-labelledby="greeting">\n  <h1 id="greeting">Hello Flux UI</h1>\n</section>',
  xml: '<?xml version="1.0" encoding="UTF-8"?>\n<project name="Flux UI">\n  <component>Slider</component>\n</project>',
  yaml: "project: Flux UI\ncomponents:\n  - Slider\n  - Tabs\nchecks:\n  enabled: true",
  bash: "#!/usr/bin/env bash\nset -euo pipefail\n# Verify the application\npnpm flux check full",
  sql: "SELECT name, COUNT(*) AS total\nFROM events\nWHERE active = true\nGROUP BY name;",
  python:
    'def greet(name: str) -> str:\n    return f"Hello {name}"\n\nprint(greet("Flux UI"))',
  rust: 'fn greet(name: &str) -> String {\n    format!("Hello {name}")\n}\n\nfn main() {\n    println!("{}", greet("Flux UI"));\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Flux UI")\n}',
  java: 'public class Greeting {\n    public static void main(String[] args) {\n        System.out.println("Hello Flux UI");\n    }\n}',
  c: '#include <stdio.h>\n\nint main(void) {\n    puts("Hello Flux UI");\n    return 0;\n}',
  cpp: '#include <iostream>\n#include <string>\n\nint main() {\n    const std::string name = "Flux UI";\n    std::cout << "Hello " << name << "\\n";\n}',
  markdown:
    "# Flux UI\n\nBuild accessible interfaces with **public components**.\n\n- Native semantics\n- Static styles\n- Tested interactions",
};
export default function Preview() {
  const [language, setLanguage] = useState<Language>("typescript");
  const code = samples[language];
  const tokens = useMemo(() => tokenizeCode(code, language), [code, language]);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Source language</Field.Label>
        <Field.Control>
          <Select
            value={language}
            onChange={(event) => {
              const selected = codeLanguages.find(
                (name) => name === event.currentTarget.value,
              );
              if (selected !== undefined) setLanguage(selected);
            }}
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
