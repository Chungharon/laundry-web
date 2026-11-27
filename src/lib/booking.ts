import type { ServiceId } from "@/lib/services"

/*
 * Booking: slots, validation and submission.
 *
 * The site is a static export, so there is no API route. In production
 * submitBooking() posts to a Firebase Cloud Function, which also starts the
 * M-Pesa Daraja STK push (Daraja needs a public HTTPS callback). Until that
 * function exists, set no NEXT_PUBLIC_BOOKING_ENDPOINT and the dialog runs as
 * a prototype: nothing is sent.
 */

export type Booking = {
  service: ServiceId
  /** Estimated kilograms, Wash & Fold only. */
  weightKg: number | null
  pickup: { date: string; time: string }
  dropoff: { date: string; time: string }
  address: string
  /** Normalised to 2547XXXXXXXX / 2541XXXXXXXX. */
  phone: string
}

export type BookingResult =
  | { ok: true; prototype: boolean }
  | { ok: false; message: string }

const ENDPOINT = process.env.NEXT_PUBLIC_BOOKING_ENDPOINT

export const IS_PROTOTYPE = !ENDPOINT

export async function submitBooking(booking: Booking): Promise<BookingResult> {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 600))
    return { ok: true, prototype: true }
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
    if (!res.ok) {
      return { ok: false, message: "We couldn't book your pickup. Try again in a minute." }
    }
    return { ok: true, prototype: false }
  } catch {
    return { ok: false, message: "You seem to be offline. Check your connection and try again." }
  }
}

/* ---------- Phone ---------- */

/** Accepts 0712 345 678, 712345678, +254 712 345 678, 0110 …; returns 254XXXXXXXXX or null. */
export function normaliseKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s()-]/g, "").replace(/^\+/, "")
  const m = digits.match(/^(?:254|0)?([17]\d{8})$/)
  return m ? `254${m[1]}` : null
}

/* ---------- Days and times ---------- */

/** Notice needed for a same-day pickup, in hours (design system copy). */
export const SAME_DAY_NOTICE_HOURS = 2

/**
 * Bookable hours, 8:00 AM to 6:00 PM. Placeholder: opening hours are not
 * decided yet (see the app handover note), so change this when they are.
 */
export const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

export type Day = { key: string; weekday: string; dayOfMonth: number; label: string; date: Date }

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function dayKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${m}-${day}`
}

/** "Thu 26 Nov" */
export function formatDay(d: Date) {
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** "10:00 AM" */
export function formatHour(h: number) {
  const suffix = h < 12 ? "AM" : "PM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:00 ${suffix}`
}

/** `count` days from `from` (inclusive); the first is "Today" when it is today. */
export function nextDays(from: Date, count: number, now: Date): Day[] {
  const today = dayKey(now)
  return Array.from({ length: count }, (_, i) => {
    const date = startOfDay(new Date(from.getFullYear(), from.getMonth(), from.getDate() + i))
    const key = dayKey(date)
    return {
      key,
      date,
      weekday: key === today ? "Today" : WEEKDAYS[date.getDay()],
      dayOfMonth: date.getDate(),
      label: formatDay(date),
    }
  })
}

/** Hours still bookable on `day`: today needs SAME_DAY_NOTICE_HOURS of notice. */
export function availableHours(day: Date, now: Date): Set<number> {
  if (dayKey(day) !== dayKey(now)) return new Set(SLOT_HOURS)
  const earliest = now.getHours() + now.getMinutes() / 60 + SAME_DAY_NOTICE_HOURS
  return new Set(SLOT_HOURS.filter((h) => h >= earliest))
}
