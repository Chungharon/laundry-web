import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * Field = Label + Input + an optional hint or error, stacked 6px apart.
 *
 *   <Field>
 *     <Label htmlFor="phone">M-Pesa number</Label>
 *     <Input id="phone" inputMode="numeric" placeholder="712 345 678"
 *            aria-invalid={!!error} aria-describedby="phone-msg" />
 *     {error
 *       ? <FieldError id="phone-msg">Enter a 10-digit M-Pesa number.</FieldError>
 *       : <FieldHint id="phone-msg">We send the STK push here.</FieldHint>}
 *   </Field>
 */
function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function FieldHint({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-hint"
      className={cn("text-small text-neutral-700", className)}
      {...props}
    />
  )
}

/* Errors say what to do, lead with the x icon, and never rely on colour alone. */
function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn(
        "flex items-start gap-1.5 text-small font-semibold text-danger",
        className
      )}
      {...props}
    >
      <XIcon aria-hidden className="mt-0.5 size-icon-sm shrink-0" strokeWidth={2.5} />
      <span>{children}</span>
    </p>
  )
}

export { Field, FieldHint, FieldError }
