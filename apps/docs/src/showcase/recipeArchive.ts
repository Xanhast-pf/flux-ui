export interface RecipeBundle {
  schemaVersion: 1;
  scene: string;
  entry: string;
  files: Readonly<Record<string, string>>;
}
const crcTable = Array.from({ length: 256 }, (_, value) => {
  let current = value;
  for (let bit = 0; bit < 8; bit += 1)
    current =
      (current & 1) === 1 ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
  return current >>> 0;
});
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes)
    crc = (crc >>> 8) ^ (crcTable[(crc ^ byte) & 255] ?? 0);
  return (crc ^ 0xffffffff) >>> 0;
}
function safePath(path: string): boolean {
  return (
    path.length > 0 &&
    !path.startsWith("/") &&
    !path.includes("\\") &&
    !path.includes(":") &&
    ![...path].some((character) => character.charCodeAt(0) < 32) &&
    path
      .split("/")
      .every((part) => part !== "" && part !== "." && part !== "..")
  );
}
/** Deterministic UTF-8 ZIP32, stored entries; no eval, network calls or executable blobs. */
export function recipeArchive(files: Readonly<Record<string, string>>) {
  const encoder = new TextEncoder();
  const entries = Object.entries(files)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([path, text]) => {
      if (!safePath(path)) throw new Error(`Unsafe recipe path: ${path}`);
      const name = encoder.encode(path);
      const bytes = encoder.encode(text);
      if (name.length > 65535) throw new RangeError("Recipe path is too long.");
      return { name, bytes, crc: crc32(bytes), offset: 0 };
    });
  if (entries.length === 0 || entries.length > 1024)
    throw new RangeError("A recipe must contain between 1 and 1,024 files.");
  const bodyLength = entries.reduce(
    (sum, entry) => sum + 30 + entry.name.length + entry.bytes.length,
    0,
  );
  const centralLength = entries.reduce(
    (sum, entry) => sum + 46 + entry.name.length,
    0,
  );
  if (bodyLength + centralLength > 16 * 1024 * 1024)
    throw new RangeError("Recipe exceeds the 16 MiB source-export limit.");
  const result = new Uint8Array(bodyLength + centralLength + 22);
  const view = new DataView(result.buffer);
  let cursor = 0;
  function u16(value: number) {
    view.setUint16(cursor, value, true);
    cursor += 2;
  }
  function u32(value: number) {
    view.setUint32(cursor, value, true);
    cursor += 4;
  }
  function data(bytes: Uint8Array) {
    result.set(bytes, cursor);
    cursor += bytes.length;
  }
  for (const entry of entries) {
    entry.offset = cursor;
    u32(0x04034b50);
    u16(20);
    u16(0x800);
    u16(0);
    u16(0);
    u16(33);
    u32(entry.crc);
    u32(entry.bytes.length);
    u32(entry.bytes.length);
    u16(entry.name.length);
    u16(0);
    data(entry.name);
    data(entry.bytes);
  }
  for (const entry of entries) {
    u32(0x02014b50);
    u16(20);
    u16(20);
    u16(0x800);
    u16(0);
    u16(0);
    u16(33);
    u32(entry.crc);
    u32(entry.bytes.length);
    u32(entry.bytes.length);
    u16(entry.name.length);
    u16(0);
    u16(0);
    u16(0);
    u16(0);
    u32(0);
    u32(entry.offset);
    data(entry.name);
  }
  u32(0x06054b50);
  u16(0);
  u16(0);
  u16(entries.length);
  u16(entries.length);
  u32(centralLength);
  u32(bodyLength);
  u16(0);
  return result;
}
