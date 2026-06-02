"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import type { Hostel } from "@/lib/hostels";

type HostelInput = Omit<Hostel, "id">;

function makeSessionToken(): string {
  return encrypt(JSON.stringify({ p: process.env.ADMIN_PASSWORD, t: Date.now() }));
}

function hostelArgs(data: HostelInput) {
  return [
    data.slug,
    data.name,
    data.tagline,
    data.address,
    JSON.stringify(data.amenities),
    data.image,
    data.gender,
    data.price,
    data.description,
    data.phone,
    data.email,
    data.hours,
    JSON.stringify(data.roomTypes),
    JSON.stringify(data.highlights),
  ];
}

export async function loginAction(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Incorrect password" };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", makeSessionToken(), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function createHostelAction(data: HostelInput) {
  await db.execute({
    sql: `INSERT INTO hostels (slug, name, tagline, address, amenities, image, gender, price, description, phone, email, hours, room_types, highlights)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: hostelArgs(data),
  });
  revalidatePath("/", "layout");
}

export async function updateHostelAction(id: number, data: HostelInput) {
  await db.execute({
    sql: `UPDATE hostels SET slug=?, name=?, tagline=?, address=?, amenities=?, image=?, gender=?, price=?, description=?, phone=?, email=?, hours=?, room_types=?, highlights=? WHERE id=?`,
    args: [...hostelArgs(data), id],
  });
  revalidatePath("/", "layout");
}

export async function deleteHostelAction(id: number) {
  await db.execute({
    sql: "DELETE FROM hostels WHERE id = ?",
    args: [id],
  });
  revalidatePath("/", "layout");
}
