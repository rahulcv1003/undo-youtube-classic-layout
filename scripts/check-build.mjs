import { readFile, readdir, stat } from "node:fs/promises";
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const target = `${path}/${entry.name}`;
    if (entry.isDirectory()) await walk(target);
    else {
      if (!/\.(js|css|html|json|png)$/.test(entry.name))
        throw new Error(`Non-runtime asset in build: ${target}`);
      if (/\.(js|html)$/.test(entry.name)) {
        const source = await readFile(target, "utf8");
        if (
          /\beval\s*\(|new\s+Function\s*\(|\bimportScripts\s*\(|insertAdjacentHTML|\.innerHTML\s*=|\.outerHTML\s*=|<script[^>]+src=["']https?:/i.test(
            source,
          )
        )
          throw new Error(`Unsafe code pattern: ${target}`);
      }
    }
  }
}
await walk("dist");
const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
for (const entry of manifest.content_scripts)
  for (const path of entry.js)
    if ((await stat(`dist/${path}`)).size > 30 * 1024)
      throw new Error("Content size budget exceeded");
console.log(
  "Build allowlist, remote-code/DOM-write scan, and content size checks pass.",
);
