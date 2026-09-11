import { CodeBlock } from "@flux-ui/react";

export default function Preview() {
  return (
    <CodeBlock
      label="Install Flux UI"
      code={"pnpm add @flux-ui/react @flux-ui/tokens"}
    />
  );
}
