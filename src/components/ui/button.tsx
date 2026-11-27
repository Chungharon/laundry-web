import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * Laundry Hub button: a pill. Forward actions end in an arrow-right.
 *
 * - default (primary): navy fill, Floral White label (14.5:1).
 * - accent: Sky Blue fill, navy label (8.67:1). Never a white label on Sky.
 * - white: white fill, navy label, for use on Sky or photo cards.
 * - secondary / outline: hairline edge that darkens to navy on hover.
 * - ghost: inline text action.
 * - inverse / outline-inverse: the primary and secondary inside a Sky field.
 * Nothing is shorter than 40px.
 */
const buttonCva = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-transparent font-heading text-[15px] leading-[1.2] font-semibold whitespace-nowrap no-underline transition-[background-color,border-color,color,transform] duration-150 ease-out select-none active:not-disabled:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: "bg-ink text-bg hover:not-disabled:bg-neutral-800 hover:text-bg",
        accent: "bg-accent text-ink hover:not-disabled:bg-accent-400 hover:text-ink",
        white: "bg-white text-ink hover:not-disabled:bg-bg hover:text-ink",
        secondary:
          "border-ink/20 bg-transparent text-ink hover:not-disabled:border-ink hover:text-ink aria-expanded:border-ink",
        outline:
          "border-ink/20 bg-transparent text-ink hover:not-disabled:border-ink hover:text-ink aria-expanded:border-ink",
        ghost: "px-2 text-ink hover:not-disabled:bg-ink/6 hover:text-ink",
        inverse: "bg-ink text-bg hover:not-disabled:bg-neutral-800 hover:text-bg",
        "outline-inverse": "border-ink bg-transparent text-ink hover:not-disabled:bg-ink/8 hover:text-ink",
        destructive: "border-danger bg-transparent text-danger hover:not-disabled:bg-danger/7",
        link: "h-auto min-h-0 border-0 px-0 text-accent-700 underline underline-offset-3 hover:text-accent-800",
      },
      size: {
        default: "min-h-control-sm px-4",
        md: "min-h-control-lg px-5",
        lg: "min-h-control-xl px-6 text-base",
        icon: "size-control-sm px-0 [&_svg:not([class*='size-'])]:size-icon-md",
      },
    },
    compoundVariants: [{ variant: "link", className: "min-h-0 px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Merged class string for a button look, for elements that aren't <Button>
 * (links, BookingButton). Merging matters: base and variant classes overlap
 * (border colour, min-height, padding), and unmerged the wrong one can win.
 */
function buttonVariants({
  className,
  ...variants
}: VariantProps<typeof buttonCva> & { className?: string } = {}) {
  return cn(buttonCva(variants), className)
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonCva>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonCva({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
