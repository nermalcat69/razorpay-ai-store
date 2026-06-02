import { getHostels } from "./hostels-db";

export async function buildSiteContext(): Promise<string> {
  const hostels = await getHostels();

  const context = {
    site: {
      name: "Jeevan PG",
      description: "Premium paying guest accommodations in Bengaluru",
      tagline: "Your home away from home",
    },
    hostels,
  };

  return JSON.stringify(context, null, 2);
}
