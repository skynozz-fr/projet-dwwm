import { useId } from "react"

import { Label } from "@/components/ui/label"
import { SelectNative } from "@/components/ui/select-native"

type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  placeholderSelectable?: boolean
  className?: string
  required?: boolean
}

export const Select = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Sélectionnez une option",
  placeholderSelectable = false,
  className = "",
  required = false
}: SelectProps) =>{
  const id = useId()
  
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-error">*</span>}
        </Label>
      )}
      <SelectNative 
        id={id} 
        value={value ?? ""} 
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        aria-required={required}
      >
        {placeholder && (
          <option 
            value="" 
            disabled={!placeholderSelectable}
            hidden={!placeholderSelectable}
          >
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectNative>
    </div>
  )
}
