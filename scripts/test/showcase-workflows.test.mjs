import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  filterTransactions,
  invitationError,
  ledgerCsv,
  ledgerTotals,
  transactions,
} from "../../apps/docs/src/showcase/scenes/finance.model.ts";
import {
  createStudioSession,
  sameSession,
  snapshotSession,
  studioExport,
} from "../../apps/docs/src/showcase/scenes/music.model.ts";
import {
  crc32,
  recipeArchive,
} from "../../apps/docs/src/showcase/recipeArchive.ts";
import { floatingPosition } from "../../packages/react/src/internal/floatingPosition.ts";
test("ledger totals follow workspace, query and status filters", () => {
  const north = filterTransactions(transactions, "north", "", "all");
  assert.equal(north.length, 7);
  assert.deepEqual(ledgerTotals(north), {
    incoming: 1205000,
    outgoing: 23000,
    net: 1182000,
  });
  assert.deepEqual(
    filterTransactions(transactions, "north", " PACKAGING ", "Pending").map(
      (row) => row.id,
    ),
    ["F-1039"],
  );
  assert.equal(
    filterTransactions(transactions, "north", "PACKAGING", "Settled").length,
    0,
  );
  assert.equal(
    filterTransactions(transactions, "fieldwork", "", "all").length,
    3,
  );
  assert.deepEqual(ledgerTotals([]), { incoming: 0, outgoing: 0, net: 0 });
});
test("finance operations do not mutate their fixture inputs", () => {
  const original = JSON.stringify(transactions);
  ledgerTotals(transactions);
  ledgerCsv(transactions);
  filterTransactions(transactions, "north", "", "all");
  assert.equal(JSON.stringify(transactions), original);
});
test("CSV preserves newlines and escapes quotes and formula-like text", () => {
  for (const note of [
    "=SUM(A1:A2)",
    " +SUM(A1:A2)",
    "\talert",
    "\n=1",
    "@x",
    "-1",
  ]) {
    const csv = ledgerCsv([
      { ...transactions[0], customer: 'A "quoted", name', note },
    ]);
    assert.ok(csv.includes('"A ""quoted"", name"'));
    assert.ok(csv.includes(`"'${note}"`));
    assert.ok(csv.includes(",4800.00,"));
    assert.ok(csv.endsWith("\r\n"));
  }
  assert.ok(
    ledgerCsv([{ ...transactions[0], note: "first\nsecond" }]).includes(
      '"first\nsecond"',
    ),
  );
});
test("invitation validation requires valid local fields and rejects case-insensitive duplicates", () => {
  assert.equal(invitationError(" new@example.test ", "Member", []), null);
  assert.match(invitationError("broken", "Member", []), /email/);
  assert.match(invitationError("new@example.test", null, []), /role/);
  assert.match(invitationError("new@example.test", "Owner", []), /role/);
  assert.match(
    invitationError(" EXISTING@example.test ", "Viewer", [
      "existing@example.test",
    ]),
    /already/,
  );
});
test("studio checkpoints deeply isolate channels and normalize mute ordering", () => {
  const original = createStudioSession();
  const checkpoint = snapshotSession(original);
  original.channels.drums.cutoff = 3200;
  assert.equal(checkpoint.channels.drums.cutoff, 1000);
  assert.equal(sameSession(original, checkpoint), false);
  assert.equal(
    sameSession(createStudioSession(), snapshotSession(createStudioSession())),
    true,
  );
  assert.equal(
    sameSession(
      { ...checkpoint, muted: ["bass", "drums", "bass"] },
      { ...checkpoint, muted: ["drums", "bass"] },
    ),
    true,
  );
  assert.equal(
    sameSession(checkpoint, { ...checkpoint, notes: "edited" }),
    false,
  );
});
test("studio exports settings without claiming audio or mutating the session", () => {
  const session = createStudioSession();
  const exported = studioExport(session);
  assert.equal(exported.producesAudio, false);
  assert.equal(exported.kind, "flux-studio-ui-simulation");
  assert.notEqual(exported.session.channels.bass, session.channels.bass);
  assert.deepEqual(
    JSON.parse(JSON.stringify(exported)).session,
    snapshotSession(session),
  );
});
test("floating placement flips, respects RTL, clamps and sanitizes offsets", () => {
  const anchor = { left: 100, top: 80, width: 40, height: 20 };
  const popup = { width: 120, height: 60 };
  const viewport = { width: 400, height: 300 };
  assert.deepEqual(floatingPosition(anchor, popup, viewport), {
    side: "bottom",
    left: 100,
    top: 108,
    maxHeight: 184,
  });
  assert.equal(
    floatingPosition(anchor, popup, viewport, { rtl: true }).left,
    20,
  );
  const flipped = floatingPosition({ ...anchor, top: 250 }, popup, viewport);
  assert.equal(flipped.side, "top");
  assert.equal(flipped.top, 182);
  assert.equal(
    floatingPosition(anchor, popup, viewport, { side: "left" }).side,
    "right",
  );
  assert.equal(
    floatingPosition(anchor, popup, viewport, { offset: -1 }).top,
    100,
  );
  assert.equal(
    floatingPosition(anchor, popup, viewport, { offset: NaN }).top,
    108,
  );
  assert.equal(
    floatingPosition({ ...anchor, left: -100 }, popup, viewport).left,
    8,
  );
});
test("floating placement remains finite for tiny viewports and oversized surfaces", () => {
  for (const side of ["top", "right", "bottom", "left"]) {
    const result = floatingPosition(
      { left: 1, top: 1, width: 10, height: 10 },
      { width: 100, height: 100 },
      { width: 16, height: 16 },
      side,
    );
    assert.ok(Number.isFinite(result.left));
    assert.ok(Number.isFinite(result.top));
    assert.ok(result.maxHeight >= 0);
  }
});
test("CRC32 matches a standard check value and an empty payload", () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  assert.equal(crc32(new Uint8Array()), 0);
});
test("ZIP output is deterministic, UTF-8, stored and centrally indexed", () => {
  const files = {
    "src/é.ts": "export const café = 1;\n",
    "README.md": "Hello",
  };
  const bytes = recipeArchive(files);
  assert.deepEqual(
    bytes,
    recipeArchive(Object.fromEntries(Object.entries(files).reverse())),
  );
  const view = new DataView(bytes.buffer);
  const end = bytes.length - 22;
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.equal(view.getUint16(6, true), 0x800);
  assert.equal(view.getUint16(8, true), 0);
  assert.equal(view.getUint32(end, true), 0x06054b50);
  assert.equal(view.getUint16(end + 10, true), 2);
  const directory = view.getUint32(end + 16, true);
  assert.equal(view.getUint32(directory, true), 0x02014b50);
  let cursor = 0;
  for (const [name, text] of Object.entries(files).sort(([a], [b]) =>
    a < b ? -1 : 1,
  )) {
    const nameLength = view.getUint16(cursor + 26, true);
    const length = view.getUint32(cursor + 18, true);
    const decoder = new TextDecoder();
    assert.equal(
      decoder.decode(bytes.subarray(cursor + 30, cursor + 30 + nameLength)),
      name,
    );
    const data = bytes.subarray(
      cursor + 30 + nameLength,
      cursor + 30 + nameLength + length,
    );
    assert.equal(decoder.decode(data), text);
    assert.equal(view.getUint32(cursor + 14, true), crc32(data));
    cursor += 30 + nameLength + length;
  }
  assert.equal(cursor, directory);
});
test("ZIP rejects traversal, absolute paths, control characters and oversized exports", () => {
  for (const path of [
    "",
    "/root",
    "../file",
    "a/../file",
    "a//b",
    "./file",
    "C:/file",
    "a\\b",
    "a\nfile",
  ]) {
    assert.throws(() => recipeArchive({ [path]: "source" }), /Unsafe/);
  }
  assert.throws(() => recipeArchive({}), /between/);
  assert.throws(
    () => recipeArchive({ "large.txt": "x".repeat(16 * 1024 * 1024) }),
    /16 MiB/,
  );
});
test("each mood defines the same on-grid density and hierarchy tokens without changing spacing steps", async () => {
  const css = await readFile(
    new URL("../../packages/tokens/src/presets.css", import.meta.url),
    "utf8",
  );
  let expected;
  for (const mood of ["paper", "studio", "bloom", "terminal"]) {
    const body = new RegExp(
      `\\[data-flux-theme="${mood}"\\]\\s*\\{([^}]+)\\}`,
      "u",
    ).exec(css)?.[1];
    assert.ok(body);
    const dimensions = [
      ...body.matchAll(
        /--flux-((?:radius|control|font)-[a-z-]+):\s*([^;]+);/gu,
      ),
    ];
    const names = dimensions.map((match) => match[1]).sort();
    if (expected === undefined) expected = names;
    else assert.deepEqual(names, expected);
    for (const [, name, value] of dimensions) {
      if (value.endsWith("rem"))
        assert.equal((Number.parseFloat(value) * 4) % 1, 0, `${mood}/${name}`);
      if (name.startsWith("control-")) assert.ok(Number.parseFloat(value) >= 2);
    }
    assert.equal(/--flux-space-\d+:/u.test(body), false);
  }
});
