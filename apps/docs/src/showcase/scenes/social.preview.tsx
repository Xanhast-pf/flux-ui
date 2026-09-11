import { ArrowUpRightIcon, PlusIcon, StarIcon } from "@flux-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Stack,
  Text,
  Textarea,
  Toggle,
} from "@flux-ui/react";
import { useId, useRef, useState } from "react";
import { artworkInkStyle, SceneHeader, SceneStatus } from "../SceneParts.js";
import "./social.css";
interface Post {
  id: string;
  name: string;
  initials: string;
  text: string;
  liked: boolean;
  likes: number;
}
const startingPosts: Post[] = [
  {
    id: "mira",
    name: "Mira Chen",
    initials: "MC",
    text: "A reminder to make something just because it makes you happy. No brief required.",
    liked: false,
    likes: 24,
  },
];
const maximumPosts = 4;
export default function SocialScene() {
  const id = useId();
  const nextId = useRef(1);
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState(startingPosts);
  const [following, setFollowing] = useState(false);
  const [message, setMessage] = useState(
    "Your words stay in this demo. Be yourself.",
  );
  function addPost(): void {
    const text = draft.trim();
    if (text.length === 0 || posts.length >= maximumPosts) return;
    const post: Post = {
      id: `you-${nextId.current++}`,
      name: "You",
      initials: "YO",
      text,
      liked: false,
      likes: 0,
    };
    setPosts((current) => [post, ...current]);
    setDraft("");
    setMessage("Posted to the local demo feed. Nothing was shared online.");
  }
  return (
    <Stack data-scene="social" gap={5} padding={5}>
      <SceneHeader brand="gather" context="Good people. Good ideas.">
        <Text variant="caption" tone="muted">
          The creative corner
        </Text>
        <Avatar alt="Your demo profile" fallback="YO" size="sm" />
      </SceneHeader>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1.75fr) minmax(0, 1fr)",
        }}
        responsiveTo="container"
        gap="md"
      >
        <Stack gap="md">
          <Stack
            aria-label="Community spotlight"
            className="gather-editorial"
            style={artworkInkStyle}
            as="section"
            gap="lg"
          >
            <Box>
              <Text as="p" variant="caption" tone="muted">
                The weekly prompt / 024
              </Text>
              <Heading level={3} size="md">
                Make something
                <br />
                <Text as="em">just because.</Text>
              </Heading>
              <Text as="p" variant="caption">
                No brief. No deadline. Just a little curiosity.
              </Text>
            </Box>
            <div aria-hidden="true" className="gather-flower">
              <span />
              <span />
              <span />
              <span />
            </div>
            <Text className="editorial-footnote" variant="caption">
              A small invitation to play.
            </Text>
          </Stack>
          <Card
            onSubmit={(event) => {
              event.preventDefault();
              addPost();
            }}
            as="form"
            padding={6}
            radius="sm"
          >
            <Stack gap={3}>
              <Field.Root density="compact" controlId={`${id}-post`}>
                <Field.Label>What are you working on?</Field.Label>
                <Field.Control>
                  <Textarea
                    placeholder="An idea, a work in progress, a little win…"
                    value={draft}
                    maxLength={280}
                    rows={2}
                    onChange={(event) => {
                      setDraft(event.currentTarget.value);
                    }}
                    aria-describedby={`${id}-limit`}
                  />
                </Field.Control>
              </Field.Root>
              <Inline justify="between" wrap gap={3}>
                <Text id={`${id}-limit`} variant="caption" tone="muted">
                  {draft.length} / 280 ·{" "}
                  {posts.length === maximumPosts
                    ? "Demo feed full; reset to start again"
                    : "Local posts only"}
                </Text>
                <Button
                  size="sm"
                  type="submit"
                  disabled={
                    draft.trim().length === 0 || posts.length >= maximumPosts
                  }
                >
                  Post to demo feed
                </Button>
              </Inline>
              <SceneStatus>{message}</SceneStatus>
            </Stack>
          </Card>
          <Stack gap="md">
            {posts.map((post) => (
              <Card key={post.id} as="article" padding={6} radius="sm">
                <Stack gap={3}>
                  <Inline gap={3}>
                    <Avatar alt="" fallback={post.initials} size="sm" />
                    <Box>
                      <Text as="strong" weight="bold" variant="caption">
                        {post.name}
                      </Text>
                      <Text variant="caption">
                        {post.name === "You"
                          ? "Just now · local demo"
                          : "Designer · fictional profile"}
                      </Text>
                    </Box>
                  </Inline>
                  <Text as="p" variant="caption">
                    {post.text}
                  </Text>
                  <Toggle
                    aria-label={`Like post ${post.id}`}
                    pressed={post.liked}
                    onPressedChange={(liked) => {
                      setPosts((current) =>
                        current.map((entry) =>
                          entry.id === post.id ? { ...entry, liked } : entry,
                        ),
                      );
                    }}
                    size="sm"
                  >
                    <StarIcon size={16} />
                    {post.likes + (post.liked ? 1 : 0)}{" "}
                    <Text variant="caption">
                      {post.liked ? "Liked" : "Like"}
                    </Text>
                  </Toggle>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
        <Card aria-label="Community notes" as="aside" padding={6} radius="sm">
          <Stack gap={3}>
            <Text as="p" variant="caption" tone="muted">
              Your kind of people
            </Text>
            <div aria-hidden="true" className="creator-portrait">
              <span>m.</span>
            </div>
            <Heading level={3} size="md">
              Mira Chen
            </Heading>
            <Text as="p" variant="caption" tone="muted">
              Making everyday things
              <br />a little more interesting.
            </Text>
            <Toggle
              pressed={following}
              onPressedChange={setFollowing}
              size="sm"
            >
              <PlusIcon size={14} />
              {following ? "Following Mira" : "Follow Mira"}
            </Toggle>
            <Stack gap="sm" paddingBlock={5}>
              <ArrowUpRightIcon size={24} />
              <Heading level={3} size="md">
                Less scrolling.
                <br />
                More making.
              </Heading>
              <Text as="p" variant="caption">
                This is a small, fictional community. Your next idea is real.
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}
