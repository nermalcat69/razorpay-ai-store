"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 15 * 60 * 1000;

function renderMarkdown(text: string): ReactNode[] {
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\n)/g);
  return segments.map((seg, i) => {
    if (seg === "\n") return <br key={i} />;
    if (seg.startsWith("**") && seg.endsWith("**"))
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    if (seg.startsWith("*") && seg.endsWith("*"))
      return <em key={i}>{seg.slice(1, -1)}</em>;
    if (seg.startsWith("`") && seg.endsWith("`"))
      return (
        <code key={i} className="rounded bg-black/8 px-1 py-0.5 text-[11px] font-mono">
          {seg.slice(1, -1)}
        </code>
      );
    return seg;
  });
}

type PaymentResult = {
  orderId: string;
  paymentLink: string;
  qrCode: string;
  amount: number;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  payment?: PaymentResult;
};

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 110"
      fill="none"
      className={className}
    >
      <path
        fill="currentColor"
        d="M55 110c30.376 0 55-24.624 55-55S85.376 0 55 0 0 24.624 0 55c0 8.798 2.066 17.114 5.739 24.489.976 1.96 1.301 4.2.735 6.314L3.198 98.046c-1.422 5.316 3.44 10.178 8.755 8.755l12.244-3.275c2.115-.566 4.355-.241 6.314.735C37.886 107.934 46.202 110 55 110Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function PaymentCard({ payment }: { payment: PaymentResult }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(payment.paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-2 rounded-xl border border-black/8 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        UPI Payment QR
      </p>
      <p className="mt-0.5 text-[13px] font-semibold text-foreground">
        ₹{payment.amount.toLocaleString("en-IN")}
      </p>
      <div className="mt-3 flex justify-center rounded-lg bg-neutral-50 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={payment.qrCode} alt="UPI QR Code" width={160} height={160} />
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Scan with any UPI app to pay
      </p>
      <p className="mt-1 text-center text-[10px] text-neutral-400">
        Order: {payment.orderId}
      </p>
      <button
        onClick={copyLink}
        className="mt-3 w-full rounded-lg border border-black/10 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-neutral-50"
      >
        {copied ? "Copied!" : "Copy payment link"}
      </button>
    </div>
  );
}

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm the Jeevan PG assistant. I can answer your questions about our hostels and help you make a payment. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollingOrderId, setPollingOrderId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  // Poll for payment status after QR is shown
  useEffect(() => {
    if (!pollingOrderId) return;

    const interval = setInterval(async () => {

      try {
        const res = await fetch(`/api/payment-status/${pollingOrderId}`);
        const { status } = await res.json();

        if (status === "PAID") {
          clearInterval(interval);
          setPollingOrderId(null);
          setMessages((prev) => [
            ...prev,
            {
              id: `paid-${Date.now()}`,
              role: "assistant",
              content:
                "Payment received! Your booking at Jeevan PG is confirmed. We look forward to welcoming you!",
            },
          ]);
        }
      } catch {
        // ignore transient errors
      }
    }, POLL_INTERVAL_MS);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPollingOrderId(null);
    }, POLL_TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollingOrderId]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, activeOrderId: pollingOrderId }),
      });

      const data: { text: string; paymentCreated: PaymentResult | null } =
        await res.json();

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.text,
        payment: data.paymentCreated ?? undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.paymentCreated) {
        setPollingOrderId(data.paymentCreated.orderId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-neutral-50 shadow-2xl ring-1 ring-black/8 transition-transform duration-300 ease-in-out sm:w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/6 bg-white px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="text-lg font-semibold text-foreground">Jeevan PG Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-neutral-100"
          >
            <XIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-foreground text-white"
                    : "bg-white text-foreground ring-1 ring-black/6 shadow-sm"
                }`}
              >
                {renderMarkdown(msg.content)}
                {msg.payment && <PaymentCard payment={msg.payment} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/6 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                      style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-black/6 bg-white px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about hostels or make a payment…"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-2.5 text-[13px] text-foreground outline-none transition focus:border-black/20 focus:bg-white focus:ring-2 focus:ring-black/6 disabled:opacity-50"
              style={{ maxHeight: 120 }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 cursor-pointer text-white transition hover:bg-blue-600 disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-neutral-400">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open chat"
      >
        <ChatIcon className="size-6" />
      </button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
