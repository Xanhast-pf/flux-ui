import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  GaugeIcon,
  ShieldCheckIcon,
} from "@flux-ui/icons";
import {
  Card,
  Collapsible,
  Grid,
  Heading,
  Inline,
  Link,
  PageHeader,
  Separator,
  Stack,
  Text,
} from "@flux-ui/react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
import { ProductShowcase } from "../showcase/ProductShowcase.js";

export function OverviewPage() {
  const button = health.size.components.find(
    (entry) => entry.slug === "button",
  );
  const principles = [
    {
      id: "tokens",
      label: "01 / Shape the feeling",
      title: "A mood, not just a color.",
      description:
        "Semantic surfaces, readable contrast, measured space. Change the atmosphere without changing the components.",
      action: "Explore the tokens",
    },
    {
      id: "components",
      label: "02 / Find your building blocks",
      title: "Small pieces. Real possibilities.",
      description: `${components.length} discoverable component families. Native props, composition, and escape hatches when your idea needs more.`,
      action: "Open the catalog",
    },
    {
      id: "engineering",
      label: "03 / Keep your freedom",
      title: "Yours, beyond the demo.",
      description:
        "Static styling and simple APIs. The docs compose the same public components available to your application.",
      action: "Read the engineering",
    },
  ];
  const evidence = [
    {
      id: "lab",
      Icon: GaugeIcon,
      title: "Put it under pressure.",
      description: "Run the opt-in, native-relative Stress Lab.",
    },
    {
      id: "size",
      Icon: CodeIcon,
      title: `${formatBytes(button?.brotli ?? null)} · Button runtime graph`,
      description: "Committed Brotli baseline. Not an app-bundle claim.",
    },
    {
      id: "trust",
      Icon: ShieldCheckIcon,
      title: "Follow the evidence.",
      description: "Build receipts, security workflows, and their limits.",
    },
    {
      id: "accessibility",
      Icon: ShieldCheckIcon,
      title: "Don’t just read about accessibility.",
      description: "Introduce a defect. Run axe. Inspect the repair.",
    },
  ];
  return (
    <Stack gap={16}>
      <Grid
        as="section"
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
        gap={{ base: 6, lg: 16 }}
        align="center"
        paddingBlock={8}
      >
        <PageHeader
          title={
            <>
              One system.
              <br />
              <Text tone="muted">Different worlds.</Text>
            </>
          }
          eyebrow="Flux UI / a React design system"
        />
        <Stack gap="md">
          <Text as="p" variant="lead">
            For everything you haven’t built yet.
          </Text>
          <Text as="p" tone="muted">
            From your next big launch to your next great track. Thoughtful
            components, with room for your point of view.
          </Text>
          <Inline wrap gap="md">
            <Link href="#install" variant="solid">
              Start building <ArrowUpRightIcon size={16} />
            </Link>
            <Link href="#components" variant="ghost">
              Meet the components <ArrowRightIcon size={16} />
            </Link>
          </Inline>
          <Text variant="caption" tone="muted">
            Open source · React 19 · Static CSS · Alpha
          </Text>
        </Stack>
      </Grid>
      <ProductShowcase page="overview" />
      <Stack aria-labelledby="system-story-title" as="section" gap="xl">
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            A point of view. Not a straitjacket.
          </Text>
          <Heading id="system-story-title" level={2} size="lg">
            Expressive on the surface. Considered underneath.
          </Heading>
          <Text as="p" tone="muted">
            The examples change. The foundations don’t. Build with the same
            primitives, then make the result unmistakably yours.
          </Text>
        </Stack>
        <Grid columns={{ base: 1, lg: 3 }} gap="lg">
          {principles.map((item) => (
            <Card key={item.id}>
              <Stack gap="md">
                <Text variant="caption" tone="muted">
                  {item.label}
                </Text>
                <Heading level={3} size="md">
                  {item.title}
                </Heading>
                <Text as="p" tone="muted">
                  {item.description}
                </Text>
                <Link href={`#${item.id}`}>
                  {item.action} <ArrowUpRightIcon size={16} />
                </Link>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
      <Card
        as="section"
        aria-label="Inspect the evidence"
        surface="subtle"
        padding="lg"
      >
        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) minmax(0, 1.2fr)",
          }}
          gap="xl"
        >
          <Stack gap="md">
            <Text as="p" variant="eyebrow" tone="muted">
              Nothing up our sleeves
            </Text>
            <Heading level={2} size="lg">
              Looks good. Show your work.
            </Heading>
            <Text as="p" tone="muted">
              Inspect what’s measured, what’s tested, and what still needs work.
            </Text>
          </Stack>
          <Stack gap="lg">
            {evidence.map((item) => (
              <Stack gap="xs" key={item.id}>
                <Link href={`#${item.id}`}>
                  <item.Icon size={20} />
                  {item.title}
                  <ArrowUpRightIcon size={16} />
                </Link>
                <Text as="p" variant="caption" tone="muted">
                  {item.description}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Card>
      <Grid
        aria-label="A few honest answers"
        as="section"
        columns={{ base: 1, lg: 2 }}
        gap="xl"
      >
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            Still becoming
          </Text>
          <Heading level={2} size="lg">
            A few honest answers.
          </Heading>
          <Text as="p" tone="muted">
            Open source. Open about the details.
          </Text>
        </Stack>
        <Stack gap="sm">
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is everything in the showcase a Flux component?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                Reusable controls, typography, surfaces, and layout use public
                Flux exports. Original illustrations and data geometry are
                authored for each scene. Inspect the scene’s ingredients and the
                ownership policy in Engineering.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Stack gap="md">
                <Text as="p">
                  Flux is alpha. APIs are evolving. Passing checks and measured
                  components are evidence, not a blanket production-readiness
                  guarantee.
                </Text>
                <Link href="#trust">Review the actual trust evidence →</Link>
              </Stack>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Are the demos connected to real services?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                No. Products, people, and figures are fictional. Actions use
                in-memory state. Music is visual and silent; the video editor
                uses illustrated frames. Changing scenes or reloading resets the
                demo. Scene and mood are shareable in the URL.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux the fastest or smallest design system?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p">
                We do not claim a universal ranking. Published size snapshots,
                native-relative benchmarks, and a local Stress Lab expose what
                we can measure, with their limitations.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Grid>
      <Separator />
      <Stack align="center" gap="md" paddingBlock="xl">
        <Text variant="eyebrow" tone="muted">
          The next world is yours
        </Text>
        <Heading level={2} size="lg">
          What will you make of it?
        </Heading>
        <Link href="#install" variant="solid">
          Find your starting point <ArrowUpRightIcon size={16} />
        </Link>
      </Stack>
    </Stack>
  );
}
