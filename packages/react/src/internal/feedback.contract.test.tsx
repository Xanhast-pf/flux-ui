import { describe, expect, it } from "vitest";
import { EmptyState } from "../components/EmptyState/EmptyState.js";
import type { EmptyStateProps } from "../components/EmptyState/EmptyState.types.js";
import { Meter } from "../components/Meter/Meter.js";
import { Progress } from "../components/Progress/Progress.js";
import { Skeleton } from "../components/Skeleton/Skeleton.js";
import type { SkeletonProps } from "../components/Skeleton/Skeleton.types.js";
import { Spinner } from "../components/Spinner/Spinner.js";
import type { SpinnerProps } from "../components/Spinner/Spinner.types.js";
import { Toast } from "../components/Toast/Toast.js";
import type { ToastViewportProps } from "../components/Toast/Toast.types.js";

describe("Feedback public type contracts", () => {
  it("requires exposed measurements to be named and reserves composed content", () => {
    const valid = (
      <>
        <Meter aria-label="CPU usage" value={0.5} />
        <Meter aria-hidden value={0.5} />
        <Progress aria-label="Upload progress" value={50} />
        <Progress aria-hidden />
        <EmptyState title="Nothing here" />
        <Skeleton />
        <Spinner />
        <Toast.Provider>
          <Toast.Viewport />
        </Toast.Provider>
      </>
    );
    expect(valid).toBeDefined();

    // @ts-expect-error Exposed meters require an accessible name.
    const unnamedMeter = <Meter value={0.5} />;
    // @ts-expect-error Exposed progressbars require an accessible name.
    const unnamedProgress = <Progress value={50} />;
    const hiddenNamedMeter = (
      // @ts-expect-error Hidden measurements cannot also expose a programmatic name.
      <Meter aria-hidden aria-label="CPU usage" value={0.5} />
    );
    const emptyStateHtml: EmptyStateProps = {
      title: "Nothing here",
      // @ts-expect-error EmptyState owns its rendered child composition.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const skeletonHtml: SkeletonProps = {
      // @ts-expect-error Skeleton is always an empty decorative placeholder.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const spinnerHtml: SpinnerProps = {
      // @ts-expect-error Spinner owns its hidden status label content.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };
    const toastHtml: ToastViewportProps = {
      // @ts-expect-error Toast.Viewport owns the rendered queue children.
      dangerouslySetInnerHTML: { __html: "unsafe" },
    };

    expect([
      unnamedMeter,
      unnamedProgress,
      hiddenNamedMeter,
      emptyStateHtml,
      skeletonHtml,
      spinnerHtml,
      toastHtml,
    ]).toHaveLength(7);
  });
});
