import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const manifestFile = readFileSync("package.json", "utf-8");
const manifest = JSON.parse(manifestFile);

delete manifest.scripts;
delete manifest.devDependencies;

const sanitized = JSON.stringify(manifest, null, 2);
writeFileSync(join(process.cwd(), "dist", "package.json"), sanitized);
