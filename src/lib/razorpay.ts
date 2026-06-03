const BASE_URL = "https://api.razorpay.com/v1";

function rzpHeaders() {
  const credentials = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID!}:${process.env.RAZORPAY_KEY_SECRET!}`
  ).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
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

export async function createRazorpayOrder(params: CreateOrderParams): Promise<OrderResult> {
  const res = await fetch(`${BASE_URL}/payment_links`, {
    method: "POST",
    headers: rzpHeaders(),
    body: JSON.stringify({
      amount: Math.round(params.amount * 100), // paise
      currency: "INR",
      description: params.note ?? "Jeevan PG Hostel Booking",
      customer: {
        name: params.customerName,
        contact: params.customerPhone,
        email: params.customerEmail,
      },
      notify: { sms: false, email: false },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Razorpay API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const shortUrl: string = data.short_url;
  const qrCode = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(shortUrl)}`;

  return {
    orderId: data.id,
    paymentLink: shortUrl,
    qrCode,
    status: data.status,
  };
}

export async function getRazorpayOrderStatus(linkId: string) {
  const res = await fetch(`${BASE_URL}/payment_links/${linkId}`, {
    headers: rzpHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Razorpay API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return {
    orderId: data.id as string,
    status: (data.status as string).toUpperCase(),
    amount: (data.amount as number) / 100,
    amountPaid: (data.amount_paid as number) / 100,
  };
}
