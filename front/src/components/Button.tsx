import type { ButtonHTMLAttributes } from "react"

import { Button as UIButton } from "@/components/ui/button"

type LegacyVariant = "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "ghost"
type LegacySize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: LegacyVariant
  size?: LegacySize
}

const variantMap: Record<LegacyVariant, "default" | "secondary" | "outline" | "ghost" | "destructive"> = {
  primary: "default",
  secondary: "secondary",
  info: "outline",
  success: "outline",
  warning: "outline",
  danger: "destructive",
  ghost: "ghost",
}

const sizeMap: Record<LegacySize, "sm" | "default" | "lg"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
}

// Temporary wrapper for legacy imports.
export const Button = ({ variant = "primary", size = "md", ...props }: ButtonProps) => {
  return <UIButton variant={variantMap[variant]} size={sizeMap[size]} {...props} />
}
