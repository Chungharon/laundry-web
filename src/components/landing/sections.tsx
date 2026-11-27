import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react"

import { BookingButton } from "@/components/booking/booking-provider"
import { Section, SectionHeader } from "@/components/landing/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { ImageFrame } from "@/components/ui/image-frame"
import { Tracker } from "@/components/ui/tracker"
import { PHOTOS } from "@/lib/photos"
import { PRICE_PER_KG, SERVICES, kes, priceLabel, type ServiceId } from "@/lib/services"
import { cn } from "@/lib/utils"

/* ---------- Statement: centred line with round swatches drifting around it ---------- */

const SWATCHES = [
  { photo: PHOTOS.swatchTowels, className: "top-[18%] left-[9%] size-16", delay: "0s" },
  { photo: PHOTOS.swatchShirts, className: "top-[52%] left-[16%] size-14", delay: "-2s" },
  { photo: PHOTOS.swatchDenim, className: "top-[20%] right-[10%] size-14", delay: "-4s" },
  { photo: PHOTOS.swatchDots, className: "top-[54%] right-[17%] size-16", delay: "-1s" },
]

export function Statement() {
  return (
    <section
      aria-labelledby="statement-title"
      className="relative overflow-hidden px-(--gutter) py-[clamp(72px,10vw,136px)] text-center"
    >
      {SWATCHES.map((s, i) => (
        <span
          key={i}
          aria-hidden
          style={{ animationDelay: s.delay }}
          className={cn("drift absolute hidden rounded-full p-1 ring-2 ring-accent menu:block", s.className)}
        >
          <ImageFrame {...s.photo} className="size-full rounded-full" />
        </span>
      ))}

      <h2 id="statement-title" className="mx-auto max-w-[13em] text-display-l">
        Clean clothes, without the trip to the laundromat.
      </h2>
      <p className="mx-auto mt-5 max-w-[30em] text-body-l text-neutral-800">
        We collect from <b className="font-bold text-ink">your door</b>, wash and fold, and bring it back at{" "}
        <b className="font-bold text-ink">the hour you chose</b>.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <a href="#services" className={buttonVariants({ variant: "outline" })}>
          See prices
          <ArrowRight />
        </a>
        <a
          href="#how-it-works"
          className="inline-flex min-h-control-sm items-center gap-2 font-semibold text-ink no-underline hover:text-ink hover:underline"
        >
          <span aria-hidden className="size-2 rounded-full bg-accent ring-4 ring-accent-200" />
          How it works
        </a>
      </div>
    </section>
  )
}

/* ---------- Word strip: "You · relax · → · we fold" in pills ---------- */

const pillWord =
  "relative flex h-[clamp(96px,12vw,176px)] items-center justify-center overflow-hidden rounded-full text-[clamp(30px,4.6vw,64px)] leading-none font-semibold tracking-[-0.03em]"

export function WordStrip() {
  return (
    <section aria-label="You relax, we fold" className="px-2.5 sm:px-3">
      <div className="grid grid-cols-2 gap-2 menu:flex menu:gap-0">
        <p aria-hidden className={cn(pillWord, "bg-surface text-ink menu:flex-1")}>
          You
        </p>
        <ImageFrame
          {...PHOTOS.stripRelax}
          className={cn(pillWord, "text-white menu:-ml-4 menu:flex-1")}
        >
          <span aria-hidden className="relative">
            relax
          </span>
        </ImageFrame>
        <BookingButton
          aria-label="Book a pickup"
          className={cn(
            pillWord,
            "group cursor-pointer bg-accent text-ink transition-colors hover:bg-accent-400 menu:-ml-4 menu:flex-1"
          )}
        >
          <ArrowRight
            aria-hidden
            strokeWidth={1.5}
            className="size-[1.6em] transition-transform duration-300 group-hover:translate-x-2"
          />
        </BookingButton>
        <ImageFrame
          {...PHOTOS.stripFold}
          className={cn(pillWord, "text-white menu:-ml-4 menu:flex-1")}
        >
          <span aria-hidden className="relative">
            we fold
          </span>
        </ImageFrame>
        <p className="sr-only">You relax, we fold.</p>
      </div>
    </section>
  )
}

/* ---------- Prices: a table of services; each row books that service ---------- */

const SERVICE_EXTRAS: Record<ServiceId, { tags: string[]; photo: (typeof PHOTOS)[keyof typeof PHOTOS] }> = {
  "wash-fold": { tags: ["everyday clothes", "bedsheets", "towels"], photo: PHOTOS.priceWashFold },
  "dry-cleaning": { tags: ["suits", "dresses", "silk"], photo: PHOTOS.priceDryCleaning },
  "blankets-duvets": { tags: ["down", "feather", "synthetic"], photo: PHOTOS.priceDuvets },
}

const tableCols = "menu:grid menu:grid-cols-[1.3fr_1.4fr_1fr_auto] menu:items-center menu:gap-6"

export function Services() {
  return (
    <Section id="services" className="pb-[calc(var(--section-pad)/2)]">
      <SectionHeader
        id="services"
        eyebrow="Prices"
        title="Priced by the kilo or by the item."
        note="Pick a service to book a pickup. We weigh or count it at your door. There is no minimum."
      />

      <div aria-hidden className={cn("hidden border-b border-ink/15 pb-3 text-small text-neutral-700", tableCols)}>
        <span>Service</span>
        <span>Good for</span>
        <span>Price</span>
        <span className="w-11" />
      </div>

      <ul data-reveal>
        {SERVICES.map((service, i) => {
          const extra = SERVICE_EXTRAS[service.id]
          return (
            <li key={service.id} className="border-b border-ink/15">
              <BookingButton
                service={service.id}
                className={cn(
                  "group relative flex w-full cursor-pointer flex-col gap-3 py-6 text-left text-ink",
                  tableCols
                )}
              >
                <span className="text-h3">{service.name}</span>
                <span className="flex flex-wrap gap-1.5">
                  {extra.tags.map((tag, t) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[13px] leading-[1.4]",
                        i === 1 && t === 0 ? "border-accent bg-accent" : "border-ink/20"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="text-body-l font-semibold">{priceLabel(service)}</span>
                <span
                  aria-hidden
                  className="absolute top-6 right-0 flex size-11 items-center justify-center rounded-full bg-surface transition-colors duration-200 group-hover:bg-accent menu:static"
                >
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:-rotate-45" />
                </span>

                {/* Tilted photo that appears beside the row on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-[16%] z-10 hidden -translate-y-1/2 scale-90 opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 menu:block"
                >
                  <span className="absolute inset-0 -translate-x-3 -translate-y-3 -rotate-3 rounded-2xl bg-accent" />
                  <ImageFrame {...extra.photo} alt="" className="h-32 w-44 rotate-6 rounded-2xl shadow-md" />
                </span>
              </BookingButton>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/* ---------- How it works: tall cards; the hovered one widens ---------- */

const STEPS = [
  {
    title: "Book & pay",
    body: "Pick a service and an exact pickup time. Pay your estimate with an M-Pesa STK push.",
    photo: PHOTOS.stepBook,
    chips: ["M-Pesa", "Exact times"],
  },
  {
    title: "Weighed at your door",
    body: "Our rider collects your laundry and weighs it in front of you.",
    photo: PHOTOS.stepWeigh,
  },
  {
    title: "Washed at 30°C",
    body: "Tumble-dried and folded. Suits, dresses and silk go to Dry Cleaning.",
    photo: PHOTOS.stepWash,
  },
  {
    title: "Back on time",
    body: "At the hour you chose. You pay any balance on delivery.",
    photo: PHOTOS.stepReturn,
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="px-2.5 sm:px-3">
      <div className="px-[calc(var(--gutter)-10px)]">
        <SectionHeader
          id="how-it-works"
          eyebrow="How it works"
          title="From your door and back, in four steps."
          note="You choose the times. We do the rest, and you can follow each step as it happens."
        />
      </div>
      <ol className="step-cards">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            tabIndex={0}
            className="relative flex h-[clamp(440px,40vw,520px)] flex-col justify-between overflow-hidden rounded-4xl p-4 text-white outline-offset-4"
          >
            <ImageFrame {...step.photo} className="absolute inset-0" sizes="(min-width: 820px) 40vw, 80vw" />
            <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/25 to-ink/0" />

            <div className="relative flex items-start justify-between gap-3">
              <span className="flex flex-wrap gap-1.5">
                {step.chips?.map((chip) => (
                  <span
                    key={chip}
                    className="flex items-center gap-1.5 rounded-full border border-accent/80 bg-ink/30 py-1 pr-3 pl-1.5 text-[13px] font-semibold backdrop-blur-sm"
                  >
                    <span aria-hidden className="size-3 rounded-full border-2 border-accent bg-white" />
                    {chip}
                  </span>
                ))}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full text-small font-bold",
                  i === 0 ? "bg-accent text-ink" : "bg-white text-ink"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="relative flex flex-col gap-3">
              <h3 className="max-w-[9em] text-[clamp(26px,2.4vw,34px)] leading-[1.05] font-semibold tracking-[-0.02em]">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="max-w-[24em] text-small text-white/90">{step.body}</p>
              {i === 0 && (
                <BookingButton
                  className={buttonVariants({
                    variant: "white",
                    className: "mt-2 w-full justify-between text-[13px] font-bold tracking-[0.04em] uppercase",
                  })}
                >
                  Book a pickup
                  <ChevronRight />
                </BookingButton>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/* ---------- Weight guide + tracking bento ---------- */

export function GuideAndTracking() {
  return (
    <section className="grid gap-2.5 px-2.5 menu:grid-cols-[1.2fr_1fr] sm:px-3">
      <div
        id="weight-guide"
        aria-labelledby="weight-guide-title"
        role="region"
        className="flex scroll-mt-4 flex-col gap-6 rounded-4xl bg-surface p-6 sm:p-10"
      >
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Weight guide</p>
          <h2 id="weight-guide-title" className="text-h2">
            What does 6 kg look like?
          </h2>
          <p className="max-w-[32em] text-body-l text-neutral-800">
            You enter an estimate when you book. We weigh your laundry at your door and charge for what the scale
            shows.
          </p>
        </div>
        <ImageFrame {...PHOTOS.weightGuide} className="aspect-video rounded-3xl">
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-small font-semibold text-ink">
            6 kg on the scale
          </span>
        </ImageFrame>
        <div className="flex flex-col gap-1.5 rounded-3xl bg-white p-5 sm:p-6">
          <h3 className="text-h4">What if I have more?</h3>
          <p className="text-neutral-800">
            That&apos;s fine. We charge {kes(PRICE_PER_KG)} per kg for what the scale shows, and you pay the
            difference on delivery. There is no minimum weight.
          </p>
        </div>
      </div>

      <div
        id="tracking"
        aria-labelledby="tracking-title"
        role="region"
        className="flex scroll-mt-4 flex-col gap-6 rounded-4xl bg-ink p-6 text-bg [--ring:var(--lh-accent)] sm:p-10"
      >
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Order tracking</p>
          <h2 id="tracking-title" className="text-h2">
            Know where your laundry is.
          </h2>
          <p className="max-w-[30em] text-body-l text-neutral-300">
            See each step as it happens. Once we weigh it, you see the real weight, what you paid and the balance
            due on delivery.
          </p>
        </div>
        <Tracker
          className="mt-auto"
          current={3}
          detail="Washing, drying and folding your laundry."
          stepNotes={{ 2: "5.5 kg" }}
          summary={
            <dl className="flex flex-col gap-1">
              <div className="flex justify-between">
                <dt>5.5 kg × {kes(PRICE_PER_KG)}</dt>
                <dd className="font-bold">{kes(440)}</dd>
              </div>
              <div className="flex justify-between text-neutral-800">
                <dt>Paid (estimate)</dt>
                <dd>− {kes(400)}</dd>
              </div>
              <div className="flex justify-between font-bold">
                <dt>Balance on delivery</dt>
                <dd>{kes(40)}</dd>
              </div>
            </dl>
          }
        />
        <p className="-mt-3 text-small text-neutral-400">An example order, part way through.</p>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: "When do I pay?",
    a: "You pay your estimate with M-Pesa when you book. We weigh your laundry at your door, and you pay any balance on delivery.",
  },
  {
    q: "What if I have more than I booked?",
    a: `That's fine. We charge ${kes(PRICE_PER_KG)} per kg for what the scale shows, and you pay the difference on delivery.`,
  },
  {
    q: "Is there a minimum?",
    a: "No. We weigh whatever you give us, however small.",
  },
  {
    q: "How soon can you pick up?",
    a: "Same-day pickups need 2 hours' notice. You choose an exact hour when you book.",
  },
  {
    q: "How do you wash my clothes?",
    a: "Wash & Fold is washed at 30°C, tumble-dried and folded. Suits, dresses and silk go to Dry Cleaning, priced by the item.",
  },
]

export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-10 menu:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="text-h2">
            Questions, answered.
          </h2>
          <p className="max-w-[22em] text-body-l text-neutral-800">
            Paying, weighing and pickup times, in a sentence or two each.
          </p>
          <a
            href="#services"
            className="mt-2 inline-flex items-center gap-2 font-semibold text-ink no-underline hover:text-ink hover:underline"
          >
            See all prices
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
        <Accordion defaultValue={[FAQS[0].q]}>
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p>{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}
