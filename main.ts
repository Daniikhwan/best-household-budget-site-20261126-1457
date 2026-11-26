// Hearth entrypoint (Node 22, standard library only).
//
// The site is plain static files in app/ next to this file. This program
// hands the entry in: it copies app/ and screenshots/ into the output
// directory and writes dossier.json there with the kit's vendored library,
// so the judge reads exactly the files that were graded.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(root, "app"), join(outDir, "app"), { recursive: true });

const shotsDir = join(root, "screenshots");
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// Caps are the scorer's own: at most 4 screenshots of 256 KiB, app/ at
// most 993 files and 16 MiB, and the dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  })
);

console.log("Hearth entry written to " + outDir);
