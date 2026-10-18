import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const productionRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = path.resolve(productionRoot, "..", "index.html");

if (!fs.existsSync(source)) process.exit(0);

const html = fs.readFileSync(source, "utf8");
const main = html.match(/<main id="main">[\s\S]*?<\/main>/)?.[0];
const styles = html.match(
  /<style id="home-layout-overrides">([\s\S]*?)<\/style>/,
)?.[1];

if (!main || !styles) {
  throw new Error("The legacy homepage no longer matches the migration bridge.");
}

const writeIfChanged = (target, value) => {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== value) {
    fs.writeFileSync(target, value, "utf8");
  }
};

writeIfChanged(path.join(productionRoot, "app", "legacy-home.html"), main);
writeIfChanged(
  path.join(productionRoot, "app", "legacy-home.css"),
  styles.trim(),
);

for (const route of ["craft", "materials", "sustainability"]) {
  const routeSource = path.resolve(productionRoot, "..", route, "index.html");
  if (!fs.existsSync(routeSource)) continue;
  const routeHtml = fs.readFileSync(routeSource, "utf8");
  const routeMain = routeHtml.match(/<main\b[\s\S]*?<\/main>/i)?.[0];
  if (!routeMain) throw new Error(`The legacy ${route} page no longer matches the migration bridge.`);
  writeIfChanged(path.join(productionRoot, "app", `legacy-${route}.html`), routeMain);
}