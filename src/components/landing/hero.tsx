import Image from "next/image"
import { ArrowUpRight, Asterisk, Bike, Clock, Shirt, WashingMachine } from "lucide-react"

import { BookingButton } from "@/components/booking/booking-provider"
import { HeroStage } from "@/components/hero/hero-stage"
import { QuickBook } from "@/components/landing/quick-book"
import { SAME_DAY_NOTICE_HOURS } from "@/lib/booking"
import { PRICE_PER_KG, kes, type ServiceId } from "@/lib/services"

/*
 * Hero bento: a Sky card with the headline and a quick-book field, beside the
 * 3D stack card with service hotspots floating over it. The stack card's
 * ground is --lh-mist, the same colour baked into hero-stack.avif, so the
 * static first paint (the LCP) and the live canvas line up without an edge.
 */
const HOTSPOTS: { service: ServiceId; label: string; className: string }[] = [
  { service: "wash-fold", label: "Wash & Fold", className: "top-[30%] right-[7%]" },
  { service: "dry-cleaning", label: "Dry Cleaning", className: "top-[50%] left-[6%]" },
  { service: "blankets-duvets", label: "Blankets & Duvets", className: "top-[68%] right-[10%]" },
]

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grid grid-cols-1 gap-2.5 px-2.5 menu:grid-cols-2 sm:px-3">
      {/* Headline card */}
      <div className="relative flex min-h-[540px] flex-col items-center justify-center rounded-4xl bg-accent px-6 py-16 text-center text-ink sm:px-12">
        <p className="flex items-center gap-1.5 text-small font-semibold">
          <Asterisk aria-hidden className="size-4" strokeWidth={2.5} />
          Laundry Hub · Nairobi
        </p>

        <h1 id="hero-title" className="mt-6 max-w-[10.5em] text-display-xl">
          Laundry day,{" "}
          <span
            aria-hidden
            className="inline-flex size-[0.72em] translate-y-[-0.06em] items-center justify-center rounded-full border-2 border-dashed border-ink align-middle"
          >
            <ArrowUpRight className="size-[0.42em]" strokeWidth={2.25} />
          </span>{" "}
          made <span className="underline decoration-[0.06em] underline-offset-[0.12em]">easy</span>.
        </h1>

        <p className="mt-5 max-w-[27em] text-body-l text-ink">
          Pick a service and an exact pickup time. We weigh your laundry at your door and bring it back
          folded.
        </p>

        <QuickBook id="hero-phone" tone="sky" className="mt-8" />

        <div className="mt-7 flex items-center gap-3 text-left text-small leading-[1.3]">
          <span aria-hidden className="flex -space-x-2.5">
            {[Shirt, WashingMachine, Bike].map((Icon, i) => (
              <span
                key={i}
                className="flex size-9 items-center justify-center rounded-full border-2 border-accent bg-white"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </span>
          <span>
            <b className="font-bold">{kes(PRICE_PER_KG)} per kg</b>
            <br />
            No minimum weight
          </span>
        </div>
      </div>

      {/* 3D stack card */}
      <div className="relative min-h-[540px] overflow-hidden rounded-4xl bg-mist">
        <Image
          src="/hero/hero-stack.avif"
          alt=""
          fill
          sizes="(min-width: 820px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-contain"
        />
        <HeroStage />

        {/* Top left: a card that jumps to the weight guide */}
        <a
          href="#weight-guide"
          className="group absolute top-4 left-4 flex items-center gap-3 rounded-2xl bg-white p-2 pr-5 text-ink no-underline shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:text-ink"
        >
          <span aria-hidden className="fabric-towel size-14 rounded-xl" />
          <span className="text-small leading-[1.25] font-semibold">
            <span aria-hidden className="mb-1 block size-2 rounded-full bg-accent ring-4 ring-accent-200" />
            Weighed at
            <br />
            your door
          </span>
          <span
            aria-hidden
            className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-accent transition-transform group-hover:rotate-45"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </a>

        {/* Top right: price sticker */}
        <p className="absolute top-4 right-4 flex size-20 flex-col items-center justify-center rounded-full bg-ink text-center text-bg">
          <span className="text-[17px] leading-none font-bold">{kes(PRICE_PER_KG)}</span>
          <span className="mt-1 text-[12px] leading-none">per kg</span>
        </p>

        {/* Service hotspots: each opens booking with that service */}
        {HOTSPOTS.map((spot) => (
          <BookingButton
            key={spot.service}
            service={spot.service}
            className={`absolute ${spot.className} flex min-h-control-sm cursor-pointer items-center gap-2 rounded-full bg-white/85 py-1.5 pr-4 pl-2 text-small font-semibold text-ink backdrop-blur-sm transition-colors hover:bg-white`}
          >
            <span aria-hidden className="flex size-5 items-center justify-center rounded-full border border-ink/30">
              <span className="size-2 rounded-full bg-steel" />
            </span>
            {spot.label}
          </BookingButton>
        ))}

        {/* Bottom left: notch with the same-day rule */}
        <div className="notch-bl">
          <p className="flex items-center gap-2.5 rounded-full border border-ink/10 bg-white py-2 pr-4 pl-2 text-small leading-[1.2] font-semibold text-ink">
            <span className="flex size-8 items-center justify-center rounded-full bg-accent">
              <Clock aria-hidden className="size-4" />
            </span>
            Same-day pickup with {SAME_DAY_NOTICE_HOURS} hours&apos; notice
          </p>
        </div>

        <p className="absolute right-5 bottom-5 hidden max-w-[15em] text-right text-small leading-[1.3] font-semibold text-ink sm:block">
          Pay with M-Pesa. Any balance on delivery.
        </p>
      </div>
    </section>
  )
}
