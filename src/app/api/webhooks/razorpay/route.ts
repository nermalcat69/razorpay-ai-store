import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (signature && !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event: string;
    payload?: { payment_link?: { entity?: { id?: string } }; payment?: { entity?: { status?: string } } };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const isPaid =
    event.event === "payment_link.paid" ||
    event.payload?.payment?.entity?.status === "captured";

  if (isPaid) {
    const orderId = event.payload?.payment_link?.entity?.id;
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
