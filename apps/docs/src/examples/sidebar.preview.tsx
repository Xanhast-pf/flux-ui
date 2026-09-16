import {
  Button,
  Drawer,
  Heading,
  Link,
  Sidebar,
  Stack,
  Text,
} from "@flux-ui/react";
import { useCallback, useRef, useState } from "react";
function ExampleLinks({
  page,
  onSelect,
}: {
  page: string;
  onSelect: (page: string) => void;
}) {
  return (
    <Stack gap="md">
      {["Overview", "Settings"].map((name) => (
        <Link
          key={name}
          variant="navigation"
          href={`#${name.toLowerCase()}`}
          aria-current={page === name ? "page" : undefined}
          onClick={(event) => {
            event.preventDefault();
            onSelect(name);
          }}
        >
          {name}
        </Link>
      ))}
    </Stack>
  );
}
export default function Preview() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState("Overview");
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const measureCanvas = useCallback((element: HTMLDivElement | null) => {
    if (element === null) return;
    const node = element;
    const window = node.ownerDocument.defaultView;
    if (window === null) return;
    const view = window;
    let previous = false;
    let frame = 0;
    function measure() {
      const rem = Number.parseFloat(
        view.getComputedStyle(node.ownerDocument.documentElement).fontSize,
      );
      const next = node.getBoundingClientRect().width < 48 * rem;
      if (previous === next) return;
      previous = next;
      const restore = node.ownerDocument.activeElement?.closest(
        "[data-example-mobile-navigation][open]",
      );
      setCompact(next);
      setMobileOpen(false);
      if (restore) {
        view.cancelAnimationFrame(frame);
        frame = view.requestAnimationFrame(() =>
          trigger.current?.focus({ preventScroll: true }),
        );
      }
    }
    const observer = new view.ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => {
      observer.disconnect();
      view.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <Sidebar.Root defaultOpen>
      <Drawer.Root open={compact && mobileOpen} onOpenChange={setMobileOpen}>
        <Stack gap="md" ref={measureCanvas}>
          <Text role="status" tone="muted">
            {compact
              ? "Mobile navigation: viewport overlay."
              : "Desktop sidebar: pushes adjacent content."}
          </Text>
          {compact ? (
            <Drawer.Trigger ref={trigger}>
              Toggle example navigation
            </Drawer.Trigger>
          ) : (
            <Sidebar.Toggle ref={trigger} variant="outline">
              Toggle example navigation
            </Sidebar.Toggle>
          )}
          <Sidebar.Layout>
            {!compact && (
              <Sidebar.Panel aria-label="Example navigation">
                <Stack gap="md">
                  <ExampleLinks page={page} onSelect={setPage} />
                  <Sidebar.Close variant="ghost">
                    Close example navigation
                  </Sidebar.Close>
                </Stack>
              </Sidebar.Panel>
            )}
            <Sidebar.Content>
              <Stack padding="md" gap="md">
                <Heading level={2} size="md">
                  {page}
                </Heading>
                <Text as="p">
                  Desktop navigation stays open across page changes. Mobile
                  navigation uses a separate modal Drawer instead of moving this
                  content.
                </Text>
                <Button
                  onClick={() =>
                    setPage(page === "Overview" ? "Settings" : "Overview")
                  }
                >
                  Use main content
                </Button>
              </Stack>
            </Sidebar.Content>
          </Sidebar.Layout>
        </Stack>
        <Drawer.Popup side="left" data-example-mobile-navigation="">
          <Stack gap="lg">
            <Drawer.Title>Example mobile navigation</Drawer.Title>
            <ExampleLinks
              page={page}
              onSelect={(name) => {
                setPage(name);
                setMobileOpen(false);
              }}
            />
            <Drawer.Close>Close example navigation</Drawer.Close>
          </Stack>
        </Drawer.Popup>
      </Drawer.Root>
    </Sidebar.Root>
  );
}
