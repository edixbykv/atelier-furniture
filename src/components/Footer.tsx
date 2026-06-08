import { BRAND, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-cocoa px-5 pb-10 pt-16 text-paper/70 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-12 border-t border-paper/10 pt-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold text-paper">{BRAND.name}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-taupe">Furniture</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-paper/55">
              Premium furniture manufacturing for residential, commercial and
              custom projects — engineered and finished under one roof in {BRAND.location}.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-paper/60 transition-colors hover:text-paper"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center">
          <span>© {year} {BRAND.full}. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by{" "}
            <a
              href="https://kvai.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-paper/70 underline-offset-4 transition-colors hover:text-bronze hover:underline"
            >
              KVAI.in
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
