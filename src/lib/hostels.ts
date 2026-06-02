export type Hostel = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  address: string;
  amenities: string[];
  image: string;
  gender: "Boys" | "Girls";
  price: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  roomTypes: { type: string; price: string; occupancy: string }[];
  highlights: string[];
};

export const HOSTELS: Hostel[] = [
  {
    id: 1,
    slug: "block-a",
    name: "Jeevan PG — Block A",
    tagline: "Spacious rooms, peaceful environment",
    address: "123, Main Road, Koramangala, Bengaluru — 560034",
    amenities: ["WiFi", "AC Rooms", "Meals Included", "Laundry"],
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=600&fit=crop&auto=format",
    gender: "Girls",
    price: "₹7,500 / month",
    description:
      "Block A is our flagship girls' hostel in the heart of Koramangala. It offers spacious, well-ventilated rooms with a calm and focused atmosphere — perfect for students and working professionals alike. With AC rooms, high-speed WiFi, and home-cooked meals, we take care of everything so you can focus on what matters.",
    phone: "+91 99997 75918",
    email: "blocka@jeevanpg.in",
    hours: "Mon – Sat, 9 AM – 7 PM",
    roomTypes: [
      { type: "Single Occupancy", price: "₹9,500 / month", occupancy: "1 person" },
      { type: "Double Sharing", price: "₹7,500 / month", occupancy: "2 persons" },
      { type: "Triple Sharing", price: "₹6,000 / month", occupancy: "3 persons" },
    ],
    highlights: [
      "AC rooms with inverter backup",
      "High-speed WiFi throughout the building",
      "3 home-cooked meals daily",
      "Laundry service (weekly)",
      "24/7 CCTV security",
      "Dedicated study room",
      "Near Koramangala metro station",
    ],
  },
  {
    id: 2,
    slug: "block-b",
    name: "Jeevan PG — Block B",
    tagline: "Modern facilities, homely comfort",
    address: "456, 2nd Cross, HSR Layout, Bengaluru — 560102",
    amenities: ["WiFi", "Non-AC Rooms", "Meals Included", "CCTV"],
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop&auto=format",
    gender: "Girls",
    price: "₹6,500 / month",
    description:
      "Block B is a safe and welcoming girls-only hostel in HSR Layout, one of Bengaluru's most vibrant neighbourhoods. Modern facilities, round-the-clock security, and a warm community make it the ideal home for women studying or working in the city.",
    phone: "+91 99997 75918",
    email: "blockb@jeevanpg.in",
    hours: "Mon – Sat, 9 AM – 7 PM",
    roomTypes: [
      { type: "Single Occupancy", price: "₹8,500 / month", occupancy: "1 person" },
      { type: "Double Sharing", price: "₹6,500 / month", occupancy: "2 persons" },
      { type: "Triple Sharing", price: "₹5,200 / month", occupancy: "3 persons" },
    ],
    highlights: [
      "Non-AC rooms with ceiling fans",
      "High-speed WiFi throughout the building",
      "3 home-cooked meals daily",
      "24/7 CCTV & biometric entry",
      "Women-only property with lady warden",
      "Power backup",
      "Walking distance to HSR bus stand",
    ],
  },
];
