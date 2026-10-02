import { Stepper } from "@flux-ui/react";

export default function Example() {
  return (
    <Stepper.Root aria-label="Checkout progress">
      <Stepper.Item status="complete">
        <Stepper.Link href="#components/stepper?step=account">
          Account
        </Stepper.Link>
      </Stepper.Item>
      <Stepper.Item status="current">Shipping</Stepper.Item>
      <Stepper.Item>Payment</Stepper.Item>
      <Stepper.Item>Review</Stepper.Item>
    </Stepper.Root>
  );
}
