"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Over the dark hero (top of page) the nav is light; once scrolled onto the
  // light sections it flips to the paper bar with dark ink.
  const light = !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-paper/80 py-3 shadow-[0_1px_0_rgba(43,37,32,0.06)] backdrop-blur-xl"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-2" data-cursor="">
            <span
              className={`font-display text-xl font-semibold tracking-tight transition-colors duration-500 sm:text-2xl ${
                light ? "text-paper" : "text-espresso"
              }`}
            >
              {BRAND.name}
            </span>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 sm:inline ${
                light ? "text-paper/60" : "text-stone"
              }`}
            >
              Furniture
            </span>
          </a>

          <div className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`group relative text-[13px] font-medium tracking-wide transition-colors ${
                  light ? "text-paper/80 hover:text-paper" : "text-espresso/75 hover:text-espresso"
                }`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className={`hidden rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all md:inline-block ${
                light
                  ? "border-paper/35 text-paper hover:bg-paper hover:text-espresso"
                  : "border-espresso/25 text-espresso hover:bg-espresso hover:text-paper"
              }`}
              data-cursor=""
            >
              Start Your Project
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`h-px w-6 transition-all duration-300 ${light ? "bg-paper" : "bg-espresso"} ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 transition-all duration-300 ${light ? "bg-paper" : "bg-espresso"} ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-6 transition-all duration-300 ${light ? "bg-paper" : "bg-espresso"} ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[99] flex flex-col bg-paper px-6 pb-10 pt-28 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-espresso/10 py-5 font-display text-3xl text-espresso"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-auto rounded-full bg-espresso py-4 text-center text-sm font-medium text-paper"
            >
              Start Your Project
            </motion.a>
            <p className="mt-6 text-center text-xs tracking-wide text-stone">
              {BRAND.email}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
