import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  GaugeIcon,
  ShieldCheckIcon,
} from "@flux-ui/icons";
import {
  Box,
  Collapsible,
  Grid,
  Heading,
  Inline,
  Link,
  PageHeader,
  Stack,
  Text,
} from "@flux-ui/react";
import { components } from "../generated/components.js";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";
import { ProductShowcase } from "../showcase/ProductShowcase.js";
import "./landing.css";
export function OverviewPage() {
  const button = health.size.components.find(
    (entry) => entry.slug === "button",
  );
  return (
    <Stack gap="none">
      <Grid
        className="landing-hero"
        as="section"
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
        gap={{ base: 6, lg: 16 }}
        align="center"
        paddingBlock={12}
      >
        <PageHeader
          title={
            <>
              One system.
              <br />
              <Text>Different worlds.</Text>
            </>
          }
          eyebrow={
            <>
              <span aria-hidden="true" className="hero-signal" />
              Flux UI / a React design system
            </>
          }
        ></PageHeader>
        <Stack className="landing-intro" gap="md">
          <Text as="p" variant="body">
            For everything you haven’t built yet.
          </Text>
          <Text as="p" variant="body">
            From your next big launch to your next great track. Thoughtful
            components, with room for your point of view.
          </Text>
          <Inline wrap gap={5}>
            <Link href="#install" variant="solid">
              Start building <ArrowUpRightIcon size={16} />
            </Link>
            <Link href="#components" className="landing-text-link">
              Meet the components <ArrowRightIcon size={16} />
            </Link>
          </Inline>
          <Text>Open source · React 19 · Static CSS · Alpha</Text>
        </Stack>
      </Grid>
      <ProductShowcase page="overview" />
      <Stack
        aria-labelledby="system-story-title"
        as="section"
        gap={12}
        paddingBlock={16}
      >
        <Stack className="system-story-heading" gap="lg">
          <Text as="p" variant="eyebrow" tone="muted">
            A point of view. Not a straitjacket.
          </Text>
          <Heading id="system-story-title" level={2} size="lg">
            Expressive on the surface.
            <br />
            <Text>Considered underneath.</Text>
          </Heading>
          <Text as="p" variant="body">
            The examples change. The foundations don’t. Build with the same
            primitives, then make the result unmistakably yours.
          </Text>
        </Stack>
        <Grid
          className="system-principles"
          columns={{ base: 1, lg: 3 }}
          gap="xl"
        >
          <Link href="#tokens">
            <Text variant="caption" tone="muted">
              01 / Shape the feeling
            </Text>
            <Heading level={3} size="md">
              A mood, not just a color.
            </Heading>
            <Text as="p" variant="body">
              Semantic surfaces, readable contrast, measured space. Change the
              atmosphere without changing the components.
            </Text>
            <Text className="principle-link">
              Explore the tokens <ArrowUpRightIcon size={16} />
            </Text>
          </Link>
          <Link href="#components">
            <Text variant="caption" tone="muted">
              02 / Find your building blocks
            </Text>
            <Heading level={3} size="md">
              Small pieces. Real possibilities.
            </Heading>
            <Text as="p" variant="body">
              {components.length} discoverable component families. Native props,
              composition, and escape hatches when your idea needs more.
            </Text>
            <Text className="principle-link">
              Open the catalog <ArrowUpRightIcon size={16} />
            </Text>
          </Link>
          <Link href="#engineering">
            <Text variant="caption" tone="muted">
              03 / Keep your freedom
            </Text>
            <Heading level={3} size="md">
              Yours, beyond the demo.
            </Heading>
            <Text as="p" variant="body">
              Static styling and simple APIs. No special showcase component
              library hiding behind these examples.
            </Text>
            <Text className="principle-link">
              Read the engineering <ArrowUpRightIcon size={16} />
            </Text>
          </Link>
        </Grid>
      </Stack>
      <Grid
        aria-label="Inspect the evidence"
        className="evidence-story"
        as="section"
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1fr) minmax(0, 1.2fr)",
        }}
        gap={10}
        padding={6}
      >
        <Stack gap="lg">
          <Text as="p" variant="eyebrow" tone="muted">
            Nothing up our sleeves
          </Text>
          <Heading level={2} size="lg">
            Looks good.
            <br />
            Show your work.
          </Heading>
          <Text as="p" variant="body">
            Nice interfaces deserve honest engineering. Inspect what’s measured,
            what’s tested, and what still needs work.
          </Text>
        </Stack>
        <Stack className="evidence-story-links" gap="none">
          <Link href="#lab">
            <GaugeIcon size={24} />
            <Text>
              <Text as="strong" weight="bold">
                Put it under pressure.
              </Text>
              <Text as="small" variant="caption">
                Run the opt-in, native-relative Stress Lab.
              </Text>
            </Text>
            <ArrowUpRightIcon size={16} />
          </Link>
          <Link href="#size">
            <CodeIcon size={24} />
            <Text>
              <Text as="strong" weight="bold">
                {formatBytes(button?.brotli ?? null)} · Button runtime graph
              </Text>
              <Text as="small" variant="caption">
                Committed Brotli baseline. Not an app-bundle claim.
              </Text>
            </Text>
            <ArrowUpRightIcon size={16} />
          </Link>
          <Link href="#trust">
            <ShieldCheckIcon size={24} />
            <Text>
              <Text as="strong" weight="bold">
                Follow the evidence.
              </Text>
              <Text as="small" variant="caption">
                Build receipts, security workflows, and their limits.
              </Text>
            </Text>
            <ArrowUpRightIcon size={16} />
          </Link>
          <Link href="#accessibility">
            <Text aria-hidden="true" className="evidence-axe-mark">
              a11y
            </Text>
            <Text>
              <Text as="strong" weight="bold">
                Don’t just read about accessibility.
              </Text>
              <Text as="small" variant="caption">
                Introduce a defect. Run axe. Inspect the repair.
              </Text>
            </Text>
            <ArrowUpRightIcon size={16} />
          </Link>
        </Stack>
      </Grid>
      <Grid
        aria-label="A few honest answers"
        as="section"
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 1fr) minmax(0, 1.2fr)",
        }}
        gap="xl"
        paddingBlock={16}
      >
        <Box>
          <Text as="p" variant="eyebrow" tone="muted">
            Still becoming
          </Text>
          <Heading level={2} size="lg">
            A few honest answers.
          </Heading>
          <Text as="p" variant="body">
            Open source. Open about the details.
          </Text>
        </Box>
        <Box>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is everything in the showcase a Flux component?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p" variant="body">
                The controls use public Flux exports. Charts, artwork,
                timelines, and product layouts are custom demo compositions.
                Every scene’s inspector lists the ingredients and the gaps.
                These examples can evolve as the component library grows.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux ready for production?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p" variant="body">
                Flux is alpha. APIs are evolving. Passing checks and measured
                components are useful evidence, not a blanket
                production-readiness guarantee.
              </Text>
              <Link href="#trust">Review the actual trust evidence →</Link>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Are the demos connected to real services?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p" variant="body">
                No. Products, people, and figures are fictional. Demo actions
                update in-memory state; music playback is visual and silent, and
                the video editor uses illustrated frames. Switching scenes or
                reloading resets the demo. Scene and mood are shareable in the
                URL. Appearance preferences remain local to your browser.
              </Text>
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root>
            <Collapsible.Trigger>
              Is Flux the fastest or smallest design system?
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Text as="p" variant="body">
                No universal claim is made. Component behavior, application
                context, and measurement method matter. The benchmarks publish
                native-relative timings and explicit size scopes.
              </Text>
              <Link href="#performance">
                Read the measurement methodology →
              </Link>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
      </Grid>
      <Stack
        className="landing-outro"
        as="section"
        gap="xl"
        paddingBlock={12}
        align="center"
      >
        <Text as="p" variant="eyebrow" tone="muted">
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
