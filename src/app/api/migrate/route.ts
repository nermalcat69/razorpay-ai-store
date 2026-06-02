import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { HOSTELS } from "@/lib/hostels";

export async function POST() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS hostels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      address TEXT NOT NULL,
      amenities TEXT NOT NULL,
      image TEXT NOT NULL,
      gender TEXT NOT NULL CHECK(gender IN ('Boys', 'Girls')),
      price TEXT NOT NULL,
      description TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      hours TEXT NOT NULL,
      room_types TEXT NOT NULL,
      highlights TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  const existing = await db.execute("SELECT COUNT(*) as count FROM hostels");
  const count = Number((existing.rows[0] as unknown as { count: number | bigint }).count);

  if (count === 0) {
    for (const hostel of HOSTELS) {
      await db.execute({
        sql: `INSERT INTO hostels (slug, name, tagline, address, amenities, image, gender, price, description, phone, email, hours, room_types, highlights)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          hostel.slug,
          hostel.name,
          hostel.tagline,
          hostel.address,
          JSON.stringify(hostel.amenities),
          hostel.image,
          hostel.gender,
          hostel.price,
          hostel.description,
          hostel.phone,
          hostel.email,
          hostel.hours,
          JSON.stringify(hostel.roomTypes),
          JSON.stringify(hostel.highlights),
        ],
      });
    }
    return NextResponse.json({ ok: true, seeded: HOSTELS.length });
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      payment_link TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  return NextResponse.json({ ok: true, seeded: 0 });
}
