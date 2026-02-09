import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RequiredInputProps = {
  label: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  icon?: React.ReactNode
}

export const RequiredInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  icon,
}: RequiredInputProps) => {
  const id = useId()

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm text-foreground/90">
        {label} <span className="text-error">*</span>
      </Label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={icon ? "pl-10" : className}
          required
        />
      </div>
    </div>
  )
}
