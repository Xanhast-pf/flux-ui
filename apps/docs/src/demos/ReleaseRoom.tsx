import {
  Badge,
  Button,
  Callout,
  Card,
  Checkbox,
  Collapsible,
  Dialog,
  Field,
  Inline,
  Input,
  Progress,
  Select,
  Separator,
  Slider,
  Stack,
  Switch,
} from "@flux-ui/react";
import { useId, useRef, useState, type FormEvent } from "react";
const initialTasks = [
  {
    id: "types",
    label: "Review the public API",
    done: true,
  },
  {
    id: "keyboard",
    label: "Try the keyboard path",
    done: false,
  },
  {
    id: "size",
    label: "Inspect the bundle budget",
    done: false,
  },
];
export function ReleaseRoom() {
  const id = useId();
  const taskFormRef = useRef<HTMLFormElement>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [environment, setEnvironment] = useState("preview");
  const [traffic, setTraffic] = useState(25);
  const [notifications, setNotifications] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receipt, setReceipt] = useState("");
  const complete = tasks.filter((task) => task.done).length;
  function addTask(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const value = new FormData(form).get("task");
    if (typeof value !== "string" || value.trim() === "") return;
    const task = {
      id: crypto.randomUUID(),
      label: value.trim(),
      done: false,
    };
    setTasks((current) => [...current, task]);
    setReceipt("");
    form.reset();
  }
  function reset(): void {
    taskFormRef.current?.reset();
    setTasks(initialTasks);
    setEnvironment("preview");
    setTraffic(25);
    setNotifications(true);
    setReceipt("");
  }
  return (
    <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
      <Card className="release-room">
        <Stack gap="lg">
          <Inline justify="between" wrap>
            <div>
              <p className="eyebrow">Your next good idea</p>
              <h2>Release room</h2>
            </div>
            <Badge tone={receipt ? "success" : "accent"}>
              {receipt ? "Demo complete" : "Interactive demo"}
            </Badge>
          </Inline>
          <p className="muted">
            A tiny workspace made entirely from Flux pieces. Check things off.
            Turn things on. Ship a pretend release.
          </p>
          <div className="release-progress">
            <Inline justify="between">
              <strong>Ready when you are</strong>
              <span>
                {complete} / {tasks.length}
              </span>
            </Inline>
            <Progress
              aria-label="Demo release checklist"
              value={complete}
              max={tasks.length}
            />
          </div>
          <Stack gap="sm">
            {tasks.map((task) => (
              <Field.Root key={task.id} controlId={`${id}-${task.id}`}>
                <Inline
                  gap="sm"
                  className="task-row"
                  data-done={task.done || undefined}
                >
                  <Field.Control>
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={(done) => {
                        setTasks((current) =>
                          current.map((entry) =>
                            entry.id === task.id ? { ...entry, done } : entry,
                          ),
                        );
                        setReceipt("");
                      }}
                    />
                  </Field.Control>
                  <Field.Label>{task.label}</Field.Label>
                </Inline>
              </Field.Root>
            ))}
          </Stack>
          <form
            ref={taskFormRef}
            aria-label="Add a demo task"
            onSubmit={addTask}
          >
            <Inline gap="sm" className="add-task-row">
              <Input
                aria-label="New task"
                name="task"
                placeholder="One more thing…"
                maxLength={80}
                required
              />
              <Button type="submit" variant="outline">
                Add task
              </Button>
            </Inline>
          </form>
          <Separator decorative />
          <div className="control-grid">
            <Field.Root>
              <Field.Label>Demo environment</Field.Label>
              <Field.Control>
                <Select
                  value={environment}
                  onChange={(event) => {
                    setEnvironment(event.currentTarget.value);
                    setReceipt("");
                  }}
                >
                  <option value="preview">Preview</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production (demo)</option>
                </Select>
              </Field.Control>
            </Field.Root>
            <Field.Root>
              <Field.Label>Demo traffic: {traffic}%</Field.Label>
              <Field.Control>
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={traffic}
                  onValueChange={(value) => {
                    setTraffic(value);
                    setReceipt("");
                  }}
                />
              </Field.Control>
            </Field.Root>
          </div>
          <Field.Root>
            <Inline justify="between" gap="md">
              <Field.Label>Release notifications</Field.Label>
              <Field.Control>
                <Switch
                  checked={notifications}
                  onCheckedChange={(value) => {
                    setNotifications(value);
                    setReceipt("");
                  }}
                />
              </Field.Control>
            </Inline>
            <Field.Description>
              {notifications
                ? "Demo notifications are on. No real messages are sent."
                : "Demo notifications are off."}
            </Field.Description>
          </Field.Root>
          <Inline gap="sm" wrap>
            <Dialog.Trigger disabled={complete !== tasks.length}>
              Review demo release
            </Dialog.Trigger>
            <Button variant="ghost" tone="neutral" onClick={reset}>
              Reset demo
            </Button>
          </Inline>
          <p className="demo-help">
            Finish the checklist to enable the release action. These are demo
            tasks, not real CI results.
          </p>
          <p className="demo-receipt" role="status">
            {receipt}
          </p>
          <Collapsible.Root>
            <Collapsible.Trigger>What is this built with?</Collapsible.Trigger>
            <Collapsible.Content>
              <p>
                Card, Badge, Checkbox, Field, Input, Select, Slider, Switch,
                Progress, Separator, Button, Collapsible and Dialog. No
                application backend or external UI library.
              </p>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Card>
      <Dialog.Popup>
        <Dialog.Title>Ready to ship this demo?</Dialog.Title>
        <Dialog.Description>
          Record a local demo release to {environment} at {traffic}% traffic.
          Nothing is deployed or sent anywhere.
        </Dialog.Description>
        <Callout tone="info">
          This action only updates the preview in this tab.
        </Callout>
        <Inline gap="sm" wrap>
          <Button
            onClick={() => {
              setReceipt(
                `Demo release recorded for ${environment} at ${traffic}% traffic. Notifications ${notifications ? "on" : "off"}.`,
              );
              setConfirmOpen(false);
            }}
          >
            Confirm demo release
          </Button>
          <Dialog.Close>Keep editing</Dialog.Close>
        </Inline>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
