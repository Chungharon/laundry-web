import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

/*
 * 44px tall pill, 16px text (smaller makes iOS Safari zoom on focus), white fill,
 * hairline Slate edge that darkens to navy on hover and focus. Errors: set
 * aria-invalid and link a <FieldError> with aria-describedby.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-control-md w-full min-w-0 rounded-full border border-control-border bg-white px-5 font-body text-base leading-[1.2] text-ink caret-steel transition-colors placeholder:text-neutral-700 hover:border-ink focus-visible:border-ink focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-danger file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-small file:font-bold file:text-ink",
        className
      )}
      {...props}
    />
  )
}

export { Input }
