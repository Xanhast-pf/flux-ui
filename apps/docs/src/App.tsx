import { ArrowUpRightIcon } from "@flux-ui/icons";
import {
  Badge,
  Box,
  Container,
  Heading,
  Inline,
  Link,
  SkipLink,
  Stack,
  Text,
} from "@flux-ui/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { REPOSITORY_URL } from "./lib/format.js";
import { routePath, useRoute } from "./lib/routing.js";
import "./shell.css";
import { ThemeSwitch } from "./ui/AppearanceControls.js";
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
const RulesPage = lazy(() =>
  import("./pages/RulesPage.js").then((module) => ({
    default: module.RulesPage,
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
    case "rules":
      return <RulesPage />;
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
    <>
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
        data-gallery={gallery || undefined}
        className="site-header"
        as="header"
        surface="default"
        border="bottom"
      >
        <Container size="xl">
          <Inline className="header-inner" gap="sm">
            <DocumentationNavigation route={route} />
            <Link href="#overview" aria-label="Flux UI home" className="brand">
              <img
                src={`${import.meta.env.BASE_URL}flux-mark.svg`}
                alt=""
                width={32}
                height={32}
                className="brand-mark"
              />
              <Text>
                flux<Text className="brand-ui">UI</Text>
              </Text>
            </Link>
            <Badge tone="accent">alpha</Badge>
            <Box
              aria-label="Primary navigation"
              className="header-links"
              as="nav"
            >
              <Link
                href="#playground"
                aria-current={route === "playground" ? "page" : undefined}
                variant="navigation"
              >
                Playground
              </Link>
              <Link
                href="#components"
                aria-current={
                  route === "components" || route.startsWith("components/")
                    ? "page"
                    : undefined
                }
                variant="navigation"
              >
                Components
              </Link>
              <Link
                href="#engineering"
                aria-current={route === "engineering" ? "page" : undefined}
                variant="navigation"
              >
                Engineering
              </Link>
            </Box>
            <Box className="header-search">
              <SearchDialog />
            </Box>
            <Box className="header-theme">
              <ThemeSwitch />
            </Box>
            <Link href={REPOSITORY_URL} className="header-github">
              GitHub <ArrowUpRightIcon aria-hidden="true" size={14} />
            </Link>
          </Inline>
        </Container>
      </Box>
      <Container
        size="xl"
        className={gallery ? "workshop-shell gallery-shell" : "workshop-shell"}
      >
        <Box id="main-content" tabIndex={-1} ref={mainRef} as="main">
          <Suspense fallback={<ExampleLoading />}>
            <RouteView route={route} />
          </Suspense>
          <Box className="site-footer" as="footer">
            <Inline justify="between" gap="md" wrap>
              <Text as="p" variant="body">
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
            </Inline>
          </Box>
        </Box>
      </Container>
    </>
  );
}
