import { ArrowUpRightIcon, FluxMarkIcon } from "@flux-ui/icons";
import { Badge, Container, Inline } from "@flux-ui/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useRoute } from "./lib/routing.js";
import { REPOSITORY_URL } from "./lib/format.js";
import { ThemeSwitch } from "./ui/AppearanceControls.js";
import { Navigation, MobileNavigation } from "./ui/Navigation.js";
import { SearchDialog } from "./ui/SearchDialog.js";
import { OverviewPage } from "./pages/OverviewPage.js";
import { PlaygroundPage } from "./pages/PlaygroundPage.js";
import { ComponentsPage } from "./pages/ComponentsPage.js";
import { ComponentPage } from "./pages/ComponentPage.js";
import { TokensPage } from "./pages/TokensPage.js";
import { HealthPage } from "./pages/HealthPage.js";
import { SizePage } from "./pages/SizePage.js";
import { PerformancePage } from "./pages/PerformancePage.js";
import { RulesPage } from "./pages/RulesPage.js";
import { InstallPage } from "./pages/InstallPage.js";
import { DocumentationPage } from "./pages/DocumentationPage.js";

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
    case "overview":
      return <OverviewPage />;
    case "playground":
      return <PlaygroundPage />;
    case "components":
      return <ComponentsPage />;
    case "icons":
      return (
        <Suspense fallback={<p className="muted">Loading icon browser…</p>}>
          <IconsPage />
        </Suspense>
      );
    case "identity":
      return (
        <Suspense fallback={<p className="muted">Loading identity lab…</p>}>
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
        <section>
          <h1>That page wandered off.</h1>
          <p>The URL does not match a page in this version of the docs.</p>
          <a href="#overview">Back to the workshop →</a>
        </section>
      );
  }
}
export function App() {
  const route = useRoute();
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
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <Container size="full">
          <div className="header-inner">
            <a className="brand" href="#overview" aria-label="Flux UI home">
              <span className="brand-mark" aria-hidden="true">
                <FluxMarkIcon size={20} />
              </span>
              <span>
                flux<span className="brand-ui"> / ui</span>
              </span>
            </a>
            <Badge tone="accent">alpha</Badge>
            <div className="header-search">
              <SearchDialog />
            </div>
            <div className="header-theme">
              <ThemeSwitch />
            </div>
            <a className="header-github" href={REPOSITORY_URL}>
              GitHub <ArrowUpRightIcon aria-hidden="true" size={14} />
            </a>
            <a className="header-actions" href={`${REPOSITORY_URL}/actions`}>
              CI <ArrowUpRightIcon aria-hidden="true" size={14} />
            </a>
          </div>
          <div className="mobile-header-row">
            <MobileNavigation route={route} />
            <span>Native at heart. Yours by design.</span>
          </div>
        </Container>
      </header>
      <Container size="full" className="workshop-shell">
        <aside className="desktop-sidebar">
          <div className="sidebar-sticky">
            <Navigation route={route} />
          </div>
        </aside>
        <main id="main-content" tabIndex={-1} ref={mainRef}>
          <RouteView route={route} />
          <footer className="site-footer">
            <Inline justify="between" wrap>
              <p>Built with Flux. Still becoming.</p>
              <Inline gap="md" wrap>
                <a href="#health">Project health</a>
                <a href="#install">Contribute</a>
                <a href={`${REPOSITORY_URL}/blob/main/LICENSE`}>MIT license</a>
              </Inline>
            </Inline>
          </footer>
        </main>
      </Container>
    </>
  );
}
