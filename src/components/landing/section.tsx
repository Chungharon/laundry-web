import * as React from "react"
import { cn } from "@/lib/utils"

/* A page section inside the sheet: side gutter and fluid vertical padding, no rules. */
export function Section({
  id,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { id: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-4 px-(--gutter) py-(--section-pad)", className)}
      {...props}
    >
      {children}
    </section>
  )
}

/*
 * Heading row: tag + title on the left, a short note on the right that
 * drops underneath on narrow screens.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  note,
  className,
}: {
  id: string
  eyebrow?: string
  title: string
  note?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn("mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4", className)}>
      <div className="flex flex-col gap-4">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="max-w-[16em] text-h2">
          {title}
        </h2>
      </div>
      {note && <p className="max-w-[22em] text-small text-neutral-700 sm:text-right">{note}</p>}
    </header>
  )
}
