import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { analyze, formatReport } from "./check.mjs";
import { readInventory } from "./inventory.mjs";
import { markdownLinks, headingIds } from "./docs.mjs";
import { parseSource, staticLinks, routeExists } from "./routes.mjs";
import { commands, taskName } from "../terminal/commands.mjs";
import { CHECKS } from "../trust/evidence.mjs";

function fixture() {
  const json = (value) => JSON.stringify(value);
  const files = new Map([
    [
      "tooling/project.json",
      json({
        schemaVersion: 1,
        siteUrl: "https://flux.varua.ca/",
        repository: "Xanhast-pf/flux-ui",
        reservedCatalogDependencies: {},
        mutableActionExceptions: {
          ".github/workflows/coding-bible.yml": [
            "Xanhast-pf/coding-bible@main",
          ],
        },
      }),
    ],
    [
      "package.json",
      json({
        private: true,
        packageManager: "pnpm@10.34.5",
        engines: { node: ">=24" },
        devDependencies: { typescript: "catalog:" },
      }),
    ],
    [".nvmrc", "24\n"],
    [
      "pnpm-workspace.yaml",
      "packages:\n  - packages/*\ncatalog:\n  typescript: ^5.9.2\n",
    ],
    [
      "README.md",
      "# Flux UI\nhttps://flux.varua.ca/\n[Guides](docs/README.md)\n",
    ],
    ["SECURITY.md", "https://flux.varua.ca/"],
    ["docs/README.md", "# Docs\n[Best practices](trust/BEST-PRACTICES.md)\n"],
    ["docs/trust/BEST-PRACTICES.md", "https://flux.varua.ca/"],
    [
      "docs/trust/best-practices.application.json",
      json({
        project: {
          website: "https://flux.varua.ca/",
          repository: "https://github.com/Xanhast-pf/flux-ui",
        },
      }),
    ],
    [
      "apps/docs/index.html",
      '<link rel="canonical" href="https://flux.varua.ca/" /><meta content="https://flux.varua.ca/" property="og:url" />',
    ],
    [
      "apps/docs/src/lib/routing.ts",
      'export const navigationGroups = [{label:"Build",items:[["overview","Home"],["documentation","Docs"]]}] as const; export const routeAliases: Readonly<Record<string,string>> = {rules:"documentation"};',
    ],
    [
      "apps/docs/src/App.tsx",
      'function RouteView({ route }: { route: string }) { switch(route) {case "overview": break; case "documentation": break;} }',
    ],
    [
      ".github/workflows/coding-bible.yml",
      "- uses: Xanhast-pf/coding-bible@main\n",
    ],
  ]);
  for (const name of ["react", "icons", "tokens"])
    files.set(
      `packages/${name}/package.json`,
      json({
        name: `@flux-ui/${name}`,
        version: "0.0.0",
        type: "module",
        license: "MIT",
        homepage: "https://flux.varua.ca/",
        files: ["dist"],
        repository: {
          url: "git+https://github.com/Xanhast-pf/flux-ui.git",
          directory: `packages/${name}`,
        },
        bugs: { url: "https://github.com/Xanhast-pf/flux-ui/issues" },
        publishConfig: { access: "public", provenance: true },
        exports: {
          ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
        },
      }),
    );
  for (const file of [
    "Example.tsx",
    "Example.types.ts",
    "Example.css.ts",
    "Example.stories.tsx",
    "Example.bench.tsx",
    "index.ts",
  ])
    files.set(`packages/react/src/components/Example/${file}`, "export {};\n");
  files.set(
    "packages/react/src/components/Example/Example.test.tsx",
    'import { it as check } from "vitest"; check("behavior", () => {});',
  );
  files.set(
    "packages/react/src/components/Example/component.meta.json",
    json({
      name: "Example",
      slug: "example",
      category: "Layout",
      description: "Example",
      status: "alpha",
      sizeClass: "primitive",
    }),
  );
  return files;
}

function updateJson(files, path, mutate) {
  const value = JSON.parse(files.get(path));
  mutate(value);
  files.set(path, JSON.stringify(value));
}
function expectRule(files, rule) {
  const result = analyze(files);
  assert.equal(result.status, "failed", JSON.stringify(result));
  assert.ok(
    result.findings.some((finding) => finding.rule === rule),
    JSON.stringify(result),
  );
  return result;
}

test("a complete source fixture passes with deterministic read-only diagnostics", () => {
  const files = fixture();
  const before = [...files];
  const result = analyze(files);
  assert.deepEqual(result.findings, []);
  assert.equal(result.status, "passed");
  assert.deepEqual(analyze(files), result);
  assert.deepEqual([...files], before);
  assert.match(
    formatReport(result),
    /0 errors; 0 warnings; 1 component families; 3 public packages/u,
  );
});

const mutations = [
  [
    "missing component companion",
    (files) =>
      files.delete("packages/react/src/components/Example/Example.test.tsx"),
    "COMPONENT_COMPANION",
  ],
  [
    "empty component test",
    (files) =>
      files.set(
        "packages/react/src/components/Example/Example.test.tsx",
        '// it("not a test")\nexport {};',
      ),
    "COMPONENT_TEST",
  ],
  [
    "malformed component metadata",
    (files) =>
      files.set(
        "packages/react/src/components/Example/component.meta.json",
        "{broken",
      ),
    "DRIFT_INPUT",
  ],
  [
    "invalid lifecycle",
    (files) =>
      updateJson(
        files,
        "packages/react/src/components/Example/component.meta.json",
        (meta) => {
          meta.status = "ready";
        },
      ),
    "COMPONENT_LIFECYCLE",
  ],
  [
    "wrong package homepage",
    (files) =>
      updateJson(files, "packages/icons/package.json", (pkg) => {
        pkg.homepage = "https://example.com/";
      }),
    "PACKAGE_METADATA",
  ],
  [
    "missing provenance",
    (files) =>
      updateJson(files, "packages/react/package.json", (pkg) => {
        delete pkg.publishConfig.provenance;
      }),
    "PACKAGE_METADATA",
  ],
  [
    "wrong repository directory",
    (files) =>
      updateJson(files, "packages/tokens/package.json", (pkg) => {
        pkg.repository.directory = "packages/react";
      }),
    "PACKAGE_METADATA",
  ],
  [
    "escaping export target",
    (files) =>
      updateJson(files, "packages/react/package.json", (pkg) => {
        pkg.exports = { ".": "../private.js" };
      }),
    "PACKAGE_EXPORT",
  ],
  [
    "missing public package",
    (files) => files.delete("packages/icons/package.json"),
    "PACKAGE_PUBLIC",
  ],
  [
    "private public package",
    (files) =>
      updateJson(files, "packages/react/package.json", (pkg) => {
        pkg.private = true;
      }),
    "PACKAGE_PUBLIC",
  ],
  [
    "unknown workspace dependency",
    (files) =>
      updateJson(files, "packages/react/package.json", (pkg) => {
        pkg.dependencies = { missing: "workspace:*" };
      }),
    "PACKAGE_DEPENDENCY",
  ],
  [
    "install-time hook",
    (files) =>
      updateJson(files, "packages/react/package.json", (pkg) => {
        pkg.scripts = { postinstall: "do-something" };
      }),
    "PACKAGE_INSTALL_HOOK",
  ],
  [
    "missing catalog key",
    (files) => files.set("pnpm-workspace.yaml", "catalog:\n  unused: 1.0.0\n"),
    "CATALOG_MISSING",
  ],
  [
    "unused catalog key",
    (files) =>
      files.set(
        "pnpm-workspace.yaml",
        files.get("pnpm-workspace.yaml") + "  unused: 1.0.0\n",
      ),
    "CATALOG_UNUSED",
  ],
  [
    "mismatched Node configuration",
    (files) => files.set(".nvmrc", "99"),
    "DRIFT_INPUT",
  ],
  [
    "stale contributor pnpm",
    (files) => files.set("docs/README.md", "Contributors use pnpm 1.2.3."),
    "TOOLCHAIN_PNPM",
  ],
  [
    "stale contributor Node",
    (files) => files.set("docs/README.md", "Contributors need Node 22+."),
    "TOOLCHAIN_NODE",
  ],
  [
    "missing canonical HTML",
    (files) => files.set("apps/docs/index.html", "<html></html>"),
    "SITE_CANONICAL",
  ],
  [
    "mismatched trust identity",
    (files) =>
      updateJson(
        files,
        "docs/trust/best-practices.application.json",
        (data) => {
          data.project.website = "https://example.com/";
        },
      ),
    "SITE_TRUST",
  ],
  [
    "broken route",
    (files) =>
      files.set("apps/docs/src/example.tsx", '<Link href="#footer" />;'),
    "ROUTE_TARGET",
  ],
  [
    "invalid component slug route",
    (files) =>
      files.set(
        "apps/docs/src/example.tsx",
        '<Link href={"#components/missing"} />;',
      ),
    "ROUTE_TARGET",
  ],
  [
    "missing view",
    (files) =>
      files.set(
        "apps/docs/src/App.tsx",
        'function RouteView({ route }: { route: string }) { switch(route) {case "overview": break;} }',
      ),
    "ROUTE_VIEW",
  ],
  [
    "cyclic aliases",
    (files) =>
      files.set(
        "apps/docs/src/lib/routing.ts",
        files
          .get("apps/docs/src/lib/routing.ts")
          .replace('rules:"documentation"', 'rules:"other",other:"rules"'),
      ),
    "ROUTE_ALIAS",
  ],
  [
    "unparseable TSX",
    (files) => files.set("apps/docs/src/broken.tsx", "export const = ;"),
    "DRIFT_INPUT",
  ],
  [
    "broken Markdown link",
    (files) => files.set("docs/README.md", "[Missing](./missing.md)"),
    "DOC_LINK",
  ],
  [
    "broken Markdown anchor",
    (files) =>
      files.set(
        "README.md",
        files.get("README.md") + "[No](docs/README.md#missing)",
      ),
    "DOC_ANCHOR",
  ],
  [
    "undefined Markdown reference",
    (files) => files.set("docs/README.md", "[No][unknown]"),
    "DOC_REFERENCE",
  ],
  [
    "orphan evergreen doc",
    (files) => files.set("docs/missing-index.md", "# A current guide"),
    "DOC_ORPHAN",
  ],
  [
    "stale project alpha claim",
    (files) => files.set("docs/README.md", "Flux UI is alpha."),
    "DOC_LIFECYCLE",
  ],
  [
    "wrong workflow pin",
    (files) =>
      files.set(".github/workflows/ci.yml", "- uses: actions/checkout@main\n"),
    "WORKFLOW_PIN",
  ],
  [
    "canary exception in wrong workflow",
    (files) =>
      files.set(
        ".github/workflows/ci.yml",
        "- uses: Xanhast-pf/coding-bible@main\n",
      ),
    "WORKFLOW_PIN",
  ],
  [
    "wrong workflow pnpm",
    (files) =>
      files.set(
        ".github/workflows/ci.yml",
        `- uses: pnpm/action-setup@${"a".repeat(40)}\n  with:\n    version: 1.2.3\n`,
      ),
    "WORKFLOW_PNPM",
  ],
  [
    "wrong workflow Node",
    (files) =>
      files.set(
        ".github/workflows/ci.yml",
        `- uses: actions/setup-node@${"a".repeat(40)}\n  with:\n    node-version: 22\n`,
      ),
    "WORKFLOW_NODE",
  ],
  [
    "missing policy",
    (files) => files.delete("tooling/project.json"),
    "DRIFT_INPUT",
  ],
];
for (const [name, mutate, rule] of mutations)
  test(`drift rejects ${name}`, () => {
    const files = fixture();
    mutate(files);
    expectRule(files, rule);
  });

test("history, vendor minimums, and exact approved canary are not drift", () => {
  const files = fixture();
  files.set(
    "docs/history.md",
    "# Snapshot\n\n> **Historical report.** Old evidence.\nContributors need Node 22 and pnpm 1.2.3. Flux UI is alpha.",
  );
  files.set(
    "docs/README.md",
    "# Docs\n[Best practices](trust/BEST-PRACTICES.md)\nnpm integration requires npm CLI and Node 22.14+; contributors use Node 24.",
  );
  files.set(
    ".github/workflows/coding-bible.yml",
    "- uses: Xanhast-pf/coding-bible@main\n",
  );
  assert.deepEqual(analyze(files).findings, []);
});

test("registered aliases, component routes, queries and same-file anchors are valid", () => {
  const files = fixture();
  files.set(
    "apps/docs/src/example.tsx",
    '<><Link href="#rules"/><Link href="#components/example?variant=a"/><div id="local"/><Link href="#local"/></>;',
  );
  assert.deepEqual(analyze(files).findings, []);
  assert.equal(routeExists("%ZZ", new Set(), {}, new Set()), false);
});

test("AST link scanning ignores comments and source-code strings, supports static expressions", () => {
  const file = parseSource(
    "sample.tsx",
    'const code = \'<Link href="#fake"/>\'; // <a href="#comment"/>\nconst view = <a href={"#real"}/>; const item = {href: `#other`};',
  );
  assert.deepEqual(
    staticLinks(file).links.map(({ href }) => href),
    ["#real", "#other"],
  );
});

test("Markdown parser handles titles, references, images and fenced non-links", () => {
  const source =
    '[Guide](guide.md "Title")\n[Guide][key]\n[key]: guide.md\n![Photo](image.svg)\n`[not](fake.md)`\n```md\n[not](fake.md)\n```';
  assert.deepEqual(
    markdownLinks(source)
      .map(({ href }) => href)
      .sort(),
    ["guide.md", "guide.md", "guide.md", "image.svg"],
  );
  assert.deepEqual(
    [...headingIds("# Hello `world`\n## Hello world\n")],
    ["hello-world", "hello-world-1"],
  );
});

test("inventory ignores output/dependencies and fails closed on source symlinks", (t) => {
  const root = mkdtempSync(join(tmpdir(), "flux-drift-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "node_modules"));
  writeFileSync(join(root, "node_modules", "bad.ts"), "not source");
  writeFileSync(join(root, "source.ts"), "export {};");
  assert.deepEqual([...readInventory(root).keys()], ["source.ts"]);
  symlinkSync(join(root, "source.ts"), join(root, "linked.ts"));
  assert.throws(() => readInventory(root), /Source symlink/u);
});

test("normal gate and CI evidence include drift and existing independent gates", () => {
  assert.equal(commands.check.map(taskName)[1], "drift:check");
  assert.equal(CHECKS.quality[1].id, "drift");
  assert.equal(
    CHECKS.quality.filter((check) => check.id === "drift").length,
    1,
  );
  assert.ok(
    commands["docs:test"].some((command) => taskName(command) === "drift:test"),
  );
});

test("the actual repository passes the same rules without changing its snapshot", () => {
  const files = readInventory(
    fileURLToPath(new URL("../../", import.meta.url)),
  );
  const before = [...files];
  const report = analyze(files);
  assert.deepEqual(report.findings, [], formatReport(report));
  assert.deepEqual([...files], before);
});

test("orphan document cycles do not count as discoverable documentation", () => {
  const files = fixture();
  files.set("docs/a.md", "# A\n[B](b.md)");
  files.set("docs/b.md", "# B\n[A](a.md)");
  expectRule(files, "DOC_ORPHAN");
});

for (const modifier of ["only", "skip", "todo"]) {
  test(`focused or suppressed component tests are reported: ${modifier}`, () => {
    const files = fixture();
    files.set(
      "packages/react/src/components/Example/Example.test.tsx",
      `import { test } from "vitest"; test.${modifier}("behavior", () => {});`,
    );
    expectRule(files, "COMPONENT_TEST_SELECTION");
  });
}

test("a focused describe block cannot quietly narrow the component test suite", () => {
  const files = fixture();
  files.set(
    "packages/react/src/components/Example/Example.test.tsx",
    'import { describe, it } from "vitest"; describe.only("suite", () => { it("behavior", () => {}); });',
  );
  expectRule(files, "COMPONENT_TEST_SELECTION");
});
test("hard-coded live icon counts in browser tests are repository drift", () => {
  const files = fixture();
  files.set(
    "apps/docs/tests/copy.spec.ts",
    'const label = "Browse all 64 icons";',
  );
  expectRule(files, "ICON_COUNT");
});

test("component slug must be derived from its family name", () => {
  const files = fixture();
  const path = "packages/react/src/components/Example/component.meta.json";
  const meta = JSON.parse(files.get(path));
  meta.slug = "wrong-but-valid";
  files.set(path, JSON.stringify(meta));
  expectRule(files, "COMPONENT_IDENTITY");
});

test("workspace package names are required", () => {
  const files = fixture();
  updateJson(files, "packages/react/package.json", (pkg) => {
    delete pkg.name;
  });
  expectRule(files, "PACKAGE_NAME");
});

for (const [name, mutate] of [
  [
    "null exports",
    (pkg) => {
      pkg.exports = null;
    },
  ],
  [
    "empty exports",
    (pkg) => {
      pkg.exports = {};
    },
  ],
  [
    "missing root export",
    (pkg) => {
      delete pkg.exports["."];
    },
  ],
  [
    "blocked root export",
    (pkg) => {
      pkg.exports["."] = null;
    },
  ],
]) {
  test(`public package rejects ${name}`, () => {
    const files = fixture();
    updateJson(files, "packages/react/package.json", mutate);
    expectRule(files, "PACKAGE_EXPORT");
  });
}

test("route coverage comes from RouteView rather than an unrelated switch", () => {
  const files = fixture();
  files.set(
    "apps/docs/src/App.tsx",
    'function RouteView({route}) { switch(route) { case "overview": break; case "missing": break; } } function unrelated(value) { switch(value) { case "documentation": return true; } }',
  );
  expectRule(files, "ROUTE_VIEW");
});

test("workflow scanning ignores comments and run strings", () => {
  const files = fixture();
  files.set(
    ".github/workflows/ci.yml",
    '# uses: actions/checkout@main\n- run: echo "uses: actions/checkout@main"\n',
  );
  assert.deepEqual(analyze(files).findings, []);
});

test("workflow scanning catches quoted mutable actions", () => {
  for (const quote of ['"', "'"]) {
    const files = fixture();
    files.set(
      ".github/workflows/ci.yml",
      `- uses: ${quote}actions/checkout@main${quote}\n`,
    );
    expectRule(files, "WORKFLOW_PIN");
  }
});

test("workflow scanning accepts a quoted immutable action", () => {
  const files = fixture();
  files.set(
    ".github/workflows/ci.yml",
    `- uses: "actions/checkout@${"a".repeat(40)}" # pinned\n`,
  );
  assert.deepEqual(analyze(files).findings, []);
});

test("internal workspace dependencies cannot silently resolve from the registry", () => {
  const files = fixture();
  updateJson(files, "packages/react/package.json", (pkg) => {
    pkg.dependencies = { "@flux-ui/tokens": "^0.2.0" };
  });
  expectRule(files, "PACKAGE_DEPENDENCY");
});

test("catalog reservations become drift once the dependency is consumed", () => {
  const files = fixture();
  updateJson(files, "tooling/project.json", (policy) => {
    policy.reservedCatalogDependencies.typescript = "Temporary reservation.";
  });
  expectRule(files, "CATALOG_RESERVATION");
});

test("missing local workflow/action references are rejected", () => {
  const files = fixture();
  files.set(".github/workflows/ci.yml", "- uses: ./.github/actions/missing\n");
  expectRule(files, "WORKFLOW_LOCAL");
});

test("existing local action references are accepted", () => {
  const files = fixture();
  files.set(".github/workflows/ci.yml", "- uses: ./.github/actions/example\n");
  files.set(
    ".github/actions/example/action.yml",
    "name: Example\nruns:\n  using: node24\n  main: index.js\n",
  );
  assert.deepEqual(analyze(files).findings, []);
});

test("stale mutable-action exceptions are rejected", () => {
  const files = fixture();
  files.delete(".github/workflows/coding-bible.yml");
  expectRule(files, "WORKFLOW_EXCEPTION");
});

test("project exception policy must have the documented object/array shape", () => {
  const files = fixture();
  updateJson(files, "tooling/project.json", (policy) => {
    policy.mutableActionExceptions = [];
  });
  expectRule(files, "DRIFT_INPUT");
});

test("nested evergreen documentation must remain reachable too", () => {
  const files = fixture();
  files.set("docs/guides/hidden.md", "# Hidden guide\n");
  expectRule(files, "DOC_ORPHAN");
});

test("new public packages must join the packed-consumer release contract", () => {
  const files = fixture();
  files.set(
    "packages/extra/package.json",
    JSON.stringify({
      name: "@flux-ui/extra",
      version: "0.0.0",
      type: "module",
      license: "MIT",
      homepage: "https://flux.varua.ca/",
      files: ["dist"],
      repository: {
        url: "git+https://github.com/Xanhast-pf/flux-ui.git",
        directory: "packages/extra",
      },
      bugs: { url: "https://github.com/Xanhast-pf/flux-ui/issues" },
      publishConfig: { access: "public", provenance: true },
      exports: {
        ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
      },
    }),
  );
  expectRule(files, "PACKAGE_PUBLIC");
});

test("public packages cannot depend at runtime on private workspace packages", () => {
  const files = fixture();
  files.set(
    "packages/identity/package.json",
    JSON.stringify({
      name: "@flux-ui/identity",
      private: true,
      version: "0.0.0",
    }),
  );
  updateJson(files, "packages/react/package.json", (pkg) => {
    pkg.dependencies = { "@flux-ui/identity": "workspace:*" };
  });
  expectRule(files, "PACKAGE_DEPENDENCY");
});

test("root references to workspace packages must use the workspace protocol", () => {
  const files = fixture();
  updateJson(files, "package.json", (pkg) => {
    pkg.devDependencies["@flux-ui/react"] = "^0.2.0";
  });
  expectRule(files, "PACKAGE_DEPENDENCY");
});

test("catalog reservations cannot outlive their catalog entries", () => {
  const files = fixture();
  updateJson(files, "tooling/project.json", (policy) => {
    policy.reservedCatalogDependencies["@missing/reservation"] =
      "No longer present.";
  });
  expectRule(files, "CATALOG_RESERVATION");
});

test("component sizeClass must match the size policy", () => {
  const files = fixture();
  const path = "packages/react/src/components/Example/component.meta.json";
  const meta = JSON.parse(files.get(path));
  meta.sizeClass = "enormous";
  files.set(path, JSON.stringify(meta));
  expectRule(files, "COMPONENT_SIZE_CLASS");
});

test("private workspaces cannot hide install-time hooks", () => {
  const files = fixture();
  files.set(
    "packages/identity/package.json",
    JSON.stringify({
      name: "@flux-ui/identity",
      private: true,
      version: "0.0.0",
      scripts: { postinstall: "node setup.mjs" },
    }),
  );
  expectRule(files, "PACKAGE_INSTALL_HOOK");
});

test("the private root cannot hide install-time hooks", () => {
  const files = fixture();
  updateJson(files, "package.json", (pkg) => {
    pkg.scripts = { preinstall: "node setup.mjs" };
  });
  expectRule(files, "PACKAGE_INSTALL_HOOK");
});

test("RouteView cannot expose hidden static routes", () => {
  const files = fixture();
  files.set(
    "apps/docs/src/App.tsx",
    'function RouteView({ route }: { route: string }) { switch(route) {case "overview": break; case "documentation": break; case "secret": break;} }',
  );
  expectRule(files, "ROUTE_VIEW");
});

test("RouteView cannot contain duplicate static cases", () => {
  const files = fixture();
  files.set(
    "apps/docs/src/App.tsx",
    'function RouteView({ route }: { route: string }) { switch(route) {case "overview": break; case "overview": break; case "documentation": break;} }',
  );
  expectRule(files, "ROUTE_DUPLICATE");
});

test("public package export subpath keys stay inside the package namespace", () => {
  const files = fixture();
  updateJson(files, "packages/react/package.json", (pkg) => {
    pkg.exports["../escape"] = "./dist/index.js";
  });
  expectRule(files, "PACKAGE_EXPORT");
});

test("non-component test files cannot be empty", () => {
  const files = fixture();
  files.set(
    "tooling/example/empty.test.mjs",
    'import test from "node:test"; export {};',
  );
  expectRule(files, "TEST_EMPTY");
});

test("Node test aliases cannot hide focused selection", () => {
  const files = fixture();
  files.set(
    "tooling/example/focused.test.mjs",
    'import check from "node:test"; check.only("focused", () => {});',
  );
  expectRule(files, "TEST_SELECTION");
});

test("Playwright specs cannot silently skip coverage", () => {
  const files = fixture();
  files.set(
    "apps/docs/tests/skipped.spec.ts",
    'import { test as scenario } from "@playwright/test"; scenario.skip("skipped", async () => {});',
  );
  expectRule(files, "TEST_SELECTION");
});

test("ordinary non-component Node and Playwright tests remain valid", () => {
  const files = fixture();
  files.set(
    "tooling/example/works.test.mjs",
    'import check from "node:test"; check("works", () => {});',
  );
  files.set(
    "apps/docs/tests/works.spec.ts",
    'import { test as scenario } from "@playwright/test"; scenario("works", async () => {});',
  );
  assert.deepEqual(analyze(files).findings, []);
});

test("expected-failure and conditional test modifiers are treated as suppressed coverage", () => {
  for (const modifier of ["fixme", "fail", "fails", "skipIf", "runIf"]) {
    const files = fixture();
    files.set(
      "apps/docs/tests/suppressed.spec.ts",
      `import { test } from "@playwright/test"; test.${modifier}("suppressed", async () => {});`,
    );
    expectRule(files, "TEST_SELECTION");
  }
});

test("heading anchors structurally ignore inline HTML without regex sanitization", () => {
  const ids = headingIds(
    [
      "# <span>Visible</span>",
      "# <script>alert(1)</script>",
      '# <img src="x>y" onerror="alert(1)"> Image',
      "# <!-- hidden -->Comment visible",
      "# Use `<Box>` safely",
      "# <script alert(1)",
    ].join("\n"),
  );

  assert.deepEqual(
    [...ids],
    [
      "visible",
      "alert1",
      "-image",
      "comment-visible",
      "use-box-safely",
      "script-alert1",
    ],
  );
  for (const id of ids) assert.match(id, /^[\p{L}\p{N}_-]+$/u);
});
