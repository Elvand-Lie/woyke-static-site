import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const source = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const env = Object.fromEntries(source.split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => { const index = line.indexOf("="); return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")]; }));
const email = process.env.DEV_ACCOUNT_EMAIL;
const password = process.env.DEV_ACCOUNT_PASSWORD;
const displayName = process.env.DEV_ACCOUNT_NAME || "WOYKE development account";
const role = process.env.DEV_ACCOUNT_ROLE === "admin" ? "admin" : "customer";
if (!email || !password || password.length < 8) throw new Error("Set DEV_ACCOUNT_EMAIL and DEV_ACCOUNT_PASSWORD (minimum eight characters).");
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
if (error) throw new Error("Development account creation failed. Use a new email address.");
if (role === "admin") { const grant = await admin.from("roles").insert({ user_id: data.user.id, role: "admin" }); if (grant.error) { await admin.auth.admin.deleteUser(data.user.id); throw new Error("Administrator role grant failed."); } }
console.log(`Created a development ${role} account.`);