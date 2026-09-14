import { Readable } from "node:stream";
import { spec } from "node:test/reporters";
import { basename } from "node:path";
import { reportProgress } from "./progress.mjs";
export default async function* reporter(source) {
  async function* observe() {
    for await (const event of source) {
      if (event.type === "test:enqueue" && event.data.file)
        reportProgress(basename(event.data.file));
      if (
        event.type === "test:summary" &&
        !event.data.file &&
        process.env.FLUX_TERMINAL_ACTIVE
      ) {
        const counts = event.data.counts;
        console.error(
          `Tests: ${counts.passed} passed · ${counts.failed} failed · ${counts.skipped} skipped · ${counts.todo} todo · ${counts.cancelled} cancelled`,
        );
      }
      yield event;
    }
  }
  yield* Readable.from(observe()).pipe(spec());
}
