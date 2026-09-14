/** Browser download adapter: application data is never uploaded. */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadJson(value: unknown, filename: string): void {
  downloadText(
    `${JSON.stringify(value, null, 2)}\n`,
    filename,
    "application/json",
  );
}
export function downloadText(
  text: string,
  filename: string,
  type = "text/plain;charset=utf-8",
): void {
  downloadBlob(new Blob([text], { type }), filename);
}
export function downloadBytes(
  bytes: Uint8Array<ArrayBuffer>,
  filename: string,
  type = "application/zip",
): void {
  downloadBlob(new Blob([bytes], { type }), filename);
}
