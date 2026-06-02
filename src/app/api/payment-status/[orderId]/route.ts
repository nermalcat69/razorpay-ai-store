import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrderStatus } from "@/lib/cashfree";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const status = await getCashfreeOrderStatus(orderId);

  if (status.status === "PAID") {
    try {
      await db.execute({
        sql: "UPDATE transactions SET status = 'PAID' WHERE order_id = ?",
        args: [orderId],
      });
    } catch {
      // table may not exist yet
    }
  }

  return NextResponse.json(status);
}
