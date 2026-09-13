import {
  Accordion,
  AspectRatio,
  Avatar,
  Badge,
  Card,
  Grid,
  Heading,
  Inline,
  Input,
  Kbd,
  Link,
  Pagination,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Toggle,
  ToggleGroup,
  Toolbar,
} from "@flux-ui/react";
import { useRef, useState } from "react";
const projects = [
  {
    id: "orbit",
    title: "Orbit Notes",
    team: "Studio team",
    initials: "ST",
    category: "Writing",
    detail: "A calmer place for your next good idea.",
    component: "textarea",
  },
  {
    id: "signal",
    title: "Signal Board",
    team: "Platform team",
    initials: "PT",
    category: "Planning",
    detail: "The important work, without the noise.",
    component: "card",
  },
  {
    id: "quiet",
    title: "Quiet Inbox",
    team: "Design team",
    initials: "DT",
    category: "Communication",
    detail: "A little more breathing room for messages.",
    component: "badge",
  },
  {
    id: "focus",
    title: "Focus Timer",
    team: "Studio team",
    initials: "ST",
    category: "Focus",
    detail: "One thing at a time is still a superpower.",
    component: "progress",
  },
  {
    id: "color",
    title: "Color Studies",
    team: "Design team",
    initials: "DT",
    category: "Exploration",
    detail: "Try an accent. Change the whole atmosphere.",
    component: "toggle-group",
  },
  {
    id: "field",
    title: "Field Journal",
    team: "Platform team",
    initials: "PT",
    category: "Writing",
    detail: "A notebook made from small, dependable pieces.",
    component: "field",
  },
  {
    id: "studio",
    title: "Studio Settings",
    team: "Design team",
    initials: "DT",
    category: "Settings",
    detail: "Sensible defaults with room to make it yours.",
    component: "switch",
  },
  {
    id: "release",
    title: "Release Log",
    team: "Platform team",
    initials: "PT",
    category: "Planning",
    detail: "Small changes, well explained.",
    component: "table",
  },
  {
    id: "story",
    title: "Story Shelf",
    team: "Studio team",
    initials: "ST",
    category: "Exploration",
    detail: "A collection worth returning to.",
    component: "accordion",
  },
] as const;
const pageSize = 3;
const placeholderIds = ["first", "second", "third"] as const;
export function CollectionLab() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<readonly string[]>(["orbit"]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [alphabetical, setAlphabetical] = useState(false);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const matching = projects.filter(
    (project) =>
      (!savedOnly || saved.includes(project.id)) &&
      `${project.title} ${project.category} ${project.team}`
        .toLowerCase()
        .includes(search),
  );
  const ordered = alphabetical
    ? [...matching].sort((left, right) => left.title.localeCompare(right.title))
    : matching;
  const pageCount = Math.max(1, Math.ceil(ordered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = ordered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  function reset(): void {
    setQuery("");
    setSaved(["orbit"]);
    setSavedOnly(false);
    setAlphabetical(false);
    setView("grid");
    setPage(1);
    setLoadingPreview(false);
  }
  function save(id: string, pressed: boolean): void {
    // If filtering removes the focused card, land on the stable result region.
    if (savedOnly && !pressed)
      resultsRef.current?.focus({ preventScroll: true });
    setSaved((current) =>
      pressed ? [...current, id] : current.filter((entry) => entry !== id),
    );
    if (savedOnly) setPage(1);
  }
  return (
    <Stack gap="lg">
      <Inline justify="between" wrap>
        <Stack gap="md">
          <Text as="p" variant="eyebrow" tone="muted">
            A little shelf of possibilities
          </Text>
          <Heading level={2} size="lg">
            Collection lab
          </Heading>
        </Stack>
        <Badge tone="accent">{saved.length} saved this session</Badge>
      </Inline>
      <Text as="p" variant="body" tone="muted">
        Search, save, change the layout, and explore another page. This is
        sample content in memory—not a backend or a real loading request.
      </Text>
      <Inline wrap gap="md">
        <Input
          type="search"
          aria-label="Search the collection"
          value={query}
          placeholder="Find a project or team…"
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setPage(1);
          }}
        />
        <ToggleGroup.Root
          type="single"
          value={view}
          aria-label="Collection layout"
          onValueChange={(next) => {
            if (next !== null) setView(next);
          }}
        >
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="list">List</ToggleGroup.Item>
        </ToggleGroup.Root>
      </Inline>
      <Toolbar.Root aria-label="Collection actions">
        <Toolbar.Button
          aria-pressed={savedOnly}
          onClick={() => {
            setSavedOnly((value) => !value);
            setPage(1);
          }}
        >
          Saved only
        </Toolbar.Button>
        <Toolbar.Button
          aria-pressed={alphabetical}
          onClick={() => {
            setAlphabetical((value) => !value);
            setPage(1);
          }}
        >
          Sort A–Z
        </Toolbar.Button>
        <Toolbar.Button
          aria-pressed={loadingPreview}
          onClick={() => {
            setLoadingPreview((value) => !value);
          }}
        >
          Preview loading
        </Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button onClick={reset}>Reset collection</Toolbar.Button>
      </Toolbar.Root>
      <Inline gap="sm" wrap>
        {loadingPreview ? <Spinner label={null} size="sm" /> : null}
        <Text role="status" as="p" variant="caption" tone="muted">
          {loadingPreview
            ? "Loading-state preview. Turn off Preview loading to show the collection."
            : `${ordered.length} projects · Page ${currentPage} of ${pageCount} · ${saved.length} saved`}
        </Text>
      </Inline>
      <Grid
        ref={resultsRef}
        role="region"
        aria-label="Collection results"
        aria-busy={loadingPreview}
        tabIndex={-1}
        data-view={view}
        minColumnWidth="15rem"
        gap="md"
      >
        <Grid
          columns={view === "list" ? 1 : { base: 1, md: 2, xl: 3 }}
          gap="md"
        >
          {loadingPreview
            ? placeholderIds.map((id) => (
                <Card key={id}>
                  <Stack gap="md">
                    <Skeleton shape="block" />
                    <Skeleton />
                    <Inline gap="sm">
                      <Skeleton shape="circle" />
                      <Skeleton style={{ width: "50%" }} />
                    </Inline>
                    <Skeleton style={{ width: "70%" }} />
                  </Stack>
                </Card>
              ))
            : visible.map((project) => (
                <Card key={project.id} padding="none">
                  <AspectRatio
                    ratio={view === "list" ? 6 : 16 / 9}
                    aria-hidden="true"
                    className="collection-art"
                    align="center"
                  >
                    <Text variant="metric">{project.initials}</Text>
                  </AspectRatio>
                  <Stack gap="md" padding="md">
                    <Inline justify="between" wrap>
                      <Badge>{project.category}</Badge>
                      <Toggle
                        pressed={saved.includes(project.id)}
                        aria-label={`Save ${project.title}`}
                        onPressedChange={(pressed) => {
                          save(project.id, pressed);
                        }}
                      >
                        <Text aria-hidden="true">☆</Text> Save
                      </Toggle>
                    </Inline>
                    <Stack gap="md">
                      <Heading level={3} size="md">
                        <Link href={`#components/${project.component}`}>
                          {project.title}
                        </Link>
                      </Heading>
                      <Text as="p" variant="body" tone="muted">
                        {project.detail}
                      </Text>
                    </Stack>
                    <Inline gap="sm">
                      <Avatar alt="" fallback={project.initials} size="sm" />
                      <Inline as="span" gap="sm">
                        {project.team}
                      </Inline>
                    </Inline>
                  </Stack>
                </Card>
              ))}
        </Grid>
        {!loadingPreview && ordered.length === 0 ? (
          <Card>
            <Stack gap="md">
              <Heading level={3} size="md">
                No projects on this shelf.
              </Heading>
              <Text as="p" variant="body">
                Try another search or turn off Saved only. Reset collection
                brings back the starting state.
              </Text>
            </Stack>
          </Card>
        ) : null}
      </Grid>
      {!loadingPreview && ordered.length > 0 ? (
        <Pagination.Root
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
          aria-label="Collection pages"
        >
          <Pagination.Previous />
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <Pagination.Page key={number} page={number} />
            ),
          )}
          <Pagination.Next />
        </Pagination.Root>
      ) : null}
      <Text as="p" variant="caption" tone="muted">
        <Kbd>Tab</Kbd> enters an action group. <Kbd>←</Kbd> / <Kbd>→</Kbd> moves
        through it. <Kbd>Enter</Kbd> activates the focused action.
      </Text>
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Trigger>Is anything saved remotely?</Accordion.Trigger>
          <Accordion.Content>
            No. Favorites, filters and view choices live only in this mounted
            demo. Switching labs or reloading starts fresh.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Trigger>
            Why is loading controlled by a button?
          </Accordion.Trigger>
          <Accordion.Content>
            It lets you inspect placeholders and announcements at your own pace.
            There is no fake network request or timer to race.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Trigger>
            Which pieces are doing the work?
          </Accordion.Trigger>
          <Accordion.Content>
            Toolbar and ToggleGroup coordinate keyboard focus. Pagination
            changes the visible slice. Toggle saves a card, while Avatar,
            AspectRatio, Skeleton and Spinner handle presentation.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Stack>
  );
}
