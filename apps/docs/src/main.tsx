import "@flux-ui/tokens/theme.css";
import { createRoot } from "react-dom/client";
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("#root is missing");
const isPerfRoute = new URLSearchParams(window.location.search).has("perf");
if (isPerfRoute) {
  await import("./perf/perf.css");
  const { runPerfHarness } = await import("./perf/PerfApp.js");
  await runPerfHarness(rootElement);
} else {
  const [{ StrictMode }, { App }] = await Promise.all([
    import("react"),
    import("./App.js"),
    import("@flux-ui/tokens/reset.css"),
    import("./styles.css"),
  ]);
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
