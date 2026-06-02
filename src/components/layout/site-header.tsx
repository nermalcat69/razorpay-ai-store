"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import SoftPillButton from "@/components/ui/soft-pill-button";

type SiteHeaderProps = {
  fixed?: boolean;
};

export function SiteHeader({ fixed = false }: SiteHeaderProps = {}) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!fixed) return;

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 20) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixed]);

  return (
    <header
      className={
        fixed
          ? "sticky top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-5 backdrop-blur sm:px-10 transition-transform duration-300 ease-out will-change-transform"
          : "relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-10"
      }
      style={
        fixed
          ? { transform: hidden ? "translateY(-100%)" : "translateY(0)" }
          : undefined
      }
    >
      <Link href="/" aria-label="Jeevan PG" className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Jeevan PG
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/contact" aria-label="Contact Us">
          <SoftPillButton variant="primary" className="h-9 px-4 text-[13px]">
            Contact Us
          </SoftPillButton>
        </Link>
      </div>
    </header>
  );
}
