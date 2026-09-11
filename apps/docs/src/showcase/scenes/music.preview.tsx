import {
  Box,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Meter,
  Slider,
  Stack,
  Text,
  Toggle,
} from "@flux-ui/react";
import { useId, useState, type CSSProperties } from "react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
import "./music.css";
const tracks = [
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
].map((track) => ({
  ...track,
  waveform: track.bars.map((height, index) => ({
    x: index * 10 + 2,
    y: 17 - height * 0.15,
    height: height * 0.3,
  })),
}));
export default function MusicScene() {
  const id = useId();
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(108);
  const [volume, setVolume] = useState(72);
  const [muted, setMuted] = useState<readonly string[]>([]);
  const [solo, setSolo] = useState<string | null>(null);
  return (
    <Stack data-scene="music" gap={5} padding={5}>
      <SceneHeader brand="afterhours" context="Somewhere, after midnight">
        <Text variant="caption" tone="muted">
          Session 004 / visual prototype
        </Text>
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
          <Text className="music-time" variant="caption">
            LOOP 01 <Text>/</Text> 16 BEATS
          </Text>
        </Inline>
        <Text className="music-signature" variant="caption">
          {tempo} BPM <Text>4 / 4</Text>
          <Text>A minor</Text>
        </Text>
      </Inline>
      <Stack
        aria-label="Four-track visual sequencer"
        data-playing={playing}
        style={{ "--loop-duration": `${960 / tempo}s` } as CSSProperties}
        className="sequencer"
        as="section"
        gap="lg"
      >
        <Box className="sequencer-ruler">
          <Text variant="caption">TRACK / INSTRUMENT</Text>
          <Box>
            <Text variant="caption">01</Text>
            <Text variant="caption">02</Text>
            <Text variant="caption">03</Text>
            <Text variant="caption">04</Text>
          </Box>
        </Box>
        {tracks.map((track) => (
          <Box
            key={track.id}
            data-channel={track.channel}
            data-muted={
              muted.includes(track.id) || (solo !== null && solo !== track.id)
            }
            className="track-row"
          >
            <Inline className="track-info" gap="sm" padding={3}>
              <span aria-hidden="true" className="track-color" />
              <Box>
                <Text as="strong" weight="bold" variant="caption">
                  {track.name}
                </Text>
                <Text as="small" variant="caption">
                  {track.instrument}
                </Text>
              </Box>
              <Inline className="track-toggles" gap="xs">
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
            <div className="track-lane">
              <div
                style={{
                  marginInlineStart: `${track.start}%`,
                  inlineSize: `${track.length}%`,
                }}
                className="audio-clip"
              >
                <span>{track.clip}</span>
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
              </div>
            </div>
          </Box>
        ))}
        <div aria-hidden="true" className="sequencer-playhead">
          <span />
        </div>
      </Stack>
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
            <Text className="reduced-motion-note" as="p" variant="caption">
              Reduced motion is enabled: the playhead stays still.
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
                    min={0}
                    max={100}
                    value={volume}
                    onValueChange={setVolume}
                  />
                </Field.Control>
              </Field.Root>
            </Box>
            <Meter value={volume} min={0} max={100} aria-hidden="true" />
            <Text as="p" variant="caption" tone="muted">
              Visual level only · no audio processing
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}
