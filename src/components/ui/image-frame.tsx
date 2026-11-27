import Image from "next/image"
import { cn } from "@/lib/utils"

/*
 * ImageFrame: a rounded photo slot. With `src` it shows the photograph in
 * colour, cropped to fill. Without one it shows a fabric fill (see the
 * `fabric-*` utilities in globals.css), so the layout reads as finished
 * before the photographs exist. Slots and the photos they want are listed
 * in src/lib/photos.ts.
 */
export type Fabric =
  | "towel"
  | "gingham"
  | "gingham-navy"
  | "denim"
  | "dots"
  | "twill"
  | "linen"
  | "sky"

const fabrics: Record<Fabric, string> = {
  towel: "fabric-towel",
  gingham: "fabric-gingham",
  "gingham-navy": "fabric-gingham-navy",
  denim: "fabric-denim",
  dots: "fabric-dots",
  twill: "fabric-twill",
  linen: "fabric-linen",
  sky: "fabric-sky",
}

export function ImageFrame({
  src,
  alt,
  fabric = "linen",
  sizes = "(min-width: 820px) 50vw, 100vw",
  eager = false,
  className,
  children,
}: {
  src?: string
  /** Say what is in the frame; "" for a decorative photo. */
  alt: string
  /** The fill shown until the photograph exists. */
  fabric?: Fabric
  sizes?: string
  eager?: boolean
  /** Size and shape come from here: aspect, rounding, absolute fill… */
  className?: string
  /** Overlays (chips, labels) drawn on top of the photo. */
  children?: React.ReactNode
}) {
  return (
    <div className={cn("relative overflow-hidden", !src && fabrics[fabric], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover"
        />
      ) : (
        alt && <span role="img" aria-label={alt} className="absolute inset-0" />
      )}
      {children}
    </div>
  )
}
