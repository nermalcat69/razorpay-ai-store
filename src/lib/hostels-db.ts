import { unstable_cache } from "next/cache";
import { db } from "./db";
import type { Hostel } from "./hostels";

type RawRow = {
  id: number | bigint;
  slug: string;
  name: string;
  tagline: string;
  address: string;
  amenities: string;
  image: string;
  gender: string;
  price: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  room_types: string;
  highlights: string;
};

const VALID_GENDERS = new Set<Hostel["gender"]>(["Boys", "Girls"]);

function rowToHostel(row: RawRow): Hostel {
  const gender = row.gender as Hostel["gender"];
  if (!VALID_GENDERS.has(gender)) throw new Error(`Invalid gender value: ${row.gender}`);

  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    address: row.address,
    amenities: JSON.parse(row.amenities),
    image: row.image,
    gender,
    price: row.price,
    description: row.description,
    phone: row.phone,
    email: row.email,
    hours: row.hours,
    roomTypes: JSON.parse(row.room_types),
    highlights: JSON.parse(row.highlights),
  };
}

const _getHostels = unstable_cache(
  async (): Promise<Hostel[]> => {
    const result = await db.execute("SELECT * FROM hostels ORDER BY id ASC");
    return result.rows.map((row) => rowToHostel(row as unknown as RawRow));
  },
  ["hostels"]
);

const _getHostelBySlug = unstable_cache(
  async (slug: string): Promise<Hostel | null> => {
    const result = await db.execute({
      sql: "SELECT * FROM hostels WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0) return null;
    return rowToHostel(result.rows[0] as unknown as RawRow);
  },
  ["hostel-by-slug"]
);

export const getHostels = () => _getHostels();
export const getHostelBySlug = (slug: string) => _getHostelBySlug(slug);
