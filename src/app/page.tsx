import { BookingProvider } from "@/components/booking/booking-provider"
import { SiteFooter } from "@/components/landing/footer"
import { SiteHeader } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { ScrollMotion } from "@/components/landing/scroll-motion"
import {
  Faq,
  GuideAndTracking,
  HowItWorks,
  Services,
  Statement,
  WordStrip,
} from "@/components/landing/sections"

/*
 * The Laundry Hub landing page, full width on Floral White.
 * Every section is a server component; the client parts are the booking
 * dialog, the quick-book fields, the mobile menu, the 3D hero and the
 * scroll motion.
 */
export default function Home() {
  return (
    <BookingProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-bg px-4 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <div id="top" className="overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px]">
          <SiteHeader />
          <main id="main">
            <Hero />
            <ScrollMotion>
              <Statement />
              <WordStrip />
              <Services />
              <HowItWorks />
              <GuideAndTracking />
              <Faq />
            </ScrollMotion>
          </main>
        </div>
        <SiteFooter />
      </div>
    </BookingProvider>
  )
}
