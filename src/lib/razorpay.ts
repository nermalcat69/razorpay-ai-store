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
  const amountPaise = Math.round(params.amount * 100);

  // Create a fixed-amount UPI QR code for the same booking
  const closeBy = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 h
  const qrRes = await fetch(`${BASE_URL}/payments/qr_codes`, {
    method: "POST",
    headers: rzpHeaders(),
    body: JSON.stringify({
      type: "upi_qr",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amountPaise,
      description: params.note ?? "Jeevan PG Hostel Booking",
      close_by: closeBy,
    }),
  });

  let qrCode = shortUrl; // fallback to payment link URL if QR creation fails
  if (qrRes.ok) {
    const qrData = await qrRes.json();
    if (qrData.image_url) qrCode = qrData.image_url;
  }

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
