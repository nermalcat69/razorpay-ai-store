"use client";

import { motion, type Variants } from "motion/react";
import { SiteHeader } from "@/components/layout/site-header";
import SoftPillButton from "@/components/ui/soft-pill-button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.12, staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const CONTACTS = [
  {
    hostel: "Block A (Girls)",
    phone: "+91 99997 75918",
    email: "blocka@jeevanpg.in",
    address: "123, Main Road, Koramangala, Bengaluru — 560034",
    hours: "Mon – Sat, 9 AM – 7 PM",
  },
  {
    hostel: "Block B (Girls)",
    phone: "+91 99997 75918",
    email: "blockb@jeevanpg.in",
    address: "456, 2nd Cross, HSR Layout, Bengaluru — 560102",
    hours: "Mon – Sat, 9 AM – 7 PM",
  },
];

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <span className="text-[13px] text-neutral-700 leading-relaxed">{children}</span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />

      <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-12 sm:px-10 sm:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-center"
          >
            Get in touch
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-md text-center text-sm text-muted-foreground"
          >
            Have questions about availability, pricing, or facilities?
            <br className="hidden sm:inline" />
            We&apos;re happy to help — reach out to the relevant hostel directly.
          </motion.p>

          {/* Contact cards */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {CONTACTS.map((c) => (
              <div
                key={c.hostel}
                className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
              >
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {c.hostel}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  <InfoRow
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" />
                      </svg>
                    }
                  >
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">
                      {c.phone}
                    </a>
                  </InfoRow>

                  <InfoRow
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    }
                  >
                    <a href={`mailto:${c.email}`} className="hover:text-foreground transition-colors">
                      {c.email}
                    </a>
                  </InfoRow>

                  <InfoRow
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 119.5 9a2.5 2.5 0 012.5 2.5z" />
                      </svg>
                    }
                  >
                    {c.address}
                  </InfoRow>

                  <InfoRow
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5v6l4.5 2.67-.75 1.23L11 14V7h1.5z" />
                      </svg>
                    }
                  >
                    {c.hours}
                  </InfoRow>
                </div>

                <div className="mt-5">
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                    <SoftPillButton variant="primary" className="w-full h-9 text-[13px]">
                      Call Now
                    </SoftPillButton>
                  </a>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Enquiry form */}
          <motion.div
            variants={itemVariants}
            className="mt-8 w-full rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              Send an enquiry
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Fill in the form and we&apos;ll get back to you within 24 hours.
            </p>

            <form
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-neutral-600">Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="h-9 rounded-lg border border-border bg-white px-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-neutral-600">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="h-9 rounded-lg border border-border bg-white px-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-neutral-600">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-9 rounded-lg border border-border bg-white px-3 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-neutral-600">Hostel</label>
                <select className="h-9 rounded-lg border border-border bg-white px-3 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition">
                  <option value="">Select hostel…</option>
                  <option value="block-a">Block A (Girls)</option>
                  <option value="block-b">Block B (Girls)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[12px] font-medium text-neutral-600">Message</label>
                <textarea
                  rows={3}
                  placeholder="Any specific requirements or questions…"
                  className="rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <SoftPillButton type="submit" variant="primary" className="h-9 px-6 text-[13px]">
                  Submit Enquiry
                </SoftPillButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
