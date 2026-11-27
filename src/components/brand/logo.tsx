import Image from "next/image"
import { cn } from "@/lib/utils"

/*
 * The Laundry Hub logo, always from the supplied outlined SVGs in
 * /public/brand. Never retype the name in live text beside the tile.
 *
 * - "lockup": light grounds (bg, surface, white)
 * - "on-ink": navy grounds (footer, `on-ink` fields)
 * - "mark":   the tile alone, where the wordmark can't fit (min 24px)
 *
 * Never place any of them on a Sky Blue field: the tile disappears.
 * Size by `height` (tile edge in px, default 36, minimum 24); the lockup scales whole.
 * The caller provides clear space of half the tile on every side.
 */
const files = {
  lockup: { src: "/brand/laundry-hub-lockup.svg", ratio: 649.13 / 144 },
  "on-ink": { src: "/brand/laundry-hub-lockup-on-ink.svg", ratio: 649.13 / 144 },
  mark: { src: "/brand/laundry-hub-mark.svg", ratio: 1 },
} as const

type LogoProps = {
  variant?: keyof typeof files
  height?: number
  /** Above the fold (the header): load eagerly. */
  eager?: boolean
  className?: string
}

function Logo({ variant = "lockup", height = 36, eager, className }: LogoProps) {
  const { src, ratio } = files[variant]
  const h = Math.max(24, height)
  return (
    <Image
      src={src}
      alt="Laundry Hub"
      width={Math.round(h * ratio)}
      height={h}
      loading={eager ? "eager" : "lazy"}
      className={cn("block h-auto max-w-none", className)}
      style={{ height: h, width: "auto" }}
    />
  )
}

export { Logo }
