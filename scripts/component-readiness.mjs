import { createPublicContracts } from "./lib/public-contracts.mjs";
import { createComponentReadiness } from "./lib/component-readiness.mjs";

const root = process.cwd();
const json = process.argv.includes("--json");
const { contracts, errors: contractErrors } = createPublicContracts(root);
const readiness = createComponentReadiness(root, contracts);
const errors = [...contractErrors, ...readiness.errors];

if (json) {
  console.log(
    JSON.stringify(
      {
        ...readiness,
        errors,
      },
      null,
      2,
    ),
  );
} else {
  const summary = readiness.summary;
  console.log("Flux Core readiness");
  console.log(
    summary.total +
      " families · " +
      summary.eligibleForBetaReview +
      " eligible for beta review",
  );
  console.log(
    "Lifecycle: " +
      summary.status.alpha +
      " alpha · " +
      summary.status.beta +
      " beta · " +
      summary.status.stable +
      " stable",
  );
  console.log(
    "Catalog browser/a11y coverage: " +
      (summary.browserCatalogCoverage ? "yes" : "no") +
      " / " +
      (summary.accessibilityCatalogCoverage ? "yes" : "no"),
  );

  const blocked = readiness.components.filter(
    (component) => component.blockers.length > 0,
  );
  if (blocked.length > 0) {
    console.log("\nPromotion blockers");
    for (const component of blocked)
      console.log("- " + component.name + ": " + component.blockers.join("; "));
  }
  if (summary.status.beta > 0)
    console.log(
      "\n" +
        summary.eligibleForStableReview +
        " beta families are eligible for stable review.",
    );
  console.log(
    "\nPromotion remains a maintainer product decision; this report proves prerequisites, not correctness.",
  );
}

if (errors.length > 0) {
  if (!json) {
    console.error("\nLifecycle errors");
    for (const error of errors) console.error("- " + error);
  }
  process.exitCode = 1;
}
