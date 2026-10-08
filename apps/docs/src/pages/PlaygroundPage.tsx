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
          eyebrow={<>Five interactive dashboards</>}
        >
          <Text as="p" variant="lead" tone="muted">
            Try the dashboards. Inspect their components and source.
          </Text>
        </PageHeader>
        <Link href="#components" variant="ghost">
          Browse components <ArrowUpRightIcon size={16} />
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
            More examples
          </Text>
          <Heading level={2} size="lg">
            Interactive component labs
          </Heading>
          <Text as="p" variant="body">
            Try individual components and states.
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
                      Loading workbench…
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
