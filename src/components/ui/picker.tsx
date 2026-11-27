"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * Picker: chips for day, time and service, and a whole-kilogram stepper.
 * One pressed chip per group. Selected = navy fill + Floral White label,
 * never Sky Blue (Sky Blue is the action). Unavailable = disabled and struck
 * through. Nothing is shorter than 40px.
 */

function ChipGroup({
  className,
  variant = "time",
  ...props
}: React.ComponentProps<"div"> & { variant?: "time" | "day" | "wide" }) {
  return (
    <div
      role="group"
      data-slot="chip-group"
      className={cn(
        "grid gap-2",
        variant === "time" && "grid-cols-[repeat(auto-fill,minmax(84px,1fr))]",
        variant === "day" && "grid-cols-[repeat(auto-fill,minmax(64px,1fr))]",
        variant === "wide" && "grid-cols-1 sm:grid-cols-3",
        className
      )}
      {...props}
    />
  )
}

function Chip({
  className,
  pressed,
  ...props
}: Omit<React.ComponentProps<"button">, "aria-pressed"> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-slot="chip"
      className={cn(
        "flex min-h-control-sm cursor-pointer flex-col items-center justify-center gap-px rounded-full border border-control-border bg-white px-3.5 text-xs leading-[1.1] font-bold text-ink transition-colors duration-120 ease-linear",
        "hover:not-disabled:not-aria-pressed:border-ink",
        "aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg",
        "disabled:cursor-not-allowed disabled:line-through disabled:opacity-45",
        className
      )}
      {...props}
    />
  )
}

/* Day chip: weekday over a bold date, 56px square. */
function DayChip({
  weekday,
  dayOfMonth,
  className,
  ...props
}: React.ComponentProps<typeof Chip> & { weekday: string; dayOfMonth: number }) {
  return (
    <Chip className={cn("min-h-14 min-w-14 rounded-2xl", className)} {...props}>
      <span>{weekday}</span>
      <b className="text-[17px] leading-none font-extrabold">{dayOfMonth}</b>
    </Chip>
  )
}

function Stepper({
  value,
  onChange,
  min = 1,
  max = 50,
  unit = "kg",
  label,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  unit?: string
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-grid h-control-sm grid-cols-[40px_60px_40px] overflow-hidden rounded-full border border-ink"
    >
      <button
        type="button"
        aria-label={`Less (${unit})`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="cursor-pointer text-lg leading-none text-ink transition-colors duration-120 ease-linear hover:not-disabled:bg-ink/7 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {"−"}
      </button>
      <output
        aria-live="polite"
        className="flex items-center justify-center bg-ink font-extrabold text-bg"
      >
        {value} {unit}
      </output>
      <button
        type="button"
        aria-label={`More (${unit})`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="cursor-pointer text-lg leading-none text-ink transition-colors duration-120 ease-linear hover:not-disabled:bg-ink/7 disabled:cursor-not-allowed disabled:opacity-45"
      >
        +
      </button>
    </div>
  )
}

export { Chip, ChipGroup, DayChip, Stepper }
