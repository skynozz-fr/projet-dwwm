import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TextareaProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export default function TextareaComponent({ 
  label, 
  value, 
  onChange, 
  placeholder = "Tapez votre texte ici...", 
  rows = 3,
  className = "" 
}: TextareaProps) {
  const id = useId()
  
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea 
        id={id} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
      />
    </div>
  )
}
