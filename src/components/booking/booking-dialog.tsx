"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chip, ChipGroup, DayChip, Stepper } from "@/components/ui/picker"
import {
  IS_PROTOTYPE,
  SAME_DAY_NOTICE_HOURS,
  SLOT_HOURS,
  availableHours,
  formatHour,
  nextDays,
  normaliseKenyanPhone,
  submitBooking,
} from "@/lib/booking"
import { PRICE_PER_KG, SERVICES, getService, kes, type ServiceId } from "@/lib/services"

const PROTOTYPE_NOTE = "Prototype: this won't place a real order or send an M-Pesa request."

export function BookingDialog({
  open,
  onOpenChange,
  initialService,
  initialPhone = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialService: ServiceId
  initialPhone?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        {/* Mounted only while open, so "now" is read in the browser, never at build time. */}
        <BookingForm initialService={initialService} initialPhone={initialPhone} />
      </DialogContent>
    </Dialog>
  )
}

type Errors = Partial<Record<"pickupTime" | "dropoffTime" | "address" | "phone" | "submit", string>>

function BookingForm({ initialService, initialPhone }: { initialService: ServiceId; initialPhone: string }) {
  const [now] = React.useState(() => new Date())
  const pickupDays = React.useMemo(() => nextDays(now, 5, now), [now])

  const [serviceId, setServiceId] = React.useState<ServiceId>(initialService)
  const [weight, setWeight] = React.useState(6)
  const [pickupDayKey, setPickupDayKey] = React.useState(
    () => pickupDays.find((d) => availableHours(d.date, now).size > 0)?.key ?? pickupDays[1].key
  )
  const [pickupHour, setPickupHour] = React.useState<number | null>(null)
  const pickupDay = pickupDays.find((d) => d.key === pickupDayKey) ?? pickupDays[0]
  const pickupHours = availableHours(pickupDay.date, now)

  // Drop-off days start the day after pickup.
  const dropoffDays = React.useMemo(() => {
    const next = new Date(pickupDay.date)
    next.setDate(next.getDate() + 1)
    return nextDays(next, 5, now)
  }, [pickupDay.date, now])
  const [dropoffDayKey, setDropoffDayKey] = React.useState(dropoffDays[0].key)
  const dropoffDay = dropoffDays.find((d) => d.key === dropoffDayKey) ?? dropoffDays[0]
  const [dropoffHour, setDropoffHour] = React.useState<number | null>(null)

  const [address, setAddress] = React.useState("")
  const [phone, setPhone] = React.useState(initialPhone)
  const [errors, setErrors] = React.useState<Errors>({})
  const [status, setStatus] = React.useState<"idle" | "sending" | "done">("idle")

  const service = getService(serviceId)
  const perKg = service.basis === "Per kg"
  const total = perKg ? weight * PRICE_PER_KG : null

  function choosePickupDay(key: string) {
    setPickupDayKey(key)
    setPickupHour(null)
    // Keep the drop-off after the new pickup day.
    const next = new Date(pickupDays.find((d) => d.key === key)!.date)
    next.setDate(next.getDate() + 1)
    setDropoffDayKey(nextDays(next, 1, now)[0].key)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const normalised = normaliseKenyanPhone(phone)
    const next: Errors = {}
    if (pickupHour === null) next.pickupTime = "Choose a pickup time."
    if (dropoffHour === null) next.dropoffTime = "Choose a drop-off time."
    if (address.trim().length < 4) next.address = "Enter the street and area for pickup."
    if (!normalised) next.phone = "Enter a 10-digit M-Pesa number."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setStatus("sending")
    const result = await submitBooking({
      service: serviceId,
      weightKg: perKg ? weight : null,
      pickup: { date: pickupDay.key, time: formatHour(pickupHour!) },
      dropoff: { date: dropoffDay.key, time: formatHour(dropoffHour!) },
      address: address.trim(),
      phone: normalised!,
    })
    if (result.ok) {
      setStatus("done")
    } else {
      setStatus("idle")
      setErrors({ submit: result.message })
    }
  }

  if (status === "done") {
    return (
      <>
        <DialogHeader>
          <p className="eyebrow">{service.name}</p>
          <DialogTitle>Pickup booked.</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-body-l">
            We collect from {address.trim()} on {pickupDay.label} at {formatHour(pickupHour!)}, and bring it
            back on {dropoffDay.label} at {formatHour(dropoffHour!)}.
          </p>
          {total !== null ? (
            <p className="text-neutral-800">
              Your estimate is {kes(total)} for {weight} kg. We weigh your laundry at your door, and you pay
              any balance on delivery.
            </p>
          ) : (
            <p className="text-neutral-800">We count your items at pickup and confirm the price before we charge you.</p>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button size="md" className="w-full" />}>
            <span className="flex-1">Done</span>
          </DialogClose>
          {IS_PROTOTYPE && (
            <p className="text-small text-accent-700">
              Prototype: no order was placed and no M-Pesa request was sent.
            </p>
          )}
        </DialogFooter>
      </>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DialogHeader>
        <p className="eyebrow">Book a pickup</p>
        <DialogTitle>Schedule a collection</DialogTitle>
        <DialogDescription>Choose a service and an exact time. We weigh your laundry at your door.</DialogDescription>
      </DialogHeader>

      <DialogBody className="gap-6">
        <fieldset className="flex flex-col gap-2">
          <legend className="label-caps mb-2">Service</legend>
          <ChipGroup variant="wide">
            {SERVICES.map((s) => (
              <Chip
                key={s.id}
                pressed={s.id === serviceId}
                onClick={() => setServiceId(s.id)}
                className="min-h-control-md items-start px-3 text-left text-sm"
              >
                {s.name}
              </Chip>
            ))}
          </ChipGroup>
        </fieldset>

        {perKg ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
            <div>
              <p className="font-bold">Estimated weight</p>
              <p className="text-small text-neutral-700">{kes(PRICE_PER_KG)} per kg · we weigh it at pickup</p>
            </div>
            <Stepper label="Estimated weight" value={weight} onChange={setWeight} />
          </div>
        ) : (
          <p className="rounded-2xl bg-surface px-4 py-3 text-small text-neutral-800">
            {service.name} is priced per item, from {kes(service.priceKes)}. We count your items at pickup and
            confirm the price before we charge you.
          </p>
        )}

        <fieldset className="flex flex-col gap-2">
          <legend className="label-caps mb-2">Pickup date</legend>
          <ChipGroup variant="day">
            {pickupDays.map((d) => (
              <DayChip
                key={d.key}
                weekday={d.weekday}
                dayOfMonth={d.dayOfMonth}
                aria-label={d.label}
                pressed={d.key === pickupDayKey}
                disabled={availableHours(d.date, now).size === 0}
                onClick={() => choosePickupDay(d.key)}
              />
            ))}
          </ChipGroup>
        </fieldset>

        <fieldset className="flex flex-col gap-2" aria-describedby={errors.pickupTime ? "pickup-time-error" : undefined}>
          <legend className="label-caps mb-2">
            Pickup time{" "}
            <span className="text-small font-normal tracking-normal normal-case text-neutral-700">
              · today needs {SAME_DAY_NOTICE_HOURS} hours&apos; notice
            </span>
          </legend>
          <ChipGroup>
            {SLOT_HOURS.map((h) => (
              <Chip
                key={h}
                pressed={h === pickupHour}
                disabled={!pickupHours.has(h)}
                onClick={() => setPickupHour(h)}
              >
                {formatHour(h)}
              </Chip>
            ))}
          </ChipGroup>
          {errors.pickupTime && <FieldError id="pickup-time-error">{errors.pickupTime}</FieldError>}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="label-caps mb-2">Drop-off date</legend>
          <ChipGroup variant="day">
            {dropoffDays.map((d) => (
              <DayChip
                key={d.key}
                weekday={d.weekday}
                dayOfMonth={d.dayOfMonth}
                aria-label={d.label}
                pressed={d.key === dropoffDay.key}
                onClick={() => setDropoffDayKey(d.key)}
              />
            ))}
          </ChipGroup>
        </fieldset>

        <fieldset className="flex flex-col gap-2" aria-describedby={errors.dropoffTime ? "dropoff-time-error" : undefined}>
          <legend className="label-caps mb-2">Drop-off time</legend>
          <ChipGroup>
            {SLOT_HOURS.map((h) => (
              <Chip key={h} pressed={h === dropoffHour} onClick={() => setDropoffHour(h)}>
                {formatHour(h)}
              </Chip>
            ))}
          </ChipGroup>
          {errors.dropoffTime && <FieldError id="dropoff-time-error">{errors.dropoffTime}</FieldError>}
        </fieldset>

        <Field>
          <Label htmlFor="booking-address">Pickup address</Label>
          <Input
            id="booking-address"
            autoComplete="street-address"
            placeholder="Ngong Road, Kilimani"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-invalid={!!errors.address || undefined}
            aria-describedby={errors.address ? "booking-address-error" : undefined}
          />
          {errors.address && <FieldError id="booking-address-error">{errors.address}</FieldError>}
        </Field>

        <Field>
          <Label htmlFor="booking-phone">M-Pesa number</Label>
          <Input
            id="booking-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="0712 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? "booking-phone-error" : "booking-phone-hint"}
          />
          {errors.phone ? (
            <FieldError id="booking-phone-error">{errors.phone}</FieldError>
          ) : (
            <p id="booking-phone-hint" className="text-small text-neutral-700">
              We send the STK push to this number.
            </p>
          )}
        </Field>
      </DialogBody>

      <DialogFooter>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-neutral-800">
            {total !== null ? `Estimate · ${weight} kg × ${kes(PRICE_PER_KG)}` : `${service.name} · per item`}
          </span>
          <span className="text-h4">{total !== null ? kes(total) : `from ${kes(service.priceKes)}`}</span>
        </div>
        {errors.submit && <FieldError>{errors.submit}</FieldError>}
        <Button type="submit" size="md" className="mt-2 w-full" disabled={status === "sending"}>
          <span className="flex-1">
            {status === "sending"
              ? "Booking…"
              : total !== null
                ? `Book and pay ${kes(total)}`
                : "Book pickup"}
          </span>
          <ArrowRight />
        </Button>
        {IS_PROTOTYPE && <p className="text-small text-accent-700">{PROTOTYPE_NOTE}</p>}
      </DialogFooter>
    </form>
  )
}
