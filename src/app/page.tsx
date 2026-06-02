import { getHostels } from "@/lib/hostels-db";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const hostels = await getHostels();
  return <HomeClient hostels={hostels} />;
}
