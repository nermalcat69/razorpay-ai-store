const BASE_URL = "https://sandbox.cashfree.com/pg";
const API_VERSION = "2025-01-01";

function cfHeaders() {
  return {
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    "x-api-version": API_VERSION,
    "Content-Type": "application/json",
  };
}

export type CreateOrderParams = {
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note?: string;
};

export type OrderResult = {
  orderId: string;
  paymentLink: string;
  qrCode: string;
  status: string;
};

export async function createCashfreeOrder(params: CreateOrderParams): Promise<OrderResult> {
  const linkId = `jeevanpg_${Date.now()}`;
  const res = await fetch(`${BASE_URL}/links`, {
    method: "POST",
    headers: cfHeaders(),
    body: JSON.stringify({
      link_id: linkId,
      link_amount: params.amount,
      link_currency: "INR",
      link_purpose: params.note ?? "Jeevan PG Hostel Booking",
      customer_details: {
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail,
      },
      link_notify: { send_sms: false, send_email: false },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cashfree API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return {
    orderId: data.link_id,
    paymentLink: data.link_url,
    qrCode: data.link_qrcode,
    status: data.link_status,
  };
}

export async function getCashfreeOrderStatus(linkId: string) {
  const res = await fetch(`${BASE_URL}/links/${linkId}`, {
    headers: cfHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cashfree API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return {
    orderId: data.link_id as string,
    status: data.link_status as string,
    amount: data.link_amount as number,
    amountPaid: data.link_amount_paid as number,
  };
}
