import {
  AlertDialog,
  StatusBadge,
  DropdownMenu,
  Tabs,
  Textarea,
  Toast,
  Tooltip,
  useToast,
  Box,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Knob,
  LevelMeter,
  NumberField,
  Slider,
  Stack,
  Text,
  Toggle,
} from "@flux-ui/react";
import { useId, useState, type CSSProperties } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
import { downloadJson } from "../../lib/download.js";
import {
  createStudioSession,
  sameSession,
  snapshotSession,
  studioExport,
  type StudioSession,
  type TrackId,
  type TrackSettings,
} from "./music.model.js";
import "./music.css";
interface TrackArtwork {
  id: TrackId;
  name: string;
  instrument: string;
  channel: string;
  clip: string;
  start: number;
  length: number;
  bars: number[];
}
const tracks = (
  [
    {
      id: "drums",
      name: "Drum machine",
      instrument: "Analog / 808",
      channel: "one",
      clip: "Pocket groove",
      start: 0,
      length: 96,
      bars: [35, 85, 25, 65, 30, 100, 40, 65, 25, 80, 30, 95, 20, 65, 35, 80],
    },
    {
      id: "bass",
      name: "Sub bass",
      instrument: "Mono / warm",
      channel: "two",
      clip: "Low end theory",
      start: 0,
      length: 72,
      bars: [25, 35, 70, 80, 65, 50, 30, 20, 25, 40, 75, 90, 65, 50, 30, 20],
    },
    {
      id: "keys",
      name: "Midnight keys",
      instrument: "Electric / soft",
      channel: "three",
      clip: "Something like a dream",
      start: 24,
      length: 72,
      bars: [45, 70, 90, 65, 50, 70, 100, 75, 40, 55, 80, 65, 45, 60, 95, 75],
    },
    {
      id: "texture",
      name: "Room tone",
      instrument: "Tape / texture",
      channel: "four",
      clip: "A little atmosphere",
      start: 48,
      length: 48,
      bars: [20, 30, 25, 35, 20, 40, 25, 30, 20, 35, 25, 30, 25, 40, 20, 30],
    },
  ] satisfies TrackArtwork[]
).map((track) => ({
  ...track,
  waveform: track.bars.map((height, index) => ({
    x: index * 10 + 2,
    y: 17 - height * 0.15,
    height: height * 0.3,
  })),
}));
const defaults = createStudioSession();
function MusicWorkspace() {
  const id = useId();
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(defaults.tempo);
  const [channels, setChannels] = useState(
    () => createStudioSession().channels,
  );
  const [selectedTrack, setSelectedTrack] = useState<TrackId>("drums");
  const [notes, setNotes] = useState("");
  const [checkpoint, setCheckpoint] = useState(createStudioSession);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [inspector, setInspector] = useState("session");
  const { notify } = useToast();
  const cutoff = channels[selectedTrack].cutoff;
  function updateChannel(patch: Partial<TrackSettings>) {
    setChannels((current) => ({
      ...current,
      [selectedTrack]: { ...current[selectedTrack], ...patch },
    }));
  }
  function setCutoff(value: number) {
    updateChannel({ cutoff: value });
  }
  const [volume, setVolume] = useState(defaults.volume);
  const [muted, setMuted] = useState<readonly TrackId[]>([]);
  const [solo, setSolo] = useState<TrackId | null>(null);
  const session: StudioSession = {
    tempo,
    volume,
    muted,
    solo,
    channels,
    notes,
  };
  const dirty = !sameSession(session, checkpoint);
  const selectedName =
    tracks.find((track) => track.id === selectedTrack)?.name ?? "Track";
  function restoreCheckpoint() {
    const saved = snapshotSession(checkpoint);
    setTempo(saved.tempo);
    setVolume(saved.volume);
    setMuted(saved.muted);
    setSolo(saved.solo);
    setChannels(saved.channels);
    setNotes(saved.notes);
    setPlaying(false);
    setDiscardOpen(false);
    notify({
      title: "Checkpoint restored",
      description: "Only local interface settings changed.",
    });
  }
  return (
    <AlertDialog.Root open={discardOpen} onOpenChange={setDiscardOpen}>
      <Stack data-scene="music" gap={5} padding={5}>
        <SceneHeader brand="afterhours" context="Somewhere, after midnight">
          <Inline wrap gap="sm">
            <StatusBadge tone={dirty ? "warning" : "success"}>
              {dirty ? "Unsaved local changes" : "Checkpoint current"}
            </StatusBadge>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger size="sm" variant="outline" tone="neutral">
                Session actions
              </DropdownMenu.Trigger>
              <DropdownMenu.Popup aria-label="Session actions">
                <DropdownMenu.Label>
                  Session 004 · local UI simulation
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  onSelect={() => {
                    setCheckpoint(snapshotSession(session));
                    notify({
                      title: "Local checkpoint saved",
                      description:
                        "This checkpoint lasts until the scene is reset or unmounted.",
                      tone: "success",
                    });
                  }}
                >
                  Save local checkpoint
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => {
                    downloadJson(
                      studioExport(session),
                      "afterhours-ui-session.json",
                    );
                    notify({
                      title: "UI settings exported",
                      description: "The JSON contains no audio or media.",
                    });
                  }}
                >
                  Export UI settings
                </DropdownMenu.Item>
              </DropdownMenu.Popup>
            </DropdownMenu.Root>
            <AlertDialog.Trigger disabled={!dirty}>
              Discard unsaved changes
            </AlertDialog.Trigger>
          </Inline>
        </SceneHeader>
        <Inline wrap justify="between" gap="md" paddingBlock="md">
          <Inline wrap gap="sm">
            <Button
              size="sm"
              onClick={() => {
                setPlaying((value) => !value);
              }}
              aria-pressed={playing}
            >
              <Text aria-hidden="true" variant="caption">
                {playing ? "Ⅱ" : "▶"}
              </Text>
              {playing ? "Pause visual loop" : "Play visual loop"}
            </Button>
            <Text variant="caption" numeric>
              LOOP 01 <Text tone="muted">/</Text> 16 BEATS
            </Text>
          </Inline>
          <Inline gap="md" wrap>
            <Text variant="caption" numeric>
              {tempo} BPM
            </Text>
            <Text variant="caption" tone="muted">
              4 / 4
            </Text>
            <Text variant="caption" tone="muted">
              A minor
            </Text>
          </Inline>
        </Inline>
        <Box surface="default" border="all" radius="sm">
          <Stack
            aria-label="Four-track visual sequencer"
            data-playing={playing}
            style={{ "--loop-duration": `${960 / tempo}s` } as CSSProperties}
            className="sequencer"
            as="section"
            gap="none"
          >
            <Grid
              templateColumns={{
                base: "minmax(0, 1fr)",
                md: "17rem minmax(0, 1fr)",
              }}
              responsiveTo="container"
              gap="none"
            >
              <Stack padding={3} gap="none">
                <Text variant="caption" tone="muted">
                  TRACK / INSTRUMENT
                </Text>
              </Stack>
              <Inline justify="between" padding={3} gap="sm">
                <Text variant="caption">01</Text>
                <Text variant="caption">02</Text>
                <Text variant="caption">03</Text>
                <Text variant="caption">04</Text>
              </Inline>
            </Grid>
            <Stack gap="none">
              {tracks.map((track) => (
                <Box
                  key={track.id}
                  data-channel={track.channel}
                  data-muted={
                    muted.includes(track.id) ||
                    (solo !== null && solo !== track.id)
                  }
                  className="track-row"
                  border="bottom"
                >
                  <Grid
                    templateColumns={{
                      base: "minmax(0, 1fr)",
                      md: "17rem minmax(0, 1fr)",
                    }}
                    responsiveTo="container"
                    gap="none"
                  >
                    <Inline gap="sm" padding={3} justify="between">
                      <Inline gap="sm">
                        <span aria-hidden="true" className="track-color" />
                        <Stack gap="xs">
                          <Button
                            size="sm"
                            variant="ghost"
                            tone="neutral"
                            aria-pressed={selectedTrack === track.id}
                            aria-label={`Inspect ${track.name}`}
                            onClick={() => {
                              setSelectedTrack(track.id);
                              setInspector("track");
                            }}
                          >
                            {track.name}
                          </Button>
                          <Text variant="caption" tone="muted">
                            {track.instrument}
                          </Text>
                        </Stack>
                      </Inline>
                      <Inline gap="xs">
                        <Toggle
                          aria-label={`Mute ${track.name}`}
                          pressed={muted.includes(track.id)}
                          onPressedChange={(pressed) => {
                            setMuted((current) =>
                              pressed
                                ? [...current, track.id]
                                : current.filter((entry) => entry !== track.id),
                            );
                          }}
                          size="sm"
                        >
                          M
                        </Toggle>
                        <Toggle
                          aria-label={`Solo ${track.name}`}
                          pressed={solo === track.id}
                          onPressedChange={(pressed) => {
                            setSolo(pressed ? track.id : null);
                          }}
                          size="sm"
                        >
                          S
                        </Toggle>
                      </Inline>
                    </Inline>
                    <Box
                      className="track-lane"
                      paddingBlock="sm"
                      paddingInlineEnd="md"
                    >
                      <Box
                        paddingBlock="sm"
                        paddingInline={3}
                        radius="sm"
                        border="all"
                        style={{
                          marginInlineStart: `${track.start}%`,
                          inlineSize: `${track.length}%`,
                        }}
                        className="audio-clip"
                      >
                        <Stack gap="xs">
                          <Text variant="caption">{track.clip}</Text>
                          <svg
                            viewBox="0 0 160 34"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            {track.waveform.map((mark) => (
                              <rect
                                key={mark.x}
                                x={mark.x}
                                y={mark.y}
                                width="4"
                                height={mark.height}
                                rx="1"
                              />
                            ))}
                          </svg>
                        </Stack>
                      </Box>
                      <div aria-hidden="true" className="sequencer-playhead">
                        <span />
                      </div>
                    </Box>
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
        <Grid
          templateColumns={{
            base: "minmax(0, 1fr)",
            md: "minmax(0, 1.3fr) minmax(0, 1fr)",
          }}
          responsiveTo="container"
          gap="md"
          paddingBlock="md"
        >
          <Card as="section" padding={6} radius="sm">
            <Stack gap={3}>
              <Text as="p" variant="caption" tone="muted">
                A place for your next idea
              </Text>
              <Heading level={3} size="md">
                Stay in the groove.
              </Heading>
              <Text as="p" variant="caption" tone="muted">
                Four layers. A little space. Something entirely yours.
              </Text>
              <SceneStatus>
                {playing
                  ? "Visual loop playing. This prototype produces no sound."
                  : "Silent visual prototype. Press play to move the playhead."}
              </SceneStatus>
              <Text as="p" variant="caption">
                When reduced motion is enabled, the playhead stays still.
              </Text>
            </Stack>
          </Card>
          <Card
            aria-label="Session controls"
            as="section"
            padding={6}
            radius="sm"
          >
            <Stack gap={3}>
              <Heading level={3} size="sm">
                {selectedName} inspector
              </Heading>
              <Tabs.Root
                value={inspector}
                onValueChange={setInspector}
                appearance="pill"
              >
                <Tabs.List aria-label="Studio inspector" wrap>
                  <Tabs.Tab value="session">Session</Tabs.Tab>
                  <Tabs.Tab value="track">Track</Tabs.Tab>
                  <Tabs.Tab value="notes">Notes</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="session" padding="none">
                  <Stack gap="md">
                    <Box>
                      <Field.Root density="compact" controlId={`${id}-tempo`}>
                        <Field.Label>
                          Tempo{" "}
                          <Text as="strong" weight="bold" variant="caption">
                            {tempo} BPM
                          </Text>
                        </Field.Label>
                        <Field.Control>
                          <Slider
                            min={60}
                            max={180}
                            step={1}
                            value={tempo}
                            resetValue={defaults.tempo}
                            onValueChange={setTempo}
                          />
                        </Field.Control>
                      </Field.Root>
                    </Box>
                    <Box>
                      <Field.Root density="compact" controlId={`${id}-volume`}>
                        <Field.Label>
                          Master level{" "}
                          <Text as="strong" weight="bold" variant="caption">
                            {volume}%
                          </Text>
                        </Field.Label>
                        <Field.Control>
                          <Slider
                            orientation="vertical"
                            min={0}
                            max={100}
                            value={volume}
                            resetValue={defaults.volume}
                            onValueChange={setVolume}
                          />
                        </Field.Control>
                      </Field.Root>
                    </Box>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempo(defaults.tempo);
                        setVolume(defaults.volume);
                      }}
                    >
                      Reset session controls
                    </Button>
                    <LevelMeter
                      value={volume}
                      min={0}
                      max={100}
                      peak={90}
                      aria-label="Illustrative master level"
                      orientation="horizontal"
                    />
                    <Field.Root density="compact">
                      <Field.Label>Exact tempo (BPM)</Field.Label>
                      <Field.Control>
                        <NumberField
                          min={60}
                          max={180}
                          step={1}
                          value={tempo}
                          onValueChange={(value) => {
                            if (value !== null)
                              setTempo(Math.max(60, Math.min(180, value)));
                          }}
                        />
                      </Field.Control>
                    </Field.Root>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="track" padding="none">
                  <Stack gap="md">
                    <Field.Root description="UI gain only. This does not change any audio.">
                      <Field.Label>Track gain (dB)</Field.Label>
                      <Field.Control>
                        <Slider
                          orientation="vertical"
                          min={-60}
                          max={6}
                          step={1}
                          resetValue={defaults.channels[selectedTrack].gain}
                          value={channels[selectedTrack].gain}
                          onValueChange={(gain) => updateChannel({ gain })}
                        />
                      </Field.Control>
                    </Field.Root>
                    <Field.Root description="Negative values represent left; positive values represent right.">
                      <Field.Label>Track pan</Field.Label>
                      <Field.Control>
                        <Slider
                          min={-100}
                          max={100}
                          step={1}
                          resetValue={defaults.channels[selectedTrack].pan}
                          value={channels[selectedTrack].pan}
                          onValueChange={(pan) => updateChannel({ pan })}
                        />
                      </Field.Control>
                    </Field.Root>
                    <Text numeric>
                      {channels[selectedTrack].gain} dB · pan{" "}
                      {channels[selectedTrack].pan}
                    </Text>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="notes" padding="none">
                  <Field.Root description="A local production note, included in the exported UI settings. Maximum 500 characters.">
                    <Field.Label>Session notes</Field.Label>
                    <Field.Control>
                      <Textarea
                        value={notes}
                        maxLength={500}
                        onChange={(event) =>
                          setNotes(event.currentTarget.value)
                        }
                        placeholder="What should happen in the next pass?"
                      />
                    </Field.Control>
                  </Field.Root>
                </Tabs.Panel>
              </Tabs.Root>
              <Inline gap="md" align="center" wrap>
                <Knob
                  aria-label="Visual filter cutoff"
                  min={20}
                  max={20000}
                  step={10}
                  scale="log"
                  resetValue={defaults.channels[selectedTrack].cutoff}
                  value={cutoff}
                  onValueChange={setCutoff}
                  formatValue={(value) => `${value.toLocaleString()} Hz`}
                />
                <Text variant="caption" tone="muted">
                  Filter control · silent prototype. Drag vertically or use
                  arrow keys; Shift makes fine changes.
                </Text>
              </Inline>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateChannel(defaults.channels[selectedTrack])}
              >
                Reset track controls
              </Button>
              <Tooltip content="Each track keeps independent gain, pan and cutoff settings. Double-click a control to reset it, or use the Reset buttons. Checkpoints never contain audio.">
                <Button variant="ghost" size="sm" tone="neutral">
                  About these controls
                </Button>
              </Tooltip>
              <Text as="p" variant="caption" tone="muted">
                Visual level only · no audio processing
              </Text>
            </Stack>
          </Card>
        </Grid>
        <AlertDialog.Popup>
          <AlertDialog.Title>
            Discard unsaved interface changes?
          </AlertDialog.Title>
          <AlertDialog.Description>
            Restore the last local checkpoint. No audio, project file or remote
            data is deleted.
          </AlertDialog.Description>
          <Inline wrap gap="sm">
            <AlertDialog.Close>Keep changes</AlertDialog.Close>
            <Button tone="danger" onClick={restoreCheckpoint}>
              Restore checkpoint
            </Button>
          </Inline>
        </AlertDialog.Popup>
        <Toast.Viewport
          placement="inline"
          aria-label="Afterhours notifications"
        />
      </Stack>
    </AlertDialog.Root>
  );
}
export default function MusicScene() {
  return (
    <Toast.Provider>
      <MusicWorkspace />
    </Toast.Provider>
  );
}
