import { useId, useState } from "react";
import { DownloadIcon } from "@flux-ui/icons";
import { Button, Select, Slider, Switch, ToggleGroup } from "@flux-ui/react";
import { downloadJson } from "../../lib/download.js";
import { formatTime } from "../model.js";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
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
  const [aspect, setAspect] = useState("16 / 9");
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
    <div className="product-scene video-scene" data-scene="video">
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
      <div className="video-layout">
        <section className="video-canvas" aria-label="Storyboard preview">
          <div
            className="video-frame"
            data-art={clip.art}
            style={{ aspectRatio: aspect }}
          >
            <div
              className="video-landscape"
              role="img"
              aria-label={`${clip.label}: an illustrated landscape poster, not a video frame`}
            >
              <span className="landscape-sun" />
              <span className="landscape-back" />
              <span className="landscape-front" />
            </div>
            <span className="video-frame-label">FIELD NOTES / 003</span>
            {titles ? <h3>{clip.title}</h3> : null}
            <span className="video-frame-footer">
              An invitation to go a little further.
            </span>
          </div>
          <div className="video-timecode">
            <span>
              {formatTime(seconds)}{" "}
              <span className="scene-muted">/ {formatTime(clip.duration)}</span>
            </span>
            <span className="scene-muted">Illustrated preview · no media</span>
          </div>
        </section>
        <section
          className="scene-panel video-inspector"
          aria-label="Storyboard controls"
        >
          <p className="scene-kicker">The details</p>
          <h3>
            A different frame
            <br />
            of mind.
          </h3>
          <p className="scene-muted">One story. A few ways to tell it.</p>
          <label htmlFor={`${id}-aspect`}>Frame shape</label>
          <Select
            id={`${id}-aspect`}
            value={aspect}
            onChange={(event) => {
              setAspect(event.currentTarget.value);
            }}
          >
            <option value="16 / 9">Widescreen · 16:9</option>
            <option value="1 / 1">Square · 1:1</option>
            <option value="9 / 16">Portrait · 9:16</option>
          </Select>
          <div className="scene-heading-row">
            <label htmlFor={`${id}-titles`}>Show title overlay</label>
            <Switch
              id={`${id}-titles`}
              checked={titles}
              onCheckedChange={setTitles}
            />
          </div>
          <div className="video-selected">
            <span className="scene-kicker">Selected clip</span>
            <strong>{clip.label}</strong>
            <span className="scene-muted">
              {clip.duration} seconds · illustrated
            </span>
          </div>
          <SceneStatus>{status}</SceneStatus>
        </section>
      </div>
      <section className="video-timeline" aria-label="Storyboard timeline">
        <div className="scene-heading-row">
          <label htmlFor={`${id}-position`}>
            Preview position{" "}
            <span className="scene-muted">{Math.round(position)}%</span>
          </label>
          <span className="scene-muted">
            Select a scene to change the picture
          </span>
        </div>
        <Slider
          id={`${id}-position`}
          min={0}
          max={100}
          step={1}
          value={position}
          onValueChange={setPosition}
        />
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
        >
          {clips.map((entry) => (
            <ToggleGroup.Item
              key={entry.id}
              value={entry.id}
              className="video-clip"
              data-art={entry.art}
            >
              <span className="clip-thumbnail" aria-hidden="true" />
              <span>
                {entry.label}
                <small>
                  {entry.duration}s ·{" "}
                  {selected === entry.id ? "Selected" : "Select clip"}
                </small>
              </span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </section>
    </div>
  );
}
