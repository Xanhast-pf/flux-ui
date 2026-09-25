import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckIcon,
  CircleCheckIcon,
  MailIcon,
  MoreHorizontalIcon,
  UsersIcon,
} from "@flux-ui/icons";
import {
  Avatar,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  IconButton,
  Inline,
  Input,
  Progress,
  Separator,
  Sparkline,
  Stack,
  Stat,
  StatusBadge,
  Switch,
  Text,
} from "@flux-ui/react";
import { useId, useState } from "react";
import { AppearanceControls } from "../ui/AppearanceControls.js";

const members = [
  { name: "Maya Chen", initials: "MC", role: "Design" },
  { name: "Noah Williams", initials: "NW", role: "Engineering" },
  { name: "Ari Patel", initials: "AP", role: "Research" },
] as const;

const notificationSettings = [
  {
    label: "Comments",
    description: "When someone mentions you",
    checked: true,
  },
  {
    label: "Release updates",
    description: "When a build reaches production",
    checked: true,
  },
  {
    label: "Weekly digest",
    description: "A quiet Monday summary",
    checked: false,
  },
] as const;

const activity = [
  {
    name: "Maya Chen",
    initials: "MC",
    action: "Approved invoice #3461",
    time: "11:34",
  },
  {
    name: "Noah Williams",
    initials: "NW",
    action: "Published the release notes",
    time: "09:43",
  },
  {
    name: "Ari Patel",
    initials: "AP",
    action: "Updated the launch brief",
    time: "Yesterday",
  },
  {
    name: "Jordan Lee",
    initials: "JL",
    action: "Joined the workspace",
    time: "Mon",
  },
] as const;

function TeamCard() {
  const id = useId();
  const [status, setStatus] = useState("3 active collaborators");

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="elevated"
    >
      <Stack gap={4}>
        <Inline justify="between" gap="sm" wrap>
          <Stack gap="xs">
            <Heading id={`${id}-title`} level={3} size="sm">
              Your team
            </Heading>
            <Text variant="caption" tone="muted">
              Invite and manage collaborators.
            </Text>
          </Stack>
          <StatusBadge tone="accent">Workspace</StatusBadge>
        </Inline>

        <Grid templateColumns="minmax(0, 1fr) auto" gap={2} align="end">
          <Field.Root density="compact" controlId={`${id}-invite`}>
            <Field.Label>Email address</Field.Label>
            <Field.Control>
              <Input type="email" placeholder="name@company.com" />
            </Field.Control>
          </Field.Root>
          <Button
            size="sm"
            startIcon={<MailIcon size={14} />}
            onClick={() => setStatus("Invitation staged locally")}
          >
            Invite
          </Button>
        </Grid>

        <Separator />

        <Stack gap={3}>
          {members.map((member) => (
            <Inline key={member.name} justify="between" gap="sm">
              <Inline gap={3}>
                <Avatar alt="" fallback={member.initials} size="sm" />
                <Stack gap="none">
                  <Text variant="caption" weight="medium">
                    {member.name}
                  </Text>
                  <Text variant="caption" tone="muted">
                    {member.role}
                  </Text>
                </Stack>
              </Inline>
              <IconButton
                size="sm"
                variant="ghost"
                tone="neutral"
                aria-label={`More actions for ${member.name}`}
              >
                <MoreHorizontalIcon aria-hidden="true" size={16} />
              </IconButton>
            </Inline>
          ))}
        </Stack>

        <Text role="status" variant="caption" tone="muted">
          {status}
        </Text>
      </Stack>
    </Card>
  );
}

function SignInCard() {
  const id = useId();
  const [signedIn, setSignedIn] = useState(false);

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="default"
    >
      <Stack gap={4}>
        <Stack gap="xs">
          <Heading id={`${id}-title`} level={3} size="sm">
            Welcome back
          </Heading>
          <Text variant="caption" tone="muted">
            A compact account surface.
          </Text>
        </Stack>

        <Field.Root density="compact" controlId={`${id}-email`}>
          <Field.Label>Email address</Field.Label>
          <Field.Control>
            <Input type="email" placeholder="you@example.com" />
          </Field.Control>
        </Field.Root>

        <Field.Root density="compact" controlId={`${id}-password`}>
          <Field.Label>Password</Field.Label>
          <Field.Control>
            <Input type="password" placeholder="••••••••" />
          </Field.Control>
        </Field.Root>

        <Button
          size="sm"
          onClick={() => {
            setSignedIn(true);
          }}
        >
          {signedIn ? "Demo session active" : "Sign in"}
        </Button>

        <Text role="status" variant="caption" tone="muted">
          {signedIn
            ? "Signed in locally for this example only."
            : "No credentials leave this page."}
        </Text>
      </Stack>
    </Card>
  );
}

function PerformanceCard() {
  const id = useId();

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="subtle"
      data-showcase-card="performance"
    >
      <Stack gap={4}>
        <Inline justify="between" gap="sm" wrap>
          <Stack gap="xs">
            <Heading id={`${id}-title`} level={3} size="sm">
              Product pulse
            </Heading>
            <Text variant="caption" tone="muted">
              A small operating snapshot.
            </Text>
          </Stack>
          <StatusBadge tone="success">Healthy</StatusBadge>
        </Inline>

        <Grid columns={2} gap={4}>
          <Stack gap={2}>
            <Stat label="MRR" value="$350K" note="+3.2%" />
            <Sparkline
              label="Monthly recurring revenue trend"
              values={[24, 29, 27, 34, 38, 42, 47]}
            />
          </Stack>
          <Stack gap={2}>
            <Stat label="Activation" value="68%" note="+5.4%" />
            <Sparkline
              label="Activation trend"
              values={[44, 48, 47, 53, 58, 63, 68]}
            />
          </Stack>
          <Stat label="Latency" value="146 ms" note="-11 ms" />
          <Stat label="Retention" value="91.4%" note="+1.8%" />
        </Grid>
      </Stack>
    </Card>
  );
}

function NotificationCard() {
  const id = useId();

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="default"
    >
      <Stack gap={4}>
        <Stack gap="xs">
          <Heading id={`${id}-title`} level={3} size="sm">
            Notifications
          </Heading>
          <Text variant="caption" tone="muted">
            Tune the signal, not the noise.
          </Text>
        </Stack>

        {notificationSettings.map((setting) => (
          <Inline key={setting.label} justify="between" gap="md" align="center">
            <Stack gap="xs">
              <Text variant="caption" weight="medium">
                {setting.label}
              </Text>
              <Text variant="caption" tone="muted">
                {setting.description}
              </Text>
            </Stack>
            <Switch
              aria-label={setting.label}
              defaultChecked={setting.checked}
            />
          </Inline>
        ))}
      </Stack>
    </Card>
  );
}

function ProjectCard() {
  const id = useId();

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="elevated"
    >
      <Stack gap={4}>
        <Inline justify="between" gap="sm" wrap>
          <Stack gap="xs">
            <Text variant="caption" tone="muted">
              Launch workspace
            </Text>
            <Heading id={`${id}-title`} level={3} size="sm">
              Northstar
            </Heading>
          </Stack>
          <StatusBadge tone="warning">In review</StatusBadge>
        </Inline>

        <Stack gap={2}>
          <Inline justify="between" gap="sm">
            <Text variant="caption">Release checklist</Text>
            <Text variant="caption" numeric tone="muted">
              7 / 9
            </Text>
          </Inline>
          <Progress
            aria-label="Release checklist completion"
            value={7}
            max={9}
          />
        </Stack>

        <Inline gap="sm" wrap>
          <StatusBadge>Desktop</StatusBadge>
          <StatusBadge>Mobile</StatusBadge>
          <StatusBadge tone="info">Docs</StatusBadge>
        </Inline>

        <Inline gap={3}>
          <UsersIcon aria-hidden="true" size={16} />
          <Text variant="caption" tone="muted">
            Maya, Noah, Ari + 4
          </Text>
        </Inline>
        <Inline gap={3}>
          <CalendarIcon aria-hidden="true" size={16} />
          <Text variant="caption" tone="muted">
            Target · October 8
          </Text>
        </Inline>
      </Stack>
    </Card>
  );
}

function InvoiceCard() {
  const id = useId();
  const [reconciled, setReconciled] = useState(false);

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="subtle"
    >
      <Stack gap={4} align="center">
        <CircleCheckIcon aria-hidden="true" size={28} />
        <Stack gap="xs" align="center">
          <Heading id={`${id}-title`} level={3} size="sm">
            Invoice paid
          </Heading>
          <Text variant="caption" tone="muted" align="center">
            $17,975.30 · receipt #3463
          </Text>
        </Stack>
        <Button
          size="sm"
          variant={reconciled ? "soft" : "solid"}
          startIcon={reconciled ? <CheckIcon size={14} /> : undefined}
          onClick={() => setReconciled(true)}
        >
          {reconciled ? "Reconciled" : "Reconcile payment"}
        </Button>
      </Stack>
    </Card>
  );
}

function ActivityCard() {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const visibleActivity = expanded ? activity : activity.slice(0, 3);

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="default"
    >
      <Stack gap={4}>
        <Inline justify="between" gap="sm" wrap>
          <Stack gap="xs">
            <Heading id={`${id}-title`} level={3} size="sm">
              Recent activity
            </Heading>
            <Text variant="caption" tone="muted">
              What changed while you were away.
            </Text>
          </Stack>
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            endIcon={<ArrowUpRightIcon size={14} />}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : "View all"}
          </Button>
        </Inline>

        <Stack gap={3}>
          {visibleActivity.map((item, index) => (
            <Stack key={item.action} gap={3}>
              {index > 0 ? <Separator /> : null}
              <Inline justify="between" gap="md" align="center">
                <Inline gap={3}>
                  <Avatar alt="" fallback={item.initials} size="sm" />
                  <Stack gap="xs">
                    <Text variant="caption" weight="medium">
                      {item.name}
                    </Text>
                    <Text variant="caption" tone="muted">
                      {item.action}
                    </Text>
                  </Stack>
                </Inline>
                <Text variant="caption" tone="muted" numeric>
                  {item.time}
                </Text>
              </Inline>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

function PlanCard() {
  const id = useId();

  return (
    <Card
      as="article"
      aria-labelledby={`${id}-title`}
      padding={5}
      radius="md"
      surface="elevated"
    >
      <Stack gap={4}>
        <Stack gap="xs">
          <Heading id={`${id}-title`} level={3} size="sm">
            Plans that scale with you
          </Heading>
          <Text variant="caption" tone="muted">
            Clear choices, no comparison maze.
          </Text>
        </Stack>

        <Grid columns={3} gap={3}>
          {[
            ["Basic", "$12", "Solo"],
            ["Growth", "$29", "Teams"],
            ["Pro", "$59", "Scale"],
          ].map(([name, price, note]) => (
            <Stack key={name} gap="xs">
              <Text variant="caption" tone="muted">
                {name}
              </Text>
              <Text variant="lead" weight="bold" numeric>
                {price}
              </Text>
              <Text variant="caption" tone="muted">
                {note}
              </Text>
            </Stack>
          ))}
        </Grid>

        <Inline justify="between" gap="sm" wrap>
          <StatusBadge tone="accent">Monthly</StatusBadge>
          <Text variant="caption" tone="muted">
            Cancel anytime
          </Text>
        </Inline>
      </Stack>
    </Card>
  );
}

export function OverviewShowcaseGrid() {
  return (
    <Stack
      as="section"
      aria-labelledby="overview-showcase-title"
      gap="lg"
      data-overview-showcase=""
    >
      <Stack gap="sm">
        <Text as="p" variant="eyebrow" tone="muted">
          Built from the same public pieces
        </Text>
        <Heading id="overview-showcase-title" level={2} size="md">
          Real app patterns, right on the front page.
        </Heading>
        <Text as="p" tone="muted">
          Accounts, teams, billing, projects, metrics, and settings — compact
          enough to scan, concrete enough to imagine in your own product.
        </Text>
      </Stack>

      <Card padding={5} radius="md" surface="subtle">
        <AppearanceControls />
      </Card>

      <Grid columns={{ base: 1, xl: 3 }} gap="md" align="start">
        <Stack gap="md">
          <TeamCard />
          <NotificationCard />
          <PlanCard />
        </Stack>
        <Stack gap="md">
          <SignInCard />
          <ProjectCard />
          <InvoiceCard />
        </Stack>
        <Stack gap="md">
          <PerformanceCard />
          <ActivityCard />
        </Stack>
      </Grid>

      <Text as="p" variant="caption" tone="muted">
        Fictional data. Interactive controls stay local to this page.
      </Text>
    </Stack>
  );
}
