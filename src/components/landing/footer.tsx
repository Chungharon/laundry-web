import { Logo } from "@/components/brand/logo"
import { NAV_LINKS } from "@/components/landing/nav-links"
import { QuickBook } from "@/components/landing/quick-book"

/* Booking panel and footer bar on a full-width cool surface band. */
export function SiteFooter() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-[clamp(48px,6vw,80px)] pb-6">
      <div className="grid grid-cols-1 gap-8 menu:grid-cols-[1fr_1.3fr]">
        <p className="eyebrow h-fit">Book a pickup</p>
        <div className="flex flex-col gap-6">
          <h2 className="max-w-[18em] text-[clamp(24px,2.6vw,34px)] leading-[1.15] font-semibold tracking-[-0.02em]">
            Get your laundry picked up today, at the hour you choose.
          </h2>
          <QuickBook id="footer-phone" tone="panel" />
        </div>
      </div>

      <div className="mt-[clamp(48px,6vw,80px)] grid items-center gap-6 border-t border-ink/15 pt-6 menu:grid-cols-[1fr_auto_1fr]">
        <p className="text-small text-neutral-700">© 2026 Laundry Hub · Nairobi</p>
        <a href="#top" aria-label="Laundry Hub, back to top" className="menu:justify-self-center">
          <Logo height={28} />
        </a>
        <nav aria-label="Footer" className="menu:justify-self-end">
          <ul className="flex flex-wrap gap-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-9 items-center rounded-full border border-ink/20 px-3.5 text-small text-ink no-underline transition-colors hover:border-ink hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>
    </footer>
  )
}
