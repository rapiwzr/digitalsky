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

export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const passwordBaru = data ? data.get("password_baru")?.toString() : "";
  const konfirmasiPassword = data
    ? data.get("konfirmasi_password")?.toString()
    : "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password harus sama." };
  }

  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi login tidak valid. Silakan login terlebih dahulu." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (updateError) {
      return { error: updateError.message || "Gagal mengganti password." };
    }

    return { success: true, message: "Password berhasil diganti." };
  } catch (err) {
    console.error("Kesalahan ganti password:", err);
    return { error: "Terjadi kesalahan saat mengganti password." };
  }
}

export async function keluarAdmin() {
  return logoutAdmin();
}

export async function gantiPasswordAdmin(prevState, formData) {
  return gantiPassword(prevState, formData);
}

