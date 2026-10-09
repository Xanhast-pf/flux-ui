import {
  Accordion,
  Card,
  Code,
  Grid,
  Heading,
  Link,
  List,
  PageHeader,
  Stack,
  Text,
} from "@varua/flux-ui";
import { REPOSITORY_URL } from "../lib/format.js";
const guides = [
  {
    title: "Start building",
    description: "Set up Flux and explore components.",
    links: [
      ["#install", "Local setup"],
      ["#components", "Component APIs"],
      ["#playground", "Interactive examples"],
    ],
  },
  {
    title: "Make it yours",
    description: "Customize colors and icons.",
    links: [
      ["#tokens", "Tokens and themes"],
      ["#icons", "Icon browser"],
    ],
  },
  {
    title: "Contribute",
    description: "Read the contribution guide.",
    links: [
      [
        `${REPOSITORY_URL}/blob/main/docs/development.md`,
        "Development workflow",
      ],
      [
        `${REPOSITORY_URL}/blob/main/docs/component-api.md`,
        "Component API rules",
      ],
      [`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`, "Contribution guide"],
    ],
  },
] as const;
export function DocumentationPage() {
  return (
    <Stack className="reference-page" as="section" gap="lg">
      <PageHeader title={<>Guides & FAQ</>}>
        <Text as="p" variant="lead" tone="muted">
          Guides and common questions.
        </Text>
      </PageHeader>
      <Grid minColumnWidth="17rem" gap="md">
        {guides.map((guide) => (
          <Card key={guide.title}>
            <Stack gap="md">
              <Heading level={2} size="md">
                {guide.title}
              </Heading>
              <Text as="p" variant="body" tone="muted">
                {guide.description}
              </Text>
              <List as="ul" variant="plain" gap="sm">
                {guide.links.map(([href, label]) => (
                  <List.Item key={href}>
                    <Link href={href}>{label}</Link>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Stack as="section" gap="md">
        <Heading level={2} size="lg">
          Common questions
        </Heading>
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Trigger>How do I add a component?</Accordion.Trigger>
            <Accordion.Content>
              Run <Code>pnpm flux component new Name Category</Code>, implement
              its API and preview, then run{" "}
              <Code>pnpm flux component doctor Name</Code>,{" "}
              <Code>pnpm flux maintain generate</Code> and{" "}
              <Code>pnpm flux check</Code>. Components are discovered
              automatically.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>
              Does a green demo mean production-ready?
            </Accordion.Trigger>
            <Accordion.Content>
              No. Flux is pre-stable. Check component status and test your app.
              See the <Link href="#trust">Trust Center</Link> for evidence and
              known limits.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>
              Why does a size entry say Pending baseline?
            </Accordion.Trigger>
            <Accordion.Content>
              No baseline has been approved. Run{" "}
              <Code>pnpm flux size baseline review</Code> to inspect the
              proposed component baseline. After review, maintainers can run{" "}
              <Code>pnpm flux size baseline accept</Code>. Aggregate review and
              acceptance use <Code>pnpm flux size aggregate review</Code> and{" "}
              <Code>pnpm flux size aggregate accept</Code> separately; icons use{" "}
              <Code>pnpm flux size icons accept</Code>. Review is read-only.
              Acceptance saves a baseline; budgets still apply.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
      <Link href={`${REPOSITORY_URL}/tree/main/docs`}>More guides →</Link>
    </Stack>
  );
}
