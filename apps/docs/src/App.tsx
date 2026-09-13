import { MenuIcon } from "@flux-ui/icons";
import {
  Box,
  Container,
  Heading,
  Inline,
  Link,
  SkipLink,
  Sidebar,
  Stack,
  Text,
} from "@flux-ui/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { REPOSITORY_URL } from "./lib/format.js";
import { pageTitle, routePath, useRoute } from "./lib/routing.js";
import { ExampleLoading } from "./ui/ExampleLoading.js";
import { DocumentationNavigation } from "./ui/Navigation.js";
import { SearchDialog } from "./ui/SearchDialog.js";
const OverviewPage = lazy(() =>
  import("./pages/OverviewPage.js").then((module) => ({
    default: module.OverviewPage,
  })),
);
const PlaygroundPage = lazy(() =>
  import("./pages/PlaygroundPage.js").then((module) => ({
    default: module.PlaygroundPage,
  })),
);
const ComponentsPage = lazy(() =>
  import("./pages/ComponentsPage.js").then((module) => ({
    default: module.ComponentsPage,
  })),
);
const ComponentPage = lazy(() =>
  import("./pages/ComponentPage.js").then((module) => ({
    default: module.ComponentPage,
  })),
);
const TokensPage = lazy(() =>
  import("./pages/TokensPage.js").then((module) => ({
    default: module.TokensPage,
  })),
);
const HealthPage = lazy(() =>
  import("./pages/HealthPage.js").then((module) => ({
    default: module.HealthPage,
  })),
);
const SizePage = lazy(() =>
  import("./pages/SizePage.js").then((module) => ({
    default: module.SizePage,
  })),
);
const PerformancePage = lazy(() =>
  import("./pages/PerformancePage.js").then((module) => ({
    default: module.PerformancePage,
  })),
);
const InstallPage = lazy(() =>
  import("./pages/InstallPage.js").then((module) => ({
    default: module.InstallPage,
  })),
);
const DocumentationPage = lazy(() =>
  import("./pages/DocumentationPage.js").then((module) => ({
    default: module.DocumentationPage,
  })),
);
const LabPage = lazy(() =>
  import("./pages/LabPage.js").then((module) => ({ default: module.LabPage })),
);
const EngineeringPage = lazy(() =>
  import("./pages/EngineeringPage.js").then((module) => ({
    default: module.EngineeringPage,
  })),
);
const TrustPage = lazy(() =>
  import("./pages/TrustPage.js").then((module) => ({
    default: module.TrustPage,
  })),
);
const AccessibilityPage = lazy(() =>
  import("./pages/AccessibilityPage.js").then((module) => ({
    default: module.AccessibilityPage,
  })),
);
const IconsPage = lazy(() =>
  import("./pages/IconsPage.js").then((module) => ({
    default: module.IconsPage,
  })),
);
const IdentityPage = lazy(() =>
  import("./pages/IdentityPage.js").then((module) => ({
    default: module.IdentityPage,
  })),
);
function RouteView({ route }: { route: string }) {
  if (route.startsWith("components/"))
    return (
      <ComponentPage key={route} slug={route.slice("components/".length)} />
    );
  switch (route) {
    case "lab":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading lab…
            </Text>
          }
        >
          <LabPage />
        </Suspense>
      );
    case "engineering":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading engineering…
            </Text>
          }
        >
          <EngineeringPage />
        </Suspense>
      );
    case "trust":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading trust…
            </Text>
          }
        >
          <TrustPage />
        </Suspense>
      );
    case "accessibility":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading accessibility…
            </Text>
          }
        >
          <AccessibilityPage />
        </Suspense>
      );
    case "overview":
      return <OverviewPage />;
    case "playground":
      return <PlaygroundPage />;
    case "components":
      return <ComponentsPage />;
    case "icons":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading icon browser…
            </Text>
          }
        >
          <IconsPage />
        </Suspense>
      );
    case "identity":
      return (
        <Suspense
          fallback={
            <Text as="p" variant="body" tone="muted">
              Loading identity lab…
            </Text>
          }
        >
          <IdentityPage />
        </Suspense>
      );
    case "tokens":
      return <TokensPage />;
    case "health":
      return <HealthPage />;
    case "size":
      return <SizePage />;
    case "performance":
      return <PerformancePage />;
    case "install":
      return <InstallPage />;
    case "documentation":
      return <DocumentationPage />;
    default:
      return (
        <Stack as="section" gap="lg">
          <Heading level={1} size="xl">
            That page wandered off.
          </Heading>
          <Text as="p" variant="body">
            The URL does not match a page in this version of the docs.
          </Text>
          <Link href="#overview">Back to the workshop →</Link>
        </Stack>
      );
  }
}
export function App() {
  const route = routePath(useRoute());
  const gallery = route === "overview" || route === "playground";
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);
  useEffect(() => {
    document.title = pageTitle(route);
  }, [route]);
  useEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    const frame = requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [route]);
  return (
    <Sidebar.Root>
      <SkipLink
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </SkipLink>
      <Box
        className="site-header"
        as="header"
        surface="default"
        border="bottom"
      >
        <Container size="xl">
          <Inline
            className="header-inner"
            justify="between"
            gap="sm"
            paddingBlock="sm"
          >
            <Inline gap="sm">
              <Sidebar.Toggle
                variant="ghost"
                tone="neutral"
                aria-label="Toggle navigation"
                title="Toggle navigation"
              >
                <MenuIcon aria-hidden="true" size={20} />
              </Sidebar.Toggle>
              <Link
                href="#overview"
                aria-label="Flux UI home"
                variant="ghost"
                tone="neutral"
                className="brand"
              >
                <Inline gap="sm">
                  <img
                    src={`${import.meta.env.BASE_URL}flux-mark.svg`}
                    alt=""
                    width={32}
                    height={32}
                  />
                  <Text variant="lead" weight="bold">
                    flux
                    <Text tone="muted" weight="regular">
                      UI
                    </Text>
                  </Text>
                </Inline>
              </Link>
            </Inline>
            <SearchDialog />
          </Inline>
        </Container>
      </Box>
      <Sidebar.Layout
        className="workshop-shell"
        style={{ "--flux-sidebar-offset": "4rem" }}
      >
        <DocumentationNavigation route={route} />
        <Sidebar.Content>
          <Container size={gallery ? "xl" : "lg"}>
            <Stack
              id="main-content"
              tabIndex={-1}
              ref={mainRef}
              as="main"
              gap={16}
              paddingBlock="xl"
            >
              <Suspense fallback={<ExampleLoading />}>
                <RouteView route={route} />
              </Suspense>
              <Box
                className="site-footer"
                as="footer"
                border="block"
                paddingBlock="xl"
              >
                <Stack gap="md">
                  <Text as="p" variant="caption" tone="muted">
                    Built with Flux. Still becoming.
                  </Text>
                  <Inline gap="md" wrap>
                    <Link href="#trust">Trust Center</Link>
                    <Link href="#engineering">Engineering</Link>
                    <Link href="#health">Project health</Link>
                    <Link href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}>
                      Contribute
                    </Link>
                    <Link href={`${REPOSITORY_URL}/blob/main/LICENSE`}>
                      MIT license
                    </Link>
                  </Inline>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Sidebar.Content>
      </Sidebar.Layout>
    </Sidebar.Root>
  );
}
