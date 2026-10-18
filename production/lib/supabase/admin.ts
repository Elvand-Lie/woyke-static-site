import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnvironment } from "@/lib/env/public";
import { getSupabaseServerEnvironment } from "@/lib/env/server";

export function createAdminSupabaseClient() {
  return createClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    getSupabaseServerEnvironment().SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

