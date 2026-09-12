import { DownloadIcon } from "@flux-ui/icons";
import {
  AspectRatio,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  ToggleGroup,
} from "@flux-ui/react";
import { useId, useState } from "react";
import { downloadJson } from "../../lib/download.js";
import { formatTime } from "../model.js";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
import "./video.css";
const aspectRatios = {
  "16 / 9": 16 / 9,
  "1 / 1": 1,
  "9 / 16": 9 / 16,
} as const;
type FrameShape = keyof typeof aspectRatios;
const clips = [
  {
    id: "coast",
    title: "The open water",
    duration: 12,
    label: "01 / Coastline",
    art: "coast",
  },
  {
    id: "dunes",
    title: "Take the long way",
    duration: 8,
    label: "02 / Dunes",
    art: "dunes",
  },
  {
    id: "night",
    title: "Stay a little longer",
    duration: 14,
    label: "03 / Afterglow",
    art: "night",
  },
] as const;
export default function VideoScene() {
  const id = useId();
  const [selected, setSelected] = useState("coast");
  const [position, setPosition] = useState(0);
  const [titles, setTitles] = useState(true);
  const [aspect, setAspect] = useState<FrameShape>("16 / 9");
  const [status, setStatus] = useState(
    "Illustrated storyboard. No video file is loaded.",
  );
  const clip = clips.find((entry) => entry.id === selected) ?? clips[0];
  const seconds = (position / 100) * clip.duration;
  function exportNotes(): void {
    try {
      downloadJson(
        {
          schemaVersion: 1,
          kind: "illustrated-storyboard-demo",
          clip: clip.id,
          positionSeconds: seconds,
          aspectRatio: aspect,
          titles,
          clips,
        },
        "cutroom-demo-edit.json",
      );
      setStatus("Edit notes prepared as JSON. No video was rendered.");
    } catch {
      setStatus(
        "The browser could not prepare the download. Try again from a regular browser tab.",
      );
    }
  }
  return (
    <Stack data-scene="video" gap={5} padding={5}>
      <SceneHeader brand="cutroom" context="A little further / edit 03">
        <Button
          size="sm"
          variant="outline"
          startIcon={<DownloadIcon size={14} />}
          onClick={exportNotes}
        >
          Export edit notes
        </Button>
      </SceneHeader>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1.75fr) minmax(0, 1fr)",
        }}
        responsiveTo="container"
        gap="md"
        align="start"
      >
        <Stack
          aria-label="Storyboard preview"
          as="section"
          gap={3}
          align="center"
        >
          <AspectRatio
            data-art={clip.art}
            ratio={aspectRatios[aspect]}
            className="video-frame"
            style={{
              maxInlineSize:
                aspect === "9 / 16"
                  ? "18rem"
                  : aspect === "1 / 1"
                    ? "28rem"
                    : "100%",
            }}
          >
            <div
              role="img"
              aria-label={`${clip.label}: an illustrated landscape poster, not a video frame`}
              className="video-landscape"
            >
              <span className="landscape-sun" />
              <span className="landscape-back" />
              <span className="landscape-front" />
            </div>
            <Text className="video-frame-label" variant="caption">
              FIELD NOTES / 003
            </Text>
            {titles ? (
              <Heading level={3} size="md" style={{ color: "inherit" }}>
                {clip.title}
              </Heading>
            ) : null}
            <Text className="video-frame-footer" variant="caption">
              An invitation to go a little further.
            </Text>
          </AspectRatio>
          <Inline
            justify="between"
            wrap
            gap="sm"
            style={{ inlineSize: "100%" }}
          >
            <Text variant="caption">
              {formatTime(seconds)}{" "}
              <Text variant="caption" tone="muted">
                / {formatTime(clip.duration)}
              </Text>
            </Text>
            <Text variant="caption" tone="muted">
              Illustrated preview · no media
            </Text>
          </Inline>
        </Stack>
        <Card
          aria-label="Storyboard controls"
          as="section"
          padding={6}
          radius="sm"
        >
          <Stack gap={3}>
            <Text as="p" variant="caption" tone="muted">
              The details
            </Text>
            <Heading level={3} size="md">
              A different frame
              <br />
              of mind.
            </Heading>
            <Text as="p" variant="caption" tone="muted">
              One story. A few ways to tell it.
            </Text>
            <Field.Root density="compact" controlId={`${id}-aspect`}>
              <Field.Label>Frame shape</Field.Label>
              <Field.Control>
                <Select
                  value={aspect}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    if (
                      value === "16 / 9" ||
                      value === "1 / 1" ||
                      value === "9 / 16"
                    )
                      setAspect(value);
                  }}
                >
                  <option value="16 / 9">Widescreen · 16:9</option>
                  <option value="1 / 1">Square · 1:1</option>
                  <option value="9 / 16">Portrait · 9:16</option>
                </Select>
              </Field.Control>
            </Field.Root>
            <Inline justify="between" wrap gap={3}>
              <Field.Root density="compact" controlId={`${id}-titles`}>
                <Field.Label>Show title overlay</Field.Label>
                <Field.Control>
                  <Switch checked={titles} onCheckedChange={setTitles} />
                </Field.Control>
              </Field.Root>
            </Inline>
            <Stack gap="sm" padding={3}>
              <Text variant="caption" tone="muted">
                Selected clip
              </Text>
              <Text as="strong" weight="bold" variant="caption">
                {clip.label}
              </Text>
              <Text variant="caption" tone="muted">
                {clip.duration} seconds · illustrated
              </Text>
            </Stack>
            <SceneStatus>{status}</SceneStatus>
          </Stack>
        </Card>
      </Grid>
      <Stack
        aria-label="Storyboard timeline"
        as="section"
        gap="md"
        paddingBlock={5}
      >
        <Field.Root density="compact" controlId={`${id}-position`}>
          <Field.Label>Preview position {Math.round(position)}%</Field.Label>
          <Field.Control>
            <Slider
              min={0}
              max={100}
              step={1}
              value={position}
              onValueChange={setPosition}
            />
          </Field.Control>
          <Field.Description>
            Select a scene to change the picture.
          </Field.Description>
        </Field.Root>
        <ToggleGroup.Root
          type="single"
          value={selected}
          onValueChange={(value) => {
            if (value !== null && clips.some((entry) => entry.id === value)) {
              setSelected(value);
              setPosition(0);
            }
          }}
          aria-label="Storyboard clips"
          className="video-clips"
          size="sm"
        >
          {clips.map((entry) => (
            <ToggleGroup.Item
              key={entry.id}
              value={entry.id}
              data-art={entry.art}
              className="video-clip"
            >
              <span aria-hidden="true" className="clip-thumbnail" />
              <Stack as="span" gap="xs" align="start">
                <Text variant="caption">{entry.label}</Text>
                <Text variant="caption" tone="muted" weight="regular">
                  {entry.duration}s ·{" "}
                  {selected === entry.id ? "Selected" : "Select clip"}
                </Text>
              </Stack>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </Stack>
    </Stack>
  );
}
