import type { Hostel } from "@/lib/hostels";

export type RoomType = { type: string; price: string; occupancy: string };

export type HostelFormData = {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  amenities: string;
  image: string;
  gender: "Boys" | "Girls";
  price: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  roomTypes: RoomType[];
  highlights: string;
};

export const DEFAULT_FORM: HostelFormData = {
  slug: "",
  name: "",
  tagline: "",
  address: "",
  amenities: "",
  image: "",
  gender: "Girls",
  price: "",
  description: "",
  phone: "",
  email: "",
  hours: "Mon – Sat, 9 AM – 7 PM",
  roomTypes: [{ type: "", price: "", occupancy: "" }],
  highlights: "",
};

export function hostelToForm(h: Hostel): HostelFormData {
  return {
    slug: h.slug,
    name: h.name,
    tagline: h.tagline,
    address: h.address,
    amenities: h.amenities.join("\n"),
    image: h.image,
    gender: h.gender,
    price: h.price,
    description: h.description,
    phone: h.phone,
    email: h.email,
    hours: h.hours,
    roomTypes: h.roomTypes.length ? h.roomTypes : [{ type: "", price: "", occupancy: "" }],
    highlights: h.highlights.join("\n"),
  };
}

export function formToHostelInput(f: HostelFormData): Omit<Hostel, "id"> {
  return {
    slug: f.slug,
    name: f.name,
    tagline: f.tagline,
    address: f.address,
    amenities: f.amenities.split("\n").map((s) => s.trim()).filter(Boolean),
    image: f.image,
    gender: f.gender,
    price: f.price,
    description: f.description,
    phone: f.phone,
    email: f.email,
    hours: f.hours,
    roomTypes: f.roomTypes.filter((r) => r.type),
    highlights: f.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
  };
}

export function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const inputCls =
  "rounded-lg border border-black/10 bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none transition focus:border-black/20 focus:bg-white focus:ring-2 focus:ring-black/6";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-neutral-600">{label}</label>
      {children}
    </div>
  );
}

type Props = {
  mode: "add" | "edit";
  form: HostelFormData;
  isPending: boolean;
  onChange: (form: HostelFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function HostelForm({ mode, form, isPending, onChange, onSubmit, onCancel }: Props) {
  function set(field: keyof HostelFormData, value: string) {
    onChange({ ...form, [field]: value });
  }

  function handleNameChange(name: string) {
    onChange({
      ...form,
      name,
      slug: mode === "add" ? slugify(name) : form.slug,
    });
  }

  function setRoomType(index: number, field: keyof RoomType, value: string) {
    const roomTypes = form.roomTypes.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    onChange({ ...form, roomTypes });
  }

  function addRoomType() {
    onChange({ ...form, roomTypes: [...form.roomTypes, { type: "", price: "", occupancy: "" }] });
  }

  function removeRoomType(index: number) {
    onChange({ ...form, roomTypes: form.roomTypes.filter((_, i) => i !== index) });
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {mode === "add" ? "Add hostel" : "Edit hostel"}
            </h1>
            <p className="text-[12px] text-muted-foreground">
              {mode === "add" ? "Fill in the details below" : form.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg border border-black/10 px-3 py-2 text-[12px] font-medium text-muted-foreground transition hover:bg-white"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name *">
              <input className={inputCls} value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Jeevan PG — Block A" />
            </Field>
            <Field label="Slug *">
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="block-a" />
            </Field>
            <Field label="Tagline *">
              <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Spacious rooms, peaceful environment" />
            </Field>
            <Field label="Starting price *">
              <input className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="₹7,500 / month" />
            </Field>
            <Field label="Gender *">
              <select className={inputCls} value={form.gender} onChange={(e) => set("gender", e.target.value as "Boys" | "Girls")}>
                <option value="Girls">Girls</option>
                <option value="Boys">Boys</option>
              </select>
            </Field>
            <Field label="Phone *">
              <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 99997 75918" />
            </Field>
            <Field label="Email *">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="blocka@jeevanpg.in" />
            </Field>
            <Field label="Hours">
              <input className={inputCls} value={form.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Mon – Sat, 9 AM – 7 PM" />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <Field label="Address *">
              <input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123, Main Road, Koramangala, Bengaluru — 560034" />
            </Field>
            <Field label="Image URL *">
              <input className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
            </Field>
            <Field label="Description *">
              <textarea className={`${inputCls} resize-none`} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Block A is our flagship hostel..." />
            </Field>
            <Field label="Amenities (one per line)">
              <textarea className={`${inputCls} resize-none`} rows={4} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder={"WiFi\nAC Rooms\nMeals Included"} />
            </Field>
            <Field label="Highlights (one per line)">
              <textarea className={`${inputCls} resize-none`} rows={5} value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"AC rooms with inverter backup\nHigh-speed WiFi"} />
            </Field>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[12px] font-medium text-neutral-600">Room types & pricing</label>
              <button type="button" onClick={addRoomType} className="text-[11px] font-medium text-foreground underline-offset-2 hover:underline">
                + Add room type
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {form.roomTypes.map((room, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input className={inputCls} value={room.type} onChange={(e) => setRoomType(i, "type", e.target.value)} placeholder="Single Occupancy" />
                  <input className={inputCls} value={room.price} onChange={(e) => setRoomType(i, "price", e.target.value)} placeholder="₹9,500 / month" />
                  <input className={inputCls} value={room.occupancy} onChange={(e) => setRoomType(i, "occupancy", e.target.value)} placeholder="1 person" />
                  {form.roomTypes.length > 1 && (
                    <button type="button" onClick={() => removeRoomType(i)} className="flex items-center justify-center rounded-lg border border-red-100 px-2 text-red-400 transition hover:bg-red-50">
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={isPending || !form.name || !form.slug}
            className="rounded-xl bg-foreground px-5 py-2.5 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : mode === "add" ? "Create hostel" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
