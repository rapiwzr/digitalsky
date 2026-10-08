"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function loginAdmin(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const email = data ? data.get("email")?.toString().trim() : "";
  const password = data ? data.get("password")?.toString() : "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let sukses = false;
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Email atau password salah." };
    }

    sukses = true;
  } catch (err) {
    console.error("Kesalahan login admin:", err);
    return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
  }

  if (sukses) {
    redirect("/admin");
  }
}

export async function logoutAdmin() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Kesalahan keluar admin:", err);
  }

  redirect("/admin/login");
}

export { logoutAdmin as keluarAdmin };

