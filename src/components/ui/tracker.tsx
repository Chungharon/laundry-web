import { cn } from "@/lib/utils"

/*
 * Order tracker: six steps as round markers, the current step named in a
 * Sky panel above. Done = filled navy dot, now = Steel dot with a halo,
 * pending = Slate outline. The label always carries the state too.
 */
export const TRACKER_STEPS = [
  "Scheduled",
  "Picked up",
  "Weighed",
  "Cleaning",
  "Out for delivery",
  "Delivered",
] as const

export function Tracker({
  current,
  detail,
  stepNotes = {},
  summary,
  className,
}: {
  /** Index of the current step, 0–5. */
  current: number
  /** One sentence on what is happening now. */
  detail: string
  /** Extra text after a step's name, e.g. { 2: "5.5 kg" }. */
  stepNotes?: Partial<Record<number, string>>
  summary?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-3xl bg-white text-ink", className)}>
      <div className="m-2 flex flex-col gap-1.5 rounded-2xl bg-accent px-5 py-4 text-ink">
        <span className="label-caps font-semibold">
          Now · step {current + 1} of {TRACKER_STEPS.length}
        </span>
        <span className="text-2xl leading-[1.1] font-semibold tracking-[-0.02em]">{TRACKER_STEPS[current]}</span>
        <span className="text-small">{detail}</span>
      </div>
      {summary && <div className="mx-2 rounded-2xl bg-surface px-4 py-3 text-xs">{summary}</div>}
      <ol className="px-6 pt-5 pb-2">
        {TRACKER_STEPS.map((step, i) => {
          const state = i < current ? "done" : i === current ? "now" : "pending"
          return (
            <li
              key={step}
              className={cn(
                "grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-3.5 font-semibold",
                state === "pending" && "text-neutral-700",
                state === "now" && "font-bold text-ink"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 size-4 rounded-full border-2 transition-colors duration-200 ease-linear",
                  state === "done" && "border-ink bg-ink",
                  state === "now" && "border-steel bg-steel ring-4 ring-accent-200",
                  state === "pending" && "border-control-border"
                )}
              />
              <span>
                {step}
                {stepNotes[i] && ` · ${stepNotes[i]}`}
                <span className="sr-only">
                  {state === "done" ? " (done)" : state === "now" ? " (current step)" : " (to come)"}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
