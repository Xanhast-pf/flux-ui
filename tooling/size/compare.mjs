import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bundledEntryMethod, measureBundledEntry } from "./bundled-entry.mjs";
import {
  discoverComponents,
  measureEntry,
  regressionFailures,
} from "./lib.mjs";

// No checkout, index changes, dependency installation, or baseline writes.
const root = process.cwd();
const [baseRef, currentRef = "working-tree", flag] = process.argv.slice(2);
if (!baseRef || (flag && flag !== "--json"))
  throw new Error(
    "Usage: node tooling/size/compare.mjs <base> [current-ref|working-tree] [--json]",
  );
const temporary = await mkdtemp(join(tmpdir(), "flux-size-compare-"));
const git = (...args) =>
  execFileSync("git", args, { cwd: root, maxBuffer: 128 * 1024 * 1024 });

async function snapshot(ref, destination) {
  await mkdir(destination);
  if (ref !== "working-tree") {
    const revision = git("rev-parse", "--verify", `${ref}^{commit}`)
      .toString()
      .trim();
    execFileSync("tar", ["-xf", "-", "-C", destination], {
      input: git("archive", revision),
    });
    return revision;
  }
  const paths = new Set(
    git("ls-files", "-z", "--cached", "--others", "--exclude-standard")
      .toString()
      .split("\0")
      .filter(Boolean),
  );
  for (const path of paths) {
    await mkdir(dirname(join(destination, path)), { recursive: true });
    try {
      await copyFile(join(root, path), join(destination, path));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return `${git("rev-parse", "HEAD").toString().trim()} + working tree`;
}

// Share installed third-party tools, but redirect workspace links to each copy.
// Keep node_modules directories local so build caches cannot touch the checkout.
async function linkDependencies(source, destination, snapshotRoot) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name.startsWith(".vite") || entry.name === ".cache") continue;
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.name.startsWith("@") && entry.isDirectory()) {
      await linkDependencies(from, to, snapshotRoot);
    } else {
      const actual = await realpath(from);
      const workspacePath = relative(root, actual);
      await symlink(
        workspacePath.startsWith("packages/") &&
          !workspacePath.includes("node_modules")
          ? join(snapshotRoot, workspacePath)
          : actual,
        to,
      );
    }
  }
}

try {
  const baseRoot = join(temporary, "base");
  const currentRoot = join(temporary, "current");
  const base = await snapshot(baseRef, baseRoot);
  const current = await snapshot(currentRef, currentRoot);
  for (const path of ["pnpm-lock.yaml", "pnpm-workspace.yaml"]) {
    const installed = await readFile(join(root, path), "utf8");
    for (const copy of [baseRoot, currentRoot]) {
      if ((await readFile(join(copy, path), "utf8")) !== installed)
        throw new Error(
          `${path} differs; cannot reuse the installed toolchain for this comparison.`,
        );
    }
  }
  const measurements = [];
  for (const copy of [baseRoot, currentRoot]) {
    await linkDependencies(
      join(root, "node_modules"),
      join(copy, "node_modules"),
      copy,
    );
    for (const name of await readdir(join(copy, "packages"))) {
      const installedModules = join(root, "packages", name, "node_modules");
      try {
        await stat(installedModules);
      } catch (error) {
        if (error.code === "ENOENT") continue;
        throw error;
      }
      await linkDependencies(
        installedModules,
        join(copy, "packages", name, "node_modules"),
        copy,
      );
    }
    console.error(
      `Building ${copy === baseRoot ? base : current} in isolation...`,
    );
    execFileSync("pnpm", ["build:packages"], {
      cwd: copy,
      stdio: ["ignore", 2, 2],
    });
    const components = await discoverComponents(copy);
    const entries = {};
    const dist = join(copy, "packages/react/dist");
    for (const component of components) {
      const entry = join(dist, `${component.slug}.js`);
      entries[component.slug] = {
        name: component.name,
        bundled: await measureBundledEntry(entry, dist),
        graph: await measureEntry(entry, dist),
      };
    }
    measurements.push(entries);
  }
  const [before, after] = measurements;
  const baseline = JSON.parse(
    await readFile(join(currentRoot, "tooling/size/baseline.json"), "utf8"),
  );
  const rows = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .sort()
    .map((slug) => {
      const previous = before[slug];
      const next = after[slug];
      const delta =
        previous && next ? next.bundled.brotli - previous.bundled.brotli : null;
      return {
        component: next?.name ?? previous.name,
        baseBrotli: previous?.bundled.brotli ?? null,
        currentBrotli: next?.bundled.brotli ?? null,
        delta,
        percent:
          delta === null || previous.bundled.brotli === 0
            ? null
            : (100 * delta) / previous.bundled.brotli,
        emittedRegressions: next
          ? regressionFailures(next.graph, baseline.components?.[slug])
          : [],
        baseGraph: previous?.graph ?? null,
        currentGraph: next?.graph ?? null,
        baseBundle: previous?.bundled ?? null,
        currentBundle: next?.bundled ?? null,
      };
    });
  // Run the current bundled and aggregate gates against the isolated current build.
  const check = fileURLToPath(new URL("./check.mjs", import.meta.url));
  const checked = spawnSync(process.execPath, [check, "--json"], {
    cwd: currentRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (checked.error) throw checked.error;
  if (checked.status !== 0 && checked.status !== 1)
    throw new Error(checked.stderr);
  const sizeCheck = {
    status: checked.status,
    failures: checked.stderr,
    report: JSON.parse(checked.stdout),
  };
  const report = {
    base,
    current,
    bundledEntryMethod,
    compression: {
      gzipLevel: 9,
      brotliQuality: 11,
      node: process.version,
      zlib: process.versions.zlib,
    },
    rows,
    sizeCheck,
  };
  if (flag === "--json") console.log(JSON.stringify(report, null, 2));
  else {
    console.error(`Current size gate exit status: ${sizeCheck.status}`);
    if (sizeCheck.failures) console.error(sizeCheck.failures);
    console.log(
      `Base: ${base}\nCurrent: ${current}\nComponent | Base Brotli | Current Brotli | Delta | Percent`,
    );
    for (const row of rows)
      console.log(
        `${row.component} | ${row.baseBrotli ?? "absent"} | ${row.currentBrotli ?? "absent"} | ${row.delta ?? "n/a"} | ${row.percent === null ? "n/a" : row.percent.toFixed(2) + "%"}`,
      );
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
