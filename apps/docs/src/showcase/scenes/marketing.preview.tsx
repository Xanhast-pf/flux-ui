import { ArrowUpRightIcon, SparkIcon } from "@flux-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  Select,
  Stack,
  Text,
} from "@flux-ui/react";
import { useId, useState } from "react";
import {
  artworkInkStyle,
  Metric,
  SceneHeader,
  SceneStatus,
} from "../SceneParts.js";
import "./marketing.css";
export default function MarketingScene() {
  const id = useId();
  const [headline, setHeadline] = useState("Make room for wonder.");
  const [audience, setAudience] = useState("creators");
  const [launched, setLaunched] = useState(false);
  const empty = headline.trim().length === 0;
  return (
    <Stack data-scene="marketing" gap={5} padding={5}>
      <SceneHeader brand="signal" context="Campaign studio">
        <Badge tone={launched ? "success" : "neutral"}>
          {launched ? "Launched locally" : "Draft campaign"}
        </Badge>
      </SceneHeader>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1.4fr) minmax(0, 1fr)",
        }}
        responsiveTo="container"
        gap="md"
      >
        <Stack
          aria-label="Live campaign preview"
          className="campaign-poster"
          style={artworkInkStyle}
          as="section"
          gap={5}
          padding={8}
        >
          <Inline className="poster-topline" justify="between" gap="md">
            <Text variant="caption">OFFSCRIPT / 001</Text>
            <SparkIcon size={20} />
          </Inline>
          <Heading level={3} size="md">
            {empty ? "Your next big idea." : headline}
          </Heading>
          <Text as="p" variant="caption">
            For{" "}
            {audience === "creators"
              ? "the endlessly curious"
              : "teams that think differently"}
            .<br />A new perspective starts here.
          </Text>
          <div aria-hidden="true" className="poster-sculpture">
            <div />
            <div />
            <div />
          </div>
          <Inline className="poster-bottomline" justify="between" gap="md">
            <Text variant="caption">A little outside the ordinary.</Text>
            <ArrowUpRightIcon size={24} />
          </Inline>
        </Stack>
        <Card aria-label="Campaign editor" as="section" padding={6} radius="sm">
          <Stack gap={3}>
            <Text as="p" variant="caption" tone="muted">
              Make it your own
            </Text>
            <Heading level={3} size="md">
              The next big thing
              <br />
              starts small.
            </Heading>
            <Text as="p" variant="caption" tone="muted">
              A headline. An audience. A reason to pay attention.
            </Text>
            <Field.Root density="compact" controlId={`${id}-headline`}>
              <Field.Label>Campaign headline</Field.Label>
              <Field.Control>
                <Input
                  value={headline}
                  maxLength={48}
                  onChange={(event) => {
                    setHeadline(event.currentTarget.value);
                    setLaunched(false);
                  }}
                />
              </Field.Control>
            </Field.Root>
            <Field.Root density="compact" controlId={`${id}-audience`}>
              <Field.Label>Your audience</Field.Label>
              <Field.Control>
                <Select
                  value={audience}
                  onChange={(event) => {
                    setAudience(event.currentTarget.value);
                    setLaunched(false);
                  }}
                >
                  <option value="creators">Independent creators</option>
                  <option value="teams">Creative teams</option>
                </Select>
              </Field.Control>
            </Field.Root>
            <Inline gap="md" wrap>
              <AvatarGroup aria-label="Fictional audience members">
                <Avatar alt="Alex" fallback="A" size="sm" />
                <Avatar alt="Mira" fallback="M" size="sm" />
                <Avatar alt="Jules" fallback="J" size="sm" />
              </AvatarGroup>
              <Text as="p" variant="caption">
                Made for your people.
                <Text as="small" variant="caption">
                  Fictional audience preview
                </Text>
              </Text>
            </Inline>
            <Button
              onClick={() => {
                setLaunched(true);
              }}
              disabled={empty || launched}
              endIcon={<ArrowUpRightIcon size={16} />}
              size="sm"
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
          </Stack>
        </Card>
        <Grid.Item colSpan="full">
          <Grid
            columns={{ base: 1, sm: 3 }}
            responsiveTo="container"
            gap="md"
            padding={6}
          >
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
          </Grid>
        </Grid.Item>
      </Grid>
    </Stack>
  );
}
