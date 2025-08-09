import { useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CheckboxProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export default function CheckboxComponent({ 
  label, 
  checked, 
  onChange, 
  className = "" 
}: CheckboxProps) {
  const id = useId()
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
