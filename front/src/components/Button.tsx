import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

const baseStyles = `
  inline-flex items-center justify-center rounded-md font-medium 
  transition-all duration-200 focus:outline-none focus-visible:ring-2 
  focus-visible:ring-ring focus-visible:ring-offset-2 
  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
  hover:shadow-lg hover:scale-105 active:scale-95
`

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary",
  info: "bg-info text-info-foreground hover:bg-info",
  success: "bg-success text-success-foreground hover:bg-success",
  warning: "bg-warning text-warning-foreground hover:bg-warning",
  danger: "bg-error text-error-foreground hover:bg-error",
  ghost: "bg-ghost text-ghost-foreground hover:bg-ghost",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2 py-1 text-xs h-7",
  md: "px-3 py-1.5 text-sm h-8",
  lg: "px-6 py-3 text-lg h-12",
}

export const Button = ({ className, variant = "primary", size = "md", ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        baseStyles,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}