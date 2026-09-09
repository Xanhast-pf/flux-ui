// pnpm does not currently link the CLI binary for this Git-subdirectory
// dependency reliably. Import the package's public CLI export directly instead.
import "@coding-bible/analyzer/bin";
