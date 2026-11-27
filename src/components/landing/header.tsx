import { ArrowRight } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { BookingButton } from "@/components/booking/booking-provider"
import { buttonVariants } from "@/components/ui/button"
import { MobileMenu } from "@/components/landing/mobile-menu"
import { NAV_LINKS } from "@/components/landing/nav-links"

const pill =
  "inline-flex min-h-control-sm items-center gap-2 rounded-full bg-surface px-4 text-small font-semibold text-ink no-underline transition-colors duration-150 hover:bg-accent-200 hover:text-ink"

/* Pill navigation either side of a centred logo, as in the reference layout. */
export function SiteHeader() {
  const [first, ...rest] = NAV_LINKS
  const left = [first, ...rest.slice(0, 2)]
  const right = rest.slice(2)

  return (
    <header className="relative flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
      <nav aria-label="Main" className="hidden menu:block">
        <ul className="flex items-center gap-1.5">
          {left.map((link, i) => (
            <li key={link.href}>
              <a href={link.href} className={pill}>
                {i === 0 && <span aria-hidden className="size-1.5 rounded-full bg-ink" />}
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a
        href="#top"
        aria-label="Laundry Hub, back to top"
        className="rounded-full px-2 py-1 menu:absolute menu:left-1/2 menu:-translate-x-1/2"
      >
        <Logo eager height={30} />
      </a>

      <div className="flex items-center gap-1.5">
        <ul className="hidden items-center gap-1.5 menu:flex">
          {right.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={pill}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <BookingButton className={buttonVariants({ variant: "outline", className: "hidden border-ink sm:inline-flex" })}>
          Book a pickup
          <ArrowRight />
        </BookingButton>
        <MobileMenu />
      </div>
    </header>
  )
}
