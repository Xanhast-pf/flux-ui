import { ArrowUpRightIcon } from "@flux-ui/icons";
import {
  Collapsible,
  Heading,
  Inline,
  Link,
  PageHeader,
  Stack,
  Text,
} from "@flux-ui/react";
import { lazy, Suspense, useId, useState } from "react";
import { ProductShowcase } from "../showcase/ProductShowcase.js";
import { ExampleBoundary } from "../ui/ExampleBoundary.js";
const ComponentWorkbench = lazy(
  () => import("../showcase/ComponentWorkbench.js"),
);
export function PlaygroundPage() {
  const [workbench, setWorkbench] = useState(false);
  const id = useId();
  return (
    <Stack className="playground-page" gap="none">
      <Inline
        as="section"
        wrap
        align="end"
        justify="between"
        gap="lg"
        paddingBlock={12}
      >
        <PageHeader
          title={<>Playground</>}
          eyebrow={<>A small space for big ideas</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Try a scene, switch its theme, then inspect the code.
          </Text>
        </PageHeader>
        <Link href="#components" variant="ghost">
          Meet the ingredients <ArrowUpRightIcon size={16} />
        </Link>
      </Inline>
      <ProductShowcase page="playground" />
      <Stack
        className="workbench-section"
        as="section"
        gap="lg"
        paddingBlock={8}
      >
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            Prefer to tinker with the parts?
          </Text>
          <Heading level={2} size="lg">
            Try individual components.
          </Heading>
          <Text as="p" variant="body">
            Open a focused lab for buttons, themes, collections, or a release
            workflow.
          </Text>
        </Stack>
        <Collapsible.Root
          onToggle={(event) => {
            setWorkbench(event.currentTarget.open);
          }}
        >
          <Collapsible.Trigger aria-controls={`${id}-workbench`}>
            Component workbench
          </Collapsible.Trigger>
          <Collapsible.Content id={`${id}-workbench`}>
            {workbench ? (
              <ExampleBoundary>
                <Suspense
                  fallback={
                    <Text role="status" as="p" variant="body">
                      Opening the workbench…
                    </Text>
                  }
                >
                  <ComponentWorkbench />
                </Suspense>
              </ExampleBoundary>
            ) : null}
          </Collapsible.Content>
        </Collapsible.Root>
      </Stack>
    </Stack>
  );
}
