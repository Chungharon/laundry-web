import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "@/lib/utils"

/*
 * The FAQ list: white rounded rows that tint Sky when open, text glyphs
 * + and − (never chevrons, never an x). Questions end in "?"; answers
 * lead with the fact and stay under 44em. Height animates over 240ms and is
 * skipped under prefers-reduced-motion (see globals.css).
 */
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("rounded-3xl bg-white px-6 transition-colors data-open:bg-accent-100", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 cursor-pointer items-center justify-between gap-4 py-5 text-left text-lg leading-[1.3] font-semibold text-ink aria-disabled:pointer-events-none aria-disabled:opacity-45",
          className
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="shrink-0 text-2xl leading-none font-normal group-aria-expanded/accordion-trigger:hidden"
        >
          +
        </span>
        <span
          aria-hidden
          className="hidden shrink-0 text-2xl leading-none font-normal group-aria-expanded/accordion-trigger:inline"
        >
          {"−"}
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden duration-240 data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) max-w-[44em] pt-0 pb-5 text-body text-neutral-800 data-ending-style:h-0 data-starting-style:h-0 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
