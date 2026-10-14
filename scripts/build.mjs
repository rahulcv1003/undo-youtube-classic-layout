import { build } from "esbuild";
import { mkdir, readFile, writeFile, cp, stat } from "node:fs/promises";
import sharp from "sharp";
import { resolve } from "node:path";
const out = resolve("dist");
await mkdir(out, { recursive: true });
await build({
  entryPoints: [
    "src/background/service-worker.ts",
    "src/sites/youtube/content.ts",
    "src/sites/youtube/theater-bridge.ts",
    "src/ui/popup.ts",
    "src/ui/options.ts",
    "src/ui/welcome.ts",
    "src/ui/report.ts",
  ],
  outdir: out,
  outbase: "src",
  bundle: true,
  minify: true,
  target: "chrome116",
  format: "esm",
  legalComments: "none",
  sourcemap: false,
});
await cp("manifest.json", `${out}/manifest.json`);
for (const dir of ["ui", "_locales"])
  await cp(`src/${dir}`, `${out}/${dir}`, {
    recursive: true,
    filter: (source) => !source.endsWith(".ts"),
  });
await mkdir(`${out}/sites/youtube`, { recursive: true });
await cp(
  "src/sites/youtube/selectors.json",
  `${out}/sites/youtube/selectors.json`,
);
await mkdir(`${out}/assets/icons`, { recursive: true });
for (const size of [16, 32, 48, 128])
  for (const off of [false, true]) {
    const stroke = off ? "#667080" : "#234fb5";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="square" stroke-linejoin="miter"><path d="M48 25 22 51l26 26M24 51h52c35 0 35 49 0 49H55"/></g></svg>`;
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(`${out}/assets/icons/${size}${off ? "-off" : ""}.png`);
  }
const contentSize = (await stat(`${out}/sites/youtube/content.js`)).size;
if (contentSize >= 30 * 1024)
  throw new Error(`Content bundle exceeds 30 KB: ${contentSize}`);
const manifest = JSON.parse(await readFile(`${out}/manifest.json`, "utf8"));
if (
  JSON.stringify(manifest.permissions) !== '["storage","alarms"]' ||
  manifest.host_permissions
)
  throw new Error("Permission regression");
console.log(
  `Built unpacked extension in dist. Content script: ${contentSize} bytes.`,
);
await mkdir("artifacts", { recursive: true });
await build({
  entryPoints: ["src/sites/youtube/restore.css.ts"],
  outfile: "artifacts/css-preview.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  legalComments: "none",
});
const { buildCss } = await import(
  `../artifacts/css-preview.mjs?build=${Date.now()}`
);
await writeFile(
  "artifacts/restore-preview.css",
  buildCss(
    JSON.parse(await readFile("src/sites/youtube/selectors.json", "utf8")),
  ),
);
await build({
  entryPoints: ["src/sites/youtube/relocate.ts"],
  outfile: "artifacts/relocate-preview.js",
  bundle: true,
  format: "iife",
  globalName: "UndoPreview",
  legalComments: "none",
});
// The build directory contains only allowlisted release assets; tests and fixtures
// are never copied. The ZIP packager independently enforces the same allowlist.
