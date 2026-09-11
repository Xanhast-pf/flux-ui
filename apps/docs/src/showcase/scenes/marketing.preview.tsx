import { useId, useState } from "react";
import { ArrowUpRightIcon, SparkIcon } from "@flux-ui/icons";
import { Badge, Button, Input, Select } from "@flux-ui/react";
import { Metric, SceneHeader, SceneStatus } from "../SceneParts.js";
export default function MarketingScene() {
  const id = useId();
  const [headline, setHeadline] = useState("Make room for wonder.");
  const [audience, setAudience] = useState("creators");
  const [launched, setLaunched] = useState(false);
  const empty = headline.trim().length === 0;
  return (
    <div className="product-scene marketing-scene" data-scene="marketing">
      <SceneHeader brand="signal" context="Campaign studio">
        <Badge tone={launched ? "success" : "neutral"}>
          {launched ? "Launched locally" : "Draft campaign"}
        </Badge>
      </SceneHeader>
      <div className="marketing-layout">
        <section className="campaign-poster" aria-label="Live campaign preview">
          <div className="poster-topline">
            <span>OFFSCRIPT / 001</span>
            <SparkIcon size={20} />
          </div>
          <h3>{empty ? "Your next big idea." : headline}</h3>
          <p>
            For{" "}
            {audience === "creators"
              ? "the endlessly curious"
              : "teams that think differently"}
            .<br />A new perspective starts here.
          </p>
          <div className="poster-sculpture" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
          <div className="poster-bottomline">
            <span>A little outside the ordinary.</span>
            <ArrowUpRightIcon size={24} />
          </div>
        </section>
        <section
          className="scene-panel campaign-editor"
          aria-label="Campaign editor"
        >
          <p className="scene-kicker">Make it your own</p>
          <h3>
            The next big thing
            <br />
            starts small.
          </h3>
          <p className="scene-muted">
            A headline. An audience. A reason to pay attention.
          </p>
          <label htmlFor={`${id}-headline`}>Campaign headline</label>
          <Input
            id={`${id}-headline`}
            value={headline}
            maxLength={48}
            onChange={(event) => {
              setHeadline(event.currentTarget.value);
              setLaunched(false);
            }}
          />
          <label htmlFor={`${id}-audience`}>Your audience</label>
          <Select
            id={`${id}-audience`}
            value={audience}
            onChange={(event) => {
              setAudience(event.currentTarget.value);
              setLaunched(false);
            }}
          >
            <option value="creators">Independent creators</option>
            <option value="teams">Creative teams</option>
          </Select>
          <div className="campaign-audience">
            <span className="scene-avatar">A</span>
            <span className="scene-avatar">M</span>
            <span className="scene-avatar">J</span>
            <p>
              Made for your people.<small>Fictional audience preview</small>
            </p>
          </div>
          <Button
            onClick={() => {
              setLaunched(true);
            }}
            disabled={empty || launched}
            endIcon={<ArrowUpRightIcon size={16} />}
          >
            {launched ? "Launched in this demo" : "Launch demo campaign"}
          </Button>
          <SceneStatus>
            {launched
              ? "Your demo campaign is live locally. No message was sent."
              : empty
                ? "Add a headline to launch the demo."
                : "Nothing is sent. Everything is yours to try."}
          </SceneStatus>
        </section>
        <div className="campaign-metrics">
          <Metric
            label="Sample reach"
            value="24.8k"
            note="Illustrative audience"
          />
          <Metric
            label="Sample engagement"
            value="6.4%"
            note="Not a campaign forecast"
          />
          <Metric
            label="Creative direction"
            value="All yours"
            note="Try rewriting the headline ↗"
          />
        </div>
      </div>
    </div>
  );
}
