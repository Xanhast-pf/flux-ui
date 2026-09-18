import process from "node:process";
import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";

// Cheap optional doctor probe; never launches a browser or installs anything.
process.exitCode = existsSync(chromium.executablePath()) ? 0 : 1;
