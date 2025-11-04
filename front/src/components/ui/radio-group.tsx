import { Radio as RadioPrimitive } from "@base-ui-components/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui-components/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-input bg-background transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-primary",
        "data-[checked]:border-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className="flex size-full items-center justify-center"
      >
        <div className="size-2 rounded-full bg-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, Radio, Radio as RadioGroupItem }
