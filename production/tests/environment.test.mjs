import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

function filesIn(directory) { return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? filesIn(path.join(directory, entry.name)) : [path.join(directory, entry.name)]); }
test("server-only secrets are not referenced by client modules", () => {
  const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/(.:)/, "$1"));
  const clientFiles = [...filesIn(path.join(root, "components")), ...filesIn(path.join(root, "app"))].filter((file) => /\.(ts|tsx)$/.test(file) && fs.readFileSync(file, "utf8").startsWith('"use client"'));
  for (const file of clientFiles) { const source = fs.readFileSync(file, "utf8"); for (const secret of ["SUPABASE_SECRET_KEY","DATABASE_URL","STRIPE_SECRET_KEY"]) assert.equal(source.includes(secret), false, `${secret} leaked into ${path.relative(root, file)}`); }
});