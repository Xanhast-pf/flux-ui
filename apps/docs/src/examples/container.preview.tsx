import { Container } from "@flux-ui/react";

export default function Example() {
  return (
    <div className="container-demo-stage">
      <Container size="sm" className="demo-boundary">
        <div className="demo-block">Small container</div>
      </Container>
    </div>
  );
}
