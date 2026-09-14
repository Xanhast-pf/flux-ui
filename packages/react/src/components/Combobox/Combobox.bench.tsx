import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { Combobox } from "./Combobox.js";
// Representative server-render cost, not a browser interaction regression baseline.
describe("Combobox representative SSR", () => {
  bench("native structure", () => {
    renderToString(
      <>
        <input
          aria-label="Workspace role"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="native-choices"
          defaultValue="Member"
        />
        <div hidden id="native-choices" role="listbox" aria-label="Suggestions">
          <div role="option" aria-selected="true">
            Member
          </div>
          <div role="option" aria-selected="false">
            Viewer
          </div>
        </div>
      </>,
    );
  });
  bench("Flux public instance", () => {
    renderToString(
      <>
        <Combobox
          aria-label="Workspace role"
          options={[
            { value: "member", label: "Member" },
            { value: "viewer", label: "Viewer" },
          ]}
          defaultValue="member"
        />
      </>,
    );
  });
});
