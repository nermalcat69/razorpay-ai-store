import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, type Tool, type Content, type Part } from "@google/genai";
import { createCashfreeOrder, getCashfreeOrderStatus } from "@/lib/cashfree";
import { buildSiteContext } from "@/lib/site-context";
import { db } from "@/lib/db";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash";
const MAX_TOOL_ITERATIONS = 5;

const TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "create_payment",
        description:
          "Create a Cashfree UPI payment order for hostel booking. Returns a payment link the user can scan as a QR code to pay. Use this when the user wants to pay or book a hostel.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER, description: "Amount in INR (minimum ₹1)" },
            customer_name: { type: Type.STRING, description: "Full name of the customer" },
            customer_phone: { type: Type.STRING, description: "10-digit Indian mobile number (no country code)" },
            customer_email: { type: Type.STRING, description: "Customer email address" },
            note: { type: Type.STRING, description: "Payment note or description" },
          },
          required: ["amount", "customer_name", "customer_phone", "customer_email"],
        },
      },
      {
        name: "check_payment_status",
        description: "Check the status of an existing Cashfree payment order.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            order_id: { type: Type.STRING, description: "The Cashfree order ID to check" },
          },
          required: ["order_id"],
        },
      },
    ],
  },
];

function buildSystemInstruction(siteContext: string, activeOrderId: string | null) {
  return `You are a helpful booking assistant for Jeevan PG, a premium paying-guest accommodation in Bengaluru.

Here is the complete site data as JSON — use it to answer any question about properties, pricing, contact details, amenities, and more:
${siteContext}

When a user wants to book, look up the correct price from the catalog above — never ask the user for the price or amount. Only collect their name, phone number, and email, then call create_payment with the correct amount from the room type they choose.
If they don't specify a room type, use the starting (cheapest) price for that property.
Be friendly, concise, and helpful. All payments are processed via Cashfree (test mode).

PAYMENT STATUS: When a user says anything like "I've paid", "I paid", "I have paid", "did you receive the money", "check payment", "payment done", or similar — immediately call check_payment_status without asking for clarification.${activeOrderId ? ` The current active order ID is: ${activeOrderId}` : " Use the most recent order ID from the conversation history."}

IMPORTANT: When a payment is created, NEVER include the payment URL or link in your text response. The QR code and payment link are shown automatically in a separate card. Just confirm the property, room type, amount, and order ID.`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatRequest = { messages: ChatMessage[]; activeOrderId: string | null };
type PaymentResult = { orderId: string; paymentLink: string; qrCode: string; amount: number };

type CreatePaymentArgs = {
  amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  note?: string;
};

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ result: Record<string, unknown>; payment: PaymentResult | null }> {
  if (name === "create_payment") {
    const a = args as CreatePaymentArgs;
    const order = await createCashfreeOrder({
      amount: a.amount,
      customerName: a.customer_name,
      customerPhone: a.customer_phone,
      customerEmail: a.customer_email,
      note: a.note,
    });

    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        payment_link TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
    await db.execute({
      sql: `INSERT OR IGNORE INTO transactions (order_id, amount, customer_name, customer_phone, customer_email, payment_link, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [order.orderId, a.amount, a.customer_name, a.customer_phone, a.customer_email, order.paymentLink, order.status],
    });

    return {
      result: { success: true, order_id: order.orderId, payment_link: order.paymentLink, status: order.status },
      payment: { orderId: order.orderId, paymentLink: order.paymentLink, qrCode: order.qrCode, amount: a.amount },
    };
  }

  if (name === "check_payment_status") {
    const a = args as { order_id: string };
    const status = await getCashfreeOrderStatus(a.order_id);
    return { result: status as unknown as Record<string, unknown>, payment: null };
  }

  return { result: { error: "Unknown tool" }, payment: null };
}

export async function POST(req: NextRequest) {
  const { messages, activeOrderId }: ChatRequest = await req.json();

  const siteContext = await buildSiteContext();
  const systemInstruction = buildSystemInstruction(siteContext, activeOrderId ?? null);
  const contents: Content[] = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let paymentCreated: PaymentResult | null = null;

  let response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction, tools: TOOLS },
  });

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const parts: Part[] = response.candidates?.[0]?.content?.parts ?? [];
    const fnCallPart = parts.find((p) => !!p.functionCall);
    if (!fnCallPart?.functionCall) break;

    const { name, args } = fnCallPart.functionCall as { name: string; args: Record<string, unknown> };

    contents.push({ role: "model", parts } as Content);

    let fnResult: Record<string, unknown>;
    try {
      const { result, payment } = await handleToolCall(name, args);
      fnResult = result;
      if (payment) paymentCreated = payment;
    } catch (err) {
      fnResult = { error: (err as Error).message };
    }

    contents.push({
      role: "user",
      parts: [{ functionResponse: { name, response: fnResult } }],
    });

    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: { systemInstruction, tools: TOOLS },
    });
  }

  const textPart = response.candidates?.[0]?.content?.parts?.find((p) => !!p.text);
  const text = textPart?.text ?? "";

  return NextResponse.json({ text, paymentCreated });
}
