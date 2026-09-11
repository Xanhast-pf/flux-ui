import { lazy, Suspense, useId, useState } from "react";
import { ArrowUpRightIcon } from "@flux-ui/icons";
import { ProductShowcase } from "../showcase/ProductShowcase.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
const ComponentWorkbench = lazy(
  () => import("../showcase/ComponentWorkbench.js"),
);
export function PlaygroundPage() {
  const [workbench, setWorkbench] = useState(false);
  const id = useId();
  return (
    <div className="landing-page playground-page">
      <section className="playground-intro">
        <div>
          <p className="eyebrow">A small space for big ideas</p>
          <h1>Your ideas look good here.</h1>
          <p className="lede">
            Choose a world. Change the mood. Touch everything.
          </p>
        </div>
        <a href="#components" className="landing-text-link">
          Meet the ingredients <ArrowUpRightIcon size={16} />
        </a>
      </section>
      <ProductShowcase page="playground" />
      <section className="workbench-section">
        <div>
          <p className="eyebrow">Prefer to tinker with the parts?</p>
          <h2>Go a little deeper.</h2>
          <p>
            The original Release Room, Button, Theme, and Collection labs are
            still here.
          </p>
        </div>
        <details
          onToggle={(event) => {
            setWorkbench(event.currentTarget.open);
          }}
        >
          <summary aria-controls={`${id}-workbench`}>
            Component workbench
          </summary>
          <div id={`${id}-workbench`}>
            {workbench ? (
              <ExampleBoundary>
                <Suspense
                  fallback={<p role="status">Opening the workbench…</p>}
                >
                  <ComponentWorkbench />
                </Suspense>
              </ExampleBoundary>
            ) : null}
          </div>
        </details>
      </section>
    </div>
  );
}
