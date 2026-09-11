import { verifyPackage } from "./contract.mjs";
const { pkg } = await verifyPackage(process.env.FLUX_RELEASE_FILE);
console.log(`Verified ${pkg.name}@${pkg.version}: ${pkg.sha256}`);
