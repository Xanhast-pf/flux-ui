import { SaveIcon } from "@flux-ui/icons";
import {
  Accordion,
  AlertDialog,
  Avatar,
  Button,
  Card,
  Collapsible,
  DateTimePicker,
  Field,
  Grid,
  Heading,
  Indicator,
  Inline,
  Progress,
  RadioGroup,
  Stack,
  StatusBadge,
  Stepper,
  Tag,
  Text,
  Textarea,
  TimePicker,
  Toast,
  Toolbar,
  TreeView,
  useToast,
} from "@flux-ui/react";
import { useState } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";

function ServiceWorkspace() {
  const { notify } = useToast();
  const [priority, setPriority] = useState("high");
  const [reply, setReply] = useState(
    "Thanks for the report. I’m checking the sync logs.",
  );
  const [closed, setClosed] = useState(false);
  const [status, setStatus] = useState(
    "Ticket is open and assigned to Support.",
  );

  return (
    <Stack data-scene="service-desk" gap="lg" padding={5}>
      <SceneHeader brand="Relay" context="Service desk">
        <Indicator content={7} tone="danger" placement="top-end">
          <Button
            aria-label="Inbox, 7 urgent tickets"
            size="sm"
            variant="outline"
          >
            Urgent
          </Button>
        </Indicator>
        <Button
          size="sm"
          startIcon={<SaveIcon size={14} />}
          onClick={() => setStatus("Ticket draft saved locally.")}
        >
          Save draft
        </Button>
      </SceneHeader>

      <Stack gap="xs">
        <Heading level={3} size="lg">
          Support workspace
        </Heading>
        <Text tone="muted">
          Triage the queue, protect the SLA, and keep customer context close.
        </Text>
      </Stack>

      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(14rem, 0.55fr) minmax(0, 1.45fr)",
        }}
        responsiveTo="container"
        gap="md"
        align="start"
      >
        <Card as="nav" aria-label="Support queue" padding={5}>
          <Stack gap="md">
            <Inline justify="between" gap="sm">
              <Heading level={4} size="md">
                Queue
              </Heading>
              <StatusBadge tone="warning">23 open</StatusBadge>
            </Inline>
            <TreeView.Root
              aria-label="Support queues"
              defaultExpandedItems={["inbox", "priority"]}
            >
              <TreeView.Item value="inbox" label="Inbox">
                <TreeView.Item value="priority" label="Priority">
                  <TreeView.Item value="priority/vip" label="VIP customers" />
                  <TreeView.Item value="priority/sla" label="SLA at risk" />
                </TreeView.Item>
                <TreeView.Item value="billing" label="Billing" />
                <TreeView.Item value="product" label="Product" />
              </TreeView.Item>
              <TreeView.Item value="resolved" label="Recently resolved" />
            </TreeView.Root>
            <Text variant="caption" tone="muted">
              Arrow keys navigate the real tree widget.
            </Text>
          </Stack>
        </Card>

        <Stack gap="md">
          <Card padding={5}>
            <Stack gap="md">
              <Inline justify="between" wrap gap="md">
                <Inline gap="sm">
                  <Avatar alt="" fallback="ML" />
                  <Stack gap="xs">
                    <Inline wrap gap="sm">
                      <Heading level={4} size="md">
                        Sync stopped after workspace migration
                      </Heading>
                      {closed ? (
                        <StatusBadge>Closed</StatusBadge>
                      ) : (
                        <StatusBadge tone="warning">Open</StatusBadge>
                      )}
                    </Inline>
                    <Text tone="muted">
                      Mara Li · Northwind Studio · 12 minutes ago
                    </Text>
                  </Stack>
                </Inline>
                <Inline wrap gap="sm">
                  <Tag tone="accent">Enterprise</Tag>
                  <Tag>Sync</Tag>
                </Inline>
              </Inline>

              <Progress aria-label="SLA time consumed" value={68} />
              <Text variant="caption" tone="muted">
                68% of first-response SLA consumed · 38 minutes remaining
              </Text>

              <Stepper.Root aria-label="Ticket workflow">
                <Stepper.Item status="complete">Received</Stepper.Item>
                <Stepper.Item status="complete">Triaged</Stepper.Item>
                <Stepper.Item status={closed ? "complete" : "current"}>
                  Investigating
                </Stepper.Item>
                <Stepper.Item status={closed ? "current" : undefined}>
                  Resolved
                </Stepper.Item>
              </Stepper.Root>
            </Stack>
          </Card>

          <Grid columns={{ base: 1, md: 2 }} responsiveTo="container" gap="md">
            <Card padding={5}>
              <Stack gap="md">
                <Heading level={4} size="md">
                  Conversation
                </Heading>
                <Text>
                  “We migrated our workspace this morning. New files appear, but
                  existing projects stopped syncing for three teammates.”
                </Text>
                <Accordion.Root type="multiple">
                  <Accordion.Item open>
                    <Accordion.Trigger>Customer context</Accordion.Trigger>
                    <Accordion.Content>
                      42 seats · annual plan · 3 active workspaces · last
                      incident 94 days ago.
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Trigger>Recent events</Accordion.Trigger>
                    <Accordion.Content>
                      Workspace migrated, member permissions copied, sync token
                      refreshed.
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
                <Collapsible.Root>
                  <Collapsible.Trigger>Technical details</Collapsible.Trigger>
                  <Collapsible.Content>
                    <Text variant="caption" tone="muted">
                      Region ca-east · client 6.4.2 · migration job demo_8421 ·
                      no real logs attached.
                    </Text>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Stack>
            </Card>

            <Card padding={5}>
              <Stack gap="md">
                <Heading level={4} size="md">
                  Triage
                </Heading>
                <RadioGroup.Root
                  name="priority"
                  value={priority}
                  onValueChange={setPriority}
                >
                  <RadioGroup.Legend>Priority</RadioGroup.Legend>
                  <Stack gap="sm">
                    <Field.Root controlId="relay-normal">
                      <Inline gap="sm">
                        <Field.Control>
                          <RadioGroup.Item value="normal" />
                        </Field.Control>
                        <Field.Label>Normal</Field.Label>
                      </Inline>
                    </Field.Root>
                    <Field.Root controlId="relay-high">
                      <Inline gap="sm">
                        <Field.Control>
                          <RadioGroup.Item value="high" />
                        </Field.Control>
                        <Field.Label>High</Field.Label>
                      </Inline>
                    </Field.Root>
                    <Field.Root controlId="relay-urgent">
                      <Inline gap="sm">
                        <Field.Control>
                          <RadioGroup.Item value="urgent" />
                        </Field.Control>
                        <Field.Label>Urgent</Field.Label>
                      </Inline>
                    </Field.Root>
                  </Stack>
                </RadioGroup.Root>
                <Field.Root>
                  <Field.Label>Follow-up</Field.Label>
                  <Field.Control>
                    <DateTimePicker defaultValue="2026-10-07T18:30" />
                  </Field.Control>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Shift handoff</Field.Label>
                  <Field.Control>
                    <TimePicker defaultValue="19:00" />
                  </Field.Control>
                </Field.Root>
              </Stack>
            </Card>
          </Grid>

          <Card padding={5}>
            <Stack gap="md">
              <Toolbar.Root aria-label="Reply tools">
                <Toolbar.Button
                  onClick={() =>
                    setReply(
                      (value) =>
                        `${value} I’ve attached the migration checklist.`,
                    )
                  }
                >
                  Add checklist note
                </Toolbar.Button>
                <Toolbar.Separator />
                <Toolbar.Button onClick={() => setReply("")}>
                  Clear
                </Toolbar.Button>
              </Toolbar.Root>
              <Field.Root>
                <Field.Label>Reply to Mara</Field.Label>
                <Field.Control>
                  <Textarea
                    value={reply}
                    onChange={(event) => setReply(event.currentTarget.value)}
                    rows={4}
                  />
                </Field.Control>
              </Field.Root>
              <Inline justify="between" wrap gap="sm">
                <Button
                  disabled={reply.trim().length === 0 || closed}
                  onClick={() => {
                    notify({
                      title: "Reply sent locally",
                      description: "No customer message was transmitted.",
                      tone: "success",
                    });
                    setStatus("Reply recorded in local demo state.");
                  }}
                >
                  Send demo reply
                </Button>
                <AlertDialog.Root>
                  <AlertDialog.Trigger disabled={closed}>
                    Close ticket
                  </AlertDialog.Trigger>
                  <AlertDialog.Popup>
                    <AlertDialog.Title>
                      Close this fictional ticket?
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      No remote support record will change.
                    </AlertDialog.Description>
                    <Inline wrap gap="sm">
                      <AlertDialog.Cancel>Keep open</AlertDialog.Cancel>
                      <AlertDialog.Action
                        onClick={() => {
                          setClosed(true);
                          setStatus("Ticket closed locally.");
                        }}
                      >
                        Close ticket
                      </AlertDialog.Action>
                    </Inline>
                  </AlertDialog.Popup>
                </AlertDialog.Root>
              </Inline>
            </Stack>
          </Card>
        </Stack>
      </Grid>

      <SceneStatus>{`${status} Priority: ${priority}.`}</SceneStatus>
      <Toast.Viewport placement="inline" aria-label="Relay notifications" />
    </Stack>
  );
}

export default function ServiceDeskScene() {
  return (
    <Toast.Provider>
      <ServiceWorkspace />
    </Toast.Provider>
  );
}
