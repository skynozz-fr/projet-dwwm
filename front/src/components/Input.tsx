import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Input as InputBase } from "@/components/ui/input"

type InputProps = {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
}

export const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "",
  type = "text",
  className = ""
}: InputProps) => {
  const id = useId()
  
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <InputBase
        id={id} 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}