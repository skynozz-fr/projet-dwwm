import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface InputProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
}

export default function InputComponent({ 
  label, 
  value, 
  onChange, 
  placeholder = "",
  type = "text",
  className = "" 
}: InputProps) {
  const id = useId()
  
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}
