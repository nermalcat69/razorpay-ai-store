export type Transaction = {
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

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  EXPIRED: "bg-neutral-100 text-neutral-500",
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? "bg-amber-50 text-amber-700";
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white py-16 text-center ring-1 ring-black/6">
        <p className="text-[13px] text-muted-foreground">No transactions yet.</p>
        <p className="mt-1 text-[12px] text-neutral-400">
          Payments triggered from the chat will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="rounded-2xl bg-white p-4 ring-1 ring-black/6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-foreground">
                  ₹{Number(tx.amount).toLocaleString("en-IN")}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyle(tx.status)}`}
                >
                  {tx.status}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {tx.customer_name} · {tx.customer_phone} · {tx.customer_email}
              </p>
              <p className="mt-0.5 text-[11px] text-neutral-400">{tx.order_id}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-neutral-400">
                {new Date(Number(tx.created_at) * 1000).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <a
                href={tx.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-[11px] text-foreground underline-offset-2 hover:underline"
              >
                Open link
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
