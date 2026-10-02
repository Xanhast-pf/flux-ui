import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Stepper } from "./Stepper.js";

describe("Stepper SSR", () => {
  bench("render 1,000 three-step progress lists", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => (
          <Stepper.Root key={index}>
            <Stepper.Item status="complete">Account</Stepper.Item>
            <Stepper.Item status="current">Shipping</Stepper.Item>
            <Stepper.Item>Payment</Stepper.Item>
          </Stepper.Root>
        ))}
      </div>,
    );
  });
});
