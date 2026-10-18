import "server-only";
import fs from "node:fs";
import path from "node:path";

export function readLegacyMain(route: string) {
  return fs.readFileSync(path.join(process.cwd(), "app", `legacy-${route}.html`), "utf8")
    .replace(/\sdata-header-theme="[^"]*"/g, (value) => value)
    .replace(/href="\/([^"]+)\/"/g, 'href="/$1"');
}
