import { ClockIcon } from "lucide-react"
import { Label } from "react-aria-components"
import type { TimeValue } from "react-aria-components"

import { DateInput, TimeField } from "@/components/ui/datefield-rac"

interface TimeInputProps {
  label: string
  value?: TimeValue
  onChange?: (value: TimeValue | undefined) => void
  className?: string
}

export default function TimeInputComponent({ 
  label, 
  value, 
  onChange,
  className = "" 
}: TimeInputProps) {
  return (
    <TimeField 
      className={`*:not-first:mt-2 ${className}`}
      value={value}
      onChange={(value) => onChange?.(value || undefined)}
    >
      <Label className="text-foreground text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <DateInput />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3">
          <ClockIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </TimeField>
  )
}
