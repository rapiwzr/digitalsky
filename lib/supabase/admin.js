import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAdminClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diatur di environment server.",
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Diabaikan jika dipanggil saat render Server Component
        }
      },
    },
  });
}

export { createAdminClient as createAdminSupabaseClient, createAdminClient as createSessionClient };
export default createAdminClient;

