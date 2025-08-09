import { useId } from "react"

import { Label } from "@/components/ui/label"
import { SelectNative } from "@/components/ui/select-native"

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Sélectionnez une option",
  className = "" 
}: SelectProps) {
  const id = useId()
  
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <SelectNative 
        id={id} 
        value={value} 
        onChange={(e) => onChange?.(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectNative>
    </div>
  )
}
