/*
 * Photo slots on the landing page. Each one shows a fabric fill until you
 * drop a photograph into /public/photos and set `src` here, e.g.
 *   src: "/photos/folded-stack.avif"
 * Colour photos are fine. Shoot real Nairobi subjects in daylight; serve
 * AVIF or WebP around 1600px on the long side.
 */
import type { Fabric } from "@/components/ui/image-frame"

type Slot = { src?: string; alt: string; fabric: Fabric }

export const PHOTOS = {
  // Statement swatches (small circles, decorative)
  swatchTowels: { alt: "", fabric: "towel" },
  swatchShirts: { alt: "", fabric: "gingham" },
  swatchDenim: { alt: "", fabric: "denim" },
  swatchDots: { alt: "", fabric: "dots" },

  // Word strip
  stripRelax: { alt: "", fabric: "denim" },
  stripFold: { alt: "", fabric: "gingham-navy" },

  // Prices table: shown beside a row on hover
  priceWashFold: { alt: "Folded everyday laundry", fabric: "towel" },
  priceDryCleaning: { alt: "A suit on a hanger", fabric: "twill" },
  priceDuvets: { alt: "A folded duvet", fabric: "gingham" },

  // How it works: tall cards
  stepBook: { alt: "Paying with M-Pesa on a phone", fabric: "denim" },
  stepWeigh: { alt: "A rider weighing a laundry bag at a door", fabric: "twill" },
  stepWash: { alt: "Laundry in a washing machine", fabric: "dots" },
  stepReturn: { alt: "Folded laundry handed back at the door", fabric: "gingham-navy" },

  // Weight guide
  weightGuide: { alt: "6 kg of laundry on a scale", fabric: "gingham" },
} satisfies Record<string, Slot>
