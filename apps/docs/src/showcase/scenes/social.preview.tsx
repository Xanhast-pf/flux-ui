import { useId, useRef, useState } from "react";
import { ArrowUpRightIcon, PlusIcon, StarIcon } from "@flux-ui/icons";
import { Avatar, Button, Textarea, Toggle } from "@flux-ui/react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
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
    <div className="product-scene social-scene" data-scene="social">
      <SceneHeader brand="gather" context="Good people. Good ideas.">
        <span className="scene-session">The creative corner</span>
        <Avatar alt="Your demo profile" fallback="YO" size="sm" />
      </SceneHeader>
      <div className="social-layout">
        <div className="social-feed">
          <section
            className="gather-editorial"
            aria-label="Community spotlight"
          >
            <div>
              <p className="scene-kicker">The weekly prompt / 024</p>
              <h3>
                Make something
                <br />
                <em>just because.</em>
              </h3>
              <p>No brief. No deadline. Just a little curiosity.</p>
            </div>
            <div className="gather-flower" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="editorial-footnote">
              A small invitation to play.
            </span>
          </section>
          <form
            className="scene-panel social-compose"
            onSubmit={(event) => {
              event.preventDefault();
              addPost();
            }}
          >
            <label htmlFor={`${id}-post`}>What are you working on?</label>
            <Textarea
              id={`${id}-post`}
              placeholder="An idea, a work in progress, a little win…"
              value={draft}
              maxLength={280}
              rows={2}
              onChange={(event) => {
                setDraft(event.currentTarget.value);
              }}
              aria-describedby={`${id}-limit`}
            />
            <div className="scene-heading-row">
              <span id={`${id}-limit`} className="scene-muted">
                {draft.length} / 280 ·{" "}
                {posts.length === maximumPosts
                  ? "Demo feed full; reset to start again"
                  : "Local posts only"}
              </span>
              <Button
                size="sm"
                type="submit"
                disabled={
                  draft.trim().length === 0 || posts.length >= maximumPosts
                }
              >
                Post to demo feed
              </Button>
            </div>
            <SceneStatus>{message}</SceneStatus>
          </form>
          <div className="social-posts">
            {posts.map((post) => (
              <article className="scene-panel social-post" key={post.id}>
                <div className="post-author">
                  <Avatar alt="" fallback={post.initials} size="sm" />
                  <div>
                    <strong>{post.name}</strong>
                    <span>
                      {post.name === "You"
                        ? "Just now · local demo"
                        : "Designer · fictional profile"}
                    </span>
                  </div>
                </div>
                <p>{post.text}</p>
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
                >
                  <StarIcon size={16} />
                  {post.likes + (post.liked ? 1 : 0)}{" "}
                  <span>{post.liked ? "Liked" : "Like"}</span>
                </Toggle>
              </article>
            ))}
          </div>
        </div>
        <aside
          className="scene-panel social-sidebar"
          aria-label="Community notes"
        >
          <p className="scene-kicker">Your kind of people</p>
          <div className="creator-portrait" aria-hidden="true">
            <span>m.</span>
          </div>
          <h3>Mira Chen</h3>
          <p className="scene-muted">
            Making everyday things
            <br />a little more interesting.
          </p>
          <Toggle pressed={following} onPressedChange={setFollowing}>
            <PlusIcon size={14} />
            {following ? "Following Mira" : "Follow Mira"}
          </Toggle>
          <div className="social-sidebar-note">
            <ArrowUpRightIcon size={24} />
            <h3>
              Less scrolling.
              <br />
              More making.
            </h3>
            <p>This is a small, fictional community. Your next idea is real.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
