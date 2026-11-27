"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { useBooking } from "@/components/booking/booking-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * Phone field + "Book pickup" pill. Submitting opens the booking dialog with
 * the number already filled in; the dialog validates it with everything else.
 * tone "sky" sits on the Sky hero card, "panel" on white or surface.
 */
export function QuickBook({
  id,
  tone = "sky",
  className,
}: {
  id: string
  tone?: "sky" | "panel"
  className?: string
}) {
  const { openBooking } = useBooking()
  const [phone, setPhone] = React.useState("")

  return (
    <form
      className={cn("flex w-full max-w-[440px] items-center gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault()
        openBooking(undefined, { phone: phone.trim() })
      }}
    >
      <label htmlFor={id} className="sr-only">
        Your M-Pesa number
      </label>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="M-Pesa number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={cn(
          "h-12 w-0 min-w-0 flex-1 rounded-full px-5 text-base text-ink transition-colors placeholder:text-ink/70",
          tone === "sky"
            ? "border border-ink/60 bg-white/50 hover:bg-white/70 focus:bg-white"
            : "border border-control-border bg-white hover:border-ink focus:border-ink"
        )}
      />
      <Button type="submit" variant={tone === "sky" ? "white" : "default"} className="h-12 px-5">
        Book pickup
        <ArrowRight />
      </Button>
    </form>
  )
}
