import * as React from "react"

import { cn } from "@/lib/utils"

function TextareaBase({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
TextareaBase.displayName = "TextareaBase"

export { TextareaBase }
