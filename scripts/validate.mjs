import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const failures = [];
const warnings = [];
const passes = [];

const requiredRoutes = [
  'index.html', 'shop/index.html', 'product/index.html', 'design/index.html',
  'cart/index.html', 'auth/index.html', 'checkout/index.html',
  'checkout/success/index.html', 'account/index.html',
  'account/designs/index.html', 'account/orders/index.html',
  'share/index.html', 'consultation/index.html', 'craft/index.html',
  'materials/index.html', 'sustainability/index.html'
];

const requiredGuides = [
  'guides/ring-guide.jpg', 'guides/bracelet-guide.jpg',
  'guides/bangle-guide.png', 'guides/necklace-guide.jpg',
  'guides/anklet-guide.png'
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.vercel', 'node_modules'].includes(entry.name)) continue;
    const absolute = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(absolute));
    else out.push(absolute);
  }
  return out;
}

function projectPath(path) {
  return relative(root, path).split(sep).join('/');
}

for (const route of requiredRoutes) {
  if (!existsSync(resolve(root, route))) failures.push(`Missing required route file: ${route}`);
}
if (!failures.some((x) => x.startsWith('Missing required route'))) passes.push('Required route files exist');

for (const guide of requiredGuides) {
  if (!existsSync(resolve(root, guide))) failures.push(`Missing sizing guide: ${guide}`);
}
if (!failures.some((x) => x.startsWith('Missing sizing guide'))) passes.push('All five sizing guides exist');

const files = await walk(root);
const htmlFiles = files.filter((f) => extname(f).toLowerCase() === '.html');
const jsFiles = files.filter((f) => ['.js', '.mjs'].includes(extname(f).toLowerCase()));
const applicationFiles = files.filter((f) => {
  const rel = projectPath(f);
  if (/^(?:docs|reference|scripts|screenshots)\//.test(rel)) return false;
  return ['.html', '.js', '.mjs', '.css', '.json'].includes(extname(f).toLowerCase());
});

let syntaxCheckUnavailable = false;
for (const js of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', js], { encoding: 'utf8' });
  if (result.error?.code === 'EPERM') {
    syntaxCheckUnavailable = true;
    continue;
  }
  if (result.status !== 0) failures.push(`JavaScript syntax error in ${projectPath(js)}: ${(result.stderr || result.error?.message || 'node --check failed').trim()}`);
}
if (syntaxCheckUnavailable) warnings.push('Nested node --check is unavailable in this Windows sandbox; run the documented direct syntax-check command.');
else if (!failures.some((x) => x.startsWith('JavaScript syntax'))) passes.push(`${jsFiles.length} JavaScript files pass node --check`);

const attrPattern = /\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi;
for (const html of htmlFiles) {
  const body = await readFile(html, 'utf8');
  for (const match of body.matchAll(attrPattern)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;

    let target;
    if (clean.startsWith('/')) target = resolve(root, `.${clean}`);
    else target = resolve(dirname(html), clean);

    if (clean.endsWith('/')) target = resolve(target, 'index.html');
    else if (existsSync(target)) {
      const info = await stat(target);
      if (info.isDirectory()) target = resolve(target, 'index.html');
    }

    // Generated engine images are optional in the kit and reported separately.
    if (!existsSync(target)) {
      if (clean.startsWith('/images/')) warnings.push(`${projectPath(html)} references engine asset not bundled: ${clean}`);
      else failures.push(`${projectPath(html)} has missing local reference: ${raw}`);
    }
  }
}
if (!failures.some((x) => x.includes('missing local reference'))) passes.push(`${htmlFiles.length} HTML files have valid bundled local references`);

for (const file of applicationFiles) {
  const body = await readFile(file, 'utf8');
  if (/(?:[A-Za-z]:\\|file:\/\/|\/mnt\/data\/)/.test(body)) {
    // Reference docs may describe source paths; production code may not contain them.
    if (['.html', '.js', '.mjs', '.css', '.json'].includes(extname(file).toLowerCase())) {
      failures.push(`Absolute local path found in application file: ${projectPath(file)}`);
    }
  }
  if (/three(?:\.min)?\.js|new\s+THREE\.|WebGLRenderer|shaderMaterial/i.test(body)) {
    failures.push(`Forbidden Three.js/WebGL/shader dependency found in ${projectPath(file)}`);
  }
}
if (!failures.some((x) => x.startsWith('Absolute local path'))) passes.push('No absolute local paths in application files');
if (!failures.some((x) => x.startsWith('Forbidden'))) passes.push('No forbidden Three.js/WebGL/shader runtime found');

const engineImageMarkers = ['images/Necklace', 'images/Bracelet', 'images/Bangle', 'images/Brooch', 'images/Angklet', 'images/rings'];
const hasEngineImages = engineImageMarkers.some((p) => existsSync(resolve(root, p)));
if (!hasEngineImages) warnings.push('Generated preview image library is not imported. Run scripts/import-engine-assets.ps1.');
else passes.push('Generated preview image library appears to be imported');

console.log('\nWOYKE validation\n================');
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of [...new Set(warnings)].slice(0, 30)) console.log(`WARN  ${item}`);
if (new Set(warnings).size > 30) console.log(`WARN  ${new Set(warnings).size - 30} additional warnings omitted`);
for (const item of failures) console.error(`FAIL  ${item}`);

console.log(`\nSummary: ${passes.length} pass, ${new Set(warnings).size} warning, ${failures.length} failure`);
if (failures.length) process.exit(1);
