"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";

import { SiteHeader } from "@/components/layout/site-header";
import SoftPillButton from "@/components/ui/soft-pill-button";
import type { Hostel } from "@/lib/hostels";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.07 },
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-green-600 mt-0.5">
      <path
        d="M5 12l5 5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HostelDetail({ hostel }: { hostel: Hostel }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-4xl px-6 pb-24 pt-6 sm:px-10"
      >
        {/* Back link */}
        <motion.div variants={itemVariants}>
          <Link
            href="/#hostels"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All hostels
          </Link>
        </motion.div>

        {/* Hero image */}
        <motion.div
          variants={itemVariants}
          className="relative mt-5 h-64 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-80"
        >
          <Image
            src={hostel.image}
            alt={hostel.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 896px"
          />
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-neutral-700 ring-1 ring-black/8 backdrop-blur">
            {hostel.gender} Only
          </span>
        </motion.div>

        {/* Title row */}
        <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {hostel.name}
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">{hostel.tagline}</p>
          </div>
          <div className="mt-2 sm:mt-0 sm:text-right shrink-0">
            <p className="text-[13px] text-muted-foreground">Starting from</p>
            <p className="text-xl font-bold text-foreground">{hostel.price}</p>
          </div>
        </motion.div>

        {/* Address */}
        <motion.p
          variants={itemVariants}
          className="mt-3 flex items-center gap-1.5 text-[13px] text-muted-foreground"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z" />
          </svg>
          {hostel.address}
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column — main content */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* About */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-[14px] font-semibold text-foreground">About</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">
                {hostel.description}
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-[14px] font-semibold text-foreground">What&apos;s included</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {hostel.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[13px] text-neutral-700">
                    <CheckIcon />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Room types */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-[14px] font-semibold text-foreground">Room types &amp; pricing</h2>
              <div className="mt-3 flex flex-col divide-y divide-black/5">
                {hostel.roomTypes.map((room) => (
                  <div key={room.type} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{room.type}</p>
                      <p className="text-[12px] text-muted-foreground">{room.occupancy}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-foreground">{room.price}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column — contact card */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <h2 className="text-[14px] font-semibold text-foreground">Get in touch</h2>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 shrink-0 text-muted-foreground">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" />
                  </svg>
                  <a
                    href={`tel:${hostel.phone.replace(/\s/g, "")}`}
                    className="text-[13px] text-neutral-700 hover:text-foreground transition-colors"
                  >
                    {hostel.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 shrink-0 text-muted-foreground">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <a
                    href={`mailto:${hostel.email}`}
                    className="text-[13px] text-neutral-700 hover:text-foreground transition-colors"
                  >
                    {hostel.email}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mt-0.5 shrink-0 text-muted-foreground">
                    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm.5 5v6l4.5 2.67-.75 1.23L11 14V7h1.5z" />
                  </svg>
                  <span className="text-[13px] text-neutral-700">{hostel.hours}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <a href={`tel:${hostel.phone.replace(/\s/g, "")}`}>
                  <SoftPillButton variant="primary" className="w-full h-9 text-[13px]">
                    Call Now
                  </SoftPillButton>
                </a>
                <Link href="/contact">
                  <SoftPillButton variant="secondary" className="w-full h-9 text-[13px]">
                    Send Enquiry
                  </SoftPillButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
