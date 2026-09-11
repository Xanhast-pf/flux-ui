import { useId, useState, type CSSProperties } from "react";
import { Button, Slider, Toggle } from "@flux-ui/react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
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
    <div className="product-scene music-scene" data-scene="music">
      <SceneHeader brand="afterhours" context="Somewhere, after midnight">
        <span className="scene-session">Session 004 / visual prototype</span>
      </SceneHeader>
      <div className="music-transport">
        <div className="scene-button-row">
          <Button
            size="sm"
            onClick={() => {
              setPlaying((value) => !value);
            }}
            aria-pressed={playing}
          >
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            {playing ? "Pause visual loop" : "Play visual loop"}
          </Button>
          <span className="music-time">
            LOOP 01 <span>/</span> 16 BEATS
          </span>
        </div>
        <span className="music-signature">
          {tempo} BPM <span>4 / 4</span>
          <span>A minor</span>
        </span>
      </div>
      <section
        className="sequencer"
        aria-label="Four-track visual sequencer"
        data-playing={playing}
        style={{ "--loop-duration": `${960 / tempo}s` } as CSSProperties}
      >
        <div className="sequencer-ruler">
          <span>TRACK / INSTRUMENT</span>
          <div>
            <span>01</span>
            <span>02</span>
            <span>03</span>
            <span>04</span>
          </div>
        </div>
        {tracks.map((track) => (
          <div
            className="track-row"
            key={track.id}
            data-channel={track.channel}
            data-muted={
              muted.includes(track.id) || (solo !== null && solo !== track.id)
            }
          >
            <div className="track-info">
              <span className="track-color" aria-hidden="true" />
              <div>
                <strong>{track.name}</strong>
                <small>{track.instrument}</small>
              </div>
              <div className="track-toggles">
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
                >
                  M
                </Toggle>
                <Toggle
                  aria-label={`Solo ${track.name}`}
                  pressed={solo === track.id}
                  onPressedChange={(pressed) => {
                    setSolo(pressed ? track.id : null);
                  }}
                >
                  S
                </Toggle>
              </div>
            </div>
            <div className="track-lane">
              <div
                className="audio-clip"
                style={{
                  marginInlineStart: `${track.start}%`,
                  inlineSize: `${track.length}%`,
                }}
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
          </div>
        ))}
        <div className="sequencer-playhead" aria-hidden="true">
          <span />
        </div>
      </section>
      <div className="music-bottom">
        <section className="scene-panel music-session">
          <p className="scene-kicker">A place for your next idea</p>
          <h3>Stay in the groove.</h3>
          <p className="scene-muted">
            Four layers. A little space. Something entirely yours.
          </p>
          <SceneStatus>
            {playing
              ? "Visual loop playing. This prototype produces no sound."
              : "Silent visual prototype. Press play to move the playhead."}
          </SceneStatus>
          <p className="reduced-motion-note">
            Reduced motion is enabled: the playhead stays still.
          </p>
        </section>
        <section
          className="scene-panel music-mixer"
          aria-label="Session controls"
        >
          <div>
            <label htmlFor={`${id}-tempo`}>
              Tempo <strong>{tempo} BPM</strong>
            </label>
            <Slider
              id={`${id}-tempo`}
              min={60}
              max={180}
              step={1}
              value={tempo}
              onValueChange={setTempo}
            />
          </div>
          <div>
            <label htmlFor={`${id}-volume`}>
              Master level <strong>{volume}%</strong>
            </label>
            <Slider
              id={`${id}-volume`}
              min={0}
              max={100}
              value={volume}
              onValueChange={setVolume}
            />
          </div>
          <div className="master-meter" aria-hidden="true">
            <span style={{ inlineSize: `${volume}%` }} />
          </div>
          <p className="scene-muted">Visual level only · no audio processing</p>
        </section>
      </div>
    </div>
  );
}
