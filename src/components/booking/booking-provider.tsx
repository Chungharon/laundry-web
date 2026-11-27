"use client"

import * as React from "react"
import type { ServiceId } from "@/lib/services"
import { BookingDialog } from "@/components/booking/booking-dialog"

type BookingContextValue = {
  /** Open the dialog, optionally with a service chosen and a phone number filled in. */
  openBooking: (service?: ServiceId, prefill?: { phone?: string }) => void
}

const BookingContext = React.createContext<BookingContextValue | null>(null)

/**
 * Holds the one booking dialog for the page. Any <BookingButton> opens it,
 * optionally with a service already chosen.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [service, setService] = React.useState<ServiceId>("wash-fold")
  const [phone, setPhone] = React.useState("")
  // Bumped on every open so the form starts fresh each time.
  const [session, setSession] = React.useState(0)

  const openBooking = React.useCallback((id?: ServiceId, prefill?: { phone?: string }) => {
    if (id) setService(id)
    setPhone(prefill?.phone ?? "")
    setSession((s) => s + 1)
    setOpen(true)
  }, [])

  // Deep link: /#book opens the booking dialog (for ads, SMS and QR codes).
  React.useEffect(() => {
    const check = () => {
      if (window.location.hash === "#book") openBooking()
    }
    check()
    window.addEventListener("hashchange", check)
    return () => window.removeEventListener("hashchange", check)
  }, [openBooking])

  const value = React.useMemo(() => ({ openBooking }), [openBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog
        key={session}
        open={open}
        onOpenChange={setOpen}
        initialService={service}
        initialPhone={phone}
      />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = React.useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>")
  return ctx
}

/**
 * A button that opens the booking dialog. Style it like any element via
 * className (e.g. buttonVariants()); it renders a plain <button>.
 */
export function BookingButton({
  service,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { service?: ServiceId }) {
  const { openBooking } = useBooking()
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(e) => {
        onClick?.(e)
        openBooking(service)
      }}
      {...props}
    />
  )
}
