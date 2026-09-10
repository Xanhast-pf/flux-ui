import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { RadioGroup } from "./RadioGroup.js";

const groups = Array.from({ length: 250 }, (_, index) => `group-${index}`);

function NativeGroups() {
  return (
    <div>
      {groups.map((name) => (
        <fieldset key={name}>
          <legend>{name}</legend>
          <input defaultChecked name={name} type="radio" value="stable" />
          <input name={name} type="radio" value="beta" />
          <input name={name} type="radio" value="canary" />
        </fieldset>
      ))}
    </div>
  );
}

function FluxGroups() {
  return (
    <div>
      {groups.map((name) => (
        <RadioGroup.Root defaultValue="stable" key={name} name={name}>
          <RadioGroup.Legend>{name}</RadioGroup.Legend>
          <RadioGroup.Item value="stable" />
          <RadioGroup.Item value="beta" />
          <RadioGroup.Item value="canary" />
        </RadioGroup.Root>
      ))}
    </div>
  );
}

describe("RadioGroup SSR", () => {
  bench("render 250 native groups / 750 radios", () => {
    renderToString(<NativeGroups />);
  });

  bench("render 250 Flux groups / 750 radios", () => {
    renderToString(<FluxGroups />);
  });
});
