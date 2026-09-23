import process from "node:process";
import { existsSync } from "node:fs";
import { chromium, firefox, webkit } from "@playwright/test";

// Cheap optional doctor probe; never launches a browser or installs anything.
process.exitCode = [chromium, firefox, webkit].every((browser) =>
  existsSync(browser.executablePath()),
)
  ? 0
  : 1;
