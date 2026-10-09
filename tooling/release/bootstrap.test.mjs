import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import {
  BOOTSTRAP_PACKAGES,
  BOOTSTRAP_TAG,
  BOOTSTRAP_VERSION,
  bootstrap,
  bootstrapManifest,
  parseBootstrapArgs,
  supportsVersion,
} from "./bootstrap.mjs";

test("only the three explicit @varua identities can be registered", () => {
  assert.deepEqual(
    parseBootstrapArgs([]).packages.map(({ name }) => name),
    ["@varua/flux-ui", "@varua/icons", "@varua/tokens"],
  );
  assert.deepEqual(
    parseBootstrapArgs(["--package", "@varua/icons"]).packages.map(
      (p) => p.name,
    ),
    ["@varua/icons"],
  );
  for (const args of [
    ["--package", "@other/flux-ui"],
    ["--package", "../icons"],
    ["--package"],
    ["--package", "@varua/tokens", "--package", "@varua/icons"],
    ["--execute"],
    ["--stage"],
    ["--confirm-register-varua"],
  ])
    assert.throws(() => parseBootstrapArgs(args));
  assert.equal(
    parseBootstrapArgs(["--stage", "--confirm-register-varua"]).stage,
    true,
  );
});

test("preview cannot execute npm or create bootstrap fixtures", async () => {
  const lines = [];
  await bootstrap([], {
    run: () => {
      throw new Error("preview unexpectedly executed a process");
    },
    log: (line) => lines.push(line),
  });
  assert.match(lines.join("\n"), /PREVIEW ONLY/u);
  assert.match(lines.join("\n"), /@varua\/flux-ui/u);
});

test("bootstrap packages are minimal placeholders, not actual library releases", () => {
  assert.equal(BOOTSTRAP_VERSION, "0.0.1");
  assert.equal(BOOTSTRAP_TAG, "bootstrap");
  for (const { name } of BOOTSTRAP_PACKAGES) {
    const pkg = bootstrapManifest(name);
    assert.equal(pkg.name, name);
    assert.equal(pkg.version, BOOTSTRAP_VERSION);
    assert.equal(pkg.publishConfig.access, "public");
    assert.equal(pkg.private, undefined);
    assert.equal(pkg.scripts, undefined);
    assert.equal(pkg.dependencies, undefined);
    assert.equal(pkg.devDependencies, undefined);
  }
  assert.throws(() => bootstrapManifest("@varua/unrelated"));
});

test("staging requires supported Node and npm versions and a local login", async () => {
  assert.equal(supportsVersion("22.14.0", [22, 14, 0]), true);
  assert.equal(supportsVersion("24.21.0", [22, 14, 0]), true);
  assert.equal(supportsVersion("22.13.9", [22, 14, 0]), false);
  assert.equal(supportsVersion("11.15.0", [11, 15, 0]), true);
  assert.equal(supportsVersion("11.14.9", [11, 15, 0]), false);
  assert.equal(supportsVersion("not-a-version", [11, 15, 0]), false);

  const argv = ["--stage", "--confirm-register-varua"];
  await assert.rejects(
    bootstrap(argv, { env: { CI: "true" }, log: () => {} }),
    /not in CI/u,
  );
  await assert.rejects(
    bootstrap(argv, { env: {}, nodeVersion: "22.13.9", log: () => {} }),
    /Node.js/u,
  );
  await assert.rejects(
    bootstrap(argv, {
      env: {},
      run: () => ({ status: 0, stdout: "11.14.9" }),
      log: () => {},
    }),
    /npm 11.15.0/u,
  );
  const calls = [];
  await assert.rejects(
    bootstrap(argv, {
      env: {},
      run: (args) => {
        calls.push(args);
        return args[0] === "--version"
          ? { status: 0, stdout: "11.19.0" }
          : { status: 1 };
      },
      log: () => {},
    }),
    /npm login check failed/u,
  );
  assert.deepEqual(
    calls.map((args) => args[0]),
    ["--version", "whoami"],
  );
});

test("staging uses only temporary minimal directories and the npm stage command", async () => {
  const manifests = [];
  const directories = [];
  const calls = [];
  const run = (args, options = {}) => {
    calls.push(args);
    if (args[0] === "--version") return { status: 0, stdout: "11.19.0" };
    if (args[0] === "whoami") return { status: 0, stdout: "maintainer" };
    assert.deepEqual(args, [
      "stage",
      "publish",
      "--access=public",
      "--tag=bootstrap",
      "--registry=https://registry.npmjs.org/",
      "--ignore-scripts",
    ]);
    const manifest = JSON.parse(
      readFileSync(join(options.cwd, "package.json"), "utf8"),
    );
    assert.match(
      readFileSync(join(options.cwd, "README.md"), "utf8"),
      /Do not approve this staged version/u,
    );
    directories.push(options.cwd);
    manifests.push(manifest);
    return { status: 0 };
  };
  await bootstrap(["--stage", "--confirm-register-varua"], {
    run,
    env: {},
    nodeVersion: "24.21.0",
    log: () => {},
  });
  assert.deepEqual(
    manifests.map((manifest) => manifest.name),
    BOOTSTRAP_PACKAGES.map((pkg) => pkg.name),
  );
  assert.deepEqual(
    calls.map((args) => args.slice(0, 2).join(" ")),
    [
      "--version",
      "whoami --registry=https://registry.npmjs.org/",
      ...Array(3).fill("stage publish"),
    ],
  );
  assert.equal(new Set(directories).size, 3);
  for (const path of directories) assert.equal(existsSync(path), false);
});

test("a staging error stops the batch without staging other packages", async () => {
  const calls = [];
  await assert.rejects(
    bootstrap(["--stage", "--confirm-register-varua"], {
      env: {},
      log: () => {},
      run: (args) => {
        if (args[0] === "--version") return { status: 0, stdout: "11.19.0" };
        if (args[0] === "whoami") return { status: 0 };
        calls.push(args);
        return { status: calls.length === 2 ? 1 : 0 };
      },
    }),
    /Earlier names may already have been registered/u,
  );
  assert.equal(calls.length, 2);
});
