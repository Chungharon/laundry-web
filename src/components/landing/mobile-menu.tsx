"use client"

import * as React from "react"
import { ArrowRight, Menu } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useBooking } from "@/components/booking/booking-provider"
import { NAV_LINKS } from "@/components/landing/nav-links"

/* Below the 820px menu breakpoint the nav collapses into this full-width list. */
export function MobileMenu() {
  const [open, setOpen] = React.useState(false)
  const { openBooking } = useBooking()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="secondary" className="menu:hidden" />}>
        <Menu className="size-icon-md" />
        Menu
      </SheetTrigger>
      <SheetContent side="top" className="gap-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav aria-label="Main" className="flex flex-col px-5 pt-16 pb-6">
          <ul className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center rounded-full bg-surface px-5 text-h4 font-semibold text-ink no-underline hover:bg-accent-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={buttonVariants({ size: "lg", className: "mt-4 w-full" })}
            onClick={() => {
              setOpen(false)
              openBooking()
            }}
          >
            Book a pickup
            <ArrowRight />
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
