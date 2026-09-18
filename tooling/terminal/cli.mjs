import { resolveCommand } from "./public-commands.mjs";
import { runPipeline } from "./tasks.mjs";

try {
  const result = resolveCommand(process.argv.slice(2));
  if (result.help) console.log(result.help);
  else {
    process.exitCode = await runPipeline(result.task, result.args);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
