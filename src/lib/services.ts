/*
 * Services and prices shown on the landing page and in the booking dialog.
 * Copy and prices come from the Laundry Hub design system (GridCell preview).
 * Ratings are deliberately left out: the old 4.8 figure was made up.
 */
export type ServiceId = "wash-fold" | "dry-cleaning" | "blankets-duvets"

export type Service = {
  id: ServiceId
  name: string
  basis: "Per kg" | "Per item"
  /** Price in KES: per kg for Wash & Fold, the starting price per item otherwise. */
  priceKes: number
  description: string
}

export const SERVICES: readonly Service[] = [
  {
    id: "wash-fold",
    name: "Wash & Fold",
    basis: "Per kg",
    priceKes: 80,
    description:
      "For everyday laundry, bedsheets and towels. Washed at 30°C, tumble-dried and folded.",
  },
  {
    id: "dry-cleaning",
    name: "Dry Cleaning",
    basis: "Per item",
    priceKes: 100,
    description:
      "Professional care for suits, dresses and silk, with eco-friendly solvents.",
  },
  {
    id: "blankets-duvets",
    name: "Blankets & Duvets",
    basis: "Per item",
    priceKes: 500,
    description: "Deep cleaning for down, feather and synthetic duvets.",
  },
]

export const PRICE_PER_KG = 80

/** "KES 480": code, space, amount, thousands grouped. */
export function kes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`
}

/** "KES 80 per kg" or "from KES 100", as prose. */
export function priceLabel(service: Service) {
  return service.basis === "Per kg"
    ? `${kes(service.priceKes)} per kg`
    : `from ${kes(service.priceKes)}`
}

export function getService(id: ServiceId) {
  return SERVICES.find((s) => s.id === id) ?? SERVICES[0]
}
