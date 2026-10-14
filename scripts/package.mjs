import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { zipSync } from "fflate";
const entries = {};
async function walk(path, base = "") {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const name = base + entry.name;
    if (entry.isDirectory()) await walk(`${path}/${entry.name}`, `${name}/`);
    else if (/\.(js|css|html|json|png)$/.test(name))
      entries[name] = new Uint8Array(await readFile(`${path}/${entry.name}`));
    else throw new Error(`Unexpected package asset: ${name}`);
  }
}
await walk("dist");
await mkdir("artifacts", { recursive: true });
const { version } = JSON.parse(await readFile("dist/manifest.json", "utf8"));
const output = `artifacts/undo-${version}-dev.zip`;
await writeFile(output, zipSync(entries, { level: 9 }));
console.log(`Created ${output} (development build; not a store release).`);
