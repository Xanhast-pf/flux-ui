import assert from "node:assert/strict";
import test from "node:test";
import { gitBoolean, gitConfigValue } from "./git-config.mjs";

const cases = [
  [
    "inline comment",
    "[core]\nhooksPath = .husky/_ # local hook directory\n",
    ".husky/_",
  ],
  ["semicolon comment", "[core]\nhooksPath = .husky/_ ; local\n", ".husky/_"],
  [
    "quoted hash and spaces",
    '[core]\nhooksPath = ".husky/space # dir" # note\n',
    ".husky/space # dir",
  ],
  ["quoted edges", '[core]\nhooksPath = " .husky/_ "\n', " .husky/_ "],
  [
    "backslash escapes",
    '[core]\nhooksPath = ".husky\\\\folder"\n',
    ".husky\\folder",
  ],
  [
    "quoted subsection is not core",
    '[core]\nhooksPath = .husky/_\n[core "other"]\nhooksPath = ignored\n',
    ".husky/_",
  ],
  [
    "old-style subsection is not core",
    "[core]\nhooksPath = .husky/_\n[core.other]\nhooksPath = ignored\n",
    ".husky/_",
  ],
  ["case-insensitive names", "[CORE]\nHOOKSPATH = .husky/_\n", ".husky/_"],
  ["same-line assignment", "[core] hooksPath = .husky/_\n", ".husky/_"],
  ["continued value", "[core]\nhooksPath = .husky/\\\n_\n", ".husky/_"],
  [
    "comment cannot continue setting",
    "[core]\nhooksPath = .husky/_ # note\\\nfilemode = true\n",
    ".husky/_",
  ],
  [
    "last local value",
    "[core]\nhooksPath = .husky/old\nhooksPath = .husky/_\n",
    ".husky/_",
  ],
  [
    "explicit empty override",
    "[core]\nhooksPath = .husky/_\nhooksPath =\n",
    "",
  ],
  [
    "bare unrelated boolean",
    "[core]\nfilemode # true\nhooksPath = .husky/_\n",
    ".husky/_",
  ],
];
for (const [name, source, expected] of cases)
  test(`local Git config: ${name}`, () =>
    assert.equal(gitConfigValue(source, "core", "hooksPath"), expected));

for (const value of ["true", "TRUE", "yes", "on", "1", "2"])
  test(`Git boolean accepts ${value}`, () =>
    assert.equal(gitBoolean(value), true));
for (const value of [null, "", "false", "FALSE", "no", "off", "0"])
  test(`Git boolean treats ${value} as false`, () =>
    assert.equal(gitBoolean(value), false));

test("implicit Git boolean is true without requiring an equals sign", () => {
  assert.equal(
    gitBoolean(
      gitConfigValue(
        "[extensions]\nworktreeConfig\n",
        "extensions",
        "worktreeConfig",
      ),
    ),
    true,
  );
});

test("unsupported includes and malformed syntax produce diagnostics rather than guessed values", () => {
  for (const source of [
    "[include]\npath = other.conf\n",
    '[includeIf "onbranch:main"]\npath = other.conf\n',
    '[core]\nhooksPath = "unterminated\n',
    '[core]\nhooksPath = "bad\\q"\n',
    "[core\nhooksPath = .husky/_\n",
  ])
    assert.throws(() => gitConfigValue(source, "core", "hooksPath"));
  assert.throws(() => gitBoolean("sometimes"));
});
