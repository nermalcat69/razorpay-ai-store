import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getHostels } from "@/lib/hostels-db";
import { verifySessionToken } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import AdminPanel from "./AdminPanel";

type Transaction = {
  id: number;
  order_id: string;
  amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  payment_link: string;
  status: string;
  created_at: number;
};

async function getTransactions(): Promise<Transaction[]> {
  try {
    const result = await db.execute(
      "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100"
    );
    return result.rows.map((row) => ({
      id: Number(row.id),
      order_id: String(row.order_id),
      amount: Number(row.amount),
      customer_name: String(row.customer_name),
      customer_phone: String(row.customer_phone),
      customer_email: String(row.customer_email),
      payment_link: String(row.payment_link),
      status: String(row.status),
      created_at: Number(row.created_at),
    }));
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  const [hostels, transactions] = await Promise.all([getHostels(), getTransactions()]);

  return <AdminPanel hostels={hostels} transactions={transactions} />;
}
