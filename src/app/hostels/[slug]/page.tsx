import { notFound } from "next/navigation";
import { getHostelBySlug } from "@/lib/hostels-db";
import HostelDetail from "./HostelDetail";

export const dynamic = "force-dynamic";

export default async function HostelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hostel = await getHostelBySlug(slug);

  if (!hostel) notFound();

  return <HostelDetail hostel={hostel} />;
}
