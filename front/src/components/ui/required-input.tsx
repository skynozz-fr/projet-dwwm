import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RequiredInputProps {
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
  icon 
}: RequiredInputProps) => {
  const id = useId()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">
        {label} <span className="text-error">*</span>
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
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
