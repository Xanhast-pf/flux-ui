import assert from "node:assert/strict";
import test from "node:test";
import {
  crc32,
  recipeArchive,
} from "../../apps/docs/src/showcase/recipeArchive.ts";
import { floatingPosition } from "../../packages/react/src/internal/floatingPosition.ts";

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
