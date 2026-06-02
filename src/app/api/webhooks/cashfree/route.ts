import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

function verifySignature(rawBody: string, timestamp: string, signature: string): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY ?? "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";
  const signature = req.headers.get("x-webhook-signature") ?? "";

  if (timestamp && signature && !verifySignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    type: string;
    data?: { order?: { order_id?: string }; payment?: { payment_status?: string } };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const isPaid =
    event.type === "PAYMENT_SUCCESS_WEBHOOK" ||
    event.data?.payment?.payment_status === "SUCCESS";

  if (isPaid) {
    const orderId = event.data?.order?.order_id;
    if (orderId) {
      try {
        await db.execute({
          sql: "UPDATE transactions SET status = 'PAID' WHERE order_id = ?",
          args: [orderId],
        });
      } catch {
        // table may not exist yet
      }
    }
  }

  return NextResponse.json({ ok: true });
}
